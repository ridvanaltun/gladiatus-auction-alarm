// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function() {
   // Replace all rules ...
   chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
     // With a new rule ...
     chrome.declarativeContent.onPageChanged.addRules([
       {
         // That fires when a page's URL contains a 'g' ...
         conditions: [
           new chrome.declarativeContent.PageStateMatcher({ // for normal auction page
             //pageUrl: { urlContains: 'g' },
             pageUrl: { urlContains: 'gladiatus.gameforge.com/game/index.php?mod=auction&sh=' },
           }),
           new chrome.declarativeContent.PageStateMatcher({ // for mersener auction page
             //pageUrl: { urlContains: 'g' },
             pageUrl: { urlContains: 'gladiatus.gameforge.com/game/index.php?mod=auction&ttype=3&sh=' },
           }),
           new chrome.declarativeContent.PageStateMatcher({ // for messages page
             //pageUrl: { urlContains: 'g' },
             pageUrl: { urlContains: 'gladiatus.gameforge.com/game/index.php?mod=messages&submod=messageShow&folder' },
           })
          ],
         // And shows the extension's page action.
         actions: [ new chrome.declarativeContent.ShowPageAction() ]
       }
     ]);
   });
 });

chrome.tabs.onUpdated.addListener(function(id, info, tab){
    
    if(tab.url.indexOf("gladiatus.gameforge.com/game/index.php?mod=messages&submod=messageShow&folder") != -1){
       //chrome.tabs.executeScript(tab.id, {"file": "scripts/auction_failure.js"});
       console.log("injected");
    }
});

var lastTabId = 0;
var tab_clicks = {};

/*
chrome.tabs.onSelectionChanged.addListener(function(tabId) {
  lastTabId = tabId;
  chrome.pageAction.show(lastTabId);
});*/

/*
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  lastTabId = tabs[0].id;
  chrome.pageAction.show(lastTabId);
});*/

// Called when the user clicks on the page action.
chrome.pageAction.onClicked.addListener(function(tab) {
  var clicks = tab_clicks[tab.id] || 0;
  chrome.pageAction.setIcon({path: "icon" + (clicks + 1) + ".png",
                             tabId: tab.id});
  if (clicks % 2) {
    chrome.pageAction.show(tab.id);
  } else {
    chrome.pageAction.hide(tab.id);
    setTimeout(function() { chrome.pageAction.show(tab.id); }, 200);
  }
  chrome.pageAction.setTitle({title: "click:" + clicks, tabId: tab.id});

  // We only have 2 icons, but cycle through 3 icons to test the
  // out-of-bounds index bug.
  clicks++;
  if (clicks > 1)
    clicks = 0;
  tab_clicks[tab.id] = clicks;
});

/*
chrome.tabs.onUpdated.addListener(function(id, info, tab){
    if (tab.status !== "complete"){
        return;
    }
    if(tab.url.indexOf("gladiatus.gameforge.com/game/index.php?mod=auction&sh=") != -1){
       //chrome.tabs.executeScript(tab.id, {"file": "scripts/auction_normal_alarm.js"});
       console.log("injected");
    }
});*/

