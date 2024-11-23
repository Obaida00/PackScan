const axios = require("axios");
const { error } = require("console");

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
    throw error.message;
  }
}

export async function getBySearchStorageInvoices(storageCode, input) {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/api/invoices?st[eq]=${storageCode}&id[li]=${input}%`
    );
    return response.data;
  } catch (error) {
    throw error.message;
  }
}

export async function getInvoiceById(id) {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/api/invoices/${id}`
    );
    return response.data;
  } catch (error) {
    throw error.message;
  }
}

export async function submitInvoice(id){
  try {
    await axios.post(`http://127.0.0.1:8000/api/invoices/${id}/done`);
  } catch {
    throw error.message;
  }
}

export async function uploadNewInvoice(data){
  console.log("uploading new invoice");
  
  try {
    await axios.post(`http://127.0.0.1:8000/api/invoices`, data);
  } catch (error) {
    throw error.message;
  }
}