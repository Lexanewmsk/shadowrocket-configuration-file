let headers = $request.headers;
let url = $request.url;

// Массив User-Agent для ротации
const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0"
];

// Случайный выбор User-Agent
const randomUA = userAgents[Math.floor(Math.random() * userAgents.length)];
headers["User-Agent"] = randomUA;

// Дополнительные заголовки для Chrome
if (randomUA.includes("Chrome")) {
    headers["Sec-Ch-Ua"] = '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"';
    headers["Sec-Ch-Ua-Mobile"] = "?0";
    
    if (randomUA.includes("Windows")) {
        headers["Sec-Ch-Ua-Platform"] = '"Windows"';
    } else if (randomUA.includes("Macintosh")) {
        headers["Sec-Ch-Ua-Platform"] = '"macOS"';
    } else if (randomUA.includes("Linux")) {
        headers["Sec-Ch-Ua-Platform"] = '"Linux"';
    }
    
    headers["Upgrade-Insecure-Requests"] = "1";
    headers["Accept"] = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"; // Более конкретный Accept для Chrome
    headers["Accept-Language"] = "en-US,en;q=0.9"; // Стандартный язык
}

// Дополнительные заголовки для Firefox
if (randomUA.includes("Firefox")) {
    headers["Accept"] = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"; // Типичный Accept для Firefox
    headers["Accept-Language"] = "en-US,en;q=0.5";
    headers["DNT"] = "1"; // Do Not Track
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
            body = body.replace(/navigator\.platform\s*=\s*['"]iPhone['"]/g, 'navigator.platform = "Win32"');
            body = body.replace(/navigator\.platform\s*=\s*['"]iPad['"]/g, 'navigator.platform = "Win32"');
            body = body.replace(/navigator\.platform\s*=\s*['"]MacIntel['"]/g, 'navigator.platform = (randomUA.includes("Windows") ? "Win32" : "MacIntel")');
            body = body.replace(/navigator\.userAgentData\.platform\s*=\s*['"]iOS['"]/g, 'navigator.userAgentData.platform = (randomUA.includes("Windows") ? "Windows" : "macOS")');
            body = body.replace(/screen\.width\s*=\s*\d+/g, 'screen.width = 1920');
            body = body.replace(/screen\.height\s*=\s*\d+/g, 'screen.height = 1080');
        } else if (randomUA.includes("Firefox")) {
            body = body.replace(/navigator\.platform\s*=\s*['"]iPhone['"]/g, 'navigator.platform = "Win32"');
            body = body.replace(/navigator\.platform\s*=\s*['"]iPad['"]/g, 'navigator.platform = "Win32"');
            body = body.replace(/navigator\.platform\s*=\s*['"]MacIntel['"]/g, 'navigator.platform = (randomUA.includes("Windows") ? "Win32" : "MacIntel")');
            body = body.replace(/navigator\.userAgentData\.platform\s*=\s*['"]iOS['"]/g, 'navigator.userAgentData.platform = (randomUA.includes("Windows") ? "Windows" : "macOS")');
            body = body.replace(/screen\.width\s*=\s*\d+/g, 'screen.width = 1280');
            body = body.replace(/screen\.height\s*=\s*\d+/g, 'screen.height = 800');
        }
    }
    $done({body: body});
}
