/* Acer Atlas R2 photo-storage patch for Worker acer-cultivar.
Keep the existing AI routes (/ , /usage and /process) unchanged.
1. Change Access-Control-Allow-Methods to "GET, POST, PUT, OPTIONS".
2. Add the helpers below immediately before export default.
3. Add the route block inside fetch(), immediately after const url = new URL(request.url);
   and BEFORE the existing GET "/" status route.
The route block uses the existing response(data,status) helper and corsHeaders.
*/

const FIREBASE_PROJECT_ID = "acer-atlas";
const FIREBASE_ISSUER = "https://securetoken.google.com/acer-atlas";
const FIREBASE_JWKS_URL = "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";
let firebaseJwksCache = null;
let firebaseJwksExpiresAt = 0;

function decodeBase64UrlJson(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
  return JSON.parse(atob(padded));
}

async function verifyAcerFirebaseToken(request) {
  const authorization = request.headers.get("Authorization") || "";
  if (!authorization.startsWith("Bearer ")) throw new Error("Firebase-login ontbreekt.");
  const token = authorization.slice(7).trim();
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Ongeldig Firebase-token.");

  const header = decodeBase64UrlJson(parts[0]);
  const claims = decodeBase64UrlJson(parts[1]);
  if (header.alg !== "RS256" || !header.kid) throw new Error("Niet-ondersteund Firebase-token.");

  const now = Math.floor(Date.now() / 1000);
  if (claims.aud !== FIREBASE_PROJECT_ID || claims.iss !== FIREBASE_ISSUER ||
      typeof claims.sub !== "string" || !claims.sub || claims.sub.length > 128 ||
      !Number.isFinite(claims.exp) || claims.exp <= now ||
      !Number.isFinite(claims.iat) || claims.iat > now + 60 ||
      claims.email_verified !== true) {
    throw new Error("Firebase-token is verlopen of niet geverifieerd.");
  }

  if (!firebaseJwksCache || Date.now() >= firebaseJwksExpiresAt) {
    const response = await fetch(FIREBASE_JWKS_URL, { signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error("Firebase-sleutels konden niet worden opgehaald.");
    firebaseJwksCache = await response.json();
    const cacheControl = response.headers.get("Cache-Control") || "";
    const maxAge = Number((cacheControl.match(/max-age=([0-9]+)/i) || [])[1] || 3600);
    firebaseJwksExpiresAt = Date.now() + Math.min(Math.max(maxAge, 60), 86400) * 1000;
  }

  const jwk = (firebaseJwksCache.keys || []).find(key => key.kid === header.kid && key.kty === "RSA");
  if (!jwk) {
    firebaseJwksExpiresAt = 0;
    throw new Error("Firebase-token sleutel is onbekend; probeer opnieuw in te loggen.");
  }

  const publicKey = await crypto.subtle.importKey(
    "jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]
  );
  const signatureText = parts[2].replace(/-/g, "+").replace(/_/g, "/");
  const signature = Uint8Array.from(atob(signatureText + "===".slice((signatureText.length + 3) % 4)), c => c.charCodeAt(0));
  const signedData = new TextEncoder().encode(parts[0] + "." + parts[1]);
  const valid = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", publicKey, signature, signedData);
  if (!valid) throw new Error("Firebase-token handtekening is ongeldig.");
  return { uid: claims.sub };
}

function accountError(message, status = 401) {
  return response({ success: false, error: message }, status);
}

/* PASTE THIS BLOCK INSIDE fetch(), AFTER const url = new URL(request.url); */
if (url.pathname.startsWith("/account/")) {
  if (!env.ATLAS_R2) return accountError("R2-binding ATLAS_R2 ontbreekt.", 503);
  let account;
  try {
    account = await verifyAcerFirebaseToken(request);
  } catch (error) {
    return accountError(error.message || "Firebase-authenticatie mislukt.", 401);
  }

  if (request.method === "GET" && url.pathname === "/account/usage") {
    return response({ success: true, storage: "R2", authenticated: true });
  }

  const photoMatch = url.pathname.match(new RegExp("^/account/photos/([A-Za-z0-9_-]{1,100})$"));
  if (request.method === "PUT" && photoMatch) {
    const photoId = photoMatch[1];
    const contentType = (request.headers.get("Content-Type") || "").split(";")[0].trim().toLowerCase();
    const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
    if (!allowedTypes.has(contentType)) return accountError("Alleen JPEG-, PNG-, WebP- en AVIF-foto's zijn toegestaan.", 415);

    const declaredLength = Number(request.headers.get("Content-Length") || 0);
    if (declaredLength > 8 * 1024 * 1024) return accountError("Foto is groter dan 8 MB.", 413);
    const body = await request.arrayBuffer();
    if (!body.byteLength) return accountError("De foto is leeg.", 400);
    if (body.byteLength > 8 * 1024 * 1024) return accountError("Foto is groter dan 8 MB.", 413);

    const key = `users/${account.uid}/photos/${photoId}`;
    await env.ATLAS_R2.put(key, body, {
      httpMetadata: { contentType },
      customMetadata: { ownerUid: account.uid, photoId, uploadedAt: new Date().toISOString() }
    });
    return response({ success: true, photoId, size: body.byteLength, contentType });
  }

  return accountError("Onbekend accountverzoek.", 404);
}

/* v0.4.1 R2 photo read/delete routes.
   Insert inside the existing fetch() after: const url = new URL(request.url);
   Keep the existing Firebase token verification helpers and response()/corsHeaders. */
if (url.pathname.startsWith("/account/")) {
  if (!env.ATLAS_R2) return accountError("R2-binding ATLAS_R2 ontbreekt.", 503);
  let account;
  try { account = await verifyAcerFirebaseToken(request); }
  catch (error) { return accountError(error.message || "Firebase-authenticatie mislukt.", 401); }

  if (request.method === "GET" && url.pathname === "/account/usage") {
    return response({ success: true, storage: "R2", authenticated: true });
  }

  const photoMatch = url.pathname.match(/^\/account\/photos\/([A-Za-z0-9_-]{1,100})$/);
  if (photoMatch && request.method === "GET") {
    const key = `users/${account.uid}/photos/${photoMatch[1]}`;
    const object = await env.ATLAS_R2.get(key);
    if (!object) return accountError("Foto niet gevonden.", 404);
    const headers = new Headers(corsHeaders);
    object.writeHttpMetadata(headers);
    headers.set("Cache-Control", "private, max-age=3600");
    headers.set("ETag", object.httpEtag);
    return new Response(object.body, { status: 200, headers });
  }

  if (photoMatch && request.method === "DELETE") {
    const key = `users/${account.uid}/photos/${photoMatch[1]}`;
    const object = await env.ATLAS_R2.head(key);
    if (!object) return response({ success: true, deleted: false, alreadyMissing: true });
    await env.ATLAS_R2.delete(key);
    return response({ success: true, deleted: true, photoId: photoMatch[1] });
  }

  /* Keep the existing PUT upload route here, unchanged. */
  return accountError("Onbekend accountverzoek.", 404);
}
