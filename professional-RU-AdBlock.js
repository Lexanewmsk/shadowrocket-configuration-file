/**
 * Professional Russian AdBlock Script for Loon
 * Версия: 3.1
 * Автор: Professional AdBlock Team
 * Описание: Комплексная система блокировки рекламы для русскоязычных сайтов
 */

const CONFIG = {
    scriptName: "Professional-RU-AdBlock",
    version: "3.1",
    debug: true,
    
    // Настройки блокировки
    blockingModes: {
        aggressive: true,      // Агрессивная блокировка
        cleanHTML: true,       // Очистка HTML контента
        httpsRedirect: true,   // Принудительный HTTPS
        antiTracker: true,     // Антитрекинг
        socialBlock: false     // Блокировка соцсетей (по умолчанию выкл)
    },
    
    // Таймауты
    timeouts: {
        request: 5000,
        response: 10000
    }
};

// ===============================================
// СПИСКИ ДОМЕНОВ И ПАТТЕРНОВ ДЛЯ БЛОКИРОВКИ
// ===============================================

const BLOCK_LISTS = {
    // Рекламные домены
    adDomains: [
        // Яндекс реклама
        "bs.yandex.ru", "an.yandex.ru", "yabs.yandex.ru", 
        "awaps.yandex.ru", "yastatic.net/awaps",
        "yandexadexchange.net", "adfox.ru", "adfox.yandex.ru",
        
        // Яндекс.Дзен реклама и трекинг
        "dzeninfra.ru", "static.dzeninfra.ru", 
        "clck.dzen.ru", "an.dzen.ru", "ads.dzen.ru",
        
        // Google реклама
        "doubleclick.net", "googlesyndication.com", "googleadservices.com",
        "googletagmanager.com", "googletagservices.com", "adsystem.google.com",
        "pagead2.googlesyndication.com", "tpc.googlesyndication.com",
        
        // VK/Mail.ru реклама
        "go.mail.ru", "rs.mail.ru", "top.mail.ru", "love.mail.ru/ads",
        "vk.com/ads", "ads.vk.com",
        
        // Рамблер
        "top100.rambler.ru", "counter.rambler.ru", "ssp.rambler.ru",
        "nova.rambler.ru", "rbc.ru/ads",
        
        // RTB платформы
        "relap.io", "buzzoola.com", "marketgid.com", "mgid.com",
        "outbrain.com", "taboola.com", "smi2.net",
        
        // Аналитика и трекинг
        "mc.yandex.ru", "informer.yandex.ru", "metrika.yandex.ru",
        "google-analytics.com", "googleanalytics.com", "gtm.js",
        "facebook.com/tr", "connect.facebook.net/signals",
        
        // Криптомайнинг
        "coinhive.com", "coin-hive.com", "jsecoin.com", "crypto-loot.com"
    ],
    
    // Ключевые слова в URL для блокировки
    adKeywords: [
        // Реклама на русском
        "реклама", "баннер", "объявления", "промо", "рекламный",
        "advertisement", "advertising", "advert", "promo", "banner",
        "ads", "ad_", "_ad", "adnxs", "adsystem", "adserver",
        
        // RTB и программатик
        "rtb", "ssp", "dsp", "prebid", "header_bidding", "programmatic",
        "ad_exchange", "adx", "bidder", "auction",
        
        // Трекинг
        "counter", "metric", "analytics", "tracking", "tracker",
        "pixel", "beacon", "collect", "stats", "statistic", "telemetry",
        "fingerprint", "visitor", "session", "heatmap", "click",
        
        // Партнерские программы
        "affiliate", "partner", "referral", "commission", "cashback",
        
        // Видеореклама
        "videoads", "preroll", "midroll", "postroll", "overlay",
        
        // Мобильная реклама
        "mobileads", "inapp", "interstitial", "rewarded",
        
        // Дзен специфичные
        "dzeninfra", "zen-lib", "clck"
    ],
    
    // Паттерны в URL
    adPatterns: [
        // Директории с рекламой
        /\/ads?\//i, /\/ad\//i, /\/banner/i, /\/banners/i,
        /\/reklama/i, /\/advertising/i, /\/advert/i,
        /\/promo/i, /\/commercial/i, /\/sponsored/i,
        
        // Поддомены
        /^https?:\/\/ads?\./i, /^https?:\/\/ad\./i,
        /^https?:\/\/banner/i, /^https?:\/\/promo/i,
        /^https?:\/\/reklama/i, /^https?:\/\/commercial/i,
        
        // Файлы
        /\.ads\./i, /ads\d+\./i, /banner\d+\./i,
        /\/ads\.js/i, /\/ad\.js/i, /\/banner\.js/i,
        /\/adsense/i, /\/adnxs/i, /\/prebid/i,
        
        // Трекинг пиксели
        /\/pixel\./i, /\/beacon\./i, /\/collect\?/i,
        /\/counter\./i, /\/metric\./i, /\/track\./i,
        /\/click/i, /\/clck\./i,
        
        // Видеореклама
        /\/videoads/i, /\/preroll/i, /\/midroll/i,
        /\/ima\d/i, /\/vast/i, /\/vpaid/i,
        
        // Партнерки
        /\/affiliate/i, /\/partner/i, /\/referral/i,
        /\/click\?/i, /\/redirect\?/i, /\/go\?/i,
        
        // Специфичные для России
        /\/adfox/i, /\/begun/i, /\/directadvert/i,
        /\/rotaban/i, /\/mixadvert/i,
        
        // Яндекс специфичные
        /\/an\/count/i, /yandex.*\/an\//i, /\/bs\/yandex/i,
        /\/yabs\//i, /awaps/i,
        
        // Дзен специфичные  
        /dzeninfra\.ru.*zen-lib/i, /clck\.dzen\.ru/i,
        /dzen.*\/(click|track|pixel)/i,
        
        // Трекинг параметры
        /[?&](adb-bits|test-tag|ctime|actual-format)=/i,
        /[?&](utm_|fbclid|gclid|yclid)/i
    ]
};

