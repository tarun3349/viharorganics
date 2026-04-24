// Core product data for Vihar Organics
const baseProducts = [
  {
    id: "centella-soap",
    name: "Centella Asiatica with Shea Butter Soap",
    description:
      "Nourishing herbal soap enriched with Centella and shea butter for deep hydration and skin repair.",
    price: 150,
    image: "butter.jpeg",
  },
  {
    id: "nalagu-mavu",
    name: "Nalagu Mavu Premium Herbal Bath Powder",
    description:
      "Traditional herbal bath powder made with natural ingredients to cleanse and brighten skin.",
    price: 199,
    image: "herbal.jpeg",
  },
  {
    id: "kuppaimeni-soap",
    name: "Kuppaimeni Soap",
    description:
      "Ayurvedic soap known for soothing skin irritation and improving skin texture.",
    price: 150,
    image: "kuppameni.jpeg",
  },
  {
    id: "strawberry-lip-balm",
    name: "Strawberry Lip Balm",
    description:
      "Hydrating lip balm with natural strawberry extract for soft, smooth lips.",
    price: 200,
    image: "lipbalm.jpeg",
  },
  {
    id: "vegan-lip-balm",
    name: "Vegan Lip Balm",
    description:
      "Plant-based lip balm enriched with coconut and almond oils for deep nourishment.",
    price: 200,
    image: "lipbalm2.jpeg",
  },
  {
    id: "beetroot-lip-balm",
    name: "Beetroot Lip Balm",
    description:
      "Nourishing lip balm with beetroot extract for a natural tint and soft, hydrated lips.",
    price: 250,
    image: "beetroot .jpeg",
  },
  {
    id: "kumkumadi-oil",
    name: "Kumkumadi Oil (30ml)",
    description:
      "Premium Ayurvedic facial oil for radiant glow and skin rejuvenation.",
    price: 349,
    image: "oil1.jpeg",
  },
  {
    id: "herbal-hair-oil",
    name: "Herbal Hair Oil",
    description:
      "Strengthening herbal oil with amla and natural extracts to reduce hair fall.",
    price: 249,
    image: "oil2.jpeg",
  },
  {
    id: "goat-milk-soap",
    name: "Goat Milk with Manjistha Soap",
    description:
      "Gentle cleansing soap with goat milk and manjistha for brighter skin.",
    price: 200,
    image: "soap1.jpeg",
  },
  {
    id: "red-wine-soap",
    name: "Red Wine Soap",
    description:
      "Antioxidant-rich soap that helps rejuvenate and refresh tired skin.",
    price: 125,
    image: "soap2.jpeg",
  },
];

const LOCAL_STORAGE_PRODUCTS_KEY = "viharProductsCustom";

let products = [];
let cart = [];

/**
 * Initialize page interactions when DOM is ready.
 */
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  renderProducts();
  setupHeaderInteractions();
  setupAdminForm();
  setupCartActions();
  setupCheckoutForm();
});

/**
 * Load base products and custom products (from localStorage).
 */
function loadProducts() {
  const stored = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
  let customProducts = [];

  if (stored) {
    try {
      customProducts = JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse stored products", e);
    }
  }

  products = [...baseProducts, ...customProducts];
}

/**
 * Persist custom products into localStorage.
 */
function saveCustomProducts() {
  const customProducts = products.filter((p) =>
    p.id.startsWith("custom-")
  );
  localStorage.setItem(
    LOCAL_STORAGE_PRODUCTS_KEY,
    JSON.stringify(customProducts)
  );
}

/**
 * Render all product cards into the grid.
 */
