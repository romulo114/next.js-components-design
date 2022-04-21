import React, { useEffect, useState } from 'react'
import { HistoryTable } from '../../components/table/history-table';
import { SearchBar } from '../../../../components/base/search-bar';
import { Button } from '../../../../components/base/button';
import { ScanInfo } from '../../../../types';
import { saveHistory } from '../../../../helpers/storage';
import { command } from '../../../../helpers/command';


export const History = () => {

  const [items, setItems] = useState<ScanInfo[]>([])
  const [pending, setPending] = useState<ScanInfo[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    function listener(message: any, sender: chrome.runtime.MessageSender) {
      if (!sender.url?.endsWith('background.js')) return
      if (message.type !== 'scanning') return

      if (message.finished) {
        command('get_history').then(result => {
          setPending([])
          setItems(result as ScanInfo[])
        })
      } else {
        setPending(message.scans)
      }
    }

    async function init() {
      const history: ScanInfo[] = await command('get_history') as ScanInfo[]
      history.sort((a, b) => a.created > b.created ? -1 : a.created < b.created ? 1 : 0)
      setItems(history)

      chrome.runtime.onMessage.addListener(listener)
    }

    init()
    return () => {
      chrome.runtime.onMessage.removeListener(listener)
    }
  }, [])

  const filtered = [...items, ...pending].filter(item => {
    return (
      item.name.includes(search) ||
      item.hash.includes(search) ||
      item.verdict.includes(search)
    )
  })

  const onSearch = (value: string) => {
    setSearch(value)
  }

  const onSelect = (idx: number) => {
    window.open(items[idx].link, '_target')
  }

  const onClear = async () => {
    await saveHistory([])
    setItems([])
    setPending([])
  }

  return (
    <>
      <section className='search-container'>
        <SearchBar onSearch={onSearch} className='search' placeholder='Search history' />
      </section>
      <section className='status-container'>
        <span className='status'>{items.length} file{items.length > 1 ? 's' : ''} scanned</span>
        <Button onClick={onClear} isOutlined variant='danger'>
          Clear Scan History
        </Button>
      </section>
      <section className='table-container'>
        <HistoryTable data={filtered} onSelect={onSelect} />
      </section>
    </>
  )
}
