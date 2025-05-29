chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({ text: "OFF" });
    chrome.action.setBadgeBackgroundColor({ color: "#d9534f" });
    chrome.storage.local.set({ botEnabled: false });
});

chrome.commands.onCommand.addListener((command) => {
    if (command === "toggle-bot") {
        chrome.storage.local.get("botEnabled", (data) => {
            const newStatus = !data.botEnabled;
            chrome.storage.local.set({ botEnabled: newStatus });

            chrome.action.setBadgeText({ text: newStatus ? "ON" : "OFF" });
            chrome.action.setBadgeBackgroundColor({
                color: newStatus ? "#5cb85c" : "#d9534f"
            });

            if (newStatus) {
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    if (tabs.length > 0) {
                        chrome.tabs.reload(tabs[0].id);
                    }
                });

            }
        });
    }
});
