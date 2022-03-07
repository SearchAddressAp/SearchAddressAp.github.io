import { searchTown } from "./api_requests.js";
import { html } from "./library.js";

const searchTemplate = (
  towns = "",
  onSearch,
  onInput,
  onClear,
  params = ""
) => html` <section id="search" class="search">
  <div class="content-wrapper">
    <section class="search-bar">
      <h2 class="search-bar__title">Find Address</h2>
      <div class="search-bar__form-container">
        <form @submit=${onSearch} class="search-bar__form" action="search">
          <input
            @input=${onInput}
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
        <div class="search-bar__dropdown"><!--search suggestions--></div>
      </div>
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
  let inp = "";

  if (params) {
    let results = await searchTown(decodeURIComponent(params));
    towns = Object.values(results).reduce((a, b) => a.concat(b), []);
  }

  //on text input showw suggestions

  async function onInput(e) {
    inp = e.target.value;
    let inputSuggestionsList = document.querySelector(".search-bar__dropdown");

    if (inp) {
      let result = await searchTown(decodeURIComponent(inp));

      let cities = Object.values(result)
        .reduce((a, b) => a.concat(b), [])
        .map((data) => {
          return (data = "<li>" + data.text + "</li>");
        });

      inputSuggestionsList.classList.add("active");
      showSuggestions(cities);

      let alllist = inputSuggestionsList.querySelectorAll("li");
      for (let i = 0; i < alllist.length; i++) {
        alllist[i].setAttribute("onclick", "select(this)");
        alllist[i].onclick = () => {
          select(alllist[i]);
        };
      }
    } else {
      inputSuggestionsList.classList.remove("active");
    }
  }

  // show autocomplate dropdown menu and if there's no info show the entered text in the menu

  function showSuggestions(list) {
    let listData;
    if (!list.length) {
      let userValue = document.getElementById("inp").value;
      listData = "<li>" + userValue + "</li>";
    } else {
      listData = list.join("");
    }

    document.querySelector(".search-bar__dropdown").innerHTML = listData;
  }

  // select an option from the autocomplete dropdown menu

  function select(event) {
    let selectedData = event.textContent;
    document.getElementById("inp").value = selectedData;
    document.querySelector(".search-bar__dropdown").classList.remove("active");
  }

  ctx.render(searchTemplate(towns, onSearch, onInput, onClear, params));

  function onSearch(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const search = formData.get("search");

    if (search) {
      ctx.page.redirect("/search?search=" + encodeURIComponent(search));
    }
  }

  function onClear() {
    towns = [];
    ctx.page.redirect("/search");
  }
}
