import React from 'react';
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";

const LocationInput = ({ onSelectLocation }) => {
    const {
      ready,
      value,
      suggestions: { status, data },
      setValue,
      clearSuggestions,
    } = usePlacesAutocomplete({
      requestOptions: { types: ["(cities)"] },
      debounce: 300,
    });

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      const suburb = results[0].address_components.find(
        (component) => component.types.includes("locality")
      )?.long_name;

      onSelectLocation({ latitude: lat, longitude: lng, suburb });
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <div>
      <input
        value={value}
        onChange={handleInput}
        disabled={!ready}
        placeholder="Enter your location"
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      />
      {status === "OK" && (
        <ul className="mt-2 border border-gray-300 rounded-md">
          {data.map(({ place_id, description }) => (
            <li
              key={place_id}
              onClick={() => handleSelect(description)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationInput;