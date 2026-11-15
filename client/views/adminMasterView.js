import { api } from "../assets/js/api.js";

export function AdminMasterView() {
  const container = document.createElement("div");
  container.className = "admin-master-container";
  container.style.cssText =
    "padding: 30px; max-width: 1100px; margin: 0 auto; color: var(--text-color);";

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2 style="font-size: 22px; color: var(--primary-color);">🛡️ Admin & CR Master Overview</h2>
        <span style="font-size: 12px; background: var(--primary-color); color: white; padding: 4px 10px; border-radius: 20px;">Full Access</span>
    </div>

    <!-- Category Tabs -->
    <div style="display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px; overflow-x: auto;">
        <button class="admin-tab active" data-target="materials" style="padding: 8px 16px; border: none; border-radius: 6px; background: var(--primary-color); color: white; cursor: pointer; font-size: 13px; font-weight: bold;">📚 Resources</button>
        <button class="admin-tab" data-target="tasks" style="padding: 8px 16px; border: none; border-radius: 6px; background: var(--card-bg); color: var(--text-color); border: 1px solid var(--border-color); cursor: pointer; font-size: 13px;">📋 Tasks</button>
        <button class="admin-tab" data-target="projects" style="padding: 8px 16px; border: none; border-radius: 6px; background: var(--card-bg); color: var(--text-color); border: 1px solid var(--border-color); cursor: pointer; font-size: 13px;">📁 Projects</button>
        <button class="admin-tab" data-target="events" style="padding: 8px 16px; border: none; border-radius: 6px; background: var(--card-bg); color: var(--text-color); border: 1px solid var(--border-color); cursor: pointer; font-size: 13px;">📅 Events</button>
        <button class="admin-tab" data-target="members" style="padding: 8px 16px; border: none; border-radius: 6px; background: var(--card-bg); color: var(--text-color); border: 1px solid var(--border-color); cursor: pointer; font-size: 13px;">👤 Members</button>
    </div>

    <!-- Data Display Area -->
    <div id="adminDataContent" style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 10px; padding: 20px; min-height: 350px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <p style="text-align: center; color: var(--text-muted); padding: 40px;">Loading all system data...</p>
    </div>
  `;

  setTimeout(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/admin/overview", token);

      if (!res.success) {
        container.querySelector("#adminDataContent").innerHTML =
          `<p style="color: #c62828; text-align: center;">Access Denied. Only Admin or CR can view this panel.</p>`;
        return;
      }

      const data = res.data;
      const contentArea = container.querySelector("#adminDataContent");
      const tabs = container.querySelectorAll(".admin-tab");

      // Render default (Materials)
      renderTable("materials", data.materials);

      // Tab switching logic
      tabs.forEach((tab) => {
        tab.onclick = () => {
          tabs.forEach((t) => {
            t.style.background = "var(--card-bg)";
            t.style.color = "var(--text-color)";
            t.style.border = "1px solid var(--border-color)";
          });
          tab.style.background = "var(--primary-color)";
          tab.style.color = "white";
          tab.style.border = "none";

          const target = tab.getAttribute("data-target");
          renderTable(target, data[target]);
        };
      });

      function renderTable(type, items) {
        if (!items || items.length === 0) {
          contentArea.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 40px;">No records found in this category.</p>`;
          return;
        }

        let html = `<div style="overflow-x: auto;"><table style="width: 100%; border-collapse: collapse; font-size: 13px;"><thead><tr style="border-bottom: 2px solid var(--border-color); text-align: left; color: var(--text-muted);">`;

        if (type === "materials") {
          html += `<th>Title</th><th>Course</th><th>Category</th><th>Status</th><th>Action</th></tr></thead><tbody>`;
          items.forEach((m) => {
            html += `<tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 10px;"><strong>${m.title}</strong></td>
                <td style="padding: 10px;">${m.course_code}</td>
                <td style="padding: 10px;">${m.category}</td>
                <td style="padding: 10px;"><span style="padding: 3px 8px; border-radius: 4px; font-size: 11px; background: ${m.status === "approved" ? "#e8f5e9; color: #2e7d32;" : "#fff3e0; color: #ef6c00;"}">${m.status}</span></td>
                <td style="padding: 10px;"><a href="${m.file_url}" target="_blank" style="color: var(--primary-color); text-decoration: none; font-weight: bold;">View</a></td>
            </tr>`;
          });
        } else if (type === "tasks") {
          html += `<th>Title</th><th>Course</th><th>Due Date</th></tr></thead><tbody>`;
          items.forEach((t) => {
            html += `<tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 10px;"><strong>${t.title}</strong></td>
                <td style="padding: 10px;">${t.course_code}</td>
                <td style="padding: 10px; color: #c62828;">${new Date(t.due_date).toLocaleString()}</td>
            </tr>`;
          });
        } else if (type === "projects") {
          html += `<th>Project Title</th><th>Tech Stack</th><th>Repo</th></tr></thead><tbody>`;
          items.forEach((p) => {
            html += `<tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 10px;"><strong>${p.title}</strong></td>
                <td style="padding: 10px;">${p.tech_stack}</td>
                <td style="padding: 10px;"><a href="${p.repo_url}" target="_blank" style="color: var(--primary-color); text-decoration: none; font-weight: bold;">GitHub</a></td>
            </tr>`;
          });
        } else if (type === "events") {
          html += `<th>Event Title</th><th>Location</th><th>Date</th></tr></thead><tbody>`;
          items.forEach((ev) => {
            html += `<tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 10px;"><strong>${ev.title}</strong></td>
                <td style="padding: 10px;">${ev.location}</td>
                <td style="padding: 10px;">${new Date(ev.event_date).toLocaleDateString()}</td>
            </tr>`;
          });
        } else if (type === "members") {
          html += `<th>Name</th><th>Student ID</th><th>Batch</th><th>Role</th></tr></thead><tbody>`;
          items.forEach((u) => {
            html += `<tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 10px;"><strong>${u.name}</strong></td>
                <td style="padding: 10px;">${u.student_id}</td>
                <td style="padding: 10px;">${u.batch}</td>
                <td style="padding: 10px; text-transform: uppercase; font-weight: bold; color: var(--primary-color);">${u.role}</td>
            </tr>`;
          });
        }

        html += `</tbody></table></div>`;
        contentArea.innerHTML = html;
      }
    } catch (err) {
      console.error("Failed to load admin overview", err);
      container.querySelector("#adminDataContent").innerHTML =
        `<p style="color: #c62828; text-align: center;">Failed to load data.</p>`;
    }
  }, 0);

  return container;
}
