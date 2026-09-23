// Super-Admin Portal Logic
let currentAdmin = null;
let allBusinesses = [];
let auditLogs = [];

// DOM Elements
const loadingView = document.getElementById("loadingView");
const authView = document.getElementById("authView");
const dashboardView = document.getElementById("dashboardView");
const adminProfileArea = document.getElementById("adminProfileArea");
const adminAvatar = document.getElementById("adminAvatar");
const adminName = document.getElementById("adminName");
const logoutBtn = document.getElementById("logoutBtn");
const notificationBanner = document.getElementById("notificationBanner");

// Stats Elements
const statPendingCount = document.getElementById("statPendingCount");
const statTotalBizCount = document.getElementById("statTotalBizCount");
const statActiveCount = document.getElementById("statActiveCount");
const pendingTabBadge = document.getElementById("pendingTabBadge");

// Tables & Tab Containers
const tabButtons = document.querySelectorAll(".admin-tab");
const tabContentPending = document.getElementById("tabContentPending");
const tabContentAll = document.getElementById("tabContentAll");
const tabContentAudit = document.getElementById("tabContentAudit");

const pendingTableBody = document.getElementById("pendingTableBody");
const emptyPendingState = document.getElementById("emptyPendingState");
const allBizTableBody = document.getElementById("allBizTableBody");
const auditTableBody = document.getElementById("auditTableBody");

const refreshPendingBtn = document.getElementById("refreshPendingBtn");
const refreshAllBtn = document.getElementById("refreshAllBtn");
const refreshLogsBtn = document.getElementById("refreshLogsBtn");

// Subscription Modal Elements
const subModal = document.getElementById("subModal");
const subModalTitle = document.getElementById("subModalTitle");
const subForm = document.getElementById("subForm");
const subBizIdInput = document.getElementById("subBizIdInput");
const subStatusSelect = document.getElementById("subStatusSelect");
const subExpiryInput = document.getElementById("subExpiryInput");
const featCustomDomain = document.getElementById("featCustomDomain");
const featOnlineOrdering = document.getElementById("featOnlineOrdering");
const featAnalytics = document.getElementById("featAnalytics");
const closeSubModalBtn = document.getElementById("closeSubModalBtn");
const cancelSubModalBtn = document.getElementById("cancelSubModalBtn");

// Dev Auth Form
const adminDevLoginBox = document.getElementById("adminDevLoginBox");
const adminDevAuthForm = document.getElementById("adminDevAuthForm");
const adminDevEmail = document.getElementById("adminDevEmail");
const isLocalEnv = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
if (adminDevLoginBox && isLocalEnv) {
  adminDevLoginBox.style.display = "block";
}

/**
 * Show notification toast/banner
 */
function showNotification(message, type = "error") {
  notificationBanner.textContent = message;
  notificationBanner.className = `notification-banner ${type}`;
  notificationBanner.style.display = "block";
  setTimeout(() => {
    notificationBanner.style.display = "none";
  }, 6000);
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
      }, 850);
    }
  });
}

// Safety fallback timer to ensure page dissolves even on slow networks
setTimeout(revealPage, 2200);

/**
 * Switch top views
 */
function showView(view) {
  [loadingView, authView, dashboardView].forEach(v => {
    if (v) v.style.display = "none";
  });
  if (view) view.style.display = view === dashboardView ? "block" : "flex";
}

/**
 * Check Admin Session
 */
async function checkAdminSession() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const autoDevEmail = urlParams.get("dev_login");
    if (autoDevEmail && !currentAdmin) {
      try {
        await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ devEmail: autoDevEmail, devName: "Super Admin" })
        });
      } catch (e) {}
    }

    const res = await fetch("/api/auth/me");
    const data = await res.json();

    if (data.success && data.authenticated && data.user) {
      if (data.user.role === "admin") {
        currentAdmin = data.user;
        updateHeader();
        showView(dashboardView);
        await Promise.all([fetchBusinesses(), fetchAuditLogs()]);
        if (urlParams.get("tab")) switchTab(urlParams.get("tab"));
        revealPage();
      } else {
        currentAdmin = null;
        showView(authView);
        showNotification("Access denied: You are signed in as a Restaurant Owner, not a Super Admin.", "error");
        revealPage();
      }
    } else {
      currentAdmin = null;
      adminProfileArea.style.display = "none";
      showView(authView);
      setupGoogleButton();
      revealPage();
    }
  } catch (err) {
    console.error("Admin session error:", err);
    showView(authView);
    showNotification("Failed to connect to authentication server.", "error");
    revealPage();
  }
}

/**
 * Header Profile update
 */
