const axios = require("axios");
const log = require("electron-log");

log.transports.file.level = "info";
log.transports.file.file = __dirname + "/log/log";

const BASE_URL = process.env.API_BASE_URL || "http://127.0.0.1:8000";

// Fetch all storages
export async function fetchStorages() {
  try {
    const response = await axios.get(`${BASE_URL}/api/storages`);
    log.info(
      "fetching storages",
      "- status : " + response.status,
      "- data : " + JSON.stringify(response.data)
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Fetch all invoices
export async function fetchInvoices(filters = {}) {
  try {
    let filteredFilters = {
      "id[li]": `${filters.invoiceId}%`,
      "st[eq]": filters.storage,
      "status[eq]": filters.status,
      "creation_date[eq]": filters.date,
      page: filters.pageNumber,
    };
    if (filters.isImportant !== undefined)
      filteredFilters["imp[eq]"] = filters.isImportant ? 1 : 0;
    if (filters.isMissing !== undefined)
      filteredFilters["missing[eq]"] = filters.isMissing ? 1 : 0;

    const params = new URLSearchParams(filteredFilters);
    const response = await axios.get(
      `${BASE_URL}/api/invoices?${params.toString()}`
    );
    log.info(
      "fetching invoices",
      "- status : " + response.status,
      "- url : " + `${BASE_URL}/api/invoices?${params.toString()}`,
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
export async function submitInvoice(
  id,
  packerId,
  numberOfPackages,
  manually
) {
  try {
    let data = JSON.stringify({
      packer_id: packerId,
      number_of_packages: numberOfPackages,
      mode: manually ? "M" : "A",
    });

    let header = {
      headers: { "Content-Type": "application/json" },
    };

    const response = await axios.post(
      `${BASE_URL}/api/invoices/${id}/done`,
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
