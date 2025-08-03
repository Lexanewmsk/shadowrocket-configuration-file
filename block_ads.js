// Simple AdBlock Script for Loon
// Version: 1.0

const scriptName = “SimpleAdBlock”;
const timestamp = new Date().toISOString();

console.log(”[” + scriptName + “] Script started at: “ + timestamp);

// Check script type and object availability
if (typeof $request !== “undefined”) {
console.log(”[” + scriptName + “] Processing REQUEST: “ + $request.url);
console.log(”[” + scriptName + “] Method: “ + $request.method);
console.log(”[” + scriptName + “] Headers: “ + JSON.stringify($request.headers));

```
// Block ad URLs
const adPatterns = [
    /doubleclick\.net/i,
    /googleadservices\.com/i,
    /googlesyndication\.com/i,
    /googletagmanager\.com/i,
    /googletagservices\.com/i,
    /pagead2\.googlesyndication\.com/i,
    /tpc\.googlesyndication\.com/i,
    /ads\.yahoo\.com/i,
    /ads\d*\..*\.com/i
];

const url = $request.url;
const shouldBlock = adPatterns.some(pattern => pattern.test(url));

if (shouldBlock) {
    console.log("[" + scriptName + "] BLOCKED: " + url);
    $done({
        response: {
            status: 200,
            headers: {
                "Content-Type": "text/plain"
            },
            body: ""
        }
    });
} else {
    console.log("[" + scriptName + "] ALLOWED: " + url);
    $done({});
}
```

} else if (typeof $response !== “undefined”) {
console.log(”[” + scriptName + “] Processing RESPONSE: “ + $response.status);

```
// Modify response if needed
if ($response.body) {
    let body = $response.body;
    
    // Remove ad elements from HTML/JS
    const adSelectors = [
        /<script[^>]*googlesyndication[^>]*>.*?<\/script>/gi,
        /<ins[^>]*adsbygoogle[^>]*>.*?<\/ins>/gi,
        /<div[^>]*class="[^"]*ad[^"]*"[^>]*>.*?<\/div>/gi
    ];
    
    adSelectors.forEach(selector => {
        body = body.replace(selector, "");
    });
    
    if (body !== $response.body) {
        console.log("[" + scriptName + "] Modified response body");
        $done({
            response: {
                status: $response.status,
                headers: $response.headers,
                body: body
            }
        });
    } else {
        $done({});
    }
} else {
    $done({});
}
```

} else {
console.log(”[” + scriptName + “] ERROR: Neither $request nor $response is defined”);
console.log(”[” + scriptName + “] This indicates MITM or script configuration issues”);
$done({});
}
