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

(async () => {

  // TODO: add hot reloading with https://www.npmjs.com/package/mv3-hot-reload
  //const hot-reload_src = chrome.runtime.getURL('scripts/.js');

  //const contentScript = await import(css-selector-generator_src);


  window.addEventListener(
      "beforeunload",
      () => {
          window.localStorage.setItem(url, JSON.stringify(changes));
      }
  );


  const src = chrome.runtime.getURL('scripts/css-selector-generator.js');
  
  const contentScript = await import(src);
  
  document.addEventListener(
      "click",
      function(event) {
          if (event.ctrlKey) {
              
              const clicked = event.target;
  
              const originalTextContent = event.target.textContent;

              clicked.contentEditable = true;
              
              clicked.focus();


              const selector = generateCSSSelector(event.target);

              console.log(selector, "on click: set to true");
              
              event.target.addEventListener(
                  "focusout",
                  ((event) => {
                      event.target.contentEditable = false;

                      maybeStoreChanges(originalTextContent, event.target.textContent, selector);
                      
                      console.log(selector, changes, "on focusout: set to false");
                  }),
                  true
              );
  
              event.target.addEventListener(
                  "keydown",
                  ((event) => {
                      //console.log(event.key, event.target);
  
                      if (event.key == "Escape") {
                          event.target.contentEditable = false;

                          maybeStoreChanges(originalTextContent, event.target.textContent, selector);
                          
                          console.log(selector, changes, "on Escape keydown: set to false");
                      };
                  }),
                  true
              );
          }
      },
      true
  );
})();
