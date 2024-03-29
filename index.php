<!DOCTYPE html>
<html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="icon" href="favicon.ico" type="image/x-icon">
        <title>口袋48助手</title>
        <link rel="stylesheet" href="style.css">
    </head>

    <body>
        <div class="container">
            <p>已登录账号：</p>
            <p id="privateModeMessage" class="sign-text">无痕模式下无法保存登录信息，关闭浏览器会清空，可以复制登录 Token 到其他地方</p>
            <select id="accountSelect">
            </select>
            <button id="deleteAccountButton">删除当前项</button>
            <div>
                <p>已选择账号:
                    <span id="selectedNickname">
                    </span>(ID:
                    <span id="selectedId">
                    </span>)</p>
                <p>余额:
                    <span id="selectedBalance">
                    </span>
                </p>
                <input type="text" id="nicknameInput" placeholder="输入新昵称">
                <button id="modifyNicknameButton">修改昵称</button>
            </div>
            <div>
                <button id="refreshBalanceButton">刷新余额</button>
                <button id="copyIdButton">复制 ID</button>
                <button id="copyTokenButton">复制 Token</button>
                <button id="logoutButton">退出登录</button>
            </div>

            <ul class="tabs" data-tab>
                <li class="tab-title active">
                    <a href="#">登录</a>
                </li>
                <li class="tab-title">
                    <a href="#">工具</a>
                </li>
                <li class="tab-title">
                    <a href="#">翻牌</a>
                </li>
                <li class="tab-title">
                    <a href="#">Fetch Data</a>
                </li>
            </ul>

            <!-- 登录 -->
            <section id="login" class="tab-content active">
                <div class="column-container">
                    <h2>登录</h2>
                    <form id="loginForm">
                        <label for="mobile">账号：</label>
                        <input type="text" id="mobile" placeholder="请输入账号" required>
                        <label for="pwd">密码：</label>
                        <input type="password" id="pwd" placeholder="请输入密码" required>
                        <button type="submit">登录</button>
                    </form>
                    <h2>或 短信登录</h2>
                    <form id="smsLoginForm">
                        <label for="mobileInput">手机号：</label>
                        <div class="input-row">
                            <input id="areaCodeInput" class="area-code-input" type="text" placeholder="区号" value="86" required>
                            <input id="mobileInput" class="mobile-input" type="text" placeholder="手机号" required>
                        </div>
                        <button type="submit">发送验证码</button>
                    </form>
                    <h2>或 使用 Token 登录</h2>
                    <form id="tokenLoginForm">
                        <label for="tokenInput">Token：</label>
                        <input type="text" id="tokenInput" placeholder="请输入 Token" required>
                        <button type="submit" id="tokenLoginButton">用 Token 登录</button>
                    </form>
                </div>
            </section>

            <!-- 直播送礼 -->
            <section id="gift" class="tab-content">
                <div class="column-container">
                    <h2>直播送礼</h2>
                    <div class="select-row">
                        <select id="liveSelect" class="live-select">
                            <option value="">请点击按钮刷新直播列表</option>
                        </select>
                        <button id="refreshLiveButton">刷新直播列表</button>
                    </div>
                    <p>点击礼物按钮直接送礼：</p>
                    <div>
                        <button class="transfer-button" data-gift-id="5">5</button>
                        <button class="transfer-button" data-gift-id="10">10</button>
                        <button class="transfer-button" data-gift-id="20">20</button>
                        <button class="transfer-button" data-gift-id="48">48</button>
                        <button class="transfer-button" data-gift-id="148">148</button>
                        <button class="transfer-button" data-gift-id="1048">1048</button>
                        <button class="transfer-button" data-gift-id="1500">1500</button>
                        <button class="transfer-button" data-gift-id="2880">2880</button>
                        <button class="transfer-button" data-gift-id="3000">3000</button>
                        <button class="transfer-button" data-gift-id="5000">5000</button>
                        <button class="transfer-button" data-gift-id="5228">5228</button>
                        <button class="transfer-button" data-gift-id="9999">9999</button>
                        <button class="transfer-button" data-gift-id="19999">19999</button>
                    </div>
                </div>
                <h2>房间资源下载</h2>
                <div>
                    <input type="text" id="searchInput" placeholder="输入小偶像">
                    <button id="searchButton">搜索</button>
                </div>
                <div>
                    <select id="serverSelect">
                        <option disabled selected>选择搜索结果</option>
                    </select>
                </div>
                <div>
                    <label for="userIdInput">ID：</label>
                    <input type="text" id="userIdInput">
                </div>
                <div>
                    <label for="serverIdInput">Server ID：</label>
                    <input type="text" id="serverIdInput">
                </div>

                <button id="getAlbumButton">获取个人相册</button>
                <div id="albumContainer"></div>
            </section>

            <!-- 翻牌 -->
            <section id="answer" class="tab-content">
                <div class="column-container">
                    <h2>翻牌</h2>
                    <div>
                        <button id="syncUserId">从<i>工具</i>同步小偶像 ID</button>
                    </div>
                    <div>
                        <label for="opponentId">对方 ID：</label>
                        <input type="text" id="opponentId">
                        <button id="getCardPrice">获取翻牌价格</button>
                    </div>
                    <div>
                        <select id="answerType">
                            <option value="1">文字</option>
                            <option value="2">语音</option>
                            <option value="3">视频</option>
                        </select>
                        <select id="type">
                            <option value="1">公开</option>
                            <option value="3">匿名</option>
                            <option value="2">私密</option>
                        </select>
                        <label for="opponentId">价格：</label>
                        <input type="text" id="price">
                    </div>
                    <textarea id="content" rows="4" cols="50"></textarea>
                    <button id="askQuestion">提问</button>
                </div>
                <h2>翻牌列表</h2>
                <div>
                    <button id="getAnswerButton">获取</button>
                    <button id="arrangeAnswerButton">整理全部</button>
                    <button id="downloadAnswerButton" disabled title="请先使用整理全部翻牌功能">以 json 下载</button>
                </div>
                <div id="answerListContainer"></div>
                <input type="file" id="fileInput" style="display: none" accept=".json">
                <div>
                    <button id="upPage" class="page-button" disabled>上一页</button>
                    <button id="downPage" class="page-button" disabled>下一页</button>
                    <button id="uploadAnswerList" class="page-button">读取本地翻牌列表</button>
                </div>
                <p id="loadingMessage" class="sign-text">正在获取，请稍候...</p>
                <div id="chartContainer">
                </div>
            </section>

            <!-- Fetch Data -->
            <section id="fetchData" class="tab-content">
                <div class="column-container">
                    <h2>Fetch Data</h2>
                    <input type="text" id="urlInput" placeholder="输入 Request URL" required>
                    <input type="text" id="requestBodyInput" placeholder="输入 Request Body" required>
                    <button id="request">Fetch Data</button>
                    <textarea id="responseBodyInput" rows="4" cols="50"></textarea>
                    <div>
                        <button id="copyBodyButton">复制 Response Body</button>
                    </div>
                </div>
            </section>

            <div class="disclaimer">
                <p>开源： <a href="https://github.com/Lawaxi/WebPocket48Assistant" target="_blank">
                        Lawaxi/WebPocket48Assistant on GitHub
                    </a> 上开源</p>
            </div>
        </div>
        <script src="js/tab.js"></script>
        <script src="js/script.js"></script>
    </body>

</html>
