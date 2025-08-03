console.log('Script is running');
if (typeof $request !== 'undefined') {
    console.log('Request received: ' + $request.url);
} else {
    console.log('Error: $request is undefined. MITM or routing may be misconfigured.');
}
$done({});
