// script.js
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const smsLoginForm = document.getElementById("smsLoginForm");
    const accountSelect = document.getElementById("accountSelect");
    const deleteAccountButton = document.getElementById("deleteAccountButton");
    const selectedNickname = document.getElementById("selectedNickname");
    const selectedId = document.getElementById("selectedId");
    const selectedBalance = document.getElementById("selectedBalance");

    const nicknameInput = document.getElementById("nicknameInput");
    const modifyNicknameButton = document.getElementById("modifyNicknameButton");

    const refreshBalanceButton = document.getElementById("refreshBalanceButton");
    const copyIdButton = document.getElementById("copyIdButton");
    const copyTokenButton = document.getElementById("copyTokenButton");
    const logoutButton = document.getElementById("logoutButton");

    var currentToken = ""; //此变量只由updateSelectedAccount更改
    var privateMode = isPrivateMode(); //iOS Safari无痕模式禁用localStorge

    //直播送礼
    const liveSelect = document.getElementById("liveSelect");
    const refreshLiveButton = document.getElementById("refreshLiveButton");
    const transferButtons = document.querySelectorAll(".transfer-button");

    //翻牌列表
    const getAnswerButton = document.getElementById("getAnswerButton");
    const arrangeAnswerButton = document.getElementById("arrangeAnswerButton");
    const downloadAnswerButton = document.getElementById("downloadAnswerButton");
    const upPageButton = document.getElementById("upPage");
    const downPageButton = document.getElementById("downPage");

    const answerListContainer = document.getElementById("answerListContainer");
    const chartContainer = document.getElementById("chartContainer");

    //翻牌
    const opponentIdInput = document.getElementById("opponentId");
    const answerTypeSelect = document.getElementById("answerType");
    const typeSelect = document.getElementById("type");
    const priceInput = document.getElementById("price");
    const contentTextarea = document.getElementById("content");
    const askQuestionButton = document.getElementById("askQuestion");
    let cardPrices = {};

    //房间资源下载
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const serverSelect = document.getElementById("serverSelect");
    const userIdInput = document.getElementById("userIdInput");
    const serverIdInput = document.getElementById("serverIdInput");
    const getAlbumButton = document.getElementById("getAlbumButton");

    const albumContainer = document.getElementById("albumContainer");

    //fetchData
    const request = document.getElementById("request");
    const responseBodyInput = document.getElementById("responseBodyInput");
    const copyBodyButton = document.getElementById("copyBodyButton");

    let serverData = [];

    function isPrivateMode() {
        try {
            localStorage.test = 'test';
            delete localStorage.test;
            return false;
        } catch (e) {
            return true;
        }
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
        "20": "329371855474139140", //266592591995027456
        "10": "266592613964791808",
        "5": "266592588983517184"
    };

    const images = {
        "5": "/mediasource/gift/0955be61-db0d-4f0e-b8e6-51997c4b36e2.png",
        "10": "/mediasource/gift/1600744089790ItGW8WYXUT.png",
        "20": "/mediasource/emoticon/1e657eb2-534e-4ff9-93f8-267870c4e453.png", ///mediasource/gift/16007442056948gPSmtv2qx.png
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

    /*  登录  */
    //登录前
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const mobile = document.getElementById("mobile")
            .value;
        const pwd = document.getElementById("pwd")
            .value;

        const loginResponse = await fetchDataBeforeLogin("https://pocketapi.48.cn/user/api/v1/login/app/mobile", {
            mobile,
            pwd
        });

        document.getElementById("mobile")
            .value = "";
        if (saveLoginReturns(loginResponse)) {
            document.getElementById("pwd")
                .value = "";
        }
    });

    smsLoginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const areaCode = document.getElementById("areaCodeInput")
            .value;
        const mobile = document.getElementById("mobileInput")
            .value;

        // 发送验证码请求
        const sendCodeResponse = await fetchDataBeforeLogin("https://pocketapi.48.cn/user/api/v1/sms/send2", {
            mobile: mobile,
            area: areaCode,
        });

        if (sendCodeResponse.status === 200) {
            // 弹出输入验证码的提示框
            const code = prompt("请输入验证码：");

            if (code) {
                // 发送验证码登录请求
                const loginResponse = await fetchDataBeforeLogin("https://pocketapi.48.cn/user/api/v1/login/app/mobile/code", {
                    mobile: mobile,
                    code: code,
                });

                document.getElementById("areaCodeInput")
                    .value = "86";
                if (saveLoginReturns(loginResponse)) {
                    document.getElementById("mobileInput")
                        .value = "";
                }
            } else {
                alert("请输入验证码");
            }
        } else {
            alert(`发送验证码失败: ${sendCodeResponse.status}`);
        }
    });

    tokenLoginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const ltoken = tokenInput.value;
        var ctoken = currentToken;
        currentToken = ltoken;
        const response = await fetchData("https://pocketapi.48.cn/user/api/v1/user/info/reload", {});
        currentToken = ctoken;

        if (response.status === 200) {
            const {
                content
            } = response;

            // Store account info in LocalStorage
            const accountInfo = {
                token: ltoken,
                nickname: content.nickname,
                id: content.userId,
                balance: content.money
            };
            if (getAccountInfo(accountInfo.id) !== null) {
                alert("登录信息中存在相同ID账号");
                return;
            }
            const accountInfos = getAccountInfosFromLocalStorage();
            accountInfos.push(accountInfo);
            storeAccountInfosToLocalStorage(accountInfos);

            updateAccountSelector();
            const newOption = accountSelect.querySelector(`option[value="${accountInfo.id}"]`);
            if (newOption) {
                newOption.selected = true;
            }
            updateSelectedAccount(accountInfo);
            alert("已登录");
        } else {
            alert(`信息获取失败${response.status}: ${response.message}`);
        }

        tokenInput.value = "";
    });

    async function fetchDataBeforeLogin(url, data) {
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
                    "vendor": "Huawei",
                    "deviceId": "F2BA149C-06DB-9843-31DE-36BF375E36F2",
                    "appVersion": "7.1.0",
                    "appBuild": "23051902",
                    "osVersion": "16.6.0",
                    "osType": "ios",
                    "deviceName": "Huawei",
                    "os": "ios"
                })
            },
            body: JSON.stringify(data)
        });

        return await response.json();
    }

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
                    "vendor": "Huawei",
                    "deviceId": "F2BA149C-06DB-9843-31DE-36BF375E36F2",
                    "appVersion": "7.1.0",
                    "appBuild": "23051902",
                    "osVersion": "16.6.0",
                    "osType": "ios",
                    "deviceName": "Huawei",
                    "os": "ios"
                }),
                "token": currentToken
            },
            body: JSON.stringify(data)
        });

        return await response.json();
    }

    // 存储账户信息到 LocalStorage
    function storeAccountInfosToLocalStorage(accountInfos) {
        if (privateMode) {
            const cookieValue = JSON.stringify(accountInfos);
            document.cookie = `accountInfos=${encodeURIComponent(cookieValue)}; `;
        } else {
            localStorage.setItem('accountInfos', JSON.stringify(accountInfos));
        }
    }

    // 从 LocalStorage 中读取账户信息
    function getAccountInfosFromLocalStorage() {
        try {
            if (privateMode) {
                const cookies = document.cookie.split("; ");
                for (const cookie of cookies) {
                    const [name, value] = cookie.split("=");
                    if (name === "accountInfos") {
                        return JSON.parse(decodeURIComponent(value));
                    }
                }
                return [];
            } else {
                const storedAccountInfos = localStorage.getItem('accountInfos');
                return storedAccountInfos ? JSON.parse(storedAccountInfos) : [];
            }
        } catch (e) {
            return [];
        }
    }

    function getAccountInfo(accountId) {
        const accountInfos = getAccountInfosFromLocalStorage();
        const accountInfo = accountInfos.find(info => info.id == accountId);
        return accountInfo || null;
    }

    //更新选择器选项
    function updateAccountSelector() {
        accountSelect.innerHTML = "";
        const accountInfos = getAccountInfosFromLocalStorage();

        accountInfos.forEach(accountInfo => {
            const option = document.createElement("option");
            option.value = accountInfo.id;
            option.textContent = accountInfo.nickname;
            accountSelect.appendChild(option);
        });
    }

    function updateAndSelect() {
        updateAccountSelector();
        const accountInfos = getAccountInfosFromLocalStorage();
        if (accountInfos.length > 0) {
            // Select the first account by default
            const firstAccount = accountInfos[0];
            updateSelectedAccount(firstAccount);
        } else {
            // No accounts available, clear the selected account info
            updateSelectedAccount(null);
        }
    }

    //更新当前所选项的显示
    function updateSelectedAccount(accountInfo) {
        if (accountInfo) {
            currentToken = accountInfo.token;
            selectedNickname.textContent = accountInfo.nickname;
            selectedId.textContent = accountInfo.id;
            selectedBalance.textContent = accountInfo.balance;
        } else {
            currentToken = "";
            selectedNickname.textContent = "";
            selectedId.textContent = "";
            selectedBalance.textContent = "";
        }
    }

    function saveLoginReturns(response) {
        if (response.status === 200) {
            const {
                content
            } = response;

            // Store account info in LocalStorage
            const accountInfo = {
                token: content.token,
                nickname: content.userInfo.nickname,
                id: content.userInfo.userId,
                balance: content.userInfo.money
            };
            const accountInfos = getAccountInfosFromLocalStorage();
            accountInfos.push(accountInfo);
            storeAccountInfosToLocalStorage(accountInfos);

            updateAccountSelector();
            const newOption = accountSelect.querySelector(`option[value="${accountInfo.id}"]`);
            if (newOption) {
                newOption.selected = true;
            }
            updateSelectedAccount(accountInfo);
            alert("已登录");
            return true;
        } else {
            alert(`登录失败${response.status}: ${response.message}`);
            return false;
        }
    }

    deleteAccountButton.addEventListener("click", () => {
        const selectedAccountId = accountSelect.value;

        if (selectedAccountId) {
            const accountInfos = getAccountInfosFromLocalStorage();
            const updatedAccountInfos = accountInfos.filter(info => info.id != selectedAccountId);
            //info.id为数值 selectedAccountId为字符串
            storeAccountInfosToLocalStorage(updatedAccountInfos);

            updateAndSelect();
        }
    });

    modifyNicknameButton.addEventListener("click", async () => {
        if (currentToken === "") {
            alert("未登录");
            return;
        }

        const newNickname = nicknameInput.value;

        if (!newNickname || newNickname === selectedNickname.textContent) {
            alert("输入昵称为空或与原昵称相同。");
            return;
        }

        const response = await fetchData("https://pocketapi.48.cn/user/api/v1/user/info/edit", {
            key: "nickname",
            value: newNickname
        });

        if (response.status === 200) {
            alert("修改昵称成功，正在审核。");
        } else {
            alert(`修改昵称失败: ${response.message}`);
        }
    });

    refreshBalanceButton.addEventListener("click", async () => {
        if (currentToken === "") {
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
            const accountInfos = getAccountInfosFromLocalStorage();
            const updatedAccountInfos = accountInfos.map(info => {
                if (info.token === currentToken) {
                    info.balance = updatedBalance;
                }
                return info;
            });
            storeAccountInfosToLocalStorage(updatedAccountInfos);

            alert("余额已刷新");
        } else {
            alert(`刷新余额失败${response.status}: ${response.message}`);
        }
    });

    copyIdButton.addEventListener("click", () => {
        const tempInput = document.createElement("input");
        tempInput.value = accountSelect.value;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
        alert("ID 已复制到剪贴板！");
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
        if (currentToken === "") {
            alert("未登录");
            return;
        }

        const response = await fetchData("https://pocketapi.48.cn/user/api/v1/logout/user", {});
        if (response.status === 200 || response.status === 401004) {
            // Remove account info from LocalStorage
            const accountInfos = getAccountInfosFromLocalStorage();
            const updatedAccountInfos = accountInfos.filter(info => info.token !== currentToken);
            storeAccountInfosToLocalStorage(updatedAccountInfos);

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

    /*  直播送礼  */
    let selectedUserId = null;
    let selectedCrm = null;

    refreshLiveButton.addEventListener("click", async () => {
        if (currentToken === "") {
            alert("未登录");
            return;
        }

        const liveListResponse = await fetchData("https://pocketapi.48.cn/live/api/v1/live/getLiveList", {
            groupId: 0,
            debug: true,
            next: 0,
            record: false
        });

        if (liveListResponse.status !== 200) {
            alert(`获取直播列表失败：${liveListResponse.status}`);
            return;
        }

        // 清空旧的选项
        liveSelect.innerHTML = "";

        const liveList = liveListResponse.content.liveList;
        if (Array.isArray(liveList) && liveList.length > 0) {
            // 填充选择框
            liveList.forEach((live, index) => {
                const option = document.createElement("option");
                option.value = live.liveId;
                option.textContent = `${live.title} (${live.userInfo.nickname})`;
                liveSelect.appendChild(option);
            });
        } else {
            alert("没有可用的直播");
        }
    });



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
        if (currentToken === "") {
            alert("未登录");
            return;
        }

        const liveId = liveSelect.value;

        if (!liveId || !selectedCrm || !selectedUserId) {
            alert("请选择一个直播");
            return;
        }

        // 发送转账请求
        const response = await fetchData("https://pocketapi.48.cn/gift/api/v1/gift/send", {
            giftId: giftId,
            businessId: liveId,
            isPocketGift: 0,
            crm: selectedCrm,
            giftNum: 1,
            acceptUserId: selectedUserId,
            businessCode: 0
        });

        if (response.status === 200) {
            const updatedBalance = response.content.money;
            selectedBalance.textContent = updatedBalance;

            // Update balance in the stored account info 
            const accountInfos = getAccountInfosFromLocalStorage();
            const updatedAccountInfos = accountInfos.map(info => {
                if (info.token === currentToken) {
                    info.balance = updatedBalance;
                }
                return info;
            });

            storeAccountInfosToLocalStorage(updatedAccountInfos);
            alert(response.message);
        } else {
            alert(`送礼失败：${response.status}: ${response.message}`);
        }
    }

    // 选择框选择事件
    liveSelect.addEventListener("change", async () => {
        if (currentToken === "") {
            alert("未登录");
            return;
        }

        const liveId = liveSelect.value;
        if (!liveId) {
            alert("未选择");
            return;
        }

        // 发送获取直播信息的请求
        const liveInfoResponse = await fetchData("https://pocketapi.48.cn/live/api/v1/live/getLiveOne", {
            liveId: liveId
        });

        if (liveInfoResponse.status !== 200) {
            alert(`获取直播信息失败：${liveInfoResponse.message}`);
            return;
        }

        // 存储 userId 和 crm
        selectedUserId = liveInfoResponse.content.user.userId;
        selectedCrm = liveInfoResponse.content.crm;
    });

    /*  翻牌  */
    document.getElementById("getCardPrice").addEventListener("click", async () => {
        if (currentToken === "") {
            alert("未登录");
            return;
        }

        const opponentId = opponentIdInput.value;
        const requestBody = {
            "memberId": opponentId
        };

        const response = await fetchData("https://pocketapi.48.cn/idolanswer/api/idolanswer/v2/custom/index", requestBody);

        if (response && response.status === 200) {
            cardPrices = response.content.customs;
            alert("翻牌价格获取成功");
            calculatePrice();
        } else {
            alert(`获取失败: ${response.message}`);
        }
    });

    function calculatePrice() {
        const answerType = answerTypeSelect.value;
        const type = typeSelect.value;

        for (const price of cardPrices) {
            if (price.answerType === parseInt(answerType)) {
                if (type === "1") {
                    priceInput.value = price.normalCost;
                } else if (type === "2") {
                    priceInput.value = price.anonymityCost;
                } else if (type === "3") {
                    priceInput.value = price.privateCost;
                }
                break;
            }
        }
    }

    answerTypeSelect.addEventListener("change", calculatePrice);
    typeSelect.addEventListener("change", calculatePrice);

    askQuestionButton.addEventListener("click", async () => {
        if (currentToken === "") {
            alert("未登录");
            return;
        }

        const opponentId = opponentIdInput.value;
        const content = contentTextarea.value;
        const answerType = answerTypeSelect.value;
        const type = typeSelect.value;
        const cost = priceInput.value;

        const requestBody = {
            "memberId": parseInt(opponentId),
            "content": content,
            "type": parseInt(type),
            "cost": cost,
            "answerType": parseInt(answerType)
        };

        const response = await fetchData("https://pocketapi.48.cn/idolanswer/api/idolanswer/v1/user/question", requestBody);

        if (response && response.status === 200) {
            alert("提问成功");
        } else {
            alert(`提问失败: ${response.message}`);
        }
    });

    /*  翻牌列表  */
    let startIndex = 0; // 起始序号
    let displayType = false; //0表示读取在线翻牌列表；1表示读取上传翻牌列表

    getAnswerButton.addEventListener("click", async () => {
        displayType = false;
        startIndex = 0;
        fetchAndDisplayAnswers();
    });

    upPageButton.addEventListener("click", () => {
        if (startIndex >= 20) {
            startIndex -= 20;
            if (displayType) {
                displayAnswers(JSON.parse(allAnswer), 20, startIndex);
            } else {
                fetchAndDisplayAnswers();
            }
        } else {
            upPageButton.disabled = true;
        }
    });

    downPageButton.addEventListener("click", () => {
        startIndex += 20;
        if (displayType) {
            displayAnswers(JSON.parse(allAnswer), 20, startIndex);
        } else {
            fetchAndDisplayAnswers();
        }
    });

    function formatTimestamp(timestamp) {
        const time = new Date(timestamp);
        const formattedTime = time.toLocaleString("zh-CN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        });
        return formattedTime;
    }

    async function displayAnswers(answerList, maxLength, start) {
        while (answerListContainer.firstChild) {
            answerListContainer.removeChild(answerListContainer.firstChild);
        }

        const end = answerList.length < start + maxLength ? answerList.length : start + maxLength;
        if (end <= start || start < 0) {
            // 显示无更多内容
            const noMoreDiv = document.createElement("div");
            noMoreDiv.classList.add("answer-no-more")
            noMoreDiv.textContent = "没有翻牌";
            answerListContainer.appendChild(noMoreDiv);
        } else {
            for (var i = start; i < end; i++) {
                const answer = answerList[i];

                const answerDiv = document.createElement("div");
                answerDiv.classList.add("answer-element");

                // 第一行：时间和状态
                const timeStatusDiv = document.createElement("div");
                timeStatusDiv.classList.add("answer-time-status");
                const time = document.createElement("p");
                time.textContent = formatTimestamp(parseInt(answer.qtime));
                const status = document.createElement("p");
                status.classList.add("answer-status");
                if (answer.status === 1) {
                    status.textContent = "未翻";
                    if (!displayType) {
                        status.textContent += "";
                        const retractLink = document.createElement("a");
                        retractLink.textContent = "撤回";
                        retractLink.href = "#";
                        retractLink.addEventListener("click", () => {
                            retractAnswer(answer.questionId);
                        });
                        status.appendChild(retractLink);
                    }
                } else if (answer.status === 2) {
                    status.textContent = "已翻";
                } else {
                    status.textContent = "已退款";
                }
                timeStatusDiv.appendChild(time);
                timeStatusDiv.appendChild(status);

                // 第二行：翻牌内容
                const contentDiv = document.createElement("div");
                contentDiv.classList.add("answer-content");
                contentDiv.textContent = answer.content;

                // 第三行：答案图标
                const answerIconDiv = document.createElement("div");
                answerIconDiv.classList.add("answer-icon");
                const costIcon = document.createElement("p");
                costIcon.textContent = answer.cost + "鸡腿";
                const answerTypeIcon = document.createElement("p");
                if (answer.answerType === 1) {
                    answerTypeIcon.textContent = "文字翻牌";
                } else if (answer.answerType === 2) {
                    answerTypeIcon.textContent = "语音翻牌";
                } else if (answer.answerType === 3) {
                    answerTypeIcon.textContent = "视频翻牌";
                }
                answerIconDiv.appendChild(costIcon);
                answerIconDiv.appendChild(answerTypeIcon);

                answerDiv.appendChild(timeStatusDiv);
                answerDiv.appendChild(contentDiv);
                answerDiv.appendChild(answerIconDiv);

                if (answer.status === 2) {
                    // 第四行：对方信息
                    const idolInfoDiv = document.createElement("div");
                    idolInfoDiv.classList.add("answer-reply-info");
                    const idolNickname = answer.baseUserInfo.nickname;
                    const idolTeamLogo = `https://source.48.cn${answer.baseUserInfo.teamLogo}`;
                    idolInfoDiv.innerHTML = `${idolNickname} 的翻牌 <img src="${idolTeamLogo}" />`;

                    // 第五行：翻牌时间
                    const answerTimeDiv = document.createElement("div");
                    answerTimeDiv.classList.add("answer-reply-time");
                    const answerTime = formatTimestamp(parseInt(answer.answerTime));
                    answerTimeDiv.textContent = `翻牌时间：${answerTime}`;

                    // 第六行：翻牌内容
                    const answerContentDiv = document.createElement("div");
                    answerContentDiv.classList.add("answer-reply-content");
                    if (answer.answerType === 1) {
                        answerContentDiv.textContent = answer.answerContent;
                    } else if (answer.answerType === 2) {
                        const audioPlayer = document.createElement("audio");
                        audioPlayer.controls = true;
                        audioPlayer.src = `https://mp4.48.cn${JSON.parse(answer.answerContent).url}`;
                        answerContentDiv.appendChild(audioPlayer);
                    } else if (answer.answerType === 3) {
                        const videoPlayer = document.createElement("video");
                        videoPlayer.controls = true;
                        videoPlayer.src = `https://mp4.48.cn${JSON.parse(answer.answerContent).url}`;
                        answerContentDiv.appendChild(videoPlayer);
                    }

                    answerDiv.appendChild(idolInfoDiv);
                    answerDiv.appendChild(answerTimeDiv);
                    answerDiv.appendChild(answerContentDiv);
                }

                answerListContainer.appendChild(answerDiv);
            }
        }

        // 判断是否需要禁用分页按钮
        if (startIndex < 20) {
            upPageButton.disabled = true;
        } else {
            upPageButton.disabled = false;
        }
        if (end - start < 20 || (displayType && answerList.length === end)) {
            downPageButton.disabled = true;
        } else {
            downPageButton.disabled = false;
        }
    }

    async function fetchAndDisplayAnswers() {
        if (currentToken === "") {
            alert("未登录");
            return;
        }

        const response = await fetchData("https://pocketapi.48.cn/idolanswer/api/idolanswer/v1/user/question/list", {
            status: 0,
            beginLimit: startIndex,
            memberId: "",
            limit: 20
        });

        if (response.status === 200) {
            const answerList = response.content;
            displayAnswers(answerList, 20, 0);
        } else {
            alert(`获取翻牌数据失败：${response.message}`);
        }
    }

    async function retractAnswer(questionId) {
        if (currentToken === "") {
            alert("未登录");
            return;
        }

        const response = await fetchData("https://pocketapi.48.cn/idolanswer/api/idolanswer/v1/user/question/operate", {
            memberId: "",
            questionId: questionId
        });

        if (response.status === 200) {
            fetchAndDisplayAnswers();
        } else {
            alert(`撤回失败：${response.message}`);
        }
    }

    document.getElementById("uploadAnswerList").addEventListener("click", function() {
        document.getElementById("fileInput").click();
    });

    document.getElementById("fileInput").addEventListener("change", function(event) {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function(e) {
                const content = e.target.result;
                allAnswer = JSON.stringify(JSON.parse(content));
                downloadAnswerButton.disabled = false;
                displayType = true;
                startIndex = 0;
                displayAnswers(JSON.parse(allAnswer), 20, 0);
            };

            reader.readAsText(file);
        }
    });

    var allAnswer = "";

    arrangeAnswerButton.addEventListener("click", async () => {
        if (currentToken === "") {
            alert("未登录");
            return;
        }

        const loadingMessage = document.getElementById("loadingMessage");
        loadingMessage.style.display = "block";
        downloadAnswerButton.disabled = true;

        let allUserData = [];
        let beginLimit = 0;
        let responseSize = 20;

        while (responseSize > 0) {
            const response = await fetchData("https://pocketapi.48.cn/idolanswer/api/idolanswer/v1/user/question/list", {
                status: 0,
                beginLimit: beginLimit,
                memberId: "",
                limit: 20
            });

            if (response.status === 200) {
                const userData = response.content;
                allUserData = allUserData.concat(userData);
                responseSize = userData.length;
                beginLimit += 20;
            } else {
                alert(`获取翻牌数据失败: ${response.message}`);
                break;
            }
        }

        loadingMessage.style.display = "none";

        if (allUserData.length > 0) {
            // 统计翻牌来源的数量和总金额
            const sourceData = {};
            allUserData.forEach(card => {
                if (card.status == 2) {
                    const source = card.baseUserInfo.starName;
                    const cost = card.cost;
                    if (!sourceData[source]) {
                        sourceData[source] = {
                            count: 1,
                            totalCost: cost
                        };
                    } else {
                        sourceData[source].count++;
                        sourceData[source].totalCost += cost;
                    }
                }
            });

            const sortedSourceData = Object.entries(sourceData)
                .sort((a, b) => b[1].count - a[1].count);

            // 创建柱状图
            if (sortedSourceData.length) {
                chartContainer.innerHTML = "";
                sortedSourceData.forEach(([source, data]) => {
                    const barContainer = document.createElement("div");
                    barContainer.style.display = "flex";
                    barContainer.style.alignItems = "flex-end";
                    barContainer.style.marginBottom = "5px";

                    const bar = document.createElement("div");
                    bar.style.width = `${data.count * 10}px`;
                    bar.style.height = "20px";
                    bar.style.backgroundColor = "lightblue";
                    bar.style.borderRadius = "10px";

                    const label = document.createElement("span");
                    label.textContent = `${source} (${data.count} / ${data.totalCost} 鸡腿)`;
                    label.style.marginLeft = "5px";

                    barContainer.appendChild(bar);
                    barContainer.appendChild(label);

                    chartContainer.appendChild(barContainer);
                });
            } else {
                chartContainer.innerHTML = "无已翻翻牌";
            }
        } else {
            alert("无翻牌记录");
        }

        allAnswer = JSON.stringify(allUserData);
        downloadAnswerButton.disabled = false;
    });

    downloadAnswerButton.addEventListener("click", async () => {
        const blob = new Blob([allAnswer], {
            type: "application/json"
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${selectedId.textContent}-${selectedNickname.textContent}.json`;
        document.body.appendChild(a);

        a.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    });

    /*  房间资源下载  */
    searchButton.addEventListener("click", async () => {
        if (currentToken === "") {
            alert("未登录");
            return;
        }

        const searchContent = searchInput.value;
        if (searchContent) {
            const response = await fetchData("https://pocketapi.48.cn/im/api/v1/im/server/search", {
                searchContent: searchContent
            });

            if (response.status === 200) {
                serverData = [];

                if (response.content.serverApiList && response.content.serverApiList.length !== 0) {
                    serverSelect.innerHTML = '';

                    response.content.serverApiList.forEach((server, index) => {
                        const option = document.createElement("option");
                        option.value = index;
                        option.textContent = server.serverName + ' (' + server.serverDefaultName + ')';
                        serverSelect.appendChild(option);

                        serverData.push({
                            starId: server.serverOwner,
                            serverId: server.serverId
                        });
                    });

                    serverSelect.selectedIndex = 0;
                    userIdInput.value = serverData[0].starId;
                    serverIdInput.value = serverData[0].serverId;
                } else {
                    serverSelect.innerHTML = '<option disabled="" selected="">选择搜索结果</option>';
                    alert("无匹配结果");
                }
            } else {
                alert(`搜索失败: ${response.message}`);
            }
        }
    });

    serverSelect.addEventListener("change", () => {
        const selectedIndex = serverSelect.value;

        if (selectedIndex >= 0) {
            userIdInput.value = serverData[selectedIndex].starId;
            serverIdInput.value = serverData[selectedIndex].serverId;
        } else {
            userIdInput.value = "";
            serverIdInput.value = "";
        }
    });

    getAlbumButton.addEventListener("click", async () => {
        if (currentToken === "") {
            alert("未登录");
            return;
        }

        const userId = userIdInput.value;
        const serverId = serverIdInput.value;

        if (userId && serverId) {
            let totalPages = 1;
            let page = 0;
            let combinedUserNftList = [];

            while (page < totalPages) {
                const response = await fetchData("https://pocketapi.48.cn/idolanswer/api/idolanswer/v1/user/nft/user_nft_list", {
                    starId: parseInt(userId), // 转换为整数
                    size: 20,
                    page: page
                });

                if (response.status === 200) {
                    if (page === 0) {
                        if (!response.content || !response.content.page) {
                            break;
                        }
                        totalPages = response.content.page;
                    }

                    combinedUserNftList = combinedUserNftList.concat(response.content.userNftListInfo);

                    page++;
                } else {
                    alert(`获取第 ${page} 页失败: ${response.message}`);
                    break;
                }
            }

            while (albumContainer.firstChild) {
                albumContainer.removeChild(albumContainer.firstChild);
            }

            if (combinedUserNftList.length === 0) {
                albumContainer.textContent = "无个人相册";
                return;
            }

            combinedUserNftList.forEach(item => {
                const albumDiv = document.createElement("div");
                albumDiv.classList.add("album-element");

                const timeStatusDiv = document.createElement("div");
                timeStatusDiv.classList.add("album-time-status");
                const time = document.createElement("p");
                time.textContent = formatTimestamp(parseInt(item.createTime));
                timeStatusDiv.appendChild(time);

                const albumContentDiv = document.createElement("div");
                albumContentDiv.classList.add("album-content");
                if (item.sourceType === 1) { // 图片
                    const image = document.createElement("img");
                    image.src = item.url;
                    albumContentDiv.appendChild(image);
                } else if (item.sourceType === 2) { // 视频
                    const videoPlayer = document.createElement("video");
                    videoPlayer.controls = true;
                    videoPlayer.src = item.url;

                    const getThumbnailButton = document.createElement("button");
                    getThumbnailButton.textContent = "获取缩略图";
                    getThumbnailButton.addEventListener("click", () => {
                        window.open(item.videoInfo.previewImg, "_blank");
                    });

                    albumContentDiv.appendChild(videoPlayer);
                    albumContentDiv.appendChild(getThumbnailButton);
                } else if (item.sourceType === 3) { // 语音
                    const audioPlayer = document.createElement("audio");
                    audioPlayer.controls = true;
                    audioPlayer.src = item.url;
                    albumContentDiv.appendChild(audioPlayer);
                }

                albumDiv.appendChild(timeStatusDiv);
                albumDiv.appendChild(albumContentDiv);
                albumContainer.appendChild(albumDiv);
            });
        }
    });

    /*  Fetch Data  */
    request.addEventListener("click", async () => {
        if (currentToken === "") {
            alert("未登录");
            return;
        }

        const url = document.getElementById("urlInput").value;
        if (!url) {
            alert("请输入请求地址")
            return;
        }

        let body = document.getElementById("requestBodyInput").value;
        if (!body) {
            body = "{}";
        }

        const response = await fetchData(url, JSON.parse(body));
        responseBodyInput.value = JSON.stringify(response);
    });

    copyBodyButton.addEventListener("click", async () => {
        responseBodyInput.select();
        document.execCommand("copy");
        alert("已复制到剪贴板！");
    });
});