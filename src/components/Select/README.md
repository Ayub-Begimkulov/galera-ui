# Select

Usage:

```tsx
const Select = () => {
  const props = useSelect({
    initialValue: someState,
    // sync
    items: [{ name: 'asdf', value: 'asdf', disabled: false }],
    // async
    items: (query?: string) => fetchAsyncItems(query),
  });

  const renderOptions = () => {
    if (props.options.loading) {
      return <div>Loading...</div>;
    }

    if (props.options.error) {
      return <div>Error...</div>;
    }

    if (props.options.searchQuery && props.options.length === 0) {
      return (
        <div>
          <button>Add new element</button>
        </div>
      );
    }

    return props.options.map(option => (
      <div {...option.getOptionProps()}>{option.title}</div>
    ));
  };

  return (
    <div>
      <input {...props.getInputProps()} />

      <div {...props.getDropdownProps()}>
        <input {...props.getSearchProps()} />

        {renderOptions()}
      </div>
    </div>
  );
};
```

Possible use cases:

- Select with sync data loading
- Select with async data loading (i.e Suggest)
- Select with search
  - Search Bar in dropdown
  - Search Bar in view
  - Loading/Error states
- Select with ability to add new item

It would be great to try to create all this functionality through extensions.

Very similar to what react-table did, it will allow any user who understands the mechanism of the hook to modify the behavior to suit his particular needs.
