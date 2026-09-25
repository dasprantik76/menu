// Owner Portal State & Controller
let currentUser = null;
let currentBusiness = null;

// DOM Elements
const loadingView = document.getElementById("loadingView");
const authView = document.getElementById("authView");
const registerView = document.getElementById("registerView");
const pendingView = document.getElementById("pendingView");
const dashboardView = document.getElementById("dashboardView");
const brandingView = document.getElementById("brandingView");

// Branding DOM Elements
const brandingForm = document.getElementById("brandingForm");
const brandingLogoInput = document.getElementById("brandingLogoInput");
const brandingLogoDropzone = document.getElementById("brandingLogoDropzone");
const brandingLogoPlaceholder = document.getElementById("brandingLogoPlaceholder");
const brandingLogoPreviewWrapper = document.getElementById("brandingLogoPreviewWrapper");
const brandingLogoPreviewImg = document.getElementById("brandingLogoPreviewImg");
const brandingLogoFileName = document.getElementById("brandingLogoFileName");
const brandingLogoFileSize = document.getElementById("brandingLogoFileSize");
const brandingLogoCaption = document.getElementById("brandingLogoCaption");
const brandingNoPhotoText = document.getElementById("brandingNoPhotoText");
const brandingChangeLogoBtn = document.getElementById("brandingChangeLogoBtn");
const brandingRemoveLogoBtn = document.getElementById("brandingRemoveLogoBtn");
const brandingBizNameInput = document.getElementById("brandingBizNameInput");
const brandingBizNameErrorMsg = document.getElementById("brandingBizNameErrorMsg");
const brandingOwnerNameInput = document.getElementById("brandingOwnerNameInput");
const brandingOwnerNameErrorMsg = document.getElementById("brandingOwnerNameErrorMsg");
const brandingPhoneInput = document.getElementById("brandingPhoneInput");
const brandingPhoneErrorMsg = document.getElementById("brandingPhoneErrorMsg");
const brandingSubmitBtn = document.getElementById("brandingSubmitBtn");
const brandingBtnLabel = document.getElementById("brandingBtnLabel");
const brandingSaveSpinner = document.getElementById("brandingSaveSpinner");

let brandingUploadedLogoData = "";
let brandingInitialValues = {
  name: "",
  ownerName: "",
  phone: "",
  logoUrl: ""
};

function checkBrandingFormChanged() {
  if (!brandingSubmitBtn) return false;
  const currentOwnerName = brandingOwnerNameInput ? brandingOwnerNameInput.value.trim() : "";
  const currentBizName = brandingBizNameInput ? brandingBizNameInput.value.trim() : "";
  const currentPhone = brandingPhoneInput ? brandingPhoneInput.value.trim() : "";
  const currentLogo = (brandingUploadedLogoData || "").trim();

  const isChanged = (
    currentOwnerName !== (brandingInitialValues.ownerName || "") ||
    currentBizName !== (brandingInitialValues.name || "") ||
    currentPhone !== (brandingInitialValues.phone || "") ||
    currentLogo !== (brandingInitialValues.logoUrl || "")
  );

  brandingSubmitBtn.disabled = !isChanged;
  return isChanged;
}

const userProfileArea = document.getElementById("userProfileArea");
const userAvatar = document.getElementById("userAvatar");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const userRole = document.getElementById("userRole");
const logoutBtn = document.getElementById("logoutBtn");
const notificationBanner = document.getElementById("notificationBanner");

const devAuthForm = document.getElementById("devAuthForm");
const devEmailInput = document.getElementById("devEmailInput");

const registerBusinessForm = document.getElementById("registerBusinessForm");
const registerLogoutBtn = document.getElementById("registerLogoutBtn");
const pendingLogoutBtn = document.getElementById("pendingLogoutBtn");
const bizNameInput = document.getElementById("bizNameInput");
const bizNameErrorMsg = document.getElementById("bizNameErrorMsg");
const ownerNameInput = document.getElementById("ownerNameInput");
const ownerNameErrorMsg = document.getElementById("ownerNameErrorMsg");
const bizPhoneInput = document.getElementById("bizPhoneInput");
const phoneErrorMsg = document.getElementById("phoneErrorMsg");
const bizSlugInput = document.getElementById("bizSlugInput");
const slugPreviewText = document.getElementById("slugPreviewText");
const checkStatusBtn = document.getElementById("checkStatusBtn");

// Logo upload elements
const logoUploadDropzone = document.getElementById("logoUploadDropzone");
const bizLogoInput = document.getElementById("bizLogoInput");
const logoUploadPlaceholder = document.getElementById("logoUploadPlaceholder");
const logoUploadPreviewWrapper = document.getElementById("logoUploadPreviewWrapper");
const logoPreviewImg = document.getElementById("logoPreviewImg");
const logoFileName = document.getElementById("logoFileName");
const logoFileSize = document.getElementById("logoFileSize");
const removeLogoBtn = document.getElementById("removeLogoBtn");

let uploadedLogoData = "";

// Title Word Rotation (Restaurant -> Café -> Bar -> Dhaba)
const registerTitleRotator = document.getElementById("registerTitleRotator");
const rotatingWords = ["Restaurant", "Café", "Bar", "Dhaba"];
let currentWordIndex = 0;
let wordRotateTimer = null;

function startTitleWordRotation() {
  if (wordRotateTimer) return;
  wordRotateTimer = setInterval(() => {
    const rotator = registerTitleRotator || document.getElementById("registerTitleRotator");
    if (!rotator) return;
    const regView = document.getElementById("registerView");
    if (regView && (regView.style.display === "none" || !document.body.classList.contains("register-mode"))) {
      return;
    }

    const currentSpan = rotator.querySelector(".register-title-accent:not(.word-exit-up)");
    if (!currentSpan) return;

    currentWordIndex = (currentWordIndex + 1) % rotatingWords.length;
    const nextWord = rotatingWords[currentWordIndex];

    const nextSpan = document.createElement("span");
    nextSpan.className = "register-title-accent word-enter-from-bottom";
    nextSpan.textContent = nextWord;
    rotator.appendChild(nextSpan);

    // Force frame so word-enter-from-bottom takes effect before animating
    void nextSpan.offsetWidth;

    // Old text slides up above (word-exit-up), new text slides up from bottom
    currentSpan.classList.add("word-exit-up");
    nextSpan.classList.remove("word-enter-from-bottom");

    setTimeout(() => {
      if (currentSpan && currentSpan.parentNode) {
        currentSpan.remove();
      }
    }, 660);
  }, 2600);
}
startTitleWordRotation();

// Hamburger Drawer Elements
const hamburgerBtn = document.getElementById("hamburgerBtn");
const drawerOverlay = document.getElementById("drawerOverlay");
const drawerSidebar = document.getElementById("drawerSidebar");
const closeDrawerBtn = document.getElementById("closeDrawerBtn");
const drawerMenuLink = document.getElementById("drawerMenuLink");
const drawerBrandingLink = document.getElementById("drawerBrandingLink");

function updateAccountExpiryBadge() {
  const drawerAccountExpiry = document.getElementById("drawerAccountExpiry");
  const drawerAccountExpiryText = document.getElementById("drawerAccountExpiryText");
  if (!drawerAccountExpiry || !drawerAccountExpiryText) return;

  const expiryVal = currentBusiness ? (currentBusiness.approvalExpiry || currentBusiness.subscriptionExpiry) : null;
  if (expiryVal) {
    const expiry = new Date(expiryVal);
    if (!isNaN(expiry.getTime())) {
      const now = new Date();
      const diffMs = expiry.getTime() - now.getTime();
      const days = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
      drawerAccountExpiryText.textContent = `${days} ${days === 1 ? "day" : "days"} left`;
      if (days <= 5) {
        drawerAccountExpiryText.classList.add("is-urgent");
      } else {
        drawerAccountExpiryText.classList.remove("is-urgent");
      }
      drawerAccountExpiry.style.display = "flex";
      return;
    }
  }
  drawerAccountExpiry.style.display = "none";
}

/**
 * Lock/unlock background scrolling when drawer or modal dialog is open
 */
function updateScrollLock() {
  const dSidebar = document.getElementById("drawerSidebar");
  const catModal = document.getElementById("categoryModal");
  const dModal = document.getElementById("dishModal");
  const lModal = document.getElementById("logoutModal");

  const isDrawerOpen = !!(dSidebar && dSidebar.classList.contains("open"));
  const isCatModalOpen = !!(catModal && catModal.style.display === "flex");
  const isDishModalOpen = !!(dModal && dModal.style.display === "flex");
  const isLogoutModalOpen = !!(lModal && lModal.style.display === "flex");

  if (isDrawerOpen || isCatModalOpen || isDishModalOpen || isLogoutModalOpen) {
    document.documentElement.classList.add("scroll-locked");
    document.body.classList.add("scroll-locked");
  } else {
    document.documentElement.classList.remove("scroll-locked");
    document.body.classList.remove("scroll-locked");
  }
}

function openDrawer() {
  if (drawerOverlay && drawerSidebar) {
    updateAccountExpiryBadge();
    drawerOverlay.style.display = "block";
    requestAnimationFrame(() => {
      drawerOverlay.classList.add("open");
      drawerSidebar.classList.add("open");
      updateScrollLock();
    });
  }
}

function closeDrawer() {
  if (drawerOverlay && drawerSidebar) {
    drawerOverlay.classList.remove("open");
    drawerSidebar.classList.remove("open");
    updateScrollLock();
    setTimeout(() => {
      if (!drawerOverlay.classList.contains("open")) {
        drawerOverlay.style.display = "none";
      }
    }, 250);
  }
}

if (hamburgerBtn) hamburgerBtn.addEventListener("click", openDrawer);
if (closeDrawerBtn) closeDrawerBtn.addEventListener("click", closeDrawer);
if (drawerOverlay) {
  drawerOverlay.addEventListener("click", closeDrawer);
  drawerOverlay.addEventListener("touchmove", (e) => {
    e.preventDefault();
  }, { passive: false });
}

if (drawerMenuLink) {
  drawerMenuLink.addEventListener("click", (e) => {
    e.preventDefault();
    closeDrawer();
    showView(dashboardView);
  });
}

if (drawerBrandingLink) {
  drawerBrandingLink.addEventListener("click", (e) => {
    e.preventDefault();
    closeDrawer();
    populateBrandingForm();
    showView(brandingView);
  });
}

/**
 * Show notification banner (Flash messages removed across project)
 */
function showNotification(message, type = "error") {
  if (type === "error") {
    console.error("[Owner Error]:", message);
  }
}

/**
 * Reveal page with smooth dissolve transition once contents are loaded
 */
let pageRevealed = false;
function revealPage() {
  if (pageRevealed) return;
  pageRevealed = true;
  requestAnimationFrame(() => {
    const overlay = document.getElementById("pageLoaderOverlay");
    if (overlay) {
      overlay.classList.add("dissolve");
      setTimeout(() => {
        overlay.style.display = "none";
      }, 300);
    }
    // Trigger visible entrance animation once overlay starts dissolving
    setTimeout(() => {
      const activeView = [pendingView, dashboardView, registerView, authView, brandingView].find(v => v && v.style.display !== "none");
      if (activeView) {
        activeView.classList.remove("fade-in-active");
        void activeView.offsetWidth;
        activeView.classList.add("fade-in-active");
      }
    }, 50);
  });
}

// Safety fallback timer to ensure page dissolves even on slow networks
setTimeout(revealPage, 2200);

/**
 * View switcher
 */
