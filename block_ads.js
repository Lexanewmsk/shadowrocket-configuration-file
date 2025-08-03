let adKeywords = ['ad', 'ads', 'advert', 'banner', 'track', 'pop', 'doubleclick', 'googleadservices'];
let url = $request.url.toLowerCase();
let isAdRequest = adKeywords.some(keyword => url.includes(keyword));

if (isAdRequest) {
    console.log(`Blocked ad request: ${url}`);
    $done({ response: { status: 403 } });
} else {
    $done({});
}
