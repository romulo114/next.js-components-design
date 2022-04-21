import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '../../../../components/base/button';
import { PRODUCT_NAME, DEFAULT_BASE_URL } from '../../settings';
import { getBaseURL, saveBaseURL } from '../../../../helpers/storage';
import { Modal } from '../../../../components/base/modal';
import { Clipboard } from '../../../../components/base/clipboard';
import logo from '../../../../assets/images/icon-32.png';
import './styles.scss';


export const Header = () => {

  const [window, setWindow] = useState<chrome.windows.Window | null>(null)
  const [baseUrl, setBaseUrl] = useState('')
  const [modal, setModal] = useState(false)
  const [apiKey, setApiKey] = useState('')

  useEffect(() => {
    async function init() {
      const base = await getBaseURL() || DEFAULT_BASE_URL
      await saveBaseURL(base)
      setBaseUrl(base)
    }

    init()
  }, [])

  const getApiKey = useCallback(async (token: string) => {
    const baseUrl = await getBaseURL()
    const url = `${baseUrl}/api/users/api-key/create`
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    })

    const body = await response.json()
    let api_key = ''
    if (response.status !== 200) {
      if (globalThis.confirm(`${body.detail}. Do you want to re-generate the API key?`)) {
        await fetch(`${baseUrl}/api/users/api-key/remove`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        })

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        })

        const body = await response.json()
        api_key = body.api_key
      }
    } else {
      api_key = body.api_key
    }

    if (api_key) {
      setApiKey(api_key)
      setModal(true)
    }
  }, [baseUrl])

  useEffect(() => {
    const removeListener = function (id: number) {
      if (id === window?.id) {
        setWindow(null)
      }
    }
    if (window?.id) {
      chrome.windows.onRemoved.addListener(removeListener)
    }

    return () => {
      chrome.windows.onRemoved.removeListener(removeListener)
    }
  }, [window])

  useEffect(() => {
    async function messageListener(msg: any, sender: chrome.runtime.MessageSender, response: any) {
      if (sender.tab?.windowId === window?.id && window?.id && msg.token) {
        window?.id && await chrome.windows.remove(window?.id)
        await getApiKey(msg.token)
      }
    }

    if (window?.id) {
      chrome.runtime.onMessage.addListener(messageListener)
    }

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener)
    }
  }, [window, getApiKey])

  const handleSignin = async () => {
    const baseUrl = await getBaseURL()
    if (window || !baseUrl) return;

    const popup = await chrome.windows.create({
      url: `${baseUrl}/auth/signin`,
      focused: true,
      type: 'popup',
      width: 800,
      height: 600
    })

    setWindow(popup)
  }

  return (
    <header>
      <section className="title">
        <img src={logo} className="logo" alt="logo" />
        <h4 className="content">{PRODUCT_NAME}</h4>
      </section>
      <section className="action">
        <Button onClick={handleSignin}>
          Sign In
        </Button>
      </section>
      {modal && (
        <Modal
          title="You've created an API key. Please copy and save it!"
          onHide={() => setModal(false)}
        >
          <div className='copy-box'>
            <Clipboard text={apiKey} />
          </div>
        </Modal>
      )}
    </header>
  )
}
