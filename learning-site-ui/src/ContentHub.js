import axios from 'axios';

export async function findPost() {
  const response = await axios.post('/posts/query');
  return response.data[0];
}
