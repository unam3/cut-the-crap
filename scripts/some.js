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

      console.log("handleEvent name is ".concat(this.handleEvent.name));

      //maybeStoreChanges(originalTextContent, event.target.textContent, selector);

      // mutating this because removeEventListener needs original reference to object
      this.hadnleEvent = endOfEdit;

      event.target.removeEventListener(
        "focusout",
        this
      );

      e.target.contentEditable = false;

      //const {originalTextContent, selector} = this;

      //const modifiedOptions = {
      //  originalTextContent,
      //  selector,
      //  "handleEvent": endOfEditWithEscape,
      //};
      
      // works
      this.handleEvent = endOfEditWithEscape;

      event.target.removeEventListener(
        "keydown",
        // endOfEditWithEscape // does not work
        // modifiedOptions // does not work
        this // works
      );
      
      console.log("endOfEdit ends");
  };

  const endOfEditWithEscape = function (e) {

    if (e.key == "Escape") {

        console.log("escape", this);

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
          

          clicked.addEventListener(
              "focusout",
              {
                "handleEvent": endOfEdit,
                originalTextContent,
                selector
              },
          );

          clicked.addEventListener(
              "keydown",
              {
                "handleEvent": endOfEditWithEscape,
                originalTextContent,
                selector
              }
          );
      }
  };

  document.addEventListener(
      "click",
      clickHandler,
      true
  );
})();
