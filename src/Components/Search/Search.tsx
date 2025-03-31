import React, { useCallback, useState } from 'react';
import debounce from 'lodash.debounce';

import { SlMagnifier } from 'react-icons/sl';
import { fetchPlace } from './fetchPlace';

interface SearchI {
  location: string;
  setLocation: React.Dispatch<React.SetStateAction<string>>;
  setCityName: React.Dispatch<React.SetStateAction<string>>;
  searchLocation: (
    e?: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>,
  ) => void;
  getCityCoords: (coords: number[]) => void;
}

const Search: React.FC<SearchI> = ({
  location,
  setLocation,
  setCityName,
  searchLocation,
  getCityCoords,
}) => {
  const [autocompleteCities, setAutocompleteCities] = useState<string[]>([]);
  const [requestData, setRequestData] = useState<{ place_name: string; center: number[] }[]>([]);

  const [autocompleteErr, setAutocompleteErr] = useState<string>('');

  // Get the name of a city from a user and then suggest a list of cities with the similar name
  const handleCityChange = async (searchValue: string) => {
    if (!searchValue) return;

    // Run the function with the input(city)
    const res = await fetchPlace(searchValue);

    // if we get the data from the axios response beyond
    // and there're object 'data' with another object 'features'
    // Make a new array with the list of cities
    if (res && 'data' in res && res.data.features) {
      setAutocompleteCities(
        res.data.features.map((place: { place_name: string }) => place.place_name),
      );

      // Set the data(cities,coordinates) to the useState(requestData)
      setRequestData(
        res.data.features.map((place: { place_name: string; center: number[] }) => ({
          place_name: place.place_name,
          center: place.center,
        })),
      );
      setAutocompleteErr('');
    } else {
      setAutocompleteErr((res as { error?: string }).error || 'An error occurred');
    }
  };

  // Delay the request to a server
  const updateSearchValue = useCallback(
    debounce((str) => {
      handleCityChange(str);
    }, 1000),
    [],
  );

  // Loop through an object with the list of cities to get the coordinates
  // and name of the particular place, which is chosen by the user(*Berlin,Prague,Paris)
  const searchCityObject = (
    nameKey: string,
    myArray: { place_name: string; center: number[] }[],
  ) => {
    return myArray.find((place) => place.place_name === nameKey) || null;
  };

  // Set location for the search bar
  // Pass the city name, so handleCityChange can start working
  // Find and return the object which contains the same name which the user select
  // setCityName because openweather API and mapbox API shows different names despite of the same location
  // get the coordinates and trigger the dependency array fetchData(urlCoords)(App.tsx)
  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
    updateSearchValue(e.target.value);

    const resultObject = searchCityObject(e.target.value, requestData);
    setCityName(resultObject?.place_name?.split(',')[0] ?? '');
    if (resultObject) {
      getCityCoords(resultObject.center);
    }
  };

  return (
    <div className="relative">
      <form>
        <label htmlFor="city" className="label">
          {autocompleteErr && <span className="inputError">{autocompleteErr}</span>}
        </label>
        <input
          list="places"
          id="city"
          name="city"
          onKeyDown={searchLocation}
          value={location}
          onChange={onChangeInput}
          type="text"
          className="w-full md:w-[400px] px-[2rem] py-[.5rem] bg-gray-50 dark:bg-transparent border border-gray-300 dark:border-[#453f3f]
      text-gray-900 dark:text-[#b3b3b3] text-[1rem] md:text-[1.2rem] rounded-full outline-none"
          placeholder="Enter your city..."
          pattern={autocompleteCities.join('|')}
          autoComplete="off"
        />
        <datalist id="places">
          {autocompleteCities.map((city, i) => (
            <option key={i} value={city}>
              {city}
            </option>
          ))}
        </datalist>
        <div className="group">
          <button
            onClick={searchLocation}
            className="absolute inset-y-0 right-0 pr-[1rem] pl-[.5rem] flex items-center cursor-pointer"
          >
            <SlMagnifier className="h-4 w-4 md:h-5 md:w-5 fill-(--yellow) dark:fill-(--dark-orange) transition duration-350 ease-in-out group-hover:fill-[#926704]" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Search;
