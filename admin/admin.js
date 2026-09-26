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
const expiredTabBadge = document.getElementById("expiredTabBadge");

// Tables & Tab Containers
const tabButtons = document.querySelectorAll(".admin-tab");
const tabContentPending = document.getElementById("tabContentPending");
const tabContentExpired = document.getElementById("tabContentExpired");
const tabContentAll = document.getElementById("tabContentAll");
const tabContentAudit = document.getElementById("tabContentAudit");

const pendingTableBody = document.getElementById("pendingTableBody");
const emptyPendingState = document.getElementById("emptyPendingState");
const allBizTableBody = document.getElementById("allBizTableBody");
const emptyAllBizState = document.getElementById("emptyAllBizState");
const auditTableBody = document.getElementById("auditTableBody");
const emptyAuditState = document.getElementById("emptyAuditState");

// Mobile Cards Containers
const pendingCardsList = document.getElementById("pendingCardsList");
const allBizCardsList = document.getElementById("allBizCardsList");
const auditCardsList = document.getElementById("auditCardsList");

// Search & Filter Controls
const pendingSearchInput = document.getElementById("pendingSearchInput");
const bizSearchInput = document.getElementById("bizSearchInput");
const bizStatusFilter = document.getElementById("bizStatusFilter");
const auditSearchInput = document.getElementById("auditSearchInput");

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

// Approval Duration Modal Elements
const approvalModal = document.getElementById("approvalModal");
const approvalModalTitle = document.getElementById("approvalModalTitle");
const approvalForm = document.getElementById("approvalForm");
const approvalBizIdInput = document.getElementById("approvalBizIdInput");
const approvalDaysInput = document.getElementById("approvalDaysInput");
const approvalExpiryText = document.getElementById("approvalExpiryText");
const cancelApprovalModalBtn = document.getElementById("cancelApprovalModalBtn");
const presetChips = document.querySelectorAll(".preset-chip");

// Dev Auth Form
const adminDevLoginBox = document.getElementById("adminDevLoginBox");
const adminDevAuthForm = document.getElementById("adminDevAuthForm");
const adminDevEmail = document.getElementById("adminDevEmail");
const isLocalEnv = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
if (adminDevLoginBox && isLocalEnv) {
  adminDevLoginBox.style.display = "block";
}

/**
 * Show notification toast/banner (Flash messages removed across project)
 */
function showNotification(message, type = "error") {
  if (type === "error") {
    console.error("[Admin Error]:", message);
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
  if (view) {
    view.style.display = "flex";
    if (view === dashboardView) {
      requestAnimationFrame(updateTabSlider);
      setTimeout(updateTabSlider, 50);
      setTimeout(updateTabSlider, 150);
    }
  }
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

    if (!res.ok) {
      currentAdmin = null;
      window.location.replace("/");
      return;
    }

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
        window.location.replace("/?auth_error=" + encodeURIComponent("Access denied: You are signed in as a Restaurant Owner, not a Super Admin."));
      }
    } else {
      currentAdmin = null;
      window.location.replace("/");
    }
  } catch (err) {
    console.error("Admin session error:", err);
    window.location.replace("/");
  }
}

/**
 * Header Profile update
 */
