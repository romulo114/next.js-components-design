import React from 'react';
import { IconComponent, DoneIcon, CloseIcon } from './icons';
import { Spinner } from './base/spinner';
import { isFinished, isSucceed } from '../helpers/fsio';
import './status.scss';

interface StatusProps {
  status: string;
}
export const Status = ({ status = '' }: StatusProps) => {
  return isFinished(status) ? (
    <IconComponent className={'status ' + (isSucceed(status) ? 'success' : 'fail')}>
      {isSucceed(status) ? <DoneIcon /> : <CloseIcon />}
    </IconComponent>
  ) : (
    <Spinner />
  )
}