// ===============================================
// БЕЛЫЙ СПИСОК
// ===============================================

const WHITELIST = {
    domains: [
        // Поисковики
        "yandex.ru/search", "google.com/search", "google.ru/search",
        "duckduckgo.com", "bing.com/search",
        
        // Социальные сети (основной функционал)
        "vk.com/im", "vk.com/feed", "vk.com/friends",
        "ok.ru/messages", "ok.ru/feed",
        "facebook.com/messages", "instagram.com",
        
        // Дзен контент (не реклама)
        "dzen.ru/news", "dzen.ru/media", "dzen.ru/video",
        
        // Почта
        "mail.ru/inbox", "yandex.ru/mail", "gmail.com",
        
        // Важные сервисы
        "gosuslugi.ru", "nalog.ru", "pfr.ru", "fss.ru",
        "sberbank.ru", "vtb.ru", "alfabank.ru",
        "yandex.ru/maps", "2gis.ru",
        
        // Образование и работа
        "hh.ru", "superjob.ru", "rabota.ru",
        "coursera.org", "stepik.org", "skillbox.ru",
        
        // Новости (редакционный контент)
        "lenta.ru/news", "rbc.ru/politics", "kommersant.ru/doc",
        "ria.ru", "tass.ru", "interfax.ru"
    ],
    
    paths: [
        "/api/", "/ajax/", "/json/", "/xml/",
        "/login", "/auth", "/oauth", "/register",
        "/checkout", "/payment", "/cart", "/order"
    ]
};

// ===============================================
// HTTPS РЕДИРЕКТ КОНФИГУРАЦИЯ  
// ===============================================

const HTTPS_REDIRECT = {
    domains: [
        "yandex.ru", "ya.ru", "yandex.com",
        "vk.com", "vkontakte.ru", 
        "mail.ru", "my.mail.ru", "e.mail.ru",
        "ok.ru", "odnoklassniki.ru",
        "avito.ru", "youla.ru", "drom.ru",
        "pikabu.ru", "habr.com", "vc.ru",
        "lenta.ru", "rbc.ru", "kommersant.ru",
        "kinopoisk.ru", "ivi.ru", "start.ru",
        "ozon.ru", "wildberries.ru", "lamoda.ru",
        "sberbank.ru", "vtb.ru", "tinkoff.ru",
        "dzen.ru"
    ]
};

// ===============================================
// УТИЛИТЫ И ХЕЛПЕРЫ
// ===============================================

class Logger {
    static log(level, message, data = null) {
        if (!CONFIG.debug && level === 'debug') return;
        
        const timestamp = new Date().toISOString();
        const prefix = `[${CONFIG.scriptName}][${level.toUpperCase()}][${timestamp}]`;
        
        if (data) {
            console.log(`${prefix} ${message}`, JSON.stringify(data));
        } else {
            console.log(`${prefix} ${message}`);
        }
    }
    