function updateHeader() {
  if (!currentAdmin) return;
  adminName.textContent = currentAdmin.name || currentAdmin.email;
  if (currentAdmin.picture) {
    adminAvatar.src = currentAdmin.picture;
  } else {
    adminAvatar.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23991e2e'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";
  }
  adminProfileArea.style.display = "flex";
}

/**
 * Fetch All Businesses
 */
async function fetchBusinesses() {
  try {
    const res = await fetch("/api/admin/businesses");
    const data = await res.json();

    if (data.success) {
      allBusinesses = data.businesses || [];
      renderStats();
      renderPendingTable();
      renderAllBizTable();
    } else {
      showNotification(data.error || "Failed to load businesses.", "error");
    }
  } catch (err) {
    console.error("fetchBusinesses error:", err);
    showNotification("Network error loading businesses.", "error");
  }
}

/**
 * Fetch Audit Logs
 */
async function fetchAuditLogs() {
  try {
    const res = await fetch("/api/admin/logs");
    const data = await res.json();

    if (data.success) {
      auditLogs = data.logs || [];
      renderAuditLogsTable();
    }
  } catch (err) {
    console.error("fetchAuditLogs error:", err);
  }
}

/**
 * Update Top Counters
 */
function renderStats() {
  const pending = allBusinesses.filter(b => b.approvalStatus === "pending");
  const active = allBusinesses.filter(b => b.approvalStatus === "approved" && b.isPublished);

  statPendingCount.textContent = pending.length;
  statTotalBizCount.textContent = allBusinesses.length;
  statActiveCount.textContent = active.length;

  if (pending.length > 0) {
    pendingTabBadge.textContent = pending.length;
    pendingTabBadge.style.display = "inline-block";
  } else {
    pendingTabBadge.style.display = "none";
  }
}

/**
 * Render Pending Applications
 */
function renderPendingTable() {
  pendingTableBody.innerHTML = "";
  const pending = allBusinesses.filter(b => b.approvalStatus === "pending");

  if (pending.length === 0) {
    emptyPendingState.style.display = "block";
    return;
  }
  emptyPendingState.style.display = "none";

  pending.forEach(biz => {
    const tr = document.createElement("tr");
    const dateStr = biz.createdAt ? new Date(biz.createdAt).toLocaleDateString() : "Recent";
    const ownerName = (biz.owner && biz.owner.name) || "Unknown Owner";
    const ownerEmail = (biz.owner && biz.owner.email) || "";

    tr.innerHTML = `
      <td>
        <strong>${escapeHtml(biz.name)}</strong>
        <div style="font-size:0.78rem; color:#64748b;">${escapeHtml(biz.address || "No address provided")}</div>
      </td>
      <td>
        <div>${escapeHtml(ownerName)}</div>
        <div style="font-size:0.78rem; color:#64748b;">${escapeHtml(ownerEmail)}</div>
      </td>
      <td>
        <a href="/r/${biz.slug}" target="_blank" style="color:#991e2e; font-weight:600; text-decoration:none;">/r/${biz.slug} &nearr;</a>
      </td>
      <td>${dateStr}</td>
      <td>
        <span class="status-pill pending">Pending Review</span>
      </td>
      <td>
        <div class="btn-action-group">
          <button type="button" class="btn-admin btn-approve approve-btn" data-id="${biz._id}">Approve</button>
          <button type="button" class="btn-admin btn-reject reject-btn" data-id="${biz._id}">Reject</button>
        </div>
      </td>
    `;

    tr.querySelector(".approve-btn").addEventListener("click", () => handleApproval(biz._id, "approved"));
    tr.querySelector(".reject-btn").addEventListener("click", () => handleApproval(biz._id, "rejected"));

    pendingTableBody.appendChild(tr);
  });
}

/**
 * Render All Businesses Table
 */
