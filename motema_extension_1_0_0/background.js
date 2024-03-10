chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === 'openNewTab') {
        chrome.tabs.create({ url: request.url });
    }
});