    static debug(message, data) { this.log('debug', message, data); }
    static info(message, data) { this.log('info', message, data); }
    static warn(message, data) { this.log('warn', message, data); }
    static error(message, data) { this.log('error', message, data); }
}

class URLAnalyzer {
    static isWhitelisted(url) {
        const urlLower = url.toLowerCase();
        
        // Проверяем домены
        for (const domain of WHITELIST.domains) {
            if (urlLower.includes(domain.toLowerCase())) {
                Logger.debug(`Whitelisted by domain: ${domain}`, { url });
                return true;
            }
        }
        
        // Проверяем пути
        for (const path of WHITELIST.paths) {
            if (urlLower.includes(path.toLowerCase())) {
                Logger.debug(`Whitelisted by path: ${path}`, { url });
                return true;
            }
        }
        
        return false;
    }
    
    static shouldBlock(url) {
        if (this.isWhitelisted(url)) {
            return false;
        }
        
        const urlLower = url.toLowerCase();
        
        // Проверяем рекламные домены
        for (const domain of BLOCK_LISTS.adDomains) {
            if (urlLower.includes(domain.toLowerCase())) {
                Logger.info(`Blocked by domain: ${domain}`, { url });
                return { blocked: true, reason: `domain: ${domain}` };
            }
        }
        
        // Проверяем ключевые слова
        for (const keyword of BLOCK_LISTS.adKeywords) {
            if (urlLower.includes(keyword.toLowerCase())) {
                Logger.info(`Blocked by keyword: ${keyword}`, { url });
                return { blocked: true, reason: `keyword: ${keyword}` };
            }
        }
        
        // Проверяем паттерны
        for (const pattern of BLOCK_LISTS.adPatterns) {
            if (pattern.test(url)) {
                Logger.info(`Blocked by pattern: ${pattern}`, { url });
                return { blocked: true, reason: `pattern: ${pattern}` };
            }
        }
        
        return { blocked: false };
    }
    
    static shouldRedirectToHTTPS(url) {
        if (!CONFIG.blockingModes.httpsRedirect) return null;
        if (!url.startsWith('http://')) return null;
        
        const urlLower = url.toLowerCase();
        
        for (const domain of HTTPS_REDIRECT.domains) {
            if (urlLower.includes(domain.toLowerCase())) {
                const httpsUrl = url.replace('http://', 'https://');
                Logger.info(`HTTPS redirect: ${url} -> ${httpsUrl}`);
                return httpsUrl;
            }
        }
        
        return null;
    }
}

class ContentCleaner {
    static cleanHTML(html) {
        if (!CONFIG.blockingModes.cleanHTML) return html;
        
        const originalLength = html.length;
        let cleanedHTML = html;
        
        // Паттерны для очистки HTML
        const cleanupPatterns = [
            // Яндекс.Директ
            /<script[^>]*(?:yandex|ya).*?(?:direct|partner|metrika)[^>]*>.*?<\/script>/gis,
            /<div[^>]*ya-partner[^>]*>.*?<\/div>/gis,
            /<div[^>]*yap-adunit[^>]*>.*?<\/div>/gis,
            /<div[^>]*class="[^"]*(?:ya-partner|yap-|direct)[^"]*"[^>]*>.*?<\/div>/gis,
            
            // Google AdSense
            /<script[^>]*googlesyndication[^>]*>.*?<\/script>/gis,
            /<ins[^>]*adsbygoogle[^>]*>.*?<\/ins>/gis,
            /<div[^>]*class="[^"]*adsbygoogle[^"]*"[^>]*>.*?<\/div>/gis,
            
            // Adfox
            /<script[^>]*adfox[^>]*>.*?<\/script>/gis,
            /<div[^>]*adfox[^>]*>.*?<\/div>/gis,
            
            // Дзен рекламные блоки
            /<div[^>]*(?:id|class)="[^"]*(?:zen-lib|dzeninfra)[^"]*"[^>]*>.*?<\/div>/gis,
            /<script[^>]*dzeninfra[^>]*>.*?<\/script>/gis,
            
            // RTB контейнеры
            /<div[^>]*(?:id|class)="[^"]*(?:rtb|ssp|dsp|prebid)[^"]*"[^>]*>.*?<\/div>/gis,
            
            // Общие рекламные блоки
            /<div[^>]*(?:id|class)="[^"]*(?:ad|ads|banner|reklama|advert)[^"]*"[^>]*>.*?<\/div>/gis,
            /<section[^>]*(?:id|class)="[^"]*(?:ad|ads|banner|advertising)[^"]*"[^>]*>.*?<\/section>/gis,
            /<aside[^>]*(?:id|class)="[^"]*(?:ad|ads|sidebar-ad)[^"]*"[^>]*>.*?<\/aside>/gis,
            
            // Трекинг пиксели
            /<img[^>]*(?:pixel|beacon|counter|metric|clck)[^>]*>/gi,
            /<noscript[^>]*>.*?<img[^>]*(?:counter|metric|pixel)[^>]*>.*?<\/noscript>/gis,
            
            // Видеореклама
            /<div[^>]*(?:videoads|ima-|vast-)[^>]*>.*?<\/div>/gis,
            
            // Inline стили для рекламы
            /style="[^"]*(?:display:\s*none|visibility:\s*hidden)[^"]*ad[^"]*"/gi,
            
            // Комментарии с рекламой
            /<!--[\s\S]*?(?:ad|advertisement|banner|reklama)[\s\S]*?-->/gi
        ];
        
