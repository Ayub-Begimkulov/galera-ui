import React, { useMemo, useRef, useState } from 'react';
import { useEventListener } from '../../hooks';
import { noop, findBy } from '../../utils';

type ValueType = number | string | boolean;

interface SelectItem<T extends ValueType> {
  value: T;
  title: string;
}

interface UseSelectOptions<T extends ValueType> {
  // TODO add async extension
  items: SelectItem<T>[] /* | ((query?: string) => SelectItem<T>[]) */;
  initialValue?: T;
  value?: T;
  onChange?: (newValue: T) => void;
  // useful for the object values
  // compareValue?: (a: T, b: T) => boolean;
}

const includesString = (a: string, b: string) =>
  a.toLowerCase().includes(b.toLowerCase());

export function useSelect<T extends ValueType>(props: UseSelectOptions<T>) {
  const { value, initialValue, items, onChange = noop } = props;

  const [search, setSearch] = useState('');

  const uncontrolled = typeof value === 'undefined' || value === null;

  const getSelectedItem = (value?: T) =>
    value ? findBy(items, 'value', value) : undefined;

  const [selected, setSelected] = useState(() => getSelectedItem(initialValue));

  const currentValue = useMemo(() => {
    if (uncontrolled) {
      return selected;
    }

    return getSelectedItem(value);
  }, [uncontrolled, selected, value]);

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLElement | null>(null);

  const options = useMemo(
    () =>
      items.map(item => {
        return {
          key: item.value,
          value: item.value,
          title: item.title,
          getOptionProps() {
            return {
              onClick: (event: React.MouseEvent) => {
                event.stopPropagation();

                onChange(item.value);
                setSelected(item);
                setDropdownVisible(false);
                setSearch('');
              },
            };
          },
        };
      }),
    [items, onChange]
  );

  const filteredOptions = useMemo(
    () => options.filter(option => includesString(option.title, search)),
    [options, search]
  );

  useEventListener({
    type: 'click',
    listener: e => {
      if (!dropdownRef.current) return;
      const target = e.target as Node;

      if (!dropdownRef.current.contains(target)) {
        setDropdownVisible(false);
        setSearch('');
      }
    },
    element: document,
  });

  function getSearchProps() {
    return {
      value: search,
      onChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => {
        setSearch(event.target.value);
      },
    };
  }

  function getViewProps() {
    return {
      onClick: (event: React.MouseEvent) => {
        event.stopPropagation();

        setDropdownVisible(v => !v);
      },
    };
  }

  function getDropdownProps<T extends HTMLElement>() {
    return {
      ref: dropdownRef as React.MutableRefObject<T | null>,
    };
  }

  const propsGetter = {
    selectedItem: currentValue,
    options: filteredOptions,
    getSearchProps,
    getViewProps,
    popupVisible: dropdownVisible,
    dropdownVisible,
    getDropdownProps,
  };

  return propsGetter;
}
