// console.log("✅ content.js loaded!");
const description = document.querySelector(".description");
if (description) {
    description.remove();
}
chrome.storage.local.get(["kktix_settings", "botEnabled"], (data) => {
    console.log("讀取設定", data);
    const settings = data.kktix_settings;
    const botEnabled = data.botEnabled;
    if (!botEnabled) {
        console.log("⏸️ 機器人目前關閉中，跳過搶票流程");
        return;
    }
    if (!settings) {
        console.log("沒有設定，跳過自動導向");
        return;
    }

    const { date, session, dateOrder } = settings;
    const sessionKeywords = (session || "").split(/\s+/).filter(Boolean);
    let items = Array.from(document.querySelectorAll(".event-list li"));

    // 日期搜尋順序
    switch (dateOrder) {
        case "bottom-up":
            items.reverse();
            break;
        case "middle":
            const mid = Math.floor(items.length / 2);
            items = [...items.slice(mid), ...items.slice(0, mid)];
            break;
        case "top-down":
        default:
            // 保持原本順序
            break;
    }

    for (const item of items) {
        const dateEl = item.querySelector(".timezoneSuffix");
        const sessionText = item.querySelector("p")?.textContent || "";
        if (
            dateEl && dateEl.textContent.includes(date) &&
            (
                sessionKeywords.length === 0 ||
                sessionKeywords.some(keyword => sessionText.includes(keyword))
            )
        ) {
            const link = item.querySelector("a.btn-point");
            if (link) {
                // console.log("找到目標活動，導向搶票頁...");
                window.location.href = link.href;
                break;
            }
        }
    }
});
