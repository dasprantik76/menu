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
const themeColorsView = document.getElementById("themeColorsView");
const qrCodeView = document.getElementById("qrCodeView");
const importMenuView = document.getElementById("importMenuView");

// QR Code DOM Elements
const qrCodeGraphic = document.getElementById("qrCodeGraphic");
const qrCodeUrlText = document.getElementById("qrCodeUrlText");
const qrCodeOpenLink = document.getElementById("qrCodeOpenLink");
const qrDownloadBtn = document.getElementById("qrDownloadBtn");
const qrCopyLinkBtn = document.getElementById("qrCopyLinkBtn");
const qrCopyBtnText = document.getElementById("qrCopyBtnText");

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
const drawerImportLink = document.getElementById("drawerImportLink");
const drawerBrandingLink = document.getElementById("drawerBrandingLink");
const drawerThemeLink = document.getElementById("drawerThemeLink");
const drawerQrLink = document.getElementById("drawerQrLink");

let ownerServerTimeOffset = 0;

function getOwnerNow() {
  return new Date(Date.now() + ownerServerTimeOffset);
}

function updateAccountExpiryBadge() {
  const drawerAccountExpiry = document.getElementById("drawerAccountExpiry");
  const drawerAccountExpiryText = document.getElementById("drawerAccountExpiryText");
  if (!drawerAccountExpiry || !drawerAccountExpiryText) return;

  if (currentBusiness && currentBusiness.serverTime) {
    ownerServerTimeOffset = new Date(currentBusiness.serverTime).getTime() - Date.now();
  }

  if (!currentBusiness || currentBusiness.approvalStatus !== "approved") {
    drawerAccountExpiry.style.display = "none";
    return;
  }

  const expiryVal = currentBusiness.approvalExpiry || currentBusiness.subscriptionExpiry;
  if (expiryVal) {
    const expiry = new Date(expiryVal);
    if (!isNaN(expiry.getTime())) {
      let days = typeof currentBusiness.approvalDaysLeft === "number"
        ? currentBusiness.approvalDaysLeft
        : Math.max(0, Math.ceil((expiry.getTime() - getOwnerNow().getTime()) / (1000 * 60 * 60 * 24)));

      if (days <= 0) {
        drawerAccountExpiryText.textContent = "Expired";
        drawerAccountExpiryText.classList.add("is-urgent");
        drawerAccountExpiry.style.display = "flex";
        return;
      }

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
  const isDrawerOpen = !!(dSidebar && dSidebar.classList.contains("open"));
  const openModals = document.querySelectorAll(".modal-overlay");
  const isAnyModalOpen = Array.from(openModals).some(m => m.style.display === "flex" && !m.classList.contains("closing"));

  if (isDrawerOpen || isAnyModalOpen) {
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

if (drawerImportLink) {
  drawerImportLink.addEventListener("click", (e) => {
    e.preventDefault();
    closeDrawer();
    showView(importMenuView);
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

if (drawerThemeLink) {
  drawerThemeLink.addEventListener("click", (e) => {
    e.preventDefault();
    closeDrawer();
    renderThemeColorsView();
    showView(themeColorsView);
  });
}

if (drawerQrLink) {
  drawerQrLink.addEventListener("click", (e) => {
    e.preventDefault();
    closeDrawer();
    renderQrCodeView();
    showView(qrCodeView);
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
      const activeView = [pendingView, dashboardView, registerView, authView, importMenuView, brandingView, themeColorsView, qrCodeView].find(v => v && v.style.display !== "none");
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

function updateMetaThemeColor(color) {
  if (!color) return;
  let metaTheme = document.querySelector('meta[name="theme-color"]');
  if (!metaTheme) {
    metaTheme = document.createElement("meta");
    metaTheme.name = "theme-color";
    document.head.appendChild(metaTheme);
  }
  metaTheme.setAttribute("content", color);
}

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
  const isImportMenu = (viewElement === importMenuView);
  const isBranding = (viewElement === brandingView);
  const isThemeColors = (viewElement === themeColorsView);
  const isQrCode = (viewElement === qrCodeView);
  const header = document.querySelector(".owner-header");

  const themeColor = (isAuth || isRegister) ? "#f8f6f2" : "#991e2e";
  updateMetaThemeColor(themeColor);

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
  document.body.classList.toggle("theme-mode", isThemeColors);
  document.documentElement.classList.toggle("theme-mode", isThemeColors);
  document.body.classList.toggle("qrcode-mode", isQrCode);
  document.documentElement.classList.toggle("qrcode-mode", isQrCode);

  [loadingView, authView, registerView, pendingView, dashboardView, importMenuView, brandingView, themeColorsView, qrCodeView].forEach(v => {
    if (v) {
      v.style.setProperty("display", "none", "important");
      v.classList.remove("fade-in-active");
    }
  });
  if (typeof closeCustomColorPicker === "function") {
    closeCustomColorPicker();
  }
  if (viewElement) {
    viewElement.style.removeProperty("display");
    viewElement.style.display = (viewElement === authView || viewElement === registerView || viewElement === pendingView || viewElement === qrCodeView) ? "flex" : "block";
    viewElement.classList.remove("fade-in-active");
    void viewElement.offsetWidth;
    viewElement.classList.add("fade-in-active");
    if (typeof initStickyBarScroll === "function") {
      initStickyBarScroll();
    }
  }

  const stickyActionBar = document.getElementById("stickyDashboardActionBar") || document.getElementById("stickyAddDishBar");
  if (stickyActionBar) {
    stickyActionBar.style.display = (viewElement === dashboardView && isInitialMenuDataLoaded && !isFetchingMenuData) ? "flex" : "none";
  }
  const stickyQrActionBar = document.getElementById("stickyQrActionBar");
  if (stickyQrActionBar) {
    stickyQrActionBar.style.display = isQrCode ? "flex" : "none";
  }
  if (isQrCode) {
    window.scrollTo(0, 0);
    if (typeof updateQrStandPanels === "function") {
      requestAnimationFrame(updateQrStandPanels);
      setTimeout(updateQrStandPanels, 60);
    }
  }
  const addCategoryBtn = document.getElementById("openAddCategoryHeaderBtn");
  const addDishBtn = document.getElementById("openAddDishBtn");
  if (addCategoryBtn) addCategoryBtn.style.display = (currentDashboardView === "category") ? "inline-flex" : "none";
  if (addDishBtn) addDishBtn.style.display = (currentDashboardView === "menu") ? "inline-flex" : "none";
  if (typeof updateAddDishBtnState === "function") updateAddDishBtnState();

  if (isRegister) startTitleWordRotation();

  // Drawer nav item active states
  if (drawerMenuLink) drawerMenuLink.classList.toggle("active", isDashboard);
  if (drawerImportLink) drawerImportLink.classList.toggle("active", isImportMenu);
  if (drawerBrandingLink) drawerBrandingLink.classList.toggle("active", isBranding);
  if (drawerThemeLink) drawerThemeLink.classList.toggle("active", isThemeColors);
  if (drawerQrLink) drawerQrLink.classList.toggle("active", isQrCode);

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
    } else if (isImportMenu) {
      sessionStorage.setItem("menucard_view", "importmenu");
      localStorage.setItem("menucard_view", "importmenu");
      if (window.location.hash !== "#importmenu") {
        window.history.replaceState(null, document.title, window.location.pathname + "#importmenu");
      }
    } else if (isBranding) {
      sessionStorage.setItem("menucard_view", "branding");
      localStorage.setItem("menucard_view", "branding");
      if (window.location.hash !== "#branding") {
        window.history.replaceState(null, document.title, window.location.pathname + "#branding");
      }
    } else if (isThemeColors) {
      sessionStorage.setItem("menucard_view", "themecolors");
      localStorage.setItem("menucard_view", "themecolors");
      if (window.location.hash !== "#themecolors") {
        window.history.replaceState(null, document.title, window.location.pathname + "#themecolors");
      }
    } else if (isQrCode) {
      sessionStorage.setItem("menucard_view", "qrcode");
      localStorage.setItem("menucard_view", "qrcode");
      if (window.location.hash !== "#qrcode") {
        window.history.replaceState(null, document.title, window.location.pathname + "#qrcode");
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

    const isLoggedOut = urlParams.get("logged_out");
    if (isLoggedOut) {
      currentUser = null;
      currentBusiness = null;
      try {
        sessionStorage.clear();
        localStorage.removeItem("menucard_view");
      } catch (e) {}
      try {
        await fetch("/api/auth/logout", { method: "POST" });
      } catch (e) {}
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      showView(authView);
      setupGoogleButton();
      return;
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
      headers: { "Bypass-Tunnel-Reminder": "true" },
      cache: "no-store"
    });

    if (!res.ok) {
      console.warn("Session check endpoint returned status:", res.status);
      showView(authView);
      setupGoogleButton();
      return;
    }

    const data = await res.json();

    if (data.success && data.authenticated && data.user) {
      if (data.serverTime) {
        ownerServerTimeOffset = new Date(data.serverTime).getTime() - Date.now();
      }
      currentUser = data.user;
      currentBusiness = data.business;

      if (currentBusiness && currentBusiness.branding) {
        if (currentBusiness.branding.accentColor && typeof normalizeHexColor === "function") {
          const normTop = normalizeHexColor(currentBusiness.branding.accentColor);
          if (normTop) {
            savedTopColor = normTop;
            currentTopColor = normTop;
          }
        }
        if (currentBusiness.branding.backgroundColor && typeof normalizeHexColor === "function") {
          const normBg = normalizeHexColor(currentBusiness.branding.backgroundColor);
          if (normBg) {
            savedBgColor = normBg;
            currentBgColor = normBg;
          }
        }
        if (currentBusiness.branding.nameTextColor && typeof normalizeHexColor === "function") {
          const normName = normalizeHexColor(currentBusiness.branding.nameTextColor);
          if (normName) {
            savedNameColor = normName;
            currentNameColor = normName;
            isCustomNameColor = true;
          }
        }
        if (currentBusiness.branding.nameFont) {
          savedNameFont = currentBusiness.branding.nameFont;
          currentNameFont = savedNameFont;
        }
      }
      if (typeof updateQrStandPanels === "function") {
        updateQrStandPanels();
      }

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
        } else if (hash === "#importmenu" || savedView === "importmenu") {
          showView(importMenuView);
        } else if (hash === "#themecolors" || savedView === "themecolors") {
          renderThemeColorsView();
          showView(themeColorsView);
        } else if (hash === "#qrcode" || savedView === "qrcode") {
          renderQrCodeView();
          showView(qrCodeView);
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
      savedCustomPresets = [];
      try {
        sessionStorage.removeItem("menucard_view");
        localStorage.removeItem("menucard_view");
        localStorage.removeItem("menucard_custom_presets_default");
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

  if (!isInitialMenuDataLoaded) {
    document.body.classList.add("dashboard-initial-loading");
    const centralLoader = document.getElementById("dashboardCentralLoader");
    const bodyContent = document.getElementById("dashboardBodyContent");
    if (centralLoader) centralLoader.style.display = "flex";
    if (bodyContent) bodyContent.style.display = "none";
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
    savedCustomPresets = [];
    try {
      localStorage.removeItem("menucard_custom_presets_default");
    } catch (e) {}
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

function openModal(modalElement) {
  if (!modalElement) return;
  modalElement.classList.remove("closing");
  const content = modalElement.querySelector(".modal-content");
  if (content) {
    content.classList.remove("closing");
    content.style.animation = "none";
    void content.offsetWidth;
    content.style.animation = "";
  }
  modalElement.style.display = "flex";
  modalElement.style.animation = "none";
  void modalElement.offsetWidth;
  modalElement.style.animation = "";
  updateScrollLock();
}

function closeModal(modalElement, callback) {
  if (!modalElement) {
    if (typeof callback === "function") callback();
    return;
  }
  if (modalElement.style.display === "none") {
    if (typeof callback === "function") callback();
    return;
  }
  if (modalElement.classList.contains("closing")) {
    return;
  }

  modalElement.classList.add("closing");
  const content = modalElement.querySelector(".modal-content");
  if (content) {
    content.classList.add("closing");
  }

  updateScrollLock();

  setTimeout(() => {
    modalElement.classList.remove("closing");
    if (content) {
      content.classList.remove("closing");
    }
    modalElement.style.display = "none";
    updateScrollLock();
    if (typeof callback === "function") callback();
  }, 220);
}

function openLogoutModal() {
  const lm = document.getElementById("logoutModal") || logoutModal;
  if (lm) openModal(lm);
}

function closeLogoutModal(callback) {
  const lm = document.getElementById("logoutModal") || logoutModal;
  closeModal(lm, callback);
}

const deleteCategoryModal = document.getElementById("deleteCategoryModal");
const deleteCategoryModalTitle = document.getElementById("deleteCategoryModalTitle");
const deleteCategoryModalMsg = document.getElementById("deleteCategoryModalMsg");
const cancelDeleteCategoryBtn = document.getElementById("cancelDeleteCategoryBtn");
const confirmDeleteCategoryBtn = document.getElementById("confirmDeleteCategoryBtn");

let pendingCategoryDeletion = null;

function closeDeleteCategoryModal(callback) {
  const modal = document.getElementById("deleteCategoryModal") || deleteCategoryModal;
  closeModal(modal, () => {
    pendingCategoryDeletion = null;
    if (typeof callback === "function") callback();
  });
}

if (cancelDeleteCategoryBtn) {
  cancelDeleteCategoryBtn.addEventListener("click", () => closeDeleteCategoryModal());
}

if (confirmDeleteCategoryBtn) {
  confirmDeleteCategoryBtn.addEventListener("click", () => {
    if (!pendingCategoryDeletion) {
      closeDeleteCategoryModal();
      return;
    }
    const { targetCatId, catId, cat, tracker } = pendingCategoryDeletion;
    closeDeleteCategoryModal();
    executeCategoryDeletion(targetCatId, catId, cat, tracker);
  });
}

const selectCategoryAlertModal = document.getElementById("selectCategoryAlertModal");
const okSelectCategoryAlertBtn = document.getElementById("okSelectCategoryAlertBtn");

function openSelectCategoryAlertModal() {
  const modal = document.getElementById("selectCategoryAlertModal") || selectCategoryAlertModal;
  if (modal) {
    openModal(modal);
    if (okSelectCategoryAlertBtn) okSelectCategoryAlertBtn.focus();
  }
}

function closeSelectCategoryAlertModal(callback) {
  const modal = document.getElementById("selectCategoryAlertModal") || selectCategoryAlertModal;
  closeModal(modal, callback);
}

if (okSelectCategoryAlertBtn) {
  okSelectCategoryAlertBtn.addEventListener("click", closeSelectCategoryAlertModal);
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", openLogoutModal);
}

if (registerLogoutBtn) {
  registerLogoutBtn.addEventListener("click", handleLogout);
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
let newlyCreatedCategoryId = null;
let isFetchingMenuData = false;
let isInitialMenuDataLoaded = false;
let activeFetchesCount = 0;
let dishSearchQuery = "";
let isDishSearchOpen = false;

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
const categoryDropdownWrapper = document.getElementById("categoryDropdownWrapper");
const categorySelectDropdown = document.getElementById("categorySelectDropdown");
const categoryDropdownDisplay = document.getElementById("categoryDropdownDisplay");
const categoryDropdownMenu = document.getElementById("categoryDropdownMenu");
const currentCategoryTitle = document.getElementById("currentCategoryTitle");
const dishCountLabel = document.getElementById("dishCountLabel");
const dishCountText = document.getElementById("dishCountText");
const dishSearchToggleBtn = document.getElementById("dishSearchToggleBtn");
const dishSearchBarContainer = document.getElementById("dishSearchBarContainer");
const dishSearchInput = document.getElementById("dishSearchInput");
const dishSearchClearBtn = document.getElementById("dishSearchClearBtn");
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

// Today's Special Info Modal Elements
const todaySpecialInfoModal = document.getElementById("todaySpecialInfoModal");
const todaySpecialInfoOkBtn = document.getElementById("todaySpecialInfoOkBtn");

function openTodaySpecialInfoModal() {
  const modal = document.getElementById("todaySpecialInfoModal") || todaySpecialInfoModal;
  if (modal) openModal(modal);
}

function closeTodaySpecialInfoModal(callback) {
  const modal = document.getElementById("todaySpecialInfoModal") || todaySpecialInfoModal;
  closeModal(modal, callback);
}

if (todaySpecialInfoOkBtn) {
  todaySpecialInfoOkBtn.addEventListener("click", closeTodaySpecialInfoModal);
}

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

  document.body.classList.add("dashboard-initial-loading");
  const centralLoader = document.getElementById("dashboardCentralLoader");
  const bodyContent = document.getElementById("dashboardBodyContent");
  const stickyActionBar = document.getElementById("stickyDashboardActionBar") || document.getElementById("stickyAddDishBar");
  if (centralLoader) centralLoader.style.display = "flex";
  if (bodyContent) bodyContent.style.display = "none";
  if (stickyActionBar) stickyActionBar.style.setProperty("display", "none", "important");

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
      otherCats.sort((a, b) => {
        const orderDiff = (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
        if (orderDiff !== 0) return orderDiff;
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        if (aTime !== bTime) return bTime - aTime;
        return String(b._id || "").localeCompare(String(a._id || ""));
      });

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
    isInitialMenuDataLoaded = true;
    document.body.classList.remove("dashboard-initial-loading");
    trackFetchEnd();
    hidePortalLoading();

    const centralLoader = document.getElementById("dashboardCentralLoader");
    const bodyContent = document.getElementById("dashboardBodyContent");
    if (centralLoader) centralLoader.style.display = "none";
    if (bodyContent) bodyContent.style.display = "block";

    // Populate BOTH Category view and Menu view with fresh data
    renderCategoriesList();
    renderCategoryTabs();
    populateCategoryDropdown();
    renderDishesGrid();

    const activeView = currentDashboardView || sessionStorage.getItem("owner_active_view") || "category";
    switchDashboardView(activeView, true);
  }
}

/**
 * Switcher Capsule Logic (CATEGORY - MENU)
 */
let currentDashboardView = null;

function switchDashboardView(view, force = false) {
  if (!force && currentDashboardView === view) return;
  currentDashboardView = view;
  try {
    sessionStorage.setItem("owner_active_view", view);
  } catch(e) {}

  if (!capsuleCategoryBtn || !capsuleMenuBtn) return;

  const capsuleSwitcher = document.querySelector(".capsule-switcher");
  if (capsuleSwitcher) {
    capsuleSwitcher.setAttribute("data-active", view);
  }

  if (view === "category") {
    capsuleCategoryBtn.classList.add("active");
    capsuleCategoryBtn.setAttribute("aria-selected", "true");
    capsuleCategoryBtn.setAttribute("disabled", "true");
    capsuleCategoryBtn.style.pointerEvents = "none";
    capsuleCategoryBtn.style.cursor = "default";

    capsuleMenuBtn.classList.remove("active");
    capsuleMenuBtn.setAttribute("aria-selected", "false");
    capsuleMenuBtn.removeAttribute("disabled");
    capsuleMenuBtn.style.pointerEvents = "auto";
    capsuleMenuBtn.style.cursor = "pointer";
  } else {
    capsuleMenuBtn.classList.add("active");
    capsuleMenuBtn.setAttribute("aria-selected", "true");
    capsuleMenuBtn.setAttribute("disabled", "true");
    capsuleMenuBtn.style.pointerEvents = "none";
    capsuleMenuBtn.style.cursor = "default";

    capsuleCategoryBtn.classList.remove("active");
    capsuleCategoryBtn.setAttribute("aria-selected", "false");
    capsuleCategoryBtn.removeAttribute("disabled");
    capsuleCategoryBtn.style.pointerEvents = "auto";
    capsuleCategoryBtn.style.cursor = "pointer";
  }

  // If still in initial loading state or fetching data, do not reveal content yet (loader replaces everything below switcher)
  if (!isInitialMenuDataLoaded || isFetchingMenuData) {
    const stickyActionBar = document.getElementById("stickyDashboardActionBar") || document.getElementById("stickyAddDishBar");
    if (stickyActionBar) stickyActionBar.style.setProperty("display", "none", "important");
    return;
  }

  if (!categoryViewGroup || !menuViewGroup) return;

  const stickyActionBar = document.getElementById("stickyDashboardActionBar") || document.getElementById("stickyAddDishBar");
  if (stickyActionBar) {
    stickyActionBar.style.display = "flex";
  }
  const addCategoryBtn = document.getElementById("openAddCategoryHeaderBtn");
  const addDishBtn = document.getElementById("openAddDishBtn");
  if (addCategoryBtn) addCategoryBtn.style.display = (view === "category") ? "inline-flex" : "none";
  if (addDishBtn) addDishBtn.style.display = (view === "menu") ? "inline-flex" : "none";
  if (typeof updateAddDishBtnState === "function") updateAddDishBtnState();

  if (view === "category") {
    menuViewGroup.style.display = "none";
    menuViewGroup.classList.remove("view-content-smooth");

    categoryViewGroup.style.display = "flex";
    categoryViewGroup.classList.remove("view-content-smooth");
    void categoryViewGroup.offsetWidth;
    categoryViewGroup.classList.add("view-content-smooth");

    if (categoriesCountLabel) categoriesCountLabel.style.display = "flex";
    if (dishCountLabel) dishCountLabel.style.display = "none";
    closeDishSearchBar(true);

    if (isFetchingMenuData) {
      const catLoader = document.getElementById("categoryCenterLoader");
      if (catLoader) catLoader.style.display = "flex";
      if (emptyCategoriesState) emptyCategoriesState.style.display = "none";
    }

    renderCategoriesList();
  } else {
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
  switchDashboardView(savedView, true);

  if (capsuleCategoryBtn) {
    capsuleCategoryBtn.addEventListener("click", () => {
      if (currentDashboardView === "category") return;
      switchDashboardView("category");
      if (!isInitialMenuDataLoaded) {
        loadMenuData();
      }
    });
  }
  if (capsuleMenuBtn) {
    capsuleMenuBtn.addEventListener("click", () => {
      if (currentDashboardView === "menu") return;
      switchDashboardView("menu");
      if (!isInitialMenuDataLoaded) {
        loadMenuData();
      }
    });
  }

  initStickyBarScroll();
}

/**
 * Handle smooth shadow appearance behind switcher bar on scroll
 */
function initStickyBarScroll() {
  const stickyBars = document.querySelectorAll(".owner-sticky-bar");
  if (!stickyBars.length) return;

  const handleStickyBarScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    const shouldBeScrolled = scrollY > 10;
    stickyBars.forEach(bar => {
      bar.classList.toggle("scrolled", shouldBeScrolled);
    });
  };

  if (!window._stickyBarScrollAttached) {
    window._stickyBarScrollAttached = true;
    window.addEventListener("scroll", handleStickyBarScroll, { passive: true });
  }
  handleStickyBarScroll();
}

/**
 * Check if a dish is marked as Today's Special
 */
function isDishSpecial(dish) {
  if (!dish) return false;
  if (dish.isSpecial === true || dish.isFeatured === true) return true;
  const specialCat = categories.find(c => c.isFixed || (c.name && c.name.toUpperCase() === "TODAY'S SPECIAL"));
  if (specialCat && String(dish.categoryId) === String(specialCat._id)) return true;
  return false;
}

/**
 * Update category badges and dropdown counts across dashboard
 */
function updateCategoryCountsAndBadges() {
  populateCategoryDropdown();
  renderCategoriesList();
}

/**
 * Optimistically refresh all UI elements across both Category and Menu tabs immediately
 */
function refreshMenuUI() {
  renderCategoriesList();
  renderCategoryTabs();
  populateCategoryDropdown();
  renderDishesGrid();
}

// Track in-flight category creations to prevent race conditions during instant deletion
const inFlightCategoryCreations = new Map(); // tempCatId -> { cancelled: false, realId: null }

/**
 * Render categories list in CATEGORY view
 */
function renderCategoriesList() {
  if (!categoriesGrid) return;
  categoriesGrid.innerHTML = "";
  if (isFetchingMenuData) return;

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
    const dishCount = isFixed
      ? dishes.filter(d => isDishSpecial(d)).length
      : dishes.filter(d => String(d.categoryId) === String(cat._id)).length;
    const isJustCreated = !isFixed && newlyCreatedCategoryId && String(cat._id) === newlyCreatedCategoryId;
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
          <div class="category-card-name is-fixed" title="Today's Special" aria-label="Category name ${escapeHtml((cat.name || "").toUpperCase())}">
            <svg class="cat-star-icon" viewBox="0 0 24 24" width="16" height="16" fill="#f59e0b" stroke="#d97706" stroke-width="0.8" aria-hidden="true">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            ${escapeHtml((cat.name || "").toUpperCase())}
          </div>
        ` : `
          <div class="category-card-name" title="Click to edit name" tabindex="0" role="button" aria-label="Edit category name ${escapeHtml((cat.name || "").toUpperCase())}">${escapeHtml((cat.name || "").toUpperCase())}</div>
        `}
      </div>
      <div class="category-row-actions">
        <span class="category-dish-count-badge ${isJustCreated ? "badge-appear-smooth" : ""}">${dishCount} item${dishCount === 1 ? "" : "s"}</span>
        ${isFixed ? `
          <button type="button" class="today-special-info-btn" id="todaySpecialInfoBtn" title="About Today's Special" aria-label="About Today's Special">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </button>
        ` : `
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

    if (isFixed) {
      const infoBtn = card.querySelector(".today-special-info-btn");
      if (infoBtn) {
        infoBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          openTodaySpecialInfoModal();
        });
      }
    } else {
      // Inline edit category name on click (only for non-fixed)
      const nameEl = card.querySelector(".category-card-name");
      if (nameEl) attachInlineCategoryEditor(nameEl, cat);

      // Delete button - dynamically resolve ID in case category was just created
      const delBtn = card.querySelector(".delete-cat-btn");
      if (delBtn) {
        delBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          e.preventDefault();
          const targetId = card.dataset.id || delBtn.dataset.id || cat._id;
          confirmDeleteCategoryById(targetId);
        });
      }

      // Long press and drag to reorder
      attachCategoryDragListeners(card);

      if (isJustCreated) {
        setTimeout(() => {
          const b = card.querySelector(".badge-appear-smooth");
          if (b) {
            b.classList.remove("badge-appear-smooth");
            b.style.animation = "none";
          }
        }, 400);
      }
    }

    categoriesGrid.appendChild(card);
  });

  newlyCreatedCategoryId = null;
}

let suppressNextClick = false;
let activeDragSession = null;

// Global click suppressor to prevent synthesized clicks after dragging on mobile
window.addEventListener("click", (e) => {
  if (suppressNextClick) {
    e.preventDefault();
    e.stopImmediatePropagation();
  }
}, true);

/**
 * Enable Touch & Hold Drag-and-Drop Reordering on Category Row
 */
function attachCategoryDragListeners(card) {
  if (card.classList.contains("today-special-card") || card.classList.contains("is-new-blank-row")) {
    return;
  }

  let pressTimer = null;
  let pressFeedbackTimer = null;
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;
  let activeTouchId = null;
  let isPressing = false;

  function cancelPress() {
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
    if (pressFeedbackTimer) {
      clearTimeout(pressFeedbackTimer);
      pressFeedbackTimer = null;
    }
    card.classList.remove("is-drag-pressing");
    isPressing = false;
    activeTouchId = null;
    removeCheckListeners();
  }

  function removeCheckListeners() {
    window.removeEventListener("touchmove", onTouchMoveCheck);
    window.removeEventListener("touchend", onTouchEndCheck);
    window.removeEventListener("touchcancel", onTouchEndCheck);
    window.removeEventListener("mousemove", onMouseMoveCheck);
    window.removeEventListener("mouseup", onMouseUpCheck);
  }

  // --- TOUCH HANDLERS (Mobile Phone & Tablet) ---
  function onTouchStart(e) {
    if (activeDragSession) return;
    if (e.target.closest(".switch, .category-avail-checkbox, .delete-cat-btn, [contenteditable='true'], [contenteditable='plaintext-only'], .is-editing, input, button")) {
      return;
    }
    if (!e.touches || e.touches.length !== 1) return;

    // Disarm any appearance animations on badges immediately upon touch
    const badge = card.querySelector(".category-dish-count-badge");
    if (badge) {
      badge.classList.remove("badge-appear-smooth");
      badge.style.animation = "none";
    }

    const touch = e.touches[0];
    activeTouchId = touch.identifier;
    startX = currentX = touch.clientX;
    startY = currentY = touch.clientY;
    isPressing = true;

    // Intentional touch & hold activation delay (450ms) to prevent accidental drags while scrolling
    pressTimer = setTimeout(() => {
      if (!isPressing) return;
      isPressing = false;
      removeCheckListeners();
      startCategoryDrag(card, "touch", activeTouchId, currentX, currentY);
    }, 450);

    window.addEventListener("touchmove", onTouchMoveCheck, { passive: true });
    window.addEventListener("touchend", onTouchEndCheck);
    window.addEventListener("touchcancel", onTouchEndCheck);
  }

  function onTouchMoveCheck(e) {
    if (!isPressing) return;
    const touch = Array.from(e.touches || []).find(t => t.identifier === activeTouchId);
    if (!touch) {
      cancelPress();
      return;
    }
    currentX = touch.clientX;
    currentY = touch.clientY;
    const dist = Math.hypot(currentX - startX, currentY - startY);
    // If finger moves more than 8px before activation, user is scrolling the list -> cancel immediately
    if (dist > 8) {
      cancelPress();
    }
  }

  function onTouchEndCheck() {
    cancelPress();
  }

  // --- MOUSE HANDLERS (Desktop) ---
  function onMouseDown(e) {
    if (activeDragSession) return;
    if (e.button !== 0) return;
    if (e.target.closest(".switch, .category-avail-checkbox, .delete-cat-btn, [contenteditable='true'], [contenteditable='plaintext-only'], .is-editing, input, button")) {
      return;
    }

    // Disarm any appearance animations on badges immediately upon click
    const badge = card.querySelector(".category-dish-count-badge");
    if (badge) {
      badge.classList.remove("badge-appear-smooth");
      badge.style.animation = "none";
    }

    startX = currentX = e.clientX;
    startY = currentY = e.clientY;
    isPressing = true;

    pressTimer = setTimeout(() => {
      if (!isPressing) return;
      isPressing = false;
      removeCheckListeners();
      startCategoryDrag(card, "mouse", null, currentX, currentY);
    }, 380);

    window.addEventListener("mousemove", onMouseMoveCheck);
    window.addEventListener("mouseup", onMouseUpCheck);
  }

  function onMouseMoveCheck(e) {
    if (!isPressing) return;
    currentX = e.clientX;
    currentY = e.clientY;
    const dist = Math.hypot(currentX - startX, currentY - startY);
    if (dist > 8) {
      cancelPress();
    }
  }

  function onMouseUpCheck() {
    cancelPress();
  }

  card.addEventListener("touchstart", onTouchStart, { passive: true });
  card.addEventListener("mousedown", onMouseDown);
}

function startCategoryDrag(card, inputType, touchId, startX, startY) {
  if (activeDragSession || !categoriesGrid) return;

  // Haptic feedback
  if (navigator.vibrate) {
    try { navigator.vibrate(40); } catch (_) {}
  }

  suppressNextClick = true;

  // Use unscaled dimensions to prevent double-scaling and jumping
  const unscaledWidth = card.offsetWidth;
  const unscaledHeight = card.offsetHeight;
  const rect = card.getBoundingClientRect();
  const centerX = rect.left + (rect.width / 2);
  const centerY = rect.top + (rect.height / 2);
  const unscaledLeft = centerX - (unscaledWidth / 2);
  const unscaledTop = centerY - (unscaledHeight / 2);

  const grabOffsetY = startY - unscaledTop;
  const grabOffsetX = startX - unscaledLeft;

  // Disarm any appearance animations on badges inside the card
  const badge = card.querySelector(".category-dish-count-badge");
  if (badge) {
    badge.classList.remove("badge-appear-smooth");
    badge.style.animation = "none";
  }

  // Create placeholder to reserve exact slot in grid with unscaled size
  const placeholder = document.createElement("div");
  placeholder.className = "category-drag-placeholder";
  placeholder.style.width = unscaledWidth + "px";
  placeholder.style.height = unscaledHeight + "px";
  placeholder.style.margin = "0";

  categoriesGrid.insertBefore(placeholder, card);

  // Append to document.body so position: fixed is 100% relative to viewport coordinates
  document.body.appendChild(card);

  card.classList.remove("is-drag-pressing");
  card.classList.add("is-drag-lifted");
  card.style.position = "fixed";
  card.style.top = unscaledTop + "px";
  card.style.left = unscaledLeft + "px";
  card.style.width = unscaledWidth + "px";
  card.style.height = unscaledHeight + "px";
  card.style.margin = "0";
  card.style.zIndex = "999999";
  card.style.boxShadow = "";
  card.style.transform = "";

  let lastClientY = startY;
  let autoScrollRaf = null;

  function doAutoScroll() {
    const edgeThreshold = 65;
    const maxScrollStep = 10;
    let scrollStep = 0;

    if (lastClientY < edgeThreshold) {
      scrollStep = -Math.round((edgeThreshold - lastClientY) / 4);
    } else if (lastClientY > window.innerHeight - edgeThreshold) {
      scrollStep = Math.round((lastClientY - (window.innerHeight - edgeThreshold)) / 4);
    }

    if (scrollStep !== 0) {
      window.scrollBy(0, Math.max(-maxScrollStep, Math.min(maxScrollStep, scrollStep)));
      updateSlotAndPositions(lastClientY);
      autoScrollRaf = requestAnimationFrame(doAutoScroll);
    } else {
      autoScrollRaf = null;
    }
  }

  function updateSlotAndPositions(clientY) {
    // Keep row directly stuck to the touch point
    const currentTop = clientY - grabOffsetY;
    card.style.top = currentTop + "px";
    card.style.transform = "scale(1.035)";

    const currentCardCenterY = currentTop + (unscaledHeight / 2);

    const otherCards = Array.from(
      categoriesGrid.querySelectorAll(".category-admin-card:not(.today-special-card):not(.is-new-blank-row)")
    ).filter(c => c !== card);

    let targetBefore = null;
    for (const c of otherCards) {
      if (c === placeholder) continue;
      const cRect = c.getBoundingClientRect();
      const cMidY = cRect.top + (cRect.height / 2);
      if (currentCardCenterY < cMidY) {
        targetBefore = c;
        break;
      }
    }

    // Never place above Today's Special
    const todaySpecialCard = categoriesGrid.querySelector(".today-special-card");
    if (todaySpecialCard && targetBefore === todaySpecialCard) {
      targetBefore = todaySpecialCard.nextSibling === placeholder ? placeholder.nextSibling : todaySpecialCard.nextSibling;
    }

    if (placeholder.nextSibling !== targetBefore && placeholder !== targetBefore) {
      const allSiblings = Array.from(categoriesGrid.children).filter(el => el !== placeholder && el !== card);
      const firstTops = new Map();
      allSiblings.forEach(el => firstTops.set(el, el.getBoundingClientRect().top));

      if (targetBefore) {
        categoriesGrid.insertBefore(placeholder, targetBefore);
      } else {
        categoriesGrid.appendChild(placeholder);
      }

      allSiblings.forEach(el => {
        const first = firstTops.get(el);
        const last = el.getBoundingClientRect().top;
        const delta = first - last;
        if (delta !== 0) {
          el.style.transform = `translateY(${delta}px)`;
          el.style.transition = "none";
        }
      });

      void categoriesGrid.offsetHeight;
      requestAnimationFrame(() => {
        allSiblings.forEach(el => {
          el.style.transition = "transform 240ms cubic-bezier(0.2, 0, 0, 1)";
          el.style.transform = "";
        });
      });
    }
  }

  function onTouchMove(e) {
    const touch = Array.from(e.touches || []).find(t => t.identifier === touchId);
    if (!touch) return;
    if (e.cancelable) e.preventDefault();
    lastClientY = touch.clientY;
    updateSlotAndPositions(lastClientY);

    if (!autoScrollRaf) {
      autoScrollRaf = requestAnimationFrame(doAutoScroll);
    }
  }

  function onMouseMove(e) {
    e.preventDefault();
    lastClientY = e.clientY;
    updateSlotAndPositions(lastClientY);

    if (!autoScrollRaf) {
      autoScrollRaf = requestAnimationFrame(doAutoScroll);
    }
  }

  function onDragEnd() {
    if (autoScrollRaf) {
      cancelAnimationFrame(autoScrollRaf);
      autoScrollRaf = null;
    }

    window.removeEventListener("touchmove", onTouchMove, { passive: false });
    window.removeEventListener("touchend", onDragEnd);
    window.removeEventListener("touchcancel", onDragEnd);
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onDragEnd);

    const pRect = placeholder.getBoundingClientRect();

    // Smooth landing transition with dissolving shadow and scaling down
    card.classList.remove("is-drag-lifted");
    card.classList.add("is-landing");
    card.style.boxShadow = "";
    card.style.transform = "";
    card.style.transition = "top 240ms cubic-bezier(0.2, 0, 0, 1), left 240ms cubic-bezier(0.2, 0, 0, 1)";
    card.style.top = pRect.top + "px";
    card.style.left = pRect.left + "px";

    setTimeout(() => {
      categoriesGrid.insertBefore(card, placeholder);
      placeholder.remove();

      card.classList.remove("is-landing");
      const endBadge = card.querySelector(".category-dish-count-badge");
      if (endBadge) {
        endBadge.classList.remove("badge-appear-smooth");
        endBadge.style.animation = "none";
      }
      card.style.position = "";
      card.style.top = "";
      card.style.left = "";
      card.style.width = "";
      card.style.height = "";
      card.style.margin = "";
      card.style.transform = "";
      card.style.transition = "";
      card.style.zIndex = "";
      card.style.boxShadow = "";

      Array.from(categoriesGrid.children).forEach(el => {
        el.style.transform = "";
        el.style.transition = "";
      });

      activeDragSession = null;

      setTimeout(() => {
        suppressNextClick = false;
      }, 120);

      const newOrderedIds = Array.from(
        categoriesGrid.querySelectorAll(".category-admin-card:not(.today-special-card):not(.is-new-blank-row)")
      ).map(el => el.dataset.id).filter(Boolean);

      const specialCat = categories.find(c => c.isFixed || (c.name && c.name.toUpperCase() === "TODAY'S SPECIAL"));
      const otherCatsOrdered = newOrderedIds.map(id => categories.find(c => String(c._id) === String(id))).filter(Boolean);

      otherCatsOrdered.forEach((c, idx) => {
        c.displayOrder = idx;
      });

      categories = specialCat ? [specialCat, ...otherCatsOrdered] : otherCatsOrdered;

      renderCategoryTabs();
      populateCategoryDropdown();

      fetch("/api/owner/categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: newOrderedIds })
      })
      .then(res => res.json())
      .then(data => {
        if (!data.success) {
          showNotification(data.error || "Failed to save category order", "error");
        }
      })
      .catch(err => {
        showNotification("Network error saving category order", "error");
      });
    }, 190);
  }

  if (inputType === "touch") {
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onDragEnd);
    window.addEventListener("touchcancel", onDragEnd);
  } else {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onDragEnd);
  }

  activeDragSession = { card, placeholder };
}

/**
 * Enable click-to-edit for Category Name
 */
function attachInlineCategoryEditor(nameEl, cat) {
  nameEl.setAttribute("data-placeholder", "Category name...");

  function startEdit() {
    if (nameEl.getAttribute("contenteditable") === "true" || nameEl.classList.contains("is-editing")) return;

    nameEl.setAttribute("contenteditable", "plaintext-only");
    if (nameEl.contentEditable !== "plaintext-only") {
      nameEl.contentEditable = "true";
    }

    nameEl.setAttribute("enterkeyhint", "done");
    nameEl.setAttribute("autocomplete", "off");
    nameEl.setAttribute("autocorrect", "off");
    nameEl.setAttribute("spellcheck", "false");
    nameEl.classList.add("is-editing");
    const card = nameEl.closest(".category-admin-card");
    if (card) card.classList.add("is-editing-name");
    nameEl.focus();

    const sel = window.getSelection();
    if (sel) {
      const range = document.createRange();
      range.selectNodeContents(nameEl);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }

    let finished = false;
    async function commit(save) {
      if (finished) return;
      finished = true;
      nameEl.removeAttribute("contenteditable");
      nameEl.classList.remove("is-editing");
      const parentCard = nameEl.closest(".category-admin-card");
      if (parentCard) parentCard.classList.remove("is-editing-name");
      if (typeof nameEl.blur === "function") nameEl.blur();

      const originalName = (cat.name || "").toUpperCase();
      const newName = (nameEl.textContent || "").trim().toUpperCase();

      if (save && newName && newName !== originalName) {
        nameEl.textContent = newName;
        cat.name = newName;
        refreshMenuUI();

        fetch("/api/owner/categories", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: cat._id, name: newName })
        })
        .then(res => res.json())
        .then(data => {
          if (!data.success) {
            showNotification(data.error || "Failed to update category name", "error");
            cat.name = originalName;
            nameEl.textContent = originalName;
            refreshMenuUI();
          }
        })
        .catch(err => {
          showNotification("Network error updating category name", "error");
          cat.name = originalName;
          nameEl.textContent = originalName;
          refreshMenuUI();
        });
      } else {
        nameEl.textContent = originalName;
      }
    }

    function onKeyDown(e) {
      if (e.key === "Enter" || e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        cleanup();
        commit(true);
      } else if (e.key === "Escape" || e.keyCode === 27) {
        e.preventDefault();
        cleanup();
        commit(false);
      }
    }

    function onKeyUp(e) {
      if (e.key === "Enter" || e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        cleanup();
        commit(true);
      }
    }

    function onBlur() {
      cleanup();
      commit(true);
    }

    function onPaste(e) {
      e.preventDefault();
      const text = ((e.clipboardData || window.clipboardData)?.getData("text/plain") || "").replace(/[\r\n]+/g, " ").toUpperCase();
      document.execCommand("insertText", false, text);
    }

    function cleanup() {
      nameEl.removeEventListener("keydown", onKeyDown);
      nameEl.removeEventListener("keyup", onKeyUp);
      nameEl.removeEventListener("blur", onBlur);
      nameEl.removeEventListener("paste", onPaste);
    }

    nameEl.addEventListener("keydown", onKeyDown);
    nameEl.addEventListener("keyup", onKeyUp);
    nameEl.addEventListener("blur", onBlur);
    nameEl.addEventListener("paste", onPaste);
  }

  nameEl.addEventListener("click", (e) => {
    if (suppressNextClick) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    startEdit();
  });
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
  categoryNameInput.value = (cat.name || "").toUpperCase();
  openModal(categoryModal);
  categoryNameInput.focus();
}

