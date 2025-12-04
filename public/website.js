// Carousel script
// Updated: Dec 3, 2025 - v3 with admin debugging
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
  
  // Show Members Portal tab when logged in
  const memberPortalTab = document.querySelector(".gotoMembersPortal");
  if (memberPortalTab) {
    memberPortalTab.style.display = "inline-block";
  }
  
  // Show greeting next to logo
  const greetingLeft = document.getElementById("user-greeting-left");
  if (greetingLeft) {
    // Try to get first name from Firestore if available
    if (user && user.uid) {
      db.collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          console.log(greetingLeft);
          if (doc.exists && doc.data().firstName) {
            greetingLeft.textContent = `Hello, ${doc.data().firstName}`;
            greetingLeft.style.display = "inline-block";
          } else {
            greetingLeft.textContent = "Hello!";
            greetingLeft.style.display = "inline-block";
          }
          // Keep Members Portal visible regardless of registered_user status
          if (memberPortalTab) {
            memberPortalTab.style.display = "inline-block";
          }
        })
        .catch(() => {
          greetingLeft.textContent = "Hello!";
          greetingLeft.style.display = "inline-block";
          // Keep Members Portal visible even if there's an error
          if (memberPortalTab) {
            memberPortalTab.style.display = "inline-block";
          }
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
  
  // Hide Members Portal tab when logged out
  const memberPortalTab = document.querySelector(".gotoMembersPortal");
  if (memberPortalTab) {
    memberPortalTab.style.display = "none";
  }
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
        admin: 0,
        registered_user: 0,
        approved: false, // New users need admin approval
      });
    })
    .then(() => {
      alert("Account created! Please wait for admin approval to access the Members Portal.");
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
      
      // Restore the last visited page after auth is confirmed
      const currentPage = localStorage.getItem("currentPage");
      if (currentPage === "members") {
        // Check if user is approved before showing members portal
        openMembersPortal();
      } else if (currentPage === "home" || !currentPage) {
        // Show home if we're supposed to be on home
        Home.classList.remove("is-hidden");
        About.classList.add("is-hidden");
        MembersPortal.classList.add("is-hidden");
        Contact.classList.add("is-hidden");
      }
    } else {
      resetNav();
      const greetingLeft = document.getElementById("user-greeting-left");
      if (greetingLeft) greetingLeft.style.display = "none";
      
      // If not logged in and trying to view members portal, redirect to home
      const currentPage = localStorage.getItem("currentPage");
      if (currentPage === "members") {
        localStorage.setItem("currentPage", "home");
        Home.classList.remove("is-hidden");
        About.classList.add("is-hidden");
        MembersPortal.classList.add("is-hidden");
        Contact.classList.add("is-hidden");
      }
    }
  });
  
  // Restore non-protected pages immediately
  const currentPage = localStorage.getItem("currentPage");
  if (currentPage === "about") {
    Home.classList.add("is-hidden");
    About.classList.remove("is-hidden");
    MembersPortal.classList.add("is-hidden");
    Contact.classList.add("is-hidden");
  } else if (currentPage === "contact") {
    Home.classList.add("is-hidden");
    About.classList.add("is-hidden");
    MembersPortal.classList.add("is-hidden");
    Contact.classList.remove("is-hidden");
  } else if (currentPage === "members") {
    // Hide home immediately for members portal, wait for auth check
    Home.classList.add("is-hidden");
  }
  
  // Make main content visible after page is set
  const mainEl = document.querySelector("main");
  const footerEl = document.querySelector(".site-footer");
  if (mainEl) mainEl.style.opacity = "1";
  if (footerEl) footerEl.style.opacity = "1";
  
  // Home page is visible by default, Members portal is handled by auth state
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
    localStorage.setItem("currentPage", "home");
  });
});

