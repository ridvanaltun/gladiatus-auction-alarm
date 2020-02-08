const ENUMS = {
	'PASSIVE': 1,
	'ACTIVE': 2,
};

const auctionUrl = 'gladiatus.gameforge.com/game/index.php?mod=auction&sh=';
const mersenerAuctionUrl = 'gladiatus.gameforge.com/game/index.php?mod=auction&ttype=3&sh=';

let tabStatus = {};

const isExtActive = tabId => tabStatus[tabId] !== ENUMS.PASSIVE;

const isAunctionTab = url => url.indexOf(auctionUrl) !== -1;

const isMersenerAunctionTab = url => url.indexOf(mersenerAuctionUrl) !== -1;

// allowed urls to interact the extension
const declarePageContent = () => {
		 chrome.declarativeContent.onPageChanged.addRules([
			 {
				 conditions: [
						new chrome.declarativeContent.PageStateMatcher({ // for normal auction page
							pageUrl: { urlContains: 'gladiatus.gameforge.com/game/index.php?mod=auction&sh=' },
						}),
						new chrome.declarativeContent.PageStateMatcher({ // for mersener auction page
							pageUrl: { urlContains: 'gladiatus.gameforge.com/game/index.php?mod=auction&ttype=3&sh=' },
						})
					],
				 // And shows the extension's page action.
				 actions: [ new chrome.declarativeContent.ShowPageAction() ]
			 }
		 ]);
};

// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(() => {
	// Replace all rules ...
	chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
		// With a new rule ...
		declarePageContent();
	});
});

const injectAuctionFile = tabId => {
	chrome.tabs.executeScript(tabId, {"file": "scripts/auction_alarm.js"});
};

const handleExt = (tabId, status, inject = false) => {
	if (status === ENUMS.PASSIVE) {
		chrome.pageAction.show(tabId);
		chrome.pageAction.setTitle({title: "PASSIVE", tabId: tabId});
		chrome.pageAction.setIcon({
			path: "passive.png",
			tabId: tabId,
		});
	} else {
		chrome.pageAction.hide(tabId);
		chrome.pageAction.setTitle({title: "ACTIVE", tabId: tabId});
		chrome.pageAction.setIcon({
			path: "active.png",
			tabId: tabId,
		});
		if (inject) injectAuctionFile(tabId);
	}
};

const toggleExtStatus = tab => {
	var status = tabStatus[tab.id] || ENUMS.ACTIVE;

	if (status === ENUMS.PASSIVE) status = ENUMS.ACTIVE;
	else status = ENUMS.PASSIVE;

	handleExt(tab.id, status, true);

	tabStatus[tab.id] = status;
};

const isTabCorrect = url => {
	return isAunctionTab(url) || isMersenerAunctionTab(url);
};

// call when ext on clicked
chrome.pageAction.onClicked.addListener(tab => {
	// toogle extention status
	if (isTabCorrect(tab.url)) {
		toggleExtStatus(tab);
	}
});

// call when any page on completed
chrome.webNavigation.onCompleted.addListener((details) => {
	const {tabId, url} = details;

	if (isExtActive(tabId)) {
		handleExt(tabId, ENUMS.ACTIVE);
	} else {
		handleExt(tabId, ENUMS.PASSIVE);
	}

	if (isTabCorrect(url) && isExtActive(tabId)) {
		injectAuctionFile(tabId);
	} else {
		handleExt(tabId, ENUMS.PASSIVE);
	}
});

chrome.management.get(chrome.runtime.id, details => {
	if (details.installType === 'development') {
		// refresh mechanism for development
		chrome.commands.onCommand.addListener((shortcut) => {
			// press ctrl + m to refresh extention
			console.log('lets reload');
			console.log(shortcut);
			if(shortcut.includes("+M")) {
				chrome.runtime.reload();
			}
		});
	}
});