async function confirmDeleteCategoryById(catId) {
  let targetCatId = String(catId);
  const tracker = inFlightCategoryCreations.get(targetCatId);
  if (tracker && tracker.realId) {
    targetCatId = String(tracker.realId);
  }

  let cat = categories.find(c => String(c._id) === targetCatId);
  if (!cat) {
    const card = document.querySelector(`.category-admin-card[data-id="${catId}"]`);
    if (card && card.dataset.id && card.dataset.id !== catId) {
      targetCatId = String(card.dataset.id);
      cat = categories.find(c => String(c._id) === targetCatId);
    }
  }
  if (!cat) {
    for (const [tempId, trk] of inFlightCategoryCreations.entries()) {
      if (tempId === targetCatId || (trk.realId && String(trk.realId) === targetCatId)) {
        if (trk.realId) {
          targetCatId = String(trk.realId);
          cat = categories.find(c => String(c._id) === targetCatId);
        } else {
          cat = categories.find(c => String(c._id) === tempId);
        }
        if (cat) break;
      }
    }
  }
  if (!cat) return;

  if (cat.isFixed || (cat.name && cat.name.toUpperCase() === "TODAY'S SPECIAL")) {
    showNotification("'Today's Special' is a fixed category and cannot be deleted.", "error");
    return;
  }

  const dishCount = dishes.filter(d => String(d.categoryId) === targetCatId || String(d.categoryId) === String(catId)).length;
  const confirmMsg = `Are you sure you want to delete category "${cat.name}"?` +
    (dishCount > 0 ? ` WARNING: This will also delete ${dishCount} associated dish(es)!` : "");

  pendingCategoryDeletion = { targetCatId, catId, cat, tracker };

  if (deleteCategoryModalMsg) {
    deleteCategoryModalMsg.textContent = confirmMsg;
  }

  if (deleteCategoryModal) {
    openModal(deleteCategoryModal);
    if (confirmDeleteCategoryBtn) confirmDeleteCategoryBtn.focus();
  } else {
    if (confirm(confirmMsg)) {
      executeCategoryDeletion(targetCatId, catId, cat, tracker);
    }
  }
}

function executeCategoryDeletion(targetCatId, catId, cat, tracker) {
  // Mark in-flight creation as cancelled if pending
  if (tracker) {
    tracker.cancelled = true;
  }
  for (const [tId, trk] of inFlightCategoryCreations.entries()) {
    if (tId === targetCatId || (trk.realId && String(trk.realId) === targetCatId) || tId === String(catId)) {
      trk.cancelled = true;
    }
  }

  const prevCategories = [...categories];
  const prevDishes = [...dishes];
  const prevSelectedCatId = selectedCategoryId;

  // Optimistic data update
  categories = categories.filter(c => String(c._id) !== targetCatId && String(c._id) !== String(catId));
  dishes = dishes.filter(d => String(d.categoryId) !== targetCatId && String(d.categoryId) !== String(catId));
  if (selectedCategoryId === targetCatId || selectedCategoryId === String(catId)) {
    selectedCategoryId = null;
  }

  // Smooth deletion animation if card is in the category grid
  const card = (categoriesGrid && (
    categoriesGrid.querySelector(`.category-admin-card[data-id="${targetCatId}"]`) ||
    categoriesGrid.querySelector(`.category-admin-card[data-id="${catId}"]`)
  )) || null;

  if (card && card.parentNode === categoriesGrid) {
    const allCards = Array.from(categoriesGrid.querySelectorAll(".category-admin-card"));
    const cardIndex = allCards.indexOf(card);
    const cardsBelow = cardIndex !== -1 ? allCards.slice(cardIndex + 1) : [];

    const preTops = new Map();
    cardsBelow.forEach(c => preTops.set(c, c.getBoundingClientRect().top));

    // Smooth exit animation on deleting card
    card.style.pointerEvents = "none";
    card.style.transition = "opacity 200ms cubic-bezier(0.4, 0, 0.2, 1), transform 220ms cubic-bezier(0.4, 0, 0.2, 1)";
    card.style.opacity = "0";
    card.style.transform = "translateY(-8px) scale(0.97)";

    setTimeout(() => {
      if (card.parentNode) card.remove();

      // Invert: shift cardsBelow back to their pre-removal visual positions
      cardsBelow.forEach(c => {
        if (!c.parentNode) return;
        const oldTop = preTops.get(c);
        const newTop = c.getBoundingClientRect().top;
        const dy = oldTop - newTop;
        if (dy !== 0) {
          c.style.transform = `translateY(${dy}px)`;
          c.style.transition = "none";
        }
      });

      void categoriesGrid.offsetHeight; // Flush layout

      // Play: animate cardsBelow smoothly up into place
      requestAnimationFrame(() => {
        cardsBelow.forEach(c => {
          if (!c.parentNode) return;
          c.style.transition = "transform 280ms cubic-bezier(0.16, 1, 0.3, 1)";
          c.style.transform = "translateY(0)";
        });

        setTimeout(() => {
          cardsBelow.forEach(c => {
            c.style.transition = "";
            c.style.transform = "";
          });
        }, 300);
      });

      renderCategoryTabs();
      populateCategoryDropdown();
      renderDishesGrid();
    }, 200);
  } else {
    refreshMenuUI();
  }

  showNotification(`Category "${cat.name}" deleted.`);

  // If this category is still being created in-flight and doesn't have a realId yet,
  // the creation fetch will automatically delete it upon completion when tracker.cancelled is true.
  if (targetCatId.startsWith("temp_cat_")) {
    return;
  }

  // Background delete
  fetch(`/api/owner/categories?id=${targetCatId}`, {
    method: "DELETE"
  })
  .then(res => res.json())
  .then(data => {
    if (!data.success) {
      categories = prevCategories;
      dishes = prevDishes;
      selectedCategoryId = prevSelectedCatId;
      refreshMenuUI();
      showNotification(data.error || "Failed to delete category.", "error");
    }
  })
  .catch(err => {
    categories = prevCategories;
    dishes = prevDishes;
    selectedCategoryId = prevSelectedCatId;
    refreshMenuUI();
    showNotification("Network error deleting category.", "error");
  });
}

/**
 * Update the visual display inside the category dropdown without count
 */
function updateCategoryDropdownDisplay() {
  if (!categoryDropdownDisplay) return;
  let displayName = "All Menu Items";
  if (selectedCategoryId) {
    const cat = categories.find(c => String(c._id) === String(selectedCategoryId));
    if (cat) {
      const isFixed = cat.isFixed || (cat.name && cat.name.toUpperCase() === "TODAY'S SPECIAL");
      displayName = `${isFixed ? "★ " : ""}${cat.name}`;
    }
  }
  categoryDropdownDisplay.textContent = displayName;

  if (categoryDropdownMenu) {
    const items = categoryDropdownMenu.querySelectorAll(".category-dropdown-item");
    items.forEach(btn => {
      const btnId = btn.dataset.catId || "";
      const isSelected = selectedCategoryId ? btnId === String(selectedCategoryId) : btnId === "";
      btn.classList.toggle("is-selected", isSelected);
    });
  }
}

/**
 * Render categories dropdown options in MENU view (opens below field, no count)
 */
function renderCategoryTabs() {
  if (!categorySelectDropdown) return;
  categorySelectDropdown.innerHTML = "";

  if (categoryDropdownMenu) {
    categoryDropdownMenu.innerHTML = "";
  }

  // "All Menu Items" option
  const allOpt = document.createElement("option");
  allOpt.value = "";
  allOpt.textContent = "All Menu Items";
  allOpt.selected = selectedCategoryId === null;
  categorySelectDropdown.appendChild(allOpt);

  if (categoryDropdownMenu) {
    const allBtn = document.createElement("button");
    allBtn.type = "button";
    allBtn.className = `category-dropdown-item${selectedCategoryId === null ? " is-selected" : ""}`;
    allBtn.textContent = "All Menu Items";
    allBtn.dataset.catId = "";
    allBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      selectCategoryFromDropdown(null);
    });
    categoryDropdownMenu.appendChild(allBtn);

    const divider = document.createElement("div");
    divider.className = "category-dropdown-divider";
    divider.setAttribute("role", "separator");
    categoryDropdownMenu.appendChild(divider);
  }

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
    const catName = `${isFixed ? "★ " : ""}${cat.name}`;
    const opt = document.createElement("option");
    opt.value = String(cat._id);
    opt.textContent = catName;
    if (selectedCategoryId === String(cat._id)) {
      opt.selected = true;
    }
    categorySelectDropdown.appendChild(opt);

    if (categoryDropdownMenu) {
      const itemBtn = document.createElement("button");
      itemBtn.type = "button";
      itemBtn.className = `category-dropdown-item${selectedCategoryId === String(cat._id) ? " is-selected" : ""}`;
      itemBtn.textContent = catName;
      itemBtn.dataset.catId = String(cat._id);
      itemBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        selectCategoryFromDropdown(String(cat._id));
      });
      categoryDropdownMenu.appendChild(itemBtn);
    }
  });

  updateCategoryDropdownDisplay();
}

/**
 * Populate Category dropdown in Add/Edit Dish Modal
 * Excludes Today's Special so starring items is the only way to add dishes to Today's Special.
 */
function populateCategoryDropdown() {
  dishCategorySelect.innerHTML = "";
  const nonFixedCategories = categories.filter(cat => !(cat.isFixed || (cat.name && cat.name.toUpperCase() === "TODAY'S SPECIAL")));

  if (nonFixedCategories.length === 0) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "-- No Categories (Create one first) --";
    dishCategorySelect.appendChild(opt);
    return;
  }
  const sortedCategories = [...nonFixedCategories].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  sortedCategories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat._id;
    opt.textContent = cat.name;
    dishCategorySelect.appendChild(opt);
  });
}

/**
 * Helper to update dish count display without blowing away the search button inside dishCountLabel
 */
function updateDishCountDisplay(countOrText) {
  let countEl = document.getElementById("dishCountText");
  const fullText = typeof countOrText === "number"
    ? `${countOrText} Item${countOrText === 1 ? "" : "s"}`
    : countOrText;

  const dishCountLabel = document.getElementById("dishCountLabel");
  if (!countEl && dishCountLabel) {
    dishCountLabel.className = "categories-center-count dish-count-row";
    dishCountLabel.innerHTML = `
      <span class="dish-count-spacer" aria-hidden="true"></span>
      <span id="dishCountText">${fullText}</span>
      <button type="button" id="dishSearchToggleBtn" class="dish-search-toggle-btn" aria-label="Search dishes" title="Search dishes">
        <svg class="search-btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
    `;
    const newToggle = document.getElementById("dishSearchToggleBtn");
    if (newToggle) {
      newToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleDishSearchBar();
      });
    }
    return;
  }

  if (countEl) {
    countEl.textContent = fullText;
  }
}

/**
 * Check if the currently selected category is Today's Special
 */
function isTodaySpecialCategorySelected() {
  if (!selectedCategoryId) return false;
  if (selectedCategoryId === "today-special") return true;
  const activeCat = categories.find(c => String(c._id) === String(selectedCategoryId));
  return !!(activeCat && (activeCat.isFixed || (activeCat.name && activeCat.name.toUpperCase() === "TODAY'S SPECIAL")));
}

/**
 * Update Add Dish button disabled state based on active category.
 * Disables 'Add Item' when 'Today's Special' is selected because starring dishes
 * from other categories is the only way to add items to Today's Special.
 */
function updateAddDishBtnState() {
  const addDishBtn = document.getElementById("openAddDishBtn");
  if (!addDishBtn) return;
  const isTodaySpecial = isTodaySpecialCategorySelected();
  if (isTodaySpecial) {
    addDishBtn.disabled = true;
    addDishBtn.setAttribute("disabled", "true");
    addDishBtn.setAttribute("aria-disabled", "true");
    addDishBtn.title = "Today's Special items are managed using the star toggle on dishes in other categories.";
  } else {
    addDishBtn.disabled = false;
    addDishBtn.removeAttribute("disabled");
    addDishBtn.removeAttribute("aria-disabled");
    addDishBtn.title = "Add Item";
  }
}

/**
 * Render dishes grid based on active filter
 */
