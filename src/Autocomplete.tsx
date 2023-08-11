import { useCallback, useState } from "react";
import Highlightify from "./components/Highlightify/Highlightify";
import "./Autocomplete.scss";

export interface AutocompleteItem {
  id: string;
  displayText: string;
}

export interface AutoCompleteProps {
  items: Map<string, AutocompleteItem>;
  selectedItem: AutocompleteItem | undefined;
  onChange(value: string): void;
  onSelect(item: AutocompleteItem): void;
  placeholder?: string;
  busy?: boolean;
}

/**
 * TODO (enhancements):
 * - add rendering property to customize list options (add icons, images, etc...)
 * - implement multiselection, clear selection features
 * - handle click and key events to open, close popup, navigate through list options
 */
function Autocomplete({
  items,
  selectedItem,
  onChange,
  onSelect,
  placeholder,
  busy,
}: AutoCompleteProps) {
  const [searchText, setSearchText] = useState("");
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

  const handleKeyUp = useCallback((event: React.KeyboardEvent<HTMLLIElement>) => {
    switch (event.key) {
      case "Enter":
        selectItem(event as unknown as React.MouseEvent<HTMLLIElement>);
        return;
      // TODO: handle other cases
      default:
        return
    }
  }, [selectItem]);

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
              <li className="popup__text-item">Loading...</li>
            )}
            {!busy && !items.size && (
              <li className="popup__text-item">No results</li>
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

                <div className="popup__text-item">
                  <Highlightify fullText={item.displayText} highlightedText={searchText} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Autocomplete;
