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
