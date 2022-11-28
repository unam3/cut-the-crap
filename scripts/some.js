'use strict';


const url = document.location.host.concat(document.location.pathname, document.location.search);

const changes = {};

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

      //maybeStoreChanges(originalTextContent, event.target.textContent, selector);

      this.controller.abort();

      e.target.contentEditable = false;

      
      console.log((originalHandleEventName).concat(" ends"));
  };

  const endOfEditWithEscape = function (e) {

    if (e.key == "Escape") {

        //console.log("escape", this);

        return endOfEdit.bind(this)(e);
    }
  };


  const clickHandler = (event) => {

      if (event.ctrlKey) {
          
          const clicked = event.target;

          const originalTextContent = clicked.textContent;

          clicked.contentEditable = true;

          clicked.focus();


          const selector = generateCSSSelector(clicked);

          //console.log(originalTextContent, selector, "on click: contentEditable = true");
          

          const controller = new AbortController();
          

          clicked.addEventListener(
              "keydown",
              {
                "handleEvent": endOfEditWithEscape,
                originalTextContent,
                selector,
                signal: controller.signal,
                controller
              }
          );

          clicked.addEventListener(
              "blur",
              {
                "handleEvent": endOfEdit,
                originalTextContent,
                selector,
                signal: controller.signal,
                controller
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
