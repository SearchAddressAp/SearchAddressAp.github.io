import { render, page } from "./library.js";
import { searchPage } from "./search-page.js";
import { welcomePage } from "./welcome-page.js";

const root = document.getElementById("main");

page(decorateContext);
page("/", welcomePage);
page("/search", searchPage);
page.start();

export function decorateContext(ctx, next) {
  ctx.render = (context) => render(context, root);
  next();
}
