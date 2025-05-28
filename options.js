document.addEventListener("DOMContentLoaded", () => {
    const dateInput = document.getElementById("date");
    const priceInput = document.getElementById("price");
    const nameInput = document.getElementById("name");
    const countInput = document.getElementById("count");
    const autoReloadInput = document.getElementById("autoReload");

    // 載入設定
    chrome.storage.local.get("kktix_settings", (data) => {
        const settings = data.kktix_settings;

        if (settings) {
            dateInput.value = settings.date || "";
            priceInput.value = settings.price || "";
            nameInput.value = settings.name || "";
            countInput.value = settings.count || 1;
            autoReloadInput.checked = settings.autoReload || false;
        } else {
            dateInput.placeholder = "例如：2025/06/01";
            priceInput.placeholder = "例如：3000 或 TWD$3,000";
            nameInput.placeholder = "例如：VIP、紅2E";
            countInput.placeholder = "購買張數，如 2";
        }
    });

    // 儲存設定
    document.getElementById("save").addEventListener("click", () => {
        const date = dateInput.value;
        const price = priceInput.value;
        const name = nameInput.value;
        const count = parseInt(countInput.value);
        const autoReload = autoReloadInput.checked;

        chrome.storage.local.set({
            kktix_settings: { date, price, count, name, autoReload }
        }, () => {
            alert("設定已儲存！");
        });
    });
});
