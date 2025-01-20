const axios = require("axios");
const log = require("electron-log");

log.transports.file.level = "info";
log.transports.file.file = __dirname + "/log/log";

const BASE_URL = process.env.API_BASE_URL || "http://127.0.0.1:8000";

// Fetch all invoices
export async function fetchAllInvoices(pageNumber = 1) {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/invoices?page=${pageNumber}`
    );
    log.info(
      "fetching invoices",
      "- status : " + response.status,
      "- data : " + JSON.stringify(response.data) // Pretty-printing the data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Get storage invoices
export async function getStorageInvoices(pageNumber, storageCode) {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/invoices?page=${pageNumber}&st[eq]=${storageCode}`
    );
    log.info(
      "get storage invoice",
      "- status : " + response.status,
      "- data : " + JSON.stringify(response.data) // Pretty-printing the data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Search storage invoices
export async function getBySearchStorageInvoices(storageCode, input) {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/invoices?st[eq]=${storageCode}&id[li]=${input}%`
    );
    log.info(
      "search storage invoices",
      "- status : " + response.status,
      "- data : " + JSON.stringify(response.data) // Pretty-printing the data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Get invoice by ID
export async function getInvoiceById(id) {
  try {
    const response = await axios.get(`${BASE_URL}/api/invoices/${id}`);
    log.info(
      "get invoice by id",
      "- status : " + response.status,
      "- data : " + JSON.stringify(response.data) // Pretty-printing the data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Submit an invoice
export async function submitInvoice(id) {
  try {
    const response = await axios.post(`${BASE_URL}/api/invoices/${id}/done`);
    log.info(
      "submit invoice",
      "- status : " + response.status,
      "- data : " + JSON.stringify(response.data) // Pretty-printing the data
    );
  } catch (error) {
    throw error;
  }
}

// Upload a new invoice
export async function uploadNewInvoice(data) {
  try {
    const response = await axios.post(`${BASE_URL}/api/invoices`, data, {
      headers: { "Content-Type": "application/json" },
    });
    log.info(
      "uploading invoice",
      "- status : " + response.status,
      "- data : " + JSON.stringify(response.data) // Pretty-printing the data
    );
  } catch (error) {
    throw error;
  }
}