function renderProducts() {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = "";

  products.forEach((product) => {
    const hasStock = typeof product.stock === "number";
    const stockValue = hasStock ? product.stock : null;
    const outOfStock = hasStock && stockValue <= 0;
    const stockLabel = hasStock
      ? stockValue > 0
        ? `In stock: ${stockValue}`
        : "Out of stock"
      : "Available";

    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-image-wrapper">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
      </div>
      <div class="product-body">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-price">₹${product.price}</div>
        <div class="product-meta ${outOfStock ? "product-meta-out" : ""}">${stockLabel}</div>
      </div>
      <div class="product-footer">
        <div class="qty-control" data-product-id="${product.id}">
          <button class="qty-btn qty-minus" type="button">−</button>
          <span class="qty-value">1</span>
          <button class="qty-btn qty-plus" type="button">+</button>
        </div>
        <button class="add-to-cart-btn${outOfStock ? " disabled" : ""}" data-product-id="${product.id}" type="button" ${outOfStock ? "disabled" : ""}>
          ${outOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    `;
    grid.appendChild(card);
  });

  // Attach quantity and add-to-cart handlers
  setupProductCardInteractions();
}

/**
 * Attach interactions for header: mobile nav + cart button + "Shop Now" CTA.
 */
function setupHeaderInteractions() {
  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.querySelector(".nav");
  const shopNowBtn = document.getElementById("shop-now-btn");
  const cartBtn = document.getElementById("cart-btn");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      nav.classList.toggle("open");
    });

    nav.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
      });
    });
  }

  if (shopNowBtn) {
    shopNowBtn.addEventListener("click", () => {
      document
        .getElementById("products")
        .scrollIntoView({ behavior: "smooth" });
    });
  }

  if (cartBtn) {
    cartBtn.addEventListener("click", () => {
      openCartOverlay();
    });
  }
}

/**
 * Open / close cart overlay helpers.
 */
function openCartOverlay() {
  const overlay = document.getElementById("cart-overlay");
  if (!overlay) return;
  overlay.classList.remove("hidden");
  overlay.setAttribute("aria-hidden", "false");
}

function closeCartOverlay() {
  const overlay = document.getElementById("cart-overlay");
  if (!overlay) return;
  overlay.classList.add("hidden");
  overlay.setAttribute("aria-hidden", "true");
}

/**
 * Attach interactions inside each product card (quantity + add to cart).
 */
function setupProductCardInteractions() {
  // Quantity buttons
  document.querySelectorAll(".qty-control").forEach((wrapper) => {
    const minusBtn = wrapper.querySelector(".qty-minus");
    const plusBtn = wrapper.querySelector(".qty-plus");
    const valueEl = wrapper.querySelector(".qty-value");

    minusBtn.addEventListener("click", () => {
      const current = parseInt(valueEl.textContent, 10) || 1;
      const next = Math.max(1, current - 1);
      valueEl.textContent = next;
    });

    plusBtn.addEventListener("click", () => {
      const current = parseInt(valueEl.textContent, 10) || 1;
      const next = current + 1;
      valueEl.textContent = next;
    });
  });

  // Add to cart buttons
  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.disabled) return;
      const id = button.getAttribute("data-product-id");
      const product = products.find((p) => p.id === id);
      if (!product) return;

      const qtyWrapper = button
        .closest(".product-card")
        .querySelector(".qty-control .qty-value");
      const qty = parseInt(qtyWrapper.textContent, 10) || 1;

      addToCart(product, qty);

      // Small visual feedback
      button.classList.add("added");
      button.textContent = "Added!";
      setTimeout(() => {
        button.classList.remove("added");
        button.textContent = "Add to Cart";
      }, 1000);
    });
  });
}

/**
 * Add product to cart (merge by id).
 */
function addToCart(product, quantity) {
  const hasStock = typeof product.stock === "number";
  if (hasStock) {
    const maxAvailable = product.stock;
    const existingInCart = cart.find((item) => item.id === product.id);
    const alreadyQty = existingInCart ? existingInCart.quantity : 0;
    if (alreadyQty + quantity > maxAvailable) {
      alert(`Only ${maxAvailable} units available for ${product.name}.`);
      return;
    }
  }

  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
    });
  }

  updateCartUI();
}

/**
 * Refresh cart list, total, and header count.
 */
function updateCartUI() {
  const cartItemsEl = document.getElementById("cart-items");
  const cartTotalEl = document.getElementById("cart-total");
  const cartCountEl = document.getElementById("cart-count");

  if (!cartItemsEl || !cartTotalEl || !cartCountEl) return;

  if (cart.length === 0) {
    cartItemsEl.innerHTML =
      '<p class="cart-empty">Your cart is empty.</p>';
    cartTotalEl.textContent = "₹0";
    cartCountEl.textContent = "0";
    return;
  }

  let totalItems = 0;
  let grandTotal = 0;

  cartItemsEl.innerHTML = "";
  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    totalItems += item.quantity;
    grandTotal += itemTotal;

    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div>
        <div class="cart-item-main">${item.name}</div>
        <div class="cart-item-qty">Qty: ${item.quantity} × ₹${item.price}</div>
      </div>
      <div class="cart-item-total">₹${itemTotal}</div>
    `;
    cartItemsEl.appendChild(row);
  });

  cartTotalEl.textContent = `₹${grandTotal}`;
  cartCountEl.textContent = String(totalItems);
}

/**
 * Set up special cart buttons (clear).
 */
function setupCartActions() {
  const clearBtn = document.getElementById("clear-cart-btn");
  const closeBtn = document.getElementById("cart-close-btn");
  const overlay = document.getElementById("cart-overlay");

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (cart.length === 0) return;
      const ok = confirm("Clear all items from cart?");
      if (!ok) return;
      cart = [];
      updateCartUI();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      closeCartOverlay();
    });
  }

  if (overlay) {
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        closeCartOverlay();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeCartOverlay();
    }
  });
}

