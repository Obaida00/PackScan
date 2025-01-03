const axios = require("axios");

// const axiosClient = axios.create({
//   baseURL: "http://localhost:8000/api",
// });

export async function fetchAllInvoices(pageNumber = 1) {
  const response = await axios
    .get(`http://127.0.0.1:8000/api/invoices?page=${pageNumber}`)
    .catch((error) => {
      throw error;
    });
  return response.data;
}

export async function getStorageInvoices(pageNumber, storageCode) {
  const response = await axios
    .get(
      `http://127.0.0.1:8000/api/invoices?page=${pageNumber}&st[eq]=${storageCode}`
    )
    .catch((error) => {
      throw error;
    });
  return response.data;
}

export async function getBySearchStorageInvoices(storageCode, input) {
  const response = await axios
    .get(
      `http://127.0.0.1:8000/api/invoices?st[eq]=${storageCode}&id[li]=${input}%`
    )
    .catch((error) => {
      throw error;
    });
  return response.data;
}

export async function getInvoiceById(id) {
  const response = await axios
    .get(`http://127.0.0.1:8000/api/invoices/${id}`)
    .catch((error) => {
      throw error;
    });
  return response.data;
}

export async function submitInvoice(id) {
  await axios
    .post(`http://127.0.0.1:8000/api/invoices/${id}/done`)
    .catch((error) => {
      throw error;
    });
}

export async function uploadNewInvoice(data) {
  await axios
    .post(`http://127.0.0.1:8000/api/invoices`, data, {
      headers: { "Content-Type": "application/json" },
    })
    .catch((error) => {
      throw error;
    });
}
