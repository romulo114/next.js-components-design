import React from 'react'
import './spinner.scss'

export const Spinner = ({ className }: { className?: string }) =>
  <div className={'loader' + (className ? ` ${className}` : '')} />