function renderAllBizTable() {
  allBizTableBody.innerHTML = "";

  allBusinesses.forEach(biz => {
    const tr = document.createElement("tr");
    const ownerName = (biz.owner && biz.owner.name) || "Unknown";
    const ownerEmail = (biz.owner && biz.owner.email) || "";
    const catCount = (biz.stats && biz.stats.categories) || 0;
    const itemCount = (biz.stats && biz.stats.items) || 0;

    let statusPillClass = "pending";
    if (biz.approvalStatus === "approved") statusPillClass = "approved";
    if (biz.approvalStatus === "rejected") statusPillClass = "rejected";
    if (biz.approvalStatus === "suspended") statusPillClass = "suspended";

    tr.innerHTML = `
      <td>
        <strong>${escapeHtml(biz.name)}</strong>
        <div style="font-size:0.78rem; color:#64748b;">${escapeHtml(biz.address || "")}</div>
      </td>
      <td>
        <div>${escapeHtml(ownerName)}</div>
        <div style="font-size:0.78rem; color:#64748b;">${escapeHtml(ownerEmail)}</div>
      </td>
      <td>
        <span class="status-pill ${statusPillClass}">${biz.approvalStatus}</span>
      </td>
      <td>
        <span class="sub-pill ${biz.subscriptionStatus === "active" ? "active" : ""}">${biz.subscriptionStatus || "TRIAL"}</span>
      </td>
      <td>
        <span style="font-weight:600; color:#334155;">${catCount}</span> cats, <span style="font-weight:600; color:#334155;">${itemCount}</span> items
      </td>
      <td>
        <a href="/r/${biz.slug}" target="_blank" style="color:#991e2e; font-size:0.82rem; font-weight:600;">/r/${biz.slug} &nearr;</a>
      </td>
      <td>
        <div class="btn-action-group">
          ${biz.approvalStatus === "approved" 
            ? `<button type="button" class="btn-admin btn-suspend suspend-btn" data-id="${biz._id}">Suspend</button>` 
            : biz.approvalStatus === "suspended"
            ? `<button type="button" class="btn-admin btn-reactivate reactivate-btn" data-id="${biz._id}">Reactivate</button>`
            : `<button type="button" class="btn-admin btn-approve approve-btn" data-id="${biz._id}">Approve</button>`
          }
          <button type="button" class="btn-admin btn-settings config-sub-btn" data-id="${biz._id}">Tier &amp; Features</button>
        </div>
      </td>
    `;

    const suspendBtn = tr.querySelector(".suspend-btn");
    if (suspendBtn) suspendBtn.addEventListener("click", () => handleApproval(biz._id, "suspended"));

    const reactivateBtn = tr.querySelector(".reactivate-btn");
    if (reactivateBtn) reactivateBtn.addEventListener("click", () => handleApproval(biz._id, "approved"));

    const approveBtn = tr.querySelector(".approve-btn");
    if (approveBtn) approveBtn.addEventListener("click", () => handleApproval(biz._id, "approved"));

    tr.querySelector(".config-sub-btn").addEventListener("click", () => openSubModal(biz));

    allBizTableBody.appendChild(tr);
  });
}

/**
 * Render Audit Logs
 */
