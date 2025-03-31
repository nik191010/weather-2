import axios from 'axios';

export const fetchPlace = async (text: string) => {
  try {
    const res = await axios(
      `${import.meta.env.VITE_API_CITY_URL}/${text}.json?access_token=${
        import.meta.env.VITE_API_CITY_KEY
      }&cachebuster=1625641871908&autocomplete=true&types=place`,
    );

    return res;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Unable to retrieve places:', error.message);
      return { error: error.message };
    }
  }
};
