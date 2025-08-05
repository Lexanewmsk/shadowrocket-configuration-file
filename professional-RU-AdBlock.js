/**
 * Professional Russian AdBlock Script для Loon
 * Версия: 3.1 (Loon Compatible)
 * Автор: Professional AdBlock Team
 */

const CONFIG = {
    scriptName: "Professional-RU-AdBlock-Loon",
    version: "3.1",
    debug: true,
    
    blockingModes: {
        aggressive: true,
        cleanHTML: true,
        httpsRedirect: true,
        antiTracker: true
    }
};

// Списки для блокировки
const BLOCK_LISTS = {
    adDomains: [
        "bs.yandex.ru", "an.yandex.ru", "yabs.yandex.ru", 
        "adfox.ru", "adfox.yandex.ru", "awaps.yandex.ru",
        "dzeninfra.ru", "static.dzeninfra.ru", "clck.dzen.ru",
        "ads.dzeninfra.ru", "s3.dzeninfra.ru", "avatars.dzeninfra.ru",
        "doubleclick.net", "googlesyndication.com", "googleadservices.com",
        "googletagmanager.com", "pagead2.googlesyndication.com",
        "go.mail.ru", "rs.mail.ru", "top.mail.ru", "ad.mail.ru", "top-fwz1.mail.ru",
        "relap.io", "buzzoola.com", "marketgid.com", "mgid.com",
        "mc.yandex.ru", "metrika.yandex.ru", "google-analytics.com"
    ],
    
    adKeywords: [
        "реклама", "баннер", "объявления", "ads", "ad_", "_ad",
        "advertisement", "advertising", "promo", "banner",
        "counter", "metric", "analytics", "tracking", "pixel",
        "dzeninfra", "zen-lib", "clck", "yabs", "adfox"
    ],
    
    adPatterns: [
        /\/ads?\//i, /\/ad\//i, /\/banner/i, /\/reklama/i,
        /\/an\/count/i, /yandex.*\/an\//i, /\/yabs\//i,
        /dzeninfra\.ru.*zen-lib/i, /clck\.dzen\.ru/i,
        /dzen.*\/(click|track|pixel)/i,
        /[?&](utm_|fbclid|gclid|yclid)/i,
        /\/pixel\./i, /\/beacon\./i, /\/collect\?/i
    ]
};

// Белый список
const WHITELIST = {
    domains: [
        "yandex.ru/search", "yandex.ru/mail", "yandex.ru/maps",
        "vk.com/im", "vk.com/feed", "mail.ru/inbox",
        "dzen.ru/news", "dzen.ru/media", "dzen.ru/video",
        "gosuslugi.ru", "sberbank.ru", "vtb.ru"
    ],
    
    paths: [
        "/api/", "/ajax/", "/json/", "/login", "/auth", "/payment"
    ]
};

// Логгер для Loon
class Logger {
    static log(level, message, data = null) {
        if (!CONFIG.debug && level === 'debug') return;
        
        const timestamp = new Date().toLocaleTimeString();
        const prefix = `[${CONFIG.scriptName}][${level.toUpperCase()}][${timestamp}]`;
        
        if (data) {
            console.log(`${prefix} ${message} - ${JSON.stringify(data)}`);
        } else {
            console.log(`${prefix} ${message}`);
        }
    }
    
    static debug(message, data) { this.log('debug', message, data); }
    static info(message, data) { this.log('info', message, data); }
    static warn(message, data) { this.log('warn', message, data); }
    static error(message, data) { this.log('error', message, data); }
}

// Анализатор URL
class URLAnalyzer {
    static isWhitelisted(url) {
        const urlLower = url.toLowerCase();
        
        for (const domain of WHITELIST.domains) {
            if (urlLower.includes(domain.toLowerCase())) {
                Logger.debug(`Whitelisted by domain: ${domain}`);
                return true;
            }
        }
        
        for (const path of WHITELIST.paths) {
            if (urlLower.includes(path.toLowerCase())) {
                Logger.debug(`Whitelisted by path: ${path}`);
                return true;
            }
        }
        
        return false;
    }
    
    static shouldBlock(url) {
        if (this.isWhitelisted(url)) {
            return { blocked: false };
        }
        
        const urlLower = url.toLowerCase();
        
        // Проверяем домены
        for (const domain of BLOCK_LISTS.adDomains) {
            if (urlLower.includes(domain.toLowerCase())) {
                Logger.info(`🚫 BLOCKED by domain: ${domain}`);
                return { blocked: true, reason: `domain: ${domain}` };
            }
        }
        
        // Проверяем ключевые слова
        for (const keyword of BLOCK_LISTS.adKeywords) {
            if (urlLower.includes(keyword.toLowerCase())) {
                Logger.info(`🚫 BLOCKED by keyword: ${keyword}`);
                return { blocked: true, reason: `keyword: ${keyword}` };
            }
        }
        
        // Проверяем паттерны
        for (const pattern of BLOCK_LISTS.adPatterns) {
            if (pattern.test(url)) {
                Logger.info(`🚫 BLOCKED by pattern: ${pattern}`);
                return { blocked: true, reason: `pattern: ${pattern}` };
            }
        }
        
        return { blocked: false };
    }
}

