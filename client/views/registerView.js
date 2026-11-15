import { api } from "../assets/js/api.js";

export function RegisterView(navigate) {
  const container = document.createElement("div");
  container.className = "auth-container";
  container.style.cssText =
    "display: flex; align-items: center; justify-content: center; height: 100vh; background: var(--bg-color);";

  container.innerHTML = `
    <div style="background: var(--card-bg); border: 1px solid var(--border-color); padding: 35px; border-radius: 12px; width: 100%; max-width: 420px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2 style="color: var(--primary-color); margin: 0; font-size: 22px;">Create Account</h2>
        <button id="themeToggle" style="background: none; border: none; font-size: 18px; cursor: pointer;" title="Toggle Theme">🌓</button>
      </div>
      
      <p style="color: var(--text-muted); font-size: 13px; margin-bottom: 20px;">Join BatchHub CSE Collaborative Platform</p>
      
      <form id="registerForm" style="display: flex; flex-direction: column; gap: 12px;">
        <div>
          <label style="font-size: 12px; color: var(--text-muted); display: block; margin-bottom: 4px;">Full Name</label>
          <input type="text" id="regName" placeholder="e.g. Mahathir Mohammad" required style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-color); color: var(--text-color); font-size: 13px; outline: none;">
        </div>

        <div>
          <label style="font-size: 12px; color: var(--text-muted); display: block; margin-bottom: 4px;">Email Address</label>
          <input type="email" id="regEmail" placeholder="mmahathir398@gmail.com" required style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-color); color: var(--text-color); font-size: 13px; outline: none;">
        </div>

        <div>
          <label style="font-size: 12px; color: var(--text-muted); display: block; margin-bottom: 4px;">Password</label>
          <input type="password" id="regPassword" placeholder="••••••••" required style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-color); color: var(--text-color); font-size: 13px; outline: none;">
        </div>

        <div style="display: flex; gap: 10px;">
          <div style="flex: 1;">
            <label style="font-size: 12px; color: var(--text-muted); display: block; margin-bottom: 4px;">Student ID</label>
            <input type="text" id="regStudentId" placeholder="24524203179" required style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-color); color: var(--text-color); font-size: 13px; outline: none;">
          </div>
          <div style="flex: 1;">
            <label style="font-size: 12px; color: var(--text-muted); display: block; margin-bottom: 4px;">Batch</label>
            <input type="text" id="regBatch" placeholder="3rd Year" required style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-color); color: var(--text-color); font-size: 13px; outline: none;">
          </div>
        </div>

        <div>
          <label style="font-size: 12px; color: var(--text-muted); display: block; margin-bottom: 4px;">Department</label>
          <input type="text" id="regDepartment" value="CSE" required style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-color); color: var(--text-color); font-size: 13px; outline: none;">
        </div>

        <!-- Note: Role selection removed. All new registrations default to 'student'. -->

        <button type="submit" id="regSubmitBtn" style="margin-top: 5px; padding: 11px; background: var(--primary-color); color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 13px;">Register</button>
      </form>

      <div style="text-align: center; margin-top: 15px; font-size: 13px;">
        <span style="color: var(--text-muted);">Already have an account?</span> 
        <a href="#" id="goToLogin" style="color: var(--primary-color); text-decoration: none; font-weight: bold;">Login here</a>
      </div>
    </div>
  `;

  setTimeout(() => {
    const form = container.querySelector("#registerForm");
    const goToLoginBtn = container.querySelector("#goToLogin");

    goToLoginBtn.onclick = (e) => {
      e.preventDefault();
      navigate("login");
    };

    form.onsubmit = async (e) => {
      e.preventDefault();

      const name = container.querySelector("#regName").value.trim();
      const email = container.querySelector("#regEmail").value.trim();
      const password = container.querySelector("#regPassword").value.trim();
      const student_id = container.querySelector("#regStudentId").value.trim();
      const batch = container.querySelector("#regBatch").value.trim();
      const department = container.querySelector("#regDepartment").value.trim();

      try {
        const res = await api.post("/auth/register", {
          name,
          email,
          password,
          student_id,
          batch,
          department,
          // role পাঠানো হলো না, ব্যাকএন্ড নিজে থেকেই এটিকে student সেট করে নেবে
        });

        if (res.success) {
          alert("Registration successful! Please login.");
          navigate("login");
        } else {
          alert(res.message || "Registration failed!");
        }
      } catch (err) {
        console.error("Registration error:", err);
        alert("An error occurred during registration.");
      }
    };
  }, 0);

  return container;
}
