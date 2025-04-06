import FormData from "form-data";

const axios = require("axios");
const log = require("electron-log");
const fs = require("fs");
const path = require("path");

log.transports.file.level = "info";
log.transports.file.file = __dirname + "/log/log";

const BASE_URL = process.env.API_BASE_URL || "http://127.0.0.1:8000";

// Fetch all storages
export async function fetchStorages() {
  try {
    const response = await axios
      .get(`${BASE_URL}/api/storages`)
      .catch((e) => log.error(e));
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

// Fetch storage by id
export async function fetchStorageById(id) {
  try {
    const response = await axios
      .get(`${BASE_URL}/api/storages/${id}`)
      .catch((e) => log.error(e));
    log.info(
      `fetching storage ${id}`,
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
      "st[eq]": filters.storageId,
      "status[eq]": filters.status,
      "creation_date[eq]": filters.date,
      page: filters.pageNumber,
    };
    if (filters.isImportant !== undefined)
      filteredFilters["imp[eq]"] = filters.isImportant ? 1 : 0;
    if (filters.isMissing !== undefined)
      filteredFilters["missing[eq]"] = filters.isMissing ? 1 : 0;

    const params = new URLSearchParams(filteredFilters);
    const response = await axios
      .get(`${BASE_URL}/api/invoices?${params.toString()}`)
      .catch((e) => log.error(e));
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
    const response = await axios
      .get(`${BASE_URL}/api/invoices/${id}`)
      .catch((e) => log.error(e));
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
export async function submitInvoice(id, packerId, numberOfPackages, manually) {
  try {
    let data = JSON.stringify({
      packer_id: packerId,
      number_of_packages: numberOfPackages,
      mode: manually ? "M" : "A",
    });

    let header = {
      headers: {
        "Content-Type": "application/json",
        Accepts: "application/json",
      },
    };

    const response = await axios
      .post(`${BASE_URL}/api/invoices/${id}/done`, data, header)
      .catch((e) => log.error(e));

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

// Unmark invoice important flag
export async function unmarkInvoiceAsImportant(id) {
  try {
    let header = {
      headers: {
        "Content-Type": "application/json",
        Accepts: "application/json",
      },
    };

    const response = await axios
      .post(`${BASE_URL}/api/invoices/${id}/unmark-important`, null, header)
      .catch((e) => log.error(e));

    log.info(
      "unmark invoice important flag",
      "- status : " + response.status,
      "- data : " + JSON.stringify(response.data)
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Mark invoice as pending
export async function markInvoiceAsPending(id) {
  try {
    let header = {
      headers: {
        "Content-Type": "application/json",
        Accepts: "application/json",
      },
    };

    const response = await axios
      .post(`${BASE_URL}/api/invoices/${id}/mark-pending`, null, header)
      .catch((e) => log.error(e));

    log.info(
      "unmark invoice important flag",
      "- status : " + response.status,
      "- data : " + JSON.stringify(response.data)
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Mark invoice as in-progress
export async function markInvoiceAsImportant(id, packerId) {
  try {
    let data = JSON.stringify({
      packer_id: packerId,
    });

    let header = {
      headers: {
        "Content-Type": "application/json",
        Accepts: "application/json",
      },
    };

    const response = await axios
      .post(`${BASE_URL}/api/invoices/${id}/mark-in-progress`, data, header)
      .catch((e) => log.error(e));

    log.info(
      "unmark invoice important flag",
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
    const response = await axios
      .get(`${BASE_URL}/api/packers/${packerId}`)
      .catch((e) => log.error(e));
    log.info(
      "fetching packer details",
      "- status : " + response.status,
      "- data : " + JSON.stringify(response.data)
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}

// Upload a new invoice file
export async function uploadNewFile(filePath, setProgress) {
  try {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));
    const headers = { ...formData.getHeaders(), Accepts: "application/json" };

    const response = await axios
      .post(`${BASE_URL}/api/invoices/upload`, formData, {
        headers: headers,
        timeout: 30000,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              progressEvent.loaded / progressEvent.total
            );
            if (setProgress && typeof setProgress === "function") {
              setProgress(progress);
            }
            log.info(`Upload progress: ${progress * 100}%`);
          }
        },
      })
      .catch((e) => log.error(e));

    if (setProgress && typeof setProgress === "function") {
      setProgress(0);
    }

    log.info(
      "uploading invoice",
      "- status : " + response.status,
      "- data : " + JSON.stringify(response.data)
    );

    return response.data;
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      throw new Error("Upload timed out");
    }
    log.error("File upload failed:", error);
    throw error;
  }
}

export async function downloadInvoiceReceipt(invoiceId, setProgress) {
  try {
    const response = await axios
      .get(`${BASE_URL}/api/invoices/${invoiceId}/receipt`, {
        responseType: "arraybuffer",
        onDownloadProgress: (progressEvent) => {
          if (setProgress && typeof setProgress === "function") {
            setProgress(1);
          }
          log.info(`Downloaded: ${progressEvent.loaded} bytes`);
        },
      })
      .catch((e) => log.error(e));

    log.info("downloading invoice receipt", "- status : " + response.status);

    const filePath = getInvoicePdfFilePath(invoiceId);
    await fs.promises.writeFile(filePath, Buffer.from(response.data));

    if (setProgress && typeof setProgress === "function") {
      setProgress(0);
    }

    log.info(`Receipt saved to: ${filePath}`);
    return filePath;
  } catch (error) {
    log.error("File download failed:", error);
    throw error;
  }
}

export async function downloadInvoiceSticker(invoiceId, setProgress) {
  try {
    const response = await axios
      .get(`${BASE_URL}/api/invoices/${invoiceId}/sticker`, {
        responseType: "arraybuffer",
        onDownloadProgress: (progressEvent) => {
          if (setProgress && typeof setProgress === "function") {
            setProgress(1);
          }
          log.info(`Downloaded: ${progressEvent.loaded} bytes`);
        },
      })
      .catch((e) => log.error(e));

    log.info("downloading invoice sticker", "- status : " + response.status);

    const filePath = getInvoicePdfFilePath("R-" + invoiceId);
    await fs.promises.writeFile(filePath, Buffer.from(response.data));

    setProgress(0);

    log.info(`Sticker saved to: ${filePath}`);
    return filePath;
  } catch (error) {
    log.error("File download failed:", error);
    throw error;
  }
}

function getInvoicePdfFilePath(invoiceId) {
  let dirName = "./temp";
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName);
  }
  dirName = path.resolve(dirName);
  const filePath = path.join(dirName, `invoice-${invoiceId}.pdf`);
  return filePath;
}
