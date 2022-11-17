let clickedEl = null;

// can I just send dom-node in massage parameter?
// https://developer.chrome.com/docs/extensions/reference/runtime/#event-onMessage
document.addEventListener(
    "contextmenu",
    function(event){
        clickedEl = event.target;
        console.log(["eventListener from some.js", event.target])
    },
    true
);

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        if(message == "getClickedEl") {
            console.log("equals!", clickedEl, message);

            //sendResponse("PLUH!11");
            sendResponse(clickedEl);
        }
    }
);
