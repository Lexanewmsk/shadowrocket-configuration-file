let headers = $request.headers;
let url = $request.url;

// Проверка исходного User-Agent для определения платформы
let originalUA = headers["User-Agent"] || "";
let isMobile = originalUA.includes("iPhone") || originalUA.includes("iPad") || originalUA.includes("iPod");

// Массив User-Agent
const desktopAgents = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0"
];

const mobileAgents = [
    "Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 12; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
];

// Случайный выбор User-Agent
const randomUA = isMobile ? mobileAgents[Math.floor(Math.random() * mobileAgents.length)] : desktopAgents[Math.floor(Math.random() * desktopAgents.length)];
headers["User-Agent"] = randomUA;

// Настройка заголовков в зависимости от браузера и платформы
if (randomUA.includes("Chrome")) {
    if (isMobile) {
        // Заголовки для мобильного Chrome (Android)
        headers["Sec-Ch-Ua"] = '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"';
        headers["Sec-Ch-Ua-Mobile"] = "?1";
        headers["Sec-Ch-Ua-Platform"] = '"Android"';
        headers["Sec-Ch-Ua-Platform-Version"] = '"13.0.0"';
        headers["Accept"] = "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7";
        headers["Accept-Language"] = "en-US,en;q=0.9";
        headers["Accept-Encoding"] = "gzip, deflate, br";
        headers["Upgrade-Insecure-Requests"] = "1";
        headers["Sec-Fetch-Site"] = "none";
        headers["Sec-Fetch-Mode"] = "navigate";
        headers["Sec-Fetch-User"] = "?1";
        headers["Sec-Fetch-Dest"] = "document";
    } else {
        // Заголовки для десктопного Chrome (macOS)
        headers["Sec-Ch-Ua"] = '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"';
        headers["Sec-Ch-Ua-Mobile"] = "?0";
        headers["Sec-Ch-Ua-Platform"] = '"macOS"';
        headers["Accept"] = "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7";
        headers["Accept-Language"] = "en-US,en;q=0.9";
        headers["Accept-Encoding"] = "gzip, deflate, br";
        headers["Upgrade-Insecure-Requests"] = "1";
        headers["Sec-Fetch-Site"] = "none";
        headers["Sec-Fetch-Mode"] = "navigate";
        headers["Sec-Fetch-User"] = "?1";
        headers["Sec-Fetch-Dest"] = "document";
    }
}

// Заголовки для Firefox
if (randomUA.includes("Firefox")) {
    headers["Accept"] = "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8";
    headers["Accept-Language"] = "en-US,en;q=0.5";
    headers["Accept-Encoding"] = "gzip, deflate, br";
    headers["DNT"] = "1";
    headers["Upgrade-Insecure-Requests"] = "1";
    headers["Sec-Fetch-Dest"] = "document";
    headers["Sec-Fetch-Mode"] = "navigate";
    headers["Sec-Fetch-Site"] = "none";
    headers["Sec-Fetch-User"] = "?1";
}

// Удаляем заголовки, выдающие proxy/VPN
delete headers["X-Forwarded-For"];
delete headers["X-Real-IP"];
delete headers["Via"];
delete headers["X-Forwarded-Proto"];
delete headers["X-Forwarded-Host"];
delete headers["CF-Connecting-IP"];
delete headers["True-Client-IP"];
delete headers["X-Forwarded-Port"];
delete headers["X-Original-Forwarded-For"];

// Удаляем iOS-специфичные заголовки, если подменяемся под Android
if (isMobile) {
    delete headers["X-Requested-With"];
}

$done({headers: headers});

// Для http-response: подмена JavaScript-данных
if ($response) {
    let body = $response.body;
    if (body) {
        if (isMobile) {
            // Подмена для мобильных устройств (Android)
            body = body.replace(/navigator\.platform/g, '"Linux armv8l"');
            body = body.replace(/navigator\.userAgentData\.platform/g, '"Android"');
            body = body.replace(/screen\.width\s*=\s*\d+/g, 'screen.width = 360');
            body = body.replace(/screen\.height\s*=\s*\d+/g, 'screen.height = 800');
            body = body.replace(/screen\.availWidth\s*=\s*\d+/g, 'screen.availWidth = 360');
            body = body.replace(/screen\.availHeight\s*=\s*\d+/g, 'screen.availHeight = 760');
            // Подмена iOS-специфичных свойств
            body = body.replace(/iPhone|iPad|iPod/g, 'Android');
            body = body.replace(/iOS/g, 'Android');
            body = body.replace(/Safari/g, 'Chrome');
        } else {
            // Подмена для десктопных устройств (macOS)
            body = body.replace(/navigator\.platform/g, '"MacIntel"');
            body = body.replace(/navigator\.userAgentData\.platform/g, '"macOS"');
            body = body.replace(/screen\.width\s*=\s*\d+/g, 'screen.width = 1920');
            body = body.replace(/screen\.height\s*=\s*\d+/g, 'screen.height = 1080');
            body = body.replace(/screen\.availWidth\s*=\s*\d+/g, 'screen.availWidth = 1920');
            body = body.replace(/screen\.availHeight\s*=\s*\d+/g, 'screen.availHeight = 1055');
        }
    }
    $done({body: body});
}