function showView(viewElement) {
  const preRouteStyle = document.getElementById("preRouteStyle");
  if (preRouteStyle) preRouteStyle.remove();

  const isAuth = (viewElement === authView);
  const isRegister = (viewElement === registerView);
  const isPending = (viewElement === pendingView);
  const isDashboard = (viewElement === dashboardView);
  const isBranding = (viewElement === brandingView);
  const header = document.querySelector(".owner-header");

  if (header) {
    header.style.display = (isAuth || isRegister) ? "none" : "flex";
  }

  const hamburger = document.getElementById("hamburgerBtn");
  if (hamburger) {
    hamburger.style.display = isPending ? "none" : "";
  }
  if (isPending && typeof closeDrawer === "function") {
    closeDrawer();
  }

  document.body.classList.toggle("auth-mode", isAuth);
  document.documentElement.classList.toggle("auth-mode", isAuth);
  document.body.classList.toggle("register-mode", isRegister);
  document.documentElement.classList.toggle("register-mode", isRegister);
  document.body.classList.toggle("pending-mode", isPending);
  document.documentElement.classList.toggle("pending-mode", isPending);

  [loadingView, authView, registerView, pendingView, dashboardView, brandingView].forEach(v => {
    if (v) {
      v.style.display = "none";
      v.classList.remove("fade-in-active");
    }
  });
  if (viewElement) {
    viewElement.style.display = (viewElement === authView || viewElement === registerView || viewElement === pendingView) ? "flex" : "block";
    viewElement.classList.remove("fade-in-active");
    void viewElement.offsetWidth;
    viewElement.classList.add("fade-in-active");
  }
  if (isRegister) startTitleWordRotation();

  // Drawer nav item active states
  if (drawerMenuLink && drawerBrandingLink) {
    drawerMenuLink.classList.toggle("active", isDashboard);
    drawerBrandingLink.classList.toggle("active", isBranding);
  }

  // Persist current view state so page refresh preserves view without flashing login or food-outline
  try {
    if (isRegister) {
      sessionStorage.setItem("menucard_view", "register");
      localStorage.setItem("menucard_view", "register");
      if (window.location.hash !== "#register") {
        window.history.replaceState(null, document.title, window.location.pathname + "#register");
      }
    } else if (isPending) {
      sessionStorage.setItem("menucard_view", "pending");
      localStorage.setItem("menucard_view", "pending");
      if (window.location.hash !== "#pending") {
        window.history.replaceState(null, document.title, window.location.pathname + "#pending");
      }
      requestAnimationFrame(fitPendingBizName);
      setTimeout(fitPendingBizName, 40);
      setTimeout(fitPendingBizName, 180);
      setTimeout(fitPendingBizName, 400);
    } else if (isDashboard) {
      sessionStorage.setItem("menucard_view", "dashboard");
      localStorage.setItem("menucard_view", "dashboard");
      if (window.location.hash !== "#dashboard" && window.location.hash !== "#menu") {
        window.history.replaceState(null, document.title, window.location.pathname + "#dashboard");
      }
    } else if (isBranding) {
      sessionStorage.setItem("menucard_view", "branding");
      localStorage.setItem("menucard_view", "branding");
      if (window.location.hash !== "#branding") {
        window.history.replaceState(null, document.title, window.location.pathname + "#branding");
      }
    } else if (isAuth) {
      sessionStorage.removeItem("menucard_view");
      localStorage.removeItem("menucard_view");
      if (window.location.hash) {
        window.history.replaceState(null, document.title, window.location.pathname);
      }
    }
  } catch (e) {}

  // Smoothly dissolve the initial white pre-loader screen
  revealPage();
}

/**
 * Slugify text helper
 */
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Fetch current user profile & business status from server session
 */
async function checkSession() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const authError = urlParams.get("auth_error");
    if (authError) {
      showNotification(decodeURIComponent(authError), "error");
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }

    const autoDevEmail = urlParams.get("dev_login");
    if (autoDevEmail && !currentUser) {
      try {
        await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ devEmail: autoDevEmail, devName: autoDevEmail.split("@")[0] })
        });
      } catch (e) {}
    }

    const res = await fetch("/api/auth/me", {
      headers: { "Bypass-Tunnel-Reminder": "true" }
    });

    if (!res.ok) {
      console.warn("Session check endpoint returned status:", res.status);
      showView(authView);
      setupGoogleButton();
      return;
    }

    const data = await res.json();

    if (data.success && data.authenticated && data.user) {
      currentUser = data.user;
      currentBusiness = data.business;

      // If user is Super Admin, seamlessly route directly to Super Admin Portal
      if (currentUser.role === "admin") {
        window.location.replace("/admin");
        return;
      }

      updateHeaderProfile();

      const header = document.querySelector(".owner-header");
      if (header) header.style.display = "flex";
      document.body.classList.remove("auth-mode");
      document.documentElement.classList.remove("auth-mode");

      if (!currentBusiness) {
        if (bizNameInput) {
          bizNameInput.value = "";
          bizNameInput.classList.remove("has-error");
        }
        if (bizNameErrorMsg) {
          bizNameErrorMsg.textContent = "";
          bizNameErrorMsg.style.display = "none";
        }
        if (ownerNameInput) {
          ownerNameInput.value = (currentUser && currentUser.name) || "";
          ownerNameInput.classList.remove("has-error");
        }
        if (ownerNameErrorMsg) {
          ownerNameErrorMsg.textContent = "";
          ownerNameErrorMsg.style.display = "none";
        }
        if (bizPhoneInput) {
          bizPhoneInput.value = "";
          bizPhoneInput.classList.remove("has-error");
        }
        if (phoneErrorMsg) {
          phoneErrorMsg.textContent = "";
          phoneErrorMsg.style.display = "none";
        }
        if (bizSlugInput) bizSlugInput.value = "";
        if (slugPreviewText) slugPreviewText.textContent = "/r/your-restaurant";
        const slugBadge = document.getElementById("slugBadge");
        if (slugBadge) slugBadge.style.display = "none";
        clearLogoUpload();
        const submitBtn = document.getElementById("submitRegisterBtn");
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove("btn-loading");
          submitBtn.textContent = "Create account";
        }
        showView(registerView);
        if (window.location.search.includes("view=")) {
          const cleanUrl = window.location.pathname + (window.location.hash || "#register");
          window.history.replaceState({}, document.title, cleanUrl);
        }
      } else if (currentBusiness.approvalStatus === "pending") {
        renderPendingView();
        showView(pendingView);
      } else if (currentBusiness.approvalStatus === "approved") {
        renderDashboardView();
        const hash = window.location.hash || "";
        const savedView = sessionStorage.getItem("menucard_view") || "";
        if (hash === "#branding" || savedView === "branding") {
          populateBrandingForm();
          showView(brandingView);
        } else {
          showView(dashboardView);
        }
      } else {
        renderPendingView();
        showView(pendingView);
        showNotification(`Application status: ${currentBusiness.approvalStatus}`, "error");
      }
    } else {
      currentUser = null;
      currentBusiness = null;
      try {
        sessionStorage.removeItem("menucard_view");
        localStorage.removeItem("menucard_view");
      } catch (e) {}
      userProfileArea.style.display = "none";
      const drawerRestaurantCard = document.getElementById("drawerRestaurantCard");
      if (drawerRestaurantCard) drawerRestaurantCard.style.display = "none";
      const drawerAccountExpiry = document.getElementById("drawerAccountExpiry");
      if (drawerAccountExpiry) drawerAccountExpiry.style.display = "none";
      const viewBtn = document.getElementById("viewPublicMenuBtn");
      if (viewBtn) viewBtn.style.display = "none";
      closeDrawer();
      showView(authView);
      setupGoogleButton();
    }
  } catch (err) {
    console.warn("Session check error (proceeding to login view):", err);
    try {
      sessionStorage.removeItem("menucard_view");
      localStorage.removeItem("menucard_view");
    } catch (e) {}
    showView(authView);
    setupGoogleButton();
  }
}

/**
 * Update top header with authenticated user profile
 */
function updateHeaderProfile() {
  if (!currentUser) return;
  userName.textContent = currentUser.name || currentUser.email;
  if (userEmail) {
    userEmail.textContent = currentUser.email || "";
    userEmail.title = currentUser.email || "";
  }
  if (userRole) userRole.textContent = currentUser.role === "admin" ? "Super Admin" : "Restaurant Owner";
  if (currentUser.picture) {
    userAvatar.src = currentUser.picture;
    userAvatar.style.display = "block";
  } else {
    userAvatar.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23991e2e'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";
  }
  userProfileArea.style.display = "flex";

  const drawerRestaurantCard = document.getElementById("drawerRestaurantCard");
  const drawerRestaurantName = document.getElementById("drawerRestaurantName");
  if (currentBusiness && currentBusiness.name) {
    if (drawerRestaurantName) drawerRestaurantName.textContent = currentBusiness.name;
    if (drawerRestaurantCard) drawerRestaurantCard.style.display = "flex";
  } else {
    if (drawerRestaurantCard) drawerRestaurantCard.style.display = "none";
  }

  updateAccountExpiryBadge();
  updatePendingUserCard();
}

/**
 * Update Pending View Account Details Card
 */
function updatePendingUserCard() {
  if (!currentUser) return;
  const nameEl = document.getElementById("pendingUserName");
  const roleEl = document.getElementById("pendingUserRole");
  const initialEl = document.getElementById("pendingUserInitial");
  const imgEl = document.getElementById("pendingUserImg");

  const displayName = currentUser.name || currentUser.email || "Restaurant Owner";
  if (nameEl) nameEl.textContent = displayName;
  if (roleEl) roleEl.textContent = currentUser.role === "admin" ? "Super Admin" : "Restaurant Owner";

  const firstLetter = (displayName.trim()[0] || "P").toUpperCase();
  if (initialEl) initialEl.textContent = firstLetter;

  if (currentUser.picture && imgEl) {
    imgEl.src = currentUser.picture;
    imgEl.style.display = "block";
    if (initialEl) initialEl.style.display = "none";
  } else {
    if (imgEl) imgEl.style.display = "none";
    if (initialEl) initialEl.style.display = "flex";
  }
}

/**
 * Auto-scale pending business name so that multi-word names stay cleanly on a single line
 * with safe padding and large bold text, never clipped or cropped.
 */
function fitPendingBizName() {
  const el = document.getElementById("pendingBizName");
  if (!el) return;
  const pendingView = document.getElementById("pendingView");
  if (pendingView && (pendingView.style.display === "none" || getComputedStyle(pendingView).display === "none")) {
    return;
  }

  // Remove previous inline font-size to measure natural scrollWidth
  el.style.removeProperty("font-size");
  el.style.whiteSpace = "nowrap";

  // Measure actual available container width
  const container = el.parentElement || pendingView;
  const containerWidth = container ? container.clientWidth : window.innerWidth;
  // Leave at least 16px safe breathing room inside container so letters never clip
  const availableWidth = Math.max(160, containerWidth - 16);
  const scrollW = el.scrollWidth;

  if (scrollW > availableWidth && availableWidth > 0) {
    const computedFontSize = parseFloat(getComputedStyle(el).fontSize) || 36;
    const scale = availableWidth / scrollW;
    let targetPx = Math.floor(computedFontSize * scale * 0.95);
    if (targetPx < 18) {
      // If font size would become smaller than 18px on a single line, allow wrapping
      el.style.whiteSpace = "normal";
      el.style.setProperty("font-size", "1.45rem", "important");
    } else {
      el.style.whiteSpace = "nowrap";
      el.style.setProperty("font-size", `${targetPx}px`, "important");
    }
  } else {
    el.style.whiteSpace = "nowrap";
  }
}
window.addEventListener("resize", fitPendingBizName);
window.addEventListener("orientationchange", () => setTimeout(fitPendingBizName, 100));
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(fitPendingBizName);
}

/**
 * Render Pending Application Card
 */
