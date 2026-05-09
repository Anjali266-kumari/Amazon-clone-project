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
changeSlide();

previousbtn.addEventListener("click", (e) => {
  if (n > 0) {
    n--;
  } else {
    n = imgs.length - 1;
  }
  changeSlide();
});

nextbtn.addEventListener("click", (e) => {
  if (n < imgs.length - 1) {
    n++;
  } else {
    n = 0;
  }
  changeSlide();
});

const scrollContainers = document.querySelectorAll(".products");

for (const item of scrollContainers) {
  item.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      item.scrollLeft += event.deltaY;
    },
    { passive: false },
  );
}
