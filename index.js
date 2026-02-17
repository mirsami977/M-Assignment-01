// --- Global Variables ---
let productsData = [];
let visibleCount = 6;
let cart = JSON.parse(localStorage.getItem("cart")) || []; // load from localStorage

// --- Save Cart to localStorage ---
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// --- Load Trending Products ---
async function loadTrending() {
  const res = await fetch("https://fakestoreapi.com/products");
  productsData = await res.json();
  renderTrending();
}

function renderTrending() {
  const container = document.getElementById("trendingProducts");
  container.innerHTML = productsData
    .slice(0, visibleCount)
    .map(
      (product) => `
    <div class="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition">
      <img src="${product.image}" alt="${product.title}" class="w-full h-48 object-contain bg-gray-50">
      <div class="p-4">
        <p class="text-sm text-gray-500 mb-1">${product.category}</p>
        <h3 class="text-lg font-semibold mb-2">${product.title}</h3>
        <p class="text-blue-600 font-bold mb-2">$${product.price}</p>
        <div class="flex items-center mb-4">
          <span class="text-yellow-400">⭐</span>
          <span class="ml-2 text-gray-600">${product.rating?.rate} (${product.rating?.count})</span>
        </div>
        <div class="flex gap-2">
          <button onclick="showDetails(${product.id})" 
            class="flex-1 border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition">Details</button>
          <button onclick="addToCart(${product.id}, '${product.title}', ${product.price}, '${product.image}')" 
            class="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">Add</button>
        </div>
      </div>
    </div>
  `,
    )
    .join("");
}

// --- Load Categories ---
async function loadCategories() {
  const res = await fetch("https://fakestoreapi.com/products/categories");
  const categories = await res.json();

  const container = document.getElementById("categories");
  container.innerHTML = `
    <button onclick="loadProducts()" 
      class="px-4 py-2 rounded-lg bg-purple-600 text-white">All</button>
    ${categories
      .map(
        (cat) => `
      <button onclick="loadProducts('${cat}')" 
        class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-purple-600 hover:text-white transition">
        ${cat.charAt(0).toUpperCase() + cat.slice(1)}
      </button>
    `,
      )
      .join("")}
  `;
}

// --- Load Products by Category ---
async function loadProducts(category) {
  let url = "https://fakestoreapi.com/products";
  if (category) {
    url = `https://fakestoreapi.com/products/category/${category}`;
  }

  const res = await fetch(url);
  const products = await res.json();

  const container = document.getElementById("products");
  container.innerHTML = products
    .map(
      (product) => `
    <div class="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition">
      <img src="${product.image}" alt="${product.title}" class="w-full h-48 object-contain bg-gray-50">
      <div class="p-4">
        <h3 class="text-lg font-semibold mb-2">${product.title}</h3>
        <p class="text-blue-600 font-bold mb-2">$${product.price}</p>
        <div class="flex items-center mb-4">
          <span class="text-yellow-400">⭐</span>
          <span class="ml-2 text-gray-600">${product.rating?.rate} (${product.rating?.count})</span>
        </div>
        <div class="flex gap-2">
          <button onclick="showDetails(${product.id})" 
            class="flex-1 border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition">Details</button>
          <button onclick="addToCart(${product.id}, '${product.title}', ${product.price}, '${product.image}')" 
            class="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">Add</button>
        </div>
      </div>
    </div>
  `,
    )
    .join("");
}

// --- Show Product Details Modal ---
async function showDetails(id) {
  const res = await fetch(`https://fakestoreapi.com/products/${id}`);
  const product = await res.json();

  const modalContent = document.getElementById("modalContent");
  modalContent.innerHTML = `
    <img src="${product.image}" alt="${product.title}" class="w-full h-64 object-contain mb-4">
    <h2 class="text-2xl font-bold mb-2">${product.title}</h2>
    <p class="text-blue-600 font-bold mb-2">$${product.price}</p>
    <p class="text-gray-700 mb-4">${product.description}</p>
    <div class="flex items-center mb-4">
      <span class="text-yellow-400">⭐</span>
      <span class="ml-2 text-gray-600">${product.rating?.rate} (${product.rating?.count})</span>
    </div>
  `;
  document.getElementById("productModal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("productModal").classList.add("hidden");
}

// --- Cart System ---
function addToCart(id, title, price, image) {
  cart.push({ id, title, price, image });
  saveCart();
  document.getElementById("cartCount").innerText = cart.length;
}

function removeFromCart(index) {
  cart.splice(index, 1); // remove item by index
  saveCart();
  showCart(); // re-render cart modal
}

function showCart() {
  const cartItems = document.getElementById("cartItems");
  cartItems.innerHTML = cart
    .map(
      (item, index) => `
    <div class="flex items-center gap-4 mb-2">
      <img src="${item.image}" alt="${item.title}" class="w-12 h-12 object-contain">
      <div class="flex-1">
        <p class="font-semibold">${item.title}</p>
        <p class="text-blue-600">$${item.price}</p>
      </div>
      <button onclick="removeFromCart(${index})" 
        class="text-red-600 hover:text-red-800">✖</button>
    </div>
  `,
    )
    .join("");

  document.getElementById("totalItems").innerText = cart.length;
  document.getElementById("totalPrice").innerText = cart
    .reduce((sum, item) => sum + item.price, 0)
    .toFixed(2);

  document.getElementById("cartModal").classList.remove("hidden");
}

function closeCart() {
  document.getElementById("cartModal").classList.add("hidden");
}

// --- Initial load ---
loadTrending();
loadCategories();
loadProducts();
document.getElementById("cartCount").innerText = cart.length; // show saved cart count
