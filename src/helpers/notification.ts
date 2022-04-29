export function notify(msg: string, duration: number, icon: string = '/images/icon-48.png') {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: icon,
    title: 'FileScan.IO for chrome',
    message: msg,
    isClickable: true,
    priority: 2
  }, (id) => {
    if (duration) {
      setTimeout(() => {
        chrome.notifications.clear(id)
      }, duration);
    }
  })
}
