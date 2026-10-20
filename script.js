/* =========================================================
   ShopEase – Product listing, details and cart (vanilla JS)
   ========================================================= */

/* ---------- 1. PRODUCT DATA (array of objects) ---------- */
const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=70`;

const products = [
  // Electronics
  { id: 1, name: "Wireless Headphones", category: "Electronics", price: 2999, rating: 4.5, image: img("1505740420928-5e560c06d30e"), description: "Over-ear Bluetooth headphones with deep bass, soft ear cushions and up to 30 hours of battery life. Includes a carry pouch and charging cable." },
  { id: 2, name: "Smartwatch Active", category: "Electronics", price: 4499, rating: 4.3, image: img("1546868871-7041f2a55e12"), description: "Fitness smartwatch with heart-rate tracking, sleep monitoring, call notifications and a bright always-on display. Water resistant." },
  { id: 3, name: "Portable Bluetooth Speaker", category: "Electronics", price: 1899, rating: 4.4, image: img("1608043152269-423dbba4e7e1"), description: "Compact speaker with clear sound, 12-hour playtime and a splash-proof body. Great for travel, picnics and parties." },
  { id: 4, name: "Slim Laptop 14\"", category: "Electronics", price: 45999, rating: 4.6, image: img("1496181133206-80ce9b88a853"), description: "Lightweight 14-inch laptop with a full HD display, 8 GB RAM and 512 GB SSD. Ideal for students and everyday work." },
  // Clothing
  { id: 5, name: "Classic White T-Shirt", category: "Clothing", price: 499, rating: 4.2, image: img("1521572163474-6864f9cf17ab"), description: "Soft 100% cotton crew-neck t-shirt with a regular fit. Easy to pair with jeans or formal trousers." },
  { id: 6, name: "Denim Jacket", category: "Clothing", price: 1799, rating: 4.4, image: img("1551028719-00167b16eac5"), description: "Durable mid-blue denim jacket with button front and two chest pockets. A wardrobe staple for every season." },
  { id: 7, name: "Running Sneakers", category: "Clothing", price: 2599, rating: 4.5, image: img("1542291026-7eec264c27ff"), description: "Cushioned running shoes with breathable mesh and a grippy rubber sole for all-day comfort." },
  { id: 8, name: "Cozy Pullover Hoodie", category: "Clothing", price: 1299, rating: 4.1, image: img("1556821840-3a63f95609a7"), description: "Warm fleece-lined hoodie with a front pocket and adjustable drawstring hood. Machine washable." },
  // Accessories
  { id: 9, name: "Everyday Backpack", category: "Accessories", price: 1499, rating: 4.3, image: img("1553062407-98eeb64c6a62"), description: "Water-resistant 25 L backpack with a padded laptop sleeve, multiple pockets and comfortable shoulder straps." },
  { id: 10, name: "UV Protection Sunglasses", category: "Accessories", price: 799, rating: 4.0, image: img("1572635196237-14b3f281503f"), description: "Lightweight polarised sunglasses with 100% UV protection and a durable frame." },
  { id: 11, name: "Leather Wallet", category: "Accessories", price: 699, rating: 4.2, image: img("1627123424574-724758594e93"), description: "Slim genuine-leather wallet with six card slots and a full-length cash compartment." },
  { id: 12, name: "Analog Wrist Watch", category: "Accessories", price: 3299, rating: 4.5, image: img("1523275335684-37898b6baf30"), description: "Minimal analog watch with a stainless-steel case, scratch-resistant glass and a comfortable leather strap." }
];

const categories = [
  { name: "All Products", icon: "🛍️", value: "All" },
  { name: "Electronics", icon: "🎧", value: "Electronics" },
  { name: "Clothing", icon: "👕", value: "Clothing" },
  { name: "Accessories", icon: "👜", value: "Accessories" }
];

/* ---------- 2. STATE ---------- */
// One object holds every filter, so they always work together.
const filters = { category: "All", search: "", min: null, max: null, sort: "default" };
const CART_KEY = "shopEaseCart";
let cart = loadCart(); // array of { id, qty }

/* ---------- 3. HELPERS ---------- */
const $ = (selector) => document.querySelector(selector);

// Format a number as Indian rupees, e.g. 2999 -> ₹2,999
function formatPrice(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}

// Inline SVG shown when a product image fails to load
const FALLBACK_IMAGE = "data:image/svg+xml;utf8," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450"><rect width="100%" height="100%" fill="#e8efed"/><text x="50%" y="50%" fill="#5b6676" font-family="Arial" font-size="28" text-anchor="middle">Image unavailable</text></svg>'
);

// Build an <img> tag with alt text and an onerror fallback
function imageTag(product) {
  return `<img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'">`;
}

function findProduct(id) {
  return products.find((p) => p.id === id);
}

let toastTimer;
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

