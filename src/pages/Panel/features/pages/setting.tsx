import React, { useEffect, useState } from 'react';
import { Button } from '../../../../components/base/button';
import { Divider } from '../../../../components/base/divider';
import { Input } from '../../../../components/base/input';
import { Check } from '../../../../components/base/check';
import { SecInput } from '../../components/input/sec-input';
import { Spinner } from '../../../../components/base/spinner';
import { getApiKey, getBaseURL, getMaxFileSize, getScanDownload, saveApiKey, saveBaseURL, saveMaxFileSize, saveScanDownload } from '../../../../helpers/storage';

export const Setting = () => {
  const [baseUrl, setBaseUrl] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [scanDownload, setScanDownload] = useState(false);
  const [maxSize, setMaxSize] = useState(0);
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState({ error: false, message: '' })

  useEffect(() => {
    async function init() {
      const key = await getApiKey();
      const url = await getBaseURL();
      const scan = await getScanDownload();
      const size = await getMaxFileSize();

      setApiKey(key ?? '');
      setBaseUrl(url ?? '');
      setScanDownload(scan ?? false);
      setMaxSize(size ?? 0);
    }

    init();
  }, [])

  const handleSave = async () => {
    try {
      setBusy(true)
      await saveApiKey(apiKey);
      await saveBaseURL(baseUrl);
      await saveScanDownload(scanDownload);
      await saveMaxFileSize(maxSize);
      setStatus({ error: false, message: 'Successfully saved' })
    } catch (e: any) {
      setStatus({ error: true, message: e.message })
    } finally {
      setBusy(false)
      setTimeout(() => setStatus({ error: false, message: '' }), 2000)
    }
  }

  const handleClear = async () => {
    try {
      setApiKey('')
      await saveApiKey('');
      setStatus({ error: false, message: 'API Key cleared' })
    } catch (e: any) {
      setStatus({ error: true, message: e.message })
    } finally {
      setTimeout(() => setStatus({ error: false, message: '' }), 2000)
    }
  }

  return (
    <div className='setting-page'>
      <section className='base-setting'>
        <Input value={baseUrl} onChange={setBaseUrl} label='Service URL' />
        <SecInput value={apiKey} onChange={setApiKey} label='API Key' note='Required only for private instances' />
        <Check value={scanDownload} onChange={setScanDownload} label='Scan Downloaded Files' />
        <Input value={maxSize} disabled={!scanDownload} onChange={(value) => setMaxSize(+value)} label='Max File Size' />
        <div className='actions'>
          <p className={status.error ? 'error' : 'success'}>
            {status.message}
          </p>
          <Button onClick={handleClear}>
            Clear API Key
          </Button>
          <Button onClick={handleSave}>
            Save
            {busy && <Spinner />}
          </Button>
        </div>
      </section>
      <Divider />
      <section className='contact'>
        <p className='text'>
          FileScanIO is a next-gen malware analysis platform with the following purpose:

          Providing rapid and in-depth threat analysis services capable of massive processing
          Focus on Indicator-of-Compromise (IOC) extraction and actionable context
        </p>
        <p>
          Do you want to scan files privately on your own instance? Please get in touch at our <a href='https://www.filescan.com/contact/sales' target='_blank' rel='noreferrer'>Sales</a> contact form to book a technical presentation or try out the free community webservice at <a href='https://www.filescan.io' target='_blank' rel='noreferrer'>www.filescan.io</a>
        </p>
      </section>
    </div>
  )
}
