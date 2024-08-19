//? variables
let baseUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=`;
const searchContainer = document.getElementById("search-inputs");
const rowData = document.getElementById("meals-container");

//! spinner show
$(document).ready(() => {
  searchByName("").then(() => {
    hideSpinner();
  });
});

function hideSpinner() {
  $(".loading-screen").fadeOut(700);
  $("body").css("overflow", "visible");
}

function showSpinner() {
  $(".loading-screen").fadeIn(700);
  $("body").css("overflow", "hidden");
}

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

  for (let i = 0; i < 6; i++) {
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
async function searchByName(term) {
  const response = await fetch(`${baseUrl}${term}`);
  const data = await response.json();
  data.meals ? displayMeals(data.meals) : displayMeals([]);
}
// display meals when open
function displayMeals(arr) {
  let cartona = ``;
  // loop and set in html
  arr.forEach((element) => {
    cartona += `
    <div class="col-xxl-3 col-xl-3 col-md-4 col-sm-6">
            <div onclick='getMealDetails("${element.idMeal}")' class="meal-card overflow-hidden">
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
  rowData.innerHTML = cartona;
}
// display meal details home
document.getElementById("home").addEventListener("click", function () {
  searchByName("");
  closeSideNav();
});

//! get categories function
async function getCategories() {
  showSpinner();
  const response =
    await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php
`);
  const data = await response.json();
  // console.log(data.categories);
  displayCategories(data.categories);
  hideSpinner();
}
document.getElementById("categories").addEventListener("click", function () {
  hideSearch();
  getCategories();
  hideSpinner();
  closeSideNav();
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
  rowData.innerHTML = cartona;
}

//?! get categories details function
async function getCategoriesDetails(category) {
  showSpinner();
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  const data = await response.json();
  // console.log(data);

  displayMeals(data.meals);
  hideSpinner();
}

//! get area function
async function getArea() {
  showSpinner();
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  const data = await response.json();
  // console.log(data.meals);
  displayArea(data.meals);
  hideSpinner();
}
document.getElementById("area").addEventListener("click", function () {
  hideSearch();
  getArea();
  closeSideNav();
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
  rowData.innerHTML = cartona;
}

//?! get area details function
async function getAreaDetails(area) {
  showSpinner();
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  const data = await response.json();
  // console.log(data);

  displayMeals(data.meals);
  hideSpinner();
}

//! get ingredients function
async function getIngredients() {
  showSpinner();
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  const data = await response.json();
  // console.log(data.meals);
  displayIngredients(data.meals.slice(0, 20));
  hideSpinner();
}
document.getElementById("ingredients").addEventListener("click", function () {
  hideSearch();
  getIngredients();
  closeSideNav();
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
  rowData.innerHTML = cartona;
}

//?! get ingredients details function
async function getIngredientDetails(ingredient) {
  showSpinner();
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
  );
  const data = await response.json();
  // console.log(data);

  displayMeals(data.meals);
  hideSpinner();
}

//! display meal details function
async function getMealDetails(id) {
  showSpinner();
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const data = await response.json();
  console.log(data);

  displayMealDetails(data.meals[0]);
  hideSpinner();
}
function displayMealDetails(meal) {
  let ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = `strIngredient${i}`;
    const measure = `strMeasure${i}`;
    if (meal[ingredient] && meal[measure]) {
      ingredients.push(`${meal[ingredient]} - ${meal[measure]}`);
    }
  }
  // console.log(ingredients);

  let cartona = `
  <div class="col-md-4">
          <div class="meal-img my-3 ">
              <img src="${
                meal.strMealThumb
              }" alt="" class="img-fluid rounded-2" />
              <h4 class="text-center m-3 pt-3 h2">${meal.strMeal}</h4>
          </div>
          </div>
          <div class="col-md-8">
            <h4 class="text-uppercase fw-bold my-3">instructions</h4>
            <p class="lead opacity-75 lh-lg">
              ${meal.strInstructions}
            </p>
            <h3 class="my-3"><span class=' text-capitalize  fw-bold'>area :</span> ${
              meal.strArea
            }</h3>
            <h3 class="my-3"><span class=' text-capitalize fw-bold'>category :</span> ${
              meal.strCategory
            }</h3>
            <h4 class="mt-3"><span class=' text-capitalize fw-bold'>recipes :</span></h4>
            <ul class="list-unstyled d-flex g-3 flex-wrap mb-3">
            ${ingredients
              .map((ing) => `<li class="me-2 alert alert-info"> ${ing}</li>`)
              .join("")}
            </ul>
            <h4 class="mb-3 text-capitalize fw-bold">tags :</h4>
            <ul class="list-unstyled m-0 d-flex g-3 flex-wrap">
            ${
              meal.strTags
                ? meal.strTags
                    .split(",")
                    .map(
                      (tag) => `<li class="me-2 alert alert-danger">${tag}</li>`
                    )
                    .join("")
                : ""
            }
            </ul>
            <a target='_blank' href="${
              meal.strSource
            }" class="btn btn-success my-3 me-2">Source</a>
            <a target='_blank' href="${
              meal.strYoutube
            }" class="btn btn-danger">Youtube</a>
          </div>
  `;
  rowData.innerHTML = cartona;
}

//! search functions
document.getElementById("search").addEventListener("click", function () {
  let cartona = `
    <div class="col-md-5 py-2">
          <div class="form w-100">
            <input
              type="search"
              name="search-input"
              id="search-word"
              required
            />
            <label>
              <span style="transition-delay: 0ms">S</span>
              <span style="transition-delay: 50ms">e</span>
              <span style="transition-delay: 100ms">a</span>
              <span style="transition-delay: 150ms">r</span>
              <span style="transition-delay: 200ms">c</span>
              <span style="transition-delay: 250ms" class="me">h</span>
              <span style="transition-delay: 300ms">B</span>
              <span style="transition-delay: 350ms" class="me">y</span>
              <span style="transition-delay: 400ms">N</span>
              <span style="transition-delay: 450ms">a</span>
              <span style="transition-delay: 500ms">m</span>
              <span style="transition-delay: 550ms">e</span>
            </label>
          </div>
        </div>
        <div class="col-md-5 py-2">
          <div class="form w-100">
            <input type="value" id="search-letter" required />
            <label>
              <span style="transition-delay: 0ms">S</span>
              <span style="transition-delay: 50ms">e</span>
              <span style="transition-delay: 100ms">a</span>
              <span style="transition-delay: 150ms">r</span>
              <span style="transition-delay: 200ms">c</span>
              <span style="transition-delay: 250ms" class="me">h</span>
              <span style="transition-delay: 300ms">B</span>
              <span style="transition-delay: 350ms" class="me">y</span>
              <span style="transition-delay: 400ms">F</span>
              <span style="transition-delay: 450ms">i</span>
              <span style="transition-delay: 500ms">r</span>
              <span style="transition-delay: 550ms">s</span>
              <span style="transition-delay: 600ms" class="me">t</span>
              <span style="transition-delay: 650ms">L</span>
              <span style="transition-delay: 700ms">e</span>
              <span style="transition-delay: 750ms">t</span>
              <span style="transition-delay: 800ms">t</span>
              <span style="transition-delay: 850ms">e</span>
              <span style="transition-delay: 900ms">r</span>
            </label>
          </div>
        </div>
  `;
  closeSideNav();
  rowData.innerHTML = ``;
  searchContainer.innerHTML = cartona;
  searchContainer.classList.remove("d-none");
  const searchWord = document.getElementById("search-word");
  const searchLetter = document.getElementById("search-letter");

  searchWord.addEventListener("keyup", function () {
    searchByName(this.value);
  });
  searchLetter.addEventListener("keyup", function () {
    searchByLetters(this.value);
  });
});
async function searchByLetters(term) {
  term == "" ? (term = "a") : "";
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`
  );
  const data = await response.json();
  data.meals ? displayMeals(data.meals) : displayMeals([]);
}
function hideSearch() {
  searchContainer.classList.add("d-none");
}

