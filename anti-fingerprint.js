let headers = $request.headers;
let url = $request.url;

// Проверка исходного User-Agent для определения платформы
let originalUA = headers["User-Agent"] || "";
let isMobile = originalUA.includes("iPhone") || originalUA.includes("iPad") || originalUA.includes("iPod");

// Массив User-Agent для Mac/iPhone
const desktopAgents = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0"
];

const mobileAgents = [
    "Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36" // Один Android для упрощения
];

// Случайный выбор User-Agent
const randomUA = isMobile ? mobileAgents[Math.floor(Math.random() * mobileAgents.length)] : desktopAgents[Math.floor(Math.random() * desktopAgents.length)];
headers["User-Agent"] = randomUA;

// Дополнительные заголовки для Chrome
if (randomUA.includes("Chrome")) {
    headers["Sec-Ch-Ua"] = '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"';
    headers["Sec-Ch-Ua-Mobile"] = isMobile ? "?1" : "?0";
    
    if (randomUA.includes("Windows")) {
        headers["Sec-Ch-Ua-Platform"] = '"Windows"';
    } else if (randomUA.includes("Macintosh")) {
        headers["Sec-Ch-Ua-Platform"] = '"macOS"';
    } else if (randomUA.includes("Linux")) {
        headers["Sec-Ch-Ua-Platform"] = isMobile ? '"Android"' : '"Linux"';
    }
    
    headers["Upgrade-Insecure-Requests"] = "1";
    headers["Accept"] = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7";
    headers["Accept-Language"] = "en-US,en;q=0.9";
}

// Дополнительные заголовки для Firefox
if (randomUA.includes("Firefox")) {
    headers["Accept"] = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8";
    headers["Accept-Language"] = "en-US,en;q=0.5";
    headers["DNT"] = "1";
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

// Для http-response: подмена JavaScript-данных
if ($response) {
    let body = $response.body;
    if (body) {
        if (randomUA.includes("Chrome")) {
            body = body.replace(/navigator\.platform\s*=\s*['"]iPhone['"]/g, 'navigator.platform = (isMobile ? "Linux armv8l" : "MacIntel")');
            body = body.replace(/navigator\.platform\s*=\s*['"]iPad['"]/g, 'navigator.platform = (isMobile ? "Linux armv8l" : "MacIntel")');
            body = body.replace(/navigator\.platform\s*=\s*['"]MacIntel['"]/g, 'navigator.platform = (isMobile ? "Linux armv8l" : "MacIntel")');
            body = body.replace(/navigator\.userAgentData\.platform\s*=\s*['"]iOS['"]/g, 'navigator.userAgentData.platform = (isMobile ? "Android" : "macOS")');
            body = body.replace(/screen\.width\s*=\s*\d+/g, 'screen.width = (isMobile ? 360 : 1920)');
            body = body.replace(/screen\.height\s*=\s*\d+/g, 'screen.height = (isMobile ? 800 : 1080)');
        } else if (randomUA.includes("Firefox")) {
            body = body.replace(/navigator\.platform\s*=\s*['"]iPhone['"]/g, 'navigator.platform = (isMobile ? "Linux armv8l" : "MacIntel")');
            body = body.replace(/navigator\.platform\s*=\s*['"]iPad['"]/g, 'navigator.platform = (isMobile ? "Linux armv8l" : "MacIntel")');
            body = body.replace(/navigator\.platform\s*=\s*['"]MacIntel['"]/g, 'navigator.platform = (isMobile ? "Linux armv8l" : "MacIntel")');
            body = body.replace(/navigator\.userAgentData\.platform\s*=\s*['"]iOS['"]/g, 'navigator.userAgentData.platform = (isMobile ? "Android" : "macOS")');
            body = body.replace(/screen\.width\s*=\s*\d+/g, 'screen.width = (isMobile ? 360 : 1280)');
            body = body.replace(/screen\.height\s*=\s*\d+/g, 'screen.height = (isMobile ? 800 : 800)');
        }
    }
    $done({body: body});
}
