'use strict';

(async () => {

  const src = chrome.runtime.getURL('scripts/css-selector-generator.js');
  
  const contentScript = await import(src);
  
  
  const logSelector = (additionalInfo) =>
      console.log(
        [
            CssSelectorGenerator.getCssSelector(
                event.target,
                {"blacklist": ['*ontenteditable*']}
            ),
            additionalInfo,
            document.location.host.concat(document.location.pathname, document.location.search)
        ]
        //CssSelectorGenerator.getCssSelector(event.target)
      );

  document.addEventListener(
      "click",
      function(event) {
          if (event.ctrlKey) {
              
              const clicked = event.target;
  
              clicked.contentEditable = true;
              
              clicked.focus();
              
              event.target.addEventListener(
                  "focusout",
                  ((event) => {
                      event.target.contentEditable = false;

                      logSelector("set to false");
                  }),
                  true
              );
  
              event.target.addEventListener(
                  "keydown",
                  ((event) => {
                      //console.log(event.key, event.target);
  
                      if (event.key == "Escape") {
                          event.target.contentEditable = false;

                          logSelector("set to false");
                      };
                  }),
                  true
              );
          }
      },
      true
  );
})();
