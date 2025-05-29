document.addEventListener("DOMContentLoaded", () => {
    const dateInput = document.getElementById("date");
    const priceInput = document.getElementById("price");
    const nameInput = document.getElementById("name");
    const countInput = document.getElementById("count");
    const autoReloadInput = document.getElementById("autoReload");
    const orderInput = document.getElementById("order");

    // 載入設定
    chrome.storage.local.get("kktix_settings", (data) => {
        const settings = data.kktix_settings;

        if (settings) {
            dateInput.value = settings.date || "";
            priceInput.value = settings.price || "";
            nameInput.value = settings.name || "";
            countInput.value = settings.count || 1;
            autoReloadInput.checked = settings.autoReload || false;
            orderInput.value = settings.order || "top-down";
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
        const countRaw = parseInt(countInput.value);
        const autoReload = autoReloadInput.checked;
        const order = orderInput.value;

        if (!date.match(/^\d{2}\/\d{2}$/)) {
            alert("請輸入正確的搶票日期格式，例如 07/20");
            return;
        }

        const count = parseInt(countRaw, 10);
        if (isNaN(count) || count <= 0) {
            alert("請輸入正確的張數（大於 0）");
            return;
        }

        chrome.storage.local.set({
            kktix_settings: { date, price, count, name, autoReload, order }
        }, () => {
            alert("設定已儲存！");
        });
    });
});