function updateHeader() {
  if (!currentAdmin) return;
  if (adminName) adminName.textContent = currentAdmin.name || currentAdmin.email;
  if (adminAvatar) {
    if (currentAdmin.picture) {
      adminAvatar.src = currentAdmin.picture;
    } else {
      adminAvatar.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23991e2e'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";
    }
  }
  if (adminProfileArea) adminProfileArea.style.display = "flex";
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
      renderExpiredTable();
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

function isBusinessExpired(b) {
  if (b.approvalStatus === "suspended") return true;
  if (b.approvalExpiry && new Date(b.approvalExpiry) < new Date()) return true;
  return false;
}

/**
 * Update Top Counters
 */
function renderStats() {
  const pending = allBusinesses.filter(b => b.approvalStatus === "pending");
  const expired = allBusinesses.filter(isBusinessExpired);
  const active = allBusinesses.filter(b => b.approvalStatus === "approved" && b.isPublished && !isBusinessExpired(b));

  if (statPendingCount) statPendingCount.textContent = pending.length;
  if (statTotalBizCount) statTotalBizCount.textContent = allBusinesses.length;
  if (statActiveCount) statActiveCount.textContent = active.length;

  if (pendingTabBadge) {
    if (pending.length > 0) {
      pendingTabBadge.textContent = pending.length;
      pendingTabBadge.style.display = "inline-block";
    } else {
      pendingTabBadge.style.display = "none";
    }
  }

  const expBadge = document.getElementById("expiredTabBadge");
  if (expBadge) {
    if (expired.length > 0) {
      expBadge.textContent = expired.length;
      expBadge.style.display = "inline-block";
    } else {
      expBadge.style.display = "none";
    }
  }
  requestAnimationFrame(updateTabSlider);
  setTimeout(updateTabSlider, 50);
}

/**
 * Render Pending Applications (Desktop Table + Mobile Cards)
 */
function renderPendingTable() {
  pendingTableBody.innerHTML = "";
  if (pendingCardsList) pendingCardsList.innerHTML = "";

  const query = pendingSearchInput ? pendingSearchInput.value.toLowerCase().trim() : "";
  let pending = allBusinesses.filter(b => b.approvalStatus === "pending");

  if (query) {
    pending = pending.filter(biz => {
      const name = (biz.name || "").toLowerCase();
      const addr = (biz.address || "").toLowerCase();
      const slug = (biz.slug || "").toLowerCase();
      const ownerName = (biz.owner && biz.owner.name ? biz.owner.name : "").toLowerCase();
      const ownerEmail = (biz.owner && biz.owner.email ? biz.owner.email : "").toLowerCase();
      return name.includes(query) || addr.includes(query) || slug.includes(query) || ownerName.includes(query) || ownerEmail.includes(query);
    });
  }

  if (pending.length === 0) {
    if (emptyPendingState) emptyPendingState.style.display = "flex";
    return;
  }
  if (emptyPendingState) emptyPendingState.style.display = "none";

  pending.forEach(biz => {
    const dateStr = biz.createdAt ? new Date(biz.createdAt).toLocaleDateString() : "Recent";
    const ownerName = (biz.owner && biz.owner.name) || "Unknown Owner";
    const ownerEmail = (biz.owner && biz.owner.email) || "";

    // 1. Desktop Table Row (>= 768px)
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <div style="display: flex; align-items: center; gap: 8px;">
          <strong>${escapeHtml(biz.name)}</strong>
          <button type="button" class="info-btn" title="View details" aria-label="View application details" style="background: transparent; border: none; cursor: pointer; color: #64748b; padding: 0; display: inline-flex; align-items: center; justify-content: center; line-height: 1;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </button>
        </div>
      </td>
      <td>
        <div>${escapeHtml(ownerName)}</div>
        <div style="font-size:0.78rem; color:#64748b;">${escapeHtml(ownerEmail)}</div>
      </td>
      <td>
        <a href="/r/${biz.slug}" target="_blank" class="public-menu-pill">/r/${biz.slug} &nearr;</a>
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

    const tableInfoBtn = tr.querySelector(".info-btn");
    if (tableInfoBtn) tableInfoBtn.addEventListener("click", () => openBizDetailsModal(biz));
    tr.querySelector(".approve-btn").addEventListener("click", () => openApprovalModal(biz));
    tr.querySelector(".reject-btn").addEventListener("click", () => handleApproval(biz._id, "rejected"));
    pendingTableBody.appendChild(tr);

    // 2. Mobile Card (< 768px): Compact card with centered name, i button in same horizontal line, and pill below
    if (pendingCardsList) {
      const card = document.createElement("div");
      card.className = "admin-biz-card admin-compact-card admin-pending-card";
      card.innerHTML = `
        <div class="admin-compact-center-group admin-pending-center-group">
          <div class="admin-compact-title-row">
            <div class="admin-biz-name admin-compact-name admin-pending-name">${escapeHtml(biz.name)}</div>
            <button type="button" class="compact-info-btn pending-info-btn info-btn" title="View details" aria-label="View application details">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </button>
          </div>
          <span class="status-pill pending">Pending</span>
        </div>
        <div class="admin-biz-card-actions">
          <button type="button" class="btn-admin btn-approve approve-btn" data-id="${biz._id}">Approve</button>
          <button type="button" class="btn-admin btn-reject reject-btn" data-id="${biz._id}">Reject</button>
        </div>
      `;

      card.querySelector(".info-btn").addEventListener("click", () => openBizDetailsModal(biz));
      card.querySelector(".approve-btn").addEventListener("click", () => openApprovalModal(biz));
      card.querySelector(".reject-btn").addEventListener("click", () => handleApproval(biz._id, "rejected"));
      pendingCardsList.appendChild(card);
    }
  });
}

/**
 * Render Expired Applications (Desktop Table + Mobile Cards)
 */
function renderExpiredTable() {
  const expiredTableBody = document.getElementById("expiredTableBody");
  const expiredCardsList = document.getElementById("expiredCardsList");
  const emptyExpiredState = document.getElementById("emptyExpiredState");
  const expiredSearchInput = document.getElementById("expiredSearchInput");

  if (expiredTableBody) expiredTableBody.innerHTML = "";
  if (expiredCardsList) expiredCardsList.innerHTML = "";

  const query = expiredSearchInput ? expiredSearchInput.value.toLowerCase().trim() : "";
  let expired = allBusinesses.filter(isBusinessExpired);

  if (query) {
    expired = expired.filter(biz => {
      const name = (biz.name || "").toLowerCase();
      const addr = (biz.address || "").toLowerCase();
      const slug = (biz.slug || "").toLowerCase();
      const ownerName = (biz.owner && biz.owner.name ? biz.owner.name : "").toLowerCase();
      const ownerEmail = (biz.owner && biz.owner.email ? biz.owner.email : "").toLowerCase();
      return name.includes(query) || addr.includes(query) || slug.includes(query) || ownerName.includes(query) || ownerEmail.includes(query);
    });
  }

  if (expired.length === 0) {
    if (emptyExpiredState) emptyExpiredState.style.display = "flex";
    return;
  }
  if (emptyExpiredState) emptyExpiredState.style.display = "none";

  expired.forEach(biz => {
    const ownerName = (biz.owner && biz.owner.name) || "Unknown";
    const ownerEmail = (biz.owner && biz.owner.email) || "";
    const expiryDateStr = biz.approvalExpiry ? new Date(biz.approvalExpiry).toLocaleDateString() : "Expired";

    // 1. Desktop Table Row (>= 768px)
    if (expiredTableBody) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <div style="display: flex; align-items: center; gap: 8px;">
            <strong>${escapeHtml(biz.name)}</strong>
            <button type="button" class="info-btn" title="View details" aria-label="View application details" style="background: transparent; border: none; cursor: pointer; color: #64748b; padding: 0; display: inline-flex; align-items: center; justify-content: center; line-height: 1;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </button>
          </div>
        </td>
        <td>
          <div>${escapeHtml(ownerName)}</div>
          <div style="font-size:0.78rem; color:#64748b;">${escapeHtml(ownerEmail)}</div>
        </td>
        <td>
          <a href="/r/${biz.slug}" target="_blank" class="public-menu-pill">/r/${biz.slug} &nearr;</a>
        </td>
        <td>
          <div style="font-size: 0.84rem; font-weight: 600; color: #dc2626;">${expiryDateStr}</div>
        </td>
        <td>
          <span class="status-pill suspended">Expired</span>
        </td>
        <td>
          <button type="button" class="btn-admin btn-reactivate reactivate-btn" data-id="${biz._id}">Reactivate</button>
        </td>
      `;
      const tableInfoBtn = tr.querySelector(".info-btn");
      if (tableInfoBtn) tableInfoBtn.addEventListener("click", () => openBizDetailsModal(biz));
      const reactivateBtn = tr.querySelector(".reactivate-btn");
      if (reactivateBtn) reactivateBtn.addEventListener("click", () => openApprovalModal(biz));
      expiredTableBody.appendChild(tr);
    }

    // 2. Mobile Compact Card (< 768px): Name and i button in same horizontal line
    if (expiredCardsList) {
      const card = document.createElement("div");
      card.className = "admin-biz-card admin-compact-card admin-pending-card";
      card.innerHTML = `
        <div class="admin-compact-center-group admin-pending-center-group">
          <div class="admin-compact-title-row">
            <div class="admin-biz-name admin-compact-name admin-pending-name">${escapeHtml(biz.name)}</div>
            <button type="button" class="compact-info-btn pending-info-btn info-btn" title="View details" aria-label="View application details">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </button>
          </div>
          <span class="status-pill suspended">Expired</span>
        </div>
        <div class="admin-biz-card-actions">
          <button type="button" class="btn-admin btn-reactivate reactivate-btn" data-id="${biz._id}" style="width: 100%;">Reactivate</button>
        </div>
      `;
      card.querySelector(".info-btn").addEventListener("click", () => openBizDetailsModal(biz));
      card.querySelector(".reactivate-btn").addEventListener("click", () => openApprovalModal(biz));
      expiredCardsList.appendChild(card);
    }
  });
}

/**
 * Render All Businesses Table (Desktop Table + Mobile Cards)
 */
function renderAllBizTable() {
  allBizTableBody.innerHTML = "";
  if (allBizCardsList) allBizCardsList.innerHTML = "";

  const query = bizSearchInput ? bizSearchInput.value.toLowerCase().trim() : "";
  const statusFilter = bizStatusFilter ? bizStatusFilter.value : "all";

  let filtered = allBusinesses.slice();

  if (statusFilter !== "all") {
    filtered = filtered.filter(b => b.approvalStatus === statusFilter);
  }

  if (query) {
    filtered = filtered.filter(biz => {
      const name = (biz.name || "").toLowerCase();
      const addr = (biz.address || "").toLowerCase();
      const slug = (biz.slug || "").toLowerCase();
      const ownerName = (biz.owner && biz.owner.name ? biz.owner.name : "").toLowerCase();
      const ownerEmail = (biz.owner && biz.owner.email ? biz.owner.email : "").toLowerCase();
      return name.includes(query) || addr.includes(query) || slug.includes(query) || ownerName.includes(query) || ownerEmail.includes(query);
    });
  }

  if (filtered.length === 0) {
    if (emptyAllBizState) emptyAllBizState.style.display = "flex";
    return;
  }
  if (emptyAllBizState) emptyAllBizState.style.display = "none";

  filtered.forEach(biz => {
    const ownerName = (biz.owner && biz.owner.name) || "Unknown";
    const ownerEmail = (biz.owner && biz.owner.email) || "";
    const catCount = (biz.stats && biz.stats.categories) || 0;
    const itemCount = (biz.stats && biz.stats.items) || 0;

    let statusPillClass = "pending";
    let statusText = biz.approvalStatus || "pending";
    if (isBusinessExpired(biz)) {
      statusPillClass = "suspended";
      statusText = "expired";
    } else if (biz.approvalStatus === "approved") {
      statusPillClass = "approved";
      statusText = "approved";
    } else if (biz.approvalStatus === "rejected") {
      statusPillClass = "rejected";
      statusText = "rejected";
    } else if (biz.approvalStatus === "suspended") {
      statusPillClass = "suspended";
      statusText = "suspended";
    }

    let expiryHint = "";
    if (biz.approvalStatus === "approved" && biz.approvalExpiry) {
      const expiry = new Date(biz.approvalExpiry);
      const diffDays = Math.ceil((expiry - new Date()) / 86400000);
      if (diffDays > 0) {
        expiryHint = `<div style="font-size:0.73rem; color:#047857; margin-top:3px; font-weight:600;">${diffDays}d active (${expiry.toLocaleDateString()})</div>`;
      } else {
        expiryHint = `<div style="font-size:0.73rem; color:#dc2626; margin-top:3px; font-weight:600;">Expired (Hold)</div>`;
      }
    }

    const subStatus = biz.subscriptionStatus || "trial";
    const subClass = subStatus === "active" ? "active" : subStatus === "trial" ? "trial" : "";

    // 1. Desktop Table Row (>= 768px)
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <div style="display: flex; align-items: center; gap: 8px;">
          <strong>${escapeHtml(biz.name)}</strong>
          <button type="button" class="info-btn" title="View details" aria-label="View restaurant details" style="background: transparent; border: none; cursor: pointer; color: #64748b; padding: 0; display: inline-flex; align-items: center; justify-content: center; line-height: 1;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </button>
        </div>
      </td>
      <td>
        <div>${escapeHtml(ownerName)}</div>
        <div style="font-size:0.78rem; color:#64748b;">${escapeHtml(ownerEmail)}</div>
      </td>
      <td>
        <span class="status-pill ${statusPillClass}">${biz.approvalStatus}</span>
        ${expiryHint}
      </td>
      <td>
        <span class="sub-pill ${subClass}">${subStatus.toUpperCase()}</span>
      </td>
      <td>
        <span style="font-weight:600; color:#334155;">${catCount}</span> cats, <span style="font-weight:600; color:#334155;">${itemCount}</span> items
      </td>
      <td>
        <a href="/r/${biz.slug}" target="_blank" class="public-menu-pill">/r/${biz.slug} &nearr;</a>
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

    const tableInfoBtn = tr.querySelector(".info-btn");
    if (tableInfoBtn) tableInfoBtn.addEventListener("click", () => openBizDetailsModal(biz));

    const suspendBtn = tr.querySelector(".suspend-btn");
    if (suspendBtn) suspendBtn.addEventListener("click", () => handleApproval(biz._id, "suspended"));

    const reactivateBtn = tr.querySelector(".reactivate-btn");
    if (reactivateBtn) reactivateBtn.addEventListener("click", () => openApprovalModal(biz));

    const approveBtn = tr.querySelector(".approve-btn");
    if (approveBtn) approveBtn.addEventListener("click", () => openApprovalModal(biz));

    tr.querySelector(".config-sub-btn").addEventListener("click", () => openSubModal(biz));
    allBizTableBody.appendChild(tr);

    // 2. Mobile Compact Card (< 768px): Name and i button in same horizontal line
    if (allBizCardsList) {
      const card = document.createElement("div");
      card.className = "admin-biz-card admin-compact-card admin-pending-card";
      card.innerHTML = `
        <div class="admin-compact-center-group admin-pending-center-group">
          <div class="admin-compact-title-row">
            <div class="admin-biz-name admin-compact-name admin-pending-name">${escapeHtml(biz.name)}</div>
            <button type="button" class="compact-info-btn pending-info-btn info-btn" title="View details" aria-label="View restaurant details">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </button>
          </div>
          <span class="status-pill ${statusPillClass}">${statusText}</span>
        </div>
        <div class="admin-biz-card-actions">
          ${biz.approvalStatus === "approved" 
            ? `<button type="button" class="btn-admin btn-suspend suspend-btn" data-id="${biz._id}">Suspend</button>` 
            : biz.approvalStatus === "suspended"
            ? `<button type="button" class="btn-admin btn-reactivate reactivate-btn" data-id="${biz._id}">Reactivate</button>`
            : `<button type="button" class="btn-admin btn-approve approve-btn" data-id="${biz._id}">Approve</button>`
          }
          <button type="button" class="btn-admin btn-settings config-sub-btn" data-id="${biz._id}">Tier &amp; Features</button>
        </div>
      `;

      card.querySelector(".info-btn").addEventListener("click", () => openBizDetailsModal(biz));

      const mSuspendBtn = card.querySelector(".suspend-btn");
      if (mSuspendBtn) mSuspendBtn.addEventListener("click", () => handleApproval(biz._id, "suspended"));

      const mReactivateBtn = card.querySelector(".reactivate-btn");
      if (mReactivateBtn) mReactivateBtn.addEventListener("click", () => openApprovalModal(biz));

      const mApproveBtn = card.querySelector(".approve-btn");
      if (mApproveBtn) mApproveBtn.addEventListener("click", () => openApprovalModal(biz));

      card.querySelector(".config-sub-btn").addEventListener("click", () => openSubModal(biz));
      allBizCardsList.appendChild(card);
    }
  });
}

/**
 * Render Audit Logs (Desktop Table + Mobile Cards)
 */
function renderAuditLogsTable() {
  auditTableBody.innerHTML = "";
  if (auditCardsList) auditCardsList.innerHTML = "";

  const query = auditSearchInput ? auditSearchInput.value.toLowerCase().trim() : "";
  let filtered = auditLogs.slice();

  if (query) {
    filtered = filtered.filter(log => {
      const email = (log.adminEmail || "").toLowerCase();
      const action = (log.action || "").toLowerCase();
      const target = (log.targetId || "").toLowerCase();
      const details = log.details ? JSON.stringify(log.details).toLowerCase() : "";
      return email.includes(query) || action.includes(query) || target.includes(query) || details.includes(query);
    });
  }

  if (filtered.length === 0) {
    if (emptyAuditState) emptyAuditState.style.display = "flex";
    return;
  }
  if (emptyAuditState) emptyAuditState.style.display = "none";

  filtered.forEach(log => {
    const timeStr = log.timestamp ? new Date(log.timestamp).toLocaleString() : "";
    const detailsStr = log.details ? JSON.stringify(log.details) : "";

    // 1. Desktop Row (>= 768px)
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="white-space:nowrap; font-size:0.82rem; color:#64748b;">${timeStr}</td>
      <td><strong>${escapeHtml(log.adminEmail || "Admin")}</strong></td>
      <td><span style="font-weight:700; color:#0f172a; font-size:0.8rem; background:#f1f5f9; padding:2px 8px; border-radius:4px;">${escapeHtml(log.action)}</span></td>
      <td style="font-family:monospace; font-size:0.8rem; color:#64748b;">${escapeHtml(log.targetId || "-")}</td>
      <td style="font-size:0.8rem; color:#334155; max-width:320px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(detailsStr)}</td>
    `;
    auditTableBody.appendChild(tr);

    // 2. Mobile Card (< 768px)
    if (auditCardsList) {
      const card = document.createElement("div");
      card.className = "admin-audit-card";
      card.innerHTML = `
        <div class="admin-audit-header">
          <span class="admin-audit-action">${escapeHtml(log.action)}</span>
          <span class="admin-audit-time">${timeStr}</span>
        </div>
        <div class="admin-audit-meta">
          <div><strong>Admin:</strong> ${escapeHtml(log.adminEmail || "Admin")}</div>
          <div><strong>Target:</strong> <span style="font-family:monospace;">${escapeHtml(log.targetId || "-")}</span></div>
        </div>
        ${detailsStr ? `<div class="admin-audit-details">${escapeHtml(detailsStr)}</div>` : ""}
      `;
      auditCardsList.appendChild(card);
    }
  });
}

/**
 * Handle Business Status Change (Approve, Reject, Suspend)
 */
async function handleApproval(businessId, approvalStatus, approvalDays = 30) {
  let reason = null;
  if (approvalStatus === "rejected") {
    reason = prompt("Please enter a reason for rejection (optional):");
    if (reason === null) return; // cancelled
  }
  if (approvalStatus === "suspended") {
    if (!confirm("Are you sure you want to suspend this restaurant? Their public menu and owner portal will be locked.")) return;
  }

  try {
    const payload = { id: businessId, approvalStatus, reason };
    if (approvalStatus === "approved") {
      payload.approvalDays = approvalDays;
    }

    const res = await fetch("/api/admin/businesses", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (data.success) {
      const msg = approvalStatus === "approved"
        ? `Restaurant approved for ${approvalDays} days!`
        : `Restaurant status updated to: ${approvalStatus}`;
      showNotification(msg, "success");
      await Promise.all([fetchBusinesses(), fetchAuditLogs()]);
    } else {
      showNotification(data.error || "Failed to update business status.", "error");
    }
  } catch (err) {
    showNotification("Network error processing action.", "error");
  }
}

/**
 * Approval Duration Dialog Modal Functions
 */
function updateApprovalExpiryPreview() {
  if (!approvalDaysInput || !approvalExpiryText) return;
  const days = parseInt(approvalDaysInput.value, 10);
  if (!days || days < 1) {
    approvalExpiryText.textContent = "EXPIRES ON : —";
    return;
  }
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + days);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = expiryDate.getDate();
  const month = months[expiryDate.getMonth()];
  const year = expiryDate.getFullYear();
  const formatted = `${day} ${month}, ${year}`;
  approvalExpiryText.textContent = `EXPIRES ON : ${formatted}`;
}

/**
 * Restaurant Details Modal (Opened via Cornered Info "i" Button)
 */
function openBizDetailsModal(biz) {
  if (!biz) return;
  const modal = document.getElementById("bizDetailsModal");
  if (!modal) return;

  const titleEl = document.getElementById("bizDetailsModalTitle");
  if (titleEl) titleEl.textContent = biz.name || "Restaurant Details";

  const isExp = isBusinessExpired(biz);
  const statusEl = document.getElementById("bizDetailsModalStatus");
  if (statusEl) {
    if (isExp) {
      statusEl.className = "status-pill suspended";
      statusEl.textContent = "EXPIRED";
    } else {
      const st = (biz.approvalStatus || "pending").toLowerCase();
      statusEl.className = `status-pill ${st}`;
      statusEl.textContent = st.toUpperCase();
    }
  }

  const ownerName = (biz.owner && biz.owner.name) || biz.ownerName || (biz.ownerId && typeof biz.ownerId === "object" ? biz.ownerId.name : "") || "Owner";
  const ownerEmail = (biz.owner && biz.owner.email) || biz.ownerEmail || (biz.ownerId && typeof biz.ownerId === "object" ? biz.ownerId.email : "") || "";
  const dateStr = biz.createdAt ? new Date(biz.createdAt).toLocaleDateString() : "Recent";
  const phone = biz.phone || (biz.owner && biz.owner.phone) || (biz.ownerId && typeof biz.ownerId === "object" ? biz.ownerId.phone : "") || "N/A";
  const address = biz.address || "";
  const catCount = (biz.stats && biz.stats.categories) || 0;
  const itemCount = (biz.stats && biz.stats.items) || 0;
  const subStatus = biz.subscriptionStatus || (biz.subscription && biz.subscription.status) || "trial";
  const expiryDate = biz.approvalExpiry ? new Date(biz.approvalExpiry).toLocaleDateString() : null;
  const daysLeft = biz.approvalExpiry ? Math.max(0, Math.ceil((new Date(biz.approvalExpiry) - new Date()) / 86400000)) : null;

  const bodyEl = document.getElementById("bizDetailsModalBody");
  if (bodyEl) {
    bodyEl.innerHTML = `
      <div class="admin-biz-meta-row">
        <span class="admin-biz-meta-label">Restaurant</span>
        <span class="admin-biz-meta-val" style="font-weight: 700; color: #0f172a;">${escapeHtml(biz.name)}</span>
      </div>
      <div class="admin-biz-meta-row">
        <span class="admin-biz-meta-label">Owner</span>
        <span class="admin-biz-meta-val">${escapeHtml(ownerName)}</span>
      </div>
      <div class="admin-biz-meta-row">
        <span class="admin-biz-meta-label">Email</span>
        <span class="admin-biz-meta-val">${escapeHtml(ownerEmail || "N/A")}</span>
      </div>
      <div class="admin-biz-meta-row">
        <span class="admin-biz-meta-label">Phone</span>
        <span class="admin-biz-meta-val">${escapeHtml(phone)}</span>
      </div>
      ${address ? `
      <div class="admin-biz-meta-row">
        <span class="admin-biz-meta-label">Address</span>
        <span class="admin-biz-meta-val">${escapeHtml(address)}</span>
      </div>` : ''}
      <div class="admin-biz-meta-row">
        <span class="admin-biz-meta-label">Applied Date</span>
        <span class="admin-biz-meta-val">${dateStr}</span>
      </div>
      ${expiryDate ? `
      <div class="admin-biz-meta-row">
        <span class="admin-biz-meta-label">Approval Period</span>
        <span class="admin-biz-meta-val" style="color: ${daysLeft > 0 ? '#047857' : '#e11d48'}; font-weight: 700;">
          ${daysLeft > 0 ? `${daysLeft}d left (${expiryDate})` : `Expired (${expiryDate})`}
        </span>
      </div>` : ''}
      <div class="admin-biz-meta-row">
        <span class="admin-biz-meta-label">Subscription</span>
        <span class="sub-pill ${subStatus === 'active' ? 'active' : ''}">${subStatus.toUpperCase()}</span>
      </div>
      <div class="admin-biz-meta-row">
        <span class="admin-biz-meta-label">Menu Catalog</span>
        <span class="admin-biz-meta-val" style="font-weight: 600; color: #334155;">${catCount} cats, ${itemCount} items</span>
      </div>
      <div class="admin-biz-meta-row">
        <span class="admin-biz-meta-label">Menu URL</span>
        <a href="/r/${biz.slug}" target="_blank" class="public-menu-pill">/r/${biz.slug} &nearr;</a>
      </div>
    `;
  }

  modal.style.display = "flex";
}

function closeBizDetailsModal() {
  const modal = document.getElementById("bizDetailsModal");
  if (modal) modal.style.display = "none";
}

const closeBizDetailsModalBtn = document.getElementById("closeBizDetailsModalBtn");
if (closeBizDetailsModalBtn) closeBizDetailsModalBtn.addEventListener("click", closeBizDetailsModal);

const closeBizDetailsModalBtn2 = document.getElementById("closeBizDetailsModalBtn2");
if (closeBizDetailsModalBtn2) closeBizDetailsModalBtn2.addEventListener("click", closeBizDetailsModal);

const bizDetailsModal = document.getElementById("bizDetailsModal");
if (bizDetailsModal) {
  bizDetailsModal.addEventListener("click", (e) => {
    if (e.target === bizDetailsModal) closeBizDetailsModal();
  });
}

function openApprovalModal(biz) {
  if (!approvalModal) return;
  approvalBizIdInput.value = biz._id;
  approvalModalTitle.textContent = biz.name;
  const defaultDays = biz.approvalDays || 30;
  approvalDaysInput.value = defaultDays;

  presetChips.forEach(chip => {
    chip.classList.toggle("active", chip.dataset.days === String(defaultDays));
  });

  updateApprovalExpiryPreview();
  approvalModal.style.display = "flex";
}

function closeApprovalModal() {
  if (approvalModal) approvalModal.style.display = "none";
}

if (cancelApprovalModalBtn) cancelApprovalModalBtn.addEventListener("click", closeApprovalModal);

if (approvalDaysInput) {
  approvalDaysInput.addEventListener("input", () => {
    const val = approvalDaysInput.value;
    presetChips.forEach(chip => {
      chip.classList.toggle("active", chip.dataset.days === val);
    });
    updateApprovalExpiryPreview();
  });
}

presetChips.forEach(chip => {
  chip.addEventListener("click", () => {
    approvalDaysInput.value = chip.dataset.days;
    presetChips.forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    updateApprovalExpiryPreview();
  });
});

if (approvalForm) {
  approvalForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = approvalBizIdInput.value;
    const days = parseInt(approvalDaysInput.value, 10) || 30;
    closeApprovalModal();
    await handleApproval(id, "approved", days);
  });
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
 * Smooth Capsule Tab Slider Positioning
 */
