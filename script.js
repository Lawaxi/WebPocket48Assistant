// script.js
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const accountSelect = document.getElementById("accountSelect");
    const selectedNickname = document.getElementById("selectedNickname");
    const selectedId = document.getElementById("selectedId");
    const selectedBalance = document.getElementById("selectedBalance");
    const refreshBalanceButton = document.getElementById("refreshBalanceButton");
    const copyTokenButton = document.getElementById("copyTokenButton");
    const logoutButton = document.getElementById("logoutButton");
    const transferInput = document.getElementById("transferInput");
    const transferButtons = document.querySelectorAll(".transfer-button");

    let currentToken = ""; //此变量只由updateSelectedAccount更改

   //登录前
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const mobile = document.getElementById("mobile").value;
        const pwd = document.getElementById("pwd").value;
        fetch("https://pocketapi.48.cn/user/api/v1/login/app/mobile", {
            method: "POST",
            headers: {
                "Host": "pocketapi.48.cn",
                "Content-Type": "application/json;charset=utf-8",
                "Content-Length": "153",
                "Accept": "*/*",
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive",
                "pa": "MTY5MjY1MzQwODAwMCwyNDExLDIwNzc2MUQxM0E2NjE1MjFCNkE0NkM4QTY4NTVCNjM3LA==",
                "User-Agent": "PocketFans201807/7.1.0 (iPad; iOS 16.6; Scale/2.00)",
                "Accept-Language": "zh-Hans-CN;q=1, zh-Hant-TW;q=0.9",
                "appInfo": JSON.stringify({
                    "vendor": "apple",
                    "deviceId": "4581AA0C-6E65-47AC-8763-03674049AC53",
                    "appVersion": "7.1.0",
                    "appBuild": "23051902",
                    "osVersion": "16.6.0",
                    "osType": "ios",
                    "deviceName": "iPad Air (4th generation)",
                    "os": "ios"
                })
            },
            body: JSON.stringify({ mobile, pwd })
        }).then(response => response.json())
        .then(response => {
        
        if (response.status === 200) {
            const { content } = response;
            
            // Store account info in cookie
            const accountInfo = {
                token: currentToken,
                nickname: content.userInfo.nickname,
                id: content.userInfo.userId,
                balance: content.userInfo.money
            };
            const existingAccountInfos = getExistingAccountInfosFromCookie();
            existingAccountInfos.push(accountInfo);
            const cookieValue = JSON.stringify(existingAccountInfos);
            document.cookie = `accountInfos=${encodeURIComponent(cookieValue)}; `;
            
            updateAccountSelector();
            const newOption = accountSelect.querySelector(`option[value="${accountInfo.id}"]`);
            if (newOption) {
                newOption.selected = true;
            }
            updateSelectedAccount(accountInfo);
            alert("已登录");
        } else {
            alert(`登录失败${response.status}: ${response.message}`);
        }
        });
    });
    
    tokenLoginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const token = tokenInput.value;
        
        fetch("https://pocketapi.48.cn/user/api/v1/user/info/reload", {
            method: "POST",
            headers: {
                "Host": "pocketapi.48.cn",
                "Content-Type": "application/json;charset=utf-8",
                "Content-Length": "153",
                "Accept": "*/*",
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive",
                "pa": "MTY5MjY1MzQwODAwMCwyNDExLDIwNzc2MUQxM0E2NjE1MjFCNkE0NkM4QTY4NTVCNjM3LA==",
                "User-Agent": "PocketFans201807/7.1.0 (iPad; iOS 16.6; Scale/2.00)",
                "Accept-Language": "zh-Hans-CN;q=1, zh-Hant-TW;q=0.9",
                "appInfo": JSON.stringify({
                    "vendor": "apple",
                    "deviceId": "4581AA0C-6E65-47AC-8763-03674049AC53",
                    "appVersion": "7.1.0",
                    "appBuild": "23051902",
                    "osVersion": "16.6.0",
                    "osType": "ios",
                    "deviceName": "iPad Air (4th generation)",
                    "os": "ios"
                }),
                "token":token
            },
            body: "{}"
        }).then(response => response.json())
        .then(response => {
        

        if (response.status === 200) {
            const { content } = response;
            
            // Store account info in cookie
            const accountInfo = {
                token: token,
                nickname: content.nickname,
                id: content.userId,
                balance: content.money
            };
            if(getAccountInfo(accountInfo.id)!==null){
            alert("登录信息中存在相同ID账号");
                return;
            }
            
            const existingAccountInfos = getExistingAccountInfosFromCookie();
            existingAccountInfos.push(accountInfo);
            const cookieValue = JSON.stringify(existingAccountInfos);
            document.cookie = `accountInfos=${encodeURIComponent(cookieValue)}; `;
            
            updateAccountSelector();
            const newOption = accountSelect.querySelector(`option[value="${accountInfo.id}"]`);
            if (newOption) {
                newOption.selected = true;
            }
            updateSelectedAccount(accountInfo);
            alert("已登录");
        } else {
            alert(`登录失败${response.status}: ${response.message}`);
        }
        });
    });

    async function fetchData(url, data) {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Host": "pocketapi.48.cn",
                "Content-Type": "application/json;charset=utf-8",
                "Content-Length": "153",
                "Accept": "*/*",
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive",
                "pa": "MTY5MjY1MzQwODAwMCwyNDExLDIwNzc2MUQxM0E2NjE1MjFCNkE0NkM4QTY4NTVCNjM3LA==",
                "User-Agent": "PocketFans201807/7.1.0 (iPad; iOS 16.6; Scale/2.00)",
                "Accept-Language": "zh-Hans-CN;q=1, zh-Hant-TW;q=0.9",
                "appInfo": JSON.stringify({
                    "vendor": "apple",
                    "deviceId": "4581AA0C-6E65-47AC-8763-03674049AC53",
                    "appVersion": "7.1.0",
                    "appBuild": "23051902",
                    "osVersion": "16.6.0",
                    "osType": "ios",
                    "deviceName": "iPad Air (4th generation)",
                    "os": "ios"
                }),
                "token": currentToken
            },
            body: JSON.stringify(data)
        });

        return await response.json();
    }

   //更新选择器选项
    function updateAccountSelector() {
        accountSelect.innerHTML = "";
        const existingAccountInfos = getExistingAccountInfosFromCookie();
        
        existingAccountInfos.forEach(accountInfo => {
            const option = document.createElement("option");
            option.value = accountInfo.id;
            option.textContent = accountInfo.nickname;
            accountSelect.appendChild(option);
        });
    }
    
    function updateAndSelect(){
        updateAccountSelector();
        const existingAccountInfos = getExistingAccountInfosFromCookie();
        if (existingAccountInfos.length > 0) {
                // Select the first account by default
                const firstAccount = existingAccountInfos[0];
                updateSelectedAccount(firstAccount);
            } else {
                // No accounts available, clear the selected account info
                updateSelectedAccount(null);
            }
    }
    
   //更新当前所选项的显示
    function updateSelectedAccount(accountInfo) {
        if (accountInfo) {
            selectedNickname.textContent = accountInfo.nickname;
            selectedId.textContent = accountInfo.id;
            selectedBalance.textContent = accountInfo.balance;
            currentToken = accountInfo.token;
        } else {
            selectedNickname.textContent = "";
            selectedId.textContent = "";
            selectedBalance.textContent = "";
            currentToken = "";
        }
    }
    
    function getExistingAccountInfosFromCookie() {
        const cookies = document.cookie.split("; ");
        for (const cookie of cookies) {
            const [name, value] = cookie.split("=");
            if (name === "accountInfos") {
                return JSON.parse(decodeURIComponent(value));
            }
        }
        return [];
    }
    
    function getAccountInfo(accountId) {
        const existingAccountInfos = getExistingAccountInfosFromCookie();
        const accountInfo = existingAccountInfos.find(info => info.id == accountId);
        return accountInfo || null;
    }

    
	const giftIdMap = {
    "19999": "325233801525268480",
    "9999": "325232177465593856",
    "5228": "648933371117637632",
    "5000": "266592614883344384",
    "3000": "266592611095887872",
    "2880": "266592635540291584",
    "1500": "566341364751339520",
    "1048": "691322274260520960",
    "148": "721778264055287808",
    "48": "517760052235145216",
    "20": "266592591995027456",
    "10": "266592613964791808",
    "5": "266592588983517184"
};
	
	const images = {
        "5": "/mediasource/gift/0955be61-db0d-4f0e-b8e6-51997c4b36e2.png",
        "10": "/mediasource/gift/1600744089790ItGW8WYXUT.png",
        "20": "/mediasource/gift/16007442056948gPSmtv2qx.png",
        "48": "/mediasource/gift/1601373212779S5y74wAZX7.png",
        "148": "/backstage/2022/0415/cm862hidw54w1mx2kx12z41.png",
        "1048": "/backstage/2022/0121/ft11889bxrh7an37jpjxoa2.png",
        "3000": "/mediasource/gift/15553337023153ze5U4MA89.png",
        "5000": "/backstage/2023/0815/vgm7b56j7hcfa4wx7bzxm6p.png",
        "5228": "/mediasource/gift/1632647273359hRFrAIRrqE.png",
        "1500": "/mediasource/gift/1612955900765VSyq32SQiS.png",
        "2880": "/mediasource/gift/160126314343516DobN4LkC.png",
        "9999": "/mediasource/gift/1555470980437y6m991Qn6E.png",
        "19999": "/mediasource/gift/155547136419221BBECfH6X.png"
    };
	
	function updateTransferButtons() {
		transferButtons.forEach(button => {
			const dataId = button.getAttribute("data-gift-id");
			const imgSrc = `https://source.48.cn${images[dataId]}`; // Add root directory

			const img = document.createElement("img");
			img.src = imgSrc;
			img.style.width = "24px";
			img.style.height = "24px";

			button.prepend(img); // Prepend the image to the button

			button.addEventListener("click", () => transferMoney(giftIdMap[dataId]));
		});
	}
	
    async function transferMoney(giftId) {
        if(currentToken === ""){
            alert("未登录");
            return;
        }
        
        const sendToUserId = transferInput.value;
        if(sendToUserId === ""){
            alert("未输入对方ID");
            return;
        }
        const response = await fetchData("https://pocketapi.48.cn/gift/api/v1/gift/send", {
            businessId: "1639431",
            giftId: giftId,
            sendToRoomId: "1672569",
            isPocketGift: 0,
            giftNum: 1,
            acceptUserId: sendToUserId,
            businessCode: 5,
            token: currentToken
        });

        if (response.status === 200) {
            const updatedBalance = response.content.money;
            selectedBalance.textContent = updatedBalance;
            
            // Update balance in the stored account info        const existingAccountInfos = getExistingAccountInfosFromCookie();
        const updatedAccountInfos = existingAccountInfos.map(info => {
            if (info.token === currentToken) {
                info.balance = updatedBalance;
            }
            return info;
        });

        const cookieValue = JSON.stringify(updatedAccountInfos);
        document.cookie = `accountInfos=${encodeURIComponent(cookieValue)};`;

            alert("转账成功");
        } else {
            alert(`转账失败${response.status}: ${response.message}`);
        }
    }

    refreshBalanceButton.addEventListener("click", async () => {
        if(currentToken === ""){
            alert("未登录");
            return;
        }
        
        const response = await fetchData("https://pocketapi.48.cn/user/api/v1/user/money", {
            token: currentToken
        });

        if (response.status === 200) {
            const updatedBalance = response.content.moneyTotal;
            selectedBalance.textContent = updatedBalance;
            
            // Update balance in the stored account info
        const existingAccountInfos = getExistingAccountInfosFromCookie();
        const updatedAccountInfos = existingAccountInfos.map(info => {
            if (info.token === currentToken) {
                info.balance = updatedBalance;
            }
            return info;
        });

        const cookieValue = JSON.stringify(updatedAccountInfos);
        document.cookie = `accountInfos=${encodeURIComponent(cookieValue)};`;

            alert("余额已刷新");
        } else {
            alert(`刷新余额失败${response.status}: ${response.message}`);
        }
    });
    
    copyTokenButton.addEventListener("click", () => {
        if (currentToken !== "") {
            const tempInput = document.createElement("input");
            tempInput.value = currentToken;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand("copy");
            document.body.removeChild(tempInput);
            alert("Token 已复制到剪贴板！");
        } else {
            alert("未登录");
        }
    });

    logoutButton.addEventListener("click", async () => {
        
        if(currentToken === ""){
            alert("未登录");
            return;
        }
        
        const response = await fetchData("https://pocketapi.48.cn/user/api/v1/logout/user", {});
        if (response.status === 200) {
            // Remove account info from cookie
             const existingAccountInfos = getExistingAccountInfosFromCookie();
            const updatedAccountInfos = existingAccountInfos.filter(info => info.token !== currentToken);
        
            const cookieValue = JSON.stringify(updatedAccountInfos);
            document.cookie = `accountInfos=${encodeURIComponent(cookieValue)};`;
            
            updateAndSelect();
            alert("已退出");
        } else {
            alert(`退出登录失败${response.status}: ${response.message}`);
        }
    });
    
    accountSelect.addEventListener("change", () => {
        const selectedAccountId = accountSelect.value;
        const selectedAccountInfo = getAccountInfo(selectedAccountId);
        updateSelectedAccount(selectedAccountInfo);
    });

    updateAndSelect();
    updateTransferButtons();
});
