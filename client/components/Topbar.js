import { toggleTheme } from "../assets/js/theme.js";

export function Topbar() {
  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "Mahathir Mohammad",
    department: "CSE",
    batch: "3rd Year",
    profile_picture: "",
  };

  const randomDefaultAvatar =
    "https://api.dicebear.com/7.x/bottts/svg?seed=BatchHubUser";
  const avatarUrl =
    user.profile_picture && user.profile_picture.trim() !== ""
      ? user.profile_picture
      : randomDefaultAvatar;

  const header = document.createElement("header");
  header.className = "topbar";
  header.innerHTML = `
        <div class="search-container">
            <input type="text" id="globalSearchInput" placeholder="Search courses, notices, materials, projects...">
        </div>
        <div class="topbar-right">
            <button id="dashboardThemeToggle" class="theme-toggle-btn" title="Toggle Theme">🌓</button>
            <button class="notification-btn" title="Notifications">🔔</button>
            <div class="user-profile-widget" style="display: flex; align-items: center; gap: 12px;">
                <img src="${avatarUrl}" alt="Profile" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid var(--primary-color); background: #eee;">
                <div class="profile-badge">
                    <h4 style="margin: 0; font-size: 14px;">${user.name}</h4>
                    <p style="margin: 0; font-size: 11px; color: var(--text-muted);">${user.department || "CSE"} | ${user.batch || "3rd Year"}</p>
                </div>
            </div>
        </div>
    `;

  setTimeout(() => {
    // Theme Toggle Handler
    const btn = header.querySelector("#dashboardThemeToggle");
    if (btn) btn.onclick = () => toggleTheme();

    // Global Search Handler (Triggers search modal on Enter)
    const searchInput = header.querySelector("#globalSearchInput");
    if (searchInput) {
      searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          const query = searchInput.value.trim();
          if (query) {
            window.dispatchEvent(
              new CustomEvent("globalSearch", { detail: { query } }),
            );
          }
        }
      });
    }
  }, 0);

  return header;
}
