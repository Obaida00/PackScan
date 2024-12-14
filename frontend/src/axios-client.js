const axios = require("axios");

// const axiosClient = axios.create({
//   baseURL: "http://localhost:8000/api",
// });

export async function fetchAllInvoices(pageNumber = 1) {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/api/invoices?page=${pageNumber}`
    );
    return response.data;
  } catch (error) {
    throw error.data;
  }
}

export async function getBySearchStorageInvoices(storageCode, input) {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/api/invoices?st[eq]=${storageCode}&id[li]=${input}%`
    );
    return response.data;
  } catch (error) {
    throw error.data;
  }
}

export async function getInvoiceById(id) {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/api/invoices/${id}`
    );
    return response.data;
  } catch (error) {
    throw error.data;
  }
}

export async function submitInvoice(id) {
  try {
    await axios.post(`http://127.0.0.1:8000/api/invoices/${id}/done`);
  } catch (error) {
    throw error.data;
  }
}

export async function uploadNewInvoice(data) {
  try {
    await axios.post(`http://127.0.0.1:8000/api/invoices`, data, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    throw error.data;
  }
}
