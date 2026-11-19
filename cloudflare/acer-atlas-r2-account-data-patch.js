/* Acer Atlas account-data R2 routes for Worker "acer-cultivar".

Prerequisites:
- Existing photo routes and verifyAcerFirebaseToken(request) are installed.
- env.ATLAS_R2 is bound to the existing R2 bucket.
- Existing response(data, status) and corsHeaders helpers are available.
- Add "GET, POST, PUT, DELETE, OPTIONS" to Access-Control-Allow-Methods if not already present.

Install:
1. Add the helper functions below beside the existing account/photo helpers.
2. Add the route block inside fetch(), immediately after:
     const url = new URL(request.url);
   and before the existing status route.
3. Keep all existing /account/photos/* routes unchanged.

Storage keys:
  users/{firebaseUid}/data/{collection|wishlist|seedlings}.json

The endpoint is account-scoped by the verified Firebase UID. A first write must use
baseRevision: 0. Every subsequent write must send the revision returned by GET.
R2 conditional writes prevent two devices from silently overwriting the same revision.
*/

const ATLAS_DATASETS = new Set(["collection", "wishlist", "seedlings"]);
const ATLAS_DATA_MAX_BYTES = 20 * 1024 * 1024;

function atlasDataKey(uid, dataset) {
  return `users/${uid}/data/${dataset}.json`;
}

function atlasDataError(message, status = 400, extra = {}) {
  return response({ success: false, error: message, ...extra }, status);
}

/* Add inside fetch(), after const url = new URL(request.url), before other routes. */
if (url.pathname.startsWith("/account/data/")) {
  if (!env.ATLAS_R2) return atlasDataError("R2-binding ATLAS_R2 ontbreekt.", 503);

  let account;
  try {
    account = await verifyAcerFirebaseToken(request);
  } catch (error) {
    return atlasDataError(error.message || "Firebase-authenticatie mislukt.", 401);
  }

  const match = url.pathname.match(/^\/account\/data\/(collection|wishlist|seedlings)$/);
  if (!match) return atlasDataError("Onbekende gegevensset.", 404);

  const dataset = match[1];
  const key = atlasDataKey(account.uid, dataset);

  if (request.method === "GET") {
    const object = await env.ATLAS_R2.get(key);
    if (!object) {
      return response({
        success: true,
        exists: false,
        dataset,
        revision: 0,
        data: null
      });
    }

    let payload;
    try {
      payload = await object.json();
    } catch (_) {
      return atlasDataError("Het opgeslagen gegevensbestand is ongeldig JSON.", 500);
    }

    if (!payload || payload.format !== "acer-atlas-account-data" ||
        payload.dataset !== dataset || !Number.isInteger(payload.revision) ||
        !Object.prototype.hasOwnProperty.call(payload, "data")) {
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

  if (request.method === "PUT") {
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

    if (!incoming || !Number.isInteger(incoming.baseRevision) ||
        incoming.baseRevision < 0 || !Object.prototype.hasOwnProperty.call(incoming, "data")) {
      return atlasDataError("baseRevision en data zijn verplicht.", 400);
    }

    if (dataset === "collection" && !Array.isArray(incoming.data)) {
      return atlasDataError("De collectie moet een lijst zijn.", 400);
    }
    if ((dataset === "wishlist" || dataset === "seedlings") && !Array.isArray(incoming.data)) {
      return atlasDataError("De gegevens moeten een lijst zijn.", 400);
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
    const payload = {
      format: "acer-atlas-account-data",
      formatVersion: 1,
      dataset,
      revision: nextRevision,
      updatedAt: new Date().toISOString(),
      data: incoming.data
    };
    const body = JSON.stringify(payload);
    const bytes = new TextEncoder().encode(body);
    if (bytes.byteLength > ATLAS_DATA_MAX_BYTES) {
      return atlasDataError("Het gegevensbestand is groter dan 20 MB.", 413);
    }

    // Atomic compare-and-swap against the R2 object version just read.
    const putOptions = {
      httpMetadata: { contentType: "application/json; charset=utf-8" },
      customMetadata: {
        ownerUid: account.uid,
        dataset,
        revision: String(nextRevision),
        updatedAt: payload.updatedAt
      },
      onlyIf: current
        ? { etagMatches: current.etag }
        : { etagDoesNotMatch: "*" }
    };
    const saved = await env.ATLAS_R2.put(key, bytes, putOptions);
    if (!saved) {
      const latest = await env.ATLAS_R2.head(key);
      return atlasDataError(
        "De gegevens zijn op een ander apparaat gewijzigd. Haal de nieuwste versie op en probeer opnieuw.",
        409,
        { conflict: true, currentRevision: Number(latest?.customMetadata?.revision || 0) }
      );
    }

    return response({
      success: true,
      dataset,
      revision: nextRevision,
      updatedAt: payload.updatedAt,
      size: bytes.byteLength
    });
  }

  return atlasDataError("Methode niet toegestaan.", 405);
}
