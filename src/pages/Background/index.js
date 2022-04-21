import * as storage from '../../helpers/storage';
import { scanLink } from '../../helpers/fsio';
import { FSIO_MENU_ID } from '../../helpers/constants';

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    title: `Scan with FileScan.IO Client`,
    contexts: ['link'],
    id: FSIO_MENU_ID
  })

  chrome.tabs.create({
    url: chrome.runtime.getURL('panel.html?tab=setting')
  });
});

function scan_link(info, tab) {
  if (info.menuItemId !== FSIO_MENU_ID) {
    return;
  }

  scanLink(info.linkUrl)
}

chrome.contextMenus.onClicked.addListener(scan_link);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.cmd) {
    case 'get_base_url':
      storage.getBaseURL().then(value => {
        sendResponse(value)
      })
      break
    case 'get_api_key':
      storage.getApiKey().then(value => {
        sendResponse(value)
      })
      break
    case 'get_history':
      storage.getHistory().then(value => {
        sendResponse(value)
      })
      break
    default:
      sendResponse(null)
  }

  return true
});
