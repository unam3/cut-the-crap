// https://developer.chrome.com/docs/extensions/mv3/messaging/#simple
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    if (request == "reload")

        //chrome.runtime.reload();

        sendResponse("it was from reload!");
  }
);

console.log(chrome.runtime.lastError);

//chrome.runtime.onInstalled.addListener(() => {
//  chrome.action.setBadgeText({
//    text: "OFF",
//  });
//});
//
//chrome.contextMenus.create(
//  {
//    "title": "cut"
//    , "id": "the fuck"
//    , "contexts" : ["page"]
//  },
//  () => {console.log("created?");}
//)
//
//chrome.contextMenus.onClicked.addListener((item, tab) => {
//  //const item = item.menuItemId
//  //console.log(["clicked", item, tab]);
//  
//  chrome.tabs.sendMessage(
//    tab.id,
//    "getClickedEl",
//    {frameId: item.frameId},
//    el => {
//      //elt.value = data.value;
//      console.log(["background.js sendMessage's callback gets", el]);
//    });
//});