function updateTabSlider() {
  const slider = document.getElementById("adminTabSlider");
  const activeTab = document.querySelector(".admin-tab.active");
  const tabsContainer = document.querySelector(".admin-tabs");
  if (!slider || !activeTab || !tabsContainer) return;

  const containerRect = tabsContainer.getBoundingClientRect();
  const tabRect = activeTab.getBoundingClientRect();

  const leftOffset = tabRect.left - containerRect.left;
  const width = tabRect.width;

  slider.style.transform = `translateX(${leftOffset}px)`;
  slider.style.width = `${width}px`;
}

window.addEventListener("resize", updateTabSlider);
window.addEventListener("orientationchange", () => setTimeout(updateTabSlider, 100));
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(updateTabSlider);
}

/**
 * Tab Navigation Switcher
 */
function switchTab(tab) {
  tabButtons.forEach(b => {
    if (b.dataset.tab === tab) b.classList.add("active");
    else b.classList.remove("active");
  });

  updateTabSlider();

  const tabPending = document.getElementById("tabContentPending");
  const tabExpired = document.getElementById("tabContentExpired");
  const tabAll = document.getElementById("tabContentAll");
  const tabAudit = document.getElementById("tabContentAudit");

  [tabPending, tabExpired, tabAll, tabAudit].forEach(tc => {
    if (tc) tc.classList.remove("tab-fade-in");
  });

  const activeContent = tab === "pending" ? tabPending : tab === "expired" ? tabExpired : tab === "all" ? tabAll : tab === "audit" ? tabAudit : null;

  if (tabPending) tabPending.style.display = tab === "pending" ? "flex" : "none";
  if (tabExpired) tabExpired.style.display = tab === "expired" ? "flex" : "none";
  if (tabAll) tabAll.style.display = tab === "all" ? "flex" : "none";
  if (tabAudit) tabAudit.style.display = tab === "audit" ? "flex" : "none";

  if (activeContent) {
    void activeContent.offsetWidth; // force reflow for smooth animation
    activeContent.classList.add("tab-fade-in");
  }
}

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    switchTab(btn.dataset.tab);
  });
});

