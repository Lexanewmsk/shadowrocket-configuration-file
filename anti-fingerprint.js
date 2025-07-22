let headers = $request.headers;
let url = $request.url;

const desktopUA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

headers["User-Agent"] = desktopUA; // Устанавливаем для всех запросов
headers["Accept-Language"] = "en-US,en;q=0.9";
headers["Accept-Encoding"] = "gzip, deflate, br";

delete headers["X-Forwarded-For"];
delete headers["X-Real-IP"];

console.log(`Modified headers for URL: ${url}, User-Agent: ${headers["User-Agent"]}`);

$done({headers});
