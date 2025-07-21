// Anti-fingerprint script for Shadowrocket
// Requires: type=http-response

// Основная функция обработки HTTP-ответа
try {
if ($response.status === 200) {
let body = $response.body;

```
    // Проверяем, является ли ответ HTML-страницей
    const contentType = ($response.headers['Content-Type'] || $response.headers['content-type'] || '').toLowerCase();
    
    if (body && contentType.includes('text/html')) {
        
        const antiFingerprintScript = '<script>' +
            '(function() {' +
            '    try {' +
            '        Object.defineProperty(navigator, "userAgent", {' +
            '            get: function() {' +
            '                return "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";' +
            '            },' +
            '            configurable: true' +
            '        });' +
            '        Object.defineProperty(window, "screen", {' +
            '            get: function() {' +
            '                return {' +
            '                    width: 1920,' +
            '                    height: 1080,' +
            '                    availWidth: 1920,' +
            '                    availHeight: 1080,' +
            '                    colorDepth: 24,' +
            '                    pixelDepth: 24' +
            '                };' +
            '            },' +
            '            configurable: true' +
            '        });' +
            '        Object.defineProperty(navigator, "language", {' +
            '            get: function() {' +
            '                return "en-US";' +
            '            },' +
            '            configurable: true' +
            '        });' +
            '        Object.defineProperty(navigator, "languages", {' +
            '            get: function() {' +
            '                return ["en-US", "en"];' +
            '            },' +
            '            configurable: true' +
            '        });' +
            '        Object.defineProperty(navigator, "plugins", {' +
            '            get: function() {' +
            '                return {' +
            '                    length: 0,' +
            '                    item: function() { return null; },' +
            '                    namedItem: function() { return null; },' +
            '                    refresh: function() {}' +
            '                };' +
            '            },' +
            '            configurable: true' +
            '        });' +
            '        const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;' +
            '        HTMLCanvasElement.prototype.toDataURL = function() {' +
            '            const canvas = document.createElement("canvas");' +
            '            canvas.width = 1;' +
            '            canvas.height = 1;' +
            '            const ctx = canvas.getContext("2d");' +
            '            if (ctx) {' +
            '                ctx.fillStyle = "rgba(0, 0, 0, 0.01)";' +
            '                ctx.fillRect(0, 0, 1, 1);' +
            '            }' +
            '            return originalToDataURL.apply(this, arguments);' +
            '        };' +
            '        console.log("Anti-fingerprint loaded");' +
            '    } catch (error) {' +
            '        console.error("Anti-fingerprint error:", error);' +
            '    }' +
            '})();' +
            '</script>';
        
        // Вставляем скрипт
        if (body.indexOf('<head>') !== -1) {
            body = body.replace('<head>', '<head>' + antiFingerprintScript);
        } else if (body.indexOf('</head>') !== -1) {
            body = body.replace('</head>', antiFingerprintScript + '</head>');
        } else if (body.indexOf('<html>') !== -1) {
            body = body.replace('<html>', '<html>' + antiFingerprintScript);
        } else if (body.indexOf('<body>') !== -1) {
            body = body.replace('<body>', antiFingerprintScript + '<body>');
        }
        
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

} catch (error) {
console.error(‘Script error:’, error);
$done({});
}