function renderPendingView() {
  if (currentBusiness) {
    const bizNameEl = document.getElementById("pendingBizName");
    const slugEl = document.getElementById("pendingSlugValue");
    if (bizNameEl) bizNameEl.textContent = currentBusiness.name;
    if (slugEl) slugEl.textContent = `/r/${currentBusiness.slug}`;
  }
  updatePendingUserCard();
  requestAnimationFrame(fitPendingBizName);
  setTimeout(fitPendingBizName, 40);
  setTimeout(fitPendingBizName, 180);
  setTimeout(fitPendingBizName, 400);
}

/**
 * Render Approved Dashboard Card
 */
function renderDashboardView() {
  const dashBizEl = document.getElementById("dashBizName");
  if (dashBizEl) dashBizEl.textContent = currentBusiness.name;
  const drawerRestaurantCard = document.getElementById("drawerRestaurantCard");
  const drawerRestaurantName = document.getElementById("drawerRestaurantName");
  if (currentBusiness && currentBusiness.name) {
    if (drawerRestaurantName) drawerRestaurantName.textContent = currentBusiness.name;
    if (drawerRestaurantCard) drawerRestaurantCard.style.display = "flex";
  }
  const menuUrl = `/r/${currentBusiness.slug}`;
  const viewBtn = document.getElementById("viewPublicMenuBtn");
  if (viewBtn) {
    viewBtn.href = menuUrl;
    viewBtn.style.display = "inline-flex";
  }

  initViewSwitcher();
  loadMenuData();
}

let authConfig = null;

/**
 * Fetch public auth settings from server (/api/auth/config)
 */
async function fetchAuthConfig() {
  if (authConfig) return authConfig;
  try {
    const res = await fetch("/api/auth/config", {
      headers: { "Bypass-Tunnel-Reminder": "true" }
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.success) {
        authConfig = data;
        return authConfig;
      }
    }
  } catch (e) {
    console.warn("Failed to load /api/auth/config:", e);
  }
  return { success: false, googleClientId: "", isConfigured: false };
}

let isGisInitialized = false;

/**
 * Initialize Google Sign-In in Full Redirect Mode while preserving exact custom button styling
 */
async function setupGoogleButton() {
  const config = await fetchAuthConfig();
  const googleSignInBtn = document.getElementById("googleSignInBtn");
  const googleSetupNotice = document.getElementById("googleSetupNotice");

  // Remove any injected GIS containers to preserve custom button styling
  const oldContainer = document.getElementById("gisRedirectContainer");
  if (oldContainer) oldContainer.remove();

  if (!googleSignInBtn) return;

  // Ensure original custom button is visible
  googleSignInBtn.style.display = "inline-flex";

  if (config.isConfigured && config.googleClientId) {
    if (googleSetupNotice) googleSetupNotice.style.display = "none";

    if (!googleSignInBtn.dataset.bound) {
      googleSignInBtn.dataset.bound = "true";
      googleSignInBtn.addEventListener("click", () => {
        const redirectUri = window.location.origin + "/api/auth/google";
        const nonce = Math.random().toString(36).substring(2) + Date.now().toString(36);
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
          `client_id=${encodeURIComponent(config.googleClientId)}` +
          `&redirect_uri=${encodeURIComponent(redirectUri)}` +
          `&response_type=id_token` +
          `&response_mode=form_post` +
          `&scope=${encodeURIComponent("openid email profile")}` +
          `&prompt=select_account` +
          `&nonce=${encodeURIComponent(nonce)}`;

        window.location.href = authUrl;
      });
    }
  } else {
    // When GOOGLE_CLIENT_ID is not configured in .env yet, wire up notice
    if (googleSetupNotice) googleSetupNotice.style.display = "none";
    if (!googleSignInBtn.dataset.bound) {
      googleSignInBtn.dataset.bound = "true";
      googleSignInBtn.addEventListener("click", () => {
        const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
        const msg = isLocal
          ? "Please set GOOGLE_CLIENT_ID in .env to activate live Google Sign-In."
          : "Please set GOOGLE_CLIENT_ID in your Vercel Project Environment Variables to activate live Google Sign-In.";
        showNotification(msg, "error");
      });
    }
  }
}

// Expose global hook for Google library onload
window.initGoogleAuth = setupGoogleButton;

/**
 * Handle Google ID Token Callback (when rendered in callback mode)
 */
async function handleGoogleCredentialResponse(response) {
  if (!response || !response.credential) return;
  try {
    const res = await fetch("/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential: response.credential })
    });
    const data = await res.json();
    if (data.success) {
      checkSession();
    } else {
      showView(authView);
      showNotification(data.error || "Google authentication failed.", "error");
    }
  } catch (err) {
    console.error("Auth request error:", err);
    showView(authView);
    showNotification("Network error during Google authentication.", "error");
  }
}

if (devAuthForm) {
  devAuthForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const devEmail = devEmailInput.value.trim();
  if (!devEmail) return;

  try {
    const res = await fetch("/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ devEmail, devName: devEmail.split("@")[0] })
    });
    const data = await res.json();
    if (data.success) {
      checkSession();
    } else {
      showNotification(data.error || "Login failed.", "error");
    }
  } catch (err) {
    showNotification("Network error during login.", "error");
  }
});
}

/**
 * Auto-generate & Verify Available Restaurant Slug
 */
let slugCheckTimeout = null;

async function checkAndApplyAvailableSlug(sourceName, explicitSlug = "") {
  const query = explicitSlug 
    ? `slug=${encodeURIComponent(explicitSlug)}` 
    : `name=${encodeURIComponent(sourceName)}`;

  const slugBadge = document.getElementById("slugBadge");
  if (slugBadge) {
    slugBadge.style.display = "inline-flex";
    slugBadge.className = "slug-badge checking";
    slugBadge.textContent = "Checking...";
  }

  try {
    const res = await fetch(`/api/owner/check-slug?${query}`);
    const data = await res.json();
    if (data.success && data.availableSlug) {
      if (bizSlugInput) bizSlugInput.value = data.availableSlug;
      if (slugPreviewText) slugPreviewText.textContent = `/r/${data.availableSlug}`;

      if (slugBadge) {
        if (data.isExactMatch) {
          slugBadge.className = "slug-badge available";
          slugBadge.textContent = "✓ Available";
        } else if (data.suggested) {
          slugBadge.className = "slug-badge suggested";
          slugBadge.textContent = `Auto-assigned: /r/${data.availableSlug}`;
        }
      }
    } else if (data.baseSlug && !data.isAvailable) {
      if (slugBadge) {
        slugBadge.className = "slug-badge taken";
        slugBadge.textContent = "✕ Unavailable";
      }
    } else {
      if (slugBadge) slugBadge.style.display = "none";
      if (slugPreviewText) slugPreviewText.textContent = `/r/your-restaurant`;
    }
  } catch (e) {
    console.warn("Failed to check slug availability:", e);
  }
}

if (bizNameInput) {
  bizNameInput.addEventListener("input", () => {
    const rawName = bizNameInput.value.trim();
    if (rawName.length > 1 || rawName.length === 0) {
      hideBizNameError();
    }
    const slugBadge = document.getElementById("slugBadge");
    if (!rawName) {
      if (bizSlugInput) bizSlugInput.value = "";
      if (slugPreviewText) slugPreviewText.textContent = "/r/your-restaurant";
      if (slugBadge) slugBadge.style.display = "none";
      return;
    }

    // Instant preliminary preview
    const preliminarySlug = slugify(rawName);
    if (bizSlugInput) bizSlugInput.value = preliminarySlug;
    if (slugPreviewText) slugPreviewText.textContent = `/r/${preliminarySlug || "your-restaurant"}`;

    clearTimeout(slugCheckTimeout);
    slugCheckTimeout = setTimeout(() => {
      checkAndApplyAvailableSlug(rawName);
    }, 200);
  });

  // When focused (highlighted), hide message so user can edit cleanly
  bizNameInput.addEventListener("focus", () => {
    hideBizNameError();
  });

  // Only show once highlight is gone (blur) and only 1 character entered
  bizNameInput.addEventListener("blur", () => {
    const val = bizNameInput.value.trim();
    if (val.length === 1) {
      showBizNameError();
    } else {
      hideBizNameError();
    }
  });
}

/**
 * Logo Upload Helpers & Listeners
 */
function handleLogoFile(file) {
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    showNotification("Please select an image file (PNG, JPG, WEBP, or SVG).", "error");
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    showNotification("Logo file size must be less than 5MB.", "error");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    uploadedLogoData = e.target.result;
    if (logoPreviewImg) logoPreviewImg.src = uploadedLogoData;
    if (logoFileName) logoFileName.textContent = file.name;
    if (logoFileSize) {
      const kb = Math.round(file.size / 1024);
      logoFileSize.textContent = kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
    }
    if (logoUploadPlaceholder) logoUploadPlaceholder.style.display = "none";
    if (logoUploadPreviewWrapper) logoUploadPreviewWrapper.style.display = "flex";
  };
  reader.readAsDataURL(file);
}

function clearLogoUpload() {
  uploadedLogoData = "";
  if (bizLogoInput) bizLogoInput.value = "";
  if (logoPreviewImg) logoPreviewImg.src = "";
  if (logoFileName) logoFileName.textContent = "";
  if (logoFileSize) logoFileSize.textContent = "";
  if (logoUploadPlaceholder) logoUploadPlaceholder.style.display = "flex";
  if (logoUploadPreviewWrapper) logoUploadPreviewWrapper.style.display = "none";
}

if (logoUploadDropzone && bizLogoInput) {
  logoUploadDropzone.addEventListener("click", (e) => {
    if (e.target.closest("#removeLogoBtn")) return;
    bizLogoInput.click();
  });

  logoUploadDropzone.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      bizLogoInput.click();
    }
  });

  bizLogoInput.addEventListener("change", () => {
    if (bizLogoInput.files && bizLogoInput.files[0]) {
      handleLogoFile(bizLogoInput.files[0]);
    }
  });

  logoUploadDropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    logoUploadDropzone.classList.add("dragover");
  });

  logoUploadDropzone.addEventListener("dragleave", (e) => {
    e.preventDefault();
    logoUploadDropzone.classList.remove("dragover");
  });

  logoUploadDropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    logoUploadDropzone.classList.remove("dragover");
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleLogoFile(e.dataTransfer.files[0]);
    }
  });
}

if (removeLogoBtn) {
  removeLogoBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    clearLogoUpload();
  });
}

function showOwnerNameError(msg = "Please enter a valid name of owner") {
  if (ownerNameErrorMsg) {
    ownerNameErrorMsg.textContent = msg;
    ownerNameErrorMsg.style.display = "block";
  }
  if (ownerNameInput) {
    ownerNameInput.classList.add("has-error");
  }
}

function hideOwnerNameError() {
  if (ownerNameErrorMsg) {
    ownerNameErrorMsg.textContent = "";
    ownerNameErrorMsg.style.display = "none";
  }
  if (ownerNameInput) {
    ownerNameInput.classList.remove("has-error");
  }
}

function showBizNameError(msg = "Please enter a valid name of business") {
  if (bizNameErrorMsg) {
    bizNameErrorMsg.textContent = msg;
    bizNameErrorMsg.style.display = "block";
  }
  if (bizNameInput) {
    bizNameInput.classList.add("has-error");
  }
}

function hideBizNameError() {
  if (bizNameErrorMsg) {
    bizNameErrorMsg.textContent = "";
    bizNameErrorMsg.style.display = "none";
  }
  if (bizNameInput) {
    bizNameInput.classList.remove("has-error");
  }
}

function showPhoneError() {
  if (phoneErrorMsg) {
    phoneErrorMsg.textContent = "Please enter a valid phone number.";
    phoneErrorMsg.style.display = "block";
  }
  if (bizPhoneInput) {
    bizPhoneInput.classList.add("has-error");
  }
}

