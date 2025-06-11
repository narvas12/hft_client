import axios from 'axios';

const API_URL = 'https://stag-frontend.arbigobot.com/api/crypto-prices';

export const fetchCryptoPrices = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    return [];
  }
};
