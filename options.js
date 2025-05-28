document.getElementById("save").addEventListener("click", () => {
    const date = document.getElementById("date").value;
    const price = document.getElementById("price").value;
    const name = document.getElementById("name").value;
    const count = parseInt(document.getElementById("count").value);

    chrome.storage.local.set({ kktix_settings: { date, price, count, name } }, () => {
        alert("設定已儲存！");
    });
});
