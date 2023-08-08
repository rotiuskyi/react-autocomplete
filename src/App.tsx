import { useState } from "react";
import Autocomplete, { AutocompleteItem } from "./Autocomplete";
import "./App.css";

const autocompleteMock = {
  cities: [
    { id: "ln0", displayText: "London" },
    { id: "kv1", displayText: "Kyiv" },
    { id: "wa2", displayText: "Warsawa" },
    { id: "lv3", displayText: "Lviv" },
    { id: "va4", displayText: "Vinnytsia" }
  ]
};

function App() {
  const [city, setCity] = useState<AutocompleteItem>();

  return (
    <div className="app">
      <h3>Autocomplete Example:</h3>
      <Autocomplete items={autocompleteMock.cities} onSelect={setCity} />

      <h5>Selected City: {city?.displayText || "-"}</h5>
    </div>
  )
}

export default App
