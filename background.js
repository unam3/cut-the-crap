//const a = 2;
chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
});

chrome.contextMenus.create(
  {
    "title": "cut"
    , "id": "the fuck"
  },
  () => {console.log("created?");}
)

chrome.contextMenus.onClicked.addListener((item, tab) => {
  //const item = item.menuItemId
  console.log(["clicked", item]);
});

