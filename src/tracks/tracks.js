import React from 'react';

export default function Tracks({ children, count = 0, ...props }) {
  return (
    <React.Fragment>
      <ul {...props} className="tracks">
        {children}
      </ul>
      <div className="total">{count} files</div>
    </React.Fragment>
  );
}
