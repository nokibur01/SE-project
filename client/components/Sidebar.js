export function Sidebar(navigate, currentView) {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const isAdmin = user.role === "admin";

  const sidebar = document.createElement("aside");
  sidebar.className = "sidebar";

  let menuItems = [];

  if (isAdmin) {
    menuItems = [
      { name: "Admin Master Overview", view: "admin-master", icon: "🛡️" },
      { name: "Settings", view: "settings", icon: "⚙️" },
      { name: "Help & Support", view: "help", icon: "❓" },
    ];
  } else {
    menuItems = [
      { name: "Dashboard", view: "dashboard", icon: "🏠" },
      { name: "Resources", view: "resources", icon: "📚" },
      { name: "Tasks & Deadlines", view: "tasks", icon: "📋" },
      { name: "Projects", view: "projects", icon: "📁" },
      { name: "Events", view: "events", icon: "📅" },
      { name: "Members", view: "members", icon: "👤" },
      { name: "Profile", view: "profile", icon: "⚙️" },
      { name: "Settings", view: "settings", icon: "🛠️" },
      { name: "Help & Support", view: "help", icon: "❓" },
      ...(user.role === "cr"
        ? [{ name: "CR Approval Panel", view: "cr-panel", icon: "⭐" }]
        : []),
    ];
  }

  sidebar.innerHTML = `
    <div class="sidebar-brand">
      <h3>BatchHub</h3>
      <small style="color: var(--text-muted); font-size: 11px;">${isAdmin ? "System Admin" : "CSE Department"}</small>
    </div>
    <ul class="sidebar-menu" style="list-style: none; padding: 0; margin-top: 20px;">
      ${menuItems
        .map(
          (item) => `
        <li style="margin-bottom: 5px;">
          <button data-view="${item.view}" style="width: 100%; text-align: left; padding: 10px 15px; background: ${currentView === item.view ? "var(--primary-color)" : "transparent"}; color: ${currentView === item.view ? "white" : "var(--text-color)"}; border: none; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 500;">
            <span>${item.icon}</span> ${item.name}
          </button>
        </li>
      `,
        )
        .join("")}
    </ul>
    <div style="margin-top: auto; padding-top: 20px; border-top: 1px solid var(--border-color);">
      <button id="logoutBtn" style="width: 100%; text-align: left; padding: 10px 15px; background: rgba(198, 40, 40, 0.1); color: #c62828; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: bold;">
        🚪 Logout
      </button>
    </div>
  `;

  setTimeout(() => {
    sidebar.querySelectorAll(".sidebar-menu button").forEach((btn) => {
      btn.onclick = () => {
        const view = btn.getAttribute("data-view");
        navigate(view);
      };
    });

    const logoutBtn = sidebar.querySelector("#logoutBtn");
    if (logoutBtn) {
      logoutBtn.onclick = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("login");
      };
    }
  }, 0);

  return sidebar;
}
