/* Acer Atlas account-data R2 routes — compatible with Worker acer-cultivar v0.4.1; publish as v0.4.2.

Integration with the current Worker:
- Keep verifyFirebaseUser(request), handleAccountRequest(), photo routes and AI routes unchanged.
- After integrating, change WORKER_VERSION from "0.4.1" to "0.4.2".
- Insert the helper constants/functions at top level, before handleAccountRequest().
- Inside handleAccountRequest(), insert the route block immediately AFTER the existing
  GET /account/usage route and BEFORE the photoMatch route.
- The existing handler already verifies Firebase and returns { uid }; use user.uid.
- No new Firebase verifier is required.

R2 keys:
  users/{firebaseUid}/data/{collection|wishlist|seedlings}.json

GET returns revision 0 and data:null when no cloud file exists.
PUT requires baseRevision from the most recent GET. Conditional R2 writes reject
simultaneous edits instead of silently overwriting another device.
*/

const ATLAS_DATASETS = new Set(["collection", "wishlist", "seedlings"]);
const ATLAS_DATA_MAX_BYTES = 20 * 1024 * 1024;

function atlasDataKey(uid, dataset) {
  return "users/" + uid + "/data/" + dataset + ".json";
}

function atlasDataError(message, status = 400, extra = {}) {
  return response({ success: false, error: message, ...extra }, status);
}

/* INSERT THIS ROUTE BLOCK INSIDE handleAccountRequest(), after /account/usage. */
async function handleAtlasAccountDataRequest(request, env, url, user) {
  if (!env.ATLAS_R2) return atlasDataError("R2-binding ATLAS_R2 ontbreekt.", 503);

  const match = url.pathname.match(/^\/account\/data\/(collection|wishlist|seedlings)$/);
  if (!match || !ATLAS_DATASETS.has(match[1])) {
    return atlasDataError("Onbekende gegevensset.", 404);
  }

  const dataset = match[1];
  const key = atlasDataKey(user.uid, dataset);

  if (request.method === "GET") {
    const object = await env.ATLAS_R2.get(key);
    if (!object) {
      return response({ success: true, exists: false, dataset, revision: 0, data: null });
    }

    let payload;
    try {
      payload = await object.json();
    } catch (_) {
      return atlasDataError("Het opgeslagen gegevensbestand is geen geldige JSON.", 500);
    }

    if (!payload || payload.format !== "acer-atlas-account-data" ||
        payload.formatVersion !== 1 || payload.dataset !== dataset ||
        !Number.isSafeInteger(payload.revision) || payload.revision < 1 ||
        !Object.prototype.hasOwnProperty.call(payload, "data") ||
        !Array.isArray(payload.data)) {
      return atlasDataError("Het opgeslagen gegevensbestand heeft een ongeldig formaat.", 500);
    }

    return response({
      success: true,
      exists: true,
      dataset,
      revision: payload.revision,
      updatedAt: payload.updatedAt || null,
      data: payload.data
    });
  }

  if (request.method !== "PUT") {
    return atlasDataError("Methode niet toegestaan.", 405);
  }

  const declaredLength = Number(request.headers.get("Content-Length") || 0);
  if (declaredLength > ATLAS_DATA_MAX_BYTES) {
    return atlasDataError("Het gegevensbestand is groter dan 20 MB.", 413);
  }

  let incoming;
  try {
    incoming = await request.json();
  } catch (_) {
    return atlasDataError("Ongeldige JSON-inhoud.", 400);
  }

  if (!incoming || !Number.isSafeInteger(incoming.baseRevision) ||
      incoming.baseRevision < 0 || !Array.isArray(incoming.data)) {
    return atlasDataError("baseRevision en een gegevenslijst zijn verplicht.", 400);
  }

  const current = await env.ATLAS_R2.head(key);
  const currentRevision = Number(current?.customMetadata?.revision || 0);

  if (currentRevision !== incoming.baseRevision) {
    return atlasDataError(
      "Er staat inmiddels een nieuwere versie online. Haal eerst de nieuwste gegevens op.",
      409,
      { conflict: true, currentRevision }
    );
  }

  const nextRevision = currentRevision + 1;
  const updatedAt = new Date().toISOString();
  const payload = {
    format: "acer-atlas-account-data",
    formatVersion: 1,
    dataset,
    revision: nextRevision,
    updatedAt,
    data: incoming.data
  };
  const body = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(body);

  if (bytes.byteLength > ATLAS_DATA_MAX_BYTES) {
    return atlasDataError("Het gegevensbestand is groter dan 20 MB.", 413);
  }

  // Compare-and-swap: the object must still be the exact version read above.
  // For a first write, the key must still be absent.
  const onlyIf = current
    ? { etagMatches: current.etag }
    : { etagDoesNotMatch: "*" };

  const saved = await env.ATLAS_R2.put(key, bytes, {
    httpMetadata: { contentType: "application/json; charset=utf-8" },
    customMetadata: {
      ownerUid: user.uid,
      dataset,
      revision: String(nextRevision),
      updatedAt
    },
    onlyIf
  });

  if (!saved) {
    const latest = await env.ATLAS_R2.head(key);
    return atlasDataError(
      "De gegevens zijn op een ander apparaat gewijzigd. Haal de nieuwste versie op en probeer opnieuw.",
      409,
      { conflict: true, currentRevision: Number(latest?.customMetadata?.revision || 0) }
    );
  }

  return response({ success: true, dataset, revision: nextRevision, updatedAt, size: bytes.byteLength });
}

/* In handleAccountRequest(), after the usage route, add:
   if (url.pathname.startsWith("/account/data/")) {
     return handleAtlasAccountDataRequest(request, env, url, user);
   }
*/
