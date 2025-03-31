import * as React from "react";
import { useState, useEffect } from "react";
import { Select, DatePicker, Checkbox } from "antd";
import SearchBox from "../../../shared/components/SearchBox.jsx";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

const { Option } = Select;

const statusOptions = [
  { label: "status", value: "" },
  { label: "Pending", value: "Pending" },
  { label: "InProgress", value: "InProgress" },
  { label: "Done", value: "Done" },
  { label: "Sent", value: "Sent" },
];

function IndexInvoiceFilters({ onChange }) {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    invoiceId: "",
    storageId: "",
    status: "",
    date: "",
    isImportant: false,
    isMissing: false,
  });

  const [storageList, setStorageList] = useState([]);

  const storageOptions = [
    {value: "", label: "storage",},
    ...storageList.map((storage) => ({
      label: storage.name,
      value: storage.id,
    })),
  ];

  const handleFilterChange = (name, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const updateFilterValue = (name, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  useEffect(() => {
    const loadStorages = async () => {
      try {
        const response = await ipcRenderer.invoke("fetch-storages");
        setStorageList(response.data);
      } catch (error) {
        console.error("Error fetching storages:", error);
      }
    };

    loadStorages();
  }, []);

  useEffect(() => {
    onChange(cleanFilters(filters));
  }, [filters]);

  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <div style={{ marginRight: 16 }}>
        <SearchBox
          action={(v) => updateFilterValue("invoiceId", v)}
          eraseOnPaste={false}
        />
      </div>

      <Checkbox
        checked={filters.isMissing}
        onChange={(e) => updateFilterValue("isMissing", e.target.checked)}
      >
        Missing
      </Checkbox>

      <Checkbox
        checked={filters.isImportant}
        onChange={(e) => updateFilterValue("isImportant", e.target.checked)}
      >
        Important
      </Checkbox>

      <Select
        style={{ width: 130 }}
        defaultValue={filters.storageId}
        onChange={(value) => handleFilterChange("storageId", value)}
        placeholder="Storage"
        options={storageOptions}
      >
      </Select>

      <Select
        defaultValue={filters.status}
        style={{ width: 130 }}
        onChange={(value) => handleFilterChange("status", value)}
        placeholder="Status"
        options={statusOptions}
      >
        
      </Select>

      <DatePicker
        style={{ width: 130 }}
        value={filters.date ? dayjs(filters.date) : null}
        onChange={(date, dateString) => {
          handleFilterChange("date", dateString);
        }}
        format="YYYY-MM-DD"
        allowClear
      />
    </div>
  );
}

const cleanFilters = (filters) => {
  const cleaned = { ...filters };
  if (!cleaned.isImportant) {
    delete cleaned.isImportant;
  }
  if (!cleaned.isMissing) {
    delete cleaned.isMissing;
  }
  return cleaned;
};

export default IndexInvoiceFilters;