function renderDishesGrid() {
  updateAddDishBtnState();
  if (!dishesGrid) return;
  dishesGrid.innerHTML = "";

  let filtered = dishes;
  if (selectedCategoryId) {
    const activeCat = categories.find(c => String(c._id) === selectedCategoryId);
    const isSpecialCat = activeCat && (activeCat.isFixed || (activeCat.name && activeCat.name.toUpperCase() === "TODAY'S SPECIAL"));
    if (currentCategoryTitle) currentCategoryTitle.textContent = activeCat ? activeCat.name : "Category Dishes";
    if (isSpecialCat) {
      filtered = dishes.filter(d => isDishSpecial(d));
    } else {
      filtered = dishes.filter(d => String(d.categoryId) === selectedCategoryId);
    }
    filtered.sort((a, b) => {
      const orderA = a.displayOrder ?? 0;
      const orderB = b.displayOrder ?? 0;
      if (orderA !== orderB) return orderA - orderB;
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (aTime !== bTime) return bTime - aTime;
      return String(b._id || "").localeCompare(String(a._id || ""));
    });
  } else {
    if (currentCategoryTitle) currentCategoryTitle.textContent = "All Menu Items";
    filtered = [...filtered].sort((a, b) => {
      const nameA = (a.name || "").trim();
      const nameB = (b.name || "").trim();
      return nameA.localeCompare(nameB, undefined, { sensitivity: "base", numeric: true });
    });
  }

  const isDragAllowed = selectedCategoryId !== null && (!dishSearchQuery || !dishSearchQuery.trim());
  if (isDragAllowed) {
    dishesGrid.classList.add("is-reorderable");
  } else {
    dishesGrid.classList.remove("is-reorderable");
  }

  if (dishSearchQuery && dishSearchQuery.trim()) {
    const q = dishSearchQuery.trim().toLowerCase();
    filtered = filtered.filter(d => {
      const name = (d.name || "").toLowerCase();
      const desc = (d.description || "").toLowerCase();
      const price = d.price !== undefined ? String(d.price) : "";
      return name.includes(q) || desc.includes(q) || price.includes(q);
    });
  }

  const menuLoader = document.getElementById("menuCenterLoader");

  if (isFetchingMenuData) {
    if (emptyDishesState) emptyDishesState.style.display = "none";
    if (menuLoader) menuLoader.style.display = "none";
    return;
  }

  if (menuLoader) menuLoader.style.display = "none";

  updateDishCountDisplay(filtered.length);

  const emptyStateText = emptyDishesState ? emptyDishesState.querySelector(".owner-empty-state-text") : null;
  if (filtered.length === 0) {
    if (emptyDishesState) emptyDishesState.style.display = "flex";
    if (emptyStateText) {
      if (dishSearchQuery && dishSearchQuery.trim()) {
        emptyStateText.textContent = `No items found matching "${dishSearchQuery.trim()}".`;
      } else {
        emptyStateText.textContent = "No items in this category yet.";
      }
    }
    return;
  }
  if (emptyStateText) {
    emptyStateText.textContent = "No items in this category yet.";
  }
  if (emptyDishesState) emptyDishesState.style.display = "none";

  filtered.forEach(dish => {
    const card = document.createElement("div");
    card.className = `dish-admin-card ${dish.isAvailable ? "" : "unavailable"}`;
    card.dataset.id = dish._id;

    const catObj = categories.find(c => String(c._id) === String(dish.categoryId));
    const catName = catObj ? catObj.name : "";
    const isSpecial = isDishSpecial(dish);

    card.innerHTML = `
      <div class="dish-row-info">
        <label class="switch-label dish-row-switch" title="${dish.isAvailable ? 'Available (click to toggle)' : 'Sold Out (click to toggle)'}">
          <span class="switch">
            <input type="checkbox" class="dish-avail-checkbox" data-id="${dish._id}" ${dish.isAvailable ? "checked" : ""}>
            <span class="slider"></span>
          </span>
        </label>
        <button type="button" class="dish-star-btn ${isSpecial ? 'active' : ''}" data-id="${dish._id}" title="${isSpecial ? 'Remove from Today\'s Special' : 'Add to Today\'s Special'}" aria-label="Toggle Today's Special">
          <svg class="star-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </button>
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

    // Star toggle button (Today's Special)
    const starBtn = card.querySelector(".dish-star-btn");
    starBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      starBtn.blur();
      const wasSpecial = isDishSpecial(dish);
      const newSpecial = !wasSpecial;

      // Optimistic state
      dish.isSpecial = newSpecial;
      dish.isFeatured = newSpecial;
      starBtn.classList.toggle("active", newSpecial);
      starBtn.title = newSpecial ? "Remove from Today's Special" : "Add to Today's Special";

      // Update category badges & counts across dashboard
      updateCategoryCountsAndBadges();

      const activeCat = categories.find(c => String(c._id) === selectedCategoryId);
      const isViewingTodaySpecial = activeCat && (activeCat.isFixed || (activeCat.name && activeCat.name.toUpperCase() === "TODAY'S SPECIAL"));

      if (isViewingTodaySpecial && !newSpecial) {
        card.style.transition = "opacity 0.2s ease, transform 0.2s ease";
        card.style.opacity = "0";
        card.style.transform = "scale(0.95)";
        setTimeout(() => {
          renderDishesGrid();
        }, 210);
      }

      try {
        const res = await fetch("/api/owner/items", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: dish._id,
            isSpecial: newSpecial,
            isFeatured: newSpecial
          })
        });
        const data = await res.json();
        if (!data.success) {
          throw new Error(data.error || "Failed to update Today's Special");
        }
        showNotification(newSpecial ? `Added "${dish.name}" to Today's Special ⭐` : `Removed "${dish.name}" from Today's Special`, "success");
      } catch (err) {
        dish.isSpecial = wasSpecial;
        dish.isFeatured = wasSpecial;
        starBtn.classList.toggle("active", wasSpecial);
        starBtn.title = wasSpecial ? "Remove from Today's Special" : "Add to Today's Special";
        updateCategoryCountsAndBadges();
        if (isViewingTodaySpecial) renderDishesGrid();
        showNotification(err.message || "Failed to update Today's Special", "error");
      }
    });

    // Make dish name and price editable on click
    const titleEl = card.querySelector(".dish-card-title");
    attachInlineTitleEditor(titleEl, dish);

    const priceEl = card.querySelector(".dish-card-price");
    attachInlinePriceEditor(priceEl, dish);

    // Delete button
    const delDishBtn = card.querySelector(".delete-dish-btn");
    if (delDishBtn) {
      delDishBtn.addEventListener("click", () => {
        const currentTargetId = card.dataset.id || delDishBtn.dataset.id || dish._id;
        const currentDishObj = dishes.find(d => String(d._id) === String(currentTargetId)) || dish;
        confirmDeleteDish(currentDishObj);
      });
    }

    if (isDragAllowed) {
      attachDishDragListeners(card);
    }

    dishesGrid.appendChild(card);
  });
}

/**
 * Enable Touch & Hold Drag-and-Drop Reordering on Dish Row
 * (Active in specific categories, disabled in "All menu items" filter or during search)
 */
function attachDishDragListeners(card) {
  if (card.classList.contains("is-new-blank-row") || selectedCategoryId === null) {
    return;
  }

  let pressTimer = null;
  let pressFeedbackTimer = null;
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;
  let activeTouchId = null;
  let isPressing = false;

  function cancelPress() {
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
    if (pressFeedbackTimer) {
      clearTimeout(pressFeedbackTimer);
      pressFeedbackTimer = null;
    }
    card.classList.remove("is-drag-pressing");
    isPressing = false;
    activeTouchId = null;
    removeCheckListeners();
  }

  function removeCheckListeners() {
    window.removeEventListener("touchmove", onTouchMoveCheck);
    window.removeEventListener("touchend", onTouchEndCheck);
    window.removeEventListener("touchcancel", onTouchEndCheck);
    window.removeEventListener("mousemove", onMouseMoveCheck);
    window.removeEventListener("mouseup", onMouseUpCheck);
  }

  // --- TOUCH HANDLERS (Mobile Phone & Tablet) ---
  function onTouchStart(e) {
    if (activeDragSession || selectedCategoryId === null) return;
    if (e.target.closest(".switch, .dish-row-switch, .dish-avail-checkbox, .delete-dish-btn, .dish-star-btn, [contenteditable='true'], [contenteditable='plaintext-only'], .is-editing, input, button")) {
      return;
    }
    if (!e.touches || e.touches.length !== 1) return;

    const touch = e.touches[0];
    activeTouchId = touch.identifier;
    startX = currentX = touch.clientX;
    startY = currentY = touch.clientY;
    isPressing = true;

    // Intentional touch & hold activation delay (450ms) to prevent accidental drags while scrolling
    pressTimer = setTimeout(() => {
      if (!isPressing) return;
      isPressing = false;
      removeCheckListeners();
      startDishDrag(card, "touch", activeTouchId, currentX, currentY);
    }, 450);

    window.addEventListener("touchmove", onTouchMoveCheck, { passive: true });
    window.addEventListener("touchend", onTouchEndCheck);
    window.addEventListener("touchcancel", onTouchEndCheck);
  }

  function onTouchMoveCheck(e) {
    if (!isPressing) return;
    const touch = Array.from(e.touches || []).find(t => t.identifier === activeTouchId);
    if (!touch) {
      cancelPress();
      return;
    }
    currentX = touch.clientX;
    currentY = touch.clientY;
    const dist = Math.hypot(currentX - startX, currentY - startY);
    // If finger moves more than 8px before activation, user is scrolling the list -> cancel immediately
    if (dist > 8) {
      cancelPress();
    }
  }

  function onTouchEndCheck() {
    cancelPress();
  }

  // --- MOUSE HANDLERS (Desktop) ---
  function onMouseDown(e) {
    if (activeDragSession || selectedCategoryId === null) return;
    if (e.button !== 0) return;
    if (e.target.closest(".switch, .dish-row-switch, .dish-avail-checkbox, .delete-dish-btn, .dish-star-btn, [contenteditable='true'], [contenteditable='plaintext-only'], .is-editing, input, button")) {
      return;
    }

    startX = currentX = e.clientX;
    startY = currentY = e.clientY;
    isPressing = true;

    pressTimer = setTimeout(() => {
      if (!isPressing) return;
      isPressing = false;
      removeCheckListeners();
      startDishDrag(card, "mouse", null, currentX, currentY);
    }, 380);

    window.addEventListener("mousemove", onMouseMoveCheck);
    window.addEventListener("mouseup", onMouseUpCheck);
  }

  function onMouseMoveCheck(e) {
    if (!isPressing) return;
    currentX = e.clientX;
    currentY = e.clientY;
    const dist = Math.hypot(currentX - startX, currentY - startY);
    if (dist > 8) {
      cancelPress();
    }
  }

  function onMouseUpCheck() {
    cancelPress();
  }

  card.addEventListener("touchstart", onTouchStart, { passive: true });
  card.addEventListener("mousedown", onMouseDown);
}

function startDishDrag(card, inputType, touchId, startX, startY) {
  if (activeDragSession || !dishesGrid || selectedCategoryId === null) return;

  // Haptic feedback
  if (navigator.vibrate) {
    try { navigator.vibrate(40); } catch (_) {}
  }

  suppressNextClick = true;

  // Use unscaled dimensions to prevent double-scaling and jumping
  const unscaledWidth = card.offsetWidth;
  const unscaledHeight = card.offsetHeight;
  const rect = card.getBoundingClientRect();
  const centerX = rect.left + (rect.width / 2);
  const centerY = rect.top + (rect.height / 2);
  const unscaledLeft = centerX - (unscaledWidth / 2);
  const unscaledTop = centerY - (unscaledHeight / 2);

  const grabOffsetY = startY - unscaledTop;
  const grabOffsetX = startX - unscaledLeft;

  // Create placeholder to reserve exact slot in grid with unscaled size
  const placeholder = document.createElement("div");
  placeholder.className = "dish-drag-placeholder";
  placeholder.style.width = unscaledWidth + "px";
  placeholder.style.height = unscaledHeight + "px";
  placeholder.style.margin = "0";

  dishesGrid.insertBefore(placeholder, card);

  // Append to document.body so position: fixed is 100% relative to viewport coordinates
  document.body.appendChild(card);

  card.classList.remove("is-drag-pressing");
  card.classList.add("is-drag-lifted");
  card.style.position = "fixed";
  card.style.top = unscaledTop + "px";
  card.style.left = unscaledLeft + "px";
  card.style.width = unscaledWidth + "px";
  card.style.height = unscaledHeight + "px";
  card.style.margin = "0";
  card.style.zIndex = "999999";
  card.style.boxShadow = "";
  card.style.transform = "";

  let lastClientY = startY;
  let autoScrollRaf = null;

  function doAutoScroll() {
    const edgeThreshold = 65;
    const maxScrollStep = 10;
    let scrollStep = 0;

    if (lastClientY < edgeThreshold) {
      scrollStep = -Math.round((edgeThreshold - lastClientY) / 4);
    } else if (lastClientY > window.innerHeight - edgeThreshold) {
      scrollStep = Math.round((lastClientY - (window.innerHeight - edgeThreshold)) / 4);
    }

    if (scrollStep !== 0) {
      window.scrollBy(0, Math.max(-maxScrollStep, Math.min(maxScrollStep, scrollStep)));
      updateSlotAndPositions(lastClientY);
      autoScrollRaf = requestAnimationFrame(doAutoScroll);
    } else {
      autoScrollRaf = null;
    }
  }

  function updateSlotAndPositions(clientY) {
    // Keep row directly stuck to the touch point
    const currentTop = clientY - grabOffsetY;
    card.style.top = currentTop + "px";
    card.style.transform = "scale(1.035)";

    const currentCardCenterY = currentTop + (unscaledHeight / 2);

    const otherCards = Array.from(
      dishesGrid.querySelectorAll(".dish-admin-card:not(.is-new-blank-row)")
    ).filter(c => c !== card);

    let targetBefore = null;
    for (const c of otherCards) {
      if (c === placeholder) continue;
      const cRect = c.getBoundingClientRect();
      const cMidY = cRect.top + (cRect.height / 2);
      if (currentCardCenterY < cMidY) {
        targetBefore = c;
        break;
      }
    }

    if (placeholder.nextSibling !== targetBefore && placeholder !== targetBefore) {
      const allSiblings = Array.from(dishesGrid.children).filter(el => el !== placeholder && el !== card);
      const firstTops = new Map();
      allSiblings.forEach(el => firstTops.set(el, el.getBoundingClientRect().top));

      if (targetBefore) {
        dishesGrid.insertBefore(placeholder, targetBefore);
      } else {
        dishesGrid.appendChild(placeholder);
      }

      allSiblings.forEach(el => {
        const first = firstTops.get(el);
        const last = el.getBoundingClientRect().top;
        const delta = first - last;
        if (delta !== 0) {
          el.style.transform = `translateY(${delta}px)`;
          el.style.transition = "none";
        }
      });

      void dishesGrid.offsetHeight;
      requestAnimationFrame(() => {
        allSiblings.forEach(el => {
          el.style.transition = "transform 240ms cubic-bezier(0.2, 0, 0, 1)";
          el.style.transform = "";
        });
      });
    }
  }

  function onTouchMove(e) {
    const touch = Array.from(e.touches || []).find(t => t.identifier === touchId);
    if (!touch) return;
    if (e.cancelable) e.preventDefault();
    lastClientY = touch.clientY;
    updateSlotAndPositions(lastClientY);

    if (!autoScrollRaf) {
      autoScrollRaf = requestAnimationFrame(doAutoScroll);
    }
  }

  function onMouseMove(e) {
    e.preventDefault();
    lastClientY = e.clientY;
    updateSlotAndPositions(lastClientY);

    if (!autoScrollRaf) {
      autoScrollRaf = requestAnimationFrame(doAutoScroll);
    }
  }

  function onDragEnd() {
    if (autoScrollRaf) {
      cancelAnimationFrame(autoScrollRaf);
      autoScrollRaf = null;
    }

    window.removeEventListener("touchmove", onTouchMove, { passive: false });
    window.removeEventListener("touchend", onDragEnd);
    window.removeEventListener("touchcancel", onDragEnd);
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onDragEnd);

    const pRect = placeholder.getBoundingClientRect();

    // Smooth landing transition with dissolving shadow and scaling down
    card.classList.remove("is-drag-lifted");
    card.classList.add("is-landing");
    card.style.boxShadow = "";
    card.style.transform = "";
    card.style.transition = "top 240ms cubic-bezier(0.2, 0, 0, 1), left 240ms cubic-bezier(0.2, 0, 0, 1)";
    card.style.top = pRect.top + "px";
    card.style.left = pRect.left + "px";

    setTimeout(() => {
      dishesGrid.insertBefore(card, placeholder);
      placeholder.remove();

      card.classList.remove("is-landing");
      card.style.position = "";
      card.style.top = "";
      card.style.left = "";
      card.style.width = "";
      card.style.height = "";
      card.style.margin = "";
      card.style.transform = "";
      card.style.transition = "";
      card.style.zIndex = "";
      card.style.boxShadow = "";

      Array.from(dishesGrid.children).forEach(el => {
        el.style.transform = "";
        el.style.transition = "";
      });

      activeDragSession = null;

      setTimeout(() => {
        suppressNextClick = false;
      }, 120);

      const newOrderedIds = Array.from(
        dishesGrid.querySelectorAll(".dish-admin-card:not(.is-new-blank-row)")
      ).map(el => el.dataset.id).filter(Boolean);

      // Update in-memory displayOrder for dishes
      newOrderedIds.forEach((id, idx) => {
        const d = dishes.find(item => String(item._id) === String(id));
        if (d) {
          d.displayOrder = idx;
        }
      });

      fetch("/api/owner/items", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: newOrderedIds })
      })
      .then(res => res.json())
      .then(data => {
        if (!data.success) {
          showNotification(data.error || "Failed to save dish order", "error");
        }
      })
      .catch(err => {
        showNotification("Network error saving dish order", "error");
      });
    }, 190);
  }

  if (inputType === "touch") {
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onDragEnd);
    window.addEventListener("touchcancel", onDragEnd);
  } else {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onDragEnd);
  }

  activeDragSession = { card, placeholder };
}

function getCaretCharacterOffsetWithin(element) {
  let caretOffset = 0;
  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0) {
    const range = sel.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    caretOffset = preCaretRange.toString().length;
  }
  return caretOffset;
}

function setCaretCharacterOffsetWithin(element, offset) {
  const sel = window.getSelection();
  if (!sel) return;
  const range = document.createRange();
  let currentOffset = 0;
  let found = false;

  function traverseNodes(node) {
    if (found) return;
    if (node.nodeType === Node.TEXT_NODE) {
      const nodeLen = node.textContent.length;
      if (currentOffset + nodeLen >= offset) {
        const targetOffset = Math.max(0, Math.min(offset - currentOffset, nodeLen));
        range.setStart(node, targetOffset);
        range.setEnd(node, targetOffset);
        found = true;
        return;
      }
      currentOffset += nodeLen;
    } else {
      for (let i = 0; i < node.childNodes.length; i++) {
        traverseNodes(node.childNodes[i]);
        if (found) return;
      }
    }
  }

  traverseNodes(element);
  if (!found) {
    range.selectNodeContents(element);
    range.collapse(false);
  }
  sel.removeAllRanges();
  sel.addRange(range);
}

/**
 * Enable click-to-edit for Dish Title (preserves bracket note rule in edit mode)
 */
function attachInlineTitleEditor(titleEl, dish) {
  function startEdit() {
    if (titleEl.getAttribute("contenteditable") === "true" || titleEl.classList.contains("is-editing")) return;
    titleEl.classList.add("is-editing");
    const card = titleEl.closest(".dish-admin-card");
    if (card) card.classList.add("is-editing-dish");

    const originalName = dish.name;
    titleEl.setAttribute("contenteditable", "plaintext-only");
    if (titleEl.contentEditable !== "plaintext-only") {
      titleEl.contentEditable = "true";
    }

    titleEl.setAttribute("enterkeyhint", "done");
    titleEl.setAttribute("autocomplete", "off");
    titleEl.setAttribute("autocorrect", "off");
    titleEl.setAttribute("spellcheck", "false");
    titleEl.innerHTML = formatDishName(originalName);
    titleEl.focus();

    // Place caret at the end without selecting all text
    const sel = window.getSelection();
    if (sel) {
      const range = document.createRange();
      range.selectNodeContents(titleEl);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }

    let isComposing = false;
    function onCompositionStart() { isComposing = true; }
    function onCompositionEnd() {
      isComposing = false;
      onInput();
    }

    function onInput() {
      if (isComposing) return;
      const offset = getCaretCharacterOffsetWithin(titleEl);
      const text = titleEl.textContent || "";
      titleEl.innerHTML = formatDishName(text);
      setCaretCharacterOffsetWithin(titleEl, offset);
    }

    let finished = false;
    async function commit(save) {
      if (finished) return;
      finished = true;
      cleanup();
      titleEl.removeAttribute("contenteditable");
      titleEl.classList.remove("is-editing");
      if (card) card.classList.remove("is-editing-dish");
      if (typeof titleEl.blur === "function") titleEl.blur();

      const newName = (titleEl.textContent || "").trim();
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

    function onKeyDown(e) {
      if (e.key === "Enter" || e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        commit(true);
      } else if (e.key === "Escape" || e.keyCode === 27) {
        e.preventDefault();
        commit(false);
      }
    }

    function onBlur() {
      commit(true);
    }

    function onPaste(e) {
      e.preventDefault();
      const text = ((e.clipboardData || window.clipboardData)?.getData("text/plain") || "").replace(/[\r\n]+/g, " ");
      document.execCommand("insertText", false, text);
    }

    function cleanup() {
      titleEl.removeEventListener("keydown", onKeyDown);
      titleEl.removeEventListener("blur", onBlur);
      titleEl.removeEventListener("paste", onPaste);
      titleEl.removeEventListener("input", onInput);
      titleEl.removeEventListener("compositionstart", onCompositionStart);
      titleEl.removeEventListener("compositionend", onCompositionEnd);
    }

    titleEl.addEventListener("keydown", onKeyDown);
    titleEl.addEventListener("blur", onBlur);
    titleEl.addEventListener("paste", onPaste);
    titleEl.addEventListener("input", onInput);
    titleEl.addEventListener("compositionstart", onCompositionStart);
    titleEl.addEventListener("compositionend", onCompositionEnd);
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
 * Enable click-to-edit for Dish Price (in-place contenteditable, identical to dish title)
 */
function attachInlinePriceEditor(priceEl, dish) {
  function startEdit() {
    if (priceEl.getAttribute("contenteditable") === "true" || priceEl.classList.contains("is-editing")) return;
    priceEl.classList.add("is-editing");
    const card = priceEl.closest(".dish-admin-card");
    if (card) card.classList.add("is-editing-dish");

    const originalPrice = dish.price;
    priceEl.setAttribute("contenteditable", "plaintext-only");
    if (priceEl.contentEditable !== "plaintext-only") {
      priceEl.contentEditable = "true";
    }

    priceEl.setAttribute("enterkeyhint", "done");
    priceEl.setAttribute("inputmode", "decimal");
    priceEl.setAttribute("autocomplete", "off");
    priceEl.setAttribute("autocorrect", "off");
    priceEl.setAttribute("spellcheck", "false");
    if (priceEl.textContent.trim() !== String(originalPrice)) {
      priceEl.textContent = `${originalPrice}`;
    }
    priceEl.focus();

    // Place caret at the end without selecting all text
    const sel = window.getSelection();
    if (sel) {
      const range = document.createRange();
      range.selectNodeContents(priceEl);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }

    let finished = false;
    async function commit(save) {
      if (finished) return;
      finished = true;
      cleanup();
      priceEl.removeAttribute("contenteditable");
      priceEl.removeAttribute("inputmode");
      priceEl.classList.remove("is-editing");
      if (card) card.classList.remove("is-editing-dish");
      if (typeof priceEl.blur === "function") priceEl.blur();

      const text = (priceEl.textContent || "").trim();
      const raw = parseFloat(text);

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
        dish.price = originalPrice;
        priceEl.textContent = `${originalPrice}`;
      }
    }

    function onKeyDown(e) {
      if (e.key === "Enter" || e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        commit(true);
      } else if (e.key === "Escape" || e.keyCode === 27) {
        e.preventDefault();
        commit(false);
      }
    }

    function onBlur() {
      commit(true);
    }

    function onPaste(e) {
      e.preventDefault();
      const text = ((e.clipboardData || window.clipboardData)?.getData("text/plain") || "").replace(/[^0-9.]/g, "");
      document.execCommand("insertText", false, text);
    }

    function cleanup() {
      priceEl.removeEventListener("keydown", onKeyDown);
      priceEl.removeEventListener("blur", onBlur);
      priceEl.removeEventListener("paste", onPaste);
    }

    priceEl.addEventListener("keydown", onKeyDown);
    priceEl.addEventListener("blur", onBlur);
    priceEl.addEventListener("paste", onPaste);
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

  // 1. Capture initial positions of all category cards currently below Today's Special
  const existingCards = Array.from(categoriesGrid.querySelectorAll(".category-admin-card"));
  const cardsToPushDown = existingCards.filter(card => !card.classList.contains("today-special-card") && !card.classList.contains("is-new-blank-row"));
  const firstTops = new Map();
  cardsToPushDown.forEach(card => {
    firstTops.set(card, card.getBoundingClientRect().top);
  });

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
        <input type="text" class="category-inline-input" placeholder="Category name..." aria-label="New category name" enterkeyhint="done" autocomplete="off" autocorrect="off" spellcheck="false">
      </div>
    </div>
    <div class="category-row-actions">
      <button type="button" class="delete-cat-btn delete-icon-btn cancel-new-cat-btn" title="Cancel" aria-label="Cancel">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  `;

  // Start new row invisible and slightly elevated for fluid entrance
  row.style.opacity = "0";
  row.style.transform = "translateY(-12px) scale(0.98)";
  row.style.transition = "none";

  // Insert below Today's Special
  if (todaySpecialCard && todaySpecialCard.nextSibling) {
    categoriesGrid.insertBefore(row, todaySpecialCard.nextSibling);
  } else {
    categoriesGrid.appendChild(row);
  }

  // 2. INVERT: Instantly move the existing cards back to their previous visual positions
  cardsToPushDown.forEach(card => {
    const firstTop = firstTops.get(card);
    const lastTop = card.getBoundingClientRect().top;
    const dy = firstTop - lastTop;
    if (dy !== 0) {
      card.style.transform = `translateY(${dy}px)`;
      card.style.transition = "none";
    }
  });

  // Force layout flush so the inverted transforms are committed
  void categoriesGrid.offsetHeight;

  // 3. PLAY: Animate the existing cards smoothly down to translateY(0), and animate in the new row
  requestAnimationFrame(() => {
    const ease = "cubic-bezier(0.16, 1, 0.3, 1)";
    const duration = "380ms";

    cardsToPushDown.forEach(card => {
      card.style.transition = `transform ${duration} ${ease}`;
      card.style.transform = "translateY(0)";
    });

    row.style.transition = `opacity 280ms ease-out, transform ${duration} ${ease}`;
    row.style.opacity = "1";
    row.style.transform = "translateY(0) scale(1)";

    setTimeout(() => {
      cardsToPushDown.forEach(card => {
        card.style.transition = "";
        card.style.transform = "";
      });
      row.style.transition = "";
      row.style.transform = "";
      row.style.opacity = "";
    }, 400);
  });

  const input = row.querySelector(".category-inline-input");
  const cancelBtn = row.querySelector(".cancel-new-cat-btn");
  const availCheckbox = row.querySelector(".category-avail-checkbox");

  let isCommitting = false;
  let isDiscarded = false;

  function discardRow() {
    if (isDiscarded) return;
    isDiscarded = true;

    const allCards = Array.from(categoriesGrid.querySelectorAll(".category-admin-card"));
    const rowIndex = allCards.indexOf(row);
    const cardsBelow = rowIndex !== -1 ? allCards.slice(rowIndex + 1) : [];

    const preTops = new Map();
    cardsBelow.forEach(card => {
      preTops.set(card, card.getBoundingClientRect().top);
    });

    row.style.transition = "opacity 180ms ease-out, transform 220ms cubic-bezier(0.4, 0, 0.2, 1)";
    row.style.opacity = "0";
    row.style.transform = "translateY(-10px) scale(0.98)";
    row.style.pointerEvents = "none";

    setTimeout(() => {
      if (row.parentNode) row.remove();
      if (categories.length === 0 && !isFetchingMenuData && emptyCategoriesState) {
        emptyCategoriesState.style.display = "flex";
      }

      cardsBelow.forEach(card => {
        const first = preTops.get(card);
        const last = card.getBoundingClientRect().top;
        const dy = first - last;
        if (dy !== 0) {
          card.style.transform = `translateY(${dy}px)`;
          card.style.transition = "none";
        }
      });

      void categoriesGrid.offsetHeight;

      requestAnimationFrame(() => {
        const ease = "cubic-bezier(0.16, 1, 0.3, 1)";
        cardsBelow.forEach(card => {
          card.style.transition = `transform 320ms ${ease}`;
          card.style.transform = "";
        });

        setTimeout(() => {
          cardsBelow.forEach(card => {
            card.style.transition = "";
            card.style.transform = "";
          });
        }, 340);
      });
    }, 180);
  }

  async function commitNewCategory() {
    if (isCommitting || isDiscarded) return;
    const nameVal = input.value.trim().toUpperCase();

    if (!nameVal) {
      discardRow();
      return;
    }

    isCommitting = true;
    input.disabled = true;

    // Optimistic creation
    const tempCatId = `temp_cat_${Date.now()}`;
    const creationTracker = { cancelled: false, realId: null };
    inFlightCategoryCreations.set(tempCatId, creationTracker);

    const isAvail = availCheckbox ? availCheckbox.checked : true;
    const optimisticCat = {
      _id: tempCatId,
      name: nameVal,
      displayOrder: 0,
      isAvailable: isAvail,
      isVisible: isAvail,
      createdAt: new Date().toISOString()
    };

    newlyCreatedCategoryId = tempCatId;

    const specialIndex = categories.findIndex(c => c.isFixed || (c.name && c.name.toUpperCase() === "TODAY'S SPECIAL"));
    const insertIdx = specialIndex !== -1 ? specialIndex + 1 : 0;
    categories.splice(insertIdx, 0, optimisticCat);

    // Remove the blank row immediately so the real row takes its place
    if (row.parentNode) row.remove();

    refreshMenuUI();
    showNotification(`Category "${nameVal}" added.`);

    // Perform background backend write
    fetch("/api/owner/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nameVal,
        displayOrder: 0,
        isAvailable: isAvail,
        isVisible: isAvail
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.category) {
        const realId = String(data.category._id);
        creationTracker.realId = realId;

        // If user already deleted this category while creation was in flight
        if (creationTracker.cancelled) {
          inFlightCategoryCreations.delete(tempCatId);
          fetch(`/api/owner/categories?id=${realId}`, { method: "DELETE" }).catch(() => {});
          return;
        }

        const idx = categories.findIndex(c => String(c._id) === tempCatId);
        if (idx !== -1) {
          // Mutate existing object in-place so closures referencing it reflect the real ID
          Object.assign(categories[idx], data.category);
        }
        const catCard = document.querySelector(`.category-admin-card[data-id="${tempCatId}"]`);
        if (catCard) {
          catCard.dataset.id = realId;
          const catDelBtn = catCard.querySelector(".delete-cat-btn");
          if (catDelBtn) catDelBtn.dataset.id = realId;
          const availCb = catCard.querySelector(".category-avail-checkbox");
          if (availCb) availCb.dataset.id = realId;
        }
        const tabEl = document.querySelector(`.category-dropdown-item[data-cat-id="${tempCatId}"]`);
        if (tabEl) tabEl.dataset.catId = realId;
        if (selectedCategoryId === tempCatId) {
          selectedCategoryId = realId;
        }
        populateCategoryDropdown();
        inFlightCategoryCreations.delete(tempCatId);
      } else {
        inFlightCategoryCreations.delete(tempCatId);
        if (!creationTracker.cancelled) {
          categories = categories.filter(c => String(c._id) !== tempCatId);
          refreshMenuUI();
          showNotification(data.error || "Failed to add category.", "error");
        }
      }
    })
    .catch(err => {
      inFlightCategoryCreations.delete(tempCatId);
      if (!creationTracker.cancelled) {
        categories = categories.filter(c => String(c._id) !== tempCatId);
        refreshMenuUI();
        showNotification("Network error adding category.", "error");
      }
    });
  }

  cancelBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    discardRow();
  });

  input.addEventListener("input", () => {
    const start = input.selectionStart;
    const end = input.selectionEnd;
    input.value = input.value.toUpperCase();
    if (start !== null && end !== null) {
      input.setSelectionRange(start, end);
    }
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.keyCode === 13 || e.which === 13) {
      e.preventDefault();
      input.blur();
      commitNewCategory();
    } else if (e.key === "Escape" || e.keyCode === 27) {
      e.preventDefault();
      discardRow();
    }
  });

  input.addEventListener("keyup", (e) => {
    if (e.key === "Enter" || e.keyCode === 13 || e.which === 13) {
      e.preventDefault();
      input.blur();
      commitNewCategory();
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
      try {
        input.focus({ preventScroll: true });
      } catch (e) {
        input.focus();
      }
    }
  }, 100);

  row.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/**
 * Category Modal Logic
 */
function openAddCategoryModal() {
  categoryModalTitle.textContent = "Add New Category";
  categoryIdInput.value = "";
  categoryNameInput.value = "";
  openModal(categoryModal);
  categoryNameInput.focus();
}

function openEditCategoryModal() {
  if (!selectedCategoryId) return;
  const activeCat = categories.find(c => String(c._id) === selectedCategoryId);
  if (!activeCat) return;

  categoryModalTitle.textContent = "Rename Category";
  categoryIdInput.value = activeCat._id;
  categoryNameInput.value = (activeCat.name || "").toUpperCase();
  openModal(categoryModal);
  categoryNameInput.focus();
}

function closeCategoryModal(callback) {
  const modal = document.getElementById("categoryModal") || categoryModal;
  closeModal(modal, callback);
}

if (categoryNameInput) {
  categoryNameInput.addEventListener("input", () => {
    const start = categoryNameInput.selectionStart;
    const end = categoryNameInput.selectionEnd;
    categoryNameInput.value = categoryNameInput.value.toUpperCase();
    if (start !== null && end !== null) {
      categoryNameInput.setSelectionRange(start, end);
    }
  });
}

categoryForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const catId = categoryIdInput.value;
  const name = categoryNameInput.value.trim().toUpperCase();

  if (!name) {
    showNotification("Category name cannot be blank.", "error");
    return;
  }

  const isEdit = !!catId;
  closeCategoryModal();

  if (isEdit) {
    const cat = categories.find(c => String(c._id) === String(catId));
    if (!cat) return;
    const originalName = (cat.name || "").toUpperCase();
    cat.name = name;

    refreshMenuUI();
    showNotification(`Category renamed to "${name}".`);

    fetch("/api/owner/categories", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: catId, name })
    })
    .then(res => res.json())
    .then(data => {
      if (!data.success) {
        cat.name = originalName;
        refreshMenuUI();
        showNotification(data.error || "Failed to update category.", "error");
      }
    })
    .catch(err => {
      cat.name = originalName;
      refreshMenuUI();
      showNotification("Network error updating category.", "error");
    });
  } else {
    const tempCatId = `temp_cat_${Date.now()}`;
    const creationTracker = { cancelled: false, realId: null };
    inFlightCategoryCreations.set(tempCatId, creationTracker);

    const optimisticCat = {
      _id: tempCatId,
      name,
      displayOrder: 0,
      isAvailable: true,
      isVisible: true,
      createdAt: new Date().toISOString()
    };

    newlyCreatedCategoryId = tempCatId;
    const specialIndex = categories.findIndex(c => c.isFixed || (c.name && c.name.toUpperCase() === "TODAY'S SPECIAL"));
    const insertIdx = specialIndex !== -1 ? specialIndex + 1 : 0;
    categories.splice(insertIdx, 0, optimisticCat);
    selectedCategoryId = tempCatId;

    refreshMenuUI();
    showNotification(`Category "${name}" added.`);

    fetch("/api/owner/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, displayOrder: 0 })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.category) {
        const realId = String(data.category._id);
        creationTracker.realId = realId;

        if (creationTracker.cancelled) {
          inFlightCategoryCreations.delete(tempCatId);
          fetch(`/api/owner/categories?id=${realId}`, { method: "DELETE" }).catch(() => {});
          return;
        }

        const idx = categories.findIndex(c => String(c._id) === tempCatId);
        if (idx !== -1) {
          Object.assign(categories[idx], data.category);
        }
        if (selectedCategoryId === tempCatId) {
          selectedCategoryId = realId;
        }
        const catCard = document.querySelector(`.category-admin-card[data-id="${tempCatId}"]`);
        if (catCard) {
          catCard.dataset.id = realId;
          const catDelBtn = catCard.querySelector(".delete-cat-btn");
          if (catDelBtn) catDelBtn.dataset.id = realId;
          const availCb = catCard.querySelector(".category-avail-checkbox");
          if (availCb) availCb.dataset.id = realId;
        }
        const tabEl = document.querySelector(`.category-dropdown-item[data-cat-id="${tempCatId}"]`);
        if (tabEl) tabEl.dataset.catId = realId;
        populateCategoryDropdown();
        inFlightCategoryCreations.delete(tempCatId);
      } else {
        inFlightCategoryCreations.delete(tempCatId);
        if (!creationTracker.cancelled) {
          categories = categories.filter(c => String(c._id) !== tempCatId);
          if (selectedCategoryId === tempCatId) selectedCategoryId = null;
          refreshMenuUI();
          showNotification(data.error || "Failed to add category.", "error");
        }
      }
    })
    .catch(err => {
      inFlightCategoryCreations.delete(tempCatId);
      if (!creationTracker.cancelled) {
        categories = categories.filter(c => String(c._id) !== tempCatId);
        if (selectedCategoryId === tempCatId) selectedCategoryId = null;
        refreshMenuUI();
        showNotification("Network error adding category.", "error");
      }
    });
  }
});

// Category event listeners
function selectCategoryFromDropdown(catId) {
  const newCatId = catId ? String(catId) : null;
  const isSame = selectedCategoryId === newCatId;
  selectedCategoryId = newCatId;
  if (categorySelectDropdown) {
    categorySelectDropdown.value = catId || "";
  }
  updateCategoryDropdownDisplay();
  closeCategoryDropdown();
  updateAddDishBtnState();

  if (!isSame) {
    if (dishesGrid) {
      dishesGrid.classList.remove("view-content-smooth");
      void dishesGrid.offsetWidth;
      dishesGrid.classList.add("view-content-smooth");
    }
    renderDishesGrid();
  }
}

function toggleCategoryDropdown(e) {
  if (e) e.stopPropagation();
  if (!categoryDropdownWrapper) return;
  const isOpen = categoryDropdownWrapper.classList.toggle("is-open");
  categoryDropdownWrapper.setAttribute("aria-expanded", isOpen ? "true" : "false");
  if (!isOpen) {
    categoryDropdownWrapper.blur();
  }
}

function closeCategoryDropdown() {
  if (!categoryDropdownWrapper) return;
  categoryDropdownWrapper.classList.remove("is-open");
  categoryDropdownWrapper.setAttribute("aria-expanded", "false");
  categoryDropdownWrapper.blur();
}

if (categoryDropdownWrapper) {
  categoryDropdownWrapper.addEventListener("click", toggleCategoryDropdown);
  categoryDropdownWrapper.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleCategoryDropdown(e);
    }
  });
}

document.addEventListener("click", (e) => {
  if (categoryDropdownWrapper && !categoryDropdownWrapper.contains(e.target)) {
    closeCategoryDropdown();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeCategoryDropdown();
  }
});

