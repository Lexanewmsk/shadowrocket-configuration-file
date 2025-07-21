// Скрипт для модификации HTTP заголовков в Shadowrocket
// Тип события: Request

let headers = $request.headers;
let url = $request.url;
let hostname = $request.url.match(/https?://([^/]+)/)[1];

// Универсальный User-Agent для мобильных устройств
const mobileUA = “Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1”;

// Desktop User-Agent
const desktopUA = “Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36”;

// Конфигурация для разных сайтов
const siteConfigs = {
// Социальные сети
“instagram.com”: {
“User-Agent”: mobileUA,
“Accept-Language”: “en-US,en;q=0.9”,
“X-Requested-With”: “XMLHttpRequest”
},

```
"twitter.com": {
    "User-Agent": desktopUA,
    "Accept-Language": "en-US,en;q=0.9"
},

"x.com": {
    "User-Agent": desktopUA,
    "Accept-Language": "en-US,en;q=0.9"
},

// Видео платформы
"youtube.com": {
    "User-Agent": desktopUA,
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br"
},

"netflix.com": {
    "User-Agent": desktopUA,
    "Accept-Language": "en-US,en;q=0.9"
},

// Стриминговые сервисы
"spotify.com": {
    "User-Agent": desktopUA,
    "Accept-Language": "en-US,en;q=0.9"
},

// Новостные сайты
"bbc.com": {
    "User-Agent": desktopUA,
    "Accept-Language": "en-GB,en;q=0.9"
},

"cnn.com": {
    "User-Agent": desktopUA,
    "Accept-Language": "en-US,en;q=0.9"
}
```

};

// Применяем конфигурацию для конкретного сайта
for (let domain in siteConfigs) {
if (hostname.includes(domain)) {
let config = siteConfigs[domain];
for (let header in config) {
headers[header] = config[header];
}
console.log(`Applied headers for ${domain}`);
break;
}
}

// Общие заголовки для всех запросов
headers[“Accept”] = “text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8”;
headers[“Cache-Control”] = “no-cache”;
headers[“Pragma”] = “no-cache”;

// Удаляем заголовки, которые могут выдать VPN/прокси
delete headers[“X-Forwarded-For”];
delete headers[“X-Real-IP”];
delete headers[“Via”];
delete headers[“X-Forwarded-Proto”];

// Добавляем заголовки для обхода некоторых блокировок
if (url.includes(“cloudflare”)) {
headers[“CF-Connecting-IP”] = “1.1.1.1”;
}

// Логирование для отладки (закомментируйте в продакшене)
// console.log(`Modified headers for: ${hostname}`);
// console.log(`User-Agent: ${headers["User-Agent"]}`);

$done({headers: headers});
