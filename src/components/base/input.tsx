import React from 'react';
import './input.scss';

export type InputProps = {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  className?: string;
  disabled?: boolean
}
export const Input = (props: InputProps) => {
  const { label, value, onChange, type, className, disabled } = props
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className={'base-input ' + (className ?? '')}>
      <span className='label'>{label}</span>
      <input
        type={type ?? 'text'}
        className='input'
        value={value}
        onChange={handleChange}
        disabled={disabled}
      />
    </div>
  )
}
