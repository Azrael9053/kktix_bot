// console.log("✅ content.js loaded!");
const description = document.querySelector(".description");
if (description) {
    description.remove();
}
chrome.storage.local.get("kktix_settings", (data) => {
    console.log("讀取設定", data);
    const settings = data.kktix_settings;
    if (!settings) {
        console.log("沒有設定，跳過自動導向");
        return;
    }

    const { date } = settings;
    const items = document.querySelectorAll(".event-list li");

    for (const item of items) {
        const dateEl = item.querySelector(".timezoneSuffix");
        if (dateEl && dateEl.textContent.includes(date)) {
            const link = item.querySelector("a.btn-point");
            if (link) {
                // console.log("找到目標活動，導向搶票頁...");
                window.location.href = link.href;
                break;
            }
        }
    }
});
