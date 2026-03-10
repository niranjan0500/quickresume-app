import axios from "axios";

const API = axios.create({
  baseURL: "https://quickresume-backend-niranjan-dtfeebb8c0bba3cc.centralindia-01.azurewebsites.net/api"
});

export default API;