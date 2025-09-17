// content.js
function getSelectionText() {
    return window.getSelection().toString();
  }
  
  browser.runtime.onMessage.addListener((msg, sender) => {
    if (msg.type === "GET_SELECTION") {
      return Promise.resolve(getSelectionText());
    }
  });
  