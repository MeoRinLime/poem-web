import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/comment';

export async function postComment(data: any) {
  return axios.post(BASE_URL, data);
}