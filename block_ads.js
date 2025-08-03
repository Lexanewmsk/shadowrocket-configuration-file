// Проверка, определён ли $request
if (typeof $request === 'undefined') {
    console.log('Error: $request is undefined');
    $done({});
} else {
    let url = $request.url.toLowerCase();
    let adKeywords = ['ad', 'ads', 'advert', 'banner', 'track', 'pop', 'doubleclick', 'googleadservices'];

    // Проверка на рекламные ключевые слова
    let isAdRequest = adKeywords.some(keyword => url.includes(keyword));

    if (isAdRequest) {
        console.log(`Blocked ad request: ${url}`);
        $done({ response: { status: 403 } }); // Блокируем запрос
    } else {
        $done({}); // Пропускаем запрос
    }
}
