// Отладка: Проверяем, определён ли $request
if (typeof $request === 'undefined') {
    console.log('Error: $request is undefined. Check MITM and routing.');
    $done({}); // Завершаем выполнение без изменений
} else {
    let url = $request.url.toLowerCase();
    console.log(`Processing URL: ${url}`); // Логируем URL для отладки
    let adKeywords = ['ad', 'ads', 'advert', 'banner', 'track', 'pop', 'doubleclick', 'googleadservices'];

    let isAdRequest = adKeywords.some(keyword => url.includes(keyword));

    if (isAdRequest) {
        console.log(`Blocked ad request: ${url}`);
        $done({ response: { status: 403 } }); // Блокируем запрос
    } else {
        $done({}); // Пропускаем запрос
    }
}
