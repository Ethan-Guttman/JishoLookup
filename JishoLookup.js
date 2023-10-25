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

/*
  Used to check whether a string contains any Japanese characters
*/
function containsJapanese(sequence) {
  //console.log('check for japanese');
  return sequence.match(/[\u3400-\u9FBF]/) != null;
}




// Create jisho lookup context menu
browser.contextMenus.create({
  id: "jisho-lookup",
  title: "Jisho Lookup",
  contexts: ["selection"]
}, onCreated);


// Code for when jisho lookup is clicked (currently just searches given text)
browser.contextMenus.onClicked.addListener((info, tab) => {
  // let hasJapanese = containsJapanese(info.selectionText);
  switch (info.menuItemId) {
    case "jisho-lookup":
        browser.tabs.create({url: `https://www.jisho.org/search/${info.selectionText}`})
        break;
  }
});

