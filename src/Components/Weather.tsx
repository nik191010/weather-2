import React from 'react';
import { MdCo2 } from 'react-icons/md';
import { WiBarometer } from 'react-icons/wi';
import { WiHumidity } from 'react-icons/wi';
import { GiWindsock } from 'react-icons/gi';
import Icons from '../utils/icons';

interface WeatherComponent {
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
  airQualityIndex?: number;
  convert: boolean;
  convertKey: number;
  handleChange: () => void;
}

const Weather: React.FC<WeatherComponent> = ({
  main,
  weather,
  wind,
  convert,
  convertKey,
  airQualityIndex,
  handleChange,
}) => {
  return (
    <>
      <div className="flex flex-col items-center w-full gap-[1.4rem] md:gap-[1.8rem]">
        <div className="flex flex-col items-center gap-[1rem]">
          <div key={Icons(weather[0].id)} className="weather__thumb fade-in pl-[2rem]">
            <i className={`${Icons(weather[0].id)} weather__pic text-[3rem] sm:text-[4rem]`} />
          </div>
          <h2
            key={convertKey}
            className="relative font-bold text-[4rem] sm:text-[4rem] md:text-[6rem] animate-[fadeIn_0.5s_ease-in-out]"
          >
            {convert ? main.temp.toFixed() : ((main.temp * 9) / 5 + 32).toFixed()}
            <span
              onClick={handleChange}
              className="absolute top-[0] right-[-30px] md:right-[-40px] text-[1.5rem] md:text-[2rem] text-(--yellow) hover:text-white dark:text-(--dark-orange) cursor-pointer
    transition duration-300 ease-in-out"
            >
              {convert ? '℃' : '℉'}
            </span>
          </h2>
        </div>

        <div className="bg-(--yellow) dark:bg-[rgb(25,39,52)] w-full max-w-[340px] sm:max-w-[440px]  flex justify-between gap-[.5rem] font-bold  px-[1rem] py-[.7rem] rounded-[11px]">
          <div className="w-[25%] flex flex-col gap-[.2rem] items-center justify-center">
            <div className="w-[40px] h-[40px] md:w-[45px] md:h-[45px] ">
              <WiBarometer className="fill-[#fff] dark:fill-(--dark-orange) w-full h-auto" />
            </div>
            <div
              key={convertKey}
              className="flex flex-col items-center gap-[.2rem] animate-[fadeIn_0.5s_ease-in-out]"
            >
              <p className="text-[1.2rem] sm:text-[1.5rem] md:text-[1.8rem]">
                {convert ? main.pressure : (main.pressure / 100).toFixed(0)}
              </p>
              <p>{convert ? 'kPa' : 'bar'}</p>
            </div>
          </div>
          <div className="w-[25%] flex flex-col gap-[.2rem] items-center justify-center">
            <div className="w-[40px] h-[40px] md:w-[45px] md:h-[45px] ">
              <WiHumidity className="fill-[#fff] dark:fill-(--dark-orange) w-full h-auto" />
            </div>
            <div className="flex flex-col items-center gap-[.2rem]">
              <p className="uppercase font-extrabold text-[1.2rem] sm:text-[1.5rem] md:text-[1.8rem]">
                {main.humidity}
              </p>
              <p>%</p>
            </div>
          </div>
          <div className="w-[25%] flex flex-col gap-[.2rem] items-center justify-center">
            <div className="w-[40px] h-[40px] md:w-[45px] md:h-[45px] ">
              <GiWindsock className="fill-[#fff] dark:fill-(--dark-orange) w-full h-auto" />
            </div>
            <div
              key={convertKey}
              className="flex flex-col items-center gap-[.2rem] animate-[fadeIn_0.5s_ease-in-out]"
            >
              <p className="uppercase font-extrabold text-[1.2rem] sm:text-[1.5rem] md:text-[1.8rem]">
                {convert ? wind.speed.toFixed(0) : (wind.speed * 2.237).toFixed(0)}
              </p>
              <p>{convert ? 'mPs' : 'mPh'}</p>
            </div>
          </div>
          <div className="w-[25%] flex flex-col gap-[.2rem] items-center justify-center">
            <div className="w-[40px] h-[40px] md:w-[45px] md:h-[45px] ">
              <MdCo2 className="fill-[#fff] dark:fill-(--dark-orange) w-full h-auto" />
            </div>
            <div className="flex flex-col items-center gap-[.2rem]">
              <p className="uppercase font-extrabold text-[1.2rem] sm:text-[1.5rem] md:text-[1.8rem]">
                {airQualityIndex}
              </p>
              <p>pm</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Weather;
