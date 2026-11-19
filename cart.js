// ================= Amazon Cart Page Controller =================

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  renderRecommendations();
  setupCheckoutModal();
});

// Format currency in Indian Rupees
function formatINR(number) {
  return "₹" + Number(number).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Render the entire cart
function renderCart() {
  updateAllCartBadges();

  const items = getCartItems();
  const itemsContainer = document.getElementById("cart-items-list");
  const emptyState = document.getElementById("empty-cart-state");
  const subtotalFooter = document.getElementById("cart-subtotal-footer");
  const proceedBtn = document.getElementById("btn-proceed-checkout");

  const footerCount = document.getElementById("footer-count");
  const footerAmount = document.getElementById("footer-amount");
  const sidebarCount = document.getElementById("sidebar-count");
  const sidebarAmount = document.getElementById("sidebar-amount");

  if (!items || items.length === 0) {
    if (itemsContainer) itemsContainer.innerHTML = "";
    if (emptyState) emptyState.style.display = "flex";
    if (subtotalFooter) subtotalFooter.style.display = "none";
    if (proceedBtn) {
      proceedBtn.disabled = true;
      proceedBtn.style.opacity = "0.5";
      proceedBtn.style.cursor = "not-allowed";
    }
    if (footerCount) footerCount.textContent = "0";
    if (footerAmount) footerAmount.textContent = "₹0.00";
    if (sidebarCount) sidebarCount.textContent = "0";
    if (sidebarAmount) sidebarAmount.textContent = "₹0.00";
    return;
  }

  if (emptyState) emptyState.style.display = "none";
  if (subtotalFooter) subtotalFooter.style.display = "block";
  if (proceedBtn) {
    proceedBtn.disabled = false;
    proceedBtn.style.opacity = "1";
    proceedBtn.style.cursor = "pointer";
  }

  if (itemsContainer) {
    itemsContainer.innerHTML = "";
    let totalQty = 0;
    let totalPrice = 0;

    items.forEach((cartItem) => {
      const prod = (typeof productsData !== "undefined" && productsData[cartItem.id])
        ? productsData[cartItem.id]
        : {
            id: cartItem.id,
            title: "Selected Product",
            image: "photo1.jpeg",
            price: "999",
            rawPrice: 999
          };

      const qty = parseInt(cartItem.qty, 10) || 1;
      const rawPrice = prod.rawPrice || parseInt(String(prod.price).replace(/[^0-9]/g, ""), 10) || 999;
      const itemSubtotal = rawPrice * qty;

      totalQty += qty;
      totalPrice += itemSubtotal;

      const itemRow = document.createElement("div");
      itemRow.className = "cart-item-row";
      itemRow.setAttribute("data-product-id", prod.id);

      itemRow.innerHTML = `
        <input type="checkbox" class="cart-item-check" checked title="Select item for purchase" />
        <div class="cart-item-img-wrap" onclick="location.href='product-details.html?id=${encodeURIComponent(prod.id)}'">
          <img src="${prod.image}" alt="${prod.title}" />
        </div>
        <div class="cart-item-info">
          <a href="product-details.html?id=${encodeURIComponent(prod.id)}" class="cart-item-title">${prod.title}</a>
          <span class="cart-in-stock">In Stock</span>
          <span class="cart-shipping-note">Eligible for FREE Shipping</span>
          <label class="cart-gift-line">
            <input type="checkbox" /> This will be a gift
          </label>
          <div class="cart-action-row">
            <div class="cart-qty-stepper">
              <button type="button" class="cart-stepper-btn btn-minus" title="Decrease quantity">-</button>
              <span class="cart-qty-num">${qty}</span>
              <button type="button" class="cart-stepper-btn btn-plus" title="Increase quantity">+</button>
            </div>
            <span class="action-sep">|</span>
            <button type="button" class="cart-link-btn delete btn-delete">Delete</button>
            <span class="action-sep">|</span>
            <button type="button" class="cart-link-btn btn-save">Save for later</button>
            <span class="action-sep">|</span>
            <button type="button" class="cart-link-btn btn-share">Share</button>
          </div>
        </div>
        <div class="cart-item-price-col">
          ${formatINR(itemSubtotal)}
        </div>
      `;

      // Event Listeners for Item Actions
      const btnMinus = itemRow.querySelector(".btn-minus");
      const btnPlus = itemRow.querySelector(".btn-plus");
      const btnDelete = itemRow.querySelector(".btn-delete");
      const checkbox = itemRow.querySelector(".cart-item-check");

      if (btnMinus) {
        btnMinus.addEventListener("click", () => {
          if (qty > 1) {
            updateCartItemQty(prod.id, qty - 1);
            renderCart();
          } else {
            removeFromCart(prod.id);
            renderCart();
          }
        });
      }

      if (btnPlus) {
        btnPlus.addEventListener("click", () => {
          if (qty < 10) {
            updateCartItemQty(prod.id, qty + 1);
            renderCart();
          }
        });
      }

      if (btnDelete) {
        btnDelete.addEventListener("click", () => {
          removeFromCart(prod.id);
          renderCart();
        });
      }

      if (checkbox) {
        checkbox.addEventListener("change", recalculateSelectedSubtotals);
      }

      itemsContainer.appendChild(itemRow);
    });

    if (footerCount) footerCount.textContent = totalQty;
    if (footerAmount) footerAmount.textContent = formatINR(totalPrice);
    if (sidebarCount) sidebarCount.textContent = totalQty;
    if (sidebarAmount) sidebarAmount.textContent = formatINR(totalPrice);
  }
}

// Recalculate totals based on checked items
function recalculateSelectedSubtotals() {
  const rows = document.querySelectorAll(".cart-item-row");
  let selectedQty = 0;
  let selectedTotal = 0;

  rows.forEach((row) => {
    const check = row.querySelector(".cart-item-check");
    const id = row.getAttribute("data-product-id");
    const qtyEl = row.querySelector(".cart-qty-num");
    const qty = parseInt(qtyEl?.textContent, 10) || 1;
    const prod = productsData ? productsData[id] : null;
    const rawPrice = prod?.rawPrice || 999;

    if (check && check.checked) {
      selectedQty += qty;
      selectedTotal += rawPrice * qty;
    }
  });

  const footerCount = document.getElementById("footer-count");
  const footerAmount = document.getElementById("footer-amount");
  const sidebarCount = document.getElementById("sidebar-count");
  const sidebarAmount = document.getElementById("sidebar-amount");

  if (footerCount) footerCount.textContent = selectedQty;
  if (footerAmount) footerAmount.textContent = formatINR(selectedTotal);
  if (sidebarCount) sidebarCount.textContent = selectedQty;
  if (sidebarAmount) sidebarAmount.textContent = formatINR(selectedTotal);
}

// Deselect / Select All toggle
const deselectBtn = document.getElementById("deselect-all-btn");
let allSelected = true;
if (deselectBtn) {
  deselectBtn.addEventListener("click", () => {
    const checkboxes = document.querySelectorAll(".cart-item-check");
    allSelected = !allSelected;
    checkboxes.forEach((cb) => {
      cb.checked = allSelected;
    });
    deselectBtn.textContent = allSelected ? "Deselect all items" : "Select all items";
    recalculateSelectedSubtotals();
  });
}

// Render 4 Recommended Products at the bottom
function renderRecommendations() {
  const grid = document.getElementById("recommendations-grid");
  if (!grid || typeof productsData === "undefined") return;

  const recIds = ["phone", "mouse", "prod5", "bottle"];
  grid.innerHTML = "";

  recIds.forEach((id) => {
    const prod = productsData[id];
    if (!prod) return;

    const card = document.createElement("div");
    card.className = "rec-card";
    card.innerHTML = `
      <div class="rec-img-wrap" onclick="location.href='product-details.html?id=${encodeURIComponent(prod.id)}'">
        <img src="${prod.image}" alt="${prod.title}" />
      </div>
      <div>
        <a href="product-details.html?id=${encodeURIComponent(prod.id)}" class="rec-title">${prod.title}</a>
        <div class="rec-rating">
          <span class="stars"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star-half-stroke"></i></span>
          <span>${prod.rating || 4.5}</span>
        </div>
        <div class="rec-price">₹${prod.price}</div>
      </div>
      <button type="button" class="rec-btn-add" data-id="${prod.id}">
        <i class="fa-solid fa-cart-plus"></i> Add to Cart
      </button>
    `;

    const addBtn = card.querySelector(".rec-btn-add");
    if (addBtn) {
      addBtn.addEventListener("click", () => {
        addToCart(prod.id, 1);
        addBtn.innerHTML = '<i class="fa-solid fa-check"></i> Added!';
        addBtn.style.background = "#57e389";
        renderCart();
        setTimeout(() => {
          addBtn.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Add to Cart';
          addBtn.style.background = "#ffd814";
        }, 1500);
      });
    }

    grid.appendChild(card);
  });
}

// Setup Checkout Success Modal
function setupCheckoutModal() {
  const proceedBtn = document.getElementById("btn-proceed-checkout");
  const modal = document.getElementById("checkout-modal");
  const closeBtn = document.getElementById("modal-close-checkout");
  const returnHomeBtn = document.getElementById("btn-return-home");

  const modalItemsCount = document.getElementById("modal-items-count");
  const modalOrderTotal = document.getElementById("modal-order-total");
  const modalOrderNum = document.getElementById("modal-order-num");

  if (proceedBtn) {
    proceedBtn.addEventListener("click", () => {
      const items = getCartItems();
      if (!items || items.length === 0) return;

      const sidebarAmount = document.getElementById("sidebar-amount");
      const sidebarCount = document.getElementById("sidebar-count");

      if (modalItemsCount) modalItemsCount.textContent = sidebarCount ? sidebarCount.textContent : items.length;
      if (modalOrderTotal) modalOrderTotal.textContent = sidebarAmount ? sidebarAmount.textContent : "₹0.00";
      if (modalOrderNum) modalOrderNum.textContent = Math.floor(1000000 + Math.random() * 9000000);

      if (modal) modal.classList.add("active");
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("active");
    });
  }

  if (returnHomeBtn) {
    returnHomeBtn.addEventListener("click", () => {
      // Clear cart on successful checkout
      saveCartItems([]);
      window.location.href = "clone.html";
    });
  }
}