function hidePhoneError() {
  if (phoneErrorMsg) {
    phoneErrorMsg.textContent = "";
    phoneErrorMsg.style.display = "none";
  }
  if (bizPhoneInput) {
    bizPhoneInput.classList.remove("has-error");
  }
}

// Owner Name input: validate > 1 character, show message on blur
if (ownerNameInput) {
  ownerNameInput.addEventListener("input", (e) => {
    const val = e.target.value.trim();
    if (val.length > 1 || val.length === 0) {
      hideOwnerNameError();
    }
  });

  // When focused (highlighted), hide message so user can edit cleanly
  ownerNameInput.addEventListener("focus", () => {
    hideOwnerNameError();
  });

  // Only show once highlight is gone (blur) and only 1 character entered
  ownerNameInput.addEventListener("blur", () => {
    const val = ownerNameInput.value.trim();
    if (val.length === 1) {
      showOwnerNameError();
    } else {
      hideOwnerNameError();
    }
  });
}

// Phone input: numbers only and max 10 digits
if (bizPhoneInput) {
  bizPhoneInput.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
    if (e.target.value.length === 10) {
      hidePhoneError();
    }
  });

  // When focused (highlighted), hide message so user can edit cleanly
  bizPhoneInput.addEventListener("focus", () => {
    hidePhoneError();
  });

  // Only show once highlight is gone (blur) and less than 10 digits entered
  bizPhoneInput.addEventListener("blur", () => {
    const val = bizPhoneInput.value.trim();
    if (val.length > 0 && val.length < 10) {
      showPhoneError();
    } else {
      hidePhoneError();
    }
  });
}

/**
 * Business Registration Form Submit
 */
registerBusinessForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = bizNameInput.value.trim();
  const ownerName = ownerNameInput ? ownerNameInput.value.trim() : "";
  const slug = (bizSlugInput ? bizSlugInput.value.trim() : "") || slugify(name);
  const phone = bizPhoneInput ? bizPhoneInput.value.trim() : "";
  const address = document.getElementById("bizAddressInput")?.value?.trim() || "";
  const logoUrl = uploadedLogoData || "";

  if (!ownerName || ownerName.length < 2) {
    showOwnerNameError();
    showNotification("Please enter a valid name of owner", "error");
    return;
  }

  if (!name || name.length < 2) {
    showBizNameError();
    showNotification("Please enter a valid name of business", "error");
    return;
  }

  if (!phone || phone.length < 10) {
    showPhoneError();
    showNotification("Please enter a valid phone number.", "error");
    return;
  }

  const submitBtn = document.getElementById("submitRegisterBtn");
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.classList.add("btn-loading");
    submitBtn.innerHTML = '<span class="btn-spinner" aria-label="Loading"></span>';
  }

  try {
    const res = await fetch("/api/owner/business", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, ownerName, slug, phone, address, logoUrl })
    });
    const data = await res.json();
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.classList.remove("btn-loading");
      submitBtn.textContent = "Create account";
    }

    if (data.success) {
      currentBusiness = data.business;
      renderPendingView();
      showView(pendingView);
    } else {
      showNotification(data.error || "Registration failed.", "error");
    }
  } catch (err) {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.classList.remove("btn-loading");
      submitBtn.textContent = "Create account";
    }
    showNotification("Network error during registration.", "error");
  }
});

/**
 * Refresh status button on pending view
 */
if (checkStatusBtn) {
  checkStatusBtn.addEventListener("click", () => {
    checkSession();
  });
}

/**
 * Logout Handler
 */
async function handleLogout() {
  try {
    closeDrawer();
    try {
      sessionStorage.removeItem("menucard_view");
      localStorage.removeItem("menucard_view");
    } catch (e) {}
    if (window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.disableAutoSelect();
    }
    await fetch("/api/auth/logout", { method: "POST" });
    currentUser = null;
    currentBusiness = null;
    window.history.replaceState({}, document.title, window.location.pathname);
    await checkSession();
  } catch (err) {
    console.error("Logout error:", err);
  }
}

const logoutModal = document.getElementById("logoutModal");
const closeLogoutModalBtn = document.getElementById("closeLogoutModalBtn");
const cancelLogoutBtn = document.getElementById("cancelLogoutBtn");
const confirmLogoutBtn = document.getElementById("confirmLogoutBtn");

function openLogoutModal() {
  const lm = document.getElementById("logoutModal");
  if (lm) {
    lm.style.display = "flex";
    updateScrollLock();
  }
}

function closeLogoutModal() {
  const lm = document.getElementById("logoutModal");
  if (lm) {
    lm.style.display = "none";
    updateScrollLock();
  }
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", openLogoutModal);
}

if (registerLogoutBtn) {
  registerLogoutBtn.addEventListener("click", openLogoutModal);
}

if (pendingLogoutBtn) {
  pendingLogoutBtn.addEventListener("click", openLogoutModal);
}

if (closeLogoutModalBtn) {
  closeLogoutModalBtn.addEventListener("click", closeLogoutModal);
}

if (cancelLogoutBtn) {
  cancelLogoutBtn.addEventListener("click", closeLogoutModal);
}

if (confirmLogoutBtn) {
  confirmLogoutBtn.addEventListener("click", async () => {
    closeLogoutModal();
    if (typeof closeDrawer === "function") closeDrawer();
    await handleLogout();
  });
}

// ============================================================================
// PHASE 4: OWNER MENU MANAGEMENT (CATEGORIES & DISHES)
// ============================================================================

const HARDCODED_TODAY_SPECIAL = {
  _id: "today_special_fixed",
  name: "TODAY'S SPECIAL",
  displayOrder: -1,
  isFixed: true,
  isVisible: true,
  isAvailable: true
};

let categories = [{ ...HARDCODED_TODAY_SPECIAL }];
let dishes = [];
let selectedCategoryId = null;
let isFetchingMenuData = false;
let activeFetchesCount = 0;

function showPortalLoading() {
  document.querySelectorAll(".owner-central-loader").forEach(el => {
    el.style.display = "flex";
  });
  if (emptyCategoriesState) emptyCategoriesState.style.display = "none";
  if (emptyDishesState) emptyDishesState.style.display = "none";
}

function hidePortalLoading() {
  document.querySelectorAll(".owner-central-loader").forEach(el => {
    el.style.display = "none";
  });
}

function trackFetchStart() {
  activeFetchesCount++;
  showPortalLoading();
}

function trackFetchEnd() {
  activeFetchesCount = Math.max(0, activeFetchesCount - 1);
  if (activeFetchesCount === 0) {
    hidePortalLoading();
  }
}

// Switcher Capsule DOM Elements
const capsuleCategoryBtn = document.getElementById("capsuleCategoryBtn");
const capsuleMenuBtn = document.getElementById("capsuleMenuBtn");
const categoryViewGroup = document.getElementById("categoryViewGroup");
const menuViewGroup = document.getElementById("menuViewGroup");

// Category View Group DOM Elements
const categoriesGrid = document.getElementById("categoriesGrid");
const categoriesCountLabel = document.getElementById("categoriesCountLabel");
const emptyCategoriesState = document.getElementById("emptyCategoriesState");
const emptyStateAddCategoryBtn = document.getElementById("emptyStateAddCategoryBtn");
const openAddCategoryHeaderBtn = document.getElementById("openAddCategoryHeaderBtn");

// Menu DOM Elements
const categorySelectDropdown = document.getElementById("categorySelectDropdown");
const categoryDropdownDisplay = document.getElementById("categoryDropdownDisplay");
const currentCategoryTitle = document.getElementById("currentCategoryTitle");
const dishCountLabel = document.getElementById("dishCountLabel");
const openAddDishBtn = document.getElementById("openAddDishBtn");
const dishesGrid = document.getElementById("dishesGrid");
const emptyDishesState = document.getElementById("emptyDishesState");
const emptyStateAddDishBtn = document.getElementById("emptyStateAddDishBtn");

// Category Modal Elements
const categoryModal = document.getElementById("categoryModal");
const categoryModalTitle = document.getElementById("categoryModalTitle");
const categoryForm = document.getElementById("categoryForm");
const categoryIdInput = document.getElementById("categoryIdInput");
const categoryNameInput = document.getElementById("categoryNameInput");
const closeCategoryModalBtn = document.getElementById("closeCategoryModalBtn");
const cancelCategoryBtn = document.getElementById("cancelCategoryBtn");

// Dish Modal Elements
const dishModal = document.getElementById("dishModal");
const dishModalTitle = document.getElementById("dishModalTitle");
const dishForm = document.getElementById("dishForm");
const dishIdInput = document.getElementById("dishIdInput");
const dishCategorySelect = document.getElementById("dishCategorySelect");
const dishNameInput = document.getElementById("dishNameInput");
const dishPriceInput = document.getElementById("dishPriceInput");
const dishAvailableInput = document.getElementById("dishAvailableInput");
const closeDishModalBtn = document.getElementById("closeDishModalBtn");
const cancelDishBtn = document.getElementById("cancelDishBtn");

/**
 * Fetch categories and dishes from API
 */
async function loadMenuData() {
  if (!currentBusiness) return;
  if (isFetchingMenuData) return;
  isFetchingMenuData = true;
  trackFetchStart();

  try {
    const [catRes, itemRes] = await Promise.all([
      fetch("/api/owner/categories"),
      fetch("/api/owner/items")
    ]);

    const catData = await catRes.json();
    const itemData = await itemRes.json();

    if (itemData.success) {
      dishes = itemData.items || [];
    }

    if (catData.success) {
      const serverCats = catData.categories || [];
      const serverSpecial = serverCats.find(c => c.isFixed || (c.name && c.name.toUpperCase() === "TODAY'S SPECIAL"));

      let specialCat;
      if (serverSpecial) {
        specialCat = {
          ...HARDCODED_TODAY_SPECIAL,
          ...serverSpecial,
          isFixed: true,
          name: "TODAY'S SPECIAL"
        };
      } else {
        specialCat = { ...HARDCODED_TODAY_SPECIAL };
      }

      const otherCats = serverCats.filter(c => c !== serverSpecial && !(c.name && c.name.toUpperCase() === "TODAY'S SPECIAL"));
      otherCats.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

      categories = [specialCat, ...otherCats];
    } else {
      if (categories.length === 0) {
        categories = [{ ...HARDCODED_TODAY_SPECIAL }];
      }
    }
  } catch (err) {
    console.error("Failed to load menu data:", err);
    showNotification("Failed to load menu items.", "error");
  } finally {
    isFetchingMenuData = false;
    trackFetchEnd();
    hidePortalLoading();
    renderCategoriesList();
    renderCategoryTabs();
    populateCategoryDropdown();
    renderDishesGrid();
  }
}

/**
 * Switcher Capsule Logic (CATEGORY - MENU)
 */
let currentDashboardView = "category";

