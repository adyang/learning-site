import axios from 'axios';

export async function findAllPosts() {
  const response = await axios.post('/posts/query');
  return response.data;
}