/**
 * Admin form: toggle visibility and handle submissions (adding new products).
 */
function setupAdminForm() {
  const toggleBtn = document.getElementById("toggle-admin");
  const adminSection = document.getElementById("admin-section");
  const form = document.getElementById("add-product-form");

  if (toggleBtn && adminSection) {
    toggleBtn.addEventListener("click", () => {
      adminSection.classList.toggle("hidden");
    });
  }

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const nameInput = document.getElementById("admin-product-name");
      const descInput = document.getElementById("admin-product-description");
      const priceInput = document.getElementById("admin-product-price");
      const imageInput = document.getElementById("admin-product-image");

      const name = nameInput.value.trim();
      const description = descInput.value.trim();
      const priceValue = parseInt(priceInput.value, 10);
      const imageUrl = imageInput.value.trim();

      if (!name || !description || !priceValue || !imageUrl) {
        alert("Please fill all fields with valid values.");
        return;
      }

      const newProduct = {
        id: `custom-${Date.now()}`,
        name,
        description,
        price: priceValue,
        image: imageUrl,
      };

      products.push(newProduct);
      saveCustomProducts();
      renderProducts();
      form.reset();

      alert("New product added successfully.");
    });
  }
}

/**
 * Setup checkout form with validation and WhatsApp integration.
 */
function setupCheckoutForm() {
  const form = document.getElementById("checkout-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty. Please add products before checkout.");
      return;
    }

    const name = document
      .getElementById("customer-name")
      .value.trim();
    const phone = document
      .getElementById("customer-phone")
      .value.trim();
    const address = document
      .getElementById("customer-address")
      .value.trim();

    // Basic validations
    if (!name || !phone || !address) {
      alert("Please fill in all customer details.");
      return;
    }

    const phoneDigitsOnly = phone.replace(/\D/g, "");
    if (phoneDigitsOnly.length !== 10) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }

    // Build WhatsApp message
    let message = "Hello Vihar Organics,%0aI would like to order:%0a%0a";

    let grandTotal = 0;
    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      grandTotal += itemTotal;
      message += `${item.name} - ${item.quantity} - ₹${itemTotal}%0a`;
    });

    message += `%0aTotal Amount: ₹${grandTotal}%0a%0aCustomer Details:%0a`;
    message += `Name: ${encodeURIComponent(name)}%0a`;
    message += `Phone: ${encodeURIComponent(phoneDigitsOnly)}%0a`;
    message += `Address: ${encodeURIComponent(address)}%0a`;

    // Use final WhatsApp link with encoded message
    const baseUrl = "https://wa.me/918610555736";
    const finalUrl = `${baseUrl}?text=${message}`;

    window.open(finalUrl, "_blank");

    // Clear cart after redirect
    cart = [];
    updateCartUI();
    form.reset();
  });
}

