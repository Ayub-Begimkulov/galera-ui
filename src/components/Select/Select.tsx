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

/* enum Actions {
  INIT = 'INIT',
}

interface SearchExtensionProps<T extends ValueType> extends AnyObject {
  options: {
    key: T;
    value: T;
    title: string;
    getOptionProps(): {
      onClick: (event: React.MouseEvent) => void;
    };
  }[];
}

function searchExtension<T extends ValueType>({
  options,
  ...rest
}: SearchExtensionProps<T>) {
  // TODO think about clear search action
  const [search, setSearch] = useState('');

  const filteredOptions = useMemo(
    () => options.filter(option => includesString(option.title, search)),
    [options, search]
  );

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

  return {
    options: filteredOptions,
    getSearchProps,
    ...rest,
  };
} */

const includesString = (a: string, b: string) =>
  a.toLowerCase().includes(b.toLowerCase());

export function useSelect<T extends ValueType>(props: UseSelectOptions<T>) {
  const { value, initialValue, items, onChange = noop } = props;

  const uncontrolled = typeof value === 'undefined' || value === null;

  const getSelectedItem = (value?: T) =>
    value ? findBy(items, 'value', value) : undefined;

  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(() => getSelectedItem(initialValue));
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLElement | null>(null);

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

  const currentValue = useMemo(() => {
    if (uncontrolled) {
      return selected;
    }

    return getSelectedItem(value);
  }, [uncontrolled, selected, value]);

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

  const filteredOptions = useMemo(() => {
    if (search === '') return options;
    return options.filter(option => includesString(option.title, search));
  }, [options, search]);

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

  const result = {
    selectedItem: currentValue,
    options: filteredOptions,
    getSearchProps,
    getViewProps,
    popupVisible: dropdownVisible,
    dropdownVisible,
    getDropdownProps,
  };

  return result;
}
