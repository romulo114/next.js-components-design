import React from 'react';
import { ScanInfo } from '../../../../types';
import { formatTime } from '../../../../helpers/time';
import { Status } from '../../../../components/status';
import { Verdict, VerdictProps } from '../../../../components/verdict';
import './history-table.scss';

interface HistoryTableProps {
  data: ScanInfo[];
  onSelect: (idx: number) => void;
}
export const HistoryTable = (props: HistoryTableProps) => {
  const { data, onSelect } = props;
  return (
    <table className='history-table'>
      <thead>
        <tr className='table-header'>
          <th className='header__item'>Name</th>
          <th className='header__item'>Created</th>
          <th className='header__item'>Result</th>
          <th className='header__item'>Status</th>
        </tr>
      </thead>
      <tbody>
        {data?.map((info, idx) => (
          <tr className='history-item' key={idx} onClick={() => onSelect(idx)}>
            <td className='item__name'>
              <span className='name'>{info.name}</span>
              <span className='hash'>{info.hash}</span>
            </td>
            <td className='item__time'>
              {formatTime(info.created)}
            </td>
            <td className='item__result'>
              <Verdict value={info.verdict as VerdictProps['value']} />
            </td>
            <td className='item__status'>
              <Status status={info.status} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
