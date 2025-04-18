import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function postComment(data: any) {
  return axios.post(BASE_URL, data);
}