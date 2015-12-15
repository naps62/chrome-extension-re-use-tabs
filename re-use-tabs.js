var tabs = [];

function updateTabs() {
  chrome.tabs.query({ pinned: true }, function(result) {
    tabs = result;
  });
}

function domain(url) {
  var domain;
  if (url.indexOf("://") > -1) {
    domain = url.split("/")[2];
  } else {
    domain = url.split("/")[0];
  }

  // find & remove port number
  domain = domain.split(":")[0];

  return domain;
}

function getPinnedTabForDomain(url) {
  return tabs.find(function(tab) {
    return domain(tab.url) == domain(url);
  })
}


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
  updateTabs();
  if (changeInfo.url) {
    var pinnedTab = getPinnedTabForDomain(changeInfo.url);
    if (pinnedTab && pinnedTab.id != tabId) {
      chrome.tabs.update(pinnedTab.id, { selected: true, url: changeInfo.url })
      chrome.tabs.remove(tabId);
    }
  }
});
