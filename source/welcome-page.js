import { html } from "./library.js";

const welcomePageTemplate = () => html` <section class="welcome">
  <div class="content-wrapper">
    <section class="welcome__info">
      <h1>WELCOME</h1>
      <p>You can find your address <a href="/search">here</a></p>
    </section>
  </div>
</section>`;

export function welcomePage(ctx) {
  ctx.render(welcomePageTemplate());
}