function switchDashboardView(view) {
  currentDashboardView = view;
  try {
    sessionStorage.setItem("owner_active_view", view);
  } catch(e) {}

  if (!capsuleCategoryBtn || !capsuleMenuBtn || !categoryViewGroup || !menuViewGroup) return;

  const capsuleSwitcher = document.querySelector(".capsule-switcher");
  if (capsuleSwitcher) {
    capsuleSwitcher.setAttribute("data-active", view);
  }

  if (view === "category") {
    capsuleCategoryBtn.classList.add("active");
    capsuleCategoryBtn.setAttribute("aria-selected", "true");
    capsuleMenuBtn.classList.remove("active");
    capsuleMenuBtn.setAttribute("aria-selected", "false");

    menuViewGroup.style.display = "none";
    menuViewGroup.classList.remove("view-content-smooth");

    categoryViewGroup.style.display = "flex";
    categoryViewGroup.classList.remove("view-content-smooth");
    void categoryViewGroup.offsetWidth;
    categoryViewGroup.classList.add("view-content-smooth");

    if (categoriesCountLabel) categoriesCountLabel.style.display = "flex";
    if (dishCountLabel) dishCountLabel.style.display = "none";

    if (isFetchingMenuData) {
      const catLoader = document.getElementById("categoryCenterLoader");
      if (catLoader) catLoader.style.display = "flex";
      if (emptyCategoriesState) emptyCategoriesState.style.display = "none";
    }

    renderCategoriesList();
  } else {
    capsuleMenuBtn.classList.add("active");
    capsuleMenuBtn.setAttribute("aria-selected", "true");
    capsuleCategoryBtn.classList.remove("active");
    capsuleCategoryBtn.setAttribute("aria-selected", "false");

    categoryViewGroup.style.display = "none";
    categoryViewGroup.classList.remove("view-content-smooth");

    menuViewGroup.style.display = "flex";
    menuViewGroup.classList.remove("view-content-smooth");
    void menuViewGroup.offsetWidth;
    menuViewGroup.classList.add("view-content-smooth");

    if (categoriesCountLabel) categoriesCountLabel.style.display = "none";
    if (dishCountLabel) dishCountLabel.style.display = "flex";

    if (isFetchingMenuData) {
      const menuLoader = document.getElementById("menuCenterLoader");
      if (menuLoader) menuLoader.style.display = "flex";
      if (emptyDishesState) emptyDishesState.style.display = "none";
    }

    renderCategoryTabs();
    renderDishesGrid();
  }
}

let isSwitcherInitialized = false;
function initViewSwitcher() {
  if (isSwitcherInitialized) return;
  isSwitcherInitialized = true;

  const savedView = sessionStorage.getItem("owner_active_view") || "category";
  switchDashboardView(savedView);

  if (capsuleCategoryBtn) {
    capsuleCategoryBtn.addEventListener("click", () => {
      switchDashboardView("category");
      loadMenuData();
    });
  }
  if (capsuleMenuBtn) {
    capsuleMenuBtn.addEventListener("click", () => {
      switchDashboardView("menu");
      loadMenuData();
    });
  }
}

/**
 * Render categories list in CATEGORY view
 */
function renderCategoriesList() {
  if (!categoriesGrid) return;
  categoriesGrid.innerHTML = "";

  if (categoriesCountLabel) {
    if (isFetchingMenuData && categories.length <= 1) {
      categoriesCountLabel.textContent = "1 Category";
    } else {
      categoriesCountLabel.textContent = `${categories.length} Categor${categories.length === 1 ? "y" : "ies"}`;
    }
  }

  if (categories.length === 0 && !isFetchingMenuData) {
    if (emptyCategoriesState) emptyCategoriesState.style.display = "flex";
    return;
  }
  if (emptyCategoriesState) emptyCategoriesState.style.display = "none";

  categories.forEach(cat => {
    const isAvail = cat.isAvailable !== false && cat.isVisible !== false;
    const isFixed = cat.isFixed || (cat.name && cat.name.toUpperCase() === "TODAY'S SPECIAL");
    const dishCount = dishes.filter(d => String(d.categoryId) === String(cat._id)).length;
    const card = document.createElement("div");
    card.className = `category-admin-card ${isFixed ? "today-special-card" : ""} ${isAvail ? "" : "unavailable"}`.trim();
    card.dataset.id = cat._id;

    card.innerHTML = `
      <div class="category-row-info">
        <label class="switch-label category-row-switch" title="${isAvail ? 'Available (click to toggle)' : 'Sold Out / Unavailable (click to toggle)'}">
          <span class="switch">
            <input type="checkbox" class="category-avail-checkbox" data-id="${cat._id}" ${isAvail ? "checked" : ""}>
            <span class="slider"></span>
          </span>
        </label>
        ${isFixed ? `
          <div class="category-card-name is-fixed" title="Today's Special" aria-label="Category name ${escapeHtml(cat.name)}">
            <svg class="cat-star-icon" viewBox="0 0 24 24" width="16" height="16" fill="#f59e0b" stroke="#d97706" stroke-width="0.8" aria-hidden="true">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            ${escapeHtml(cat.name)}
          </div>
        ` : `
          <div class="category-card-name" title="Click to edit name" tabindex="0" role="button" aria-label="Edit category name ${escapeHtml(cat.name)}">${escapeHtml(cat.name)}</div>
        `}
      </div>
      <div class="category-row-actions">
        <span class="category-dish-count-badge">${dishCount} item${dishCount === 1 ? "" : "s"}</span>
        ${isFixed ? "" : `
          <button type="button" class="delete-cat-btn delete-icon-btn" data-id="${cat._id}" title="Delete Category" aria-label="Delete Category">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        `}
      </div>
    `;

    // Toggle availability (optimistic & smooth in-place without rebuilding DOM)
    const availCheck = card.querySelector(".category-avail-checkbox");
    if (availCheck) {
      availCheck.addEventListener("change", async (e) => {
        const newAvail = e.target.checked;
        card.classList.toggle("unavailable", !newAvail);
        const switchLbl = card.querySelector(".switch-label");
        if (switchLbl) switchLbl.title = newAvail ? 'Available (click to toggle)' : 'Sold Out / Unavailable (click to toggle)';
        await toggleCategoryAvailability(cat._id, newAvail, card, availCheck);
      });
    }

    // Inline edit category name on click (only for non-fixed)
    if (!isFixed) {
      const nameEl = card.querySelector(".category-card-name");
      if (nameEl) attachInlineCategoryEditor(nameEl, cat);

      // Delete button
      const delBtn = card.querySelector(".delete-cat-btn");
      if (delBtn) {
        delBtn.addEventListener("click", () => {
          confirmDeleteCategoryById(cat._id);
        });
      }
    }

    categoriesGrid.appendChild(card);
  });
}

/**
 * Enable click-to-edit for Category Name
 */
function attachInlineCategoryEditor(nameEl, cat) {
  function startEdit() {
    if (nameEl.classList.contains("is-editing")) return;
    nameEl.classList.add("is-editing");

    const originalName = cat.name;
    const input = document.createElement("input");
    input.type = "text";
    input.className = "dish-inline-input category-inline-input";
    input.value = originalName;
    input.placeholder = "Category name";
    input.setAttribute("aria-label", "Category name");

    nameEl.textContent = "";
    nameEl.appendChild(input);
    input.focus();
    input.select();

    input.addEventListener("click", (e) => e.stopPropagation());

    let finished = false;
    async function commit(save) {
      if (finished) return;
      finished = true;
      const newName = input.value.trim();
      nameEl.classList.remove("is-editing");

      if (save && newName && newName !== originalName) {
        nameEl.textContent = newName;
        cat.name = newName;
        try {
          const res = await fetch("/api/owner/categories", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: cat._id, name: newName })
          });
          const data = await res.json();
          if (data.success) {
            renderCategoryTabs();
            renderDishesGrid();
          } else {
            showNotification(data.error || "Failed to update category name", "error");
            cat.name = originalName;
            nameEl.textContent = originalName;
          }
        } catch (err) {
          showNotification("Network error updating category name", "error");
          cat.name = originalName;
          nameEl.textContent = originalName;
        }
      } else {
        nameEl.textContent = originalName;
      }
    }

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        commit(true);
      } else if (e.key === "Escape") {
        e.preventDefault();
        commit(false);
      }
    });

    input.addEventListener("blur", () => {
      commit(true);
    });
  }

  nameEl.addEventListener("click", startEdit);
  nameEl.addEventListener("keydown", (e) => {
    if (!nameEl.classList.contains("is-editing") && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      startEdit();
    }
  });
}

function openEditCategoryModalById(catId) {
  const cat = categories.find(c => String(c._id) === String(catId));
  if (!cat) return;
  categoryModalTitle.textContent = "Rename Category";
  categoryIdInput.value = cat._id;
  categoryNameInput.value = cat.name;
  categoryModal.style.display = "flex";
  updateScrollLock();
  categoryNameInput.focus();
}

async function confirmDeleteCategoryById(catId) {
  const cat = categories.find(c => String(c._id) === String(catId));
  if (!cat) return;

  if (cat.isFixed || (cat.name && cat.name.toUpperCase() === "TODAY'S SPECIAL")) {
    showNotification("'Today's Special' is a fixed category and cannot be deleted.", "error");
    return;
  }

  const dishCount = dishes.filter(d => String(d.categoryId) === String(catId)).length;
  const confirmMsg = `Are you sure you want to delete category "${cat.name}"?` +
    (dishCount > 0 ? ` WARNING: This will also delete ${dishCount} associated dish(es)!` : "");

  if (!confirm(confirmMsg)) return;

  try {
    const res = await fetch(`/api/owner/categories?id=${catId}`, {
      method: "DELETE"
    });
    const data = await res.json();
    if (data.success) {
      if (selectedCategoryId === String(catId)) {
        selectedCategoryId = null;
      }
      await loadMenuData();
    } else {
      showNotification(data.error || "Failed to delete category.", "error");
    }
  } catch (err) {
    showNotification("Network error deleting category.", "error");
  }
}

/**
 * Update the visual display inside the category dropdown to style bracketed count
 */
function updateCategoryDropdownDisplay() {
  if (!categoryDropdownDisplay || !categorySelectDropdown) return;
  const selectedOption = categorySelectDropdown.options[categorySelectDropdown.selectedIndex];
  if (selectedOption) {
    categoryDropdownDisplay.innerHTML = formatDishName(selectedOption.textContent);
  }
}

/**
 * Render categories dropdown options in MENU view
 */