gotoAbout.forEach((link) => {
  link.addEventListener("click", () => {
    Home.classList.add("is-hidden");
    About.classList.remove("is-hidden");
    MembersPortal.classList.add("is-hidden");
    Contact.classList.add("is-hidden");
    localStorage.setItem("currentPage", "about");
  });
});
function openMembersPortal() {
  if (!auth.currentUser) {
    alert("Please sign in to access the Members Portal.");
    return;
  }
  // read the documents to see if they are an admin

  db.collection("users")
    .doc(auth.currentUser.uid)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const userData = doc.data();
        const adminStatus = userData.admin || 0;
        const isApproved = userData.approved || false;
        
        console.log("User data:", userData);
        console.log("Admin status:", adminStatus);
        console.log("Approved:", isApproved);
        
        // If admin field is missing, add it
        if (userData.admin === undefined) {
          db.collection("users").doc(auth.currentUser.uid).update({ admin: 0 });
        }
        
        // Check if user is approved or is an admin
        if (adminStatus == 1) {
          // Admins can always access
          console.log("User is admin - showing controls");
          Home.classList.add("is-hidden");
          About.classList.add("is-hidden");
          MembersPortal.classList.remove("is-hidden");
          Contact.classList.add("is-hidden");
          localStorage.setItem("currentPage", "members");
          // Make content visible now that members portal is loaded
          const mainEl = document.querySelector("main");
          const footerEl = document.querySelector(".site-footer");
          if (mainEl) mainEl.style.visibility = "visible";
          if (footerEl) footerEl.style.visibility = "visible";
          all_users("edit");
        } else if (isApproved) {
          // Approved regular users can access
          console.log("User is approved - showing members portal");
          Home.classList.add("is-hidden");
          About.classList.add("is-hidden");
          MembersPortal.classList.remove("is-hidden");
          Contact.classList.add("is-hidden");
          localStorage.setItem("currentPage", "members");
          // Make content visible now that members portal is loaded
          const mainEl = document.querySelector("main");
          const footerEl = document.querySelector(".site-footer");
          if (mainEl) mainEl.style.visibility = "visible";
          if (footerEl) footerEl.style.visibility = "visible";
          all_users(0);
        } else {
          // Not approved yet - block access
          alert("Your account is pending admin approval. Please check back later.");
          Home.classList.remove("is-hidden");
          About.classList.add("is-hidden");
          MembersPortal.classList.add("is-hidden");
          Contact.classList.add("is-hidden");
          localStorage.setItem("currentPage", "home");
          // Make content visible when redirecting to home
          const mainEl = document.querySelector("main");
          const footerEl = document.querySelector(".site-footer");
          if (mainEl) mainEl.style.visibility = "visible";
          if (footerEl) footerEl.style.visibility = "visible";
        }
      } else {
        console.log("User document not found");
        alert("User account not found. Please contact an administrator.");
        // Make content visible on error
        const mainEl = document.querySelector("main");
        const footerEl = document.querySelector(".site-footer");
        if (mainEl) mainEl.style.visibility = "visible";
        if (footerEl) footerEl.style.visibility = "visible";
      }
    })
    .catch((error) => {
      console.error("Error checking admin status:", error);
      alert("Error loading Members Portal. Please try again.");
      // Make content visible on error
      const mainEl = document.querySelector("main");
      const footerEl = document.querySelector(".site-footer");
      if (mainEl) mainEl.style.visibility = "visible";
      if (footerEl) footerEl.style.visibility = "visible";
    });
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
    localStorage.setItem("currentPage", "contact");
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

