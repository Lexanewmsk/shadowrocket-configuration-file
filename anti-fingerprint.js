// Anti-fingerprint script for Shadowrocket
// Requires: type=http-response

const antiFingerprintScript = `<script>
(function() {
try {
// Подмена User-Agent
Object.defineProperty(navigator, ‘userAgent’, {
get: function() {
return ‘Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36’;
},
configurable: true
});

```
    // Подмена разрешения экрана
    Object.defineProperty(window, 'screen', {
        get: function() {
            return {
                width: 1920,
                height: 1080,
                availWidth: 1920,
                availHeight: 1080,
                colorDepth: 24,
                pixelDepth: 24
            };
        },
        configurable: true
    });

    // Подмена языка
    Object.defineProperty(navigator, 'language', {
        get: function() {
            return 'en-US';
        },
        configurable: true
    });

    // Подмена языков
    Object.defineProperty(navigator, 'languages', {
        get: function() {
            return ['en-US', 'en'];
        },
        configurable: true
    });

    // Защита canvas-фингерпринтинга
    const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
    HTMLCanvasElement.prototype.toDataURL = function() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'rgba(0, 0, 0, 0.01)';
        ctx.fillRect(0, 0, 1, 1);
        return originalToDataURL.apply(this, arguments);
    };

    // Подмена плагинов
    Object.defineProperty(navigator, 'plugins', {
        get: function() {
            return {
                length: 0,
                item: function() { return null; },
                namedItem: function() { return null; },
                refresh: function() {}
            };
        },
        configurable: true
    });

    // Подмена WebGL
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(contextType) {
        if (contextType === 'webgl' || contextType === 'experimental-webgl') {
            const context = originalGetContext.apply(this, arguments);
            if (context) {
                const originalGetParameter = context.getParameter;
                context.getParameter = function(parameter) {
                    if (parameter === context.RENDERER) {
                        return 'Intel Iris OpenGL Engine';
                    }
                    if (parameter === context.VENDOR) {
                        return 'Intel Inc.';
                    }
                    return originalGetParameter.apply(this, arguments);
                };
            }
            return context;
        }
        return originalGetContext.apply(this, arguments);
    };

    // Подмена часового пояса
    const originalGetTimezoneOffset = Date.prototype.getTimezoneOffset;
    Date.prototype.getTimezoneOffset = function() {
        return 0; // UTC
    };

    console.log('Anti-fingerprint script loaded successfully');
} catch (error) {
    console.error('Anti-fingerprint script error:', error);
}
```

})();
</script>`;

// Основная функция обработки HTTP-ответа
try {
if ($response.status === 200) {
let body = $response.body;

```
    // Проверяем, является ли ответ HTML-страницей
    const contentType = ($response.headers['Content-Type'] || $response.headers['content-type'] || '').toLowerCase();
    
    if (body && contentType.includes('text/html')) {
        // Вставляем скрипт в начало <head> или перед </head>
        if (body.includes('<head>')) {
            body = body.replace('<head>', '<head>' + antiFingerprintScript);
        } else if (body.includes('</head>')) {
            body = body.replace('</head>', antiFingerprintScript + '</head>');
        } else if (body.includes('<html>')) {
            body = body.replace('<html>', '<html>' + antiFingerprintScript);
        } else if (body.includes('<body>')) {
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
console.error(‘Script processing error:’, error);
$done({});
}
