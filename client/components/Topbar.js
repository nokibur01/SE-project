import { toggleTheme } from "../assets/js/theme.js";
import { api } from "../assets/js/api.js";

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
        <div class="search-container" style="display: flex; gap: 8px; align-items: center; width: 450px;">
            <select id="searchCategory" style="padding: 8px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--card-bg); color: var(--text-color); font-size: 12px; cursor: pointer;">
                <option value="all">All Categories</option>
                <option value="materials">Resources</option>
                <option value="tasks">Tasks & Deadlines</option>
                <option value="projects">Projects</option>
                <option value="events">Events</option>
                <option value="members">Members</option>
            </select>
            <input type="text" id="globalSearchInput" placeholder="Search batchhub..." style="flex: 1; padding: 8px 14px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-color); color: var(--text-color); font-size: 13px; outline: none;">
        </div>
        <div class="topbar-right" style="display: flex; align-items: center; gap: 15px; position: relative;">
            <button id="dashboardThemeToggle" class="theme-toggle-btn" title="Toggle Theme">🌓</button>
            
            <!-- Notification Bell & Dropdown -->
            <div style="position: relative;">
                <button id="notificationBtn" class="notification-btn" title="Notifications" style="background: none; border: 1px solid var(--border-color); padding: 8px 10px; border-radius: 6px; cursor: pointer; font-size: 14px; position: relative;">
                    🔔
                    <span id="notifBadge" style="display: none; position: absolute; top: -5px; right: -5px; background: #c62828; color: white; font-size: 10px; font-weight: bold; padding: 2px 5px; border-radius: 50%;">0</span>
                </button>
                
                <div id="notificationDropdown" style="display: none; position: absolute; right: 0; top: 45px; width: 320px; background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.2); z-index: 1000; padding: 15px; max-height: 380px; overflow-y: auto;">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 8px; margin-bottom: 10px;">
                        <h4 style="font-size: 14px; color: var(--primary-color); margin: 0;">Notifications</h4>
                        <small style="color: var(--text-muted); font-size: 11px;">Click to mark as read</small>
                    </div>
                    <div id="notificationList" style="display: flex; flex-direction: column; gap: 8px;">
                        <p style="font-size: 12px; color: var(--text-muted); text-align: center;">Loading...</p>
                    </div>
                </div>
            </div>

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
    // Theme toggle
    const btn = header.querySelector("#dashboardThemeToggle");
    if (btn) btn.onclick = () => toggleTheme();

    const notifBtn = header.querySelector("#notificationBtn");
    const notifDropdown = header.querySelector("#notificationDropdown");
    const notifList = header.querySelector("#notificationList");
    const notifBadge = header.querySelector("#notifBadge");

    // Function to fetch & update notifications and badge count
    async function updateNotifications() {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/notifications", token);
        if (res.success && res.notifications) {
          const count = res.notifications.length;

          // Update Badge
          if (count > 0) {
            notifBadge.textContent = count;
            notifBadge.style.display = "block";
          } else {
            notifBadge.style.display = "none";
          }

          // Update List inside Dropdown
          notifList.innerHTML = "";
          if (count === 0) {
            notifList.innerHTML = `<p style="font-size: 12px; color: var(--text-muted); text-align: center; padding: 10px;">No new notifications.</p>`;
            return;
          }

          res.notifications.forEach((n) => {
            const item = document.createElement("div");
            item.style.cssText =
              "background: var(--bg-color); padding: 10px; border-radius: 6px; border: 1px solid var(--border-color); font-size: 12px; cursor: pointer; transition: background 0.2s;";
            item.title = "Click to mark as read";
            item.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <strong style="color: var(--primary-color);">${n.title}</strong>
                    <span style="font-size: 10px; color: var(--text-muted);">${new Date(n.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
                <p style="color: var(--text-color); margin: 4px 0 0 0;">${n.message}</p>
            `;

            // When user clicks a notification, delete it via direct fetch
            item.onclick = async () => {
              try {
                const token = localStorage.getItem("token");
                await fetch(`http://localhost:5000/api/notifications/${n.id}`, {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });

                item.remove();

                // Update badge count dynamically
                const currentCount = parseInt(notifBadge.textContent) - 1;
                if (currentCount > 0) {
                  notifBadge.textContent = currentCount;
                } else {
                  notifBadge.style.display = "none";
                  notifList.innerHTML = `<p style="font-size: 12px; color: var(--text-muted); text-align: center; padding: 10px;">No new notifications.</p>`;
                }
              } catch (err) {
                console.error("Failed to delete notification", err);
              }
            };

            notifList.appendChild(item);
          });
        }
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    }

    // Initial fetch on load
    updateNotifications();

    // Auto-Polling: Refresh notifications every 10 seconds
    setInterval(updateNotifications, 10000);

    // Toggle dropdown on bell click
    notifBtn.onclick = (e) => {
      e.stopPropagation();
      const isVisible = notifDropdown.style.display === "block";
      notifDropdown.style.display = isVisible ? "none" : "block";
      if (!isVisible) {
        updateNotifications();
      }
    };

    // Close dropdown on outside click
    document.addEventListener("click", (e) => {
      if (!notifDropdown.contains(e.target) && e.target !== notifBtn) {
        notifDropdown.style.display = "none";
      }
    });

    // Search bar event
    const searchInput = header.querySelector("#globalSearchInput");
    const categorySelect = header.querySelector("#searchCategory");

    if (searchInput) {
      searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          const query = searchInput.value.trim();
          const category = categorySelect.value;
          if (query) {
            window.dispatchEvent(
              new CustomEvent("globalSearch", { detail: { query, category } }),
            );
          }
        }
      });
    }
  }, 0);

  return header;
}
