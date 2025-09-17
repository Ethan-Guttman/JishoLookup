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
  Covers hiragana, katakana, kanji, and other Japanese-specific ranges
*/
function containsJapanese(sequence) {
  // Unicode ranges for Japanese:
  // \u3040-\u309F: Hiragana
  // \u30A0-\u30FF: Katakana  
  // \u4E00-\u9FAF: CJK Unified Ideographs (most common kanji)
  // \u3400-\u4DBF: CJK Extension A
  // \uF900-\uFAFF: CJK Compatibility Ideographs
  // \uFF65-\uFF9F: Halfwidth katakana
  return sequence.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF\uF900-\uFAFF\uFF65-\uFF9F]/) != null;
}





// Create jisho lookup context menu
browser.contextMenus.create({
  id: "jisho-lookup",
  title: "Jisho Lookup",
  contexts: ["selection"]
}, onCreated);


console.log("Context menu created");

// Handle context menu visibility based on selected text
browser.contextMenus.onShown.addListener(async (info, tab) => {

  let highlighted = "";
  try {
    highlighted = await browser.tabs.sendMessage(tab.id, { type: "GET_SELECTION" });
  } catch (e) {
    console.warn("Could not retrieve selection:", e);
  }
  
  const selectedText = highlighted || info.selectionText || "";
  const hasJapanese = containsJapanese(selectedText);
  
  // Show or hide the menu item based on whether Japanese text is selected
  browser.contextMenus.update("jisho-lookup", {
    visible: hasJapanese
  }).then(() => {
    browser.contextMenus.refresh();
  }).catch((error) => {
    console.log("Error updating context menu:", error);
  });
});


// Code for when jisho lookup is clicked (currently just searches given text)
browser.contextMenus.onClicked.addListener(async (info, tab) => {
  switch (info.menuItemId) {
    case "jisho-lookup":
      let selectedText = "";
      try {
        selectedText = await browser.tabs.sendMessage(tab.id, { type: "GET_SELECTION" });
      } catch (e) {
        console.warn("Could not retrieve selection, using fallback:", e);
        selectedText = info.selectionText || "";
      }
      
      if (selectedText && containsJapanese(selectedText)) {
        const url = `https://www.jisho.org/search/${encodeURIComponent(selectedText)}`;
        browser.tabs.create({url: url, index: tab.index + 1});
      }
      break;
  }
});

