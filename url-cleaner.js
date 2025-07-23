let url = $request.url;

// Быстрая проверка - есть ли вообще параметры
if (!url.includes('?')) {
    $done({});
}

// Список tracking параметров для удаления
const trackingParams = new Set([
    // Google Analytics & Ads
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
    'gclid', 'gclsrc', 'dclid', '_ga',
    
    // Facebook & Meta
    'fbclid', 'fb_action_ids', 'fb_action_types', 'fb_ref', 'fb_source',
    
    // Яндекс
    'yclid', '_openstat',
    
    // Email & Newsletter
    'campaign_id', 'subscriber_id', 'email_id', 'newsletter_id',
    'campaign', 'source', 'medium', 'ref', 'referrer',
    
    // A/B Testing
    'variant', 'test_group', 'experiment', 'ab_test',
    
    // Social Media
    'share', 'shared', 'via', 'twitter_impression_id',
    
    // Analytics общие
    'mc_cid', 'mc_eid', 'mkt_tok', '_hsenc', '_hsmi',
    'vero_conv', 'vero_id', 'nr_email_referer',
    
    // Affiliate
    'affiliate', 'partner', 'promo_code'
]);

// Префиксы для частичного совпадения
const trackingPrefixes = ['ga_', 'google_', 'from_', 'ya_', 'app_', 'mobile_', 'android_', 'ios_', 'aff_'];

try {
    let urlObj = new URL(url);
    let params = urlObj.searchParams;
    let keysToDelete = [];
    
    // Собираем все ключи для удаления за один проход
    for (let [key] of params) {
        // Точное совпадение
        if (trackingParams.has(key)) {
            keysToDelete.push(key);
            continue;
        }
        
        // Проверяем префиксы
        for (let prefix of trackingPrefixes) {
            if (key.startsWith(prefix)) {
                keysToDelete.push(key);
                break;
            }
        }
    }
    
    // Если нечего удалять - выходим сразу
    if (keysToDelete.length === 0) {
        $done({});
        return;
    }
    
    // Удаляем параметры
    keysToDelete.forEach(key => params.delete(key));
    
    // Возвращаем модифицированный запрос вместо редиректа
    let cleanUrl = urlObj.toString();
    $done({
        url: cleanUrl
    });
    
} catch (error) {
    $done({});
}
