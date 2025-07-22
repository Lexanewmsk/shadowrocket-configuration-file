let headers = $request ? $request.headers : {};
let url = $request ? $request.url : "no-url";

if (!headers || !url) {
    console.log("Error: $request or headers not available");
    $done({});
}

const desktopUA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

headers["User-Agent"] = desktopUA;
headers["Accept-Language"] = "en-US,en;q=0.9";
headers["Accept-Encoding"] = "gzip, deflate, br";

delete headers["X-Forwarded-For"];
delete headers["X-Real-IP"];

console.log(`Processed URL: ${url}, New User-Agent: ${headers["User-Agent"]}, Accept-Language: ${headers["Accept-Language"]}`);

$done({headers});
