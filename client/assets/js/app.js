import { Sidebar } from "../../components/Sidebar.js";
import { Topbar } from "../../components/Topbar.js";
import { DashboardView } from "../../views/dashboardView.js";
import { ProfileView } from "../../views/profileView.js";
import { MembersView } from "../../views/membersView.js";
import { CRPanelView } from "../../views/crPanelView.js";
import { EventsView } from "../../views/eventsView.js";
import { LoginView } from "../../views/loginView.js";
import { RegisterView } from "../../views/registerView.js";
import { initTheme, toggleTheme } from "./theme.js";
import { ResourcesView } from "../../views/resourcesView.js";
import { ProjectsView } from "../../views/projectsView.js";
import { TasksView } from "../../views/tasksView.js";
import { api } from "./api.js";

function navigate(viewName) {
  const root = document.getElementById("app");
  root.innerHTML = "";

  const token = localStorage.getItem("token");

  if (!token && viewName !== "login" && viewName !== "register") {
    navigate("login");
    return;
  }

  if (viewName === "login") {
    root.appendChild(LoginView(navigate));
    const tBtn = root.querySelector("#themeToggle");
    if (tBtn) tBtn.onclick = () => toggleTheme();
  } else if (viewName === "register") {
    root.appendChild(RegisterView(navigate));
    const tBtn = root.querySelector("#themeToggle");
    if (tBtn) tBtn.onclick = () => toggleTheme();
  } else {
    const layout = document.createElement("div");
    layout.className = "app-layout";

    layout.appendChild(Sidebar(navigate, viewName));

    const mainArea = document.createElement("div");
    mainArea.className = "main-content-area";
    mainArea.appendChild(Topbar());

    const contentWrapper = document.createElement("div");
    contentWrapper.style.cssText =
      "flex-grow: 1; overflow-y: auto; width: 100%;";

    if (viewName === "profile") {
      contentWrapper.appendChild(ProfileView(navigate));
    } else if (viewName === "members") {
      contentWrapper.appendChild(MembersView());
    } else if (viewName === "cr-panel") {
      contentWrapper.appendChild(CRPanelView());
    } else if (viewName === "events") {
      contentWrapper.appendChild(EventsView());
    } else if (viewName === "resources") {
      contentWrapper.appendChild(ResourcesView());
    } else if (viewName === "projects") {
      contentWrapper.appendChild(ProjectsView());
    } else if (viewName === "tasks") {
      contentWrapper.appendChild(TasksView());
    } else {
      contentWrapper.appendChild(DashboardView());
    }

    mainArea.appendChild(contentWrapper);
    layout.appendChild(mainArea);
    root.appendChild(layout);
  }
}

function init() {
  initTheme();
  const token = localStorage.getItem("token");
  navigate(token ? "dashboard" : "login");
}

// Global Search Event Handler (Add this in app.js or layout init)
window.addEventListener("globalSearch", async (e) => {
  const query = e.detail.query;
  try {
    const token = localStorage.getItem("token");
    const res = await api.get(`/search?q=${encodeURIComponent(query)}`, token);

    if (res.success) {
      showSearchResultsModal(query, res.results);
    }
  } catch (err) {
    console.error("Search failed", err);
  }
});

function showSearchResultsModal(query, results) {
  // Remove existing modal if any
  const existing = document.getElementById("searchModalOverlay");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "searchModalOverlay";
  overlay.style.cssText =
    "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;";

  const totalResults =
    (results.materials?.length || 0) +
    (results.tasks?.length || 0) +
    (results.projects?.length || 0);

  overlay.innerHTML = `
        <div style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; width: 90%; max-width: 600px; max-height: 80vh; overflow-y: auto; padding: 25px; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 12px; margin-bottom: 15px;">
                <h3 style="color: var(--primary-color); font-size: 18px;">Search Results for "${query}"</h3>
                <button id="closeSearchModal" style="background: none; border: none; font-size: 18px; cursor: pointer; color: var(--text-color);">✕</button>
            </div>
            
            ${totalResults === 0 ? `<p style="color: var(--text-muted); text-align: center; padding: 20px;">No matches found across resources, tasks, or projects.</p>` : ""}

            <!-- Materials Section -->
            ${
              results.materials?.length > 0
                ? `
                <h4 style="font-size: 14px; color: var(--text-muted); margin-bottom: 8px;">📚 Resources (${results.materials.length})</h4>
                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px;">
                    ${results.materials
                      .map(
                        (m) => `
                        <div style="background: var(--bg-color); padding: 10px; border-radius: 6px; border: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                            <div><strong>${m.title}</strong> <small style="color: var(--text-muted);">(${m.course_code})</small></div>
                            <a href="${m.file_url}" target="_blank" style="font-size: 12px; color: var(--primary-color); font-weight: bold; text-decoration: none;">View</a>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            `
                : ""
            }

            <!-- Tasks Section -->
            ${
              results.tasks?.length > 0
                ? `
                <h4 style="font-size: 14px; color: var(--text-muted); margin-bottom: 8px;">📋 Tasks & Deadlines (${results.tasks.length})</h4>
                <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px;">
                    ${results.tasks
                      .map(
                        (t) => `
                        <div style="background: var(--bg-color); padding: 10px; border-radius: 6px; border: 1px solid var(--border-color);">
                            <strong>${t.title}</strong> (${t.course_code})
                            <div style="font-size: 11px; color: #c62828; margin-top: 2px;">Due: ${new Date(t.due_date).toLocaleString()}</div>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            `
                : ""
            }

            <!-- Projects Section -->
            ${
              results.projects?.length > 0
                ? `
                <h4 style="font-size: 14px; color: var(--text-muted); margin-bottom: 8px;">📁 Projects (${results.projects.length})</h4>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    ${results.projects
                      .map(
                        (p) => `
                        <div style="background: var(--bg-color); padding: 10px; border-radius: 6px; border: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                            <div><strong>${p.title}</strong> <small style="color: var(--text-muted);">(${p.tech_stack})</small></div>
                            <a href="${p.repo_url}" target="_blank" style="font-size: 12px; color: var(--primary-color); font-weight: bold; text-decoration: none;">GitHub</a>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            `
                : ""
            }
        </div>
    `;

  document.body.appendChild(overlay);

  overlay.querySelector("#closeSearchModal").onclick = () => overlay.remove();
  overlay.onclick = (e) => {
    if (e.target === overlay) overlay.remove();
  };
}

window.addEventListener("DOMContentLoaded", init);
