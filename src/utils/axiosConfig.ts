import axios from "axios";

const SQUARE_API_URL = process.env.NEXT_PUBLIC_APP_SQUARE_API_URL;
const SQUARE_ACCESS_TOKEN = process.env.NEXT_PUBLIC_APP_SQURAE_ACCESS_TOKEN_PROD;

const axiosInstance = axios.create({
  baseURL: SQUARE_API_URL,
  headers: {
    "Content-Type": "application/json",
    "Square-Version": "2023-10-18",
    Authorization: `Bearer ${SQUARE_ACCESS_TOKEN}`,
  },
});

const apiEndpoints = {
  searchCatalogItem: {
    url: "/v2/catalog/search-catalog-items",
    method: "POST",
  },
  categoryList: {
    url: "/v2/catalog/list",
    method: "GET",
  },
};

// Helper function to call APIs
export const callSquareAPI = async (key: keyof typeof apiEndpoints, data = {}) => {
  const endpoint = apiEndpoints[key];
  if (!endpoint) throw new Error("Invalid API endpoint key");

  if (endpoint.method === "POST") {
    return axiosInstance.post(endpoint.url, data);
  } else if (endpoint.method === "GET") {
    return axiosInstance.get(endpoint.url);
  }

  throw new Error("Unsupported HTTP method");
};

export default axiosInstance;
