let headers = $request.headers;
let url = $request.url;

// Проверка исходного User-Agent для определения платформы
let originalUA = headers["User-Agent"] || "";
let isMobile = originalUA.includes("iPhone") || originalUA.includes("iPad") || originalUA.includes("iPod");

// Массив User-Agent для Mac/iPhone
const desktopAgents = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
];

const mobileAgents = [
    "Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
];

// Случайный выбор User-Agent (один на платформу для стабильности)
const randomUA = isMobile ? mobileAgents[0] : desktopAgents[0];
headers["User-Agent"] = randomUA;

// Минимальные заголовки для Chrome
if (randomUA.includes("Chrome")) {
    headers["Sec-Ch-Ua"] = '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"';
    headers["Sec-Ch-Ua-Mobile"] = isMobile ? "?1" : "?0";
    headers["Sec-Ch-Ua-Platform"] = isMobile ? '"Android"' : '"macOS"';
    headers["Accept"] = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8";
    if (isMobile) {
        headers["Sec-Ch-Width"] = "360";
        headers["Sec-Ch-Viewport-Width"] = "360";
    }
}

// Удаляем заголовки, выдающие proxy/VPN
delete headers["X-Forwarded-For"];
delete headers["X-Real-IP"];
delete headers["Via"];
delete headers["X-Forwarded-Proto"];
delete headers["X-Forwarded-Host"];
delete headers["CF-Connecting-IP"];
delete headers["True-Client-IP"];

$done({headers: headers});

// Для http-response: минимальная подмена
if ($response) {
    let body = $response.body;
    if (body) {
        if (randomUA.includes("Chrome")) {
            body = body.replace(/navigator\.platform\s*=\s*['"]iPhone['"]/g, 'navigator.platform = (isMobile ? "Linux armv8l" : "MacIntel")');
            body = body.replace(/navigator\.platform\s*=\s*['"]iPad['"]/g, 'navigator.platform = (isMobile ? "Linux armv8l" : "MacIntel")');
            body = body.replace(/navigator\.platform\s*=\s*['"]MacIntel['"]/g, 'navigator.platform = (isMobile ? "Linux armv8l" : "MacIntel")');
            body = body.replace(/navigator\.userAgentData\.platform\s*=\s*['"]iOS['"]/g, 'navigator.userAgentData.platform = (isMobile ? "Android" : "macOS")');
        }
    }
    $done({body: body});
}
