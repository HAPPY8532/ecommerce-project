// Global references
const heroSection = document.querySelector(".hero");
const categorySection = document.querySelector(".categorys");
const kidsContainer = document.querySelector(".products-section");
const productContainer = document.querySelectorAll(".products-container");
const productDetails = document.querySelector(".product-details");
const categoryButtons = document.querySelectorAll(".category-buttons");
const searchBox = document.querySelector(".search-box");
const wraper = document.querySelector(".wraper");
const countItem = document.getElementById("cart-count");
const salecontainer = document.querySelector(".sale-container");
const cartIcon = document.querySelector(".cart");
const backbtn = document.querySelector(".back");

let allProducts = [];
let cart = [];

// Show all products initially
function showAllProducts() {
  heroSection.style.display = "block";
  categorySection.style.display = "block";
  kidsContainer.style.display = "block";
  productDetails.style.display = "none";
  wraper.style.display = "none";

  const evenProducts = allProducts.filter((product) => product.id % 7 === 0);
  showProducts(evenProducts);
}
// Go back to all products
function goBack() {
  heroSection.style.display = "block";
  categorySection.style.display = "block";
  kidsContainer.style.display = "block";
  salecontainer.style.display = "block";
  productDetails.style.display = "none";
  wraper.style.display = "none";
      backbtn.style.display = "none"

  showAllProducts();
}

// Make goBack globally available
window.goBack = goBack;


// Show products dynamically
function showProducts(productsToShow) {
  productContainer.forEach((section) => (section.innerHTML = ""));

  if (productsToShow.length === 0) {
    productContainer.forEach((section) => {
      section.innerHTML = "<p>No products found.</p>";
    });
    return;
  }

  productsToShow.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <div class="image-container">
        <img src="${product.image}" alt="${product.title}">
      </div>
      <div class="price">
        <h3>${product.title}</h3>
        <p class="description">${product.description.slice(0, 60)}...</p>
        <p>$${product.price}</p>
        <button class="add-to-cart">Add to Cart</button>
      </div>
    `;

    card.addEventListener("click", () => showDetails(product));

    const addBtn = card.querySelector(".add-to-cart");
    addBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      addCartItem(product);
    });

    productContainer.forEach((section) => {
      const clonedCard = card.cloneNode(true);
      const clonedBtn = clonedCard.querySelector(".add-to-cart");

      clonedCard.addEventListener("click", () => showDetails(product));
      clonedBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        addCartItem(product);
      });

      section.appendChild(clonedCard);
    });
  });
}

// Filter by category
function setupCategoryFilter() {
  categoryButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const selectedCategory = btn.dataset.category;
      if (!selectedCategory) return;

      const filtered = allProducts.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );

      heroSection.style.display = "none";
      categorySection.style.display = "none";
      kidsContainer.style.display = "block";
      productDetails.style.display = "none";
      wraper.style.display = "none";
          backbtn.style.display = "none"


      showProducts(filtered);
    });
  });
}

// Filter by search
function setupSearchFilter() {
  searchBox.addEventListener("input", () => {
    const query = searchBox.value.toLowerCase().trim();

    const searched = allProducts.filter((p) =>
      p.title.toLowerCase().includes(query)
    );

    heroSection.style.display = "none";
    categorySection.style.display = "none";
    kidsContainer.style.display = "block";
    productDetails.style.display = "none";
    wraper.style.display = "none";
        backbtn.style.display = "none"


    showProducts(searched);
  });
}

// Show product detail
function showDetails(product) {
  heroSection.style.display = "none";
  categorySection.style.display = "none";
  kidsContainer.style.display = "none";
  productDetails.style.display = "block";
  wraper.style.display = "none";
    backbtn.style.display = "none"


  productDetails.innerHTML = `
    <div class="product-detail">
      <div class="img-contain">
        <img src="${product.image}" alt="${product.title}">
      </div>
      <div class="detail-contain">
        <h2>${product.title}</h2>
        <p><strong>Price:</strong> $${product.price}</p>
        <p><strong>Description:</strong> ${product.description}</p>
        <button onclick="goBack()">Go Back</button>
        <button onclick='addCartItem(${JSON.stringify(product)})'>Add to Cart</button>
      </div>
    </div>
  `;
}

// Add to Cart
function addCartItem(product) {
  const exists = cart.find((item) => item.id === product.id);
  if (exists) {
    alert("Product is already in cart!");
    return;
  }

  product.quantity = 1;
  cart.push(product);
  renderCartItems();
  updateCartTotal();
}

// Render cart
function renderCartItems() {
  const cartContainer = document.querySelector(".cart-item");
  if (!cartContainer) return;

  cartContainer.innerHTML = `
    <div class="cart-container">
      ${cart
        .map(
          (item, index) => `
        <div class="cart-card" data-index="${index}">
          <div class="cart-img">
            <img src="${item.image}" width="40" />
          </div>
          <div class="cart-details">
            ${item.title} - $${item.price}
          </div>
          <div class="cart-btn">
            <button class="add">+</button>
            <p class="quantity">${item.quantity}</p>
            <button class="subtract">-</button>
          </div>
          <button class="remove-item">Remove</button>
        </div>
      `
        )
        .join("")}
    </div>
  `;

  setupCartButtons();
  updateCartTotal();
}

// Update cart total
function updateCartTotal() {
  const cartTotalBox = document.querySelector(".cart-total");
  if (!cartTotalBox) return;

  const totalCount = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2);

  countItem.innerText = totalCount;

  cartTotalBox.innerHTML = `
    <div class="total-box">
      <h3>Total Items: ${totalCount}</h3>
      <h3>Total Price: $${totalPrice}</h3>
    </div>
  `;
}

// Setup cart buttons
function setupCartButtons() {
  document.querySelectorAll(".add").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = e.target.closest(".cart-card").dataset.index;
      cart[index].quantity++;
      renderCartItems();
    });
  });

  document.querySelectorAll(".subtract").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = e.target.closest(".cart-card").dataset.index;
      if (cart[index].quantity > 1) {
        cart[index].quantity--;
      } else {
        cart.splice(index, 1);
      }
      renderCartItems();
    });
  });

  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = e.target.closest(".cart-card").dataset.index;
      cart.splice(index, 1);
      renderCartItems();
    });
  });
}

// Cart icon click
cartIcon.addEventListener("click", () => {
  heroSection.style.display = "none";
  categorySection.style.display = "none";
  kidsContainer.style.display = "none";
  salecontainer.style.display = "none";
  productDetails.style.display = "none";
  wraper.style.display = "block";
  backbtn.style.display = "block"
});

// Back button
backbtn.addEventListener("click", () => 
  goBack());



// Initialize everything
fetch("products.json")
  .then((res) => res.json())
  .then((data) => {
    allProducts = data;
    showAllProducts();
    setupCategoryFilter();
    setupSearchFilter();
  })
  .catch((err) => {
    console.error("Failed to fetch products:", err);
    productContainer.forEach((section) => {
      section.innerHTML = "<p>Failed to load products.</p>";
    });
  });
