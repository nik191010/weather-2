import React, { useEffect, useState } from 'react';
import { MyContext } from './MyContext';
import axios from 'axios';
import './scss/libs/weather-icons.scss';

import { ImLocation } from 'react-icons/im';
import { IoIosRadio } from 'react-icons/io';
import { IoMoonSharp, IoSunny } from 'react-icons/io5';

import Layout from './Components/Layout';
import Search from './Components/Search/Search';
import Weather from './Components/Weather';

interface CurrentWeatherI {
  name: string;
  main: {
    temp: number;
    pressure: number;
    humidity: number;
  };
  weather: [
    {
      id: number;
      description: string;
    },
  ];
  wind: {
    speed: number;
  };
  sys?: { country: string };
  airQualityIndex?: number;
}

const App: React.FC = () => {
  const [data, setData] = useState<CurrentWeatherI | null>(null);
  const [location, setLocation] = useState<string>('');
  const [cityName, setCityName] = useState<string>('');
  const [lat, setLat] = React.useState<number>(0);
  const [long, setLong] = React.useState<number>(0);
  const [errorCheck, setErrorCheck] = useState<string>('');
  const [convert, setConvert] = useState<boolean>(true);
  const [cityChangeKey, setCityChangeKey] = useState<number>(0);
  const [convertKey, setConvertKey] = useState<number>(0);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Different urls for differrent cases(getting users IP,
  // looking for a city by the name or by the coordinates)
  const urlIp = `${import.meta.env.VITE_API_IP_URL}/json?token=${import.meta.env.VITE_API_IP_KEY}`;
  const urlCity = `${
    import.meta.env.VITE_API_WEATHER_URL
  }/weather?q=${location}&units=metric&appid=${import.meta.env.VITE_API_WEATHER_KEY}`;
  const urlCoords = `${
    import.meta.env.VITE_API_WEATHER_URL
  }/weather?lat=${lat}&lon=${long}&units=metric&appid=${import.meta.env.VITE_API_WEATHER_KEY}`;

  // Get the location of the user by getting their IP
  // and then set the coordinates
  React.useEffect(() => {
    const getIp = async () => {
      let locationInfo;
      try {
        const response = await axios(urlIp);
        const data = await response.data;
        locationInfo = data.loc;
      } catch (error) {
        alert('Failed to get latitude/longitude');
        console.error(error);
      }
      const splitLocationData = locationInfo.split(',');
      setLat(splitLocationData[0]);
      setLong(splitLocationData[1]);
    };
    getIp();
  }, []);

  // Get the data from an "openweather" server using the url and the coordinates
  const fetchData = async (url: string) => {
    try {
      // Fetch weather and AQI data
      const weatherResponse = await axios.get(url);
      const weatherData = weatherResponse.data;

      // Get coordinates for AQI API
      const { lat, lon } = weatherData.coord;
      const urlAirPollutionByCity = `${
        import.meta.env.VITE_API_WEATHER_URL
      }/air_pollution?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_API_WEATHER_KEY}`;
      // Get the data about AirQualityIndex
      const airPollutionResponse = await axios.get(urlAirPollutionByCity);

      // Set weather data
      setData({
        ...weatherData,
        airQualityIndex: airPollutionResponse.data.list[0].main.aqi,
      });
      // Trigger the animation(fadeIn) by changing the key
      setCityChangeKey((prevKey) => prevKey + 1);
    } catch (error) {
      alert('Failed to load resource');
      console.error(error);
      setErrorCheck(error instanceof Error ? error.message : String(error));
    }
    setLocation('');
  };

  // Run the function when the latitude or the longitude changes
  useEffect(() => {
    fetchData(urlCoords);
  }, [lat, long]);

  // Get the data when a user uses the search field and presses the "Enter" button
  // or just the search button(the magnifier icon in the search bar)
  const searchLocation = (
    e?: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (e && 'key' in e && e.key !== 'Enter') return; // Ensures it only runs on "Enter" key if triggered by a keyboard event

    if (!location.trim()) return; // Prevents empty searches

    e?.preventDefault();
    fetchData(urlCity);
    setLocation('');
  };

  // Get the coordinates of a city when the input is changed
  const getCityCoords = (coords: number[]) => {
    setLat(coords[1]);
    setLong(coords[0]);
  };

  // Convert the data to Celsius of Fahrenheit
  // Initialize the animation when we try to convert the values to the imperial units
  const handleChange = () => {
    setConvert(!convert);
    setConvertKey((prevKey) => prevKey + 1);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Tailwind.css dark mode, set the dark to the <html> tag
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Detects users' browser theme the first time the app loads
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Function to update dark mode
    const handleThemeChange = (e: MediaQueryListEvent) => {
      setDarkMode(e.matches);
    };

    // Add a listener to update styles
    mediaQuery.addEventListener('change', handleThemeChange);

    // Setup dark/light mode for the first time
    setDarkMode(mediaQuery.matches);

    // Removes listener
    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, []);

  // Reload the page after 2 seconds if there's an error
  useEffect(() => {
    if (errorCheck) {
      const timer = setTimeout(() => {
        window.location.reload();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [errorCheck]);

  // Check if there's an error
  if (errorCheck) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen">
        <h2 className="text-[3rem]">Some error occurred...</h2>
      </div>
    );
  }

  return (
    <MyContext.Provider value={{ darkMode }}>
      <Layout>
        {!data ? (
          <div className="w-full min-h-screen flex items-center justify-center">
            <div className="w-[200px] h-[200px]">
              {<IoIosRadio className="animate-ping w-[200px] h-[200px] fill-(--yellow)" />}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-[4rem] md:gap-[6rem]  pt-[3rem] pb-[2.5rem] sm:pb-[4rem] md:pb-[6rem]">
            <div className="flex flex-col gap-[2rem]">
              <div className="flex flex-col items-center gap-[.8rem]">
                <div>
                  <button
                    className=" pl-[1rem] 
                      flex items-center 
                      pointer-events-none"
                  >
                    <ImLocation
                      className="h-6 w-6 md:h-8 md:w-8 transition duration-350 
                      ease-in-out fill-(--yellow) dark:fill-(--dark-orange)"
                    />
                  </button>
                </div>
                <h1
                  key={cityChangeKey}
                  className="text-[1.8rem] sm:text-[2rem] md:text-[3rem] 
                  font-bold animate-[fadeIn_0.5s_ease-in-out]"
                >
                  {cityName === '' ? data.name : cityName}, {data.sys?.country}
                </h1>
              </div>
              <Search
                location={location}
                setCityName={setCityName}
                setLocation={setLocation}
                searchLocation={searchLocation}
                getCityCoords={getCityCoords}
              />
            </div>
            <Weather
              {...data}
              convert={convert}
              convertKey={convertKey}
              handleChange={handleChange}
            />
            {darkMode ? (
              <div onClick={toggleDarkMode} className="absolute top-[20px] right-[20px]">
                <IoMoonSharp className="w-[25px] md:w-[30px] h-auto transition duration-500 ease-in-out fill-(--dark-orange) hover:fill-(--yellow) cursor-pointer" />
              </div>
            ) : (
              <div onClick={toggleDarkMode} className="absolute top-[20px] right-[20px]">
                <IoSunny className="fill-(--yellow) w-[25px] md:w-[30px] h-auto transition duration-500 ease-in-out hover:fill-[#ffd679] cursor-pointer" />
              </div>
            )}
          </div>
        )}
      </Layout>
    </MyContext.Provider>
  );
};

export default App;