if (refreshPendingBtn) refreshPendingBtn.addEventListener("click", () => fetchBusinesses());
const refreshExpiredBtn = document.getElementById("refreshExpiredBtn");
if (refreshExpiredBtn) refreshExpiredBtn.addEventListener("click", () => fetchBusinesses());
if (refreshAllBtn) refreshAllBtn.addEventListener("click", () => fetchBusinesses());
if (refreshLogsBtn) refreshLogsBtn.addEventListener("click", () => fetchAuditLogs());

// Real-Time Search & Status Filtering
if (pendingSearchInput) {
  pendingSearchInput.addEventListener("input", () => renderPendingTable());
}
const expSearchInput = document.getElementById("expiredSearchInput");
if (expSearchInput) {
  expSearchInput.addEventListener("input", () => renderExpiredTable());
}
if (bizSearchInput) {
  bizSearchInput.addEventListener("input", () => renderAllBizTable());
}
if (bizStatusFilter) {
  bizStatusFilter.addEventListener("change", () => renderAllBizTable());
}
if (auditSearchInput) {
  auditSearchInput.addEventListener("input", () => renderAuditLogsTable());
}

/**
 * Admin Fast Dev Login
 */
if (adminDevAuthForm) {
  adminDevAuthForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const devEmail = adminDevEmail ? adminDevEmail.value.trim() : "";
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
}

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
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        window.google.accounts.id.disableAutoSelect();
      }
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout error:", e);
    }
    currentAdmin = null;
    window.location.replace("/");
  });
}

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
function syncHeaderHeight() {
  const adminHeader = document.querySelector(".admin-header");
  if (adminHeader) {
    document.documentElement.style.setProperty("--admin-header-height", `${adminHeader.offsetHeight}px`);
  }
}
window.addEventListener("resize", syncHeaderHeight);

document.addEventListener("DOMContentLoaded", async () => {
  syncHeaderHeight();
  try {
    await checkAdminSession();
  } finally {
    revealPage();
    syncHeaderHeight();
  }
});
