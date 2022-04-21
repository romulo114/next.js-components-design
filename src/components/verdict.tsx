import React from 'react';

const verdict_colors = {
  'malicious': 'rgb(200, 35, 0)',
  'likely_malicious': 'rgb(200, 70, 10)',
  'suspicious': 'rgb(215, 140, 0)',
  'informational': 'rgb(100, 150, 0)',
  'benign': 'rgb(0, 180, 255)',
  'unknown': 'rgb(83, 87, 91)'
};

export interface VerdictProps {
  value: keyof typeof verdict_colors;
}
export const Verdict = ({ value }: VerdictProps) => {
  return (
    <div
      style={{
        backgroundColor: verdict_colors[value],
        color: 'white',
        fontSize: 14,
        padding: '4px 8px',
        borderRadius: 8
      }}
    >
      {value}
    </div>
  )
}
