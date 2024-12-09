import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/poem';

export const getDailyPoem = () => {
    return axios.get(`${BASE_URL}/dailypoem`);
};

export const getRelatedPoem = () => {
    return axios.get(`${BASE_URL}/relatedpoem`);
};