export function notify(msg: string, duration: number = 5000) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: '/images/icon-48.png',
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