// admin status
function all_users(mode) {
  if (mode == 0) {
    // don't show any user data for regular users
    r_e("registered_users").innerHTML = "";
    return;
  }

  // Show admin controls
  let adminHtml = `<div style="background:#fff; border-radius:18px; box-shadow:0 8px 32px rgba(64,107,140,0.10); border:2px solid #a3c0c8; padding:2rem; margin:2rem auto; max-width:800px;">
    <h2 style="color:#406b8c; font-size:2rem; margin-bottom:1.5rem;">Admin Controls</h2>
    
    <h3 style="color:#e67e22; font-size:1.5rem; margin-top:1rem;">Pending Approval:</h3>
    <div id="pending-users-list"></div>
    
    <h3 style="color:#406b8c; font-size:1.5rem; margin-top:1.5rem;">Approved Users:</h3>
    <div id="regular-users-list"></div>
    
    <h3 style="color:#406b8c; font-size:1.5rem; margin-top:1.5rem;">Admin Users:</h3>
    <div id="admin-users-list"></div>
  </div>`;
  
  r_e("registered_users").innerHTML = adminHtml;

  // Get pending users (not approved yet, not admin)
  db.collection("users")
    .get()
    .then((data) => {
      let html = `<div style="margin-top:1rem;">`;
      let pendingCount = 0;
      data.docs.forEach((d) => {
        const userData = d.data();
        // Filter for pending users: not approved AND not admin
        if ((userData.approved === false || userData.approved === undefined) && (userData.admin === 0 || userData.admin === undefined)) {
          pendingCount++;
          html += `<div style="padding:0.8rem; margin:0.5rem 0; background:#fff4e6; border:2px solid #e67e22; border-radius:8px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
            <div>
              <strong>${userData.firstName || 'N/A'} ${userData.lastName || ''}</strong> <span style="color:#e67e22; font-weight:600;">(Pending)</span><br>
              <small style="color:#6b7f8d;">${userData.email || d.id}</small>
            </div>
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
              <button onclick="approve_user('${d.id}')" style="background:#27ae60; color:#fff; border:none; padding:0.5rem 1rem; border-radius:8px; cursor:pointer; font-weight:600;">Approve</button>
              <button onclick="delete_user('${d.id}', '${userData.email || 'this user'}')" style="background:#ef4444; color:#fff; border:none; padding:0.5rem 1rem; border-radius:8px; cursor:pointer; font-weight:600;">Deny</button>
            </div>
          </div>`;
        }
      });
      if (pendingCount === 0) {
        html += `<p style="color:#6b7f8d; font-style:italic;">No users pending approval.</p>`;
      }
      html += `</div>`;
      document.getElementById("pending-users-list").innerHTML = html;
    });

  // Get approved regular users
  db.collection("users")
    .get()
    .then((data) => {
      let html = `<div style="margin-top:1rem;">`;
      let approvedCount = 0;
      data.docs.forEach((d) => {
        const userData = d.data();
        // Filter for approved non-admin users
        if (userData.approved === true && (userData.admin === 0 || userData.admin === undefined)) {
          approvedCount++;
          html += `<div style="padding:0.8rem; margin:0.5rem 0; background:#f7fafc; border-radius:8px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
            <div>
              <strong>${userData.firstName || 'N/A'} ${userData.lastName || ''}</strong><br>
              <small style="color:#6b7f8d;">${userData.email || d.id}</small>
            </div>
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
              <button onclick="make_admin('${d.id}')" style="background:#a3c0c8; color:#fff; border:none; padding:0.5rem 1rem; border-radius:8px; cursor:pointer; font-weight:600;">Make Admin</button>
              <button onclick="delete_user('${d.id}', '${userData.email || 'this user'}')" style="background:#ef4444; color:#fff; border:none; padding:0.5rem 1rem; border-radius:8px; cursor:pointer; font-weight:600;">Delete</button>
            </div>
          </div>`;
        }
      });
      if (approvedCount === 0) {
        html += `<p style="color:#6b7f8d; font-style:italic;">No approved users found.</p>`;
      }
      html += `</div>`;
      document.getElementById("regular-users-list").innerHTML = html;
    });

  // Get admin users
  db.collection("users")
    .get()
    .then((data) => {
      let html = `<div style="margin-top:1rem;">`;
      let adminCount = 0;
      data.docs.forEach((d) => {
        const userData = d.data();
        // Filter for admin users
        if (userData.admin === 1) {
          adminCount++;
          html += `<div style="padding:0.8rem; margin:0.5rem 0; background:#f7fafc; border-radius:8px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
            <div>
              <strong>${userData.firstName || 'N/A'} ${userData.lastName || ''}</strong> <span style="color:#406b8c; font-weight:600;">(Admin)</span><br>
              <small style="color:#6b7f8d;">${userData.email || d.id}</small>
            </div>
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
              <button onclick="make_regular_user('${d.id}')" style="background:#cbd5e1; color:#333; border:none; padding:0.5rem 1rem; border-radius:8px; cursor:pointer; font-weight:600;">Remove Admin</button>
              <button onclick="delete_user('${d.id}', '${userData.email || 'this admin'}')" style="background:#ef4444; color:#fff; border:none; padding:0.5rem 1rem; border-radius:8px; cursor:pointer; font-weight:600;">Delete</button>
            </div>
          </div>`;
        }
      });
      if (adminCount === 0) {
        html += `<p style="color:#6b7f8d; font-style:italic;">No admin users found.</p>`;
      }
      html += `</div>`;
      document.getElementById("admin-users-list").innerHTML = html;
    });
}
function make_admin(id) {
  // Verify current user is admin before allowing this action
  if (!auth.currentUser) {
    alert("You must be logged in to perform this action.");
    return;
  }
  
  db.collection("users").doc(auth.currentUser.uid).get().then((doc) => {
    if (!doc.exists || doc.data().admin !== 1) {
      alert("Only admins can perform this action.");
      return;
    }
    
    if (confirm("Make this user an admin?")) {
      db.collection("users")
        .doc(id)
        .update({
          admin: 1,
        })
        .then(() => {
          alert("User is now an admin!");
          all_users("edit");
        })
        .catch((error) => alert("Error: " + error.message));
    }
  });
}

