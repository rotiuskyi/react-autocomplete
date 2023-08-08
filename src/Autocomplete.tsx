import { useCallback, useState } from "react";
import "./Autocomplete.css";

export interface AutocompleteItem {
  id: string;
  displayText: string; // Add rendering function/component? (enhancement)
}

export interface AutoCompleteProps {
  items: Map<string, AutocompleteItem>;
  selectedItem: AutocompleteItem | undefined; // multiselection? (enhancement)
  onChange(value: string): void;
  onSelect(item: AutocompleteItem): void;
  placeholder?: string;
  busy?: boolean;
}

// TODO: add removing the selection 
function Autocomplete({
  items,
  selectedItem,
  onChange,
  onSelect,
  placeholder,
  busy,
}: AutoCompleteProps) {
  const [searchText, setSearchText] = useState(""); // TODO: add highlighting to matching items
  const [open, setOpen] = useState(false);
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchText(value);
    setOpen(true);
    onChange(value);
  }, []);

  const selectItem = useCallback((event: React.MouseEvent<HTMLLIElement>) => {
    const target = event.target as HTMLLIElement;
    const itemKey = target.getAttribute("item-key")!;
    const itemToSelect = items.get(itemKey)!;

    setSearchText(itemToSelect.displayText);
    setOpen(false);
    onSelect(itemToSelect);
  }, [items]);

  // TODO: handle other keys, e.g. arrow keys (to navigate), esc (to close), clicking outside the component (to close)
  const handleKeyUp = useCallback((event: React.KeyboardEvent<HTMLLIElement>) => {
    if (event.key !== "Enter") {
      return;
    }
    selectItem(event as unknown as React.MouseEvent<HTMLLIElement>);
  }, [selectItem]);

  // TODO: use classnames util instead
  const popupBodyCss = [
    "popup__body",
    open ? "popup__body--slide-down" : ""
  ].join(" ");

  return (
    <div className="autocomplete">
      <input
        className="autocomplete__search"
        type="search"
        value={searchText}
        onChange={handleChange}
        placeholder={placeholder}
        role="search"
        aria-autocomplete="list" />

      <div className="autocomplete__popup popup">
        <div className={popupBodyCss}>
          <ul role="listbox">
            {busy && (
              <li>Loading...</li>
            )}
            {!busy && !items.size && (
              <li>No results</li>
            )}
            {!busy && [...items.values()].map(item => (
              <li
                key={item.id}
                item-key={item.id}
                onClick={selectItem}
                onKeyUp={handleKeyUp}
                role="option"
                tabIndex={0}
                aria-selected={selectedItem?.id === item.id} >

                <div className="popup__textbox">{item.displayText}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Autocomplete;
