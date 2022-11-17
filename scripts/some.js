let clickedEl = null;

// can I just send dom-node in massage parameter?
// https://developer.chrome.com/docs/extensions/reference/runtime/#event-onMessage
document.addEventListener(
    "click",
    function(event) {
        if (event.ctrlKey) {
            
            clicked = event.target;

            clicked.contentEditable = true;
            
            clicked.focus();
            
            event.target.addEventListener(
                "focusout",
                ((event) => {
                    event.target.contentEditable = false;
                }),
                true
            )
            event.target.addEventListener(
                "keydown",
                ((event) => {
                    //console.log(event.key, event.target);

                    if (event.key == "Escape") {
                        event.target.contentEditable = false;
                    };
                }),
                true
            )
            console.log(["eventListener from some.js", event.target])
        }
    },
    true
);
