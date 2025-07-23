let url = $request.url;

// Список tracking параметров для удаления
const trackingParams = [
    // Google Analytics & Ads
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
    'gclid', 'gclsrc', 'dclid', '_ga', 'ga_', 'google_',
    
    // Facebook & Meta
    'fbclid', 'fb_action_ids', 'fb_action_types', 'fb_ref', 'fb_source',
    
    // Яндекс
    'yclid', '_openstat', 'from_', 'ya_',
    
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
    
    // Mobile Apps
    'app_', 'mobile_', 'android_', 'ios_',
    
    // Affiliate
    'affiliate', 'aff_', 'partner', 'promo_code'
];

// Парсим URL
try {
    let urlObj = new URL(url);
    let params = urlObj.searchParams;
    let hasChanged = false;
    
    // Удаляем tracking параметры
    trackingParams.forEach(param => {
        // Точное совпадение
        if (params.has(param)) {
            params.delete(param);
            hasChanged = true;
        }
        
        // Частичное совпадение (например utm_* удалит utm_source, utm_medium и т.д.)
        if (param.endsWith('_')) {
            let keysToDelete = [];
            for (let [key] of params) {
                if (key.startsWith(param)) {
                    keysToDelete.push(key);
                }
            }
            keysToDelete.forEach(key => {
                params.delete(key);
                hasChanged = true;
            });
        }
    });
    
    // Если были изменения - перенаправляем на чистый URL
    if (hasChanged) {
        let cleanUrl = urlObj.toString();
        $done({
            response: {
                status: 302,
                headers: {
                    'Location': cleanUrl
                }
            }
        });
    } else {
        // URL уже чистый
        $done({});
    }
} catch (error) {
    // Если не удалось распарсить URL - пропускаем без изменений
    $done({});
}