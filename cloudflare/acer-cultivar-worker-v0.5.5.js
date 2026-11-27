const corsHeaders = {

  "Access-Control-Allow-Origin": "https://aceratlas.github.io",

  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",

  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Atlas-Key",

  "Content-Type": "application/json; charset=utf-8",

  "Vary": "Origin"

};



const WORKER_VERSION = "0.5.9";

const AI_MODEL = "@cf/zai-org/glm-4.7-flash";



function response(data, status = 200) {

  return new Response(JSON.stringify(data), {

    status,

    headers: corsHeaders

  });

}



function cleanHtml(html) {

  return html

    .replace(/<script[\s\S]*?<\/script>/gi, " ")

    .replace(/<style[\s\S]*?<\/style>/gi, " ")

    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")

    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")

    .replace(/<!--[\s\S]*?-->/g, " ")

    .replace(/<(br|\/p|\/div|\/li|\/h[1-6]|\/tr)[^>]*>/gi, "\n")

    .replace(/<[^>]+>/g, " ")

    .replace(/&nbsp;/gi, " ")

    .replace(/&amp;/gi, "&")

    .replace(/&quot;/gi, '"')

    .replace(/&apos;|&#39;/gi, "'")

    .replace(/&lt;/gi, "<")

    .replace(/&gt;/gi, ">")

    .replace(/&#(\d+);/g, (_, n) =>

      String.fromCodePoint(Number(n))

    )

    .replace(/&#x([0-9a-f]+);/gi, (_, n) =>

      String.fromCodePoint(parseInt(n, 16))

    )

    .replace(/\s+/g, " ")

    .trim();

}



function safeUrl(value) {

  const url = new URL(value);



  if (!["http:", "https:"].includes(url.protocol)) {

    throw new Error("Alleen http- en https-links zijn toegestaan.");

  }



  const host = url.hostname.toLowerCase();



  if (

    url.username ||

    url.password ||

    host === "localhost" ||

    host.endsWith(".local") ||

    host.endsWith(".internal") ||

    host.endsWith(".localhost") ||

    /^\d{1,3}(\.\d{1,3}){3}$/.test(host) ||

    host.includes(":") ||

    host === "0.0.0.0"

  ) {

    throw new Error("Deze host is niet toegestaan.");

  }



  return url;

}



async function readSource(value) {

  const url = safeUrl(value);



  const res = await fetch(url.href, {

    headers: {

      "User-Agent": "AcerAtlasResearchBot/1.0",

      "Accept": "text/html,application/xhtml+xml"

    },

    redirect: "follow",

    signal: AbortSignal.timeout(12000)

  });



  if (!res.ok) {

    throw new Error(

      "Bron niet bereikbaar (" + res.status + "): " + url.hostname

    );

  }



  const finalUrl = safeUrl(res.url || url.href);

  const type = res.headers.get("content-type") || "";



  if (

    !type.includes("text/html") &&

    !type.includes("application/xhtml+xml")

  ) {

    throw new Error("Geen HTML-pagina: " + finalUrl.hostname);

  }



  const html = (await res.text()).slice(0, 1000000);



  const title = html.match(

    /<title[^>]*>([\s\S]*?)<\/title>/i

  );



  const text = cleanHtml(html).slice(0, 12000);



  return {

    url: finalUrl.href,

    title: title ? cleanHtml(title[1]) : finalUrl.hostname,

    text

  };

}



function getAiText(result) {

  if (typeof result === "string") {

    return result;

  }



  if (typeof result?.response === "string") {

    return result.response;

  }



  const content = result?.choices?.[0]?.message?.content;



  if (typeof content === "string" && content.trim()) {

    return content;

  }



  if (Array.isArray(content)) {

    const text = content

      .filter(item => item.type === "text")

      .map(item => item.text)

      .join("\n");



    if (text.trim()) {

      return text;

    }

  }



  throw new Error(

    "Cloudflare AI heeft geen tekstinhoud teruggegeven."

  );

}



function extractJson(value) {

  const cleaned = value

    .replace(/\`\`\`(?:json)?/gi, "")

    .trim();



  const start = cleaned.indexOf("{");

  const end = cleaned.lastIndexOf("}");



  if (start < 0 || end <= start) {

    throw new Error("AI gaf geen geldig JSON-voorstel terug.");

  }



  return JSON.parse(cleaned.slice(start, end + 1));

}



// Correctie van botanische tegenstrijdigheden*

function correctBotanicalData(data) {

  const species = String(data.species || "").toLowerCase();



  if (species === "acer palmatum") {

    if (typeof data.foliage === "string") {

      data.foliage = data.foliage

        .replace(/\bwintergroen\b/gi, "")

        .replace(/\s*,\s*,/g, ",")

        .replace(/^\s*,|,\s*$/g, "")

        .replace(/\s+/g, " ")

        .trim();



      if (!data.foliage) {

        data.foliage = "Bladverliezend";

      }

    }



    if (typeof data.traits?.nl === "string") {

      data.traits.nl = data.traits.nl.replace(

        /\bwintergroen\b/gi,

        "bladverliezend"

      );

    }



    if (typeof data.traits?.en === "string") {

      data.traits.en = data.traits.en.replace(

        /\bevergreen\b/gi,

        "deciduous"

      );

    }

  }



  return data;

}



// Vertaling van bekende groeivormen*

function normalizeGrowthHabit(value) {

  if (typeof value !== "string") return value;



  const key = value

    .toLowerCase()

    .normalize("NFD")

    .replace(/[\u0300-\u036f]/g, "")

    .trim();



  const translations = {

    "erige": "Opgaand",

    "upright": "Opgaand",

    "erect": "Opgaand",

    "etale": "Spreidend",

    "spreading": "Spreidend",

    "retombant": "Hangend",

    "weeping": "Treurend",

    "pleureur": "Treurend",

    "pendulous": "Hangend",

    "arrondi": "Rond",

    "rounded": "Rond",

    "buissonnant": "Bossig",

    "bushy": "Bossig",

    "compact": "Compact",

    "en boule": "Bolvormig",

    "mounding": "Koepelvormig",

    "columnar": "Zuilvormig"

  };



  return translations[key] || value;

}




// Multi-source cultivar research helpers (v0.5.1).
const SOURCE_CACHE_TTL = 86400;
const MAX_SOURCE_COUNT = 8;
const MAX_SOURCE_TEXT = 6500;

function decodeSearchHref(value, base = "https://html.duckduckgo.com") {
  try {
    const raw = String(value || "").replace(/&amp;/g, "&").trim();
    const parsed = new URL(raw, base);
    const redirected = parsed.searchParams.get("uddg") || parsed.searchParams.get("url");
    return safeUrl(redirected || parsed.href).href;
  } catch {
    return null;
  }
}

function extractSearchResults(html, provider, excludedHosts) {
  const found = [];
  const seen = new Set(excludedHosts);
  const add = (href, title, base) => {
    const decoded = decodeSearchHref(href, base);
    if (!decoded) return;
    try {
      const url = new URL(decoded);
      const host = url.hostname.toLowerCase().replace(/^www\./, "");
      if (!host || seen.has(host)) return;
      if (/duckduckgo|google\.|bing\.|facebook|instagram|pinterest|youtube|tiktok|ebay|amazon\./i.test(host)) return;
      if (!/\.(com|org|net|nl|be|de|uk|fr|eu|jp)$/i.test(host)) return;
      seen.add(host);
      found.push({ url: url.href, title: cleanHtml(title || "").slice(0, 180) || host });
    } catch { /* ignore malformed result */ }
  };

  if (provider === "bing-rss") {
    const items = html.match(/<item\b[\s\S]*?<\/item>/gi) || [];
    for (const item of items) {
      const link = item.match(/<link[^>]*>([\s\S]*?)<\/link>/i);
      const title = item.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      if (link) add(link[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim(), title?.[1] || "", "https://www.bing.com");
      if (found.length >= 10) break;
    }
    return found;
  }

  // Search engines change attribute order regularly. Parse href/class independently.
  const anchors = html.match(/<a\b[^>]*>[\s\S]*?<\/a>/gi) || [];
  for (const anchor of anchors) {
    const href = anchor.match(/\bhref\s*=\s*["']([^"']+)["']/i);
    if (!href) continue;
    const cls = anchor.match(/\bclass\s*=\s*["']([^"']+)["']/i)?.[1] || "";
    const text = anchor.replace(/^<a\b[^>]*>/i, "").replace(/<\/a>$/i, "");
    const looksLikeResult = provider === "duckduckgo"
      ? /result__a|result-link|result__url/i.test(cls)
      : /^(https?:)?\/\//i.test(href[1]);
    if (looksLikeResult) add(href[1], text, provider === "duckduckgo" ? "https://html.duckduckgo.com" : "https://www.google.com");
    if (found.length >= 10) break;
  }
  return found;
}

async function searchCultivarSources(query, excludedUrls = []) {
  const excludedHosts = new Set(excludedUrls.map(value => {
    try { return new URL(value).hostname.toLowerCase().replace(/^www\./, ""); } catch { return ""; }
  }).filter(Boolean));
  const providers = [
    { name: "duckduckgo", url: "https://html.duckduckgo.com/html/?q=" + encodeURIComponent(query), base: "https://html.duckduckgo.com" },
    { name: "bing-rss", url: "https://www.bing.com/search?format=rss&q=" + encodeURIComponent(query), base: "https://www.bing.com" }
  ];
  const all = [];
  const errors = [];
  for (const provider of providers) {
    try {
      const res = await fetch(provider.url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; AcerAtlasResearchBot/1.0)",
          "Accept": provider.name === "bing-rss" ? "application/rss+xml, application/xml, text/xml" : "text/html"
        },
        signal: AbortSignal.timeout(10000)
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const html = (await res.text()).slice(0, 450000);
      const results = extractSearchResults(html, provider.name, excludedHosts);
      for (const item of results) {
        if (!all.some(x => x.url === item.url)) all.push(item);
      }
      if (all.length >= 1) break;
    } catch (error) {
      errors.push(provider.name + ": " + (error.message || "zoekfout"));
    }
  }
  if (!all.length && errors.length) throw new Error(errors.join("; "));
  return all.slice(0, 8);
}

async function readSourceCached(value) {
  const url = safeUrl(value);
  const cache = caches.default;
  const cacheKey = new Request(url.href, { method: "GET" });
  try {
    const cached = await cache.match(cacheKey);
    if (cached) return await cached.json();
  } catch { /* cache is an optimization; source retrieval must still work */ }

  const source = await readSource(url.href);
  try {
    await cache.put(cacheKey, new Response(JSON.stringify(source), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=" + SOURCE_CACHE_TTL
      }
    }));
  } catch { /* cache may be unavailable for a particular URL */ }
  return source;
}

function sourcePriority(source) {
  const host = (() => {
    try { return new URL(source.url).hostname.toLowerCase().replace(/^www\./, ""); }
    catch { return ""; }
  })();
  const label = String(source.title || "").toLowerCase();

  // Fixed Acer Atlas source hierarchy: Esveld > MrMaple > Nielsen > Maple Nursery Belgium > others.
  if (host === "esveld.nl" || host.endsWith(".esveld.nl") || label.includes("esveld")) return 1;
  if (host === "mrmaple.com" || host.endsWith(".mrmaple.com") || label.includes("mrmaple")) return 2;
  if (host.includes("nielsen") || label.includes("baumschule nielsen")) return 3;
  if (host.includes("maple-nursery") || host.includes("maplenursery") || label.includes("maple nursery belgium")) return 4;
  return 5;
}

function orderSourcesByPriority(sources) {
  return [...sources].sort((a, b) =>
    sourcePriority(a) - sourcePriority(b) ||
    String(a.url).localeCompare(String(b.url))
  );
}

function buildCultivarPrompt(name, sources) {
  const sourceText = sources.map((source, index) =>
    "BRON " + (index + 1) +
    "\nURL: " + source.url +
    "\nPAGINATITEL: " + source.title +
    "\nINHOUD:\n" + String(source.text || "").slice(0, MAX_SOURCE_TEXT)
  ).join("\n\n");

  return `Je bent de gegevensredacteur van Acer Atlas, een encyclopedie over Japanse esdoorns.
Onderzoek uitsluitend de cultivar: ${name}.

Onderzoek de zes kenmerken afzonderlijk en gebruik alle aangeleverde bronpagina's:
1. Hoogte en breedte: neem de maat en context exact over (volwassen maat, na 10 jaar, jaarlijks, enz.).
2. Groeisnelheid en groeivorm: groeisnelheid alleen classificeren als langzaam, gemiddeld of snel wanneer de bron dit ondersteunt.
3. Introduceur: onderscheid ontdekker, selecteur, introduceur en kweker.
4. Introductiejaar: een prijsjaar of publicatiejaar is niet automatisch het introductiejaar.
5. Seizoenskenmerken: voorjaar, zomer, herfst en winter afzonderlijk.
6. Plantgroep: bijvoorbeeld dissectum, linearilobum, matsumurae of amoenum, uitsluitend wanneer onderbouwd.

Neem ook de klimaatzone op wanneer een betrouwbare bron die expliciet vermeldt. Gebruik geen aparte velden voor bodem of standplaats.

BRONREGELS:
- Gebruik uitsluitend informatie die in de aangeleverde bronpagina's staat.
- Vaste prioriteit bij dezelfde cultivar en hetzelfde kenmerk: 1. Esveld, 2. MrMaple, 3. Baumschule Nielsen, 4. Maple Nursery Belgium, 5. overige betrouwbare bronnen.
- Een bron met hogere prioriteit is leidend wanneer beide bronnen aantoonbaar hetzelfde kenmerk behandelen. Noteer relevante tegenstrijdigheden in conflicts.
- Ken ieder ingevuld kenmerk de precieze bron-URL toe in field_sources. Gebruik alleen URL's uit het bronmateriaal.
- Gebruik algemene informatie over Acer palmatum nooit als bewijs voor een specifieke cultivar.
- Verzin niets en vul ontbrekende gegevens niet aan vanuit algemene kennis.
- Laat een ontbrekend kenmerk volledig weg uit het JSON-object. Gebruik nooit "Onbekend", "Unknown", lege tekst of null als vervangende waarde.
- Gebruik Nederlands voor groeisnelheid en groeivorm; behoud bronmaten en eenheden.
- Houd de vier seizoenen strikt gescheiden.

Geef uitsluitend één geldig JSON-object terug. Gebruik alleen velden waarvoor bronbewijs bestaat. Mogelijke structuur:
{
  "name": "",
  "accepted_name": "",
  "species": "",
  "synonyms": [],
  "plant_group": "",
  "selector_or_introducer": "",
  "introduction_year": 0,
  "height": "",
  "width": "",
  "growth_rate": "langzaam | gemiddeld | snel",
  "growth_habit": "",
  "climate_zone": "",
  "seasons": {
    "spring": "",
    "summer": "",
    "autumn": "",
    "winter": ""
  },
  "field_sources": {},
  "conflicts": [],
  "sources": []
}

BRONMATERIAAL:
${sourceText}`;
}

async function runCultivarAi(env, name, sources) {
  const prompt = buildCultivarPrompt(name, sources);
  const result = await env.AI.run(AI_MODEL, {
    messages: [
      {
        role: "system",
        content: "Je bent de gegevensredacteur van Acer Atlas. Geef uitsluitend één geldig JSON-object terug. Geen Markdown, geen toelichting en geen denkuitvoer. Gebruik geen feiten buiten de bronpagina's."
      },
      { role: "user", content: prompt }
    ],
    max_completion_tokens: 4200,
    temperature: 0.1,
    chat_template_kwargs: { enable_thinking: false, clear_thinking: true },
    response_format: { type: "json_object" }
  });
  const data = extractJson(getAiText(result));
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("AI-resultaat is geen geldig JSON-object.");
  }
  return data;
}

function missingResearchFields(data) {
  const isMissing = value => value === undefined || value === null || value === "" || /^onbekend$|^unknown$/i.test(String(value).trim());
  const fields = [];
  const checks = {
    seasons: [data.seasons?.spring, data.seasons?.summer, data.seasons?.autumn, data.seasons?.winter],
    growth: [data.height, data.width, data.growth_rate, data.growth_habit],
    history: [data.selector_or_introducer, data.introduction_year],
    plant_group: [data.plant_group],
    climate_zone: [data.climate_zone]
  };
  for (const [group, values] of Object.entries(checks)) {
    if (values.some(isMissing)) fields.push(group);
  }
  return fields;
}

function validateFieldSources(data, sources) {
  const allowed = new Set(sources.map(source => source.url));
  const validated = {};
  for (const [field, raw] of Object.entries(data.field_sources || {})) {
    const values = Array.isArray(raw) ? raw : [raw];
    const valid = [...new Set(values.filter(value => typeof value === "string" && allowed.has(value)))];
    if (valid.length) validated[field] = valid.length === 1 ? valid[0] : valid;
  }
  data.field_sources = validated;
  data.sources = sources.map(source => ({ title: source.title, url: source.url }));
  return data;
}

// Firebase Authentication: verify ID tokens before accessing personal R2 objects.
const FIREBASE_PROJECT_ID = "acer-atlas";
const FIREBASE_ISSUER = "https://securetoken.google.com/acer-atlas";
const FIREBASE_JWKS_URL = "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";
let firebaseJwksCache = null;
let firebaseJwksExpiresAt = 0;

function decodeBase64UrlJson(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - normalized.length % 4) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

async function getFirebaseJwks() {
  if (firebaseJwksCache && Date.now() < firebaseJwksExpiresAt) {
    return firebaseJwksCache;
  }

  const jwksResponse = await fetch(FIREBASE_JWKS_URL, {
    signal: AbortSignal.timeout(10000)
  });
  if (!jwksResponse.ok) {
    throw new Error("Firebase-verificatiesleutels konden niet worden opgehaald.");
  }

  const jwks = await jwksResponse.json();
  const cacheControl = jwksResponse.headers.get("Cache-Control") || "";
  const maxAgeMatch = cacheControl.match(/max-age=(\d+)/i);
  const maxAge = maxAgeMatch ? Number(maxAgeMatch[1]) : 3600;

  firebaseJwksCache = jwks;
  firebaseJwksExpiresAt = Date.now() + Math.min(Math.max(maxAge, 60), 86400) * 1000;
  return jwks;
}

async function verifyFirebaseUser(request) {
  const authorization = request.headers.get("Authorization") || "";
  if (!authorization.startsWith("Bearer ")) {
    throw new Error("Je moet ingelogd zijn met een geverifieerd Acer Atlas-account.");
  }

  const token = authorization.slice(7).trim();
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Ongeldig Firebase-inlogtoken.");

  const header = decodeBase64UrlJson(parts[0]);
  const claims = decodeBase64UrlJson(parts[1]);

  if (header.alg !== "RS256" || !header.kid) {
    throw new Error("Onjuist type Firebase-inlogtoken.");
  }

  const now = Math.floor(Date.now() / 1000);
  if (
    claims.aud !== FIREBASE_PROJECT_ID ||
    claims.iss !== FIREBASE_ISSUER ||
    typeof claims.sub !== "string" ||
    !claims.sub ||
    claims.sub.length > 128 ||
    !Number.isFinite(claims.exp) ||
    claims.exp <= now ||
    !Number.isFinite(claims.iat) ||
    claims.iat > now + 60 ||
    claims.email_verified !== true
  ) {
    throw new Error("Firebase-token is verlopen of het e-mailadres is niet geverifieerd.");
  }

  const jwks = await getFirebaseJwks();
  const jwk = (jwks.keys || []).find(key => key.kid === header.kid && key.kty === "RSA");
  if (!jwk) {
    firebaseJwksExpiresAt = 0;
    throw new Error("Firebase-token sleutel niet gevonden. Log opnieuw in en probeer het nogmaals.");
  }

  const publicKey = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"]
  );

  const signatureText = parts[2].replace(/-/g, "+").replace(/_/g, "/");
  const signaturePadded = signatureText + "=".repeat((4 - signatureText.length % 4) % 4);
  const signatureBinary = atob(signaturePadded);
  const signature = Uint8Array.from(signatureBinary, char => char.charCodeAt(0));
  const signedData = new TextEncoder().encode(parts[0] + "." + parts[1]);

  const valid = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    publicKey,
    signature,
    signedData
  );
  if (!valid) throw new Error("Firebase-token handtekening is ongeldig.");

  return { uid: claims.sub };
}

function accountError(message, status = 401) {
  return response({ success: false, error: message }, status);
}


// Account datasets retained from Worker 0.4.3.
const ATLAS_DATASETS = new Set(["collection", "wishlist", "seedlings"]);
const ATLAS_DATA_MAX_BYTES = 20 * 1024 * 1024;

function atlasDataKey(uid, dataset) {
  return "users/" + uid + "/data/" + dataset + ".json";
}

async function handleAtlasAccountDataRequest(request, env, url, user) {
  const match = url.pathname.match(/^\/account\/data\/(collection|wishlist|seedlings)$/);
  if (!match || !ATLAS_DATASETS.has(match[1])) {
    return accountError("Onbekende dataset.", 404);
  }

  const dataset = match[1];
  const objectKey = atlasDataKey(user.uid, dataset);

  if (request.method === "GET") {
    const object = await env.ATLAS_R2.get(objectKey);
    if (!object) {
      return response({ success: true, exists: false, dataset, revision: 0, data: null });
    }
    let stored;
    try {
      stored = await object.json();
    } catch {
      return accountError("De opgeslagen accountgegevens zijn ongeldig.", 500);
    }
    return response({
      success: true,
      exists: true,
      dataset,
      revision: Number(object.customMetadata?.revision || stored.revision || 1),
      updatedAt: stored.savedAt || object.customMetadata?.savedAt || null,
      data: stored.data
    });
  }

  if (request.method !== "PUT") {
    return accountError("Methode niet toegestaan.", 405);
  }

  const declaredLength = Number(request.headers.get("Content-Length") || 0);
  if (declaredLength > ATLAS_DATA_MAX_BYTES) {
    return accountError("De dataset is groter dan 20 MB.", 413);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return accountError("Ongeldige JSON-inhoud.", 400);
  }

  if (!body || !Number.isInteger(body.baseRevision) || body.baseRevision < 0 || !Array.isArray(body.data)) {
    return accountError("Dataset of basisversie ontbreekt of is ongeldig.", 400);
  }

  const serialized = JSON.stringify({
    revision: body.baseRevision + 1,
    savedAt: new Date().toISOString(),
    data: body.data
  });
  const bytes = new TextEncoder().encode(serialized);
  if (bytes.byteLength > ATLAS_DATA_MAX_BYTES) {
    return accountError("De dataset is groter dan 20 MB.", 413);
  }

  const existing = await env.ATLAS_R2.head(objectKey);
  const currentRevision = existing ? Number(existing.customMetadata?.revision || 1) : 0;
  if (currentRevision !== body.baseRevision) {
    return response({
      success: false,
      conflict: true,
      dataset,
      revision: currentRevision,
      error: "De dataset is ondertussen op een ander apparaat gewijzigd."
    }, 409);
  }

  const putOptions = {
    httpMetadata: { contentType: "application/json; charset=utf-8" },
    customMetadata: {
      ownerUid: user.uid,
      dataset,
      revision: String(body.baseRevision + 1),
      savedAt: new Date().toISOString()
    },
    onlyIf: existing
      ? { etagMatches: existing.httpEtag.replace(/^"|"$/g, "") }
      : { etagDoesNotMatch: "*" }
  };

  const storedObject = await env.ATLAS_R2.put(objectKey, bytes, putOptions);
  if (!storedObject) {
    const latest = await env.ATLAS_R2.head(objectKey);
    return response({
      success: false,
      conflict: true,
      dataset,
      revision: Number(latest?.customMetadata?.revision || 1),
      error: "De dataset is gelijktijdig gewijzigd. Haal de nieuwste versie op."
    }, 409);
  }

  return response({ success: true, dataset, revision: body.baseRevision + 1, size: bytes.byteLength });
}

async function handleAccountRequest(request, env, url) {
  if (!env.ATLAS_R2) {
    return accountError("De R2-binding ATLAS_R2 ontbreekt in Cloudflare.", 503);
  }

  let user;
  try {
    user = await verifyFirebaseUser(request);
  } catch (error) {
    return accountError(error.message || "Firebase-authenticatie mislukt.", 401);
  }

  // The app calls this endpoint before uploading a photo.
  if (request.method === "GET" && url.pathname === "/account/usage") {
    return response({
      success: true,
      authenticated: true,
      storage: "R2",
      user_id: user.uid
    });
  }

  // Account datasets (collection, wishlist and seedlings) are UID-scoped in R2.
  if (url.pathname.startsWith("/account/data/")) {
    return handleAtlasAccountDataRequest(request, env, url, user);
  }

  const photoMatch = url.pathname.match(/^\/account\/photos\/([A-Za-z0-9_-]{1,100})$/);

  // Retrieve a photo belonging to the authenticated user.
  if (request.method === "GET" && photoMatch) {
    const photoId = photoMatch[1];
    const objectKey = "users/" + user.uid + "/photos/" + photoId;
    const object = await env.ATLAS_R2.get(objectKey);
    if (!object) return accountError("Foto niet gevonden.", 404);
    const headers = new Headers(corsHeaders);
    object.writeHttpMetadata(headers);
    headers.set("Cache-Control", "private, max-age=3600");
    if (object.httpEtag) headers.set("ETag", object.httpEtag);
    return new Response(object.body, { status: 200, headers });
  }

  // Delete only the authenticated user's own photo.
  if (request.method === "DELETE" && photoMatch) {
    const photoId = photoMatch[1];
    const objectKey = "users/" + user.uid + "/photos/" + photoId;
    const existingObject = await env.ATLAS_R2.head(objectKey);
    if (!existingObject) {
      return response({ success: true, deleted: false, alreadyMissing: true, photoId });
    }
    await env.ATLAS_R2.delete(objectKey);
    return response({ success: true, deleted: true, photoId });
  }

  // Store each photo under the authenticated user's own folder.
  if (request.method === "PUT" && photoMatch) {
    const photoId = photoMatch[1];
    const contentType = (request.headers.get("Content-Type") || "")
      .split(";")[0]
      .trim()
      .toLowerCase();

    const allowedTypes = new Set([
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif"
    ]);

    if (!allowedTypes.has(contentType)) {
      return accountError("Alleen JPEG-, PNG-, WebP- en AVIF-foto's zijn toegestaan.", 415);
    }

    const declaredLength = Number(request.headers.get("Content-Length") || 0);
    if (declaredLength > 8 * 1024 * 1024) {
      return accountError("De foto is groter dan 8 MB.", 413);
    }

    const photoBytes = await request.arrayBuffer();
    if (!photoBytes.byteLength) return accountError("De ontvangen foto is leeg.", 400);
    if (photoBytes.byteLength > 8 * 1024 * 1024) {
      return accountError("De foto is groter dan 8 MB.", 413);
    }

    const objectKey = "users/" + user.uid + "/photos/" + photoId;
    await env.ATLAS_R2.put(objectKey, photoBytes, {
      httpMetadata: { contentType },
      customMetadata: {
        ownerUid: user.uid,
        photoId,
        uploadedAt: new Date().toISOString()
      }
    });

    return response({
      success: true,
      photoId,
      size: photoBytes.byteLength,
      contentType
    });
  }

  return accountError("Onbekend accountverzoek.", 404);
}

export default {

  async fetch(request, env) {

    if (request.method === "OPTIONS") {

      return new Response(null, {

        status: 204,

        headers: corsHeaders

      });

    }



    const url = new URL(request.url);

    // Personal account endpoints (Firebase-authenticated, stored in R2).
    if (url.pathname.startsWith("/account/")) {
      return handleAccountRequest(request, env, url);
    }



    // Worker status controleren*

    if (request.method === "GET" && url.pathname === "/") {

      return response({

        success: true,

        service: "Acer Atlas Cultivar Worker",

        status: "online",

        version: WORKER_VERSION,

        endpoint: "/process",

        ai_model: AI_MODEL,

        ai_binding: !!env.AI,

        key_configured: !!env.ATLAS_WORKER_KEY

      });

    }



    // Dagelijks Workers AI-neuronverbruik ophalen (UTC-dag)*

    if (request.method === "GET" && url.pathname === "/usage") {

      const authorization = request.headers.get("Authorization") || "";

      const bearerKey = authorization.startsWith("Bearer ")

        ? authorization.slice(7).trim()

        : "";

      const suppliedKey =

        bearerKey ||

        request.headers.get("X-Atlas-Key") ||

        "";



      if (

        !env.ATLAS_WORKER_KEY ||

        suppliedKey !== env.ATLAS_WORKER_KEY

      ) {

        return response({

          success: false,

          error: "Ongeldige toegangscode."

        }, 401);

      }



      if (!env.CF_ACCOUNT_ID || !env.CF_ANALYTICS_TOKEN) {

        return response({

          success: false,

          error: "Cloudflare Analytics-instellingen ontbreken."

        }, 503);

      }



      try {

        const utcDate = new Date().toISOString().slice(0, 10);

        const query = `

          query AcerAtlasAiUsage($accountTag: string!, $usageDate: Date!) {

            viewer {

              accounts(filter: { accountTag: $accountTag }) {

                aiInferenceAdaptiveGroups(

                  limit: 10000

                  filter: { date: $usageDate }

                ) {

                  sum {

                    totalNeurons

                  }

                  confidence(level: 0.95) {

                    sum {

                      totalNeurons {

                        estimate

                        lower

                        upper

                        sampleSize

                      }

                    }

                  }

                }

              }

            }

          }

        `;



        const analyticsResponse = await fetch(

          "https://api.cloudflare.com/client/v4/graphql",

          {

            method: "POST",

            headers: {

              "Authorization": "Bearer " + env.CF_ANALYTICS_TOKEN,

              "Content-Type": "application/json"

            },

            body: JSON.stringify({

              query,

              variables: {

                accountTag: env.CF_ACCOUNT_ID,

                usageDate: utcDate

              }

            }),

            signal: AbortSignal.timeout(15000)

          }

        );



        const analyticsResult = await analyticsResponse.json();



        if (!analyticsResponse.ok || analyticsResult.errors?.length) {

          const detail = analyticsResult.errors?.[0]?.message ||

            "Cloudflare Analytics kon niet worden uitgelezen.";

          throw new Error(detail);

        }



        const groups =

          analyticsResult.data?.viewer?.accounts?.[0]

            ?.aiInferenceAdaptiveGroups || [];



        const neurons = groups.reduce(

          (total, group) => total + Number(group.sum?.totalNeurons || 0),

          0

        );



        const confidence = groups.reduce((result, group) => {

          const interval = group.confidence?.sum?.totalNeurons;

          if (!interval) return result;

          result.lower += Number(interval.lower || 0);

          result.upper += Number(interval.upper || 0);

          result.estimate += Number(interval.estimate || 0);

          result.available = true;

          return result;

        }, { lower: 0, upper: 0, estimate: 0, available: false });



        const dailyLimit = 10000;

        const used = Math.max(0, Math.round(neurons));

        const percentage = Math.round((used / dailyLimit) * 1000) / 10;



        return response({

          success: true,

          version: WORKER_VERSION,

          date_utc: utcDate,

          reset: "00:00 UTC",

          used_neurons: used,

          daily_limit: dailyLimit,

          remaining_neurons: Math.max(0, dailyLimit - used),

          percentage,

          confidence_95: confidence.available ? {

            lower: Math.round(confidence.lower),

            upper: Math.round(confidence.upper)

          } : null,

          source: "Cloudflare Analytics adaptive sampling",

          estimated: true,

          note: "Analytics kan door adaptieve steekproeven afwijken van de officiële facturatiegegevens."

        });

      } catch (error) {

        return response({

          success: false,

          version: WORKER_VERSION,

          error: error.message || "Verbruik kon niet worden opgehaald."

        }, 502);

      }

    }



    // Alleen POST naar /process toestaan*

    if (

      request.method !== "POST" ||

      url.pathname !== "/process"

    ) {

      return response({

        success: false,

        error: "Onbekend verzoek."

      }, 404);

    }



    // Toegang controleren: Bearer of X-Atlas-Key*

    const authorization = request.headers.get("Authorization") || "";



    const bearerKey = authorization.startsWith("Bearer ")

      ? authorization.slice(7).trim()

      : "";



    const suppliedKey =

      bearerKey ||

      request.headers.get("X-Atlas-Key") ||

      "";



    if (

      !env.ATLAS_WORKER_KEY ||

      suppliedKey !== env.ATLAS_WORKER_KEY

    ) {

      return response({

        success: false,

        error: "Ongeldige toegangscode."

      }, 401);

    }



    if (!env.AI) {

      return response({

        success: false,

        error: "Cloudflare AI-binding ontbreekt."

      }, 503);

    }



    try {

      const body = await request.json();



      // Zowel één link als meerdere links accepteren*

      const inputLinks = Array.isArray(body.urls)

        ? body.urls

        : body.url

          ? [body.url]

          : [];



      const links = [

        ...new Set(

          inputLinks

            .map(x => String(x).trim())

            .filter(Boolean)

        )

      ];



      if (links.length > 5) {

        return response({

          success: false,

          error: "Geef maximaal 5 bronlinks op."

        }, 400);

      }

      const cultivarName = String(body.name || body.cultivar || "").trim();
      if (!cultivarName && !links.length) {
        return response({
          success: false,
          error: "Geef een cultivarnaam op zodat Acer Atlas zelfstandig bronnen kan zoeken."
        }, 400);
      }



      // Start met de door de gebruiker aangeleverde bronnen.
      const sources = [];
      const errors = [];
      const seenUrls = new Set();
      for (const link of links) {
        try {
          const source = await readSourceCached(link);
          if (!seenUrls.has(source.url)) {
            sources.push(source);
            seenUrls.add(source.url);
          }
        } catch (e) {
          errors.push({ url: link, error: e.message });
        }
      }

      if (!sources.length && !cultivarName) {
        return response({
          success: false,
          error: "Geen bruikbare bronpagina gevonden en geen cultivarnaam ontvangen.",
          details: errors
        }, 422);
      }

      const discoveredSources = [];
      const discoveryEnabled = body.discover_sources !== false && sources.length < MAX_SOURCE_COUNT;

      // Drie gerichte zoekopdrachten combineren de belangrijkste onderzoeksrichtingen binnen de subrequestlimiet.
      if (discoveryEnabled) {
        const searchName = cultivarName || sources[0]?.title || "Acer palmatum";
        const searchQueries = [
          { field: "growth", query: `"${searchName}" Acer palmatum cultivar height width growth rate habit` },
          { field: "history", query: `"${searchName}" Acer palmatum cultivar introduced by selected by introduction year` },
          { field: "seasons_group", query: `"${searchName}" Acer palmatum spring summer autumn winter foliage plant group` }
        ];
        for (const searchItem of searchQueries) {
          if (sources.length + discoveredSources.length >= MAX_SOURCE_COUNT) break;
          const beforeCount = discoveredSources.length;
          try {
            const candidates = await searchCultivarSources(searchItem.query, [...seenUrls, ...discoveredSources.map(item => item.url)]);
            for (const candidate of candidates) {
              if (sources.length + discoveredSources.length >= MAX_SOURCE_COUNT) break;
              try {
                const source = await readSourceCached(candidate.url);
                if (seenUrls.has(source.url) || discoveredSources.some(item => item.url === source.url)) continue;
                if (!source.text || source.text.length < 350) continue;
                source.title = source.title || candidate.title || new URL(source.url).hostname;
                discoveredSources.push(source);
                break; // Eén nieuwe pagina per zoekrichting, zodat alle zes onderwerpen aan bod komen.
              } catch (e) {
                errors.push({ url: candidate.url, error: e.message });
              }
            }
          } catch (e) {
            errors.push({ search: searchItem.query, field: searchItem.field, error: "Zoeken mislukt: " + e.message });
          }
          // Een zoekrichting zonder bruikbare pagina blijft zichtbaar in de fout-/statusinformatie.
          if (discoveredSources.length === beforeCount) {
            errors.push({ field: searchItem.field, search: searchItem.query, error: "Geen nieuwe leesbare bron gevonden." });
          }
        }
      }

      let allSources = orderSourcesByPriority([...sources, ...discoveredSources]).slice(0, MAX_SOURCE_COUNT);
      if (!allSources.length) {
        return response({
          success: false,
          version: WORKER_VERSION,
          error: "Geen bruikbare bronpagina gevonden. De automatische zoekopdracht leverde geen leesbare cultivarbronnen op.",
          search_queries_attempted: 3,
          search_errors: errors.filter(item => item.search),
          details: errors,
          discovered_source_count: 0
        }, 422);
      }
      let data = await runCultivarAi(env, cultivarName, allSources);

      // Geen tweede zoekronde binnen dezelfde Worker-aanroep: dit voorkomt overschrijding
      // van Cloudflare's subrequestlimiet. Ontbrekende velden blijven expliciet onbekend.
      const missingGroups = missingResearchFields(data);
      const followUpSearches = 0;

      if (!data || typeof data !== "object" || Array.isArray(data)) {
        throw new Error("AI-resultaat is geen geldig object.");
      }

      // Alleen velden afdwingen die ook daadwerkelijk in het huidige AI-uitvoerschema staan.
      // traits en history zijn legacy-velden en maken geen deel uit van dit schema.
      if (!data.name && cultivarName) data.name = cultivarName;
      const requiredFields = ["name"];
      for (const field of requiredFields) {
        if (!(field in data) || data[field] === null || String(data[field]).trim() === "") {
          throw new Error("AI-resultaat mist verplicht veld: " + field);
        }
      }
      if (!("accepted_name" in data)) data.accepted_name = "";
      // Synoniemen zijn optioneel: een cultivar kan geen bekende synoniemen hebben.
      if (!Array.isArray(data.synonyms)) data.synonyms = [];

      // Verwijder ontbrekende waarden volledig; nooit "Onbekend", lege tekst of null opslaan.
      const cleanValue = value => {
        if (value === undefined || value === null) return undefined;
        if (typeof value === "string") {
          const trimmed = value.trim();
          return !trimmed || /^(onbekend|unknown|n\/a|-)$/i.test(trimmed) ? undefined : trimmed;
        }
        if (Array.isArray(value)) return value.map(cleanValue).filter(item => item !== undefined);
        if (typeof value === "object") {
          const cleaned = {};
          for (const [key, item] of Object.entries(value)) {
            const next = cleanValue(item);
            if (next !== undefined) cleaned[key] = next;
          }
          return Object.keys(cleaned).length ? cleaned : undefined;
        }
        return value;
      };
      for (const field of ["name", "accepted_name", "species", "synonyms", "plant_group", "selector_or_introducer", "introduction_year", "height", "width", "growth_rate", "growth_habit", "climate_zone", "seasons", "field_sources", "conflicts"]) {
        const value = cleanValue(data[field]);
        if (value === undefined) delete data[field];
        else data[field] = value;
      }
      // Oude velden uit het vorige schema worden niet meer teruggegeven.
      for (const field of ["position", "soil", "hardiness", "origin", "foliage", "autumn_colour", "growthData", "siteData"]) delete data[field];
      data = validateFieldSources(data, allSources);

      // Botanische controles*

      data = correctBotanicalData(data);



      // Groeivorm vertalen*

      data.growth_habit = normalizeGrowthHabit(data.growth_habit);



      // Bronvermeldingen zijn gevalideerd tegen de daadwerkelijk opgehaalde pagina's.
      return response({
        success: true,
        version: WORKER_VERSION,
        data,
        source_count: allSources.length,
        supplied_source_count: sources.length,
        discovered_source_count: allSources.length - sources.length,
        missing_fields_after_research: missingResearchFields(data),
        follow_up_searches: followUpSearches,
        errors
      });



    } catch (error) {

      return response({

        success: false,

        version: WORKER_VERSION,

        error: error.message || "Onbekende fout."

      }, 500);

    }

  }

};