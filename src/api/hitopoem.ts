import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getPoemRecommend = () => {
    return axios.get(`${BASE_URL}/api/poem/poemrecommend`);
};