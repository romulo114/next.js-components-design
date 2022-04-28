import * as storage from '../../helpers/storage';
import { scanFile, scanLink } from '../../helpers/fsio';
import { FSIO_MENU_ID } from '../../helpers/constants';

chrome.runtime.onInstalled.addListener(function () {
  chrome.tabs.create({
    url: chrome.runtime.getURL('html/panel.html?tab=setting')
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

chrome.downloads.onChanged.addListener(async function (delta) {
  if (delta.state?.current === 'complete') {
    const results = await chrome.downloads.search({ id: delta.id });
    for (const file of results) {
      if (file.totalBytes === 0) continue;
      const url = 'file:///' + file.filename.replace(/\\/g, '/');
      getFileObjectFromURL(url, (file) => {
        scanFile(file);
      })
    }
  }
});

function getFileBlobUsingURL(url, convertBlob) {
  fetch(url).then(res => res.blob()).then(blob => convertBlob(blob));
}

var blobToFile = function (blob, name, type) {
  return new File([blob], name, { type });
};

function getFileObjectFromURL(filePathOrUrl, convertBlob) {
  const pos = filePathOrUrl.lastIndexOf('/');
  const name = filePathOrUrl.substring(pos + 1);
  getFileBlobUsingURL(filePathOrUrl, function (blob) {
    convertBlob(blobToFile(blob, name, blob.type));
  });
};
