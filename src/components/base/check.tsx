import React from 'react';
import './check.scss';

export type CheckProps = {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  className?: string;
  disabled?: boolean;
  note?: string;
}
export const Check = (props: CheckProps) => {
  const { label, value, onChange, note, className, disabled } = props
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked)
  }

  return (
    <div className={'base-check ' + (className ?? '')}>
      <span className='label'>{label}</span>
      <div className='check-box'>
        <input
          type='checkbox'
          className='input'
          checked={value}
          onChange={handleChange}
          disabled={disabled}
        />
      </div>
      {note && <span className='note'>{note}</span>}
    </div>
  )
}
