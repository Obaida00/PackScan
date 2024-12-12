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
  console.log("uploading new invoice");
  console.log("data before upload ", data);
  //{headers: {'content-type': 'application/x-www-form-urlencoded}}
  await axios
    .post(`http://127.0.0.1:8000/api/invoices`, data, {
      headers: { "Content-Type": "application/json" },
    })
    .then((response) => {
      console.log("RRResponse");
      console.log(response);
    })
    .catch((error) => {
      console.log("req err");
      throw error;
    });
}
