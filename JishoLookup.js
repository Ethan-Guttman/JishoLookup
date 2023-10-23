"use strict";


/*
  Called when the context menu has been created, or when creation 
  failed due to an error. We'll just log success/failure here.
*/
function onCreated() {
  if (browser.runtime.lastError) {
    console.log(`Error: ${browser.runtime.lastError}`);
  } else {
    console.log("Item created successfully");
  }
}



// Create jisho lookup context menu
browser.contextMenus.create({
  id: "jisho-lookup",
  title: "Jisho Lookup",
  contexts: ["selection"]
}, onCreated);


// Code for when jisho lookup is clicked (currently just searches given text)
browser.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case "jisho-lookup":
        browser.windows.create({url: `https://www.jisho.org/search/${info.selectionText}`})
        break;
    // …
}
});

