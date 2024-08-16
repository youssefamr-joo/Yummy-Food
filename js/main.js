//! dark and light mood
document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.querySelector(".mode-toggle");
  const body = document.body;

  // Load theme from local storage
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme === "light") {
    body.classList.add("light-mode");
  }
  toggleButton.addEventListener("click", function () {
    body.classList.toggle("light-mode");

    // Store the user's preference in local storage
    if (body.classList.contains("light-mode")) {
      localStorage.setItem("theme", "light");
    } else {
      localStorage.setItem("theme", "dark");
    }
  });
});

//! side navigation script JQ
let sideNavLeft = $(".side-nav-menu").css("left");
function openSideNav() {
  $(".side-nav-menu").animate({ left: 0 }, 500);
  $(".open-close").addClass("fa-x");
  $(".open-close").removeClass("fa-align-right");

  for (let i = 0; i < 5; i++) {
    $(".links li")
      .eq(i)
      .animate({ top: 0 }, (i + 5) * 150);
  }

  $(".nav-footer").animate(
    {
      left: 0,
    },
    500
  );
}

function closeSideNav() {
  let navTabWidth = $(".side-nav-menu .nav-tab").outerWidth();

  $(".side-nav-menu").animate({ left: -navTabWidth }, 500);
  $(".open-close").addClass("fa-align-right");
  $(".open-close").removeClass("fa-x");

  $(".links li").animate({ top: 300 }, 500);

  $(".nav-footer").animate(
    {
      left: -200,
    },
    500
  );
}
closeSideNav();
$(".side-nav-menu i.open-close").click(() => {
  // get side nav left
  let sideNavLeft = $(".side-nav-menu").css("left");

  if (sideNavLeft === "0px") {
    closeSideNav();
  } else {
    openSideNav();
  }
});

//! deal with api

let baseUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=`;

async function searchByName(term) {
  const response = await fetch(`${baseUrl}${term}`);
  const data = await response.json();
  displayMeals(data.meals);
}
searchByName("");

// display meals when open
function displayMeals(arr) {
  let cartona = ``;
  // loop and set in html
  arr.forEach((element) => {
    cartona += `
    <div class="col-xxl-3 col-xl-3 col-md-4 col-sm-6">
            <div class="meal-card overflow-hidden">
              <div class="meal-img position-relative">
                <img
                  src="${element.strMealThumb}"
                  alt="${element.strCategory}"
                />
                <div
                  class="meal-layer d-flex justify-content-center align-items-center"
                >
                  <h3 class="meal-name text-capitalize">${element.strMeal}</h3>
                </div>
              </div>
            </div>
        </div>
    `;
  });

  document.getElementById("meals-container").innerHTML = cartona;
}

//! get categories function
async function getCategories() {
  const response =
    await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php
`);
  const data = await response.json();
  // console.log(data.categories);
  displayCategories(data.categories);
}
document.getElementById("categories").addEventListener("click", function () {
  getCategories();
});

// display categories function
function displayCategories(arr) {
  let cartona = ``;
  // loop and set in html
  arr.forEach((element) => {
    cartona += `
    <div class="col-xxl-3 col-xl-3 col-md-4 col-sm-6">
            <div onclick="getCategoriesDetails('${
              element.strCategory
            }')" class="meal-card overflow-hidden">
              <div class="meal-img position-relative">
                <img
                  src="${element.strCategoryThumb}"
                  alt="${element.strCategory}"
                />
                <div
                  class="meal-layer text-center d-flex flex-column justify-content-center align-items-center"
                >
                  <h3 class="meal-name text-capitalize">${
                    element.strCategory
                  }</h3>
                  <p class='lead fs-6 text-primary'>${element.strCategoryDescription
                    .split(" ")
                    .slice(0, 10)
                    .join(" ")}
                  </p>
                </div>
              </div>
            </div>
        </div>
    `;
  });
  document.getElementById("meals-container").innerHTML = cartona;
}

//?! get categories details function
async function getCategoriesDetails(category) {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  const data = await response.json();
  // console.log(data);

  displayMeals(data.meals);
}

//! get area function
async function getArea() {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  const data = await response.json();
  // console.log(data.meals);
  displayArea(data.meals);
}
document.getElementById("area").addEventListener("click", function () {
  getArea();
});
function displayArea(arr) {
  let cartona = ``;
  // loop and set in html
  arr.forEach((element) => {
    cartona += `
    <div class="col-xxl-3 col-xl-3 col-md-4 col-sm-6">
            <div onclick="getAreaDetails('${element.strArea}')" class="meal-card overflow-hidden">
              <div class="meal-img text-center p-4 position-relative">
                <i class="fa-solid fa-utensils mb-2 fa-4x"></i>
                <h2>${element.strArea}</h2>
                <div
                  class="meal-layer text-center d-flex flex-column justify-content-center align-items-center"
                >
                  <h3 class="meal-name text-capitalize">${element.strArea} Food</h3>
                </div>
              </div>
            </div>
        </div>
    `;
  });
  document.getElementById("meals-container").innerHTML = cartona;
}

//?! get area details function
async function getAreaDetails(area) {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  const data = await response.json();
  // console.log(data);

  displayMeals(data.meals);
}

//! get ingredients function
async function getIngredients() {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  const data = await response.json();
  // console.log(data.meals);
  displayIngredients(data.meals.slice(0, 20));
}
document.getElementById("ingredients").addEventListener("click", function () {
  getIngredients();
});
function displayIngredients(arr) {
  let cartona = ``;
  // loop and set in html
  arr.forEach((element) => {
    cartona += `
    <div class="col-xxl-3 col-xl-3 col-md-4 col-sm-6">
            <div onclick="getIngredientDetails('${
              element.strIngredient
            }')" class="meal-card bg-transparent border-0 shadow-none overflow-hidden">
              <div class="meal-img text-center p-4">
                <i class="fa-solid fa-drumstick-bite mb-2 fa-4x"></i>
                <h2 class='fs-5'>${element.strIngredient
                  .split(" ")
                  .slice(0, 1)
                  .join(" ")}
                </h2>
                <p class='lead fs-6 text-justify'>${element.strDescription
                  .split(" ")
                  .slice(0, 20)
                  .join(" ")} ...
                  </p>
              </div>
            </div>
        </div>
    `;
  });
  document.getElementById("meals-container").innerHTML = cartona;
}

//?! get ingredients details function
async function getIngredientDetails(ingredient) {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
  );
  const data = await response.json();
  // console.log(data);

  displayMeals(data.meals);
}