// Очистка HTML контента
class ContentCleaner {
    static cleanHTML(html) {
        if (!CONFIG.blockingModes.cleanHTML) return html;
        
        const originalLength = html.length;
        let cleanedHTML = html;
        
        const cleanupPatterns = [
            // Яндекс.Директ и партнеры
            /<script[^>]*(?:yandex|ya).*?(?:direct|partner|metrika)[^>]*>.*?<\/script>/gis,
            /<div[^>]*ya-partner[^>]*>.*?<\/div>/gis,
            /<div[^>]*yap-adunit[^>]*>.*?<\/div>/gis,
            
            // Google AdSense
            /<script[^>]*googlesyndication[^>]*>.*?<\/script>/gis,
            /<ins[^>]*adsbygoogle[^>]*>.*?<\/ins>/gis,
            
            // Adfox
            /<script[^>]*adfox[^>]*>.*?<\/script>/gis,
            /<div[^>]*adfox[^>]*>.*?<\/div>/gis,
            
            // Дзен рекламные блоки
            /<div[^>]*(?:id|class)="[^"]*(?:zen-lib|dzeninfra)[^"]*"[^>]*>.*?<\/div>/gis,
            /<script[^>]*dzeninfra[^>]*>.*?<\/script>/gis,
            
            // Общие рекламные блоки
            /<div[^>]*(?:id|class)="[^"]*(?:ad|ads|banner|reklama)[^"]*"[^>]*>.*?<\/div>/gis,
            
            // Трекинг пиксели
            /<img[^>]*(?:pixel|beacon|counter|metric)[^>]*>/gi,
            /<noscript[^>]*>.*?<img[^>]*counter[^>]*>.*?<\/noscript>/gis
        ];
        
        for (const pattern of cleanupPatterns) {
            cleanedHTML = cleanedHTML.replace(pattern, '');
        }
        
        // Очищаем пустые контейнеры
        cleanedHTML = cleanedHTML.replace(/<div[^>]*>\s*<\/div>/gi, '');
        
        const bytesRemoved = originalLength - cleanedHTML.length;
        if (bytesRemoved > 0) {
            Logger.info(`🧹 HTML cleaned: ${bytesRemoved} bytes removed`);
        }
        
        return cleanedHTML;
    }
}

// Основная логика
(function main() {
    Logger.info(`🚀 Script started v${CONFIG.version}`);
    
    try {
        // Обработка HTTP запроса
        if (typeof $request !== 'undefined' && $request) {
            const url = $request.url;
            const method = $request.method || 'GET';
            
            Logger.debug(`📤 Processing ${method} request: ${url}`);
            
            // Проверяем блокировку
            const blockResult = URLAnalyzer.shouldBlock(url);
            if (blockResult.blocked) {
                Logger.info(`🚫 REQUEST BLOCKED: ${blockResult.reason} - ${url}`);
                
                // Возвращаем пустой ответ для заблокированных запросов
                $done({
                    response: {
                        status: 204,
                        headers: {
                            'Content-Type': 'text/plain'
                        },
                        body: ''
                    }
                });
                return;
            }
            
            Logger.debug(`✅ Request allowed: ${url}`);
            $done({});
        }
        
        // Обработка HTTP ответа
        else if (typeof $response !== 'undefined' && $response) {
            const url = $response.url || 'unknown';
            const contentType = $response.headers && 
                              ($response.headers['Content-Type'] || 
                               $response.headers['content-type']) || '';
            
            Logger.debug(`📥 Processing response: ${url}`);
            
            // Обрабатываем только HTML контент
            if (contentType.includes('text/html') && $response.body) {
                const cleanedBody = ContentCleaner.cleanHTML($response.body);
                
                if (cleanedBody !== $response.body) {
                    Logger.info(`🧹 Response cleaned: ${url}`);
                    $done({
                        response: {
                            status: $response.status,
                            headers: $response.headers,
                            body: cleanedBody
                        }
                    });
                    return;
                }
            }
            
            Logger.debug(`✅ Response passed through: ${url}`);
            $done({});
        }
        
        else {
            Logger.warn('❌ No request or response object available');
            $done({});
        }
        
    } catch (error) {
        Logger.error('💥 Script execution error:', {
            message: error.message,
            stack: error.stack
        });
        $done({});
    }
})();