function renderCategoryTabs() {
  if (!categorySelectDropdown) return;
  categorySelectDropdown.innerHTML = "";

  // "All Categories" option
  const allOpt = document.createElement("option");
  allOpt.value = "";
  allOpt.textContent = `All Categories (${dishes.length})`;
  allOpt.selected = selectedCategoryId === null;
  categorySelectDropdown.appendChild(allOpt);

  const sortedCategories = [...categories].sort((a, b) => {
    const aFixed = a.isFixed || (a.name && a.name.toUpperCase() === "TODAY'S SPECIAL");
    const bFixed = b.isFixed || (b.name && b.name.toUpperCase() === "TODAY'S SPECIAL");
    if (aFixed && !bFixed) return -1;
    if (!aFixed && bFixed) return 1;
    return (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
  });

  // Individual category options
  sortedCategories.forEach(cat => {
    const isFixed = cat.isFixed || (cat.name && cat.name.toUpperCase() === "TODAY'S SPECIAL");
    const catDishCount = dishes.filter(d => String(d.categoryId) === String(cat._id)).length;
    const opt = document.createElement("option");
    opt.value = String(cat._id);
    opt.textContent = `${isFixed ? "★ " : ""}${cat.name} (${catDishCount})`;
    if (selectedCategoryId === String(cat._id)) {
      opt.selected = true;
    }
    categorySelectDropdown.appendChild(opt);
  });

  updateCategoryDropdownDisplay();
}

/**
 * Populate Category dropdown in Add/Edit Dish Modal
 */
function populateCategoryDropdown() {
  dishCategorySelect.innerHTML = "";
  if (categories.length === 0) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "-- No Categories (Create one first) --";
    dishCategorySelect.appendChild(opt);
    return;
  }
  const sortedCategories = [...categories].sort((a, b) => {
    const aFixed = a.isFixed || (a.name && a.name.toUpperCase() === "TODAY'S SPECIAL");
    const bFixed = b.isFixed || (b.name && b.name.toUpperCase() === "TODAY'S SPECIAL");
    if (aFixed && !bFixed) return -1;
    if (!aFixed && bFixed) return 1;
    return (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
  });
  sortedCategories.forEach(cat => {
    const isFixed = cat.isFixed || (cat.name && cat.name.toUpperCase() === "TODAY'S SPECIAL");
    const opt = document.createElement("option");
    opt.value = cat._id;
    opt.textContent = isFixed ? `★ ${cat.name}` : cat.name;
    dishCategorySelect.appendChild(opt);
  });
}

/**
 * Render dishes grid based on active filter
 */
function renderDishesGrid() {
  if (!dishesGrid) return;
  dishesGrid.innerHTML = "";

  let filtered = dishes;
  if (selectedCategoryId) {
    const activeCat = categories.find(c => String(c._id) === selectedCategoryId);
    if (currentCategoryTitle) currentCategoryTitle.textContent = activeCat ? activeCat.name : "Category Dishes";
    filtered = dishes.filter(d => String(d.categoryId) === selectedCategoryId);
  } else {
    if (currentCategoryTitle) currentCategoryTitle.textContent = "All Dishes";
  }

  const menuLoader = document.getElementById("menuCenterLoader");

  if (isFetchingMenuData) {
    if (dishCountLabel) dishCountLabel.textContent = "Items";
    if (emptyDishesState) emptyDishesState.style.display = "none";
    if (menuLoader) menuLoader.style.display = "flex";
    return;
  }

  if (menuLoader) menuLoader.style.display = "none";

  if (dishCountLabel) {
    dishCountLabel.textContent = `${filtered.length} Item${filtered.length === 1 ? "" : "s"}`;
  }

  if (filtered.length === 0) {
    if (emptyDishesState) emptyDishesState.style.display = "flex";
    return;
  }
  if (emptyDishesState) emptyDishesState.style.display = "none";

  filtered.forEach(dish => {
    const card = document.createElement("div");
    card.className = `dish-admin-card ${dish.isAvailable ? "" : "unavailable"}`;

    const catObj = categories.find(c => String(c._id) === String(dish.categoryId));
    const catName = catObj ? catObj.name : "";

    card.innerHTML = `
      <div class="dish-row-info">
        <label class="switch-label dish-row-switch" title="${dish.isAvailable ? 'Available (click to toggle)' : 'Sold Out (click to toggle)'}">
          <span class="switch">
            <input type="checkbox" class="dish-avail-checkbox" data-id="${dish._id}" ${dish.isAvailable ? "checked" : ""}>
            <span class="slider"></span>
          </span>
        </label>
        <div class="dish-card-title" title="Click to edit name" tabindex="0" role="button" aria-label="Edit dish name ${escapeHtml(dish.name)}">${formatDishName(dish.name)}</div>
      </div>
      <div class="dish-row-actions">
        <div class="dish-card-price" title="Click to edit price" tabindex="0" role="button" aria-label="Edit price ${dish.price}">${dish.price}</div>
        <button type="button" class="delete-dish-btn delete-icon-btn" data-id="${dish._id}" title="Delete Dish" aria-label="Delete Dish">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    `;

    // Toggle availability (optimistic & smooth in-place without rebuilding DOM)
    const availCheck = card.querySelector(".dish-avail-checkbox");
    availCheck.addEventListener("change", async (e) => {
      const isAvailable = e.target.checked;
      card.classList.toggle("unavailable", !isAvailable);
      const switchLbl = card.querySelector(".switch-label");
      if (switchLbl) switchLbl.title = isAvailable ? 'Available (click to toggle)' : 'Sold Out (click to toggle)';
      await toggleDishAvailability(dish._id, isAvailable, card, availCheck);
    });

    // Make dish name and price editable on click
    const titleEl = card.querySelector(".dish-card-title");
    attachInlineTitleEditor(titleEl, dish);

    const priceEl = card.querySelector(".dish-card-price");
    attachInlinePriceEditor(priceEl, dish);

    // Delete button
    card.querySelector(".delete-dish-btn").addEventListener("click", () => {
      confirmDeleteDish(dish);
    });

    dishesGrid.appendChild(card);
  });
}

/**
 * Enable click-to-edit for Dish Title
 */
function attachInlineTitleEditor(titleEl, dish) {
  function startEdit() {
    if (titleEl.classList.contains("is-editing")) return;
    titleEl.classList.add("is-editing");

    const originalName = dish.name;
    const input = document.createElement("input");
    input.type = "text";
    input.className = "dish-inline-input dish-title-input";
    input.value = originalName;
    input.placeholder = "Dish name";
    input.setAttribute("aria-label", "Dish name");

    titleEl.textContent = "";
    titleEl.appendChild(input);
    input.focus();
    input.select();

    input.addEventListener("click", (e) => e.stopPropagation());

    let finished = false;
    async function commit(save) {
      if (finished) return;
      finished = true;
      const newName = input.value.trim();
      titleEl.classList.remove("is-editing");

      if (save && newName && newName !== originalName) {
        titleEl.innerHTML = formatDishName(newName);
        titleEl.setAttribute("aria-label", `Edit dish name ${escapeHtml(newName)}`);
        dish.name = newName;
        try {
          const res = await fetch("/api/owner/items", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: dish._id, name: newName })
          });
          const data = await res.json();
          if (!data.success) {
            showNotification(data.error || "Failed to update name", "error");
            dish.name = originalName;
            titleEl.innerHTML = formatDishName(originalName);
            titleEl.setAttribute("aria-label", `Edit dish name ${escapeHtml(originalName)}`);
          }
        } catch (err) {
          showNotification("Network error updating name", "error");
          dish.name = originalName;
          titleEl.innerHTML = formatDishName(originalName);
          titleEl.setAttribute("aria-label", `Edit dish name ${escapeHtml(originalName)}`);
        }
      } else {
        dish.name = originalName;
        titleEl.innerHTML = formatDishName(originalName);
        titleEl.setAttribute("aria-label", `Edit dish name ${escapeHtml(originalName)}`);
      }
    }

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        commit(true);
      } else if (e.key === "Escape") {
        e.preventDefault();
        commit(false);
      }
    });

    input.addEventListener("blur", () => {
      commit(true);
    });
  }

  titleEl.addEventListener("click", startEdit);
  titleEl.addEventListener("keydown", (e) => {
    if (!titleEl.classList.contains("is-editing") && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      startEdit();
    }
  });
}

/**
 * Enable click-to-edit for Dish Price
 */
function attachInlinePriceEditor(priceEl, dish) {
  function startEdit() {
    if (priceEl.classList.contains("is-editing")) return;
    priceEl.classList.add("is-editing");

    const originalPrice = dish.price;
    const wrapper = document.createElement("div");
    wrapper.className = "dish-price-edit-wrapper";

    const input = document.createElement("input");
    input.type = "number";
    input.className = "dish-inline-input dish-price-input";
    input.value = originalPrice;
    input.min = "0";
    input.step = "any";
    input.setAttribute("aria-label", "Dish price");

    wrapper.appendChild(input);

    priceEl.textContent = "";
    priceEl.appendChild(wrapper);
    input.focus();
    input.select();

    input.addEventListener("click", (e) => e.stopPropagation());

    let finished = false;
    async function commit(save) {
      if (finished) return;
      finished = true;
      const raw = parseFloat(input.value);
      priceEl.classList.remove("is-editing");

      if (save && !isNaN(raw) && raw >= 0 && raw !== originalPrice) {
        dish.price = raw;
        priceEl.textContent = `${dish.price}`;
        try {
          const res = await fetch("/api/owner/items", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: dish._id, price: raw })
          });
          const data = await res.json();
          if (!data.success) {
            showNotification(data.error || "Failed to update price", "error");
            dish.price = originalPrice;
            priceEl.textContent = `${originalPrice}`;
          }
        } catch (err) {
          showNotification("Network error updating price", "error");
          dish.price = originalPrice;
          priceEl.textContent = `${originalPrice}`;
        }
      } else {
        priceEl.textContent = `${originalPrice}`;
      }
    }

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        commit(true);
      } else if (e.key === "Escape") {
        e.preventDefault();
        commit(false);
      }
    });

    input.addEventListener("blur", () => {
      commit(true);
    });
  }

  priceEl.addEventListener("click", startEdit);
  priceEl.addEventListener("keydown", (e) => {
    if (!priceEl.classList.contains("is-editing") && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      startEdit();
    }
  });
}

/**
 * Toggle Dish Availability directly (smooth in-place update)
 */
async function toggleDishAvailability(dishId, isAvailable, card, checkbox) {
  const d = dishes.find(x => String(x._id) === String(dishId));
  if (d) d.isAvailable = isAvailable;

  try {
    const res = await fetch("/api/owner/items", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: dishId, isAvailable })
    });
    const data = await res.json();
    if (!data.success) {
      showNotification(data.error || "Failed to update availability.", "error");
      if (d) d.isAvailable = !isAvailable;
      if (checkbox) checkbox.checked = !isAvailable;
      if (card) {
        card.classList.toggle("unavailable", isAvailable);
        const switchLbl = card.querySelector(".switch-label");
        if (switchLbl) switchLbl.title = !isAvailable ? 'Available (click to toggle)' : 'Sold Out (click to toggle)';
      }
    }
  } catch (err) {
    showNotification("Network error updating dish.", "error");
    if (d) d.isAvailable = !isAvailable;
    if (checkbox) checkbox.checked = !isAvailable;
    if (card) {
      card.classList.toggle("unavailable", isAvailable);
      const switchLbl = card.querySelector(".switch-label");
      if (switchLbl) switchLbl.title = !isAvailable ? 'Available (click to toggle)' : 'Sold Out (click to toggle)';
    }
  }
}

/**
 * Toggle Category Availability directly (smooth in-place update)
 */
async function toggleCategoryAvailability(catId, isAvailable, card, checkbox) {
  let c = categories.find(x => String(x._id) === String(catId));
  if (!c && (catId === "today_special_fixed" || catId === "today_special")) {
    c = categories.find(x => x.isFixed || (x.name && x.name.toUpperCase() === "TODAY'S SPECIAL"));
  }
  if (c) {
    c.isAvailable = isAvailable;
    c.isVisible = isAvailable;
  }

  try {
    const res = await fetch("/api/owner/categories", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: catId, isAvailable, isVisible: isAvailable })
    });
    const data = await res.json();
    if (!data.success) {
      showNotification(data.error || "Failed to update category availability.", "error");
      if (c) {
        c.isAvailable = !isAvailable;
        c.isVisible = !isAvailable;
      }
      if (checkbox) checkbox.checked = !isAvailable;
      if (card) {
        card.classList.toggle("unavailable", isAvailable);
        const switchLbl = card.querySelector(".switch-label");
        if (switchLbl) switchLbl.title = !isAvailable ? 'Available (click to toggle)' : 'Sold Out / Unavailable (click to toggle)';
      }
    } else if (data.category && c) {
      c._id = data.category._id;
      if (checkbox) checkbox.dataset.id = data.category._id;
      if (card) card.dataset.id = data.category._id;
    }
  } catch (err) {
    showNotification("Network error updating category.", "error");
    if (c) {
      c.isAvailable = !isAvailable;
      c.isVisible = !isAvailable;
    }
    if (checkbox) checkbox.checked = !isAvailable;
    if (card) {
      card.classList.toggle("unavailable", isAvailable);
      const switchLbl = card.querySelector(".switch-label");
      if (switchLbl) switchLbl.title = !isAvailable ? 'Available (click to toggle)' : 'Sold Out / Unavailable (click to toggle)';
    }
  }
}

/**
 * Create a blank category row with empty fields below 'Today's Special'
 */
