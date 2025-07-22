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
    
    // Определяем платформу из UA
    if (randomUA.includes("Windows")) {
        headers["Sec-Ch-Ua-Platform"] = '"Windows"';
    } else if (randomUA.includes("Macintosh")) {
        headers["Sec-Ch-Ua-Platform"] = '"macOS"';
    } else if (randomUA.includes("Linux")) {
        headers["Sec-Ch-Ua-Platform"] = '"Linux"';
    }
    
    headers["Sec-Fetch-Dest"] = "document";
    headers["Sec-Fetch-Mode"] = "navigate";
    headers["Sec-Fetch-Site"] = "none";
    headers["Sec-Fetch-User"] = "?1";
    headers["Upgrade-Insecure-Requests"] = "1";
}

// Стандартные заголовки
headers["Accept-Language"] = "en-US,en;q=0.9";
headers["Accept-Encoding"] = "gzip, deflate, br";
headers["Accept"] = "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7";

// Удаляем заголовки, выдающие proxy/VPN
delete headers["X-Forwarded-For"];
delete headers["X-Real-IP"];
delete headers["Via"];
delete headers["X-Forwarded-Proto"];
delete headers["X-Forwarded-Host"];
delete headers["CF-Connecting-IP"];
delete headers["True-Client-IP"];

$done({headers: headers});
