import * as React from "react";
import { useState, useEffect } from "react";
import { TextField, MenuItem, FormControlLabel } from "@mui/material";
import SearchBox from "../../../shared/components/SearchBox.jsx";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import dayjs from "dayjs";
import { Select, Checkbox, DatePicker } from "antd";
import { useTranslation } from "react-i18next";
import { t } from "i18next";

function StorageLogsInvoiceFilter({ onChange }) {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    invoiceId: "",
    status: "",
    date: "",
    isImportant: false,
    isMissing: false,
  });

  const statusOptions = [
    { label: t("invoice.status.-"), value: "" },
    { label: t("invoice.status.Pending"), value: "Pending" },
    { label: t("invoice.status.InProgress"), value: "InProgress" },
    { label: t("invoice.status.Done"), value: "Done" },
    { label: t("invoice.status.Sent"), value: "Sent" },
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
    const filterObj = { ...filters };
    if (filterObj.isImportant === false) {
      delete filterObj.isImportant;
    }
    if (filterObj.isMissing === false) {
      delete filterObj.isMissing;
    }
    onChange(filterObj);
  }, [filters]);

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
        <Checkbox
          checked={filters.isMissing}
          onChange={(e) => updateFilterValue("isMissing", e.target.checked)}
        >
          {t("invoice.missing")}
        </Checkbox>

        <Checkbox
          checked={filters.isImportant}
          onChange={(e) => updateFilterValue("isImportant", e.target.checked)}
        >
          {t("invoice.important")}
        </Checkbox>

        <Select
          defaultValue={filters.status}
          style={{ width: 130 }}
          onChange={(value) => handleFilterChange("status", value)}
          placeholder={t("-")}
          options={statusOptions}
        ></Select>

        <DatePicker
          style={{ width: 130 }}
          value={filters.date ? dayjs(filters.date) : null}
          onChange={(date, dateString) => {
            handleFilterChange("date", dateString);
          }}
          format="YYYY-MM-DD"
          allowClear
        />
        {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
          <FormControlLabel
            label={t("invoice.missing")}
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
            label={t("invoice.important")}
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
            label={t("invoice.status.title")}
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            size="small"
            sx={{ ...whiteStyles }}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {t("invoice.status." + option.label)}
              </MenuItem>
            ))}
          </TextField>
          <DesktopDatePicker
            label={t("common.creationDate")}
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
        </LocalizationProvider> */}
      </div>
    </div>
  );
}

export default StorageLogsInvoiceFilter;
