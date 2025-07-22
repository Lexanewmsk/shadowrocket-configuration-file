let headers = $request.headers;
let url = $request.url;

// Оригинальный User-Agent
let originalUA = headers["User-Agent"] || "";
let isMobile = originalUA.includes("iPhone") || originalUA.includes("iPad") || originalUA.includes("iPod");

// User-Agent для Mac (Chrome)
const desktopAgents = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
];

// User-Agent для подмены под iPhone 12 Pro (iOS 14.6)
const mobileAgents = [
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1"
];

// Выбор нужного User-Agent
const randomUA = isMobile ? mobileAgents[0] : desktopAgents[0];
headers["User-Agent"] = randomUA;

// Устанавливаем заголовки для Chrome и Safari
if (randomUA.includes("Chrome")) {
    headers["Sec-Ch-Ua"] = '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"';
    headers["Sec-Ch-Ua-Mobile"] = isMobile ? "?1" : "?0";
    headers["Sec-Ch-Ua-Platform"] = isMobile ? '"Android"' : '"macOS"';
    headers["Accept"] = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8";

    if (isMobile) {
        headers["Sec-Ch-Width"] = "390"; // iPhone 12 Pro viewport
        headers["Sec-Ch-Viewport-Width"] = "390";
    }
}

// Удаляем заголовки, которые могут выдать реальный IP/прокси
delete headers["X-Forwarded-For"];
delete headers["X-Real-IP"];
delete headers["Via"];
delete headers["X-Forwarded-Proto"];
delete headers["X-Forwarded-Host"];
delete headers["CF-Connecting-IP"];
delete headers["True-Client-IP"];

$done({headers: headers});

// Минимальная подмена JS-объектов в body ответа
if ($response) {
    let body = $response.body;
    if (body && typeof body === "string") {
        if (randomUA.includes("Chrome") || randomUA.includes("Safari")) {
            // Подмена platform
            body = body.replace(/navigator\.platform\s*=\s*['"][^'"]+['"]/g, `navigator.platform = "${isMobile ? "iPhone" : "MacIntel"}"`);

            // Подмена userAgentData.platform
            body = body.replace(/navigator\.userAgentData\.platform\s*=\s*['"][^'"]+['"]/g, `navigator.userAgentData.platform = "${isMobile ? "iOS" : "macOS"}"`);
        }
    }
    $done({body});
}
