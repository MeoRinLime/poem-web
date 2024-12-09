import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/poem';

export const getPoemRecommend = () => {
    return axios.get(`${BASE_URL}/poemrecommend`);
};