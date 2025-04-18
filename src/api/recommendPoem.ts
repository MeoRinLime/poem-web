import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getDailyPoem = () => {
    return axios.get(`${BASE_URL}/api/poem/dailypoem`);
};

export const getRelatedPoem = () => {
    return axios.get(`${BASE_URL}/api/poem/relatedpoem`);
};