function createBlankCategoryRow() {
  if (!categoriesGrid) return;

  // If a blank row is already being edited, focus it and scroll it into view
  const existingRow = categoriesGrid.querySelector(".category-admin-card.is-new-blank-row");
  if (existingRow) {
    const existingInput = existingRow.querySelector(".category-inline-input");
    if (existingInput) {
      existingInput.focus();
      existingInput.select();
    }
    existingRow.scrollIntoView({ behavior: "smooth", block: "nearest" });
    return;
  }

  if (emptyCategoriesState) emptyCategoriesState.style.display = "none";

  // Find the 'Today's Special' card (first card in grid)
  const todaySpecialCard = categoriesGrid.querySelector(".today-special-card") || categoriesGrid.firstElementChild;

  const row = document.createElement("div");
  row.className = "category-admin-card is-new-blank-row";
  row.innerHTML = `
    <div class="category-row-info">
      <label class="switch-label category-row-switch" title="Available (click to toggle)">
        <span class="switch">
          <input type="checkbox" class="category-avail-checkbox" checked>
          <span class="slider"></span>
        </span>
      </label>
      <div class="category-card-name is-editing" style="flex: 1; min-width: 0;">
        <input type="text" class="dish-inline-input category-inline-input" placeholder="Category Name" aria-label="New category name">
      </div>
    </div>
    <div class="category-row-actions">
      <span class="category-dish-count-badge">0 items</span>
      <button type="button" class="delete-cat-btn delete-icon-btn cancel-new-cat-btn" title="Cancel" aria-label="Cancel">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  `;

  // Insert below Today's Special
  if (todaySpecialCard && todaySpecialCard.nextSibling) {
    categoriesGrid.insertBefore(row, todaySpecialCard.nextSibling);
  } else {
    categoriesGrid.appendChild(row);
  }

  const input = row.querySelector(".category-inline-input");
  const cancelBtn = row.querySelector(".cancel-new-cat-btn");
  const availCheckbox = row.querySelector(".category-avail-checkbox");

  let isCommitting = false;
  let isDiscarded = false;

  function discardRow() {
    if (isDiscarded) return;
    isDiscarded = true;
    row.remove();
    if (categories.length === 0 && !isFetchingMenuData && emptyCategoriesState) {
      emptyCategoriesState.style.display = "flex";
    }
  }

  async function commitNewCategory() {
    if (isCommitting || isDiscarded) return;
    const nameVal = input.value.trim();

    if (!nameVal) {
      discardRow();
      return;
    }

    isCommitting = true;
    input.disabled = true;

    try {
      const isAvail = availCheckbox ? availCheckbox.checked : true;
      const res = await fetch("/api/owner/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameVal,
          displayOrder: 0,
          isAvailable: isAvail,
          isVisible: isAvail
        })
      });

      const data = await res.json();
      if (data.success && data.category) {
        row.remove();
        await loadMenuData();
        showNotification(`Category "${data.category.name}" added successfully.`);
      } else {
        showNotification(data.error || "Failed to add category.", "error");
        input.disabled = false;
        isCommitting = false;
        input.focus();
      }
    } catch (err) {
      showNotification("Network error adding category.", "error");
      input.disabled = false;
      isCommitting = false;
      input.focus();
    }
  }

  cancelBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    discardRow();
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitNewCategory();
    } else if (e.key === "Escape") {
      e.preventDefault();
      discardRow();
    }
  });

  input.addEventListener("blur", (e) => {
    if (e.relatedTarget && e.relatedTarget.closest(".cancel-new-cat-btn")) {
      return;
    }
    setTimeout(() => {
      if (!isCommitting && !isDiscarded) {
        if (!input.value.trim()) {
          discardRow();
        } else {
          commitNewCategory();
        }
      }
    }, 130);
  });

  setTimeout(() => {
    if (input && !isDiscarded) {
      input.focus();
    }
  }, 40);

  row.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/**
 * Category Modal Logic
 */
function openAddCategoryModal() {
  categoryModalTitle.textContent = "Add New Category";
  categoryIdInput.value = "";
  categoryNameInput.value = "";
  categoryModal.style.display = "flex";
  updateScrollLock();
  categoryNameInput.focus();
}

function openEditCategoryModal() {
  if (!selectedCategoryId) return;
  const activeCat = categories.find(c => String(c._id) === selectedCategoryId);
  if (!activeCat) return;

  categoryModalTitle.textContent = "Rename Category";
  categoryIdInput.value = activeCat._id;
  categoryNameInput.value = activeCat.name;
  categoryModal.style.display = "flex";
  updateScrollLock();
  categoryNameInput.focus();
}

function closeCategoryModal() {
  categoryModal.style.display = "none";
  updateScrollLock();
}

categoryForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const catId = categoryIdInput.value;
  const name = categoryNameInput.value.trim();

  if (!name) {
    showNotification("Category name cannot be blank.", "error");
    return;
  }

  const isEdit = !!catId;
  const endpoint = "/api/owner/categories";
  const method = isEdit ? "PATCH" : "POST";
  const payload = isEdit ? { id: catId, name } : { name };

  try {
    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      closeCategoryModal();
      await loadMenuData();
      if (!isEdit && data.category) {
        selectedCategoryId = String(data.category._id);
        renderCategoryTabs();
        renderDishesGrid();
      }
    } else {
      showNotification(data.error || "Failed to save category.", "error");
    }
  } catch (err) {
    showNotification("Network error saving category.", "error");
  }
});

// Category event listeners
if (categorySelectDropdown) {
  categorySelectDropdown.addEventListener("change", (e) => {
    selectedCategoryId = e.target.value ? String(e.target.value) : null;
    updateCategoryDropdownDisplay();
    renderDishesGrid();
  });
}
if (openAddCategoryHeaderBtn) openAddCategoryHeaderBtn.addEventListener("click", createBlankCategoryRow);
if (emptyStateAddCategoryBtn) emptyStateAddCategoryBtn.addEventListener("click", createBlankCategoryRow);
closeCategoryModalBtn.addEventListener("click", closeCategoryModal);
cancelCategoryBtn.addEventListener("click", closeCategoryModal);

/**
 * Dish Modal Logic
 */
function openAddDishModal() {
  if (categories.length === 0) {
    showNotification("Please create at least one category before adding dishes.", "error");
    switchDashboardView("category");
    createBlankCategoryRow();
    return;
  }
  dishModalTitle.textContent = "Add New Dish";
  dishIdInput.value = "";
  dishNameInput.value = "";
  dishPriceInput.value = "";
  dishAvailableInput.checked = true;

  if (selectedCategoryId) {
    dishCategorySelect.value = selectedCategoryId;
  } else if (categories.length > 0) {
    dishCategorySelect.value = categories[0]._id;
  }

  dishModal.style.display = "flex";
  updateScrollLock();
  dishNameInput.focus();
}

function openEditDishModal(dish) {
  dishModalTitle.textContent = "Edit Dish";
  dishIdInput.value = dish._id;
  dishNameInput.value = dish.name;
  dishPriceInput.value = dish.price;
  dishAvailableInput.checked = dish.isAvailable !== false;
  dishCategorySelect.value = dish.categoryId;

  dishModal.style.display = "flex";
  updateScrollLock();
  dishNameInput.focus();
}

function closeDishModal() {
  dishModal.style.display = "none";
  updateScrollLock();
}

dishForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const dishId = dishIdInput.value;
  const categoryId = dishCategorySelect.value;
  const name = dishNameInput.value.trim();
  const price = Number(dishPriceInput.value);
  const isAvailable = dishAvailableInput.checked;

  if (!categoryId) {
    showNotification("Please select a category for this dish.", "error");
    return;
  }
  if (!name) {
    showNotification("Dish name is required.", "error");
    return;
  }
  if (isNaN(price) || price < 0) {
    showNotification("Please enter a valid price.", "error");
    return;
  }

  const isEdit = !!dishId;
  const endpoint = "/api/owner/items";
  const method = isEdit ? "PATCH" : "POST";
  const payload = isEdit
    ? { id: dishId, categoryId, name, price, isAvailable }
    : { categoryId, name, price, isAvailable };

  try {
    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      closeDishModal();
      await loadMenuData();
    } else {
      showNotification(data.error || "Failed to save dish.", "error");
    }
  } catch (err) {
    showNotification("Network error saving dish.", "error");
  }
});

async function confirmDeleteDish(dish) {
  if (!confirm(`Are you sure you want to delete dish "${dish.name}"?`)) return;

  try {
    const res = await fetch(`/api/owner/items?id=${dish._id}`, {
      method: "DELETE"
    });
    const data = await res.json();
    if (data.success) {
      await loadMenuData();
    } else {
      showNotification(data.error || "Failed to delete dish.", "error");
    }
  } catch (err) {
    showNotification("Network error deleting dish.", "error");
  }
}

// Dish event listeners
if (openAddDishBtn) openAddDishBtn.addEventListener("click", openAddDishModal);
if (emptyStateAddDishBtn) emptyStateAddDishBtn.addEventListener("click", openAddDishModal);
if (closeDishModalBtn) closeDishModalBtn.addEventListener("click", closeDishModal);
if (cancelDishBtn) cancelDishBtn.addEventListener("click", closeDishModal);

// Backdrop click and touch prevention for modals
[categoryModal, dishModal, logoutModal].forEach(modal => {
  if (!modal) return;
  modal.addEventListener("touchmove", (e) => {
    if (e.target === modal) {
      e.preventDefault();
    }
  }, { passive: false });
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      if (modal === categoryModal) closeCategoryModal();
      if (modal === dishModal) closeDishModal();
      if (modal === logoutModal) closeLogoutModal();
    }
  });
});

// Escape key to close any active modal or drawer
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const lm = document.getElementById("logoutModal");
    if (lm && lm.style.display === "flex") {
      closeLogoutModal();
    } else if (categoryModal && categoryModal.style.display === "flex") {
      closeCategoryModal();
    } else if (dishModal && dishModal.style.display === "flex") {
      closeDishModal();
    } else if (drawerSidebar && drawerSidebar.classList.contains("open")) {
      closeDrawer();
    }
  }
});

/**
 * Safe HTML string escape helper
 */
function escapeHtml(str) {
  if (!str) return "";
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Format bracketed text like (2 pcs), (Half), (Full) to match customer menu styling
 */
function formatDishName(name) {
  const safe = escapeHtml(name || "");
  return safe.replace(/(\([^)]+\))/g, '<span class="dish-note">$1</span>');
}

/**
 * ==========================================================================
 * BRANDING & BUSINESS PROFILE CONTROLLER
 * ==========================================================================
 */
function showBrandingOwnerNameError(msg = "Please enter a valid name of owner") {
  if (brandingOwnerNameErrorMsg) {
    brandingOwnerNameErrorMsg.textContent = msg;
    brandingOwnerNameErrorMsg.style.display = "block";
  }
  if (brandingOwnerNameInput) {
    brandingOwnerNameInput.classList.add("has-error");
  }
}

function hideBrandingOwnerNameError() {
  if (brandingOwnerNameErrorMsg) {
    brandingOwnerNameErrorMsg.textContent = "";
    brandingOwnerNameErrorMsg.style.display = "none";
  }
  if (brandingOwnerNameInput) {
    brandingOwnerNameInput.classList.remove("has-error");
  }
}

function showBrandingBizNameError(msg = "Please enter a valid name of business") {
  if (brandingBizNameErrorMsg) {
    brandingBizNameErrorMsg.textContent = msg;
    brandingBizNameErrorMsg.style.display = "block";
  }
  if (brandingBizNameInput) {
    brandingBizNameInput.classList.add("has-error");
  }
}

function hideBrandingBizNameError() {
  if (brandingBizNameErrorMsg) {
    brandingBizNameErrorMsg.textContent = "";
    brandingBizNameErrorMsg.style.display = "none";
  }
  if (brandingBizNameInput) {
    brandingBizNameInput.classList.remove("has-error");
  }
}

