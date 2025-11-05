// Carousel script
(function () {
  const track = document.querySelector(".carousel-track");
  if (!track) return;
  const slides = Array.from(track.children);
  const prevButton = document.querySelector(".carousel-button.prev");
  const nextButton = document.querySelector(".carousel-button.next");
  const slideWidth = slides[0].getBoundingClientRect().width;

  // arrange slides next to one another
  const setSlidePosition = (slide, index) => {
    slide.style.left = 100 * index + "%";
  };
  slides.forEach(setSlidePosition);

  let currentIndex = 0;

  const moveToSlide = (index) => {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    track.style.transform = "translateX(-" + 100 * index + "%)";
    currentIndex = index;
  };

  nextButton.addEventListener("click", () => moveToSlide(currentIndex + 1));
  prevButton.addEventListener("click", () => moveToSlide(currentIndex - 1));

  // autoplay
  let autoplay = setInterval(() => moveToSlide(currentIndex + 1), 4000);
  const carousel = document.querySelector(".carousel");
  carousel.addEventListener("mouseenter", () => clearInterval(autoplay));
  carousel.addEventListener("mouseleave", () => {
    autoplay = setInterval(() => moveToSlide(currentIndex + 1), 4000);
  });

  // responsive: ensure slides still positioned if window resized
  window.addEventListener("resize", () => slides.forEach(setSlidePosition));
})();

// Modal forms for sign in and sign up
const signUpBtn = document.querySelector(
  '.btn.btn-primary[href="signup.html"]'
);
const signInBtn = document.querySelector(
  '.btn.btn-outline[href="signin.html"]'
);
const signupModal = document.getElementById("signup-modal");
const signinModal = document.getElementById("signin-modal");
const closeSignup = document.getElementById("close-signup");
const closeSignin = document.getElementById("close-signin");

function openModal(modal) {
  modal.style.display = "block";
}
function closeModals() {
  signupModal.style.display = "none";
  signinModal.style.display = "none";
}
if (signUpBtn)
  signUpBtn.addEventListener("click", (e) => {
    e.preventDefault();
    openModal(signupModal);
  });
if (signInBtn)
  signInBtn.addEventListener("click", (e) => {
    e.preventDefault();
    openModal(signinModal);
  });
closeSignup.addEventListener("click", closeModals);
closeSignin.addEventListener("click", closeModals);

function showLogoutOnly() {
  document.getElementById("nav-signin").style.display = "none";
  document.getElementById("nav-signup").style.display = "none";
  document.getElementById("user-greeting").style.display = "none";
  document.getElementById("logout-btn").style.display = "inline-block";
}

function resetNav() {
  document.getElementById("nav-signin").style.display = "inline-block";
  document.getElementById("nav-signup").style.display = "inline-block";
  document.getElementById("user-greeting").style.display = "none";
  document.getElementById("logout-btn").style.display = "none";
}

document.getElementById("signup-form").addEventListener("submit", function (e) {
  e.preventDefault();
  closeModals();
  showLogoutOnly();
});

document.getElementById("signin-form").addEventListener("submit", function (e) {
  e.preventDefault();
  closeModals();
  showLogoutOnly();
});

document.getElementById("logout-btn").addEventListener("click", function () {
  resetNav();
});

// Note to self: use command + / to comment chunks out!
// a function to return elements by their IDs
function r_e(id) {
  return document.querySelector(`#${id}`);
}

// Sign up function
r_e("signup-form").addEventListener("submit", (e) => {
  // prevent page from auto refresh
  e.preventDefault();
  // capture fname, lname, email, and pass
  let fname = r_e("signup-first").value;
  let lname = r_e("signup-last").value;
  let email = r_e("signup-email").value;
  let pass = r_e("signup-password").value;
  console.log(fname, lname, email, pass);
  // create user
  auth.createUserWithEmailAndPassword(email, pass).then(() => {
    console.log("User created successfully");
  });
  //   .then((userCredential) => {
  //     console.log("User created successfully:", userCredential.user);
  //   })
  //   .catch((error) => {
  //     console.error(error.message);
  //   });
  // });

  // .then(() => {
  //   // hide the modal, clear the form
  //   loginmodal.classList.remove("is-active");
  //   r_e("signup_form").reset();
  //   r_e("signup_err_msg").innerHTML = "";
  //   r_e("email2").value = "";
  //   r_e("password2").value = "";
  //   signedin = true;
  // })
  //   .catch((err) => {
  //     // make the p show + display the err.message on the page (in red)
  //     r_e("signup_err_msg").classList.remove("is-hidden");
  //     r_e("signup_err_msg").innerHTML = err.message;
  //     r_e("signup_err_msg").classList.add("has-text-danger");
  //   });
});
