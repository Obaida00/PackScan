import * as React from "react";
import { useState, useEffect } from "react";
import { TextField, MenuItem, FormControlLabel, Checkbox } from "@mui/material";
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
    isImportant: false,
    isMissing: false,
  });

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
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
      width: "130px",
    },
    "& .MuiInputBase-adornedEnd.MuiInputBase-colorPrimary.MuiInputBase-formControl.MuiInputBase-root.MuiInputBase-sizeSmall.MuiOutlinedInput-root.css-jupps9-MuiInputBase-root-MuiOutlinedInput-root":
      {
        width: "180px",
      },
  };

  return (
    <div className="flex flex-nowrap gap-2 justify-between items-center">
      <SearchBox
        action={(v) => updateFilterValue("invoiceId", v)}
        eraseOnPaste={false}
      />
      <div className="flex flex-wrap gap-1 items-center">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <FormControlLabel
            label="Missing"
            sx={{ color: "#f0f0f0" }}
            control={
              <Checkbox
                name="isMissing"
                checked={filters.isMissing}
                size="small"
                onChange={(e) =>
                  updateFilterValue("isMissing", e.target.checked)
                }
                sx={{
                  color: "#f0f0f0",
                  "&.Mui-checked": {
                    color: "#f0f0f0",
                  },
                }}
              />
            }
          />
          <FormControlLabel
            label="Important"
            sx={{ color: "#f0f0f0" }}
            control={
              <Checkbox
                name="isImportant"
                checked={filters.isImportant}
                size="small"
                onChange={(e) =>
                  updateFilterValue("isImportant", e.target.checked)
                }
                sx={{
                  color: "#f0f0f0",
                  "&.Mui-checked": {
                    color: "#f0f0f0",
                  },
                }}
              />
            }
          />
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
              <MenuItem key={option.value} value={option.value}>
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
            sx={{ ...whiteStyles }}
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