function make_regular_user(id) {
  // Verify current user is admin before allowing this action
  if (!auth.currentUser) {
    alert("You must be logged in to perform this action.");
    return;
  }
  
  db.collection("users").doc(auth.currentUser.uid).get().then((doc) => {
    if (!doc.exists || doc.data().admin !== 1) {
      alert("Only admins can perform this action.");
      return;
    }
    
    if (confirm("Remove admin privileges from this user?")) {
      db.collection("users")
        .doc(id)
        .update({
          admin: 0,
        })
        .then(() => {
          alert("Admin privileges removed!");
          all_users("edit");
        })
        .catch((error) => alert("Error: " + error.message));
    }
  });
}

function delete_user(id, email) {
  // Verify current user is admin before allowing this action
  if (!auth.currentUser) {
    alert("You must be logged in to perform this action.");
    return;
  }
  
  db.collection("users").doc(auth.currentUser.uid).get().then((doc) => {
    if (!doc.exists || doc.data().admin !== 1) {
      alert("Only admins can perform this action.");
      return;
    }
    
    if (confirm(`Are you sure you want to permanently delete ${email}? This cannot be undone.`)) {
      db.collection("users")
        .doc(id)
        .delete()
        .then(() => {
          alert("User deleted successfully!");
          all_users("edit");
        })
        .catch((error) => alert("Error deleting user: " + error.message));
    }
  });
}

function approve_user(id) {
  // Verify current user is admin before allowing this action
  if (!auth.currentUser) {
    alert("You must be logged in to perform this action.");
    return;
  }
  
  db.collection("users").doc(auth.currentUser.uid).get().then((doc) => {
    if (!doc.exists || doc.data().admin !== 1) {
      alert("Only admins can perform this action.");
      return;
    }
    
    if (confirm("Approve this user to access the Members Portal?")) {
      db.collection("users")
        .doc(id)
        .update({
          approved: true,
        })
        .then(() => {
          alert("User approved!");
          all_users("edit");
        })
        .catch((error) => alert("Error: " + error.message));
    }
  });
}
