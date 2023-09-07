// script.js
document.addEventListener("DOMContentLoaded", () => {
	const loginForm = document.getElementById("loginForm");
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

	const liveSelect = document.getElementById("liveSelect");
	const refreshLiveButton = document.getElementById("refreshLiveButton");
	const transferButtons = document.querySelectorAll(".transfer-button");

	var currentToken = ""; //此变量只由updateSelectedAccount更改
	var privateMode = isPrivateMode(); //iOS Safari无痕模式禁用localStorge

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
				body: JSON.stringify({
					mobile,
					pwd
				})
			})
			.then(response => response.json())
			.then(response => {

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
				} else {
					alert(`登录失败${response.status}: ${response.message}`);
				}

				document.getElementById("mobile")
					.value = "";
				document.getElementById("pwd")
					.value = "";
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
					"token": token
				},
				body: "{}"
			})
			.then(response => response.json())
			.then(response => {


				if (response.status === 200) {
					const {
						content
					} = response;

					// Store account info in LocalStorage
					const accountInfo = {
						token: token,
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
			const updatedAccountInfos = accountInfos.filter(info => info.id !== selectedAccountId);
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


	let selectedUserId = null; // 存储选中的 userId
	let selectedCrm = null; // 存储选中的 crm

	// 刷新按钮点击事件
	refreshLiveButton.addEventListener("click", async () => {
		// 发送获取直播列表的请求
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

	// 选择框选择事件
	liveSelect.addEventListener("change", async () => {
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
});