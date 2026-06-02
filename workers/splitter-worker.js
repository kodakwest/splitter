export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return withCors(new Response(null, { status: 204 }));
    }

    if (request.method === "POST" && url.pathname === "/save") {
      if (!env.SPLITS) {
        return json({ error: "KV binding SPLITS is not configured" }, 500);
      }

      const body = await request.json();
      const id = crypto.randomUUID().replaceAll("-", "").slice(0, 12);
      await env.SPLITS.put(id, JSON.stringify(body), { expirationTtl: 60 * 60 * 24 * 30 });
      return json({ id, url: `${url.origin}/r/${id}` });
    }

    const match = url.pathname.match(/^\/r\/([a-zA-Z0-9_-]+)$/);
    if (request.method === "GET" && match) {
      if (!env.SPLITS) {
        return json({ error: "KV binding SPLITS is not configured" }, 500);
      }

      const saved = await env.SPLITS.get(match[1]);
      if (!saved) return json({ error: "Not found" }, 404);
      return json(JSON.parse(saved));
    }

    return json({ error: "Not found" }, 404);
  }
};

function json(data, status = 200) {
  return withCors(new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  }));
}

function withCors(response) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}
