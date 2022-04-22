import React, { useEffect, useState } from 'react';
import { Status } from '../../../components/status';
import { command } from '../../../helpers/command';
import './styles.scss';

export const History = () => {
  const [items, setItems] = useState([]);
  const [pending, setPending] = useState([])

  useEffect(() => {
    function listener(message, sender) {
      if (!sender.url?.endsWith('background.js')) return
      if (message.type !== 'scanning') return

      if (message.finished) {
        command('get_history').then(result => {
          setPending([])
          result.sort((a, b) => a.created > b.created ? -1 : a.created < b.created ? 1 : 0)
          setItems(result)
        })
      } else {
        setPending(message.scans)
      }
    }

    async function init() {
      const history = await command('get_history')
      history.sort((a, b) => a.created > b.created ? -1 : a.created < b.created ? 1 : 0)
      setItems(history)

      chrome.runtime.onMessage.addListener(listener)
    }

    init()
    return () => {
      chrome.runtime.onMessage.removeListener(listener)
    }
  }, [])

  const all = [...pending, ...items]
  const top3 = all.slice(0, Math.min(3, all.length))
  return (
    <main>
      {!top3.length && (
        <section className='history-item empty'>
          <p>No scanned files so far.</p>
          <p>Scan files using the context menu.</p>
        </section>
      )}
      {!top3.length || top3.map((item, idx) => (
        <section className='history-item' key={idx}>
          <a href={item.link} target='_blank' rel='noreferrer' className='link'>
            {item.name}
          </a>
          <Status status={item.status} />
        </section>
      ))}
    </main>
  )
}
