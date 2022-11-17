let clickedEl = null;

// can I just send dom-node in massage parameter?
// https://developer.chrome.com/docs/extensions/reference/runtime/#event-onMessage
document.addEventListener(
    "click",
    function(event){
        if (event.ctrlKey) {
            clickedEl = event.target;
            console.log(["eventListener from some.js", event.target])
        }
    },
    true
);