if (categorySelectDropdown) {
  categorySelectDropdown.addEventListener("change", (e) => {
    selectedCategoryId = e.target.value ? String(e.target.value) : null;
    updateCategoryDropdownDisplay();
    updateAddDishBtnState();
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
  if (selectedCategoryId === null || !selectedCategoryId) {
    openSelectCategoryAlertModal();
    return;
  }
  if (isTodaySpecialCategorySelected()) {
    showNotification("Today's Special items are managed using the star toggle on dishes in other categories.", "info");
    return;
  }
  const nonFixedCats = categories.filter(c => !(c.isFixed || (c.name && c.name.toUpperCase() === "TODAY'S SPECIAL")));
  if (nonFixedCats.length === 0) {
    showNotification("Please create a category (e.g. Starters, Main Course) before adding dishes.", "error");
    switchDashboardView("category");
    createBlankCategoryRow();
    return;
  }
  dishModalTitle.textContent = "Add New Dish";
  dishIdInput.value = "";
  dishNameInput.value = "";
  dishPriceInput.value = "";
  dishAvailableInput.checked = true;

  if (selectedCategoryId && nonFixedCats.some(c => String(c._id) === selectedCategoryId)) {
    dishCategorySelect.value = selectedCategoryId;
  } else if (nonFixedCats.length > 0) {
    dishCategorySelect.value = nonFixedCats[0]._id;
  }

  openModal(dishModal);
  dishNameInput.focus();
}

function openEditDishModal(dish) {
  dishModalTitle.textContent = "Edit Dish";
  dishIdInput.value = dish._id;
  dishNameInput.value = dish.name;
  dishPriceInput.value = dish.price;
  dishAvailableInput.checked = dish.isAvailable !== false;
  dishCategorySelect.value = dish.categoryId;

  openModal(dishModal);
  dishNameInput.focus();
}

function closeDishModal(callback) {
  const modal = document.getElementById("dishModal") || dishModal;
  closeModal(modal, callback);
}

dishForm.addEventListener("submit", (e) => {
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
  closeDishModal();

  if (isEdit) {
    const existingDish = dishes.find(d => String(d._id) === String(dishId));
    if (!existingDish) return;
    const prevDish = { ...existingDish };

    existingDish.categoryId = categoryId;
    existingDish.name = name;
    existingDish.price = price;
    existingDish.isAvailable = isAvailable;

    renderDishesGrid();
    renderCategoriesList();
    showNotification(`Dish "${name}" updated.`);

    fetch("/api/owner/items", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: dishId, categoryId, name, price, isAvailable })
    })
    .then(res => res.json())
    .then(data => {
      if (!data.success) {
        Object.assign(existingDish, prevDish);
        renderDishesGrid();
        renderCategoriesList();
        showNotification(data.error || "Failed to save dish.", "error");
      }
    })
    .catch(err => {
      Object.assign(existingDish, prevDish);
      renderDishesGrid();
      renderCategoriesList();
      showNotification("Network error saving dish.", "error");
    });
  } else {
    // Shift displayOrder of existing dishes in this category forward so new dish is top
    dishes.forEach(d => {
      if (String(d.categoryId) === String(categoryId)) {
        d.displayOrder = (d.displayOrder ?? 0) + 1;
      }
    });

    const tempDishId = `temp_dish_${Date.now()}`;
    const optimisticDish = {
      _id: tempDishId,
      categoryId,
      name,
      price,
      isAvailable,
      isSpecial: false,
      isFeatured: false,
      displayOrder: 0,
      createdAt: new Date().toISOString()
    };

    dishes.unshift(optimisticDish);

    renderDishesGrid();
    renderCategoriesList();
    showNotification(`Dish "${name}" added.`);

    fetch("/api/owner/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryId, name, price, isAvailable })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && (data.item || data.dish)) {
        const realItem = data.item || data.dish;
        const idx = dishes.findIndex(d => String(d._id) === tempDishId);
        if (idx !== -1) {
          dishes[idx] = realItem;
        }
        const card = document.querySelector(`.dish-admin-card[data-id="${tempDishId}"]`);
        if (card) card.dataset.id = realItem._id;
      } else {
        dishes = dishes.filter(d => String(d._id) !== tempDishId);
        renderDishesGrid();
        renderCategoriesList();
        showNotification(data.error || "Failed to add dish.", "error");
      }
    })
    .catch(err => {
      dishes = dishes.filter(d => String(d._id) !== tempDishId);
      renderDishesGrid();
      renderCategoriesList();
      showNotification("Network error adding dish.", "error");
    });
  }
});

const inFlightDishCreations = new Map(); // tempDishId -> { cancelled: false, realId: null }

/**
 * Create a blank dish row with inline fields at the top of the dishes grid
 */
function createBlankDishRow() {
  if (selectedCategoryId === null || !selectedCategoryId) {
    openSelectCategoryAlertModal();
    return;
  }
  if (isTodaySpecialCategorySelected()) {
    showNotification("Today's Special items are managed using the star toggle on dishes in other categories.", "info");
    return;
  }
  if (!dishesGrid) return;

  // Clear any active search so newly added dish is directly visible in its category
  if (dishSearchQuery) {
    dishSearchQuery = "";
    const searchInput = document.getElementById("dishSearchInput");
    if (searchInput) searchInput.value = "";
    renderDishesGrid();
  }

  // If a blank row is already being edited, focus it and scroll it into view
  const existingRow = dishesGrid.querySelector(".dish-admin-card.is-new-blank-row");
  if (existingRow) {
    const existingInput = existingRow.querySelector(".dish-blank-name-input");
    if (existingInput) {
      existingInput.focus();
      existingInput.select();
    }
    existingRow.scrollIntoView({ behavior: "smooth", block: "nearest" });
    return;
  }

  if (emptyDishesState) emptyDishesState.style.display = "none";

  // 1. Capture initial positions of all existing dish cards in the grid
  const existingCards = Array.from(dishesGrid.querySelectorAll(".dish-admin-card:not(.is-new-blank-row)"));
  const firstTops = new Map();
  existingCards.forEach(card => {
    firstTops.set(card, card.getBoundingClientRect().top);
  });

  const row = document.createElement("div");
  row.className = "dish-admin-card is-new-blank-row";
  row.innerHTML = `
    <div class="dish-row-info">
      <label class="switch-label dish-row-switch" title="Available (click to toggle)">
        <span class="switch">
          <input type="checkbox" class="dish-avail-checkbox" checked>
          <span class="slider"></span>
        </span>
      </label>
      <button type="button" class="dish-star-btn" title="Add to Today's Special" aria-label="Toggle Today's Special">
        <svg class="star-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </button>
      <div class="dish-card-title is-editing" style="flex: 1; min-width: 0;">
        <input type="text" class="dish-blank-name-input" placeholder="Item Name" aria-label="New item name" enterkeyhint="next" autocomplete="off" autocorrect="off" spellcheck="false">
      </div>
    </div>
    <div class="dish-row-actions">
      <div class="dish-card-price is-editing">
        <input type="text" inputmode="decimal" class="dish-blank-price-input" placeholder="Price" aria-label="New item price" enterkeyhint="done" autocomplete="off">
      </div>
      <button type="button" class="delete-dish-btn delete-icon-btn cancel-new-dish-btn" title="Cancel" aria-label="Cancel">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  `;

  // Start new row invisible and slightly elevated for fluid entrance
  row.style.opacity = "0";
  row.style.transform = "translateY(-12px) scale(0.98)";
  row.style.transition = "none";

  // Insert at top of dishesGrid
  if (dishesGrid.firstChild) {
    dishesGrid.insertBefore(row, dishesGrid.firstChild);
  } else {
    dishesGrid.appendChild(row);
  }

  // 2. INVERT: Instantly move existing cards back to their previous visual positions
  existingCards.forEach(card => {
    const firstTop = firstTops.get(card);
    const lastTop = card.getBoundingClientRect().top;
    const dy = firstTop - lastTop;
    if (dy !== 0) {
      card.style.transform = `translateY(${dy}px)`;
      card.style.transition = "none";
    }
  });

  // Force layout flush so inverted transforms are committed
  void dishesGrid.offsetHeight;

  // 3. PLAY: Animate existing cards smoothly down, and animate in the new row
  requestAnimationFrame(() => {
    const ease = "cubic-bezier(0.16, 1, 0.3, 1)";
    const duration = "380ms";

    existingCards.forEach(card => {
      card.style.transition = `transform ${duration} ${ease}`;
      card.style.transform = "translateY(0)";
    });

    row.style.transition = `opacity 280ms ease-out, transform ${duration} ${ease}`;
    row.style.opacity = "1";
    row.style.transform = "translateY(0) scale(1)";

    setTimeout(() => {
      existingCards.forEach(card => {
        card.style.transition = "";
        card.style.transform = "";
      });
      row.style.transition = "";
      row.style.transform = "";
      row.style.opacity = "";
    }, 400);
  });

  const nameInput = row.querySelector(".dish-blank-name-input");
  const priceInput = row.querySelector(".dish-blank-price-input");
  const cancelBtn = row.querySelector(".cancel-new-dish-btn");
  const availCheckbox = row.querySelector(".dish-avail-checkbox");
  const starBtn = row.querySelector(".dish-star-btn");

  let isSpecial = false;
  if (starBtn) {
    starBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      isSpecial = !isSpecial;
      starBtn.classList.toggle("active", isSpecial);
      starBtn.title = isSpecial ? "Remove from Today's Special" : "Add to Today's Special";
    });
  }

  setTimeout(() => {
    if (nameInput) {
      nameInput.focus();
    }
  }, 50);

  let isCommitting = false;
  let isDiscarded = false;

  function discardRow() {
    if (isDiscarded) return;
    isDiscarded = true;

    const allCards = Array.from(dishesGrid.querySelectorAll(".dish-admin-card"));
    const rowIndex = allCards.indexOf(row);
    const cardsBelow = rowIndex !== -1 ? allCards.slice(rowIndex + 1) : [];

    const preTops = new Map();
    cardsBelow.forEach(card => {
      preTops.set(card, card.getBoundingClientRect().top);
    });

    row.style.transition = "opacity 180ms ease-out, transform 220ms cubic-bezier(0.4, 0, 0.2, 1)";
    row.style.opacity = "0";
    row.style.transform = "translateY(-10px) scale(0.98)";
    row.style.pointerEvents = "none";

    setTimeout(() => {
      if (row.parentNode) row.remove();
      const currentCategoryDishes = dishes.filter(d => String(d.categoryId) === String(selectedCategoryId));
      if (currentCategoryDishes.length === 0 && !isFetchingMenuData && emptyDishesState) {
        emptyDishesState.style.display = "flex";
      }

      cardsBelow.forEach(card => {
        const first = preTops.get(card);
        const last = card.getBoundingClientRect().top;
        const dy = first - last;
        if (dy !== 0) {
          card.style.transform = `translateY(${dy}px)`;
          card.style.transition = "none";
        }
      });

      void dishesGrid.offsetHeight;

      requestAnimationFrame(() => {
        const ease = "cubic-bezier(0.16, 1, 0.3, 1)";
        cardsBelow.forEach(card => {
          card.style.transition = `transform 320ms ${ease}`;
          card.style.transform = "";
        });

        setTimeout(() => {
          cardsBelow.forEach(card => {
            card.style.transition = "";
            card.style.transform = "";
          });
        }, 340);
      });
    }, 180);
  }

  async function commitNewDish() {
    if (isCommitting || isDiscarded) return;
    const nameVal = nameInput.value.trim();

    if (!nameVal) {
      discardRow();
      return;
    }

    isCommitting = true;
    nameInput.disabled = true;
    priceInput.disabled = true;

    let priceVal = priceInput.value.trim();
    let numPrice = parseFloat(priceVal);
    if (isNaN(numPrice) || numPrice < 0) {
      numPrice = 0;
    }

    const isAvail = availCheckbox ? availCheckbox.checked : true;
    const targetCategoryId = selectedCategoryId;

    // Optimistic dish creation
    const tempDishId = `temp_dish_${Date.now()}`;
    const creationTracker = { cancelled: false, realId: null };
    inFlightDishCreations.set(tempDishId, creationTracker);

    // Shift displayOrder of existing dishes in this category forward so new dish is top
    dishes.forEach(d => {
      if (String(d.categoryId) === String(targetCategoryId)) {
        d.displayOrder = (d.displayOrder ?? 0) + 1;
      }
    });

    const optimisticDish = {
      _id: tempDishId,
      categoryId: targetCategoryId,
      name: nameVal,
      price: numPrice,
      isAvailable: isAvail,
      isSpecial: isSpecial,
      isFeatured: isSpecial,
      displayOrder: 0,
      createdAt: new Date().toISOString()
    };

    dishes.unshift(optimisticDish);

    // Remove blank row immediately so real row takes its place smoothly
    if (row.parentNode) row.remove();

    renderDishesGrid();
    updateCategoryCountsAndBadges();
    showNotification(`Dish "${nameVal}" added.`);

    // Perform background backend write
    fetch("/api/owner/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categoryId: targetCategoryId,
        name: nameVal,
        price: numPrice,
        isAvailable: isAvail,
        isSpecial: isSpecial,
        isFeatured: isSpecial
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && (data.item || data.dish)) {
        const realItem = data.item || data.dish;
        const realId = String(realItem._id);
        creationTracker.realId = realId;

        // If user already deleted this dish while creation was in flight
        if (creationTracker.cancelled) {
          inFlightDishCreations.delete(tempDishId);
          fetch(`/api/owner/items?id=${realId}`, { method: "DELETE" }).catch(() => {});
          return;
        }

        const idx = dishes.findIndex(d => String(d._id) === tempDishId);
        if (idx !== -1) {
          Object.assign(dishes[idx], realItem);
        }
        const dishCard = document.querySelector(`.dish-admin-card[data-id="${tempDishId}"]`);
        if (dishCard) {
          dishCard.dataset.id = realId;
          const dishDelBtn = dishCard.querySelector(".delete-dish-btn");
          if (dishDelBtn) dishDelBtn.dataset.id = realId;
          const availCb = dishCard.querySelector(".dish-avail-checkbox");
          if (availCb) availCb.dataset.id = realId;
          const starB = dishCard.querySelector(".dish-star-btn");
          if (starB) starB.dataset.id = realId;
        }
        inFlightDishCreations.delete(tempDishId);
      } else {
        inFlightDishCreations.delete(tempDishId);
        if (!creationTracker.cancelled) {
          dishes = dishes.filter(d => String(d._id) !== tempDishId);
          renderDishesGrid();
          updateCategoryCountsAndBadges();
          showNotification(data.error || "Failed to add dish.", "error");
        }
      }
    })
    .catch(err => {
      inFlightDishCreations.delete(tempDishId);
      if (!creationTracker.cancelled) {
        dishes = dishes.filter(d => String(d._id) !== tempDishId);
        renderDishesGrid();
        updateCategoryCountsAndBadges();
        showNotification("Network error adding dish.", "error");
      }
    });
  }

  cancelBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    discardRow();
  });

  nameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.keyCode === 13 || e.which === 13) {
      e.preventDefault();
      if (!nameInput.value.trim()) {
        discardRow();
      } else {
        priceInput.focus();
        priceInput.select();
      }
    } else if (e.key === "Escape" || e.keyCode === 27) {
      e.preventDefault();
      discardRow();
    }
  });

  priceInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.keyCode === 13 || e.which === 13) {
      e.preventDefault();
      commitNewDish();
    } else if (e.key === "Escape" || e.keyCode === 27) {
      e.preventDefault();
      discardRow();
    }
  });

  function handleBlurCheck(e) {
    if (e.relatedTarget && (
      row.contains(e.relatedTarget) ||
      e.relatedTarget.closest(".cancel-new-dish-btn")
    )) {
      return;
    }
    setTimeout(() => {
      if (!isCommitting && !isDiscarded) {
        const activeEl = document.activeElement;
        if (activeEl && row.contains(activeEl)) return;
        if (!nameInput.value.trim()) {
          discardRow();
        } else {
          commitNewDish();
        }
      }
    }, 150);
  }

  nameInput.addEventListener("blur", handleBlurCheck);
  priceInput.addEventListener("blur", handleBlurCheck);
}

async function confirmDeleteDish(dish) {
  if (!confirm(`Are you sure you want to delete dish "${dish.name}"?`)) return;

  const targetId = String(dish._id);
  const tracker = inFlightDishCreations.get(targetId);
  if (tracker) {
    tracker.cancelled = true;
    inFlightDishCreations.delete(targetId);
    if (tracker.realId) {
      fetch(`/api/owner/items?id=${tracker.realId}`, { method: "DELETE" }).catch(() => {});
    }
  }

  const prevDishes = [...dishes];
  dishes = dishes.filter(d => String(d._id) !== targetId);

  // Smooth deletion animation if card is in the dishes grid
  const card = (dishesGrid && (
    dishesGrid.querySelector(`.dish-admin-card[data-id="${targetId}"]`)
  )) || null;

  if (card && card.parentNode === dishesGrid) {
    const allCards = Array.from(dishesGrid.querySelectorAll(".dish-admin-card"));
    const cardIndex = allCards.indexOf(card);
    const cardsBelow = cardIndex !== -1 ? allCards.slice(cardIndex + 1) : [];

    const preTops = new Map();
    cardsBelow.forEach(c => preTops.set(c, c.getBoundingClientRect().top));

    card.style.pointerEvents = "none";
    card.style.transition = "opacity 180ms ease-out, transform 200ms cubic-bezier(0.4, 0, 0.2, 1)";
    card.style.opacity = "0";
    card.style.transform = "translateY(-8px) scale(0.97)";

    setTimeout(() => {
      if (card.parentNode) card.remove();

      // Show empty state if this was the last dish
      const currentCategoryDishes = dishes.filter(d => String(d.categoryId) === String(selectedCategoryId));
      if (currentCategoryDishes.length === 0 && !isFetchingMenuData && emptyDishesState) {
        emptyDishesState.style.display = "flex";
      }

      cardsBelow.forEach(c => {
        if (!c.parentNode) return;
        const oldTop = preTops.get(c);
        const newTop = c.getBoundingClientRect().top;
        const dy = oldTop - newTop;
        if (dy !== 0) {
          c.style.transform = `translateY(${dy}px)`;
          c.style.transition = "none";
        }
      });

      void dishesGrid.offsetHeight;

      requestAnimationFrame(() => {
        cardsBelow.forEach(c => {
          if (!c.parentNode) return;
          c.style.transition = "transform 280ms cubic-bezier(0.16, 1, 0.3, 1)";
          c.style.transform = "translateY(0)";
        });

        setTimeout(() => {
          cardsBelow.forEach(c => {
            c.style.transition = "";
            c.style.transform = "";
          });
        }, 300);
      });

      updateCategoryCountsAndBadges();
      updateDishCountDisplay(currentCategoryDishes.length);
    }, 180);
  } else {
    renderDishesGrid();
    updateCategoryCountsAndBadges();
  }

  showNotification(`Dish "${dish.name}" deleted.`);

  if (!targetId.startsWith("temp_dish_")) {
    fetch(`/api/owner/items?id=${targetId}`, {
      method: "DELETE"
    })
    .then(res => res.json())
    .then(data => {
      if (!data.success) {
        dishes = prevDishes;
        renderDishesGrid();
        updateCategoryCountsAndBadges();
        showNotification(data.error || "Failed to delete dish.", "error");
      }
    })
    .catch(err => {
      dishes = prevDishes;
      renderDishesGrid();
      renderCategoriesList();
      showNotification("Network error deleting dish.", "error");
    });
  }
}

// Dish event listeners
if (openAddDishBtn) openAddDishBtn.addEventListener("click", createBlankDishRow);
if (emptyStateAddDishBtn) emptyStateAddDishBtn.addEventListener("click", createBlankDishRow);
if (closeDishModalBtn) closeDishModalBtn.addEventListener("click", closeDishModal);
if (cancelDishBtn) cancelDishBtn.addEventListener("click", closeDishModal);

/**
 * Dish Search Bar Functions & Event Listeners
 */
function ensureDishSearchBarExists() {
  let container = document.getElementById("dishSearchBarContainer");
  if (!container) {
    const dishesBox = document.querySelector(".dishes-container-box");
    const dishesActionRow = document.querySelector(".dishes-action-row");
    if (dishesBox && dishesActionRow) {
      container = document.createElement("div");
      container.id = "dishSearchBarContainer";
      container.className = "dish-search-bar-container";
      container.innerHTML = `
        <div class="dish-search-bar-inner">
          <svg class="dish-search-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" id="dishSearchInput" class="dish-search-input" placeholder="Search menu items..." autocomplete="off" spellcheck="false" aria-label="Search menu items" enterkeyhint="search">
          <button type="button" id="dishSearchClearBtn" class="dish-search-clear-btn" aria-label="Clear search or close" title="Clear / Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      `;
      dishesBox.insertBefore(container, dishesActionRow);
      setupDishSearchInputListeners();
    }
  }
  return container;
}

function openDishSearchBar() {
  const container = ensureDishSearchBarExists();
  const toggleBtn = document.getElementById("dishSearchToggleBtn");
  const input = document.getElementById("dishSearchInput");
  if (!container) return;
  isDishSearchOpen = true;
  container.classList.add("is-expanded");
  if (toggleBtn) {
    toggleBtn.classList.add("is-active");
    toggleBtn.setAttribute("aria-expanded", "true");
  }
  if (input) {
    setTimeout(() => {
      if (isDishSearchOpen) {
        input.focus({ preventScroll: true });
      }
    }, 360);
  }
}

function closeDishSearchBar(clearQuery = true) {
  const container = document.getElementById("dishSearchBarContainer");
  const toggleBtn = document.getElementById("dishSearchToggleBtn");
  const input = document.getElementById("dishSearchInput");
  if (!container) return;
  isDishSearchOpen = false;
  if (input) input.blur();
  container.classList.remove("is-expanded");
  if (toggleBtn) {
    toggleBtn.classList.remove("is-active");
    toggleBtn.setAttribute("aria-expanded", "false");
  }
  if (clearQuery) {
    if (input) input.value = "";
    dishSearchQuery = "";
    renderDishesGrid();
  }
}

function toggleDishSearchBar() {
  if (isDishSearchOpen) {
    const input = document.getElementById("dishSearchInput");
    if (!input || !input.value.trim()) {
      closeDishSearchBar(true);
    } else {
      input.focus();
    }
  } else {
    openDishSearchBar();
  }
}

function handleSearchCrossClick() {
  const input = document.getElementById("dishSearchInput");
  if (!input) return;
  if (input.value.length > 0) {
    // If has text: clear the text
    input.value = "";
    dishSearchQuery = "";
    renderDishesGrid();
    input.focus();
  } else {
    // If already empty: clicking again minimizes the search bar
    closeDishSearchBar(true);
  }
}

function setupDishSearchInputListeners() {
  const clearBtn = document.getElementById("dishSearchClearBtn");
  if (clearBtn && !clearBtn._hasSearchListener) {
    clearBtn._hasSearchListener = true;
    clearBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      handleSearchCrossClick();
    });
  }

  const input = document.getElementById("dishSearchInput");
  if (input && !input._hasSearchListener) {
    input._hasSearchListener = true;
    input.addEventListener("input", (e) => {
      dishSearchQuery = e.target.value;
      renderDishesGrid();
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.keyCode === 13) {
        e.preventDefault();
        input.blur();
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleSearchCrossClick();
      }
    });
    input.addEventListener("keyup", (e) => {
      if (e.key === "Enter" || e.keyCode === 13) {
        e.preventDefault();
        input.blur();
      }
    });
  }
}

if (dishSearchToggleBtn) {
  dishSearchToggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleDishSearchBar();
  });
}

setupDishSearchInputListeners();

// Backdrop click and touch prevention for modals
[categoryModal, dishModal, logoutModal, deleteCategoryModal, selectCategoryAlertModal, todaySpecialInfoModal].forEach(modal => {
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
      if (modal === deleteCategoryModal) closeDeleteCategoryModal();
      if (modal === selectCategoryAlertModal) closeSelectCategoryAlertModal();
      if (modal === todaySpecialInfoModal) closeTodaySpecialInfoModal();
    }
  });
});

