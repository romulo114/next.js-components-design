export async function command(cmd: string) {
  return new Promise(resolve => {
    chrome.runtime.sendMessage({ cmd }, (response) => {
      resolve(response)
    })
  })
}
