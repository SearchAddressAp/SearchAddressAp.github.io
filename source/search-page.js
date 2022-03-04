import { searchTown } from "./api_requests.js";
import { html } from "./library.js";

const searchTemplate = (
  towns = "",
  onSearch,

  onClear,
  params = ""
) => html` <section id="search" class="search">
  <div class="content-wrapper">
    <section class="search-bar">
      <h2 class="search-bar__title">Find Address</h2>

      <form @submit=${onSearch} class="search-bar__form" action="search">
        <input
          type="text"
          id="inp"
          class="search-bar__input"
          placeholder="Search address..."
          name="search"
          .value=${params}
        />
        <button type="submit" class="search-bar__btn">
          <i class="fa fa-search"></i>
        </button>
      </form>
      <!-- <div class="autocompl-dropdown">
          <li>something</li>
          <li>something</li>
          <li>something</li>
      </div> -->
    </section>
    <section class="results">
      <h3 class="results__title">Results:</h3>
      <!--Show after click Search button-->
      <div class="results__container">
        <ol id="myList" class="results__container__list">
          ${towns.length == 0
            ? html`<p class="no-result">No reseults</p>`
            : towns.map(resultsTemplate)}
        </ol>
      </div>
      <button @click=${onClear} class="results__clear-btn">clear</button>
    </section>
  </div>
</section>`;

const resultsTemplate = (town) => html` <li class="list__item">
  <a href="https://www.google.com/maps/place/ + ${town.text}"
    ><p>${town.text}</p></a
  >
</li>`;

export async function searchPage(ctx) {
  const params = ctx.querystring.split("=")[1];
  let towns = "";
  let search = "";

  if (params) {
    let results = await searchTown(decodeURIComponent(params));
    towns = Object.values(results).reduce((a, b) => a.concat(b), []);
  }

  ctx.render(searchTemplate(towns, onSearch, onClear));

  function onSearch(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    search = formData.get("search");

    if (search) {
      ctx.page.redirect("/search?search=" + encodeURIComponent(search));
    }
  }

  function onClear(e) {
    towns = [];
    ctx.page.redirect("/search");
  }
}
