const { ipcMain } = require("electron");
const axios = require("axios");
const { error } = require("console");

// const axiosClient = axios.create({
//   baseURL: "http://localhost:8000/api",
// });

ipcMain.handle("fetch-orders", async (event, page = 1) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/api/invoices?page=${page}`
    );
    return response.data;
  } catch (error) {
    throw error.message;
  }
});

ipcMain.handle("fetch-storage-orders", async (event, storageCode, input) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/api/invoices?st[eq]=${storageCode}&id[li]=${input}%`
    );
    return response.data;
  } catch (error) {
    throw error.message;
  }
});

ipcMain.handle("fetch-order", async (event, id) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/api/invoices/${id}`
    );
    return response.data;
  } catch (error) {
    throw error.message;
  }
});

ipcMain.handle("submit-order", async (event, id) => {
  try {
    await axios.post(`http://127.0.0.1:8000/api/invoices/${id}/done`);
  } catch {
    throw error.message;
  }
});
