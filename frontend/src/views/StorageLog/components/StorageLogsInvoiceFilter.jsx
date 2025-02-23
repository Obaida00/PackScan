import * as React from "react";
import { useState, useEffect } from "react";
import { TextField, MenuItem } from "@mui/material";
import SearchBox from "../../../shared/components/SearchBox.jsx";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import dayjs from "dayjs";

const statusOptions = [
  { label: "-", value: "" },
  { label: "Pending", value: "Pending" },
  { label: "InProgress", value: "InProgress" },
  { label: "Done", value: "Done" },
  { label: "Sent", value: "Sent" },
];

function StorageLogsInvoiceFilter({ onChange }) {
  const [filters, setFilters] = useState({
    invoiceId: "",
    status: "",
    date: "",
  });

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const setInvoiceId = (value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      invoiceId: value,
    }));
  };

  useEffect(() => {
    onChange(filters);
  }, [filters, onChange]);

  const whiteStyles = {
    "& .MuiOutlinedInput-root": {
      "& fieldset, &:hover fieldset, &.Mui-focused fieldset": {
        borderColor: "#f0f0f0",
      },
    },
    "& .MuiInputLabel-root, & .MuiInputBase-input, & .MuiSelect-icon, & .MuiFormHelperText-root, & .Mui-focused":
      {
        color: "#f0f0f0 !important",
      },
    "& .MuiInputBase-root": {
      height: "40px",
      width: "150px",
    },
    "& .MuiInputBase-adornedEnd.MuiInputBase-colorPrimary.MuiInputBase-formControl.MuiInputBase-root.MuiInputBase-sizeSmall.MuiOutlinedInput-root.css-jupps9-MuiInputBase-root-MuiOutlinedInput-root": {
      width: "180px"
    }
  };

  return (
    <div className="flex flex-nowrap gap-2 justify-between items-center">
      <SearchBox action={setInvoiceId} eraseOnPaste={false} />
      <div className="flex gap-4 items-center">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TextField
            select
            label="Status"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            size="small"
            sx={{ ...whiteStyles }}
          >
            {statusOptions.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
              >
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <DesktopDatePicker
            label="Creation Date"
            value={filters.date ? dayjs(filters.date) : null}
            onChange={(newValue) => {
              setFilters((prev) => ({
                ...prev,
                date: newValue ? newValue.format("YYYY-MM-DD") : "",
              }));
            }}
            sx={{ ...whiteStyles}}
            slotProps={{
              textField: {
                variant: "outlined",
                size: "small",
              },
              actionBar: {
                actions: ["clear"],
              },
              openPickerButton: {
                sx: {
                  color: "white",
                },
              },
            }}
          />
        </LocalizationProvider>
      </div>
    </div>
  );
}

export default StorageLogsInvoiceFilter;
