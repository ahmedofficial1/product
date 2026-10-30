"use strict";

const API_URL = "https://dummyjson.com/products";

const showBtn = document.getElementById("showBtn");
const statusBox = document.getElementById("status");
const productsBox = document.getElementById("products");

/* ---------- API ---------- */

async function fetchProducts() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.products;
}

/* ---------- DOM helpers ---------- */

function createElement(tag, classes = "", text = "") {
  const element = document.createElement(tag);
  if (classes) element.className = classes;
  if (text) element.textContent = text;
  return element;
}

function createProductCard(product) {
  const col = createElement("div", "col-12 col-sm-6 col-lg-4 col-xl-3");
  const card = createElement("div", "card h-100 shadow-sm");

  const image = createElement("img", "card-img-top product-img");
  image.src = product.thumbnail;
  image.alt = product.title;
  image.loading = "lazy";

  const body = createElement("div", "card-body d-flex flex-column");
  const title = createElement("h5", "card-title", product.title);
  const category = createElement("span", "badge text-bg-secondary align-self-start mb-2", product.category);
  const description = createElement("p", "card-text text-muted small flex-grow-1", product.description);

  const footer = createElement("div", "d-flex justify-content-between align-items-center mt-2");
  const price = createElement("span", "fw-bold fs-5", `$${product.price}`);
  const rating = createElement("span", "text-warning", `★ ${product.rating}`);

  footer.append(price, rating);
  body.append(title, category, description, footer);
  card.append(image, body);
  col.append(card);

  return col;
}

function renderProducts(products) {
  productsBox.replaceChildren(...products.map(createProductCard));
}

/* ---------- Status messages ---------- */

function showLoading() {
  statusBox.innerHTML = `
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>`;
}

function showError(message) {
  statusBox.innerHTML = `<div class="alert alert-danger">${message}</div>`;
}

function clearStatus() {
  statusBox.innerHTML = "";
}

/* ---------- Main flow ---------- */

async function handleShowProducts() {
  showBtn.disabled = true;
  showLoading();

  try {
    const products = await fetchProducts();
    renderProducts(products);
    clearStatus();
    showBtn.textContent = "Reload Products";
  } catch (error) {
    showError(`Could not load products. ${error.message}`);
  } finally {
    showBtn.disabled = false;
  }
}

showBtn.addEventListener("click", handleShowProducts);
