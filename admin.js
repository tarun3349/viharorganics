const LOCAL_STORAGE_PRODUCTS_KEY = "viharProductsCustom";

function loadCustomProducts() {
  const stored = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to parse stored products", e);
    return [];
  }
}

function saveCustomProducts(list) {
  localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(list));
}

function renderCustomProducts() {
  const container = document.getElementById("admin-product-list");
  const products = loadCustomProducts();

  if (!container) return;

  container.innerHTML = "";

  if (products.length === 0) {
    const msg = document.createElement("p");
    msg.className = "cart-empty";
    msg.textContent = "No custom products added yet.";
    container.appendChild(msg);
    return;
  }

  products.forEach((p) => {
    const stockValue =
      typeof p.stock === "number" && p.stock >= 0 ? p.stock : 0;
    const card = document.createElement("article");
    card.className = "product-card admin-product-card";
    card.setAttribute("data-id", p.id);
    card.innerHTML = `
      <button type="button" class="admin-delete-btn" data-id="${p.id}" title="Delete product">✕</button>
      <div class="product-image-wrapper">
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
      </div>
      <div class="product-body">
        <h3 class="product-name">${p.name}</h3>
        <p class="product-description">${p.description}</p>
        <div class="product-price">₹${p.price}</div>
        <div class="product-meta">Stock: ${stockValue}</div>
      </div>
    `;
    container.appendChild(card);
  });

  // Wire up delete buttons
  container.querySelectorAll(".admin-delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const confirmDelete = confirm("Delete this product?");
      if (!confirmDelete) return;
      const all = loadCustomProducts();
      const filtered = all.filter((item) => item.id !== id);
      saveCustomProducts(filtered);
      renderCustomProducts();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("admin-product-form");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const nameInput = document.getElementById("admin-product-name");
      const descInput = document.getElementById("admin-product-description");
      const priceInput = document.getElementById("admin-product-price");
      const stockInput = document.getElementById("admin-product-stock");
      const imageInput = document.getElementById("admin-product-image");

      const name = nameInput.value.trim();
      const description = descInput.value.trim();
      const priceValue = parseInt(priceInput.value, 10);
      const stockValue = parseInt(stockInput.value, 10);
      const imageUrl = imageInput.value.trim();

      if (!name || !description || isNaN(priceValue) || priceValue <= 0 || isNaN(stockValue) || stockValue < 0 || !imageUrl) {
        alert("Please fill all fields with valid values.");
        return;
      }

      const products = loadCustomProducts();
      products.push({
        id: `custom-${Date.now()}`,
        name,
        description,
        price: priceValue,
        stock: stockValue,
        image: imageUrl,
      });

      saveCustomProducts(products);
      form.reset();
      renderCustomProducts();
      alert("Product saved. It will now appear on the main site on this browser.");
    });
  }

  renderCustomProducts();
});

