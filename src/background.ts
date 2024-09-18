chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({ url: "https://example.com" });
});

chrome.tabs.onUpdated.addListener(
  function(tabId, changeInfo, tab) {
    // read changeInfo data and do something with it
    // like send the new url to contentscripts.js
    if (changeInfo.url) {
      chrome.tabs.sendMessage( tabId, {
        message: 'urlChange',
        url: changeInfo.url
      })
    }
  }
);