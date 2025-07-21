(function() {
    // Подмена User-Agent
    Object.defineProperty(navigator, 'userAgent', {
        get: function() {
            return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
        }
    });

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
        }
    });

    // Подмена языка
    Object.defineProperty(navigator, 'language', {
        get: function() {
            return 'en-US';
        }
    });

    // Защита canvas-фингерпринтинга
    const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
    HTMLCanvasElement.prototype.toDataURL = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'rgba(0, 0, 0, 0.01)';
        ctx.fillRect(0, 0, 1, 1); // Минимальный шум
        return originalToDataURL.apply(this, arguments);
    };

    // Подмена плагинов
    Object.defineProperty(navigator, 'plugins', {
        get: function() {
            return [];
        }
    });
})();
