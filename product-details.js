// ================= Product Details Page Controller =================

// Initialize cart count from localStorage
function getCartCount() {
  const saved = localStorage.getItem("amazonCartCount");
  return saved ? parseInt(saved, 10) : 0;
}

function updateCartBadge() {
  const count = getCartCount();
  const badges = document.querySelectorAll(".cart-count");
  badges.forEach((b) => {
    b.textContent = count;
  });
}

function setCartCount(newCount) {
  localStorage.setItem("amazonCartCount", newCount.toString());
  updateCartBadge();
}

// Generate star icons
function createStarsHtml(rating) {
  let html = "";
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.3;
  const empty = 5 - full - (hasHalf ? 1 : 0);

  for (let i = 0; i < full; i++) {
    html += '<i class="fa-solid fa-star"></i>';
  }
  if (hasHalf) {
    html += '<i class="fa-solid fa-star-half-stroke"></i>';
  }
  for (let i = 0; i < empty; i++) {
    html += '<i class="fa-regular fa-star"></i>';
  }
  return html;
}

// Extract query parameters
function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id") || "phone";
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();

  const productId = getProductIdFromUrl();
  const product = (typeof productsData !== "undefined" && productsData[productId]) 
    ? productsData[productId] 
    : (productsData ? productsData["phone"] : null);

  if (!product) {
    console.error("Product data not found!");
    return;
  }

  // Update Page Title
  document.title = `${product.title} - Amazon.in`;

  // Breadcrumbs
  const bcCat = document.getElementById("bc-cat");
  const bcTitle = document.getElementById("bc-title");
  if (bcCat) bcCat.textContent = product.category || "Products";
  if (bcTitle) bcTitle.textContent = product.title;

  // Image & Badge
  const detailImg = document.getElementById("detail-image");
  if (detailImg) {
    detailImg.src = product.image;
    detailImg.alt = product.title;
  }

  const detailBadge = document.getElementById("detail-badge");
  if (detailBadge) {
    detailBadge.textContent = product.badge || "Amazon's Choice";
    detailBadge.className = "detail-badge " + (product.badgeClass || "");
  }

  // Brand & Title
  const brandEl = document.getElementById("detail-brand");
  if (brandEl) brandEl.textContent = product.brand || "Amazon Brand";

  const titleEl = document.getElementById("detail-title");
  if (titleEl) titleEl.textContent = product.title;

  // Ratings & Reviews
  const starsEl = document.getElementById("detail-stars");
  if (starsEl) starsEl.innerHTML = createStarsHtml(product.rating || 4.5);

  const ratingValEl = document.getElementById("detail-rating-val");
  if (ratingValEl) ratingValEl.textContent = (product.rating || 4.5).toFixed(1);

  const ratingCountEl = document.getElementById("detail-rating-count");
  if (ratingCountEl) ratingCountEl.textContent = product.ratingCount || "1,000 ratings";

  const boughtEl = document.getElementById("detail-bought");
  if (boughtEl) boughtEl.textContent = product.boughtPastMonth || "1K+ bought in past month";

  // Price & MRP
  const discountEl = document.getElementById("detail-discount");
  if (discountEl) discountEl.textContent = product.discount || "-20%";

  const priceEl = document.getElementById("detail-price");
  if (priceEl) priceEl.textContent = product.price;

  const mrpEl = document.getElementById("detail-mrp");
  if (mrpEl) mrpEl.textContent = product.mrp;

  // Buybox price & delivery
  const buyboxPriceEl = document.getElementById("buybox-price");
  if (buyboxPriceEl) buyboxPriceEl.textContent = product.price;

  const buyboxDelivery = document.getElementById("buybox-delivery");
  if (buyboxDelivery && product.deliveryDate) {
    buyboxDelivery.textContent = product.deliveryDate;
  }

  // Offers Cards
  const offersList = document.getElementById("offers-list");
  if (offersList && product.offers) {
    offersList.innerHTML = "";
    product.offers.forEach((offer, idx) => {
      const parts = offer.split(":");
      const title = parts[0] ? parts[0].trim() : `Offer ${idx + 1}`;
      const desc = parts[1] ? parts[1].trim() : offer;
      const card = document.createElement("div");
      card.className = "offer-card";
      card.innerHTML = `<h4>${title}</h4><p>${desc}</p>`;
      offersList.appendChild(card);
    });
  }

  // Specs Preview Table
  const specsPreview = document.getElementById("specs-preview");
  if (specsPreview && product.specs) {
    specsPreview.innerHTML = "";
    const entries = Object.entries(product.specs).slice(0, 5);
    entries.forEach(([key, val]) => {
      specsPreview.innerHTML += `
        <div class="spec-key">${key}</div>
        <div class="spec-val">${val}</div>
      `;
    });
  }

  // Feature Bullet Points
  const featuresList = document.getElementById("detail-features");
  if (featuresList && product.features) {
    featuresList.innerHTML = "";
    product.features.forEach((feat) => {
      const li = document.createElement("li");
      li.textContent = feat;
      featuresList.appendChild(li);
    });
  }

  // Full Technical Specifications Grid
  const techSpecsTable = document.getElementById("tech-specs-table");
  if (techSpecsTable && product.specs) {
    techSpecsTable.innerHTML = "";
    Object.entries(product.specs).forEach(([k, v]) => {
      const row = document.createElement("div");
      row.className = "tech-spec-row";
      row.innerHTML = `<span class="spec-name">${k}</span><span class="spec-val">${v}</span>`;
      techSpecsTable.appendChild(row);
    });
  }

  // Review Summary Card
  const revNum = document.getElementById("review-rating-num");
  if (revNum) revNum.textContent = (product.rating || 4.5).toFixed(1);

  const revStars = document.getElementById("review-stars");
  if (revStars) revStars.innerHTML = createStarsHtml(product.rating || 4.5);

  const revSub = document.getElementById("review-ratings-sub");
  if (revSub) {
    revSub.textContent = `${(product.rating || 4.5).toFixed(1)} out of 5 stars based on ${product.ratingCount || "1,000 ratings"}`;
  }

  // Quantity Stepper
  let currentQty = 1;
  const qtyDisplay = document.getElementById("qty-display");
  const qtyMinus = document.getElementById("qty-minus-btn");
  const qtyPlus = document.getElementById("qty-plus-btn");

  if (qtyPlus) {
    qtyPlus.addEventListener("click", () => {
      if (currentQty < 10) {
        currentQty++;
        qtyDisplay.textContent = currentQty;
      }
    });
  }

  if (qtyMinus) {
    qtyMinus.addEventListener("click", () => {
      if (currentQty > 1) {
        currentQty--;
        qtyDisplay.textContent = currentQty;
      }
    });
  }

  // Add to Cart
  const addCartBtn = document.getElementById("btn-add-cart");
  const cartAlert = document.getElementById("cart-alert");
  const alertQty = document.getElementById("alert-qty");

  if (addCartBtn) {
    addCartBtn.addEventListener("click", () => {
      const currentTotal = getCartCount();
      const updatedTotal = currentTotal + currentQty;
      setCartCount(updatedTotal);

      addCartBtn.innerHTML = '<i class="fa-solid fa-check"></i> Added to Cart!';
      addCartBtn.style.background = "#57e389";

      if (alertQty) alertQty.textContent = currentQty;
      if (cartAlert) {
        cartAlert.style.display = "flex";
        setTimeout(() => {
          cartAlert.style.display = "none";
        }, 3500);
      }

      setTimeout(() => {
        addCartBtn.innerHTML = '<i class="fa-solid fa-cart-shopping"></i> Add to Cart';
        addCartBtn.style.background = "#ffd814";
      }, 2500);
    });
  }

  // Buy Now
  const buyNowBtn = document.getElementById("btn-buy-now");
  if (buyNowBtn) {
    buyNowBtn.addEventListener("click", () => {
      alert(`Proceeding to instant checkout for ${currentQty} unit(s) of "${product.title}"!\nTotal: ₹${(product.rawPrice * currentQty).toLocaleString()}`);
    });
  }

  // Wishlist Button
  const wishlistBtn = document.getElementById("btn-wishlist");
  if (wishlistBtn) {
    wishlistBtn.addEventListener("click", () => {
      const heart = wishlistBtn.querySelector("i");
      if (heart.classList.contains("fa-regular")) {
        heart.className = "fa-solid fa-heart";
        heart.style.color = "#cc0c39";
        wishlistBtn.innerHTML = '<i class="fa-solid fa-heart" style="color: #cc0c39;"></i> Added to Wish List';
      } else {
        heart.className = "fa-regular fa-heart";
        heart.style.color = "";
        wishlistBtn.innerHTML = '<i class="fa-regular fa-heart"></i> Add to Wish List';
      }
    });
  }
});
