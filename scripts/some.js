'use strict';

const url = document.location.host.concat(document.location.pathname, document.location.search);

let changes = {};

window.addEventListener(
    "load",
    () => {

        console.log("load");

        const savedChanges = window.localStorage.getItem(url);

        if (savedChanges) {

            changes = JSON.parse(savedChanges);

            console.log("parsed", changes);

            Object.entries(changes)
                .forEach(
                    ([selector, textContent]) => {

                        console.log(selector, textContent);

                        const node = document.querySelector(selector);

                        if (node) {
                            
                            node.textContent = textContent;
                        } else {

                            console.log("document has no node with such selector", selector);
                        }
                    }
                );

            console.log("changes was applied");
        }
    }
);


const generateCSSSelector = (node) => CssSelectorGenerator.getCssSelector(
    node,
    {"blacklist": ['*ontenteditable*']}
);

                          
const maybeStoreChanges = (original, maybeModified, selector) => {
    if (original != maybeModified) {
        changes[selector] = maybeModified;
        
        console.log("textContent was stored for ".concat(selector));
    } else {
        console.log("textContent is equal to original");
    }
}


// HOT reload implementation
window.addEventListener(
    "blur",
    () => {

        console.log("blur");

        window.addEventListener(
            "focus",
            () => {
                
                chrome.runtime.sendMessage("reload extension");

                location.reload();
            }
        );
    }
);



(async () => {

  window.addEventListener(
      "beforeunload",
      () => {
          window.localStorage.setItem(url, JSON.stringify(changes));
      }
  );


  const src = chrome.runtime.getURL('scripts/css-selector-generator.js');
  
  const contentScript = await import(src);


  // arrows doesn't have *this*; here it's an object from addEventListener params
  const endOfEdit = function (e) {

      const originalHandleEventName = this.handleEvent.name;

      console.log(originalHandleEventName, "ts: ".concat(e.timeStamp));


      maybeStoreChanges(this.originalTextContent, event.target.textContent, this.selector);

      // mutating this because removeEventListener needs original reference to object
      //this.hadnleEvent = endOfEdit;

      event.target.removeEventListener(
        "blur",
        this
      );

      
      // this code only for configurable way to end edit
      //this.handleEvent = endOfEditWithEscape;

      //event.target.removeEventListener(
      //  "keydown",
      //  this
      //);


      e.target.contentEditable = false;

      
      console.log((originalHandleEventName).concat(" ends"));
  };

  // this code only for configurable way to end edit
  //const endOfEditWithEscape = function (e) {

  //  if (e.key == "Escape") {

  //      //console.log("escape", this);

  //      return endOfEdit.bind(this)(e);
  //  }
  //};


  const clickHandler = (event) => {

      if (event.ctrlKey) {
          
          const clicked = event.target;

          const originalTextContent = clicked.textContent;

          clicked.contentEditable = true;

          clicked.focus();


          const selector = generateCSSSelector(clicked);

          //console.log(originalTextContent, selector, "on click: contentEditable = true");
          

          // this code only for configurable way to end edit
          //clicked.addEventListener(
          //    "keydown",
          //    {
          //      "handleEvent": endOfEditWithEscape,
          //      originalTextContent,
          //      selector
          //    }
          //);

          clicked.addEventListener(
              "blur",
              {
                "handleEvent": endOfEdit,
                originalTextContent,
                selector
              },
          );

      }
  };

  document.addEventListener(
      "click",
      clickHandler,
      true
  );
})();
