import React from 'react';
import './input.scss';

type InputProps = {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  className?: string;
}
export const Input = (props: InputProps) => {
  const { label, value, onChange, type, className } = props
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
      />
    </div>
  )
}