/* ---------- 4. CART LOGIC ---------- */
// Read the cart from localStorage; ignore anything invalid.
function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY));
    if (!Array.isArray(saved)) return [];
    return saved
      .filter((item) => item && findProduct(item.id) && Number.isInteger(item.qty) && item.qty >= 1)
      .map((item) => ({ id: item.id, qty: item.qty }));
  } catch (error) {
    return []; // corrupted JSON or storage blocked
  }
}

function saveCart() {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (error) { /* storage unavailable */ }
  updateCartBadge();
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + findProduct(item.id).price * item.qty, 0);
}

function updateCartBadge() {
  $("#cartBadge").textContent = getCartCount();
}

// Add a product; if it is already in the cart, just raise its quantity.
function addToCart(id) {
  const existing = cart.find((item) => item.id === id);
  if (existing) existing.qty += 1;
  else cart.push({ id, qty: 1 });
  saveCart();
  showToast(`${findProduct(id).name} added to cart`);
}

function changeQuantity(id, change) {
  const item = cart.find((entry) => entry.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + change); // never below 1
  saveCart();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  saveCart();
  renderCart();
}

/* ---------- 5. FILTER, SEARCH AND SORT ---------- */
// Returns a new array: category -> search -> price range -> sort.
function getVisibleProducts() {
  const term = filters.search.trim().toLowerCase();
  let result = products.filter((p) => {
    const matchesCategory = filters.category === "All" || p.category === filters.category;
    const matchesSearch = !term || p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term);
    const matchesMin = filters.min === null || p.price >= filters.min;
    const matchesMax = filters.max === null || p.price <= filters.max;
    return matchesCategory && matchesSearch && matchesMin && matchesMax;
  });

  if (filters.sort === "price-asc") result.sort((a, b) => a.price - b.price);
  if (filters.sort === "price-desc") result.sort((a, b) => b.price - a.price);
  if (filters.sort === "name-asc") result.sort((a, b) => a.name.localeCompare(b.name));
  return result;
}

// Turn the text of a price box into a number, or null if empty.
// Returns NaN for invalid (negative / non-numeric) input.
function parsePrice(text) {
  if (text.trim() === "") return null;
  const value = Number(text);
  return Number.isFinite(value) && value >= 0 ? value : NaN;
}

// Read the price boxes, validate them, then re-render the grid.
function readPriceInputs() {
  const min = parsePrice($("#minPrice").value);
  const max = parsePrice($("#maxPrice").value);
  const errorBox = $("#filterError");
  errorBox.textContent = "";

  if (Number.isNaN(min) || Number.isNaN(max)) {
    errorBox.textContent = "Please enter prices as numbers of 0 or more.";
    return false;
  }
  if (min !== null && max !== null && min > max) {
    errorBox.textContent = "Minimum price cannot be higher than maximum price.";
    return false;
  }
  filters.min = min;
  filters.max = max;
  return true;
}

/* ---------- 6. RENDERING ---------- */
function renderCategories() {
  $("#categoryCards").innerHTML = categories.map((c) => `
    <button type="button" class="category-card ${filters.category === c.value ? "active" : ""}" data-category="${c.value}" aria-pressed="${filters.category === c.value}">
      <span class="icon" aria-hidden="true">${c.icon}</span><strong>${c.name}</strong>
    </button>`).join("");

  // Highlight the matching link in the navigation bar
  document.querySelectorAll(".nav-links [data-category]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.category === filters.category);
  });
}

function renderProducts() {
  const visible = getVisibleProducts();
  $("#resultCount").textContent = `Showing ${visible.length} of ${products.length} products`;

  if (visible.length === 0) {
    $("#productGrid").innerHTML = `<div class="empty"><h3>No products found</h3><p>Try a different search, category or price range, or clear the filters.</p></div>`;
    return;
  }
  $("#productGrid").innerHTML = visible.map((p) => `
    <article class="product-card">
      ${imageTag(p)}
      <div class="card-body">
        <h3>${p.name}</h3>
        <span class="category-tag">${p.category}</span>
        <span class="price">${formatPrice(p.price)}</span>
        <div class="card-actions">
          <a class="btn btn-outline" href="#/product/${p.id}" aria-label="View details of ${p.name}">View Details</a>
          <button type="button" class="btn" data-add="${p.id}" aria-label="Add ${p.name} to cart">Add to Cart</button>
        </div>
      </div>
    </article>`).join("");
}

function renderDetail(id) {
  const p = findProduct(id);
  if (!p) {
    $("#detailView").innerHTML = `<div class="empty"><h2>Product not found</h2><a class="btn" href="#/">Back to products</a></div>`;
    return;
  }
  $("#detailView").innerHTML = `
    <p><a href="#/">← Back to products</a></p>
    <div class="detail">
      ${imageTag(p)}
      <div>
        <span class="category-tag">${p.category}</span>
        <h1>${p.name}</h1>
        <p class="rating" aria-label="Rating ${p.rating} out of 5">★ ${p.rating} / 5</p>
        <p class="price">${formatPrice(p.price)}</p>
        <p>${p.description}</p>
        <button type="button" class="btn" data-add="${p.id}">Add to Cart</button>
      </div>
    </div>`;
}

