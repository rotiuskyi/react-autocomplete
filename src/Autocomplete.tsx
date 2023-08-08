import { useCallback, useState } from "react";
import "./Autocomplete.css";

export interface AutocompleteItem {
  id: string;
  displayText: string;
}

export interface AutoCompleteProps {
  items: AutocompleteItem[];
  onSelect(item: AutocompleteItem): void;
  placeholder?: string;
}

function Autocomplete({ items, onSelect, placeholder }: AutoCompleteProps) {
  const [searchText, setSearchText] = useState("");
  const [filteredItems, setFilteredItems] = useState(
    new Map(items.map(item => [item.id, item]))
  );
  const [open, setOpen] = useState(false);

  const filterItems = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setSearchText(value);
    setFilteredItems(new Map(items
      .filter(item => item.displayText.toLocaleLowerCase().startsWith(value.toLocaleLowerCase()))
      .map((item => [item.id, item]))
    ));
    setOpen(true);
  }, [items]);


  const selectItem = useCallback((event: React.MouseEvent<HTMLLIElement>) => {
    const target = event.target as HTMLLIElement;
    const itemKey = target.getAttribute("item-key")!;

    const itemToSelect = filteredItems.get(itemKey)!;
    setSearchText(itemToSelect.displayText);
    setOpen(false);

    onSelect(itemToSelect);
  }, [filteredItems]);

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
        onChange={filterItems}
        placeholder={placeholder} />

      <div className="autocomplete__popup popup">
        <div className={popupBodyCss}>
          <ul>
            {!filteredItems.size && (
              <li>No results</li>
            )}
            {[...filteredItems.values()].map(item => (
              <li key={item.id} item-key={item.id} onClick={selectItem}>
                <div className="popup__item">{item.displayText}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Autocomplete;
