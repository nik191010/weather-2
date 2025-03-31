import icons from '../assets/iconsList.json';

type WeatherIcons = {
  [key: string]: { label: string; icon: string };
};

const Icons = (iconId: number = 200) => {
  const prefix = 'wi wi-';

  // Cast the number key to a string before indexing
  const iconKey = String(iconId);

  let icon = (icons as WeatherIcons)[iconKey] ? (icons as WeatherIcons)[iconKey].icon : 'storm';

  // If we are not in the ranges mentioned above, add a day/night prefix.
  if (!(iconId > 699 && iconId < 800) && !(iconId > 899 && iconId < 1000)) {
    icon = 'day-' + icon;
  }

  return prefix + icon;
};

export default Icons;
