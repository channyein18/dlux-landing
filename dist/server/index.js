const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

const extensionFor = (pathname) => {
  const match = pathname.match(/\.[a-z0-9]+$/i);
  return match ? match[0].toLowerCase() : "";
};

const withContentType = (response, pathname) => {
  const headers = new Headers(response.headers);
  const contentType = MIME_TYPES[extensionFor(pathname)];
  if (contentType) headers.set("content-type", contentType);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
};

const assetRequest = (request, pathname) => {
  const url = new URL(request.url);
  url.pathname = pathname;
  url.search = "";
  return new Request(url, request);
};

const fetchAsset = async (request, env, pathname) => {
  const response = await env.ASSETS.fetch(assetRequest(request, pathname));
  if (response.status === 404) return response;
  return withContentType(response, pathname);
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let pathname = url.pathname;

    if (pathname === "/") pathname = "/index.html";
    if (!extensionFor(pathname)) pathname = `${pathname}.html`;

    const response = await fetchAsset(request, env, pathname);
    if (response.status !== 404) return response;

    return fetchAsset(request, env, "/index.html");
  },
};
