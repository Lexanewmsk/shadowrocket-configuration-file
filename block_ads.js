// Минимальный скрипт для теста
if (typeof $request !== 'undefined') {
    console.log('Request received: ' + $request.url);
    $done({});
} else {
    console.log('Error: $request is undefined. Check MITM and routing.');
    $done({});
}
