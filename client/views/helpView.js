export function HelpView() {
  const container = document.createElement("div");
  container.className = "help-container";
  container.style.cssText =
    "padding: 30px; max-width: 700px; margin: 0 auto; color: var(--text-color);";

  container.innerHTML = `
    <h2 style="margin-bottom: 20px; font-size: 22px; color: var(--primary-color);">❓ Help & Support</h2>
    
    <div style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 10px; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <h3 style="font-size: 16px; margin-bottom: 12px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">📌 Frequently Asked Questions</h3>
        <div style="display: flex; flex-direction: column; gap: 12px; font-size: 13px;">
            <div>
                <strong>Q: Why is my uploaded resource showing as "Pending"?</strong>
                <p style="color: var(--text-muted); margin: 4px 0 0 0;">Ans: Student uploads require CR or Admin approval before they become publicly visible to the batch.</p>
            </div>
            <div>
                <strong>Q: How do I track task deadlines?</strong>
                <p style="color: var(--text-muted); margin: 4px 0 0 0;">Ans: Check the high-priority widget on your Dashboard or visit the Tasks & Deadlines page.</p>
            </div>
            <div>
                <strong>Q: How does the global search work?</strong>
                <p style="color: var(--text-muted); margin: 4px 0 0 0;">Ans: Use the topbar search bar, select a specific category from the dropdown or choose "All Categories", and press Enter.</p>
            </div>
        </div>
    </div>

    <div style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 10px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <h3 style="font-size: 16px; margin-bottom: 12px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">✉️ Report a Bug / Contact CR</h3>
        <form id="supportForm" style="display: flex; flex-direction: column; gap: 12px;">
            <input type="text" placeholder="Your Subject / Issue Title" required style="padding: 10px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-color); color: var(--text-color); font-size: 13px;">
            <textarea placeholder="Describe your problem or feedback..." rows="4" required style="padding: 10px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-color); color: var(--text-color); font-size: 13px; resize: none;"></textarea>
            <button type="submit" style="padding: 10px; background: var(--primary-color); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 13px;">Send Feedback</button>
        </form>
    </div>
  `;

  setTimeout(() => {
    const form = container.querySelector("#supportForm");
    form.onsubmit = (e) => {
      e.preventDefault();
      alert("Your message has been sent to the support team / CRs!");
      form.reset();
    };
  }, 0);

  return container;
}
