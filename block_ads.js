console.log("Script started");

if (typeof $request !== "undefined") {
    console.log("Request URL: " + $request.url);
    $done({});
} else if (typeof $response !== "undefined") {
    console.log("Response status: " + $response.status);
    $done({});
} else {
    console.log("No request or response object found");
    $done({});
}