function renderCart() {
  const box = $("#cartContent");
  if (cart.length === 0) {
    box.innerHTML = `<div class="empty"><h2>Your cart is empty</h2><p>Add something you like and it will show up here.</p><a class="btn" href="#/">Continue Shopping</a></div>`;
    return;
  }
  const rows = cart.map((item) => {
    const p = findProduct(item.id);
    return `
      <div class="cart-item">
        ${imageTag(p)}
        <div><h3>${p.name}</h3><span class="muted">${formatPrice(p.price)} each</span></div>
        <div class="qty">
          <button type="button" data-dec="${p.id}" aria-label="Decrease quantity of ${p.name}" ${item.qty === 1 ? "disabled" : ""}>−</button>
          <span aria-label="Quantity">${item.qty}</span>
          <button type="button" data-inc="${p.id}" aria-label="Increase quantity of ${p.name}">+</button>
        </div>
        <strong>${formatPrice(p.price * item.qty)}</strong>
        <button type="button" class="btn btn-danger" data-remove="${p.id}" aria-label="Remove ${p.name} from cart">Remove</button>
      </div>`;
  }).join("");

  const total = getCartTotal();
  box.innerHTML = `
    ${rows}
    <div class="summary">
      <p><span>Subtotal (${getCartCount()} items)</span><span>${formatPrice(total)}</span></p>
      <p><span>Shipping</span><span>Free</span></p>
      <p class="total"><span>Total</span><span>${formatPrice(total)}</span></p>
      <div class="cart-buttons">
        <a class="btn btn-outline" href="#/">Continue Shopping</a>
        <button type="button" class="btn" id="checkoutBtn">Demo Checkout</button>
      </div>
      <div id="checkoutMessage"></div>
    </div>`;
}

/* ---------- 7. VIEW SWITCHING (hash routing) ---------- */
function showView(name) {
  $("#homeView").hidden = name !== "home";
  $("#detailView").hidden = name !== "detail";
  $("#cartView").hidden = name !== "cart";
}

function router() {
  const hash = location.hash;
  $("#navLinks").classList.remove("open");
  if (hash.startsWith("#/product/")) {
    renderDetail(Number(hash.split("/")[2]));
    showView("detail");
    window.scrollTo(0, 0);
  } else if (hash === "#/cart") {
    renderCart();
    showView("cart");
    window.scrollTo(0, 0);
  } else {
    showView("home");
    if (hash === "#products") $("#products").scrollIntoView();
  }
}

/* ---------- 8. EVENT LISTENERS ---------- */
function selectCategory(value) {
  filters.category = value;
  renderCategories();
  renderProducts();
  if (location.hash !== "#/" && location.hash !== "") location.hash = "#/";
  $("#products").scrollIntoView();
}

// Event delegation: one listener handles all buttons inside the page
document.addEventListener("click", (event) => {
  const target = event.target.closest("button, a");
  if (!target) return;

  if (target.dataset.category) selectCategory(target.dataset.category);
  if (target.dataset.add) addToCart(Number(target.dataset.add));
  if (target.dataset.inc) changeQuantity(Number(target.dataset.inc), 1);
  if (target.dataset.dec) changeQuantity(Number(target.dataset.dec), -1);
  if (target.dataset.remove) removeFromCart(Number(target.dataset.remove));
  if (target.id === "checkoutBtn") {
    $("#checkoutMessage").innerHTML = `<div class="demo-note" role="status">This checkout is for demonstration only. No payment is taken and no order is placed.</div>`;
  }
  if (target.hasAttribute("data-home")) { // Home link resets to the plain home view
    filters.category = "All";
    renderCategories();
    renderProducts();
  }
});

$("#navSearch").addEventListener("input", (event) => {
  filters.search = event.target.value;
  renderProducts();
  if (location.hash !== "#/" && location.hash !== "") location.hash = "#/";
});

["minPrice", "maxPrice"].forEach((id) => {
  $("#" + id).addEventListener("input", () => { if (readPriceInputs()) renderProducts(); });
});

$("#sortSelect").addEventListener("change", (event) => {
  filters.sort = event.target.value;
  renderProducts();
});

$("#filterForm").addEventListener("submit", (event) => event.preventDefault());

$("#clearFilters").addEventListener("click", () => {
  Object.assign(filters, { category: "All", search: "", min: null, max: null, sort: "default" });
  $("#navSearch").value = "";
  $("#minPrice").value = "";
  $("#maxPrice").value = "";
  $("#sortSelect").value = "default";
  $("#filterError").textContent = "";
  renderCategories();
  renderProducts();
});

$("#menuToggle").addEventListener("click", () => {
  const open = $("#navLinks").classList.toggle("open");
  $("#menuToggle").setAttribute("aria-expanded", open);
});

window.addEventListener("hashchange", router);

/* ---------- 9. START ---------- */
renderCategories();
renderProducts();
updateCartBadge();
router();
