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
      "- data : " + JSON.stringify(response.data)
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Get storage invoices
export async function getStorageInvoices(pageNumber, storageCode, isImportant) {
  try {
    let url = `${BASE_URL}/api/invoices?page=${pageNumber}&st[eq]=${storageCode}`;
    if(isImportant) url += "&imp[eq]=1";

    const response = await axios.get(url);

    log.info(
      "get storage invoice",
      "- status : " + response.status,
      "- data : " + JSON.stringify(response.data)
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
      "- data : " + JSON.stringify(response.data)
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
      "- data : " + JSON.stringify(response.data)
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Submit an invoice
export async function submitInvoice(invoiceId, packerId, numberOfPackages) {
  try {
    let data = JSON.stringify({
      packer_id: packerId,
      number_of_packages: numberOfPackages,
    });

    let header = {
      headers: { "Content-Type": "application/json" },
    };

    const response = await axios.post(
      `${BASE_URL}/api/invoices/${invoiceId}/done`,
      data,
      header
    );
    log.info(
      "submit invoice",
      "- status : " + response.status,
      "- data : " + JSON.stringify(response.data)
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getPackerById(packerId) {
  try {
    console.log(packerId);

    if (packerId == null || packerId == "" || packerId == undefined) return;
    const response = await axios.get(`${BASE_URL}/api/packers/${packerId}`);
    log.info("fetching packer details", "- status : " + response.status);
    console.log(response.data);

    return response.data;
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
      "- data : " + JSON.stringify(response.data)
    );
  } catch (error) {
    throw error;
  }
}
