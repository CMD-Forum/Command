import * as React from 'react';

const SelectContext = React.createContext({});

if (process.env.NODE_ENV !== 'production') {
  SelectContext.displayName = 'SelectContext';
}

export default SelectContext;