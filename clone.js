// ================= Slider Navigation =================
const imgs = document.querySelectorAll(".header-slider ul img");
const previousbtn = document.querySelector(".control-prev");
const nextbtn = document.querySelector(".control-next");

let n = 0;

function changeSlide() {
  for (let i = 0; i < imgs.length; i++) {
    imgs[i].style.display = "none";
  }
  imgs[n].style.display = "block";
}

if (imgs.length > 0) {
  changeSlide();
}

if (previousbtn) {
  previousbtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (n > 0) {
      n--;
    } else {
      n = imgs.length - 1;
    }
    changeSlide();
  });
}

if (nextbtn) {
  nextbtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (n < imgs.length - 1) {
      n++;
    } else {
      n = 0;
    }
    changeSlide();
  });
}

// Horizontal scroll for products slider
const scrollContainers = document.querySelectorAll(".products");
for (const item of scrollContainers) {
  item.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      item.scrollLeft += event.deltaY;
    },
    { passive: false }
  );
}

// ================= Persistent Cart Count =================
// Update cart badge on load
document.addEventListener("DOMContentLoaded", () => {
  if (typeof updateAllCartBadges === "function") {
    updateAllCartBadges();
  }
});
if (typeof updateAllCartBadges === "function") {
  updateAllCartBadges();
}

// Nav cart button click listener
const navCartBtn = document.getElementById("nav-cart-btn");
if (navCartBtn) {
  navCartBtn.addEventListener("click", () => {
    window.location.href = "cart.html";
  });
}

// ================= Navigate to Product Details Page =================
function navigateToProduct(productId) {
  if (!productId) productId = "phone";
  window.location.href = `product-details.html?id=${encodeURIComponent(productId)}`;
}

// Attach click listeners to all box-columns
const boxColumns = document.querySelectorAll(".box-column");
boxColumns.forEach((box) => {
  box.addEventListener("click", (e) => {
    // If user clicked the link directly, let default link action or navigate
    const productId = box.getAttribute("data-product") || "phone";
    navigateToProduct(productId);
  });
});

// Attach click listeners to all product slider images
const sliderImages = document.querySelectorAll(".product-slider .products img");
sliderImages.forEach((img) => {
  img.addEventListener("click", () => {
    const productId = img.getAttribute("data-product") || "prod1";
    navigateToProduct(productId);
  });
});
