let headers = $request.headers;
let url = $request.url;

// НЕ модифицируем запросы к Cloudflare сервисам
if (url.includes('challenges.cloudflare.com') || 
    url.includes('cdnjs.cloudflare.com') || 
    url.includes('cloudflareinsights.com') ||
    url.includes('cf-assets.com')) {
    $done({});
}

// НЕ модифицируем запросы к банкам и платежным системам
if (url.includes('sberbank.ru') || 
    url.includes('alfabank.ru') || 
    url.includes('tinkoff.ru') ||
    url.includes('vtb.ru') ||
    url.includes('paypal.com') ||
    url.includes('qiwi.com') ||
    url.includes('yoomoney.ru') ||
    url.includes('webmoney.ru')) {
    $done({});
}

// Проверка исходного User-Agent для определения платформы
let originalUA = headers["User-Agent"] || "";
let isMobile = originalUA.includes("iPhone") || originalUA.includes("iPad") || originalUA.includes("iPod");

// Реалистичные User-Agent строки
const desktopUA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Safari/605.1.15";
const mobileUA = "Mozilla/5.0 (iPhone; CPU iPhone OS 14_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Mobile/15E148 Safari/604.1";

// Устанавливаем соответствующий User-Agent
const targetUA = isMobile ? mobileUA : desktopUA;
headers["User-Agent"] = targetUA;

// Настройка заголовков
if (isMobile) {
    // iPhone Safari заголовки (БЕЗ Chrome Sec-Ch-Ua)
    headers["Accept"] = "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8";
    headers["Accept-Language"] = "en-US,en;q=0.5";
    headers["Accept-Encoding"] = "gzip, deflate";
} else {
    // Mac Safari заголовки (БЕЗ Chrome заголовков)
    headers["Accept"] = "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8";
    headers["Accept-Language"] = "en-US,en;q=0.5";
    headers["Accept-Encoding"] = "gzip, deflate";
}

// Общие заголовки
headers["Upgrade-Insecure-Requests"] = "1";
headers["Sec-Fetch-Site"] = "none";
headers["Sec-Fetch-Mode"] = "navigate";
headers["Sec-Fetch-User"] = "?1";
headers["Sec-Fetch-Dest"] = "document";

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

$done({headers: headers});
