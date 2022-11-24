// https://developer.chrome.com/docs/extensions/mv3/messaging/#simple
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    
    sendResponse({farewell: "goodbye"});
);

console.log(chome.runtime.lastError);

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
});

chrome.contextMenus.create(
  {
    "title": "cut"
    , "id": "the fuck"
    , "contexts" : ["page"]
  },
  () => {console.log("created?");}
)

chrome.contextMenus.onClicked.addListener((item, tab) => {
  //const item = item.menuItemId
  //console.log(["clicked", item, tab]);
  
  chrome.tabs.sendMessage(
    tab.id,
    "getClickedEl",
    {frameId: item.frameId},
    el => {
      //elt.value = data.value;
      console.log(["background.js sendMessage's callback gets", el]);
    });
});

