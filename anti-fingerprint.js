// Для http-request: изменение заголовков
if ($request) {
    let headers = $request.headers;
    let url = $request.url;

    const desktopUA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

    if (url.includes("youtube.com") || url.includes("netflix.com")) {
        headers["User-Agent"] = desktopUA;
    } else {
        headers["User-Agent"] = desktopUA;
    }

    headers["Accept-Language"] = "en-US,en;q=0.9";
    headers["Accept-Encoding"] = "gzip, deflate, br";

    delete headers["X-Forwarded-For"];
    delete headers["X-Real-IP"];

    $done({ headers });
}

// Для http-response: подмена JavaScript-данных
if ($response) {
    let body = $response.body;
    if (body) {
        body = body.replace(/navigator\.platform\s*=\s*['"]iPhone['"]/g, 'navigator.platform = "Win32"');
        body = body.replace(/navigator\.userAgentData\.platform\s*=\s*['"]iOS['"]/g, 'navigator.userAgentData.platform = "Windows"');
    }
    $done({ body });
}
