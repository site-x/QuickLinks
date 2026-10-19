// Send *.pages.dev visitors (production alias and per-deploy URLs) to the custom domain.
export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  if (url.hostname.endsWith(".pages.dev")) {
    url.protocol = "https:";
    url.hostname = "elijahflores.xyz";
    url.port = "";
    return Response.redirect(url.toString(), 301);
  }
  return next();
}
