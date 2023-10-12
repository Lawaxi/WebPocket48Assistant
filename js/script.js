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
	const chartContainer = document.getElementById("chartContainer");
	
	//翻牌
	const opponentIdInput = document.getElementById("opponentId");
    const answerTypeSelect = document.getElementById("answerType");
    const typeSelect = document.getElementById("type");
    const priceInput = document.getElementById("price");
    const contentTextarea = document.getElementById("content");
    const askQuestionButton = document.getElementById("askQuestion");
    let cardPrices = {};

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

/*  直播送礼  */
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

/*  翻牌列表  */
    var allAnswer = "";
    
	getAnswerButton.addEventListener("click", async () => {
	});
    
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
				alert(`下载失败: ${response.message}`);
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
			alert("无翻牌");
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

/*  翻牌  */
	document.getElementById("getCardPrice").addEventListener("click", async () => {
		if (currentToken === "") {
			alert("未登录");
			return;
		}
		
        const opponentId = opponentIdInput.value;
        const requestBody = { "memberId": opponentId };

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
});