function renderAuditLogsTable() {
  auditTableBody.innerHTML = "";

  if (auditLogs.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="5" style="text-align:center; padding:24px; color:#64748b;">No administrative actions logged yet.</td>`;
    auditTableBody.appendChild(tr);
    return;
  }

  auditLogs.forEach(log => {
    const tr = document.createElement("tr");
    const timeStr = log.timestamp ? new Date(log.timestamp).toLocaleString() : "";
    const detailsStr = log.details ? JSON.stringify(log.details) : "";

    tr.innerHTML = `
      <td style="white-space:nowrap; font-size:0.82rem; color:#64748b;">${timeStr}</td>
      <td><strong>${escapeHtml(log.adminEmail || "Admin")}</strong></td>
      <td><span style="font-weight:700; color:#0f172a; font-size:0.8rem; background:#f1f5f9; padding:2px 8px; border-radius:4px;">${log.action}</span></td>
      <td style="font-family:monospace; font-size:0.8rem; color:#64748b;">${log.targetId || "-"}</td>
      <td style="font-size:0.8rem; color:#334155; max-width:320px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(detailsStr)}</td>
    `;
    auditTableBody.appendChild(tr);
  });
}

/**
 * Handle Business Status Change (Approve, Reject, Suspend)
 */
async function handleApproval(businessId, approvalStatus) {
  let reason = null;
  if (approvalStatus === "rejected") {
    reason = prompt("Please enter a reason for rejection (optional):");
    if (reason === null) return; // cancelled
  }
  if (approvalStatus === "suspended") {
    if (!confirm("Are you sure you want to suspend this restaurant? Their public menu and owner portal will be locked.")) return;
  }

  try {
    const res = await fetch("/api/admin/businesses", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: businessId, approvalStatus, reason })
    });
    const data = await res.json();

    if (data.success) {
      showNotification(`Restaurant status updated to: ${approvalStatus}`, "success");
      await Promise.all([fetchBusinesses(), fetchAuditLogs()]);
    } else {
      showNotification(data.error || "Failed to update business status.", "error");
    }
  } catch (err) {
    showNotification("Network error processing action.", "error");
  }
}

/**
 * Subscription & Features Modal
 */
function openSubModal(biz) {
  subBizIdInput.value = biz._id;
  subModalTitle.textContent = `Subscription: ${biz.name}`;
  subStatusSelect.value = biz.subscriptionStatus || "trial";

  if (biz.subscriptionExpiry) {
    subExpiryInput.value = new Date(biz.subscriptionExpiry).toISOString().split("T")[0];
  } else {
    subExpiryInput.value = "";
  }

  const flags = biz.enabledFeatures || {};
  featCustomDomain.checked = !!flags.customDomain;
  featOnlineOrdering.checked = !!flags.onlineOrdering;
  featAnalytics.checked = !!flags.analytics;

  subModal.style.display = "flex";
}

function closeSubModal() {
  subModal.style.display = "none";
}

closeSubModalBtn.addEventListener("click", closeSubModal);
cancelSubModalBtn.addEventListener("click", closeSubModal);

subForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = subBizIdInput.value;
  const subscriptionStatus = subStatusSelect.value;
  const subscriptionExpiry = subExpiryInput.value ? new Date(subExpiryInput.value).toISOString() : null;
  const enabledFeatures = {
    customDomain: featCustomDomain.checked,
    onlineOrdering: featOnlineOrdering.checked,
    analytics: featAnalytics.checked
  };

  try {
    const res = await fetch("/api/admin/subscriptions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, subscriptionStatus, subscriptionExpiry, enabledFeatures })
    });
    const data = await res.json();

    if (data.success) {
      closeSubModal();
      showNotification("Subscription & features updated successfully!", "success");
      await Promise.all([fetchBusinesses(), fetchAuditLogs()]);
    } else {
      showNotification(data.error || "Failed to update subscription.", "error");
    }
  } catch (err) {
    showNotification("Network error updating subscription.", "error");
  }
});

/**
 * Tab Navigation Switcher
 */
function switchTab(tab) {
  tabButtons.forEach(b => {
    if (b.dataset.tab === tab) b.classList.add("active");
    else b.classList.remove("active");
  });

  tabContentPending.style.display = tab === "pending" ? "block" : "none";
  tabContentAll.style.display = tab === "all" ? "block" : "none";
  tabContentAudit.style.display = tab === "audit" ? "block" : "none";
}

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    switchTab(btn.dataset.tab);
  });
});

refreshPendingBtn.addEventListener("click", () => fetchBusinesses());
refreshAllBtn.addEventListener("click", () => fetchBusinesses());
refreshLogsBtn.addEventListener("click", () => fetchAuditLogs());

/**
 * Admin Fast Dev Login
 */
adminDevAuthForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const devEmail = adminDevEmail.value.trim();
  if (!devEmail) return;

  try {
    const res = await fetch("/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ devEmail, devName: "Super Admin" })
    });
    const data = await res.json();
    if (data.success) {
      checkAdminSession();
    } else {
      showNotification(data.error || "Sign in failed.", "error");
    }
  } catch (err) {
    showNotification("Network error during admin sign in.", "error");
  }
});

/**
 * Setup Google Sign-In button
 */
async function setupGoogleButton() {
  let clientId = "";
  try {
    const configRes = await fetch("/api/auth/config");
    const configData = await configRes.json();
    if (configData && configData.isConfigured) {
      clientId = configData.googleClientId;
    }
  } catch (e) {}

  const slot = document.getElementById("googleBtnSlot");
  if (!slot) return;

  if (clientId) {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            if (!response || !response.credential) return;
            const res = await fetch("/api/auth/google", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ credential: response.credential })
            });
            const data = await res.json();
            if (data.success) checkAdminSession();
            else {
              showView(authView);
              showNotification(data.error || "Login failed.", "error");
            }
          }
        });
        slot.innerHTML = "";
        window.google.accounts.id.renderButton(
          slot,
          { theme: "outline", size: "large", width: 280 }
        );
      } catch (e) {}
    }
  } else {
    slot.innerHTML = `
      <div style="font-size:0.85rem; color:#64748b; margin-bottom:12px; background:#f8fafc; padding:10px; border-radius:8px; border:1px solid #e2e8f0;">
        <strong>Google OAuth Not Configured:</strong> Set <code>GOOGLE_CLIENT_ID</code> in <code>.env</code> to activate live Google Sign-In.
      </div>
    `;
  }
}

/**
 * Logout
 */
logoutBtn.addEventListener("click", async () => {
  await fetch("/api/auth/logout", { method: "POST" });
  currentAdmin = null;
  checkAdminSession();
});

/**
 * Safe HTML escape helper
 */
function escapeHtml(str) {
  if (!str) return "";
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// Init
document.addEventListener("DOMContentLoaded", async () => {
  try {
    await checkAdminSession();
  } finally {
    revealPage();
  }
});