//!  contact functions
//? show contacts
document.getElementById("contact").addEventListener("click", function () {
  showSpinner();
  rowData.innerHTML = `
  <section
      id="contact"
      class="w-75 m-auto d-flex min-vh-100 justify-content-center align-items-center"
    >
      <div class="container">
        <div class="row p-5">
          <div class="col-md-6">
            <div class="form-group px-2 py-3">
              <input
                onkeyup="inputsValidation()"
                type="text"
                class="form-control"
                id="name"
                placeholder="Enter Your Name"
                required
              />
              <div class="d-none alert text-danger text-uppercase fw-bold fs-6 w-100 m-auto">Please enter valid Name</div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group px-2 py-3">
              <input
                onkeyup="inputsValidation()"
                type="email"
                class="form-control"
                id="email"
                placeholder="Enter Your Email"
                required
              />
              <div class="d-none alert text-danger text-uppercase fw-bold fs-6 w-100 m-auto">Please enter valid Email</div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group px-2 py-3">
              <input
                onkeyup="inputsValidation()"
                type="tel"
                class="form-control"
                id="phone"
                placeholder="Enter Your Phone"
                required
              />
              <div class="d-none alert text-danger text-uppercase fw-bold fs-6 w-100 m-auto">Please enter valid Phone</div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group px-2 py-3">
              <input
                onkeyup="inputsValidation()"
                type="number"
                class="form-control"
                id="age"
                placeholder="Enter Your Age"
                required
              />
              <div class="d-none alert text-danger text-uppercase fw-bold fs-6 w-100 m-auto">Please enter valid Age</div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group px-2 py-3">
              <input
                onkeyup="inputsValidation()"
                type="password"
                class="form-control"
                id="password"
                placeholder="Enter Your password"
                required
              />
              <div class="d-none alert text-danger text-uppercase fw-bold fs-6 w-100 m-auto">Please enter valid Password</div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group px-2 py-3">
              <input
                onkeyup="inputsValidation()"
                type="password"
                class="form-control"
                id="rePassword"
                placeholder="Confirmed Password"
                required
              />
              <div class="d-none alert text-danger text-uppercase fw-bold fs-6 w-100 m-auto">confirmed password must be equal password</div>
            </div>
          </div>
          <div class="col-md-12">
            <div>
              <button
                disabled
                class="btn btn-outline-warning d-block w-25 m-auto mt-3"
                id="submit"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
  hideSpinner();
  closeSideNav();

  // Reassign event listeners to the new elements
  let nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const ageInput = document.getElementById("age");
  const passwordInput = document.getElementById("password");
  const rePasswordInput = document.getElementById("rePassword");

  nameInput.addEventListener("focus", () => {
    nameTouched = true;
  });
  emailInput.addEventListener("focus", () => {
    emailTouched = true;
  });
  phoneInput.addEventListener("focus", () => {
    phoneTouched = true;
  });
  ageInput.addEventListener("focus", () => {
    ageTouched = true;
  });
  passwordInput.addEventListener("focus", () => {
    passwordTouched = true;
  });
  rePasswordInput.addEventListener("focus", () => {
    rePasswordTouched = true;
  });
});
let nameTouched = false;
let emailTouched = false;
let phoneTouched = false;
let ageTouched = false;
let passwordTouched = false;
let rePasswordTouched = false;

function inputsValidation() {
  const submitBtn = document.getElementById("submit");

  if (nameTouched) {
    if (!nameValidation()) {
      document.getElementById("name").classList.add("is-invalid");
      document
        .getElementById("name")
        .nextElementSibling.classList.remove("d-none");
    } else {
      document.getElementById("name").classList.remove("is-invalid");
      document
        .getElementById("name")
        .nextElementSibling.classList.add("d-none");
    }
  }

  if (emailTouched) {
    if (!emailValidation()) {
      document.getElementById("email").classList.add("is-invalid");
      document
        .getElementById("email")
        .nextElementSibling.classList.remove("d-none");
    } else {
      document.getElementById("email").classList.remove("is-invalid");
      document
        .getElementById("email")
        .nextElementSibling.classList.add("d-none");
    }
  }

  if (phoneTouched) {
    if (!phoneValidation()) {
      document.getElementById("phone").classList.add("is-invalid");
      document
        .getElementById("phone")
        .nextElementSibling.classList.remove("d-none");
    } else {
      document.getElementById("phone").classList.remove("is-invalid");
      document
        .getElementById("phone")
        .nextElementSibling.classList.add("d-none");
    }
  }

  if (ageTouched) {
    if (!ageValidation()) {
      document.getElementById("age").classList.add("is-invalid");
      document
        .getElementById("age")
        .nextElementSibling.classList.remove("d-none");
    } else {
      document.getElementById("age").classList.remove("is-invalid");
      document.getElementById("age").nextElementSibling.classList.add("d-none");
    }
  }

  if (passwordTouched) {
    if (!passwordValidation()) {
      document.getElementById("password").classList.add("is-invalid");
      document
        .getElementById("password")
        .nextElementSibling.classList.remove("d-none");
    } else {
      document.getElementById("password").classList.remove("is-invalid");
      document
        .getElementById("password")
        .nextElementSibling.classList.add("d-none");
    }
  }

  if (rePasswordTouched) {
    if (!rePasswordValidation()) {
      document.getElementById("rePassword").classList.add("is-invalid");
      document
        .getElementById("rePassword")
        .nextElementSibling.classList.remove("d-none");
    } else {
      document.getElementById("rePassword").classList.remove("is-invalid");
      document
        .getElementById("rePassword")
        .nextElementSibling.classList.add("d-none");
    }
  }

  if (
    nameValidation() &&
    emailValidation() &&
    phoneValidation() &&
    ageValidation() &&
    passwordValidation() &&
    rePasswordValidation()
  ) {
    submitBtn.disabled = false;
  } else {
    submitBtn.disabled = true;
  }
}
// name regex validation
function nameValidation() {
  const name = document.getElementById("name").value;
  const regex = /^[a-zA-Z\s]+$/;
  return regex.test(name);
}

// email regex validation
function emailValidation() {
  const email = document.getElementById("email").value;
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
}

// phone regex validation
function phoneValidation() {
  const phone = document.getElementById("phone").value;
  const regex = /^(\+[1-9]{1}[0-9]{3,14})?([0-9]{9,14})$/;
  return regex.test(phone);
}

// age regex validation
function ageValidation() {
  const age = document.getElementById("age").value;
  const regex = /^[1-9][0-9]$/;
  return regex.test(age);
}

// password regex validation
function passwordValidation() {
  const password = document.getElementById("password").value;
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return regex.test(password);
}

// rePassword validation
function rePasswordValidation() {
  const password = document.getElementById("password").value;
  const rePassword = document.getElementById("rePassword").value;
  return password === rePassword;
}