// Escape key to close any active modal or drawer
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const isModalActive = (m) => m && m.style.display === "flex" && !m.classList.contains("closing");
    const lm = document.getElementById("logoutModal");
    if (isModalActive(selectCategoryAlertModal)) {
      closeSelectCategoryAlertModal();
    } else if (isModalActive(deleteCategoryModal)) {
      closeDeleteCategoryModal();
    } else if (isModalActive(lm)) {
      closeLogoutModal();
    } else if (isModalActive(categoryModal)) {
      closeCategoryModal();
    } else if (isModalActive(dishModal)) {
      closeDishModal();
    } else if (isModalActive(todaySpecialInfoModal)) {
      closeTodaySpecialInfoModal();
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

        if (typeof updateQrStandPanels === "function") {
          updateQrStandPanels();
        }

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

// ==========================================================================
// 7. QR Code View Functions
// ==========================================================================
let qrCodeInstance = null;

function isColorDark(hex) {
  if (!hex || typeof hex !== "string") return false;
  const clean = hex.replace("#", "").trim();
  if (clean.length !== 6) return false;
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return yiq < 140;
}

function getBusinessLogoUrl() {
  const rawLogo = (currentBusiness && currentBusiness.branding && currentBusiness.branding.logoUrl) ||
                  (currentBusiness && currentBusiness.logoUrl) ||
                  (typeof brandingUploadedLogoData === "string" ? brandingUploadedLogoData : "") || "";
  return (typeof rawLogo === "string") ? rawLogo.trim() : "";
}

function blendBlackOverlay(hexColor, blackOpacity = 0.25) {
  if (!hexColor || typeof hexColor !== "string") return "#821A27";
  let hex = hexColor.replace("#", "").trim();
  if (hex.length === 3) {
    hex = hex.split("").map(c => c + c).join("");
  }
  if (hex.length !== 6) return hexColor;
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return hexColor;

  const factor = 1 - blackOpacity;
  const newR = Math.min(255, Math.max(0, Math.round(r * factor)));
  const newG = Math.min(255, Math.max(0, Math.round(g * factor)));
  const newB = Math.min(255, Math.max(0, Math.round(b * factor)));

  return `#${newR.toString(16).padStart(2, "0")}${newG.toString(16).padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
}

function updateQrStandPanels() {
  const mockup = document.getElementById("qrStandMockup");
  if (!mockup) return;
  const qrBox = mockup.querySelector(".qr-stand-qr-box");
  if (qrBox) {
    const mockupRect = mockup.getBoundingClientRect();
    const qrRect = qrBox.getBoundingClientRect();
    if (mockupRect.height > 0 && qrRect.height > 0) {
      const splitFromBottom = mockupRect.bottom - (qrRect.top + qrRect.height / 2);
      mockup.style.setProperty("--qr-split-from-bottom", `${splitFromBottom.toFixed(2)}px`);
      mockup.style.setProperty("--qr-box-half-height", `${(qrRect.height / 2).toFixed(2)}px`);
    }
  }

  // Top panel = color of the bg of public menu page
  const menuBgColor = (currentBgColor || (currentBusiness && currentBusiness.branding && currentBusiness.branding.backgroundColor) || "#FBEFE1");
  // Bottom panel = color of the top bar of public menu page
  const topBarColor = (currentTopColor || (currentBusiness && currentBusiness.branding && currentBusiness.branding.accentColor) || "#991E2E");

  mockup.style.setProperty("--qr-top-panel-bg", menuBgColor);
  mockup.style.setProperty("--qr-bottom-panel-bg", topBarColor);

  const topPanel = document.getElementById("qrStandPanelTop");
  if (topPanel) topPanel.style.backgroundColor = menuBgColor;

  const botPanel = document.getElementById("qrStandPanelBottom");
  if (botPanel) botPanel.style.backgroundColor = topBarColor;

  // Auto contrast for header text based on top panel color
  const isDarkTop = isColorDark(menuBgColor);
  const titleColor = isDarkTop ? "#ffffff" : "#0f172a";
  const subtitleColor = isDarkTop ? "rgba(255, 255, 255, 0.82)" : "#475569";
  mockup.style.setProperty("--qr-header-title-color", titleColor);
  mockup.style.setProperty("--qr-header-subtitle-color", subtitleColor);

  // Business Name below QR code styled as per selected theme
  const bizName = (currentBusiness && currentBusiness.name) ? currentBusiness.name : "Royal Food Corner";
  const fontObj = (typeof THEME_FONTS !== "undefined" ? THEME_FONTS.find(f => f.id === currentNameFont) : null) || { family: "'Lobster', cursive, sans-serif" };
  const nameFontFamily = fontObj ? fontObj.family : "'Lobster', cursive, sans-serif";
  const nameColor = currentNameColor || "#FFFFFF";
  mockup.style.setProperty("--qr-biz-name-font", nameFontFamily);
  mockup.style.setProperty("--qr-biz-name-color", nameColor);
  mockup.style.setProperty("--qr-biz-name-stroke", "none");

  const qrBizName = document.getElementById("qrStandBizName");
  if (qrBizName) {
    qrBizName.textContent = bizName;
    qrBizName.style.setProperty("font-family", nameFontFamily, "important");
    qrBizName.style.setProperty("color", nameColor, "important");
    qrBizName.style.setProperty("-webkit-text-stroke", "none", "important");
    qrBizName.style.setProperty("paint-order", "normal", "important");
    qrBizName.style.setProperty("font-weight", (currentNameFont === "Google Sans") ? "700" : "400");
  }

  // Prioritise business logo over business name (matching public menu page top bar)
  const logoUrl = getBusinessLogoUrl();
  const qrStandLogo = document.getElementById("qrStandLogo");
  if (logoUrl) {
    if (qrStandLogo) {
      qrStandLogo.src = logoUrl;
      qrStandLogo.alt = (currentBusiness && currentBusiness.name) ? `${currentBusiness.name} Logo` : "Business Logo";
      qrStandLogo.style.display = "block";
      qrStandLogo.onerror = function() {
        qrStandLogo.style.display = "none";
        if (qrBizName) qrBizName.style.display = "block";
      };
    }
    if (qrBizName) {
      qrBizName.style.display = "none";
    }
  } else {
    if (qrStandLogo) {
      qrStandLogo.style.display = "none";
      qrStandLogo.src = "";
    }
    if (qrBizName) {
      qrBizName.style.display = "block";
    }
  }

  // Keep QR code color synchronized with the bottom panel color (with 25% black overlay on colored modules)
  const qrBarcodeColor = blendBlackOverlay(topBarColor, 0.25);
  if (qrCodeGraphic && currentBusiness && currentBusiness.slug) {
    if (qrCodeGraphic._currentColor !== qrBarcodeColor) {
      qrCodeGraphic._currentColor = qrBarcodeColor;
      const fullUrl = `${window.location.origin}/r/${currentBusiness.slug}`;
      qrCodeGraphic.innerHTML = "";
      if (typeof QRCode !== "undefined") {
        qrCodeInstance = new QRCode(qrCodeGraphic, {
          text: fullUrl,
          width: 260,
          height: 260,
          colorDark: qrBarcodeColor,
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H
        });
      }
    }
  }
}

window.addEventListener("resize", () => {
  if (qrCodeView && qrCodeView.style.display !== "none") {
    updateQrStandPanels();
  }
});

function renderQrCodeView() {
  const stickyQrActionBar = document.getElementById("stickyQrActionBar");
  if (stickyQrActionBar) {
    stickyQrActionBar.style.display = "flex";
  }
  if (!qrCodeGraphic) return;
  const slug = (currentBusiness && currentBusiness.slug) ? currentBusiness.slug : "";
  if (!slug) {
    qrCodeGraphic.innerHTML = '<p class="qrcode-loading-text">Loading menu link...</p>';
    if (qrCodeUrlText) qrCodeUrlText.textContent = "Loading link...";
    return;
  }

  const fullUrl = `${window.location.origin}/r/${slug}`;

  if (qrCodeUrlText) {
    qrCodeUrlText.textContent = fullUrl;
  }
  if (qrCodeOpenLink) {
    qrCodeOpenLink.href = fullUrl;
  }

  const topBarColor = (currentTopColor || (currentBusiness && currentBusiness.branding && currentBusiness.branding.accentColor) || "#991E2E");
  const qrBarcodeColor = blendBlackOverlay(topBarColor, 0.25);

  qrCodeGraphic.innerHTML = "";
  if (typeof QRCode !== "undefined") {
    qrCodeInstance = new QRCode(qrCodeGraphic, {
      text: fullUrl,
      width: 260,
      height: 260,
      colorDark: qrBarcodeColor,
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });
    qrCodeGraphic._currentColor = qrBarcodeColor;
  } else {
    qrCodeGraphic.innerHTML = '<p class="qrcode-loading-text">Generating QR Code...</p>';
  }
  requestAnimationFrame(updateQrStandPanels);
  setTimeout(updateQrStandPanels, 60);
}

function drawCanvasRoundRect(ctx, x, y, width, height, radii) {
  if (typeof ctx.roundRect === "function") {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radii);
    return;
  }
  let r = radii;
  let tl = 0, tr = 0, br = 0, bl = 0;
  if (typeof r === "number") {
    tl = tr = br = bl = r;
  } else if (Array.isArray(r)) {
    tl = r[0] || 0;
    tr = r[1] || tl;
    br = r[2] || tl;
    bl = r[3] || tr;
  }
  ctx.beginPath();
  ctx.moveTo(x + tl, y);
  ctx.lineTo(x + width - tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + tr);
  ctx.lineTo(x + width, y + height - br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - br, y + height);
  ctx.lineTo(x + bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - bl);
  ctx.lineTo(x, y + tl);
  ctx.quadraticCurveTo(x, y, x + tl, y);
  ctx.closePath();
}

async function downloadQrCode() {
  const slug = (currentBusiness && currentBusiness.slug) ? currentBusiness.slug : "";
  if (!slug) return;
  const fullUrl = `${window.location.origin}/r/${slug}`;

  const btn = document.getElementById("qrDownloadBtn");
  if (btn) {
    btn.style.pointerEvents = "none";
    btn.style.opacity = "0.75";
  }

  try {
    // Ensure all web fonts are loaded into memory before rendering
    if (document.fonts && document.fonts.ready) {
      try {
        await document.fonts.ready;
      } catch (e) {}
    }

    const mockup = document.getElementById("qrStandMockup");
    const titleEl = mockup ? mockup.querySelector(".qr-stand-title") : null;
    const subtitleEl = mockup ? mockup.querySelector(".qr-stand-subtitle") : null;
    const bizNameEl = mockup ? document.getElementById("qrStandBizName") : null;
    const qrStandLogoEl = mockup ? document.getElementById("qrStandLogo") : null;
    const qrBoxEl = mockup ? mockup.querySelector(".qr-stand-qr-box") : null;
    const qrGraphicEl = document.getElementById("qrCodeGraphic");

    // Exact 4:6 card print resolution (4000 x 6000 px)
    const cardW = 4000;
    const cardH = 6000;

    // Determine scale directly from live on-screen card width
    const mockupRect = mockup ? mockup.getBoundingClientRect() : null;
    const screenW = (mockupRect && mockupRect.width > 0) ? mockupRect.width : 320;
    const scale = cardW / screenW;

    // Exact proportional font sizes from DOM computed styles
    const computedTitleSize = titleEl ? parseFloat(window.getComputedStyle(titleEl).fontSize) : 49.6;
    const computedSubtitleSize = subtitleEl ? parseFloat(window.getComputedStyle(subtitleEl).fontSize) : 18.4;
    const computedBizSize = bizNameEl ? parseFloat(window.getComputedStyle(bizNameEl).fontSize) : 24.8;

    const titleFontSize = Math.round(computedTitleSize * scale);
    const subtitleFontSize = Math.round(computedSubtitleSize * scale);
    let bizFontSize = Math.round(computedBizSize * scale);

    // Exact split position from live card
    let splitY = Math.round(cardH * (986 / 1800)); // 3287px
    if (mockupRect && qrBoxEl) {
      const qrBoxRect = qrBoxEl.getBoundingClientRect();
      if (qrBoxRect.height > 0) {
        splitY = Math.round(((qrBoxRect.top + qrBoxRect.height / 2) - mockupRect.top) * scale);
      }
    }
    const topH = splitY;
    const botH = cardH - splitY;

    // Themed colors
    const menuBgColor = (currentBgColor || (currentBusiness && currentBusiness.branding && currentBusiness.branding.backgroundColor) || "#FBEFE1");
    const topBarColor = (currentTopColor || (currentBusiness && currentBusiness.branding && currentBusiness.branding.accentColor) || "#991E2E");
    const isDarkTop = isColorDark(menuBgColor);
    const titleColor = (titleEl && window.getComputedStyle(titleEl).color) || (isDarkTop ? "#ffffff" : "#0f172a");
    const subtitleColor = (subtitleEl && window.getComputedStyle(subtitleEl).color) || (isDarkTop ? "rgba(255, 255, 255, 0.85)" : "#475569");

    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = cardW;
    exportCanvas.height = cardH;
    const ctx = exportCanvas.getContext("2d");

    // 1. Top Panel Background
    ctx.fillStyle = menuBgColor;
    ctx.fillRect(0, 0, cardW, topH + 1);

    // 2. Bottom Panel Background
    ctx.fillStyle = topBarColor;
    ctx.fillRect(0, splitY, cardW, botH);

    // 3. Header Text Positions
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    let titleY = Math.round(topH * 0.30);
    let subtitleY = Math.round(topH * 0.44);
    if (mockupRect && titleEl && subtitleEl) {
      const tRect = titleEl.getBoundingClientRect();
      const sRect = subtitleEl.getBoundingClientRect();
      if (tRect.height > 0) titleY = Math.round(((tRect.top + tRect.height / 2) - mockupRect.top) * scale);
      if (sRect.height > 0) subtitleY = Math.round(((sRect.top + sRect.height / 2) - mockupRect.top) * scale);
    }

    // "MENU"
    ctx.font = `900 ${titleFontSize}px 'Google Sans', -apple-system, BlinkMacSystemFont, sans-serif`;
    ctx.fillStyle = titleColor;
    if ("letterSpacing" in ctx) {
      ctx.letterSpacing = `${(0.04 * titleFontSize).toFixed(1)}px`;
    }
    ctx.fillText("MENU", cardW / 2, titleY);

    // "Scan here to get our menu"
    ctx.font = `400 ${subtitleFontSize}px 'Google Sans', -apple-system, BlinkMacSystemFont, sans-serif`;
    ctx.fillStyle = subtitleColor;
    if ("letterSpacing" in ctx) {
      ctx.letterSpacing = "0px";
    }
    ctx.fillText("Scan here to get our menu", cardW / 2, subtitleY);

    // 4. QR Box Card (White rounded card matching screen box)
    let qrBoxW = Math.round(220 * scale); // ~825px
    let qrBoxH = qrBoxW;
    let qrBoxX = (cardW - qrBoxW) / 2;
    let qrBoxY = splitY - (qrBoxH / 2);
    let qrBoxRadius = Math.round(14 * scale); // ~52px

    if (mockupRect && qrBoxEl) {
      const qRect = qrBoxEl.getBoundingClientRect();
      if (qRect.width > 0 && qRect.height > 0) {
        qrBoxW = Math.round(qRect.width * scale);
        qrBoxH = Math.round(qRect.height * scale);
        qrBoxX = (cardW - qrBoxW) / 2;
        qrBoxY = Math.round((qRect.top - mockupRect.top) * scale);
        const computedR = parseFloat(window.getComputedStyle(qrBoxEl).borderRadius || "14");
        qrBoxRadius = Math.round(computedR * scale);
      }
    }

    // QR Box Soft Drop Shadow
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.10)";
    ctx.shadowBlur = Math.round(10 * scale);
    ctx.shadowOffsetY = Math.round(4 * scale);
    drawCanvasRoundRect(ctx, qrBoxX, qrBoxY, qrBoxW, qrBoxH, qrBoxRadius);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.restore();

    // QR Box Border
    drawCanvasRoundRect(ctx, qrBoxX, qrBoxY, qrBoxW, qrBoxH, qrBoxRadius);
    ctx.strokeStyle = "#9ca3af";
    ctx.lineWidth = Math.max(3, Math.round(2 * scale));
    ctx.stroke();

    // 5. Render Crisp High-Resolution QR Barcode
    const qrPadding = Math.round(12 * scale);
    const qrDimension = qrBoxW - (qrPadding * 2);
    const qrX = qrBoxX + qrPadding;
    const qrY = qrBoxY + qrPadding;

    const tempDiv = document.createElement("div");
    tempDiv.style.position = "fixed";
    tempDiv.style.left = "-99999px";
    tempDiv.style.top = "-99999px";
    document.body.appendChild(tempDiv);

    try {
      const qrBarcodeColor = blendBlackOverlay(topBarColor, 0.25);
      if (typeof QRCode !== "undefined") {
        new QRCode(tempDiv, {
          text: fullUrl,
          width: qrDimension,
          height: qrDimension,
          colorDark: qrBarcodeColor,
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H
        });
      }

      const qrSource = tempDiv.querySelector("canvas") || tempDiv.querySelector("img") || (qrCodeGraphic && (qrCodeGraphic.querySelector("canvas") || qrCodeGraphic.querySelector("img")));
      if (qrSource) {
        ctx.save();
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(qrSource, qrX, qrY, qrDimension, qrDimension);
        ctx.restore();
      }
    } finally {
      if (tempDiv.parentNode) {
        tempDiv.parentNode.removeChild(tempDiv);
      }
    }

    // 6. Footer: Prioritise Business Logo over Business Name (same as public menu top bar & mockup)
    const logoUrl = getBusinessLogoUrl();
    const qrBoxBottom = qrBoxY + qrBoxH;
    let footerCenterY = qrBoxBottom + Math.round((cardH - qrBoxBottom) / 2);
    if (mockupRect) {
      const activeFooterEl = (logoUrl && qrStandLogoEl && qrStandLogoEl.style.display !== "none") ? qrStandLogoEl : bizNameEl;
      if (activeFooterEl) {
        const bRect = activeFooterEl.getBoundingClientRect();
        if (bRect.height > 0) {
          footerCenterY = Math.round(((bRect.top + bRect.height / 2) - mockupRect.top) * scale);
        }
      }
    }

    let logoDrawn = false;
    if (logoUrl) {
      try {
        const loadedImg = await new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          let done = false;
          const finish = (res) => {
            if (!done) {
              done = true;
              resolve(res);
            }
          };
          img.onload = () => finish(img);
          img.onerror = () => finish(null);
          img.src = logoUrl;
          if (img.complete && img.naturalWidth) finish(img);
          setTimeout(() => finish(null), 3000);
        });

        if (loadedImg && loadedImg.naturalWidth > 0 && loadedImg.naturalHeight > 0) {
          let canExport = true;
          try {
            const probe = document.createElement("canvas");
            probe.width = 1;
            probe.height = 1;
            const pCtx = probe.getContext("2d");
            pCtx.drawImage(loadedImg, 0, 0, 1, 1);
            probe.toDataURL();
          } catch (corsErr) {
            canExport = false;
          }

          if (canExport) {
            let drawW, drawH, logoY;
            const logoRect = (mockupRect && qrStandLogoEl && qrStandLogoEl.style.display !== "none") ? qrStandLogoEl.getBoundingClientRect() : null;

            if (logoRect && logoRect.width > 0 && logoRect.height > 0) {
              // Exact proportional size matching the on-screen preview
              drawW = Math.round(logoRect.width * scale);
              drawH = Math.round(logoRect.height * scale);
              const logoCenterScreenY = (logoRect.top + logoRect.height / 2) - mockupRect.top;
              logoY = Math.round(logoCenterScreenY * scale - (drawH / 2));
            } else {
              // Proportional fallback based on CSS max-width: 70% and max-height: 50% of footer
              const footerAvailH = Math.max(60, cardH - qrBoxBottom);
              const maxLogoW = Math.round(cardW * 0.70);
              const maxLogoH = Math.round(footerAvailH * 0.50);
              const fitRatio = Math.min(maxLogoW / loadedImg.naturalWidth, maxLogoH / loadedImg.naturalHeight);
              drawW = Math.round(loadedImg.naturalWidth * fitRatio);
              drawH = Math.round(loadedImg.naturalHeight * fitRatio);
              logoY = Math.round(footerCenterY - (drawH / 2));
            }

            const logoX = Math.round((cardW - drawW) / 2);

            ctx.save();
            ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
            ctx.shadowBlur = Math.round(6 * scale);
            ctx.shadowOffsetY = Math.round(2 * scale);
            ctx.drawImage(loadedImg, logoX, logoY, drawW, drawH);
            ctx.restore();
            logoDrawn = true;
          }
        }
      } catch (err) {
        console.warn("Logo export skipped, falling back to name:", err);
      }
    }

    if (!logoDrawn) {
      const bizName = (currentBusiness && currentBusiness.name) ? currentBusiness.name : "Royal Food Corner";
      const fontObj = (typeof THEME_FONTS !== "undefined" ? THEME_FONTS.find(f => f.id === currentNameFont) : null) || { family: "'Lobster', cursive, sans-serif" };
      const nameFontFamily = fontObj ? fontObj.family : "'Lobster', cursive, sans-serif";
      const nameColor = currentNameColor || "#FFFFFF";

      ctx.font = `${(currentNameFont === "Google Sans") ? "700" : "400"} ${bizFontSize}px ${nameFontFamily}`;
      const bizMeasure = ctx.measureText(bizName).width;
      const maxBizW = Math.round(cardW * 0.88);
      if (bizMeasure > maxBizW) {
        bizFontSize = Math.floor(bizFontSize * (maxBizW / bizMeasure));
        ctx.font = `${(currentNameFont === "Google Sans") ? "700" : "400"} ${bizFontSize}px ${nameFontFamily}`;
      }

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      if ("letterSpacing" in ctx) {
        ctx.letterSpacing = `${(0.5 * scale).toFixed(1)}px`;
      }

      ctx.fillStyle = nameColor;
      ctx.fillText(bizName, cardW / 2, footerCenterY);
    }

    // 7. Export High-Quality JPG (4000 x 6000 px)
    const dataUrl = exportCanvas.toDataURL("image/jpeg", 0.98);
    const a = document.createElement("a");
    a.download = `${slug}-qr-card.jpg`;
    a.href = dataUrl;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } finally {
    if (btn) {
      btn.style.pointerEvents = "";
      btn.style.opacity = "";
    }
  }
}

function copyQrLink(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  if (e && e.preventDefault) e.preventDefault();
  const slug = (currentBusiness && currentBusiness.slug) ? currentBusiness.slug : "";
  if (!slug) return;
  const fullUrl = `${window.location.origin}/r/${slug}`;

  const setBtnSuccess = () => {
    if (qrCopyBtnText) {
      const orig = qrCopyBtnText.textContent;
      qrCopyBtnText.textContent = "Copied!";
      setTimeout(() => {
        qrCopyBtnText.textContent = orig;
      }, 2000);
    }
    if (qrCopyLinkBtn) {
      qrCopyLinkBtn.classList.add("is-copied");
      qrCopyLinkBtn.setAttribute("title", "Copied!");
      setTimeout(() => {
        qrCopyLinkBtn.classList.remove("is-copied");
        qrCopyLinkBtn.setAttribute("title", "Copy Link");
      }, 2000);
    }
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(fullUrl).then(setBtnSuccess).catch(() => {
      fallbackCopyText(fullUrl);
      setBtnSuccess();
    });
  } else {
    fallbackCopyText(fullUrl);
    setBtnSuccess();
  }
}

function fallbackCopyText(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand("copy");
  } catch (err) {}
  document.body.removeChild(textArea);
}

if (qrDownloadBtn) {
  qrDownloadBtn.addEventListener("click", downloadQrCode);
}

if (qrCopyLinkBtn) {
  qrCopyLinkBtn.addEventListener("click", copyQrLink);
}

/* ==========================================================================
   Theme Colors (Public Menu Brand Accent & Background)
   ========================================================================== */
const themeMockupWrapper = document.getElementById("themeMockupWrapper");
const themeMockupTopbar = document.getElementById("themeMockupTopbar");
const themeMockupBizName = document.getElementById("themeMockupBizName");
const themeMockupBody = document.getElementById("themeMockupBody");
const themeMockupPrice = document.getElementById("themeMockupPrice");
const themeMockupBtn = document.getElementById("themeMockupBtn");
const themeMockupCatHeading = document.getElementById("themeMockupCatHeading");
const themeMockupDots = document.getElementById("themeMockupDots");
const themeSwatchesGrid = document.getElementById("themeSwatchesGrid");

// Custom Top Bar color elements
const themeTopColorNativeInput = document.getElementById("themeTopColorNativeInput");
const themeTopColorIndicator = document.getElementById("themeTopColorIndicator");
const themeTopHexInput = document.getElementById("themeTopHexInput");

// Custom Main Background color elements
const themeBgColorNativeInput = document.getElementById("themeBgColorNativeInput");
const themeBgColorIndicator = document.getElementById("themeBgColorIndicator");
const themeBgHexInput = document.getElementById("themeBgHexInput");

// Custom Business Name Text color elements
const themeNameColorNativeInput = document.getElementById("themeNameColorNativeInput");
const themeNameColorIndicator = document.getElementById("themeNameColorIndicator");
const themeNameHexInput = document.getElementById("themeNameHexInput");

// Custom Menu Items Text color elements
const themeItemColorNativeInput = document.getElementById("themeItemColorNativeInput");
const themeItemColorIndicator = document.getElementById("themeItemColorIndicator");
const themeItemHexInput = document.getElementById("themeItemHexInput");

// Custom Price color elements
const themePriceColorNativeInput = document.getElementById("themePriceColorNativeInput");
const themePriceColorIndicator = document.getElementById("themePriceColorIndicator");
const themePriceHexInput = document.getElementById("themePriceHexInput");

// Custom Category Title color elements
const themeCategoryColorNativeInput = document.getElementById("themeCategoryColorNativeInput");
const themeCategoryColorIndicator = document.getElementById("themeCategoryColorIndicator");
const themeCategoryHexInput = document.getElementById("themeCategoryHexInput");

// Custom Scroll Points color elements
const themeScrollPointsColorNativeInput = document.getElementById("themeScrollPointsColorNativeInput");
const themeScrollPointsColorIndicator = document.getElementById("themeScrollPointsColorIndicator");
const themeScrollPointsHexInput = document.getElementById("themeScrollPointsHexInput");

const themeSaveBtn = document.getElementById("themeSaveBtn");
const themeSaveBtnLabel = document.getElementById("themeSaveBtnLabel");
const themeSaveSpinner = document.getElementById("themeSaveSpinner");
const themeResetBtn = document.getElementById("themeResetBtn");

// Save Preset Action elements
const themeSavePresetBtn = document.getElementById("themeSavePresetBtn");
const themeSavePresetBtnLabel = document.getElementById("themeSavePresetBtnLabel");
const themePaletteSlotsStatus = document.getElementById("themePaletteSlotsStatus");

const MAX_CUSTOM_PRESET_SLOTS = 5;
let savedCustomPresets = [];

function loadCustomPresetsFromBusiness() {
  savedCustomPresets = [];
  const bizId = currentBusiness && (currentBusiness.id || currentBusiness._id);

  // Clear any legacy default cache from past testing so it never leaks presets to new accounts
  try {
    localStorage.removeItem("menucard_custom_presets_default");
  } catch(e) {}

  if (currentBusiness && currentBusiness.branding && Array.isArray(currentBusiness.branding.customPresets)) {
    currentBusiness.branding.customPresets.forEach((p, idx) => {
      const slot = (typeof p.slotIndex === "number" && p.slotIndex >= 0 && p.slotIndex < MAX_CUSTOM_PRESET_SLOTS) ? p.slotIndex : idx;
      if (slot < MAX_CUSTOM_PRESET_SLOTS && !isExactDefaultThemePalette(p)) savedCustomPresets[slot] = p;
    });
  } else if (bizId) {
    try {
      const cacheKey = "menucard_custom_presets_" + bizId;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          parsed.forEach((p, idx) => {
            if (p && idx < MAX_CUSTOM_PRESET_SLOTS && !isExactDefaultThemePalette(p)) savedCustomPresets[idx] = p;
          });
        }
      }
    } catch(e) {}
  }
}

function isExactDefaultThemePalette(preset) {
  const top = (preset ? preset.top : currentTopColor) || "";
  const bg = (preset ? preset.bg : currentBgColor) || "";
  const name = (preset ? preset.name : currentNameColor) || "";
  const item = (preset ? preset.item : currentItemTextColor) || "";
  const price = (preset ? preset.price : currentPriceColor) || "";
  const category = (preset ? preset.category : currentCategoryColor) || "";
  const scroll = (preset ? preset.scroll : currentScrollPointsColor) || "";

  return (
    top.trim().toUpperCase() === "#991E2E" &&
    bg.trim().toUpperCase() === "#FBEFE1" &&
    (name.trim().toUpperCase() === "#FFFFFF" || name.trim().toUpperCase() === "#63141E") &&
    (!item || item.trim().toUpperCase() === "#000000") &&
    (!price || price.trim().toUpperCase() === "#731723") &&
    (!category || category.trim().toUpperCase() === "#D05A00") &&
    (!scroll || scroll.trim().toUpperCase() === "#731723")
  );
}

async function persistCustomPresets() {
  const cleanList = [];
  for (let i = 0; i < MAX_CUSTOM_PRESET_SLOTS; i++) {
    if (savedCustomPresets[i]) {
      cleanList.push(savedCustomPresets[i]);
    }
  }

  const bizId = currentBusiness && (currentBusiness.id || currentBusiness._id);
  if (bizId) {
    try {
      const cacheKey = "menucard_custom_presets_" + bizId;
      localStorage.setItem(cacheKey, JSON.stringify(savedCustomPresets));
    } catch(e) {}

    if (!currentBusiness.branding) currentBusiness.branding = {};
    currentBusiness.branding.customPresets = cleanList;
    try {
      fetch("/api/owner/business", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customPresets: cleanList })
      }).catch(err => console.error("Error saving custom presets:", err));
    } catch(e) {}
  }
  updatePaletteSlotsStatus();
}

function updatePaletteSlotsStatus() {
  if (!themePaletteSlotsStatus) return;
  let count = 0;
  for (let i = 0; i < MAX_CUSTOM_PRESET_SLOTS; i++) {
    if (savedCustomPresets[i]) count++;
  }
  themePaletteSlotsStatus.textContent = `${count} of ${MAX_CUSTOM_PRESET_SLOTS} slots saved`;
}

function saveCurrentPresetToSlot(slotIdx) {
  if (isExactDefaultThemePalette()) {
    if (typeof showToast === "function") {
      showToast("Default theme color palette cannot be saved as a preset.", "warning");
    } else {
      alert("Default theme color palette cannot be saved as a preset.");
    }
    return;
  }

  if (slotIdx === undefined || slotIdx === null || slotIdx < 0) {
    let found = -1;
    for (let i = 0; i < MAX_CUSTOM_PRESET_SLOTS; i++) {
      if (!savedCustomPresets[i]) {
        found = i;
        break;
      }
    }
    if (found === -1) {
      if (typeof showToast === "function") {
        showToast(`All ${MAX_CUSTOM_PRESET_SLOTS} preset slots are full. Delete a preset to free up a slot.`, "warning");
      } else {
        alert(`All ${MAX_CUSTOM_PRESET_SLOTS} preset slots are full. Delete a preset to free up a slot.`);
      }
      return;
    }
    slotIdx = found;
  }

  const newPreset = {
    slotIndex: slotIdx,
    label: `Custom Preset ${slotIdx + 1}`,
    top: currentTopColor,
    bg: currentBgColor,
    name: currentNameColor,
    item: currentItemTextColor,
    price: currentPriceColor,
    category: currentCategoryColor,
    scroll: currentScrollPointsColor,
    font: currentNameFont
  };

  savedCustomPresets[slotIdx] = newPreset;
  persistCustomPresets();
  renderThemeSwatches();

  if (themeSavePresetBtnLabel) {
    const orig = themeSavePresetBtnLabel.textContent;
    themeSavePresetBtnLabel.textContent = `Saved to Slot ${slotIdx + 1}!`;
    setTimeout(() => { themeSavePresetBtnLabel.textContent = orig; }, 1500);
  }
  if (typeof showToast === "function") {
    showToast(`Preset saved to Slot ${slotIdx + 1}!`, "success");
  }
}

function deleteCustomPreset(slotIdx) {
  delete savedCustomPresets[slotIdx];
  persistCustomPresets();
  renderThemeSwatches();
  if (typeof showToast === "function") {
    showToast(`Preset deleted from Slot ${slotIdx + 1}`, "info");
  }
}

const THEME_PALETTES = [
  {
    label: "Crimson & Dark Pine (Berkshire Swash)",
    top: "#A52228",
    bg: "#0B413B",
    name: "#EED02D",
    item: "#D1FFE7",
    price: "#FFA200",
    category: "#FFFFFF",
    scroll: "#FFFFFF",
    font: "Berkshire Swash"
  },
  {
    label: "Vintage Bourbon (Sand & Amber)",
    top: "#6F4F2A",
    bg: "#E1DCC1",
    name: "#FFECA8",
    item: "#2B2218",
    price: "#8A3305",
    category: "#945624",
    scroll: "#6F481B",
    font: "Rye"
  },
  {
    label: "Emerald Grove (Teal & Parchment)",
    top: "#087860",
    bg: "#FDF0DA",
    name: "#E5FFF9",
    item: "#1A1A1A",
    price: "#9F2B01",
    category: "#E66300",
    scroll: "#6F481B",
    font: "DM Serif Display"
  },
  {
    label: "Royal Purple (Violet & Gold)",
    top: "#4C0983",
    bg: "#FFFFFF",
    name: "#FFDC03",
    item: "#1A1A1A",
    price: "#642991",
    category: "#EA7F00",
    scroll: "#4C0983",
    font: "Kaushan Script"
  },
  {
    label: "Botanical Forest (Pine & Lime)",
    top: "#125524",
    bg: "#E4F4C7",
    name: "#EED02D",
    item: "#000000",
    price: "#006118",
    category: "#737F15",
    scroll: "#206030",
    font: "Bebas Neue"
  },
  {
    label: "Midnight Charcoal (Neon Tangerine)",
    top: "#272C2C",
    bg: "#0C0F17",
    name: "#FF8442",
    item: "#E6E6E6",
    price: "#FFA552",
    category: "#E8D611",
    scroll: "#A6A6A6",
    font: "Sacramento"
  },
  {
    label: "Ocean Azure (Marine & Ice)",
    top: "#0285D0",
    bg: "#0E3953",
    name: "#FFFFFF",
    item: "#FFFFFF",
    price: "#6BCEFF",
    category: "#FFC64D",
    scroll: "#6F99B3",
    font: "Google Sans"
  },
  {
    label: "Velvet Rose (Berry & Plum)",
    top: "#CA5C82",
    bg: "#392244",
    name: "#FFE0EB",
    item: "#FFFFFF",
    price: "#F99FBF",
    category: "#FF9747",
    scroll: "#BB778F",
    font: "DM Serif Display"
  },
  {
    label: "Fiesta Spice (Chili & Saffron)",
    top: "#CB2E06",
    bg: "#FFDA47",
    name: "#FFFFFF",
    item: "#000000",
    price: "#931017",
    category: "#B81F28",
    scroll: "#907E6A",
    font: "Lobster"
  },
  {
    label: "Emerald Speakeasy (Velvet & Brass)",
    top: "#022C22",
    bg: "#03140F",
    name: "#34D399",
    item: "#F0FDF4",
    price: "#FBBF24",
    category: "#34D399",
    scroll: "#FBBF24",
    font: "Rye"
  }
];

const THEME_FONTS = [
  { id: "Lobster", name: "Lobster", family: "'Lobster', cursive, sans-serif" },
  { id: "Bebas Neue", name: "Bebas Neue", family: "'Bebas Neue', sans-serif" },
  { id: "Google Sans", name: "Google Sans", family: "'Google Sans', sans-serif" },
  { id: "Berkshire Swash", name: "Berkshire Swash", family: "'Berkshire Swash', cursive, serif" },
  { id: "Kaushan Script", name: "Kaushan Script", family: "'Kaushan Script', cursive" },
  { id: "DM Serif Display", name: "DM Serif Display", family: "'DM Serif Display', serif" },
  { id: "Rye", name: "Rye", family: "'Rye', cursive, serif" },
  { id: "Sacramento", name: "Sacramento", family: "'Sacramento', cursive" }
];

let currentTopColor = "#991E2E";
let savedTopColor = "#991E2E";
let currentBgColor = "#FBEFE1";
let savedBgColor = "#FBEFE1";
let currentNameColor = "#FFFFFF";
let savedNameColor = "#FFFFFF";
let isCustomNameColor = false;
let currentItemTextColor = "#000000";
let savedItemTextColor = "#000000";
let isCustomItemTextColor = false;
let currentPriceColor = "#731723";
let savedPriceColor = "#731723";
let isCustomPriceColor = false;
let currentCategoryColor = "#D05A00";
let savedCategoryColor = "#D05A00";
let isCustomCategoryColor = false;
let currentScrollPointsColor = "#731723";
let savedScrollPointsColor = "#731723";
let isCustomScrollPointsColor = false;
let currentNameFont = "Lobster";
let savedNameFont = "Lobster";

function normalizeHexColor(val) {
  if (!val) return "";
  let clean = String(val).trim().replace(/^#/, "");
  if (clean.length === 3) {
    clean = clean.split("").map(c => c + c).join("");
  }
  if (/^[0-9A-Fa-f]{6}$/.test(clean)) {
    return "#" + clean.toUpperCase();
  }
  return "";
}

function applyBlackOverlay(hex, opacity = 0.25) {
  if (!hex || typeof hex !== "string") return hex;
  let clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    clean = clean.split("").map(c => c + c).join("");
  }
  if (!/^[0-9A-Fa-f]{6}$/.test(clean)) return hex;
  const num = parseInt(clean, 16);
  const r = Math.round(((num >> 16) & 255) * (1 - opacity));
  const g = Math.round(((num >> 8) & 255) * (1 - opacity));
  const b = Math.round((num & 255) * (1 - opacity));
  return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
}

function isLightColorHex(hex) {
  if (!hex || typeof hex !== "string") return false;
  let clean = hex.replace("#", "").trim();
  if (clean.length === 3) clean = clean.split("").map(c => c + c).join("");
  if (!/^[0-9A-Fa-f]{6}$/.test(clean)) return false;
  const num = parseInt(clean, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return yiq >= 160;
}

function updateThemeColorsUI(topHex, bgHex, nameHex, strokeVal = null, source = "all", itemHex = null, priceHex = null, categoryHex = null, scrollPointsHex = null) {
  if (typeof strokeVal === "string" && source === "all") {
    source = strokeVal;
    strokeVal = null;
  }

  const normTop = normalizeHexColor(topHex);
  const normBg = normalizeHexColor(bgHex);
  const normName = normalizeHexColor(nameHex);
  const normItem = normalizeHexColor(itemHex);
  const normPrice = normalizeHexColor(priceHex);
  const normCategory = normalizeHexColor(categoryHex);
  const normScroll = normalizeHexColor(scrollPointsHex);

  if (normTop) currentTopColor = normTop;
  if (normBg) currentBgColor = normBg;

  if (source === "swatch") {
    isCustomNameColor = true;
    currentNameColor = normName || applyBlackOverlay(currentTopColor, 0.25);
    if (normItem) {
      currentItemTextColor = normItem;
      isCustomItemTextColor = true;
    } else {
      currentItemTextColor = isLightColorHex(currentBgColor) ? "#000000" : "#FFFFFF";
      isCustomItemTextColor = false;
    }
    if (normPrice) {
      currentPriceColor = normPrice;
      isCustomPriceColor = true;
    } else {
      currentPriceColor = applyBlackOverlay(currentTopColor, 0.25);
      isCustomPriceColor = false;
    }
    if (normCategory) {
      currentCategoryColor = normCategory;
      isCustomCategoryColor = true;
    } else {
      currentCategoryColor = "#D05A00";
      isCustomCategoryColor = false;
    }
    if (normScroll) {
      currentScrollPointsColor = normScroll;
      isCustomScrollPointsColor = true;
    } else {
      currentScrollPointsColor = currentPriceColor || applyBlackOverlay(currentTopColor, 0.25);
      isCustomScrollPointsColor = false;
    }
  } else if (source === "nameNative" || source === "nameHex" || (source === "customPicker" && activeColorTarget === "name")) {
    if (normName) {
      currentNameColor = normName;
      isCustomNameColor = true;
    }
  } else if (source === "itemNative" || source === "itemHex" || (source === "customPicker" && activeColorTarget === "item")) {
    if (normItem) {
      currentItemTextColor = normItem;
      isCustomItemTextColor = true;
    }
  } else if (source === "priceNative" || source === "priceHex" || (source === "customPicker" && activeColorTarget === "price")) {
    if (normPrice) {
      currentPriceColor = normPrice;
      isCustomPriceColor = true;
    }
  } else if (source === "categoryNative" || source === "categoryHex" || (source === "customPicker" && activeColorTarget === "category")) {
    if (normCategory) {
      currentCategoryColor = normCategory;
      isCustomCategoryColor = true;
    }
  } else if (source === "scrollNative" || source === "scrollHex" || (source === "customPicker" && activeColorTarget === "scroll")) {
    if (normScroll) {
      currentScrollPointsColor = normScroll;
      isCustomScrollPointsColor = true;
    }
  } else if (source === "topNative" || source === "topHex" || (source === "customPicker" && activeColorTarget === "top")) {
    if (!isCustomNameColor) {
      currentNameColor = (currentTopColor.toUpperCase() === "#991E2E") ? "#FFFFFF" : applyBlackOverlay(currentTopColor, 0.25);
    }
    if (!isCustomPriceColor) {
      currentPriceColor = applyBlackOverlay(currentTopColor, 0.25);
    }
    if (!isCustomScrollPointsColor) {
      currentScrollPointsColor = applyBlackOverlay(currentTopColor, 0.25);
    }
  } else if (source === "bgNative" || source === "bgHex" || (source === "customPicker" && activeColorTarget === "bg")) {
    if (!isCustomItemTextColor) {
      currentItemTextColor = isLightColorHex(currentBgColor) ? "#000000" : "#FFFFFF";
    }
  } else if (source === "all") {
    if (normName) {
      currentNameColor = normName;
    } else if (!isCustomNameColor) {
      currentNameColor = (currentTopColor.toUpperCase() === "#991E2E") ? "#FFFFFF" : applyBlackOverlay(currentTopColor, 0.25);
    }
    if (normItem) {
      currentItemTextColor = normItem;
    }
    if (normPrice) {
      currentPriceColor = normPrice;
    } else if (!isCustomPriceColor) {
      currentPriceColor = applyBlackOverlay(currentTopColor, 0.25);
    }
    if (normCategory) {
      currentCategoryColor = normCategory;
    }
    if (normScroll) {
      currentScrollPointsColor = normScroll;
    } else if (!isCustomScrollPointsColor) {
      currentScrollPointsColor = currentPriceColor || applyBlackOverlay(currentTopColor, 0.25);
    }
  }

  const darkenedTop = applyBlackOverlay(currentTopColor, 0.25);
  const browseBtnColor = applyBlackOverlay(currentTopColor, 0.15);
  const fontObj = THEME_FONTS.find(f => f.id === currentNameFont) || THEME_FONTS[0];

  // Live preview mockup updates
  if (themeMockupTopbar) themeMockupTopbar.style.backgroundColor = currentTopColor;
  if (themeMockupBizName) {
    themeMockupBizName.style.setProperty("font-family", fontObj.family, "important");
    themeMockupBizName.style.setProperty("--preview-name-font", fontObj.family);
    const isGoogleSans = (currentNameFont === "Google Sans");
    themeMockupBizName.style.setProperty("font-weight", isGoogleSans ? "700" : "400", "important");
    themeMockupBizName.style.setProperty("--preview-name-font-weight", isGoogleSans ? "700" : "400");
    themeMockupBizName.style.setProperty("color", currentNameColor, "important");
    themeMockupBizName.style.setProperty("--preview-name-color", currentNameColor);

    themeMockupBizName.style.setProperty("-webkit-text-stroke", "none", "important");
    themeMockupBizName.style.setProperty("-webkit-text-stroke-width", "0px", "important");
    themeMockupBizName.style.setProperty("-webkit-text-stroke-color", "transparent", "important");
    themeMockupBizName.style.setProperty("paint-order", "normal", "important");
    themeMockupBizName.style.removeProperty("--preview-name-stroke");
  }
  if (themeMockupPrice) themeMockupPrice.style.color = currentPriceColor;
  if (themeMockupBtn) themeMockupBtn.style.backgroundColor = browseBtnColor;
  if (themeMockupWrapper) themeMockupWrapper.style.backgroundColor = "transparent";
  if (themeMockupCatHeading) {
    themeMockupCatHeading.style.color = currentCategoryColor;
    themeMockupCatHeading.style.borderColor = currentCategoryColor;
  }
  if (themeMockupBody) {
    themeMockupBody.style.backgroundColor = currentBgColor;
    themeMockupBody.style.setProperty("--preview-price-color", currentPriceColor);
    themeMockupBody.style.setProperty("--preview-item-color", currentItemTextColor);
    themeMockupBody.style.setProperty("--preview-category-color", currentCategoryColor);
    themeMockupBody.style.setProperty("--preview-scroll-points-color", currentScrollPointsColor);
  }
  document.querySelectorAll(".theme-mockup-dish-name").forEach(el => {
    el.style.color = currentItemTextColor;
  });
  document.querySelectorAll(".theme-mockup-dish-price").forEach(el => {
    el.style.color = currentPriceColor;
  });
  document.querySelectorAll(".theme-mockup-dot-leader").forEach(el => {
    el.style.borderBottomColor = currentItemTextColor;
  });
  document.querySelectorAll(".theme-mockup-dot").forEach(dot => {
    dot.style.backgroundColor = currentScrollPointsColor;
  });

  const phoneMockupStatusbar = document.getElementById("phoneMockupStatusbar");
  if (phoneMockupStatusbar) {
    phoneMockupStatusbar.style.color = isLightColorHex(currentTopColor) ? "#0f172a" : "#ffffff";
  }

  // Top Bar color picker inputs
  if (themeTopColorIndicator) themeTopColorIndicator.style.backgroundColor = currentTopColor;
  if (source !== "topNative" && themeTopColorNativeInput) {
    themeTopColorNativeInput.value = currentTopColor;
  }
  if (source !== "topHex" && themeTopHexInput) {
    themeTopHexInput.value = currentTopColor.replace("#", "");
  }

  // Background color picker inputs
  if (themeBgColorIndicator) themeBgColorIndicator.style.backgroundColor = currentBgColor;
  if (source !== "bgNative" && themeBgColorNativeInput) {
    themeBgColorNativeInput.value = currentBgColor;
  }
  if (source !== "bgHex" && themeBgHexInput) {
    themeBgHexInput.value = currentBgColor.replace("#", "");
  }

  // Business Name Text color picker inputs
  if (themeNameColorIndicator) themeNameColorIndicator.style.backgroundColor = currentNameColor;
  if (source !== "nameNative" && themeNameColorNativeInput) {
    themeNameColorNativeInput.value = currentNameColor;
  }
  if (source !== "nameHex" && themeNameHexInput) {
    themeNameHexInput.value = currentNameColor.replace("#", "");
  }

  // Menu Items Text color picker inputs
  if (themeItemColorIndicator) themeItemColorIndicator.style.backgroundColor = currentItemTextColor;
  if (source !== "itemNative" && themeItemColorNativeInput) {
    themeItemColorNativeInput.value = currentItemTextColor;
  }
  if (source !== "itemHex" && themeItemHexInput) {
    themeItemHexInput.value = currentItemTextColor.replace("#", "");
  }

  // Price color picker inputs
  if (themePriceColorIndicator) themePriceColorIndicator.style.backgroundColor = currentPriceColor;
  if (source !== "priceNative" && themePriceColorNativeInput) {
    themePriceColorNativeInput.value = currentPriceColor;
  }
  if (source !== "priceHex" && themePriceHexInput) {
    themePriceHexInput.value = currentPriceColor.replace("#", "");
  }

  // Category Title color picker inputs
  if (themeCategoryColorIndicator) themeCategoryColorIndicator.style.backgroundColor = currentCategoryColor;
  if (source !== "categoryNative" && themeCategoryColorNativeInput) {
    themeCategoryColorNativeInput.value = currentCategoryColor;
  }
  if (source !== "categoryHex" && themeCategoryHexInput) {
    themeCategoryHexInput.value = currentCategoryColor.replace("#", "");
  }

  // Scroll Points color picker inputs
  if (themeScrollPointsColorIndicator) themeScrollPointsColorIndicator.style.backgroundColor = currentScrollPointsColor;
  if (source !== "scrollNative" && themeScrollPointsColorNativeInput) {
    themeScrollPointsColorNativeInput.value = currentScrollPointsColor;
  }
  if (source !== "scrollHex" && themeScrollPointsHexInput) {
    themeScrollPointsHexInput.value = currentScrollPointsColor.replace("#", "");
  }

  // Update active swatch state
  if (themeSwatchesGrid) {
    const swatches = themeSwatchesGrid.querySelectorAll(".theme-swatch-card");
    swatches.forEach(swatch => {
      const swTop = swatch.getAttribute("data-top");
      const swBg = swatch.getAttribute("data-bg");
      const swName = swatch.getAttribute("data-name");
      const swItem = swatch.getAttribute("data-item");
      const swPrice = swatch.getAttribute("data-price");
      const swCat = swatch.getAttribute("data-category");
      const swScroll = swatch.getAttribute("data-scroll");
      const swFont = swatch.getAttribute("data-font");
      const matchesMain = (
        swTop && swBg && swName &&
        swTop.toUpperCase() === currentTopColor.toUpperCase() &&
        swBg.toUpperCase() === currentBgColor.toUpperCase() &&
        swName.toUpperCase() === currentNameColor.toUpperCase()
      );
      const matchesItemPrice = (
        (!swItem || swItem.toUpperCase() === currentItemTextColor.toUpperCase()) &&
        (!swPrice || swPrice.toUpperCase() === currentPriceColor.toUpperCase())
      );
      const matchesCatScroll = (
        (!swCat || swCat.toUpperCase() === currentCategoryColor.toUpperCase()) &&
        (!swScroll || swScroll.toUpperCase() === currentScrollPointsColor.toUpperCase())
      );
      const matchesFont = (!swFont || swFont === currentNameFont);
      if (matchesMain && matchesItemPrice && matchesCatScroll && matchesFont) {
        swatch.classList.add("active");
      } else {
        swatch.classList.remove("active");
      }
    });
  }

  // Check if modified compared to saved state
  const isChanged = (
    currentTopColor.toUpperCase() !== savedTopColor.toUpperCase() ||
    currentBgColor.toUpperCase() !== savedBgColor.toUpperCase() ||
    currentNameColor.toUpperCase() !== savedNameColor.toUpperCase() ||
    currentItemTextColor.toUpperCase() !== savedItemTextColor.toUpperCase() ||
    currentPriceColor.toUpperCase() !== savedPriceColor.toUpperCase() ||
    currentCategoryColor.toUpperCase() !== savedCategoryColor.toUpperCase() ||
    currentScrollPointsColor.toUpperCase() !== savedScrollPointsColor.toUpperCase() ||
    currentNameFont !== savedNameFont
  );
  if (themeSaveBtn) {
    themeSaveBtn.disabled = !isChanged;
  }

  // Check if current theme is already the default theme
  const isDefaultTheme = (
    currentTopColor.toUpperCase() === "#991E2E" &&
    currentBgColor.toUpperCase() === "#FBEFE1" &&
    (currentNameColor.toUpperCase() === "#FFFFFF" || currentNameColor.toUpperCase() === "#63141E") &&
    currentItemTextColor.toUpperCase() === "#000000" &&
    currentPriceColor.toUpperCase() === "#731723" &&
    currentCategoryColor.toUpperCase() === "#D05A00" &&
    currentScrollPointsColor.toUpperCase() === "#731723" &&
    currentNameFont === "Lobster"
  );
  if (themeResetBtn) {
    themeResetBtn.disabled = isDefaultTheme;
  }

  if (typeof updateQrStandPanels === "function") {
    updateQrStandPanels();
  }

  // Update Live Preview / Live Now status label
  updateThemePreviewHeaderLabel(isChanged);
}

function updateThemePreviewHeaderLabel(isChanged) {
  const label = document.getElementById("themePreviewHeaderLabel");
  if (!label) return;
  label.classList.toggle("is-live", !isChanged);
  label.classList.toggle("is-preview", isChanged);
}

function renderThemeSwatches() {
  if (!themeSwatchesGrid) return;
  themeSwatchesGrid.innerHTML = "";

  THEME_PALETTES.forEach((palette, idx) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "theme-swatch-card";
    card.setAttribute("data-top", palette.top);
    card.setAttribute("data-bg", palette.bg);
    card.setAttribute("data-name", palette.name);
    if (palette.item) card.setAttribute("data-item", palette.item);
    if (palette.price) card.setAttribute("data-price", palette.price);
    if (palette.category) card.setAttribute("data-category", palette.category);
    if (palette.scroll) card.setAttribute("data-scroll", palette.scroll);
    if (palette.font) card.setAttribute("data-font", palette.font);
    card.setAttribute("aria-label", palette.label || `Color Palette Preset ${idx + 1}`);
    card.setAttribute("title", palette.label || `Theme ${idx + 1}`);

    const isMatch = (
      palette.top.toUpperCase() === currentTopColor.toUpperCase() &&
      palette.bg.toUpperCase() === currentBgColor.toUpperCase() &&
      palette.name.toUpperCase() === currentNameColor.toUpperCase() &&
      (!palette.item || palette.item.toUpperCase() === currentItemTextColor.toUpperCase()) &&
      (!palette.price || palette.price.toUpperCase() === currentPriceColor.toUpperCase()) &&
      (!palette.category || palette.category.toUpperCase() === currentCategoryColor.toUpperCase()) &&
      (!palette.scroll || palette.scroll.toUpperCase() === currentScrollPointsColor.toUpperCase()) &&
      (!palette.font || palette.font === currentNameFont)
    );
    if (isMatch) {
      card.classList.add("active");
    }

    const barsContainer = document.createElement("span");
    barsContainer.className = "theme-swatch-bars";
    barsContainer.style.background = `linear-gradient(to bottom, ${palette.top} 0% 50%, ${palette.bg} 50% 100%)`;

    const colors = [
      palette.top,
      palette.bg
    ];
    colors.forEach(col => {
      const row = document.createElement("span");
      row.className = "theme-swatch-row";
      row.style.backgroundColor = col;
      barsContainer.appendChild(row);
    });

    card.appendChild(barsContainer);

    card.addEventListener("click", () => {
      if (palette.font) {
        selectThemeFont(palette.font);
      }
      updateThemeColorsUI(
        palette.top,
        palette.bg,
        palette.name,
        null,
        "swatch",
        palette.item,
        palette.price,
        palette.category,
        palette.scroll
      );
    });

    themeSwatchesGrid.appendChild(card);
  });

  // 5 Custom Preset Slots (1 row of 5)
  for (let slotIdx = 0; slotIdx < MAX_CUSTOM_PRESET_SLOTS; slotIdx++) {
    const customPreset = savedCustomPresets[slotIdx] || null;
    const card = document.createElement("button");
    card.type = "button";
    card.setAttribute("data-slot", slotIdx);

    if (customPreset) {
      card.className = "theme-swatch-card theme-swatch-custom";
      card.setAttribute("data-top", customPreset.top);
      card.setAttribute("data-bg", customPreset.bg);
      card.setAttribute("data-name", customPreset.name);
      if (customPreset.item) card.setAttribute("data-item", customPreset.item);
      if (customPreset.price) card.setAttribute("data-price", customPreset.price);
      if (customPreset.category) card.setAttribute("data-category", customPreset.category);
      if (customPreset.scroll) card.setAttribute("data-scroll", customPreset.scroll);
      if (customPreset.font) card.setAttribute("data-font", customPreset.font);
      card.setAttribute("aria-label", customPreset.label || `Custom Preset ${slotIdx + 1}`);
      card.setAttribute("title", `${customPreset.label || `Custom Preset ${slotIdx + 1}`} (Click to apply)`);

      const isMatch = (
        customPreset.top.toUpperCase() === currentTopColor.toUpperCase() &&
        customPreset.bg.toUpperCase() === currentBgColor.toUpperCase() &&
        customPreset.name.toUpperCase() === currentNameColor.toUpperCase() &&
        (!customPreset.item || customPreset.item.toUpperCase() === currentItemTextColor.toUpperCase()) &&
        (!customPreset.price || customPreset.price.toUpperCase() === currentPriceColor.toUpperCase()) &&
        (!customPreset.category || customPreset.category.toUpperCase() === currentCategoryColor.toUpperCase()) &&
        (!customPreset.scroll || customPreset.scroll.toUpperCase() === currentScrollPointsColor.toUpperCase()) &&
        (!customPreset.font || customPreset.font === currentNameFont)
      );
      if (isMatch) {
        card.classList.add("active");
      }

      const barsContainer = document.createElement("span");
      barsContainer.className = "theme-swatch-bars";
      barsContainer.style.background = `linear-gradient(to bottom, ${customPreset.top} 0% 50%, ${customPreset.bg} 50% 100%)`;

      const colors = [
        customPreset.top,
        customPreset.bg
      ];
      colors.forEach(col => {
        const row = document.createElement("span");
        row.className = "theme-swatch-row";
        row.style.backgroundColor = col;
        barsContainer.appendChild(row);
      });
      card.appendChild(barsContainer);

      // Delete custom preset button
      const delBtn = document.createElement("span");
      delBtn.className = "theme-swatch-delete-btn";
      delBtn.title = "Delete this custom preset";
      delBtn.setAttribute("role", "button");
      delBtn.setAttribute("aria-label", "Delete preset");
      delBtn.innerHTML = `&times;`;
      delBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteCustomPreset(slotIdx);
      });
      card.appendChild(delBtn);

      card.addEventListener("click", () => {
        if (customPreset.font) {
          selectThemeFont(customPreset.font);
        }
        updateThemeColorsUI(
          customPreset.top,
          customPreset.bg,
          customPreset.name,
          null,
          "swatch",
          customPreset.item,
          customPreset.price,
          customPreset.category,
          customPreset.scroll
        );
      });
    } else {
      // Empty slot
      card.className = "theme-swatch-card theme-swatch-empty";
      card.setAttribute("aria-label", `Empty Preset Slot ${slotIdx + 1}`);
      card.setAttribute("title", isExactDefaultThemePalette()
        ? "Default theme color palette cannot be saved as a preset"
        : `Slot ${slotIdx + 1} (Empty - Click to save current colors)`);
      card.innerHTML = `
        <span class="theme-swatch-empty-box">
          <svg class="theme-swatch-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </span>
      `;
      card.addEventListener("click", () => {
        saveCurrentPresetToSlot(slotIdx);
      });
    }

    themeSwatchesGrid.appendChild(card);
  }

  updatePaletteSlotsStatus();
}

function renderThemeFonts() {
  const menu = document.getElementById("themeFontDropdownMenu");
  const select = document.getElementById("themeFontSelectDropdown");
  const displaySpan = document.getElementById("themeFontSelectedName");

  const currentFontObj = THEME_FONTS.find(f => f.id === currentNameFont) || THEME_FONTS[0];
  if (displaySpan) {
    displaySpan.textContent = currentFontObj.name;
    displaySpan.style.fontFamily = currentFontObj.family;
    displaySpan.style.fontWeight = (currentNameFont === "Google Sans") ? "700" : "400";
  }

  if (select) {
    select.innerHTML = "";
    THEME_FONTS.forEach(font => {
      const opt = document.createElement("option");
      opt.value = font.id;
      opt.textContent = font.name;
      opt.selected = (font.id === currentNameFont);
      select.appendChild(opt);
    });
  }

  if (menu) {
    menu.innerHTML = "";
    THEME_FONTS.forEach(font => {
      const isSelected = (font.id === currentNameFont);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `theme-font-item${isSelected ? " is-selected" : ""}`;
      btn.setAttribute("role", "option");
      btn.setAttribute("aria-selected", isSelected ? "true" : "false");
      btn.setAttribute("data-font", font.id);

      const label = document.createElement("span");
      label.className = "theme-font-preview";
      label.style.fontFamily = font.family;
      if (font.id === "Google Sans") {
        label.style.fontWeight = "700";
      }
      label.textContent = font.name;

      const check = document.createElement("span");
      check.className = "theme-font-check";
      check.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

      btn.appendChild(label);
      btn.appendChild(check);

      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        selectThemeFont(font.id);
        closeThemeFontDropdown();
      });

      menu.appendChild(btn);
    });
  }
}

function selectThemeFont(fontId) {
  if (currentNameFont === fontId) return;
  currentNameFont = fontId;

  const fontObj = THEME_FONTS.find(f => f.id === fontId) || THEME_FONTS[0];
  const displaySpan = document.getElementById("themeFontSelectedName");
  if (displaySpan) {
    displaySpan.textContent = fontObj.name;
    displaySpan.style.fontFamily = fontObj.family;
    displaySpan.style.fontWeight = (fontId === "Google Sans") ? "700" : "400";
  }

  const menu = document.getElementById("themeFontDropdownMenu");
  if (menu) {
    menu.querySelectorAll(".theme-font-item").forEach(item => {
      const isSel = (item.getAttribute("data-font") === fontId);
      item.classList.toggle("is-selected", isSel);
      item.setAttribute("aria-selected", isSel ? "true" : "false");
    });
  }

  const select = document.getElementById("themeFontSelectDropdown");
  if (select) {
    select.value = fontId;
  }

  updateThemeColorsUI(currentTopColor, currentBgColor, currentNameColor, null, "fontSelect");
}

function toggleThemeFontDropdown(e) {
  if (e) e.stopPropagation();
  const wrapper = document.getElementById("themeFontDropdownWrapper");
  if (!wrapper) return;
  const isOpen = wrapper.classList.toggle("is-open");
  wrapper.setAttribute("aria-expanded", isOpen ? "true" : "false");
  if (isOpen) {
    const menu = document.getElementById("themeFontDropdownMenu");
    if (menu) {
      const selectedItem = menu.querySelector(".theme-font-item.is-selected");
      if (selectedItem) {
        selectedItem.scrollIntoView({ block: "nearest" });
      }
    }
  } else {
    wrapper.blur();
    if (document.activeElement && (wrapper === document.activeElement || wrapper.contains(document.activeElement))) {
      document.activeElement.blur();
    }
  }
}

function closeThemeFontDropdown() {
  const wrapper = document.getElementById("themeFontDropdownWrapper");
  if (!wrapper) return;
  wrapper.classList.remove("is-open");
  wrapper.setAttribute("aria-expanded", "false");
  wrapper.blur();
  if (document.activeElement && (wrapper === document.activeElement || wrapper.contains(document.activeElement))) {
    document.activeElement.blur();
  }
}

function renderThemeColorsView() {
  const bizName = (currentBusiness && currentBusiness.name) ? currentBusiness.name : "Your Restaurant";
  const logoUrl = (currentBusiness && currentBusiness.branding && currentBusiness.branding.logoUrl) 
    ? currentBusiness.branding.logoUrl 
    : "";
  const themeMockupLogo = document.getElementById("themeMockupLogo");
  if (themeMockupLogo) {
    if (logoUrl) {
      themeMockupLogo.src = logoUrl;
      themeMockupLogo.alt = `${bizName} Logo`;
      themeMockupLogo.style.display = "block";
      themeMockupLogo.onerror = function() {
        themeMockupLogo.style.display = "none";
        if (themeMockupBizName) themeMockupBizName.style.display = "block";
      };
      if (themeMockupBizName) themeMockupBizName.style.display = "none";
    } else {
      themeMockupLogo.style.display = "none";
      themeMockupLogo.src = "";
      if (themeMockupBizName) themeMockupBizName.style.display = "block";
    }
  } else if (themeMockupBizName) {
    themeMockupBizName.style.display = "block";
  }
  if (themeMockupBizName) {
    themeMockupBizName.textContent = bizName;
  }

  const existingTop = (currentBusiness && currentBusiness.branding && currentBusiness.branding.accentColor) 
    ? normalizeHexColor(currentBusiness.branding.accentColor) 
    : "#991E2E";
  const existingBg = (currentBusiness && currentBusiness.branding && currentBusiness.branding.backgroundColor) 
    ? normalizeHexColor(currentBusiness.branding.backgroundColor) 
    : "#FBEFE1";
  const existingName = (currentBusiness && currentBusiness.branding && currentBusiness.branding.nameTextColor) 
    ? normalizeHexColor(currentBusiness.branding.nameTextColor) 
    : "";
  const existingItem = (currentBusiness && currentBusiness.branding && currentBusiness.branding.itemTextColor)
    ? normalizeHexColor(currentBusiness.branding.itemTextColor)
    : "";
  const existingPrice = (currentBusiness && currentBusiness.branding && currentBusiness.branding.priceColor)
    ? normalizeHexColor(currentBusiness.branding.priceColor)
    : "";
  const existingCategory = (currentBusiness && currentBusiness.branding && currentBusiness.branding.categoryColor)
    ? normalizeHexColor(currentBusiness.branding.categoryColor)
    : "";
  const existingScrollPoints = (currentBusiness && currentBusiness.branding && currentBusiness.branding.scrollPointsColor)
    ? normalizeHexColor(currentBusiness.branding.scrollPointsColor)
    : "";
  const existingFont = (currentBusiness && currentBusiness.branding && currentBusiness.branding.nameFont)
    ? currentBusiness.branding.nameFont
    : "Lobster";

  savedTopColor = existingTop || "#991E2E";
  currentTopColor = savedTopColor;
  savedBgColor = existingBg || "#FBEFE1";
  currentBgColor = savedBgColor;
  savedNameFont = THEME_FONTS.some(f => f.id === existingFont) ? existingFont : "Lobster";
  currentNameFont = savedNameFont;

  if (existingName) {
    savedNameColor = existingName;
    isCustomNameColor = true;
  } else if (savedTopColor.toUpperCase() === "#991E2E") {
    savedNameColor = "#FFFFFF";
    isCustomNameColor = false;
  } else {
    savedNameColor = applyBlackOverlay(savedTopColor, 0.25);
    isCustomNameColor = false;
  }
  currentNameColor = savedNameColor;

  if (existingItem) {
    savedItemTextColor = existingItem;
    isCustomItemTextColor = true;
  } else {
    savedItemTextColor = "#000000";
    isCustomItemTextColor = false;
  }
  currentItemTextColor = savedItemTextColor;

  if (existingPrice) {
    savedPriceColor = existingPrice;
    isCustomPriceColor = true;
  } else {
    savedPriceColor = applyBlackOverlay(savedTopColor, 0.25);
    isCustomPriceColor = false;
  }
  currentPriceColor = savedPriceColor;

  if (existingCategory) {
    savedCategoryColor = existingCategory;
    isCustomCategoryColor = true;
  } else {
    savedCategoryColor = "#D05A00";
    isCustomCategoryColor = false;
  }
  currentCategoryColor = savedCategoryColor;

  if (existingScrollPoints) {
    savedScrollPointsColor = existingScrollPoints;
    isCustomScrollPointsColor = true;
  } else {
    savedScrollPointsColor = savedPriceColor || applyBlackOverlay(savedTopColor, 0.25) || "#731723";
    isCustomScrollPointsColor = false;
  }
  currentScrollPointsColor = savedScrollPointsColor;

  loadCustomPresetsFromBusiness();
  renderThemeFonts();
  renderThemeSwatches();
  updateThemeColorsUI(currentTopColor, currentBgColor, currentNameColor, null, "all", currentItemTextColor, currentPriceColor, currentCategoryColor, currentScrollPointsColor);

  if (themeSaveBtn) {
    themeSaveBtn.disabled = true;
  }
}

async function saveThemeColors() {
  if (!themeSaveBtn || themeSaveBtn.disabled) return;
  const topToSave = normalizeHexColor(currentTopColor);
  const bgToSave = normalizeHexColor(currentBgColor);
  const nameToSave = normalizeHexColor(currentNameColor);
  const itemToSave = normalizeHexColor(currentItemTextColor) || "#000000";
  const priceToSave = normalizeHexColor(currentPriceColor) || applyBlackOverlay(topToSave, 0.25);
  const categoryToSave = normalizeHexColor(currentCategoryColor) || "#D05A00";
  const scrollPointsToSave = normalizeHexColor(currentScrollPointsColor) || priceToSave;
  if (!topToSave || !bgToSave || !nameToSave) return;

  themeSaveBtn.disabled = true;
  if (themeResetBtn) themeResetBtn.disabled = true;
  if (themeSaveSpinner) themeSaveSpinner.style.display = "inline-block";
  if (themeSaveBtnLabel) themeSaveBtnLabel.textContent = "Applying";

  try {
    const res = await fetch("/api/owner/business", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accentColor: topToSave,
        backgroundColor: bgToSave,
        nameTextColor: nameToSave,
        itemTextColor: itemToSave,
        priceColor: priceToSave,
        categoryColor: categoryToSave,
        scrollPointsColor: scrollPointsToSave,
        hasNameStroke: false,
        nameFont: currentNameFont
      })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || data.error || "Failed to update theme colors");
    }

    if (data.business) {
      currentBusiness = data.business;
    } else {
      if (!currentBusiness) currentBusiness = {};
      if (!currentBusiness.branding) currentBusiness.branding = {};
      currentBusiness.branding.accentColor = topToSave;
      currentBusiness.branding.backgroundColor = bgToSave;
      currentBusiness.branding.nameTextColor = nameToSave;
      currentBusiness.branding.itemTextColor = itemToSave;
      currentBusiness.branding.priceColor = priceToSave;
      currentBusiness.branding.categoryColor = categoryToSave;
      currentBusiness.branding.scrollPointsColor = scrollPointsToSave;
      currentBusiness.branding.hasNameStroke = false;
      currentBusiness.branding.nameFont = currentNameFont;
    }

    savedTopColor = topToSave;
    savedBgColor = bgToSave;
    savedNameColor = nameToSave;
    savedItemTextColor = itemToSave;
    savedPriceColor = priceToSave;
    savedCategoryColor = categoryToSave;
    savedScrollPointsColor = scrollPointsToSave;
    savedNameFont = currentNameFont;
    if (typeof updateQrStandPanels === "function") {
      updateQrStandPanels();
    }
    updateThemePreviewHeaderLabel(false);
    if (themeSaveBtnLabel) themeSaveBtnLabel.textContent = "Applied";
    setTimeout(() => {
      if (themeSaveBtnLabel) themeSaveBtnLabel.textContent = "Apply Theme";
      const stillChanged = (
        currentTopColor.toUpperCase() !== savedTopColor.toUpperCase() ||
        currentBgColor.toUpperCase() !== savedBgColor.toUpperCase() ||
        currentNameColor.toUpperCase() !== savedNameColor.toUpperCase() ||
        currentItemTextColor.toUpperCase() !== savedItemTextColor.toUpperCase() ||
        currentPriceColor.toUpperCase() !== savedPriceColor.toUpperCase() ||
        currentCategoryColor.toUpperCase() !== savedCategoryColor.toUpperCase() ||
        currentScrollPointsColor.toUpperCase() !== savedScrollPointsColor.toUpperCase() ||
        currentNameFont !== savedNameFont
      );
      if (themeSaveBtn) themeSaveBtn.disabled = !stillChanged;
    }, 1400);
  } catch (err) {
    console.error("Save Theme Colors Error:", err);
    if (themeSaveBtnLabel) themeSaveBtnLabel.textContent = "Failed - Retry";
    if (themeSaveBtn) themeSaveBtn.disabled = false;
  } finally {
    if (themeSaveSpinner) themeSaveSpinner.style.display = "none";
    const isDef = (
      currentTopColor.toUpperCase() === "#991E2E" &&
      currentBgColor.toUpperCase() === "#FBEFE1" &&
      (currentNameColor.toUpperCase() === "#FFFFFF" || currentNameColor.toUpperCase() === "#63141E") &&
      currentItemTextColor.toUpperCase() === "#000000" &&
      currentPriceColor.toUpperCase() === "#731723" &&
      currentCategoryColor.toUpperCase() === "#D05A00" &&
      currentScrollPointsColor.toUpperCase() === "#731723" &&
      currentNameFont === "Lobster"
    );
    if (themeResetBtn) themeResetBtn.disabled = isDef;
  }
}

// Top Bar color picker listeners
if (themeTopColorNativeInput) {
  themeTopColorNativeInput.addEventListener("input", (e) => {
    updateThemeColorsUI(e.target.value, null, null, null, "topNative");
  });
}

if (themeTopHexInput) {
  themeTopHexInput.addEventListener("input", (e) => {
    const raw = e.target.value.replace(/[^0-9A-Fa-f]/g, "").slice(0, 6);
    e.target.value = raw.toUpperCase();
    if (raw.length === 6) {
      updateThemeColorsUI("#" + raw, null, null, null, "topHex");
    } else {
      if (themeSaveBtn) themeSaveBtn.disabled = true;
    }
  });

  themeTopHexInput.addEventListener("blur", () => {
    themeTopHexInput.value = currentTopColor.replace("#", "");
  });
}

// Background color picker listeners
if (themeBgColorNativeInput) {
  themeBgColorNativeInput.addEventListener("input", (e) => {
    updateThemeColorsUI(null, e.target.value, null, null, "bgNative");
  });
}

if (themeBgHexInput) {
  themeBgHexInput.addEventListener("input", (e) => {
    const raw = e.target.value.replace(/[^0-9A-Fa-f]/g, "").slice(0, 6);
    e.target.value = raw.toUpperCase();
    if (raw.length === 6) {
      updateThemeColorsUI(null, "#" + raw, null, null, "bgHex");
    } else {
      if (themeSaveBtn) themeSaveBtn.disabled = true;
    }
  });

  themeBgHexInput.addEventListener("blur", () => {
    themeBgHexInput.value = currentBgColor.replace("#", "");
  });
}

// Business Name Text color picker listeners
if (themeNameColorNativeInput) {
  themeNameColorNativeInput.addEventListener("input", (e) => {
    updateThemeColorsUI(null, null, e.target.value, null, "nameNative");
  });
}

if (themeNameHexInput) {
  themeNameHexInput.addEventListener("input", (e) => {
    const raw = e.target.value.replace(/[^0-9A-Fa-f]/g, "").slice(0, 6);
    e.target.value = raw.toUpperCase();
    if (raw.length === 6) {
      updateThemeColorsUI(null, null, "#" + raw, null, "nameHex");
    } else {
      if (themeSaveBtn) themeSaveBtn.disabled = true;
    }
  });

  themeNameHexInput.addEventListener("blur", () => {
    themeNameHexInput.value = currentNameColor.replace("#", "");
  });
}

// Menu Items Text color picker listeners
if (themeItemColorNativeInput) {
  themeItemColorNativeInput.addEventListener("input", (e) => {
    updateThemeColorsUI(null, null, null, null, "itemNative", e.target.value, null);
  });
}

if (themeItemHexInput) {
  themeItemHexInput.addEventListener("input", (e) => {
    const raw = e.target.value.replace(/[^0-9A-Fa-f]/g, "").slice(0, 6);
    e.target.value = raw.toUpperCase();
    if (raw.length === 6) {
      updateThemeColorsUI(null, null, null, null, "itemHex", "#" + raw, null);
    } else {
      if (themeSaveBtn) themeSaveBtn.disabled = true;
    }
  });

  themeItemHexInput.addEventListener("blur", () => {
    themeItemHexInput.value = currentItemTextColor.replace("#", "");
  });
}

// Price color picker listeners
if (themePriceColorNativeInput) {
  themePriceColorNativeInput.addEventListener("input", (e) => {
    updateThemeColorsUI(null, null, null, null, "priceNative", null, e.target.value);
  });
}

if (themePriceHexInput) {
  themePriceHexInput.addEventListener("input", (e) => {
    const raw = e.target.value.replace(/[^0-9A-Fa-f]/g, "").slice(0, 6);
    e.target.value = raw.toUpperCase();
    if (raw.length === 6) {
      updateThemeColorsUI(null, null, null, null, "priceHex", null, "#" + raw);
    } else {
      if (themeSaveBtn) themeSaveBtn.disabled = true;
    }
  });

  themePriceHexInput.addEventListener("blur", () => {
    themePriceHexInput.value = currentPriceColor.replace("#", "");
  });
}

// Category Title color picker listeners
if (themeCategoryColorNativeInput) {
  themeCategoryColorNativeInput.addEventListener("input", (e) => {
    updateThemeColorsUI(null, null, null, null, "categoryNative", null, null, e.target.value, null);
  });
}

if (themeCategoryHexInput) {
  themeCategoryHexInput.addEventListener("input", (e) => {
    const raw = e.target.value.replace(/[^0-9A-Fa-f]/g, "").slice(0, 6);
    e.target.value = raw.toUpperCase();
    if (raw.length === 6) {
      updateThemeColorsUI(null, null, null, null, "categoryHex", null, null, "#" + raw, null);
    } else {
      if (themeSaveBtn) themeSaveBtn.disabled = true;
    }
  });

  themeCategoryHexInput.addEventListener("blur", () => {
    themeCategoryHexInput.value = currentCategoryColor.replace("#", "");
  });
}

// Scroll Points color picker listeners
if (themeScrollPointsColorNativeInput) {
  themeScrollPointsColorNativeInput.addEventListener("input", (e) => {
    updateThemeColorsUI(null, null, null, null, "scrollNative", null, null, null, e.target.value);
  });
}

if (themeScrollPointsHexInput) {
  themeScrollPointsHexInput.addEventListener("input", (e) => {
    const raw = e.target.value.replace(/[^0-9A-Fa-f]/g, "").slice(0, 6);
    e.target.value = raw.toUpperCase();
    if (raw.length === 6) {
      updateThemeColorsUI(null, null, null, null, "scrollHex", null, null, null, "#" + raw);
    } else {
      if (themeSaveBtn) themeSaveBtn.disabled = true;
    }
  });

  themeScrollPointsHexInput.addEventListener("blur", () => {
    themeScrollPointsHexInput.value = currentScrollPointsColor.replace("#", "");
  });
}



if (themeSaveBtn) {
  themeSaveBtn.addEventListener("click", saveThemeColors);
}

if (themeSavePresetBtn) {
  themeSavePresetBtn.addEventListener("click", () => {
    saveCurrentPresetToSlot();
  });
}

// Business Name Font Dropdown event listeners
const themeFontDropdownWrapper = document.getElementById("themeFontDropdownWrapper");
if (themeFontDropdownWrapper) {
  themeFontDropdownWrapper.addEventListener("click", toggleThemeFontDropdown);
  themeFontDropdownWrapper.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleThemeFontDropdown(e);
    }
  });
}

document.addEventListener("click", (e) => {
  const wrapper = document.getElementById("themeFontDropdownWrapper");
  if (wrapper && !wrapper.contains(e.target)) {
    closeThemeFontDropdown();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeThemeFontDropdown();
  }
});

const themeFontSelectDropdown = document.getElementById("themeFontSelectDropdown");
if (themeFontSelectDropdown) {
  themeFontSelectDropdown.addEventListener("change", (e) => {
    selectThemeFont(e.target.value);
  });
}

function resetThemeColors() {
  currentTopColor = "#991E2E";
  currentBgColor = "#FBEFE1";
  currentNameColor = "#FFFFFF";
  isCustomNameColor = false;
  currentItemTextColor = "#000000";
  isCustomItemTextColor = false;
  currentPriceColor = "#731723";
  isCustomPriceColor = false;
  currentCategoryColor = "#D05A00";
  isCustomCategoryColor = false;
  currentScrollPointsColor = "#731723";
  isCustomScrollPointsColor = false;
  currentNameFont = "Lobster";

  renderThemeFonts();
  renderThemeSwatches();
  updateThemeColorsUI(currentTopColor, currentBgColor, currentNameColor, null, "all", currentItemTextColor, currentPriceColor, currentCategoryColor, currentScrollPointsColor);
}

if (themeResetBtn) {
  themeResetBtn.addEventListener("click", resetThemeColors);
}

window.addEventListener("hashchange", () => {
  const hash = window.location.hash;
  if (!currentBusiness || currentBusiness.approvalStatus !== "approved") return;
  if (hash === "#branding") {
    populateBrandingForm();
    showView(brandingView);
  } else if (hash === "#importmenu") {
    showView(importMenuView);
  } else if (hash === "#themecolors") {
    renderThemeColorsView();
    showView(themeColorsView);
  } else if (hash === "#qrcode") {
    renderQrCodeView();
    showView(qrCodeView);
  } else if (hash === "#menu" || hash === "#dashboard") {
    showView(dashboardView);
  }
});

// ==========================================================================
// Import Menu Controller (Manual Import & AI Import)
// ==========================================================================
const importCapsuleSwitcher = document.getElementById("importCapsuleSwitcher");
const importManualTabBtn = document.getElementById("importManualTabBtn");
const importAiTabBtn = document.getElementById("importAiTabBtn");
const importManualCard = document.getElementById("importManualCard");
const importUploadCard = document.getElementById("importUploadCard");
const manualImportTextarea = document.getElementById("manualImportTextarea");
const manualFileInput = document.getElementById("manualFileInput");
const manualFileTriggerBtn = document.getElementById("manualFileTriggerBtn");
const loadSampleTemplateBtn = document.getElementById("loadSampleTemplateBtn");
const clearManualTextBtn = document.getElementById("clearManualTextBtn");
const parseManualMenuBtn = document.getElementById("parseManualMenuBtn");
const importExtractedCard = document.getElementById("importExtractedCard");
const manualStatusMessage = document.getElementById("manualStatusMessage");
const importManualModeAppendLabel = document.getElementById("importManualModeAppendLabel");
const importManualModeReplaceLabel = document.getElementById("importManualModeReplaceLabel");

let currentImportType = "manual";

function setImportType(type) {
  currentImportType = type;
  if (importCapsuleSwitcher) {
    importCapsuleSwitcher.setAttribute("data-active", type);
  }
  if (importManualTabBtn) {
    importManualTabBtn.classList.toggle("active", type === "manual");
    importManualTabBtn.setAttribute("aria-selected", type === "manual" ? "true" : "false");
  }
  if (importAiTabBtn) {
    importAiTabBtn.classList.toggle("active", type === "ai");
    importAiTabBtn.setAttribute("aria-selected", type === "ai" ? "true" : "false");
  }

  if (importExtractedCard) importExtractedCard.style.display = "none";
  document.documentElement.classList.remove("ai-loading-mode");
  document.body.classList.remove("ai-loading-mode");
  if (importMenuView) {
    importMenuView.classList.remove("preview-active");
    importMenuView.classList.remove("ai-loading-active");
  }
  if (importAiLoadingState) importAiLoadingState.style.display = "none";

  const activeCard = (type === "manual") ? importManualCard : importUploadCard;
  const inactiveCard = (type === "manual") ? importUploadCard : importManualCard;
  if (inactiveCard) {
    inactiveCard.style.display = "none";
    inactiveCard.classList.remove("is-entering");
  }
  if (activeCard) {
    activeCard.style.display = "flex";
    activeCard.classList.remove("is-entering");
    void activeCard.offsetWidth; // trigger reflow for smooth entrance
    activeCard.classList.add("is-entering");
  }
}

if (importManualTabBtn) {
  importManualTabBtn.addEventListener("click", () => setImportType("manual"));
}
if (importAiTabBtn) {
  importAiTabBtn.addEventListener("click", () => setImportType("ai"));
}

function showManualStatus(msg, type = "info") {
  if (!manualStatusMessage) return;
  manualStatusMessage.textContent = msg;
  manualStatusMessage.className = `import-status-banner ${type}`;
  manualStatusMessage.style.display = "block";
}

function hideManualStatus() {
  if (manualStatusMessage) {
    manualStatusMessage.style.display = "none";
    manualStatusMessage.textContent = "";
  }
}

// Step 1: Full AI Extraction Prompt for 1-click clipboard copy
const AI_IMPORT_PROMPT = `Analyze the uploaded menu image(s) and extract all menu items.

Return ONLY the extracted menu text in exactly this format:

[CATEGORY NAME]
Item Name (Sub Text) - Price

Example:

[CHICKEN ITEMS]
Veg Biryani (Full) - 120
Chilli Chicken (8pc) - 80
Chicken Tikka (6 Pieces) - 220

Rules:

1. CATEGORY NAMES must always be written in ALL CAPITAL LETTERS and within square brackets.
   Example: [CHICKEN ITEMS]

2. MENU ITEM NAMES must use title-style capitalization:

   * Capitalize the first letter of each main word.
   * Example: Chilli Chicken, Butter Paneer, Chicken Biryani

3. SUB TEXT inside parentheses must also use title-style capitalization when it contains words.
   Example: (Full), (Half Plate), (Boneless), (8 Pieces)

4. If the sub text starts with a NUMBER followed by letters, keep the letters immediately after the number in lowercase.
   Example:
   (8pc)
   (4pcs)
   (2kg)
   (500ml)

5. Preserve numbers and units accurately.
   Do not change:
   (8pc) → (8 Pieces)
   (500ml) → (500 Ml)
   unless the menu itself clearly shows the expanded form.

6. If there is no sub text, do not add parentheses.
   Example:
   Butter Chicken - 320

7. Keep the price exactly as shown on the menu. Do not invent or estimate prices. Do not add anything  before and after the price digits.

8. If an item has multiple sizes or prices, make the as separate menu items.
   Example:
   Chicken Biryani (Half) - 100
   Chicken Biryani (Full) - 180

9. Keep the original category and item structure. Do not create new categories unless the menu clearly contains them.

10. Ignore restaurant information such as:

* Restaurant name
* Address
* Phone number
* Website
* Social media
* Opening hours
* Promotional text

11. If text is unclear or a price cannot be confidently read, do not guess.

12. Do not add:

* [square brackets]
* bullets
* numbering
* symbols
* Markdown
* explanations
* introductory text
* closing text

Return ONLY the menu in the required format.`;

const copyPromptBtn = document.getElementById("copyPromptBtn");
const importPromptBox = document.getElementById("importPromptBox");

let copyPromptTimer = null;

function copyPromptToClipboard(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  const textToCopy = AI_IMPORT_PROMPT;
  const btn = document.getElementById("copyPromptBtn");
  const copyTextEl = btn ? btn.querySelector(".copy-btn-text") : null;
  const copyIconEl = btn ? btn.querySelector(".copy-icon") : null;

  const showCopiedState = () => {
    if (copyPromptTimer) clearTimeout(copyPromptTimer);
    if (btn) btn.classList.add("copied");
    if (copyTextEl) copyTextEl.textContent = "Copied!";
    if (copyIconEl) {
      copyIconEl.innerHTML = `<polyline points="20 6 9 17 4 12"></polyline>`;
    }
    copyPromptTimer = setTimeout(() => {
      if (btn) btn.classList.remove("copied");
      if (copyTextEl) copyTextEl.textContent = "Copy";
      if (copyIconEl) {
        copyIconEl.innerHTML = `<rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>`;
      }
      copyPromptTimer = null;
    }, 2000);
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(textToCopy).then(showCopiedState).catch(() => {
      fallbackCopyText(textToCopy);
      showCopiedState();
    });
  } else {
    fallbackCopyText(textToCopy);
    showCopiedState();
  }
}

function fallbackCopyText(text) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.top = "0";
  ta.style.left = "0";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try {
    document.execCommand("copy");
  } catch (err) {}
  document.body.removeChild(ta);
}

if (copyPromptBtn) {
  copyPromptBtn.addEventListener("click", copyPromptToClipboard);
}
if (importPromptBox) {
  importPromptBox.addEventListener("click", copyPromptToClipboard);
}

// Step 2: Open Installed Phone Apps (Gemini & ChatGPT) or Browser on Desktop
function setupInstalledAppOpeners() {
  const geminiBtn = document.getElementById("openGeminiAppBtn");
  const chatgptBtn = document.getElementById("openChatGPTAppBtn");
  if (!geminiBtn && !chatgptBtn) return;

  const isAndroid = /Android/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (isAndroid) {
    if (geminiBtn) {
      geminiBtn.href = "intent://gemini.google.com/#Intent;scheme=https;package=com.google.android.apps.bard;end;";
      geminiBtn.removeAttribute("target");
    }
    if (chatgptBtn) {
      chatgptBtn.href = "intent://chatgpt.com/#Intent;scheme=https;package=com.openai.chatgpt;end;";
      chatgptBtn.removeAttribute("target");
    }
    return;
  }

  if (isIOS) {
    if (geminiBtn) {
      geminiBtn.href = "googlegemini://";
      geminiBtn.removeAttribute("target");
    }
    if (chatgptBtn) {
      chatgptBtn.href = "chatgpt://";
      chatgptBtn.removeAttribute("target");
    }
    return;
  }

  // Desktop: opens in new tab in browser
  if (geminiBtn) {
    geminiBtn.href = "https://gemini.google.com";
    geminiBtn.target = "_blank";
    geminiBtn.rel = "noopener noreferrer";
  }
  if (chatgptBtn) {
    chatgptBtn.href = "https://chatgpt.com";
    chatgptBtn.target = "_blank";
    chatgptBtn.rel = "noopener noreferrer";
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupInstalledAppOpeners);
} else {
  setupInstalledAppOpeners();
}

// Sample Menu Template for instant 1-click test
const SAMPLE_MENU_TEMPLATE = `[CHICKEN ITEMS]
Veg Biryani (Full) - 120
Chilli Chicken (8pc) - 80
Chicken Roll (Double Egg) - 90

[STARTERS]
Crispy Paneer Tikka (Charcoal grilled cottage cheese with mint chutney) - 240
Golden Fried Corn (Crunchy sweet corn tossed with bell peppers & spices) - 180
Veg Spring Rolls (Crispy rolls stuffed with seasoned veggies) - 160

[MAIN COURSE]
Butter Chicken (Rich creamy tomato butter gravy with tender chicken) - 360
Paneer Butter Masala (Cottage cheese cooked in rich buttery sauce) - 280
Dal Makhani (Slow-cooked black lentils with fresh cream & butter) - 220
Butter Naan (Fresh clay oven flatbread brushed with butter) - 50

[BEVERAGES]
Fresh Lime Soda (Sweet and salty chilled soda with mint) - 90
Mango Lassi (Traditional thick yogurt drink with Alphonso mango) - 120
Cold Coffee (Chilled blended coffee with vanilla ice cream) - 140`;

if (loadSampleTemplateBtn && manualImportTextarea) {
  loadSampleTemplateBtn.addEventListener("click", () => {
    manualImportTextarea.value = SAMPLE_MENU_TEMPLATE;
    hideManualStatus();
    manualImportTextarea.focus();
  });
}

if (clearManualTextBtn && manualImportTextarea) {
  clearManualTextBtn.addEventListener("click", () => {
    manualImportTextarea.value = "";
    hideManualStatus();
  });
}

if (manualFileTriggerBtn && manualFileInput) {
  manualFileTriggerBtn.addEventListener("click", () => {
    manualFileInput.click();
  });
}

if (manualFileInput && manualImportTextarea) {
  manualFileInput.addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      manualImportTextarea.value = event.target.result || "";
      showManualStatus(`Loaded "${file.name}" successfully. Click "Load Menu" below.`, "success");
    };
    reader.onerror = () => {
      showManualStatus(`Failed to read file "${file.name}".`, "error");
    };
    reader.readAsText(file);
    manualFileInput.value = "";
  });
}

function parseManualMenuText(text) {
  const lines = text.split(/\r?\n/);
  const categories = [];
  let currentCategory = null;

  for (let rawLine of lines) {
    let line = rawLine.trim();
    if (!line) continue;

    // 1. Check for Category Header enclosed in square brackets: [CATEGORY NAME]
    const bracketMatch = line.match(/^\[\s*(.*?)\s*\]\s*:?$/);
    if (bracketMatch) {
      const catName = bracketMatch[1].trim().replace(/:$/, "").trim();
      if (catName) {
        currentCategory = categories.find(c => c.name.toUpperCase() === catName.toUpperCase());
        if (!currentCategory) {
          currentCategory = {
            id: "cat_" + Math.random().toString(36).substring(2, 9),
            name: catName,
            items: []
          };
          categories.push(currentCategory);
        }
        continue;
      }
    }

    // 2. Check if line is an item line: Item Name (Sub Text) - Price (or Item Name - Price)
    const lastDashIdx = Math.max(line.lastIndexOf("-"), line.lastIndexOf("–"), line.lastIndexOf("—"));
    const pricePart = lastDashIdx !== -1 ? line.slice(lastDashIdx + 1).trim() : "";
    const itemPart = lastDashIdx !== -1 ? line.slice(0, lastDashIdx).trim() : "";
    const isItemLine = lastDashIdx !== -1 && itemPart && /\d+/.test(pricePart);

    if (isItemLine) {
      const price = parseFloat(pricePart.replace(/[^0-9.]/g, "")) || 0;
      const itemName = itemPart;
      const description = "";

      // If no category header was encountered yet, assign to a default category
      let targetCat = currentCategory;
      if (!targetCat) {
        targetCat = categories.find(c => c.name.toUpperCase() === "GENERAL");
        if (!targetCat) {
          targetCat = {
            id: "cat_" + Math.random().toString(36).substring(2, 9),
            name: "GENERAL",
            items: []
          };
          categories.push(targetCat);
        }
        currentCategory = targetCat;
      }

      targetCat.items.push({
        id: "item_" + Math.random().toString(36).substring(2, 9),
        name: itemName,
        price: price,
        description: description,
        selected: true
      });
      continue;
    }

    // 3. Fallback: also accept Category Header without brackets if line is not an item line
    let catName = line.replace(/:$/, "").trim();
    if (catName) {
      currentCategory = categories.find(c => c.name.toUpperCase() === catName.toUpperCase());
      if (!currentCategory) {
        currentCategory = {
          id: "cat_" + Math.random().toString(36).substring(2, 9),
          name: catName,
          items: []
        };
        categories.push(currentCategory);
      }
    }
  }

  return categories.filter(c => c.items.length > 0);
}

if (parseManualMenuBtn && manualImportTextarea) {
  parseManualMenuBtn.addEventListener("click", async () => {
    const text = manualImportTextarea.value.trim();
    if (!text) {
      showManualStatus("Please enter or paste menu items first, or click 'Load Sample'.", "error");
      return;
    }

    hideManualStatus();

    // Smoothly exit current manual card before AI loading
    if (importManualCard) importManualCard.classList.add("is-exiting");
    await new Promise(r => setTimeout(r, 160));
    if (importManualCard) importManualCard.classList.remove("is-exiting");

    // Show deliberate AI loading screen in middle of page (minimum 5 seconds)
    const startTime = Date.now();
    document.documentElement.classList.add("ai-loading-mode");
    document.body.classList.add("ai-loading-mode");
    if (importMenuView) importMenuView.classList.add("ai-loading-active");
    if (importAiLoadingState) {
      importAiLoadingState.classList.remove("is-exiting");
      importAiLoadingState.style.display = "flex";
    }
    window.scrollTo({ top: 0, behavior: "instant" });

    let parsedCats = [];
    let parseError = null;

    try {
      parsedCats = parseManualMenuText(text);
      if (parsedCats.length === 0) {
        parseError = "Could not find any items matching the required format:\n[CATEGORY NAME]\nItem Name (Sub Text) - Price";
      }
    } catch (err) {
      parseError = err.message || "Failed to process menu text.";
    }

    // Deliberate at least 5 second loading time for AI processing
    const elapsed = Date.now() - startTime;
    const remainingWait = Math.max(0, 5000 - elapsed);
    await new Promise(resolve => setTimeout(resolve, remainingWait));

    // Smoothly fade out AI loading screen before showing preview
    if (importAiLoadingState) {
      importAiLoadingState.classList.add("is-exiting");
      await new Promise(resolve => setTimeout(resolve, 220));
      importAiLoadingState.classList.remove("is-exiting");
      importAiLoadingState.style.display = "none";
    }
    document.documentElement.classList.remove("ai-loading-mode");
    document.body.classList.remove("ai-loading-mode");
    if (importMenuView) importMenuView.classList.remove("ai-loading-active");

    if (parseError) {
      showManualStatus(parseError, "error");
      return;
    }

    extractedCategories = parsedCats;
    hideManualStatus();
    renderExtractedPreviewUI();

    if (importMenuView) importMenuView.classList.add("preview-active");
    if (importExtractedCard) {
      importExtractedCard.classList.remove("is-exiting");
      importExtractedCard.style.display = "flex";
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// AI Import elements & handlers
const importDropzone = document.getElementById("importDropzone");
const menuPhotosInput = document.getElementById("menuPhotosInput");
const importBrowseTrigger = document.getElementById("importBrowseTrigger");
const importPhotosContainer = document.getElementById("importPhotosContainer");
const importPhotosCountLabel = document.getElementById("importPhotosCountLabel");
const importPhotosGrid = document.getElementById("importPhotosGrid");
const importAddMoreBtn = document.getElementById("importAddMoreBtn");
const analyzeMenuBtn = document.getElementById("analyzeMenuBtn");
const analyzeMenuBtnLabel = document.getElementById("analyzeMenuBtnLabel");
const analyzeSpinner = document.getElementById("analyzeSpinner");
const analyzeStatusMessage = document.getElementById("analyzeStatusMessage");
const extractedSummaryPill = document.getElementById("extractedSummaryPill");
const importExtractedCategoryCount = document.getElementById("importExtractedCategoryCount");
const importAiLoadingState = document.getElementById("importAiLoadingState");
const importCategoriesContainer = document.getElementById("importCategoriesContainer");
const selectAllDishesBtn = document.getElementById("selectAllDishesBtn");
const deselectAllDishesBtn = document.getElementById("deselectAllDishesBtn");
const importAddCategoryBtn = document.getElementById("importAddCategoryBtn");
const importCommitCountLabel = document.getElementById("importCommitCountLabel");
const importClearBtn = document.getElementById("importClearBtn");
const importConfirmBtn = document.getElementById("importConfirmBtn");
const importStrategyModal = document.getElementById("importStrategyModal");
const importStrategyFormContent = document.getElementById("importStrategyFormContent");
const importStrategySuccessView = document.getElementById("importStrategySuccessView");
const importDialogModeAppendLabel = document.getElementById("importDialogModeAppendLabel");
const importDialogModeReplaceLabel = document.getElementById("importDialogModeReplaceLabel");
const cancelImportStrategyBtn = document.getElementById("cancelImportStrategyBtn");
const confirmImportStrategyBtn = document.getElementById("confirmImportStrategyBtn");
const confirmImportStrategyBtnLabel = document.getElementById("confirmImportStrategyBtnLabel");
const importDialogSpinner = document.getElementById("importDialogSpinner");

let importSelectedFiles = []; // { id, name, base64, mimeType }
let extractedCategories = []; // [{ id, name, items: [{ id, name, price, description, selected }] }]

function compressMenuImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 1400;
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
        const dataUrl = canvas.toDataURL("image/jpeg", 0.80);
        resolve({
          id: "photo_" + Math.random().toString(36).substring(2, 9),
          name: file.name,
          base64: dataUrl,
          mimeType: "image/jpeg"
        });
      };
      img.onerror = () => reject(new Error(`Failed to load image ${file.name}`));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error(`Failed to read file ${file.name}`));
    reader.readAsDataURL(file);
  });
}

async function handleFilesSelected(files) {
  if (!files || files.length === 0) return;
  const imageFiles = Array.from(files).filter(f => f.type.startsWith("image/"));
  if (imageFiles.length === 0) {
    showImportStatus("Please select valid image files (JPG, PNG, WebP).", "error");
    return;
  }

  if (importSelectedFiles.length + imageFiles.length > 10) {
    showImportStatus("You can upload a maximum of 10 photos at a time.", "error");
    return;
  }

  showImportStatus("Processing photos for upload...", "loading");

  try {
    for (const f of imageFiles) {
      const compressed = await compressMenuImage(f);
      importSelectedFiles.push(compressed);
    }
    renderSelectedPhotosUI();
    hideImportStatus();
  } catch (err) {
    console.error("Photo compression error:", err);
    showImportStatus("Error loading some photos. Please try again.", "error");
  }
}

function renderSelectedPhotosUI() {
  if (!importPhotosGrid || !importPhotosContainer) return;

  if (importSelectedFiles.length === 0) {
    importPhotosContainer.style.display = "none";
    if (analyzeMenuBtn) analyzeMenuBtn.disabled = true;
    return;
  }

  importPhotosContainer.style.display = "flex";
  if (analyzeMenuBtn) analyzeMenuBtn.disabled = false;
  if (importPhotosCountLabel) {
    importPhotosCountLabel.textContent = `${importSelectedFiles.length} photo${importSelectedFiles.length === 1 ? "" : "s"} selected`;
  }

  importPhotosGrid.innerHTML = "";
  importSelectedFiles.forEach(photo => {
    const card = document.createElement("div");
    card.className = "import-photo-thumb-card";

    const img = document.createElement("img");
    img.className = "import-photo-thumb-img";
    img.src = photo.base64;
    img.alt = photo.name;
    img.title = photo.name;

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "import-photo-remove-btn";
    delBtn.innerHTML = "✕";
    delBtn.title = "Remove photo";
    delBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      importSelectedFiles = importSelectedFiles.filter(p => p.id !== photo.id);
      renderSelectedPhotosUI();
    });

    card.appendChild(img);
    card.appendChild(delBtn);
    importPhotosGrid.appendChild(card);
  });
}

function showImportStatus(msg, type = "loading") {
  if (!analyzeStatusMessage) return;
  analyzeStatusMessage.textContent = msg;
  analyzeStatusMessage.className = `import-status-banner ${type}`;
  analyzeStatusMessage.style.display = "block";
}

function hideImportStatus() {
  if (!analyzeStatusMessage) return;
  analyzeStatusMessage.style.display = "none";
}

// Strategy Mode dialog radio selection toggles
const dialogStrategyRadios = document.querySelectorAll('input[name="importDialogStrategy"]');
dialogStrategyRadios.forEach(radio => {
  radio.addEventListener("change", (e) => {
    if (importDialogModeAppendLabel) importDialogModeAppendLabel.classList.toggle("active", e.target.value === "append");
    if (importDialogModeReplaceLabel) importDialogModeReplaceLabel.classList.toggle("active", e.target.value === "replace");
  });
});

// Dropzone interactions
if (importDropzone && menuPhotosInput) {
  importDropzone.addEventListener("click", (e) => {
    if (e.target !== importBrowseTrigger && !e.target.closest("#importBrowseTrigger")) {
      menuPhotosInput.click();
    }
  });

  if (importBrowseTrigger) {
    importBrowseTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      menuPhotosInput.click();
    });
  }

  if (importAddMoreBtn) {
    importAddMoreBtn.addEventListener("click", () => {
      menuPhotosInput.click();
    });
  }

  menuPhotosInput.addEventListener("change", (e) => {
    handleFilesSelected(e.target.files);
    menuPhotosInput.value = "";
  });

  importDropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    importDropzone.classList.add("dragover");
  });

  importDropzone.addEventListener("dragleave", (e) => {
    e.preventDefault();
    importDropzone.classList.remove("dragover");
  });

  importDropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    importDropzone.classList.remove("dragover");
    if (e.dataTransfer && e.dataTransfer.files) {
      handleFilesSelected(e.dataTransfer.files);
    }
  });
}

// AI Analysis
if (analyzeMenuBtn) {
  analyzeMenuBtn.addEventListener("click", async () => {
    if (importSelectedFiles.length === 0) return;

    analyzeMenuBtn.disabled = true;
    if (analyzeSpinner) analyzeSpinner.style.display = "inline-block";
    if (analyzeMenuBtnLabel) analyzeMenuBtnLabel.textContent = "Analyzing Photos with AI...";
    showImportStatus("Analyzing menu with Gemini AI... Reading categories, dishes and prices.", "loading");

    try {
      let res;
      let data;
      const payload = JSON.stringify({
        images: importSelectedFiles.map(f => ({ base64: f.base64, mimeType: f.mimeType }))
      });

      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          if (attempt === 2) {
            showImportStatus("Server container warming up... Retrying analysis automatically.", "loading");
          }
          res = await fetch("/api/owner/extract-menu", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: payload
          });

          const contentType = res.headers.get("content-type") || "";
          if (contentType.includes("application/json")) {
            data = await res.json();
            if (res.ok || (res.status !== 502 && res.status !== 503 && res.status !== 504)) {
              break;
            }
          } else {
            // Received non-JSON (e.g. 504 Gateway Timeout HTML page)
            if (attempt === 1 && (res.status === 502 || res.status === 503 || res.status === 504 || res.status === 500)) {
              await new Promise(r => setTimeout(r, 1200));
              continue;
            }
            throw new Error("Server took too long to respond. Please click 'Analyze Menu with AI' again.");
          }
        } catch (fetchErr) {
          if (attempt === 1) {
            await new Promise(r => setTimeout(r, 1200));
            continue;
          }
          throw fetchErr;
        }
      }

      if (!data || !res || !res.ok || !data.success) {
        throw new Error((data && data.error) || "Failed to analyze menu photos.");
      }

      const cats = Array.isArray(data.categories) ? data.categories : [];
      if (cats.length === 0) {
        showImportStatus("No dishes or categories could be identified in the uploaded photos. Please check lighting and clarity.", "error");
        return;
      }

      extractedCategories = cats.map(cat => ({
        id: "cat_" + Math.random().toString(36).substring(2, 9),
        name: cat.name || "GENERAL",
        items: (cat.items || []).map(item => ({
          id: "item_" + Math.random().toString(36).substring(2, 9),
          name: item.name || "",
          price: Number(item.price) || 0,
          description: item.description || "",
          selected: true
        }))
      }));

      showImportStatus(`✓ Extracted ${data.totalDishes || 0} dishes across ${extractedCategories.length} categories! Review below.`, "success");
      renderExtractedPreviewUI();

      if (importMenuView) importMenuView.classList.add("preview-active");
      if (importExtractedCard) {
        importExtractedCard.style.display = "flex";
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("AI Analysis Error:", err);
      showImportStatus(err.message || "Failed to analyze menu images.", "error");
    } finally {
      analyzeMenuBtn.disabled = false;
      if (analyzeSpinner) analyzeSpinner.style.display = "none";
      if (analyzeMenuBtnLabel) analyzeMenuBtnLabel.textContent = "Analyze Menu with AI";
    }
  });
}

function updateCommitCounter() {
  let count = 0;
  extractedCategories.forEach(cat => {
    cat.items.forEach(it => {
      if (it.selected) count++;
    });
  });

  if (importCommitCountLabel) {
    importCommitCountLabel.textContent = `${count} dish${count === 1 ? "" : "es"} selected for import`;
  }
  if (extractedSummaryPill) {
    extractedSummaryPill.textContent = `${count} Dishes Selected`;
  }
  if (importConfirmBtn) {
    importConfirmBtn.disabled = (count === 0);
  }
}

function parseDishName(rawName) {
  const safe = escapeHtml(rawName || "");
  const blockNotes = [];
  const parsedMain = safe.replace(/\(([^)]*)\)/g, (match, inner) => {
    const trimmedInner = inner.trim();
    if (trimmedInner.length > 6) {
      blockNotes.push(`(${trimmedInner})`);
      return '';
    } else {
      return `<span class="dish-note">(${trimmedInner})</span>`;
    }
  }).replace(/\s+/g, ' ').trim();

  return {
    mainNameHtml: parsedMain || safe,
    blockNotes: blockNotes
  };
}

function renderExtractedPreviewUI() {
  if (!importCategoriesContainer) return;
  importCategoriesContainer.innerHTML = "";

  if (importExtractedCategoryCount) {
    const catCount = extractedCategories.length;
    importExtractedCategoryCount.textContent = `${catCount} Categor${catCount === 1 ? "y" : "ies"} Loaded`;
  }

  extractedCategories.forEach(category => {
    const card = document.createElement("div");
    card.className = "import-category-card";

    // Header
    const header = document.createElement("div");
    header.className = "import-category-header";

    const titleWrap = document.createElement("div");
    titleWrap.className = "import-category-title-wrap";

    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.className = "import-category-input";
    titleInput.value = category.name;
    titleInput.addEventListener("input", (e) => {
      category.name = e.target.value.toUpperCase();
    });

    const countBadge = document.createElement("span");
    countBadge.className = "import-category-dish-count";
    countBadge.textContent = `${category.items.length} ${category.items.length === 1 ? "item" : "items"}`;

    titleWrap.appendChild(titleInput);
    titleWrap.appendChild(countBadge);

    header.appendChild(titleWrap);
    card.appendChild(header);

    // Dishes List
    const dishesList = document.createElement("div");
    dishesList.className = "import-dishes-list";

    category.items.forEach(item => {
      const row = document.createElement("div");
      row.className = `import-dish-row ${item.selected ? "" : "unchecked"}`;

      // Checkbox
      const check = document.createElement("input");
      check.type = "checkbox";
      check.className = "import-dish-check";
      check.checked = !!item.selected;
      check.addEventListener("change", () => {
        item.selected = check.checked;
        row.classList.toggle("unchecked", !check.checked);
        updateCommitCounter();
      });

      // Fields (Dish Name)
      const fieldsWrap = document.createElement("div");
      fieldsWrap.className = "import-dish-fields";

      const nameWrap = document.createElement("div");
      nameWrap.className = "import-dish-name-wrap";
      nameWrap.title = "Click to edit dish name";

      function renderNameDisplay() {
        const { mainNameHtml, blockNotes } = parseDishName(item.name);
        const blockHtml = blockNotes.length > 0
          ? `<div class="dish-note-block">${blockNotes.join(' ')}</div>`
          : '';
        nameWrap.innerHTML = `
          <div class="import-dish-name-text">${mainNameHtml}</div>
          ${blockHtml}
        `;
      }

      renderNameDisplay();

      nameWrap.addEventListener("click", () => {
        if (nameWrap.querySelector("textarea")) return;

        const textarea = document.createElement("textarea");
        textarea.className = "import-dish-name-textarea";
        textarea.value = item.name;
        textarea.rows = 1;
        nameWrap.innerHTML = "";
        nameWrap.appendChild(textarea);

        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
        textarea.focus();
        textarea.select();

        textarea.addEventListener("input", () => {
          textarea.style.height = "auto";
          textarea.style.height = `${textarea.scrollHeight}px`;
          item.name = textarea.value;
        });

        textarea.addEventListener("keydown", (e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            textarea.blur();
          }
        });

        textarea.addEventListener("blur", () => {
          const val = textarea.value.trim();
          if (val) item.name = val;
          renderNameDisplay();
        });
      });

      fieldsWrap.appendChild(nameWrap);

      // Price
      const priceWrap = document.createElement("div");
      priceWrap.className = "import-dish-price-wrap";

      const prefix = document.createElement("span");
      prefix.className = "import-dish-price-prefix";
      prefix.textContent = "₹";

      const priceInput = document.createElement("input");
      priceInput.type = "number";
      priceInput.className = "import-dish-price-input";
      priceInput.value = item.price;
      priceInput.min = "0";
      priceInput.step = "any";
      priceInput.style.width = `${Math.max(2, String(item.price).length + 0.5)}ch`;
      priceInput.addEventListener("input", (e) => {
        item.price = Number(e.target.value) || 0;
        priceInput.style.width = `${Math.max(2, String(e.target.value).length + 0.5)}ch`;
      });

      priceWrap.appendChild(prefix);
      priceWrap.appendChild(priceInput);

      // Delete Button
      const delDishBtn = document.createElement("button");
      delDishBtn.type = "button";
      delDishBtn.className = "import-dish-del-btn";
      delDishBtn.innerHTML = `✕`;
      delDishBtn.title = "Delete item";
      delDishBtn.setAttribute("aria-label", "Delete item");
      delDishBtn.addEventListener("click", () => {
        if (row.classList.contains("is-deleting")) return;
        row.classList.add("is-deleting");

        category.items = category.items.filter(it => it.id !== item.id);
        countBadge.textContent = `${category.items.length} ${category.items.length === 1 ? "item" : "items"}`;
        updateCommitCounter();

        setTimeout(() => {
          if (category.items.length === 0) {
            card.style.transition = "all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)";
            card.style.opacity = "0";
            card.style.transform = "scale(0.95)";
            card.style.maxHeight = `${card.offsetHeight}px`;
            setTimeout(() => {
              extractedCategories = extractedCategories.filter(c => c.id !== category.id);
              renderExtractedPreviewUI();
            }, 250);
          } else {
            row.remove();
          }
        }, 280);
      });

      row.appendChild(check);
      row.appendChild(fieldsWrap);
      row.appendChild(priceWrap);
      row.appendChild(delDishBtn);
      dishesList.appendChild(row);
    });

    card.appendChild(dishesList);
    importCategoriesContainer.appendChild(card);
  });

  updateCommitCounter();
}

// Bulk Controls
if (selectAllDishesBtn) {
  selectAllDishesBtn.addEventListener("click", () => {
    extractedCategories.forEach(cat => cat.items.forEach(it => it.selected = true));
    renderExtractedPreviewUI();
  });
}

if (deselectAllDishesBtn) {
  deselectAllDishesBtn.addEventListener("click", () => {
    extractedCategories.forEach(cat => cat.items.forEach(it => it.selected = false));
    renderExtractedPreviewUI();
  });
}

if (importAddCategoryBtn) {
  importAddCategoryBtn.addEventListener("click", () => {
    extractedCategories.unshift({
      id: "cat_" + Math.random().toString(36).substring(2, 9),
      name: "NEW CATEGORY",
      items: [
        {
          id: "item_" + Math.random().toString(36).substring(2, 9),
          name: "Dish Name",
          price: 100,
          description: "",
          selected: true
        }
      ]
    });
    renderExtractedPreviewUI();
  });
}

if (importClearBtn) {
  importClearBtn.addEventListener("click", () => {
    // Smooth exit for preview card and commit bar
    if (importExtractedCard) importExtractedCard.classList.add("is-exiting");
    const commitBar = document.querySelector(".import-commit-bar");
    if (commitBar) commitBar.classList.add("is-exiting");

    setTimeout(() => {
      extractedCategories = [];
      importSelectedFiles = [];
      if (manualImportTextarea) {
        manualImportTextarea.value = "";
      }
      renderSelectedPhotosUI();

      if (importExtractedCard) {
        importExtractedCard.classList.remove("is-exiting");
        importExtractedCard.style.display = "none";
      }
      if (commitBar) commitBar.classList.remove("is-exiting");

      document.documentElement.classList.remove("ai-loading-mode");
      document.body.classList.remove("ai-loading-mode");
      if (importMenuView) {
        importMenuView.classList.remove("preview-active");
        importMenuView.classList.remove("ai-loading-active");
      }
      if (importAiLoadingState) importAiLoadingState.style.display = "none";
      hideImportStatus();
      hideManualStatus();

      // Smooth entrance for manual card
      if (importManualCard) {
        importManualCard.classList.remove("is-entering");
        void importManualCard.offsetWidth; // trigger reflow
        importManualCard.classList.add("is-entering");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 200);
  });
}

// Open Strategy Dialog when 'Import to Menu' is clicked
if (importConfirmBtn) {
  importConfirmBtn.addEventListener("click", () => {
    let totalSelected = 0;
    extractedCategories.forEach(c => c.items.forEach(it => { if (it.selected) totalSelected++; }));

    if (totalSelected === 0) {
      alert("Please select at least one dish to import.");
      return;
    }

    if (importStrategyFormContent) importStrategyFormContent.style.display = "block";
    if (importStrategySuccessView) importStrategySuccessView.style.display = "none";
    if (confirmImportStrategyBtn) confirmImportStrategyBtn.disabled = false;
    if (importDialogSpinner) importDialogSpinner.style.display = "none";
    if (confirmImportStrategyBtnLabel) confirmImportStrategyBtnLabel.textContent = "Import";

    if (importStrategyModal) {
      openModal(importStrategyModal);
    }
  });
}

// Cancel Import Strategy Dialog
if (cancelImportStrategyBtn) {
  cancelImportStrategyBtn.addEventListener("click", () => {
    closeModal(importStrategyModal);
  });
}

// Close dialog when clicking outside on overlay
if (importStrategyModal) {
  importStrategyModal.addEventListener("click", (e) => {
    if (e.target === importStrategyModal) {
      closeModal(importStrategyModal);
    }
  });
}

// Execute Import from Strategy Dialog
if (confirmImportStrategyBtn) {
  confirmImportStrategyBtn.addEventListener("click", async () => {
    const selectedMode = document.querySelector('input[name="importDialogStrategy"]:checked')?.value || "append";

    let totalSelected = 0;
    extractedCategories.forEach(c => c.items.forEach(it => { if (it.selected) totalSelected++; }));

    if (totalSelected === 0) {
      alert("Please select at least one dish to import.");
      closeModal(importStrategyModal);
      return;
    }

    if (selectedMode === "replace") {
      const confirmReplace = confirm(
        "Warning: 'Replace Entire Menu' will delete your existing dishes and replace them with these imported items.\n\nAre you sure you want to proceed?"
      );
      if (!confirmReplace) return;
    }

    confirmImportStrategyBtn.disabled = true;
    if (importDialogSpinner) importDialogSpinner.style.display = "inline-block";
    if (confirmImportStrategyBtnLabel) confirmImportStrategyBtnLabel.textContent = "Importing...";

    try {
      const res = await fetch("/api/owner/batch-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categories: extractedCategories,
          mode: selectedMode
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to import menu items.");
      }

      // Show ONLY 'Success [green circle tick icon]' on the same dialog
      if (importStrategyFormContent) importStrategyFormContent.style.display = "none";
      if (importStrategySuccessView) importStrategySuccessView.style.display = "flex";

      // Reset import state
      extractedCategories = [];
      importSelectedFiles = [];
      if (manualImportTextarea) {
        manualImportTextarea.value = "";
      }
      renderSelectedPhotosUI();
      hideImportStatus();
      hideManualStatus();

      // Refresh dashboard menu editor in background
      renderDashboardView();

      // Keep dialog showing Success for 1.2 seconds, then smoothly close and return to dashboard
      setTimeout(() => {
        closeModal(importStrategyModal, () => {
          if (importStrategyFormContent) importStrategyFormContent.style.display = "block";
          if (importStrategySuccessView) importStrategySuccessView.style.display = "none";
          if (confirmImportStrategyBtn) confirmImportStrategyBtn.disabled = false;
          if (importDialogSpinner) importDialogSpinner.style.display = "none";
          if (confirmImportStrategyBtnLabel) confirmImportStrategyBtnLabel.textContent = "Import";
        });
        if (importExtractedCard) importExtractedCard.style.display = "none";
        if (importMenuView) importMenuView.classList.remove("preview-active");
        showView(dashboardView);
      }, 1200);
    } catch (err) {
      console.error("Batch Import Error:", err);
      alert(err.message || "Failed to import menu.");
      confirmImportStrategyBtn.disabled = false;
      if (importDialogSpinner) importDialogSpinner.style.display = "none";
      if (confirmImportStrategyBtnLabel) confirmImportStrategyBtnLabel.textContent = "Import";
    }
  });
}

function isInputOrEditable(el) {
  if (!el) return false;
  if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") return true;
  if (el.isContentEditable) return true;
  if (typeof el.getAttribute === "function") {
    const ce = el.getAttribute("contenteditable");
    if (ce !== null && ce !== "false") return true;
  }
  if (el.closest) {
    return !!el.closest("input, textarea, [contenteditable]:not([contenteditable='false']), .form-input, .category-inline-input, .dish-inline-input, .dish-price-input, .import-manual-textarea, .is-editing, .selectable-text");
  }
  return false;
}

// Allow native right-click context menu (copy, paste, cut, select all) on inputs & editable fields
document.addEventListener("contextmenu", (e) => {
  if (isInputOrEditable(e.target)) return;
  e.preventDefault();
});

// Disable text selection across owner portal except in inputs and editable fields
document.addEventListener("selectstart", (e) => {
  if (isInputOrEditable(e.target)) return;
  e.preventDefault();
});

// Re-verify session only if user is awaiting approval on the pending view
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && currentBusiness && currentBusiness.approvalStatus === "pending") {
    checkSession();
  }
});
window.addEventListener("focus", () => {
  if (currentBusiness && currentBusiness.approvalStatus === "pending") {
    checkSession();
  }
});

/* ==========================================================================
   Custom In-App Color Selector Modal (100% Consistent Across All Devices)
   ========================================================================== */
let activeColorTarget = null;
let activeColorInitialHex = "#991E2E";
let activeColorCurrentHex = "#991E2E";
let pickerHue = 0;
let pickerSat = 100;
let pickerVal = 100;
let isDraggingPickerCanvas = false;
let isCustomColorPickerInitialized = false;

function hexToRgb(hex) {
  let clean = (hex || "").replace("#", "").trim();
  if (clean.length === 3) clean = clean.split("").map(c => c + c).join("");
  if (clean.length !== 6) clean = "991E2E";
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

function rgbToHex(r, g, b) {
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
  return "#" + [clamp(r), clamp(g), clamp(b)].map(x => x.toString(16).padStart(2, "0")).join("").toUpperCase();
}

function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, v = max;
  const d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max === min) {
    h = 0;
  } else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, v: v * 100 };
}

function hsvToRgb(h, s, v) {
  h = ((h % 360) + 360) % 360;
  const c = (v / 100) * (s / 100);
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = (v / 100) - c;
  let r = 0, g = 0, b = 0;
  if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
  else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
  else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
  else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
  else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  };
}

function drawColorPickerCanvas() {
  const canvas = document.getElementById("colorPickerCanvas");
  const wrapper = document.getElementById("colorPickerCanvasWrapper");
  if (!canvas || !wrapper) return;
  const rect = wrapper.getBoundingClientRect();
  const w = Math.round(rect.width || 320);
  const h = Math.round(rect.height || 140);

  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, w, h);

  // Horizontal gradient: white to pure hue
  const gradH = ctx.createLinearGradient(0, 0, w, 0);
  gradH.addColorStop(0, "#ffffff");
  gradH.addColorStop(1, `hsl(${Math.round(pickerHue)}, 100%, 50%)`);
  ctx.fillStyle = gradH;
  ctx.fillRect(0, 0, w, h);

  // Vertical gradient: transparent to black
  const gradV = ctx.createLinearGradient(0, 0, 0, h);
  gradV.addColorStop(0, "rgba(0,0,0,0)");
  gradV.addColorStop(1, "#000000");
  ctx.fillStyle = gradV;
  ctx.fillRect(0, 0, w, h);
}

function updateColorPickerThumbPosition() {
  const wrapper = document.getElementById("colorPickerCanvasWrapper");
  const thumb = document.getElementById("colorPickerThumb");
  if (!wrapper || !thumb) return;
  const rect = wrapper.getBoundingClientRect();
  const w = rect.width || 320;
  const h = rect.height || 140;
  const x = (pickerSat / 100) * w;
  const y = ((100 - pickerVal) / 100) * h;
  thumb.style.left = x + "px";
  thumb.style.top = y + "px";
}

function applyActiveTargetColor(hex, source = null) {
  activeColorCurrentHex = hex.toUpperCase();
  const currentSwatch = document.getElementById("colorPickerCurrentSwatch");
  if (currentSwatch) currentSwatch.style.backgroundColor = activeColorCurrentHex;
  const hexInput = document.getElementById("colorPickerModalHexInput");
  if (hexInput && document.activeElement !== hexInput) {
    hexInput.value = activeColorCurrentHex.replace("#", "");
  }

  // Also update active card's indicator dot and hex input live
  const activeWrap = document.querySelector(`.theme-color-input-wrapper[data-color-target="${activeColorTarget}"]`);
  if (activeWrap) {
    const ind = activeWrap.querySelector(".theme-color-indicator");
    if (ind) ind.style.backgroundColor = activeColorCurrentHex;
    const cardHex = activeWrap.closest(".theme-custom-card")?.querySelector(".theme-hex-input");
    if (cardHex && document.activeElement !== cardHex) {
      cardHex.value = activeColorCurrentHex.replace("#", "");
    }
  }

  const nativeSource = `${activeColorTarget}Native`;
  const usedSource = source || nativeSource;

  switch (activeColorTarget) {
    case "top":
      updateThemeColorsUI(activeColorCurrentHex, null, null, null, usedSource);
      break;
    case "bg":
      updateThemeColorsUI(null, activeColorCurrentHex, null, null, usedSource);
      break;
    case "name":
      updateThemeColorsUI(null, null, activeColorCurrentHex, null, usedSource);
      break;
    case "item":
      updateThemeColorsUI(null, null, null, null, usedSource, activeColorCurrentHex, null, null, null);
      break;
    case "price":
      updateThemeColorsUI(null, null, null, null, usedSource, null, activeColorCurrentHex, null, null);
      break;
    case "category":
      updateThemeColorsUI(null, null, null, null, usedSource, null, null, activeColorCurrentHex, null);
      break;
    case "scroll":
      updateThemeColorsUI(null, null, null, null, usedSource, null, null, null, activeColorCurrentHex);
      break;
  }
}

function getActiveTargetCurrentHex(target) {
  switch (target) {
    case "top": return currentTopColor || "#991E2E";
    case "bg": return currentBgColor || "#FBEFE1";
    case "name": return currentNameColor || "#FFFFFF";
    case "item": return currentItemTextColor || "#000000";
    case "price": return currentPriceColor || "#731723";
    case "category": return currentCategoryColor || "#D05A00";
    case "scroll": return currentScrollPointsColor || "#731723";
    default: return "#991E2E";
  }
}

function setPickerFromHex(hex, updateLive = true) {
  const rgb = hexToRgb(hex);
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
  pickerHue = hsv.h;
  pickerSat = hsv.s;
  pickerVal = hsv.v;

  const slider = document.getElementById("colorPickerHueSlider");
  if (slider) slider.value = Math.round(pickerHue);

  drawColorPickerCanvas();
  updateColorPickerThumbPosition();

  if (updateLive) {
    applyActiveTargetColor(rgbToHex(rgb.r, rgb.g, rgb.b));
  } else {
    activeColorCurrentHex = hex.toUpperCase();
    const currentSwatch = document.getElementById("colorPickerCurrentSwatch");
    if (currentSwatch) currentSwatch.style.backgroundColor = activeColorCurrentHex;
    const hexInput = document.getElementById("colorPickerModalHexInput");
    if (hexInput) hexInput.value = activeColorCurrentHex.replace("#", "");
  }
}

function handleCanvasPointer(e) {
  const wrapper = document.getElementById("colorPickerCanvasWrapper");
  if (!wrapper) return;
  const rect = wrapper.getBoundingClientRect();
  const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
  const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

  pickerSat = (x / rect.width) * 100;
  pickerVal = 100 - (y / rect.height) * 100;

  const thumb = document.getElementById("colorPickerThumb");
  if (thumb) {
    thumb.style.left = x + "px";
    thumb.style.top = y + "px";
  }

  const rgb = hsvToRgb(pickerHue, pickerSat, pickerVal);
  applyActiveTargetColor(rgbToHex(rgb.r, rgb.g, rgb.b));
}

function openCustomColorPicker(targetKey, title) {
  const selectorEl = document.getElementById("onpageColorSelector");
  if (activeColorTarget === targetKey && selectorEl && selectorEl.style.display !== "none") {
    closeCustomColorPicker();
    return;
  }

  activeColorTarget = targetKey;
  activeColorInitialHex = getActiveTargetCurrentHex(targetKey);
  activeColorCurrentHex = activeColorInitialHex;

  const wrap = document.querySelector(`.theme-color-input-wrapper[data-color-target="${targetKey}"]`);
  const card = wrap ? wrap.closest(".theme-custom-card") : null;

  document.querySelectorAll(".theme-custom-card.is-picker-active").forEach(c => c.classList.remove("is-picker-active"));

  if (card && selectorEl) {
    card.classList.add("is-picker-active");
    card.insertAdjacentElement("afterend", selectorEl);
    selectorEl.style.display = "block";
  }

  const titleEl = document.getElementById("onpageColorTargetName");
  if (titleEl) titleEl.textContent = title || "Select Color";

  const prevSwatch = document.getElementById("colorPickerPreviousSwatch");
  if (prevSwatch) {
    prevSwatch.style.backgroundColor = activeColorInitialHex;
    prevSwatch.setAttribute("title", `Initial color: ${activeColorInitialHex} (click to revert)`);
  }

  // If editing Business Name color, ensure business name is visible in mockup
  if (targetKey === "name") {
    const themeMockupLogo = document.getElementById("themeMockupLogo");
    if (themeMockupLogo && themeMockupLogo.style.display !== "none") {
      themeMockupLogo.style.display = "none";
      themeMockupLogo.setAttribute("data-was-visible", "true");
    }
    if (themeMockupBizName) {
      themeMockupBizName.style.display = "block";
    }
  }

  requestAnimationFrame(() => {
    drawColorPickerCanvas();
    setPickerFromHex(activeColorInitialHex, false);
    if (card && typeof card.scrollIntoView === "function") {
      card.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });
}

function closeCustomColorPicker() {
  const selectorEl = document.getElementById("onpageColorSelector");
  if (selectorEl) selectorEl.style.display = "none";
  document.querySelectorAll(".theme-custom-card.is-picker-active").forEach(c => c.classList.remove("is-picker-active"));

  // Restore logo if it was temporarily hidden to preview name color
  const themeMockupLogo = document.getElementById("themeMockupLogo");
  if (themeMockupLogo && themeMockupLogo.getAttribute("data-was-visible") === "true") {
    themeMockupLogo.style.display = "block";
    themeMockupLogo.removeAttribute("data-was-visible");
    if (themeMockupBizName) themeMockupBizName.style.display = "none";
  }

  activeColorTarget = null;
}

function initCustomColorPicker() {
  const wrapper = document.getElementById("colorPickerCanvasWrapper");
  const slider = document.getElementById("colorPickerHueSlider");
  const hexInput = document.getElementById("colorPickerModalHexInput");
  const doneBtn = document.getElementById("onpageColorDoneBtn");
  const revertBtn = document.getElementById("onpageColorRevertBtn");
  const prevSwatch = document.getElementById("colorPickerPreviousSwatch");

  if (isCustomColorPickerInitialized) return;
  isCustomColorPickerInitialized = true;

  // Canvas pointer drag (mouse & touch)
  if (wrapper) {
    wrapper.addEventListener("pointerdown", (e) => {
      isDraggingPickerCanvas = true;
      try { wrapper.setPointerCapture(e.pointerId); } catch (_) {}
      handleCanvasPointer(e);
    });

    wrapper.addEventListener("pointermove", (e) => {
      if (isDraggingPickerCanvas) {
        handleCanvasPointer(e);
      }
    });

    const endDrag = (e) => {
      if (isDraggingPickerCanvas) {
        isDraggingPickerCanvas = false;
        try { wrapper.releasePointerCapture(e.pointerId); } catch (_) {}
      }
    };
    wrapper.addEventListener("pointerup", endDrag);
    wrapper.addEventListener("pointercancel", endDrag);
  }

  // Hue slider
  if (slider) {
    slider.addEventListener("input", (e) => {
      pickerHue = parseFloat(e.target.value) || 0;
      drawColorPickerCanvas();
      const rgb = hsvToRgb(pickerHue, pickerSat, pickerVal);
      applyActiveTargetColor(rgbToHex(rgb.r, rgb.g, rgb.b));
    });
  }

  // Hex input inside inline picker
  if (hexInput) {
    hexInput.addEventListener("input", (e) => {
      const raw = e.target.value.replace(/[^0-9A-Fa-f]/g, "").slice(0, 6);
      e.target.value = raw.toUpperCase();
      if (raw.length === 6) {
        setPickerFromHex("#" + raw, true);
      }
    });
    hexInput.addEventListener("blur", () => {
      hexInput.value = activeColorCurrentHex.replace("#", "");
    });
  }

  // Revert buttons
  const doRevert = () => {
    if (activeColorInitialHex) {
      setPickerFromHex(activeColorInitialHex, true);
    }
  };
  if (revertBtn) revertBtn.addEventListener("click", doRevert);
  if (prevSwatch) prevSwatch.addEventListener("click", doRevert);

  // Done button
  if (doneBtn) doneBtn.addEventListener("click", () => closeCustomColorPicker());

  // Attach click to color wrappers and whole card row
  document.querySelectorAll(".theme-custom-card").forEach(card => {
    const wrap = card.querySelector(".theme-color-input-wrapper[data-color-target]");
    if (!wrap) return;

    const target = wrap.getAttribute("data-color-target");
    const title = wrap.getAttribute("data-color-title");

    card.addEventListener("click", (e) => {
      if (e.target.closest(".theme-hex-input-wrapper")) return; // let user type hex directly
      openCustomColorPicker(target, title);
    });

    wrap.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openCustomColorPicker(target, title);
      }
    });
  });
}

// Start initialization on page load
document.addEventListener("DOMContentLoaded", () => {
  checkSession();
  initStickyBarScroll();
  initCustomColorPicker();
});


