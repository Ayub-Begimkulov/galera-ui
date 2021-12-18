import React from 'react';
import { useSelect } from '../components/Select/Select';

const items = [
  {
    value: 5,
    title: 'asdf...',
  },
  {
    value: 6,
    title: 'hello world...',
  },
  {
    value: 7,
    title: 'how do you do?',
  },
];

export default {
  title: 'Example/Select',
  component: App,
};

function App() {
  const {
    selectedItem,
    options,
    getSearchProps,
    getViewProps,
    dropdownVisible,
    getDropdownProps,
  } = useSelect({
    items: items,
  });
  return (
    <div style={{ margin: 50 }}>
      <div {...getViewProps()}>{selectedItem?.title || 'Choose item'}</div>
      {dropdownVisible && (
        <div style={{ border: '1px solid black' }} {...getDropdownProps()}>
          <input {...getSearchProps()} />
          {options.map(option => (
            <div key={option.key} {...option.getOptionProps()}>
              {option.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const Default = App.bind({});