        // Применяем паттерны очистки
        for (const pattern of cleanupPatterns) {
            cleanedHTML = cleanedHTML.replace(pattern, '');
        }
        
        // Очищаем пустые контейнеры
        const emptyContainerPatterns = [
            /<div[^>]*>\s*<\/div>/gi,
            /<section[^>]*>\s*<\/section>/gi,
            /<aside[^>]*>\s*<\/aside>/gi
        ];
        
        for (const pattern of emptyContainerPatterns) {
            cleanedHTML = cleanedHTML.replace(pattern, '');
        }
        
        const bytesRemoved = originalLength - cleanedHTML.length;
        if (bytesRemoved > 0) {
            Logger.info(`HTML cleaned: ${bytesRemoved} bytes removed`);
        }
        
        return cleanedHTML;
    }
}

// ===============================================
// ОСНОВНАЯ ЛОГИКА ОБРАБОТКИ
// ===============================================

class RequestHandler {
    static handle(request) {
        const url = request.url;
        const method = request.method || 'GET';
        
        Logger.debug(`Processing ${method} request`, { url, headers: request.headers });
        
        // Проверяем HTTPS редирект
        const httpsUrl = URLAnalyzer.shouldRedirectToHTTPS(url);
        if (httpsUrl) {
            return {
                response: {
                    status: 302,
                    headers: {
                        'Location': httpsUrl,
                        'Cache-Control': 'no-cache'
                    }
                }
            };
        }
        
        // Проверяем блокировку
        const blockResult = URLAnalyzer.shouldBlock(url);
        if (blockResult.blocked) {
            Logger.info(`REQUEST BLOCKED: ${blockResult.reason}`, { url });
            
            return {
                response: {
                    status: 204,
                    headers: {
                        'Content-Type': 'text/plain',
                        'Cache-Control': 'max-age=86400'
                    },
                    body: ''
                }
            };
        }
        
        Logger.debug('Request allowed', { url });
        return null; // Пропускаем запрос
    }
}

class ResponseHandler {
    static handle(response) {
        const url = response.url || 'unknown';
        const status = response.status;
        const contentType = response.headers && response.headers['Content-Type'] || 
                          response.headers && response.headers['content-type'] || '';
        
        Logger.debug(`Processing response`, { url, status, contentType });
        
        // Обрабатываем только HTML контент
        if (!contentType.includes('text/html') && !contentType.includes('text/plain')) {
            return null;
        }
        
        if (!response.body) {
            return null;
        }
        
        const cleanedBody = ContentCleaner.cleanHTML(response.body);
        
        if (cleanedBody !== response.body) {
            Logger.info('Response body cleaned', { url });
            return {
                response: {
                    status: response.status,
                    headers: response.headers,
                    body: cleanedBody
                }
            };
        }
        
        return null;
    }
}

// ===============================================
// ТОЧКА ВХОДА
// ===============================================

(function main() {
    Logger.info(`Script started v${CONFIG.version}`, CONFIG.blockingModes);
    
    try {
        if (typeof $request !== 'undefined' && $request) {
            // Обработка запроса
            const result = RequestHandler.handle($request);
            if (result) {
                $done(result);
            } else {
                $done({});
            }
        } else if (typeof $response !== 'undefined' && $response) {
            // Обработка ответа
            const result = ResponseHandler.handle($response);
            if (result) {
                $done(result);
            } else {
                $done({});
            }
        } else {
            Logger.warn('No request or response object available');
            $done({});
        }
    } catch (error) {
        Logger.error('Script execution error', {
            message: error.message,
            stack: error.stack
        });
        $done({});
    }
})();
