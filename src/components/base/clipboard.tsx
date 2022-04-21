import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './clipboard.scss';

interface ICopyToClipboardProps {
  text: string;
}
export const Clipboard = (props: ICopyToClipboardProps) => {
  const { text } = props
  const [down, setDown] = useState(false)

  return (
    <CopyToClipboard text={text}>
      <div className='clipboard-content'>
        <p className='text'>{text}</p>
        <div
          className={'copy-btn' + (down ? ' clicked' : '')}
          onMouseDown={() => setDown(true)}
          onMouseUp={() => setDown(false)}
          onMouseLeave={() => setDown(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
            />
          </svg>
        </div>
      </div>
    </CopyToClipboard>
  )
}
