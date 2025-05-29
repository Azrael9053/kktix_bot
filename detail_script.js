// ✅ 模擬使用者點擊（取代 .click()）
function simulateClick(element) {
    const event = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window
    });
    element.dispatchEvent(event);
}

// ✅ 主搶票程式
function startTicketScript() {
    chrome.storage.local.get("kktix_settings", (data) => {
        const setting = data.kktix_settings;
        // 將 name 與 price 關鍵字用空格分割成陣列
        const nameKeywords = (setting.name || "").split(/\s+/).filter(Boolean);
        const priceKeywords = (setting.price || "").split(/\s+/).filter(Boolean);

        let ticketBoxes = Array.from(document.querySelectorAll('.display-table'));
        let found = false;

        switch (setting.order) {
            case "bottom-up":
                ticketBoxes.reverse();
                break;
            case "middle":
                const mid = Math.floor(ticketBoxes.length / 2);
                ticketBoxes = [...ticketBoxes.slice(mid), ...ticketBoxes.slice(0, mid)];
                break;
            case "top-down":
            default:
                // 保持原本順序
                break;
        }

        for (const box of ticketBoxes) {
            const name = box.querySelector('.ticket-name');
            const price = box.querySelector('.ticket-price')?.textContent.trim() || "";

            let cleanName = "";
            for (const node of name.childNodes) {
                if (node.nodeType === Node.TEXT_NODE) {
                    cleanName += node.textContent.trim();
                }
            }
            cleanName = cleanName.replace(/\s+/g, " ").trim();
            const cleanPrice = price.replace(/,/g, "").replace(/\s+/g, "");

            // 判斷 name 或 price 任一關鍵字有符合就成立
            const matchName = nameKeywords.length === 0 || nameKeywords.some(keyword => cleanName.includes(keyword));
            const matchPrice = priceKeywords.length === 0 || priceKeywords.some(keyword => cleanPrice.includes(keyword));

            if (matchName || matchPrice) {
                console.log("✅ 找到票種", cleanName, cleanPrice);
                found = true;

                const plusButton = box.querySelector('.btn-default.plus');

                if (plusButton) {
                    // 強制啟用按鈕（Angular 可能禁用）
                    plusButton.removeAttribute("disabled");

                    for (let i = 0; i < setting.count; i++) {
                        setTimeout(() => {
                            plusButton.removeAttribute("disabled"); // 再次確保可點
                            simulateClick(plusButton);
                            console.log(`🎫 點擊第 ${i + 1} 張`);
                        }, i * 1);
                    }


                    // 等票數點擊完後再勾條款與下一步
                    setTimeout(() => {
                        // ✅ 勾選同意條款
                        const agreeCheckbox = document.querySelector('#person_agree_terms');
                        if (agreeCheckbox && !agreeCheckbox.checked) {
                            simulateClick(agreeCheckbox);
                            // console.log("☑️ 勾選同意條款");
                        }

                        // ✅ 點擊下一步按鈕
                        const nextBtn = [...document.querySelectorAll('button')]
                            .find(btn => btn.textContent.includes("下一步") && !btn.disabled);

                        if (nextBtn) {
                            simulateClick(nextBtn);
                            console.log("🎯 點擊下一步完成");
                        } else {
                            console.warn("⚠️ 找不到下一步按鈕");
                        }
                    }, setting.count * 1);

                    break;
                }
            }
        }
        // 自動刷新
        if (!found && setting.autoReload) {
            console.log("沒有符合條件的票，準備自動重新整理...");
            setTimeout(() => {
                location.reload();
            }, 100); // 延遲 100 豪秒避免過度刷新
        }
    });
}

function removeUnwantedTickets() {
    const wrapper = document.querySelector('.banner-wrapper');
    if (wrapper) {
        wrapper.remove();
    }
    const allTickets = document.querySelectorAll('.ticket-unit');

    allTickets.forEach(ticketBox => {
        const nameElement = ticketBox.querySelector('.ticket-name');
        const soldOutElement = ticketBox.querySelector('.ticket-quantity.ng-binding');

        const nameText = nameElement?.innerText.trim() || '';
        const soldOutText = soldOutElement?.innerText.trim() || '';

        const nameKeywordsToExclude = ['輪椅', '身心障礙', '無障礙', "身障"];
        const isExcludedByName = nameKeywordsToExclude.some(keyword => nameText.includes(keyword));
        const isSoldOut = soldOutText.includes('已售完');

        if (isExcludedByName || isSoldOut) {
            ticketBox.remove();
            // console.log('🚫 已移除不符合條件票種：', nameText || soldOutText);
        }
    });
}


function injectScript(filePath) {
    const script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.src = chrome.runtime.getURL(filePath);  // 動態取得正確路徑
    document.documentElement.appendChild(script);
    script.remove();
}

injectScript("inject.js");


// ✅ 等待票種載入才執行主程式
const checkExist = setInterval(() => {
    const ticketBoxes = document.querySelectorAll('.display-table');
    if (ticketBoxes.length > 0) {
        console.log("✅ 搶票頁面載入完成，開始搶票");
        clearInterval(checkExist);
        removeUnwantedTickets();
        startTicketScript();
    } else {
        console.log("⌛ 等待票種載入中...");
    }
}, 500);
