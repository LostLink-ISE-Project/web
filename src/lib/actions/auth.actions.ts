import axios from "axios";

const base = `${process.env.VITE_API_URL}/auth`;

export async function getCurrentUserSSR() {
  const res = await axios.get(`${base}/me`, { withCredentials: true });
  return res.data.data;
}
