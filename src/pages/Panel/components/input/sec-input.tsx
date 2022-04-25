import React from 'react';
import { Input, InputProps } from '../../../../components/base/input';
import './sec-input.scss';

interface SecInputProps extends InputProps {
  length?: number;
}
export const SecInput = (props: SecInputProps) => {
  const { length = 8, ...others } = props
  const value = `${props.value}`;
  const valueToShow = value.length > length ? '... ' + value.substring(value.length - length) : value

  console.log(value, valueToShow);
  return value ? (
    <Input {...others} value={valueToShow} disabled />
  ) : (
    <Input {...others} />
  )
}
