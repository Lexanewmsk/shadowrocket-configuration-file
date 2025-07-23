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

// НЕ модифицируем запросы к мессенджерам и социальным сетям
if (url.includes('whatsapp.net') || 
    url.includes('whatsapp.com') ||
    url.includes('web.whatsapp.com') ||
    url.includes('telegram.org') ||
    url.includes('t.me') ||
    url.includes('vk.com') ||
    url.includes('ok.ru')) {
    $done({});
}

// НЕ модифицируем только навигационные сервисы Яндекса
if (url.includes('n.maps.yandex.ru') || 
    url.includes('api-maps.yandex.ru') ||
    url.includes('core-renderer-tiles.maps.yandex.net') ||
    url.includes('yandex.ru/maps/api')) {
    $done({});
}

// Проверка исходного User-Agent для определения платформы
let originalUA = headers["User-Agent"] || "";
let isMobile = originalUA.includes("iPhone") || originalUA.includes("iPad") || originalUA.includes("iPod");

// Один стабильный User-Agent для каждой платформы
const desktopUA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const mobileUA = "Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";

// Устанавливаем соответствующий User-Agent
const targetUA = isMobile ? mobileUA : desktopUA;
headers["User-Agent"] = targetUA;

// Настройка заголовков для Chrome
if (isMobile) {
    // Мобильные заголовки (Android)
    headers["Sec-Ch-Ua"] = '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"';
    headers["Sec-Ch-Ua-Mobile"] = "?1";
    headers["Sec-Ch-Ua-Platform"] = '"Android"';
    headers["Sec-Ch-Ua-Platform-Version"] = '"13.0.0"';
    headers["Accept"] = "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8";
    headers["Accept-Language"] = "en-US,en;q=0.9";
    headers["Accept-Encoding"] = "gzip, deflate, br";
} else {
    // Десктопные заголовки (Windows)
    headers["Sec-Ch-Ua"] = '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"';
    headers["Sec-Ch-Ua-Mobile"] = "?0";
    headers["Sec-Ch-Ua-Platform"] = '"Windows"';
    headers["Sec-Ch-Ua-Platform-Version"] = '"15.0.0"';
    headers["Accept"] = "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8";
    headers["Accept-Language"] = "en-US,en;q=0.9";
    headers["Accept-Encoding"] = "gzip, deflate, br";
}

// Общие заголовки для Chrome
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

// Удаляем iOS-специфичные заголовки для мобильных
if (isMobile) {
    delete headers["X-Requested-With"];
}

$done({headers: headers});
