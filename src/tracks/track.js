import React from 'react';

export default function Track({ name, selected, ...props }) {
  return (
    <li className={selected ? 'selected' : ''} {...props}>
      {name}
    </li>
  );
}
