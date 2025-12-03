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
//
//
//

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

function showLogoutOnly(user) {
  document.getElementById("nav-signin").style.display = "none";
  document.getElementById("nav-signup").style.display = "none";
  document.getElementById("user-greeting").style.display = "none";
  document.getElementById("logout-btn").style.display = "inline-block";
  // Show greeting next to logo
  const greetingLeft = document.getElementById("user-greeting-left");
  if (greetingLeft) {
    // Try to get first name from Firestore if available
    if (user && user.uid) {
      db.collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          if (doc.exists && doc.data().firstName) {
            greetingLeft.textContent = `Hello, ${doc.data().firstName}`;
            greetingLeft.style.display = "inline-block";
          } else {
            greetingLeft.textContent = "Hello!";
            greetingLeft.style.display = "inline-block";
          }
        })
        .catch(() => {
          greetingLeft.textContent = "Hello!";
          greetingLeft.style.display = "inline-block";
        });
    } else {
      greetingLeft.textContent = "Hello!";
      greetingLeft.style.display = "inline-block";
    }
  }
}

function resetNav() {
  document.getElementById("nav-signin").style.display = "inline-block";
  document.getElementById("nav-signup").style.display = "inline-block";
  document.getElementById("user-greeting").style.display = "none";
  document.getElementById("logout-btn").style.display = "none";
}

// Note to self: use command + / to comment chunks out!
// a function to return elements by their IDs
function r_e(id) {
  return document.querySelector(`#${id}`);
}

let signedin = false;

// Sign up function
r_e("signup-form").addEventListener("submit", (e) => {
  e.preventDefault();
  let fname = r_e("signup-first").value;
  let lname = r_e("signup-last").value;
  let email = r_e("signup-email").value;
  let pass = r_e("signup-password").value;
  auth
    .createUserWithEmailAndPassword(email, pass)
    .then((userCredential) => {
      closeModals();
      showLogoutOnly(userCredential.user);
      const user = userCredential.user;
      r_e("signup_err_msg").innerHTML = "";
      r_e("signup-email").value = "";
      r_e("signup-password").value = "";
      signedin = true;
      return db.collection("users").doc(user.uid).set({
        firstName: fname,
        lastName: lname,
        email: email,
      });
    })
    .catch((error) => {
      r_e("signup_err_msg").classList.remove("is-hidden");
      r_e("signup_err_msg").innerHTML = error.message;
      r_e("signup_err_msg").classList.add("has-text-danger");
      console.error("Error during sign up:", error.message);
    });
});

// Sign In Function
r_e("signin-form").addEventListener("submit", (e) => {
  e.preventDefault();
  let email = r_e("signin-email").value;
  let pass = r_e("signin-password").value;
  auth
    .signInWithEmailAndPassword(email, pass)
    .then((userCredential) => {
      closeModals();
      showLogoutOnly(userCredential.user);
      r_e("signin_err_msg").innerHTML = "";
      r_e("signin-email").value = "";
      r_e("signin-password").value = "";
      signedin = true;
    })
    .catch((error) => {
      const msg =
        typeof error.message === "string" && error.message.includes("{")
          ? JSON.parse(error.message).error.message
          : error.message;
      r_e("signin_err_msg").classList.remove("is-hidden");
      r_e("signin_err_msg").innerHTML = msg;
      r_e("signin_err_msg").classList.add("has-text-danger");
    });
});

// Signout Function
r_e("logout-btn").addEventListener("click", () => {
  auth.signOut();
  resetNav();
  signedin = false;
});

// Ensure nav buttons and greeting reflect auth state after reload, after DOM is ready
window.addEventListener("DOMContentLoaded", () => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      showLogoutOnly(user);
    } else {
      resetNav();
      const greetingLeft = document.getElementById("user-greeting-left");
      if (greetingLeft) greetingLeft.style.display = "none";
    }
  });
});

//
//
//
// Single Page App
// defining pages
const Home = r_e("Home");
const About = r_e("About");
const MembersPortal = r_e("members-portal");
const Contact = r_e("contact");
// console.log(Home);
// console.log(About);
// console.log(MembersPortal);
// console.log(Contact);

const gotoHome = document.querySelectorAll(".gotoHome");
const gotoAbout = document.querySelectorAll(".gotoAbout");
const gotoMembersPortal = document.querySelectorAll(".gotoMembersPortal");
const gotoContact = document.querySelectorAll(".gotoContact");

// hide all pages & make them appear only when called
gotoHome.forEach((link) => {
  link.addEventListener("click", () => {
    Home.classList.remove("is-hidden");
    About.classList.add("is-hidden");
    MembersPortal.classList.add("is-hidden");
    Contact.classList.add("is-hidden");
  });
});

gotoAbout.forEach((link) => {
  link.addEventListener("click", () => {
    Home.classList.add("is-hidden");
    About.classList.remove("is-hidden");
    MembersPortal.classList.add("is-hidden");
    Contact.classList.add("is-hidden");
  });
});
function openMembersPortal() {
  if (!auth.currentUser) {
    alert("Please sign in to access the Members Portal.");
    return;
  }

  Home.classList.add("is-hidden");
  About.classList.add("is-hidden");
  MembersPortal.classList.remove("is-hidden");
  Contact.classList.add("is-hidden");
}

gotoMembersPortal.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    openMembersPortal();
  });
});

gotoContact.forEach((link) => {
  link.addEventListener("click", () => {
    Home.classList.add("is-hidden");
    About.classList.add("is-hidden");
    MembersPortal.classList.add("is-hidden");
    Contact.classList.remove("is-hidden");
  });
});

function clearActiveNav() {
  document
    .querySelectorAll(".nav-right a, .nav-right p")
    .forEach((el) => el.classList.remove("active"));
}

function setActiveNav(el) {
  clearActiveNav();
  if (el) el.classList.add("active");
}

// attach click handlers to nav items
document.querySelectorAll(".nav-right a, .nav-right p").forEach((el) => {
  el.addEventListener("click", (e) => {
    // if it's an anchor that navigates away, active state is still useful pre-navigation
    setActiveNav(el);
  });
});

// on load, set active based on current URL (for multi-page links)
window.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname.split("/").pop();
  if (!path || path === "index.html") {
    // mark Home - find .gotoHome or nothing
    const homeEl =
      document.querySelector(".gotoHome") ||
      document.querySelector('.nav-right a[href="index.html"]');
    if (homeEl) setActiveNav(homeEl);
  } else {
    // try to find an anchor with matching href
    const match = document.querySelector(`.nav-right a[href="${path}"]`);
    if (match) setActiveNav(match);
  }
});

// // Members portal shows only when signed in
// if (signedin == true) {
//   MembersPortal.classList.remove("is-hidden");
// }
