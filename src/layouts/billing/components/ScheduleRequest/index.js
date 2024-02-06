// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import { alpha } from "@mui/material/styles";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import React, { Component } from "react";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import InputLabel from "@mui/material/InputLabel";
import { getListFields } from "../../../../action/FieldAction";
import { checkPesananRangeDate } from "../../../../action/PesananAction";

// import ArgonButton from "components/ArgonButton";

// Billing page components
// import Transaction from "layouts/billing/components/Transaction";
import ListToday from "layouts/billing/components/ListToday";
import ArgonButton from "components/ArgonButton";

import LapanganVinyl from "assets/images/lapangan-vinyl.png";
import LapanganRumput from "assets/images/lapangan-rumput.png";
4;
import { connect } from "react-redux";
import { formatDateWithoutDay } from "../../../../utils/formatDateWithoutDay/index";
import { formatDate } from "../../../../utils/formatDate/index";
import { AlertError } from "../../../../utils/alert/index";

class ScheduleRequest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      category: "pagi",
      selectedDate: null,
      checked: true,
      listLapangan: ["vinyl", "rumput"],
      lapangan: "vinyl",
      tanggalAwal: "",
      tanggalAkhir: "",
      dataRangeDate: [],
      dataHasil: false,
      selectedFilters: [],
      anchorEl: false,
      waktuPopUp: "",
      namaPengguna: "",
      photoPengguna: "",
      emailPengguna: "",
      libur: false,
      anchorEl: false,
    };
  }

  componentDidMount() {
    this.props.dispatch(getListFields());
    this.props.dispatch(checkPesananRangeDate());
  }

  handleChecked(event) {
    this.setState({
      checked: event.target.checked,
    });
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleDateChange(newDate, name) {
    const day = newDate["$D"].toString();
    const month = (newDate["$M"] + 1).toString();
    const year = newDate["$y"];

    const formattedDay = day.padStart(2, "0");
    const formattedMonth = month.padStart(2, "0");

    //ubah format menjadi "YYYY-MM-DD"
    const tanggal = `${year}-${formattedMonth}-${formattedDay}`;

    this.setState({ [name]: tanggal });
  }

  handelRangeDate(tanggalAwal, tanggalAkhir) {
    const currentDate = new Date(tanggalAwal);
    const currentDate2 = new Date(tanggalAkhir);

    const endDate = new Date(tanggalAwal);
    endDate.setDate(currentDate.getDate() + 30);

    const dataRangeDate = [];

    if (currentDate > currentDate2) {
      AlertError("error", "Harap Pilih Tanggal Maju Kedepan");
    } else if (tanggalAwal === "" || tanggalAkhir === "") {
      AlertError("error", "Harap Pilih Tanggal");
    } else if (currentDate2 > endDate) {
      AlertError("error", "Rentang Hari Maksimal 30 Hari");
    } else if (tanggalAwal === tanggalAkhir) {
      AlertError("error", "Harap Pilih tanggal yang berbeda");
    } else {
      while (currentDate <= currentDate2) {
        // Menggunakan format DD-MM-YYYY
        const formattedDate = currentDate.toLocaleDateString("en-ca", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });

        // Menambahkan tanggal ke dalam array
        dataRangeDate.push(formattedDate);

        // Menambah satu hari ke tanggal saat ini
        currentDate.setDate(currentDate.getDate() + 1);
      }

      const dataHasil = {
        lapangan: this.state.lapangan,
        tanggalAwal: tanggalAwal,
        tanggalAkhir: tanggalAkhir,
      };

      this.props.dispatch(checkPesananRangeDate(dataRangeDate, this.state.lapangan));

      this.setState({
        dataRangeDate: dataRangeDate,
        dataHasil: dataHasil,
      });
    }
  }

  capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  handleClick(event, dataUser) {
    this.setState({
      anchorEl: event.currentTarget,
      waktuPopUp: event.target.textContent,
      namaPengguna: dataUser.nama,
      photoPengguna: dataUser.photo,
      emailPengguna: dataUser.email,
      libur: dataUser.libur,
    });
  }

  handleClose() {
    this.setState({
      anchorEl: false,
    });
  }

  render() {
    const {
      lapangan,
      listLapangan,
      category,
      selectedDate,
      tanggalAwal,
      tanggalAkhir,
      dataRangeDate,
      dataHasil,
      waktuPopUp,
      namaPengguna,
      photoPengguna,
      emailPengguna,
      libur,
      anchorEl,
    } = this.state;
    const { listFieldsResult, checkPesananRangeDateResult } = this.props;

    const timeRanges = [
      "08.00-09.00",
      "09.00-10.00",
      "10.00-11.00",
      "11.00-12.00",
      "13.00-14.00",
      "14.00-15.00",
      "15.00-16.00",
      "16.00-17.00",
      "19.00-20.00",
      "20.00-21.00",
      "21.00-22.00",
      "22.00-23.00",
      "23.00-23.59 ",
    ];

    const color = "#fb6340";

    return (
      <Card sx={{ height: "100%" }}>
        <ArgonBox pt={4} pb={3} mx={5}>
          <ArgonBox>
            <ArgonTypography variant="h4" fontWeight="bold" textTransform="capitalize">
              Cari Jadwal
            </ArgonTypography>
            <ArgonTypography variant="h5" fontWeight="medium" textTransform="capitalize">
              Berdasarkan Rentang Hari
            </ArgonTypography>

            {/* <ArgonBox display="flex" pt={1} alignItems="center">
            <ArgonBox color="text" mr={1} lineHeight={0}>
              <Icon color="inherit" fontSize="small">
                date_range
              </Icon>
            </ArgonBox>
            <ArgonTypography variant="h6" color="text" fontWeight="regular">
              Senin, 8 Januari 2024
            </ArgonTypography>
          </ArgonBox> */}
          </ArgonBox>

          <ArgonBox
            display="flex"
            flexDirection="row"
            flexWrap="wrap"
            justifyContent="space-between"
            pt={4}
            sx={{
              borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                `${borderWidth[1]} solid ${borderColor}`,
            }}
          >
            <ArgonBox pb={2} mr={3} width="200px">
              <FormControl fullWidth>
                <Select
                  name="lapangan"
                  value={lapangan}
                  onChange={(value) => this.handleChange(value)}
                  sx={{
                    height: "auto", // Set tinggi menjadi otomatis
                    display: "flex",
                    paddingY: "8px", // Sesuaikan padding secara vertikal
                    "& .MuiSelect-select": {
                      minHeight: "25px", // Set tinggi minimum
                    },
                    "& .MuiSelect-icon": {
                      color: "red", // Set the arrow color
                    },
                  }}
                  endAdornment={
                    <ArrowDropDownIcon
                      sx={{
                        position: "absolute",
                        right: 8,
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    />
                  } // Position the custom arrow icon at the right end
                >
                  {listLapangan.map((key, index) => {
                    return (
                      <MenuItem
                        key={index}
                        style={{ height: "50px", textTransform: "capitalize" }}
                        value={key}
                      >
                        {"Lapangan " + this.capitalize(key)}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </ArgonBox>

            <ArgonBox display="flex" alignItems="center" flexWrap="wrap" pb={2} pr={3}>
              <ArgonTypography
                variant="h5"
                fontWeight="medium"
                textTransform="capitalize"
                fontSize={15}
                pr={2}
                pb={2}
              >
                Dari Tanggal
              </ArgonTypography>

              <ArgonBox pb={2}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={selectedDate}
                    onChange={(value) => this.handleDateChange(value, "tanggalAwal")}
                    format="DD-MM-YYYY" // Set the desired date format
                  />
                </LocalizationProvider>
              </ArgonBox>

              <ArgonTypography
                variant="h5"
                fontWeight="medium"
                textTransform="capitalize"
                fontSize={15}
                px={2}
                pb={2}
              >
                Sampai
              </ArgonTypography>

              <ArgonBox pb={2}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={selectedDate}
                    onChange={(value) => this.handleDateChange(value, "tanggalAkhir")}
                    format="DD-MM-YYYY" // Set the desired date format
                  />
                </LocalizationProvider>
              </ArgonBox>
            </ArgonBox>

            <ArgonBox>
              <ArgonButton
                color="primary"
                variant="gradient"
                size="medium"
                mb={2}
                onClick={() => {
                  this.handelRangeDate(tanggalAwal, tanggalAkhir);
                }}
              >
                Tampilkan
              </ArgonButton>
            </ArgonBox>
          </ArgonBox>
        </ArgonBox>

        <Popover
          id={Boolean(anchorEl) ? "simple-popover" : undefined}
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => this.handleClose()}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          PaperProps={{
            style: { backgroundColor: "white" }, // Adjust background color as needed
          }}
        >
          <div>
            <Card style={{ backgroundColor: alpha(color, 0.1), position: "absolute" }}>
              <ArgonTypography
                style={{ color: color }}
                fontWeight="medium"
                px={2}
                py={0.4}
                fontSize={15}
                variant="h6"
                color="white"
              >
                {"Pukul : " + waktuPopUp}
              </ArgonTypography>
            </Card>

            {!libur ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 10,
                  paddingTop: 40,
                }}
              >
                <img
                  src={`data:image/png;base64, ${this.state.photoPengguna}`}
                  alt="Base64 Image"
                  style={{ width: "40px", maxHeight: "40px", objectFit: "cover", borderRadius: 50 }}
                />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <ArgonTypography pl={1} variant="h6" color="primary" textTransform="capitalize">
                    {this.state.namaPengguna}
                  </ArgonTypography>
                  <ArgonTypography pl={1} variant="caption" color="text">
                    Email : {this.state.emailPengguna}
                  </ArgonTypography>
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 10,
                  paddingTop: 40,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <ArgonTypography pl={1} variant="h6" color="error" textTransform="capitalize">
                    {this.state.namaPengguna}
                  </ArgonTypography>
                  <ArgonTypography pl={1} variant="caption" color="text" mr={2}>
                    ( Jadwal Libur - ADMIN )
                  </ArgonTypography>
                </div>
              </div>
            )}
          </div>
        </Popover>

        {checkPesananRangeDateResult ? (
          <>
            <ArgonBox
              mx={5}
              mb={3}
              pb={2}
              sx={{
                borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                  `${borderWidth[1]} solid ${borderColor}`,
              }}
            >
              <ArgonBox display="flex" alignItems="center">
                <ArgonBox display="flex" flexDirection="row" alignItems="center">
                  <ArgonBox
                    component="img"
                    src={dataHasil.lapangan === "vinyl" ? LapanganVinyl : LapanganRumput}
                    width={50}
                    height={47}
                  />
                  <ArgonBox ml={2} display="flex" flexDirection="column">
                    <ArgonTypography
                      variant="button"
                      color="primary"
                      fontWeight="medium"
                      fontSize={16}
                      textTransform="capitalize"
                    >
                      {"Lapangan " + dataHasil.lapangan}
                    </ArgonTypography>
                  </ArgonBox>
                </ArgonBox>

                <ArgonBox ml={5} display="flex" flexDirection="column" alignItems="center">
                  <ArgonTypography variant="button" color="text" fontWeight="medium" fontSize={16}>
                    {formatDateWithoutDay(dataHasil.tanggalAwal) +
                      " - " +
                      formatDateWithoutDay(dataHasil.tanggalAkhir)}
                  </ArgonTypography>
                </ArgonBox>

                <ArgonBox
                  mb={2}
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-end"
                ></ArgonBox>
              </ArgonBox>
            </ArgonBox>

            {checkPesananRangeDateResult.map((item, index) => {
              const formattedSchedule = item.jadwal
                ? item.jadwal
                    .map((jadwal) => ({
                      jadwal: `${this.state.lapangan}-${item.tanggal}-${jadwal.waktu}`,
                      nama: `${jadwal.nama}`,
                      photo: `${jadwal.photo}`,
                      email: `${jadwal.email}`,
                      libur: jadwal.libur ? true : false,
                    }))
                    .flat()
                : [];

              const dataSchedule = formattedSchedule
                ? formattedSchedule.map((item) => item.jadwal)
                : [];

              const dataScheduleUser = formattedSchedule ? formattedSchedule : [];

              return (
                <ArgonBox key={index}>
                  <ArgonBox ml={5}>
                    <ArgonButton
                      variant="outlined"
                      size="small"
                      texttransform="capitalize"
                      color="primary"
                      fontSize={16}
                    >
                      {formatDate(item.tanggal)}
                    </ArgonButton>
                  </ArgonBox>

                  <ArgonBox
                    display="flex"
                    flexWrap="wrap"
                    alignItems="center"
                    // justifyContent="space-between"
                    mx={5}
                    my={4}
                    sx={{
                      borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                        `${borderWidth[1]} solid ${borderColor}`,
                    }}
                  >
                    {timeRanges.map((timeRange, innerIndex) => {
                      const { anchorEl } = this.state;
                      const selectedFiltersData = dataScheduleUser.find((items) =>
                        items.jadwal.includes(
                          this.state.lapangan + "-" + item.tanggal + "-" + timeRange
                        )
                      );

                      const result = selectedFiltersData
                        ? {
                            nama: selectedFiltersData.nama,
                            photo: selectedFiltersData.photo,
                            email: selectedFiltersData.email,
                            libur: selectedFiltersData.libur,
                            jadwal: true,
                          }
                        : false;

                      return (
                        <ArgonBox
                          key={innerIndex}
                          mx={3}
                          mb={2}
                          display="flex"
                          flexDirection="row"
                          alignItems="center"
                        >
                          <Checkbox
                            checked={dataSchedule
                              .filter((itemFilter) => itemFilter.includes(item.tanggal))
                              .includes(this.state.lapangan + "-" + item.tanggal + "-" + timeRange)}
                            onChange={() => {}}
                            inputProps={{ "aria-label": "controlled" }}
                            disabled
                          />

                          {result ? (
                            <Button
                              aria-describedby={Boolean(anchorEl) ? "popover" : undefined}
                              onClick={(value) => this.handleClick(value, result)}
                            >
                              <ArgonTypography variant="h6" color="warning" fontWeight="medium">
                                {timeRange}
                              </ArgonTypography>
                            </Button>
                          ) : (
                            <Button aria-describedby={Boolean(anchorEl) ? "popover" : undefined}>
                              <ArgonTypography variant="h6" color="text" fontWeight="medium">
                                {timeRange}
                              </ArgonTypography>
                            </Button>
                          )}
                        </ArgonBox>
                      );
                    })}
                  </ArgonBox>
                </ArgonBox>
              );
            })}
          </>
        ) : (
          []
        )}
      </Card>
    );
  }
}

const mapStateToProps = (state) => ({
  listFieldsResult: state.FieldReducer.listFieldsResult,
  listFieldsLoading: state.FieldReducer.listFieldsLoading,

  checkPesananRangeDateResult: state.PesananReducer.checkPesananRangeDateResult,
  checkPesananRangeDateLoading: state.PesananReducer.checkPesananRangeDateLoading,
});

export default connect(mapStateToProps, null)(ScheduleRequest);