function showBrandingPhoneError(msg = "Please enter a valid phone number.") {
  if (brandingPhoneErrorMsg) {
    brandingPhoneErrorMsg.textContent = msg;
    brandingPhoneErrorMsg.style.display = "block";
  }
  if (brandingPhoneInput) {
    brandingPhoneInput.classList.add("has-error");
  }
}

function hideBrandingPhoneError() {
  if (brandingPhoneErrorMsg) {
    brandingPhoneErrorMsg.textContent = "";
    brandingPhoneErrorMsg.style.display = "none";
  }
  if (brandingPhoneInput) {
    brandingPhoneInput.classList.remove("has-error");
  }
}

function populateBrandingForm() {
  if (!currentBusiness) return;

  const existingName = currentBusiness.name || "";
  const existingOwnerName = currentBusiness.ownerName || (currentUser && currentUser.name) || "";
  const existingPhone = (currentBusiness.contact && currentBusiness.contact.phone) || (currentUser && currentUser.phone) || "";
  const existingLogo = (currentBusiness.branding && currentBusiness.branding.logoUrl) || "";

  brandingUploadedLogoData = existingLogo;

  brandingInitialValues = {
    name: existingName,
    ownerName: existingOwnerName,
    phone: existingPhone,
    logoUrl: existingLogo
  };

  hideBrandingOwnerNameError();
  hideBrandingBizNameError();
  hideBrandingPhoneError();

  if (brandingBizNameInput) {
    brandingBizNameInput.value = existingName;
  }
  if (brandingOwnerNameInput) {
    brandingOwnerNameInput.value = existingOwnerName;
  }
  if (brandingPhoneInput) {
    brandingPhoneInput.value = existingPhone;
  }

  if (existingLogo) {
    brandingUploadedLogoData = existingLogo;
    if (brandingLogoPreviewImg) {
      brandingLogoPreviewImg.src = existingLogo;
      brandingLogoPreviewImg.style.display = "block";
    }
    if (brandingLogoCaption) brandingLogoCaption.style.display = "block";
    if (brandingNoPhotoText) brandingNoPhotoText.style.display = "none";
    if (brandingChangeLogoBtn) {
      brandingChangeLogoBtn.textContent = "Change";
      brandingChangeLogoBtn.title = "Change Logo";
    }
    if (brandingRemoveLogoBtn) brandingRemoveLogoBtn.disabled = false;
    if (brandingLogoPlaceholder) brandingLogoPlaceholder.style.display = "none";
    if (brandingLogoPreviewWrapper) brandingLogoPreviewWrapper.style.display = "flex";
  } else {
    clearBrandingLogo(false);
  }

  checkBrandingFormChanged();
}

function clearBrandingLogo(triggerCheck = true) {
  brandingUploadedLogoData = "";
  if (brandingLogoInput) brandingLogoInput.value = "";
  if (brandingLogoPreviewImg) {
    brandingLogoPreviewImg.src = "";
    brandingLogoPreviewImg.style.display = "none";
  }
  if (brandingLogoCaption) brandingLogoCaption.style.display = "none";
  if (brandingNoPhotoText) brandingNoPhotoText.style.display = "block";
  if (brandingChangeLogoBtn) {
    brandingChangeLogoBtn.textContent = "Upload";
    brandingChangeLogoBtn.title = "Upload Logo";
  }
  if (brandingRemoveLogoBtn) brandingRemoveLogoBtn.disabled = true;
  if (brandingLogoPlaceholder) brandingLogoPlaceholder.style.display = "none";
  if (brandingLogoPreviewWrapper) brandingLogoPreviewWrapper.style.display = "flex";
  if (triggerCheck) {
    checkBrandingFormChanged();
  }
}

function handleBrandingLogoFile(file) {
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    showNotification("Please select an image file (PNG, JPG, WEBP, or SVG).", "error");
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    showNotification("Logo file size must be less than 5MB.", "error");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const rawData = e.target.result;
    if (file.type !== "image/svg+xml") {
      const img = new Image();
      img.onload = () => {
        const maxDim = 512;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        brandingUploadedLogoData = canvas.toDataURL(file.type === "image/png" ? "image/png" : "image/jpeg", 0.9);
        displayBrandingLogoPreview(brandingUploadedLogoData, file.name, file.size);
        checkBrandingFormChanged();
      };
      img.onerror = () => {
        brandingUploadedLogoData = rawData;
        displayBrandingLogoPreview(rawData, file.name, file.size);
        checkBrandingFormChanged();
      };
      img.src = rawData;
    } else {
      brandingUploadedLogoData = rawData;
      displayBrandingLogoPreview(rawData, file.name, file.size);
      checkBrandingFormChanged();
    }
  };
  reader.readAsDataURL(file);
}

function displayBrandingLogoPreview(dataUrl, name, size) {
  if (brandingLogoPreviewImg) {
    brandingLogoPreviewImg.src = dataUrl;
    brandingLogoPreviewImg.style.display = "block";
  }
  if (brandingLogoCaption) brandingLogoCaption.style.display = "block";
  if (brandingNoPhotoText) brandingNoPhotoText.style.display = "none";
  if (brandingChangeLogoBtn) {
    brandingChangeLogoBtn.textContent = "Change";
    brandingChangeLogoBtn.title = "Change Logo";
  }
  if (brandingRemoveLogoBtn) brandingRemoveLogoBtn.disabled = false;
  if (brandingLogoPlaceholder) brandingLogoPlaceholder.style.display = "none";
  if (brandingLogoPreviewWrapper) brandingLogoPreviewWrapper.style.display = "flex";
}

if (brandingLogoInput) {
  brandingLogoInput.addEventListener("change", () => {
    if (brandingLogoInput.files && brandingLogoInput.files[0]) {
      handleBrandingLogoFile(brandingLogoInput.files[0]);
    }
  });
}

if (brandingChangeLogoBtn && brandingLogoInput) {
  brandingChangeLogoBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    brandingLogoInput.click();
  });
}

if (brandingRemoveLogoBtn) {
  brandingRemoveLogoBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    clearBrandingLogo();
  });
}

if (brandingForm) {
  brandingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const ownerName = brandingOwnerNameInput ? brandingOwnerNameInput.value.trim() : "";
    const name = brandingBizNameInput ? brandingBizNameInput.value.trim() : "";
    const phone = brandingPhoneInput ? brandingPhoneInput.value.trim() : "";

    if (!ownerName || ownerName.length < 2) {
      showBrandingOwnerNameError();
      showNotification("Please enter a valid name of owner", "error");
      return;
    }

    if (!name || name.length < 2) {
      showBrandingBizNameError();
      showNotification("Please enter a valid name of business", "error");
      return;
    }

    if (!phone || phone.length < 10) {
      showBrandingPhoneError();
      showNotification("Please enter a valid phone number.", "error");
      return;
    }

    if (brandingSubmitBtn) brandingSubmitBtn.disabled = true;
    if (brandingBtnLabel) brandingBtnLabel.style.display = "none";
    if (brandingSaveSpinner) brandingSaveSpinner.style.display = "inline-block";

    try {
      const res = await fetch("/api/owner/business", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          ownerName,
          phone,
          logoUrl: brandingUploadedLogoData
        })
      });

      const data = await res.json();
      if (data.success && data.business) {
        currentBusiness = data.business;
        brandingUploadedLogoData = (currentBusiness.branding && currentBusiness.branding.logoUrl) || "";
        brandingInitialValues = {
          name: currentBusiness.name || "",
          ownerName: currentBusiness.ownerName || (currentUser && currentUser.name) || "",
          phone: (currentBusiness.contact && currentBusiness.contact.phone) || (currentUser && currentUser.phone) || "",
          logoUrl: (currentBusiness.branding && currentBusiness.branding.logoUrl) || ""
        };

        if (brandingUploadedLogoData) {
          if (brandingLogoPreviewImg) brandingLogoPreviewImg.src = brandingUploadedLogoData;
          if (brandingLogoFileSize) brandingLogoFileSize.textContent = "Saved";
        }
        if (currentUser) {
          currentUser.name = ownerName;
          currentUser.phone = phone;
        }

        updateHeaderProfile();

        const drawerRestaurantName = document.getElementById("drawerRestaurantName");
        if (drawerRestaurantName) drawerRestaurantName.textContent = currentBusiness.name;

        const dashBizEl = document.getElementById("dashboardBizName");
        if (dashBizEl) dashBizEl.textContent = currentBusiness.name;

        const bizNameEl = document.getElementById("bizNameDisplay");
        if (bizNameEl) bizNameEl.textContent = currentBusiness.name;

        if (brandingBtnLabel) {
          brandingBtnLabel.textContent = "Saved ✓";
          setTimeout(() => {
            if (brandingBtnLabel) brandingBtnLabel.textContent = "Save Changes";
          }, 2400);
        }
      } else {
        if (brandingBizNameErrorMsg) {
          brandingBizNameErrorMsg.textContent = data.error || "Failed to update branding.";
          brandingBizNameErrorMsg.style.display = "block";
        }
      }
    } catch (err) {
      if (brandingBizNameErrorMsg) {
        brandingBizNameErrorMsg.textContent = "Network error updating branding. Please try again.";
        brandingBizNameErrorMsg.style.display = "block";
      }
    } finally {
      if (brandingBtnLabel) brandingBtnLabel.style.display = "inline";
      if (brandingSaveSpinner) brandingSaveSpinner.style.display = "none";
      checkBrandingFormChanged();
    }
  });
}

// 1. Owner Name input validation: validate > 1 character, show message on blur
if (brandingOwnerNameInput) {
  brandingOwnerNameInput.addEventListener("input", (e) => {
    const val = e.target.value.trim();
    if (val.length > 1 || val.length === 0) {
      hideBrandingOwnerNameError();
    }
    checkBrandingFormChanged();
  });

  brandingOwnerNameInput.addEventListener("focus", () => {
    hideBrandingOwnerNameError();
  });

  brandingOwnerNameInput.addEventListener("blur", () => {
    const val = brandingOwnerNameInput.value.trim();
    if (val.length === 1) {
      showBrandingOwnerNameError();
    } else {
      hideBrandingOwnerNameError();
    }
  });
}

// 2. Business Name input validation: validate > 1 character, show message on blur
if (brandingBizNameInput) {
  brandingBizNameInput.addEventListener("input", (e) => {
    const val = e.target.value.trim();
    if (val.length > 1 || val.length === 0) {
      hideBrandingBizNameError();
    }
    checkBrandingFormChanged();
  });

  brandingBizNameInput.addEventListener("focus", () => {
    hideBrandingBizNameError();
  });

  brandingBizNameInput.addEventListener("blur", () => {
    const val = brandingBizNameInput.value.trim();
    if (val.length === 1) {
      showBrandingBizNameError();
    } else {
      hideBrandingBizNameError();
    }
  });
}

// 3. Phone input validation: numbers only and max 10 digits
if (brandingPhoneInput) {
  brandingPhoneInput.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
    if (e.target.value.length === 10) {
      hideBrandingPhoneError();
    }
    checkBrandingFormChanged();
  });

  brandingPhoneInput.addEventListener("focus", () => {
    hideBrandingPhoneError();
  });

  brandingPhoneInput.addEventListener("blur", () => {
    const val = brandingPhoneInput.value.trim();
    if (val.length > 0 && val.length < 10) {
      showBrandingPhoneError();
    } else {
      hideBrandingPhoneError();
    }
  });
}

window.addEventListener("hashchange", () => {
  const hash = window.location.hash;
  if (!currentBusiness || currentBusiness.approvalStatus !== "approved") return;
  if (hash === "#branding") {
    populateBrandingForm();
    showView(brandingView);
  } else if (hash === "#menu" || hash === "#dashboard") {
    showView(dashboardView);
  }
});

// Start initialization on page load
document.addEventListener("DOMContentLoaded", () => {
  checkSession();
});
