<?php
$path = isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : '/';
$targetUrl = "https://pocketapi.48.cn" . $path;

$requestMethod = $_SERVER['REQUEST_METHOD'];
$requestHeaders = [];
$requestBody = file_get_contents('php://input');

$requestHeaders['Host'] = 'pocketapi.48.cn';
$requestHeaders['Content-Type'] = 'application/json;charset=utf-8';
$requestHeaders['Accept'] = '*/*';
$requestHeaders['Accept-Encoding'] = 'gzip, deflate, br';
$requestHeaders['Connection'] = 'keep-alive';
$requestHeaders['pa'] = 'MTcwODkyNDc2MjAwMCw4MTM1LDMwNTk2QTA3NTZBOTNBRjY2MDAxNzkxRDkzREFGOTU1LA==';
$requestHeaders['User-Agent'] = 'PocketFans201807/7.1.10 (iPhone; iOS 16.2; Scale/3.00)';
$requestHeaders['Accept-Language'] = 'zh-Hans-CN;q=1, zh-Hant-TW;q=0.9, ja-CN;q=0.8';
$requestHeaders['Content-Length'] = strlen($requestBody);
$requestHeaders['appInfo'] = '{"vendor":"huaweiphone","deviceId":"F2BA149C-06DB-9843-31DE-36BF375E36F2","appVersion":"7.1.10","appBuild":"24020203","osVersion":"16.2.0","osType":"ios","deviceName":"My HuaweiPhone","os":"ios"}';
if (isset($_SERVER['HTTP_TOKEN'])) {
    $requestHeaders['token'] = $_SERVER['HTTP_TOKEN'];
}

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $targetUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $requestMethod);
curl_setopt($ch, CURLOPT_HTTPHEADER, array_map(function($key, $value) {
    return "$key: $value";
}, array_keys($requestHeaders), $requestHeaders));
if ($requestMethod !== 'GET') {
    curl_setopt($ch, CURLOPT_POSTFIELDS, $requestBody);
}
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$httpStatusMessage = [
    200 => 'OK',
];
if (isset($httpStatusMessage[$httpCode])) {
    header("HTTP/1.1 $httpCode " . $httpStatusMessage[$httpCode]);
}

echo $response;
?>
