import { api } from "../assets/js/api.js";

export function ResourcesView() {
  const container = document.createElement("div");
  container.className = "view-container";
  container.style.cssText =
    "padding: 30px; display: flex; flex-direction: column; gap: 20px; width: 100%; max-width: 1000px;";

  container.innerHTML = `
        <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 15px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
            <div>
                <h2 style="color: var(--primary-color); font-size: 24px;">Course Resources & Study Materials</h2>
                <p style="color: var(--text-muted); font-size: 13px; margin-top: 4px;">Access lecture notes, assignment guidelines, books, and question banks.</p>
            </div>
            
            <!-- Course Filter Dropdown -->
            <div style="display: flex; align-items: center; gap: 8px;">
                <label style="font-size: 13px; font-weight: bold; color: var(--text-muted);">Filter Course:</label>
                <select id="courseFilter" style="padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--card-bg); color: var(--text-color); font-size: 13px; cursor: pointer;">
                    <option value="all">All Courses</option>
                </select>
            </div>
        </div>

        <!-- Upload Resource Form -->
        <div style="background: var(--card-bg); border: 1px solid var(--border-color); padding: 20px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
            <h3 style="font-size: 16px; color: var(--primary-color); margin-bottom: 12px;">Upload Study Material</h3>
            <form id="uploadResourceForm" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <input type="text" id="resTitle" placeholder="Material Title (e.g., Lecture 1 Notes)" required style="padding: 10px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-color); color: var(--text-color);">
                <select id="resCourse" required style="padding: 10px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-color); color: var(--text-color);">
                    <option value="">Select Course Code</option>
                </select>
                <select id="resCategory" style="padding: 10px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-color); color: var(--text-color);">
                    <option value="Lecture Notes">Lecture Notes</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Book">Book</option>
                    <option value="Question Bank">Question Bank</option>
                </select>
                <input type="url" id="resUrl" placeholder="File Link (Google Drive / PDF URL)" required style="padding: 10px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-color); color: var(--text-color);">
                <button type="submit" style="grid-column: span 2; padding: 10px; background: var(--primary-color); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Submit Material</button>
            </form>
        </div>

        <!-- Resources Grid -->
        <div id="resourcesGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 15px; width: 100%;">
            <p style="color: var(--text-muted);">Loading resources...</p>
        </div>
    `;

  async function loadCoursesDropdowns() {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/academic", token); // Academic endpoint fetches semester courses
      if (res.success && res.courses) {
        const filterSelect = document.getElementById("courseFilter");
        const uploadSelect = document.getElementById("resCourse");

        res.courses.forEach((c) => {
          // Add to Filter dropdown
          const opt1 = document.createElement("option");
          opt1.value = c.course_code;
          opt1.textContent = `${c.course_code}: ${c.course_title}`;
          filterSelect.appendChild(opt1);

          // Add to Upload dropdown
          const opt2 = document.createElement("option");
          opt2.value = c.course_code;
          opt2.textContent = `${c.course_code}: ${c.course_title}`;
          uploadSelect.appendChild(opt2);
        });
      }
    } catch (err) {
      console.error("Failed to load courses for dropdown", err);
    }
  }

  async function fetchResources(courseCode = "all") {
    try {
      const token = localStorage.getItem("token");
      const endpoint =
        courseCode === "all"
          ? "/resources"
          : `/resources?course_code=${courseCode}`;
      const res = await api.get(endpoint, token);
      renderResources(res.materials);
    } catch (err) {
      document.getElementById("resourcesGrid").innerHTML =
        `<p style="color: #c62828;">Failed to load resources.</p>`;
    }
  }

  function renderResources(materialsList) {
    const grid = document.getElementById("resourcesGrid");
    grid.innerHTML = "";

    if (!materialsList || materialsList.length === 0) {
      grid.innerHTML = `<p style="color: var(--text-muted); font-size: 13px;">No resources found for this course selection.</p>`;
      return;
    }

    materialsList.forEach((mat) => {
      const card = document.createElement("div");
      card.style.cssText =
        "background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 10px; padding: 20px; display: flex; flex-direction: column; gap: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);";
      card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <h4 style="font-size: 16px; color: var(--text-color);">${mat.title}</h4>
                    <span style="font-size: 11px; background: rgba(0,64,128,0.1); color: var(--primary-color); border: 1px solid var(--border-color); padding: 2px 6px; border-radius: 4px; font-weight: bold;">${mat.course_code}</span>
                </div>
                <p style="font-size: 12px; color: var(--text-muted);">Category: <strong>${mat.category}</strong> | Uploaded by: ${mat.uploader_name || "Student"}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; border-top: 1px solid var(--border-color); padding-top: 10px;">
                    <small style="color: var(--text-muted);">${new Date(mat.created_at).toLocaleDateString()}</small>
                    <a href="${mat.file_url}" target="_blank" style="padding: 6px 14px; background: var(--primary-color); color: white; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: bold;">📥 Download / View</a>
                </div>
            `;
      grid.appendChild(card);
    });
  }

  setTimeout(() => {
    loadCoursesDropdowns();
    fetchResources("all");

    // Dropdown change listener
    document.getElementById("courseFilter").addEventListener("change", (e) => {
      const selectedCourse = e.target.value;
      fetchResources(selectedCourse);
    });

    // Upload form submit listener
    document
      .getElementById("uploadResourceForm")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const payload = {
          title: document.getElementById("resTitle").value,
          course_code: document.getElementById("resCourse").value,
          category: document.getElementById("resCategory").value,
          file_url: document.getElementById("resUrl").value,
        };

        try {
          const token = localStorage.getItem("token");
          const res = await api.post("/resources", payload, token);
          alert(res.message);
          document.getElementById("uploadResourceForm").reset();
          fetchResources(document.getElementById("courseFilter").value);
        } catch (err) {
          alert(err.message);
        }
      });
  }, 0);

  return container;
}
