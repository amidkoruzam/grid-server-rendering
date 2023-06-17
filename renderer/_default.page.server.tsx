export { render };
export const passToClient = ["pageProps", "urlPathname"];

import ReactDOMServer from "react-dom/server";
import { escapeInject, dangerouslySkipEscape } from "vite-plugin-ssr/server";
import { PageContextServer } from "./types";

async function render(pageContext: PageContextServer) {
  const { Page, pageProps } = pageContext;
  if (!Page)
    throw new Error("My render() hook expects pageContext.Page to be defined");

  const start = performance.now();
  const pageHtml = ReactDOMServer.renderToString(<Page {...pageProps} />);
  const end = performance.now();

  const { documentProps } = pageContext.exports;
  const title = (documentProps && documentProps.title) || "Vite SSR app";
  const desc =
    (documentProps && documentProps.description) ||
    "App using Vite + vite-plugin-ssr";

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />
        <title>${title}</title>
      </head>
      <body>
        <p>Time to render on server: ${(end - start).toString()}</p>
        <div id="react-root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;

  return {
    documentHtml,
    pageContext: {},
  };
}
