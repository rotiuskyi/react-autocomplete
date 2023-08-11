import { useCallback, useState } from "react";
import Autocomplete, { AutocompleteItem } from "./Autocomplete";
import debounce from "./util/debounce";
import citiesMock from "./assets/mock.json";
import "./App.css";

const fakeSearchTimeout = 750;
const searchCitiesDebounceTimeout = 375;

function searchCitiesFakeAPI(query: string) {
  return new Promise<AutocompleteItem[]>(resolve => {
    setTimeout(() => {
      resolve(citiesMock.cities.filter(city =>
        city.displayText.toLowerCase().startsWith(query.toLowerCase())
      ))
    }, fakeSearchTimeout);
  });
}

function App() {
  const [cities, setCities] = useState<Map<string, AutocompleteItem>>(new Map());
  const [city, setCity] = useState<AutocompleteItem>();
  const [fetchingCities, setFetchingCities] = useState(false);

  const searchCities = useCallback(debounce(searchCitiesDebounceTimeout, (query: string) => {
    setFetchingCities(true);
    searchCitiesFakeAPI(query)
      .then(cities => new Map(cities.map(city => [city.id, city])))
      .then(setCities)
      .finally(() => {
        setFetchingCities(false);
      });
  }), []);

  return (
    <div className="app">
      <h3>Autocomplete Example</h3>

      <label>
        Search City (async)
        <Autocomplete
          items={cities}
          selectedItem={city}
          onChange={searchCities}
          onSelect={setCity}
          placeholder="Type 'l' to search"
          busy={fetchingCities} />
      </label>
      <h5>Selected City: {city?.displayText || "-"}</h5>
    </div>
  )
}

export default App;
