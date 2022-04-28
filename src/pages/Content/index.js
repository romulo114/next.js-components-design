import { DEFAULT_BASE_URL, TOKEN_KEY, SIGNIN_URL } from '../../helpers/constants';
import { command } from '../../helpers/command';

function clearToken() {
  if (localStorage.getItem(TOKEN_KEY)) {
    localStorage.removeItem(TOKEN_KEY)
    setTimeout(() => window.location.pathname = SIGNIN_URL, 1000)
  }
}

async function waitForToken() {
  return new Promise(function (resolve) {
    const id = setInterval(() => {
      const token = localStorage.getItem(TOKEN_KEY)
      if (token) {
        clearInterval(id)
        resolve(token)
      }
    }, 1000)
  })
}

async function main() {
  const setting = await command('get_base_url')
  const origin = setting ?? DEFAULT_BASE_URL
  console.log(setting, origin, window.location.origin)
  if (!origin.startsWith(window.location.origin)) {
    return
  }

  if (window.location.pathname === '/auth/signin') {
    clearToken()
  }
  const token = await waitForToken()
  chrome.runtime.sendMessage({ token })
}

main().catch(e => console.log(e))
