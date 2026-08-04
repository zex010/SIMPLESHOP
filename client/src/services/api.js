// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://192.168.1.6:5000/api",
// });

// export default api;

import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  `http://${window.location.hostname}:5000/api`;

const api = axios.create({
  baseURL: API_URL,
});

export default api;