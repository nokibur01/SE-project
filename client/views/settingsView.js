import { toggleTheme } from "../assets/js/theme.js";

export function SettingsView() {
  const container = document.createElement("div");
  container.className = "settings-container";
  container.style.cssText =
    "padding: 30px; max-width: 700px; margin: 0 auto; color: var(--text-color);";

  container.innerHTML = `
    <h2 style="margin-bottom: 20px; font-size: 22px; color: var(--primary-color);">⚙️ Platform Settings</h2>
    
    <div style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 10px; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <h3 style="font-size: 16px; margin-bottom: 15px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">🎨 Appearance</h3>
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <strong>Theme Mode</strong>
                <p style="font-size: 12px; color: var(--text-muted); margin: 3px 0 0 0;">Switch between Dark and Light mode</p>
            </div>
            <button id="settingsThemeToggle" style="padding: 8px 15px; background: var(--primary-color); color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px;">Toggle Theme</button>
        </div>
    </div>

    <div style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 10px; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <h3 style="font-size: 16px; margin-bottom: 15px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">🔔 Notification Preferences</h3>
        <div style="display: flex; flex-direction: column; gap: 12px;">
            <label style="display: flex; align-items: center; gap: 10px; font-size: 13px; cursor: pointer;">
                <input type="checkbox" checked style="accent-color: var(--primary-color);"> In-app notifications for new resource uploads
            </label>
            <label style="display: flex; align-items: center; gap: 10px; font-size: 13px; cursor: pointer;">
                <input type="checkbox" checked style="accent-color: var(--primary-color);"> Alerts for upcoming task deadlines
            </label>
            <label style="display: flex; align-items: center; gap: 10px; font-size: 13px; cursor: pointer;">
                <input type="checkbox" checked style="accent-color: var(--primary-color);"> Announcements and department events
            </label>
        </div>
    </div>

    <div style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 10px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <h3 style="font-size: 16px; margin-bottom: 15px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">🔒 Security (Change Password)</h3>
        <form id="changePasswordForm" style="display: flex; flex-direction: column; gap: 12px;">
            <input type="password" placeholder="Current Password" required style="padding: 10px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-color); color: var(--text-color); font-size: 13px;">
            <input type="password" placeholder="New Password" required style="padding: 10px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-color); color: var(--text-color); font-size: 13px;">
            <button type="submit" style="padding: 10px; background: var(--primary-color); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 13px;">Update Password</button>
        </form>
    </div>
  `;

  setTimeout(() => {
    const themeBtn = container.querySelector("#settingsThemeToggle");
    if (themeBtn) themeBtn.onclick = () => toggleTheme();

    const form = container.querySelector("#changePasswordForm");
    form.onsubmit = (e) => {
      e.preventDefault();
      alert("Password updated successfully!");
      form.reset();
    };
  }, 0);

  return container;
}
