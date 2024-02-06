// @mui material components
import React, { Component } from "react";
import Card from "@mui/material/Card";
// import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

import { alpha } from "@mui/material/styles";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";

import Checkbox from "@mui/material/Checkbox";

import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import InputLabel from "@mui/material/InputLabel";
import { getListFields } from "../../../../action/FieldAction";
import { checkPesanan } from "../../../../action/PesananAction";

import LapanganVinyl from "assets/images/lapangan-vinyl.png";
import LapanganRumput from "assets/images/lapangan-rumput.png";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

// Billing page components
import ListToday from "layouts/billing/components/ListToday";
import { connect } from "react-redux";
import { numberWithCommas } from "../../../../utils/numberFormat/index";
import { formatDate } from "../../../../utils/formatDate/index";
import team1 from "assets/images/team-1.jpg";

class Order extends Component {
  constructor(props) {
    super(props);

    this.state = {
      item: " -MKQAIIU1ZQIL5ZHEqFE",
      namaLapangan: "vinyl",
      category: "pagi",
      date: new Date().toLocaleDateString("en-CA"),
      selectedFilters: [],
      dataWaktuPagi: [
        "08.00-09.00",
        "13.00-14.00",
        "09.00-10.00",
        "14.00-15.00",
        "10.00-11.00",
        "15.00-16.00",
        "11.00-12.00",
        "16.00-17.00",
      ],
      dataWaktuMalam: ["19.00-20.00", "20.00-21.00", "21.00-22.00", "22.00-23.00", "23.00-23.59"],
      selectedDate: dayjs(new Date().toLocaleDateString("en-CA")),
      anchorEl: false,
      waktuPopUp: "",
      namaPengguna: "",
      photoPengguna: "",
      emailPengguna: "",
      userId: "",
      libur: false,
    };
  }

  componentDidMount() {
    const { date, namaLapangan } = this.state;
    this.props.dispatch(getListFields());
    this.props.dispatch(checkPesanan(date, namaLapangan));
  }

  componentDidUpdate(prevProps, prevState) {
    const { date, item, namaLapangan, selectedFilters } = this.state;
    const { listFieldsResult, checkPesananResult } = this.props;

    if (item && prevState.item !== item) {
      const dataLapangan = listFieldsResult[item];
      const dataNamaLapangan = dataLapangan ? dataLapangan.nama : [];

      this.setState({
        category: dataLapangan.category,
        namaLapangan: dataNamaLapangan,
      });

      if (dataNamaLapangan) {
        this.props.dispatch(checkPesanan(date, dataNamaLapangan));
      }
    }
    if (namaLapangan && prevState.namaLapangan !== namaLapangan) {
      const dataLapangan = listFieldsResult[item];

      this.setState({
        namaLapangan: dataLapangan ? dataLapangan.nama : [],
      });
    }
    if (checkPesananResult && prevProps.checkPesananResult !== checkPesananResult) {
      const dataPesanan = checkPesananResult.map((item) => ({
        nama: `${item.nama}`,
        photo: `${item.photo}`,
        jadwal: `${namaLapangan}-${date}-${item.waktu}`,
        email: `${item.email}`,
        userId: `${item.uid}`,
        libur: item.libur ? true : false,
      }));

      console.log(dataPesanan);
      this.setState({
        selectedFilters: dataPesanan,
      });
    }
    if (date && prevState.date !== date) {
      this.props.dispatch(checkPesanan(date, namaLapangan));
    }
  }

  handleChecked(event) {
    this.setState({
      checked: event.target.checked,
    });
  }

  handleChange(event) {
    this.setState({
      item: event.target.value,
    });
  }

  handleDateChange(newDate) {
    const day = newDate["$D"].toString();
    const month = (newDate["$M"] + 1).toString();
    const year = newDate["$y"];

    const formattedDay = day.padStart(2, "0");
    const formattedMonth = month.padStart(2, "0");

    //ubah format menjadi "YYYY-MM-DD"
    const tanggal = `${year}-${formattedMonth}-${formattedDay}`;

    this.setState({ date: tanggal });
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
      userId: dataUser.userId,
      libur: dataUser.libur,
    });
  }

  handleClose() {
    this.setState({
      anchorEl: false,
    });
  }

  checkBox(itemCheckBox, selectedFilters, namaLapangan, date) {
    const { anchorEl } = this.state;

    return itemCheckBox.map((time, index) => {
      const selectedFiltersData = selectedFilters.find((item) =>
        item.jadwal.includes(namaLapangan + "-" + date + "-" + time)
      );

      const result = selectedFiltersData
        ? {
            nama: selectedFiltersData.nama,
            photo: selectedFiltersData.photo,
            email: selectedFiltersData.email,
            libur: selectedFiltersData.libur,
            userId: selectedFiltersData.userId,
            jadwal: true,
          }
        : false;

      return (
        <ArgonBox key={index} mr={3} mb={2} display="flex" flexDirection="row" alignItems="center">
          <Checkbox
            checked={result ? result.jadwal : false}
            onChange={(value) => this.handleChecked(value)}
            inputProps={{ "aria-label": "controlled" }}
            disabled
          />
          {result ? (
            <Button
              aria-describedby={Boolean(anchorEl) ? "popover" : undefined}
              onClick={(value) => this.handleClick(value, result)}
            >
              <ArgonTypography variant="h6" color="warning" fontWeight="medium">
                {time}
              </ArgonTypography>
            </Button>
          ) : (
            <Button aria-describedby={Boolean(anchorEl) ? "popover" : undefined}>
              <ArgonTypography variant="h6" color="text" fontWeight="medium">
                {time}
              </ArgonTypography>
            </Button>
          )}
        </ArgonBox>
      );
    });
  }

  renderCheckboxes() {
    const { selectedFilters, dataWaktuPagi, dataWaktuMalam, date, namaLapangan, category } =
      this.state;

    const dataWaktuSemuanya = dataWaktuPagi.concat(dataWaktuMalam);

    return (
      <>
        {category === "pagi"
          ? this.checkBox(dataWaktuPagi, selectedFilters, namaLapangan, date)
          : category === "malam"
          ? this.checkBox(dataWaktuMalam, selectedFilters, namaLapangan, date)
          : this.checkBox(dataWaktuSemuanya, selectedFilters, namaLapangan, date)}
      </>
    );
  }

  render() {
    const {
      item,
      tanggal,
      namaLapangan,
      checked,
      selectedFilters,
      date,
      selectedDate,
      anchorEl,
      waktuPopUp,
      libur,
    } = this.state;
    const { listFieldsResult } = this.props;

    const color = "#fb6340";

    const dataLapangan = listFieldsResult ? listFieldsResult[item] : [];

    return (
      <Card sx={{ height: "100%" }}>
        <ArgonBox px={3} py={3}>
          <ArgonTypography variant="h4" fontWeight="bold" textTransform="capitalize">
            Check
          </ArgonTypography>
          <ArgonTypography variant="h5" fontWeight="medium" textTransform="capitalize">
            Jadwal Lapangan
          </ArgonTypography>
        </ArgonBox>
        <ArgonBox display="flex" justifyContent="space-between" alignItems="center" mx={3}>
          <FormControl fullWidth>
            <Select
              value={item}
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
              {listFieldsResult
                ? Object.keys(listFieldsResult).map((key, index) => {
                    return (
                      <MenuItem
                        key={index}
                        style={{ height: "50px", textTransform: "capitalize" }}
                        value={key}
                      >
                        {"Lapangan " +
                          this.capitalize(listFieldsResult[key].nama) +
                          " (" +
                          this.capitalize(
                            listFieldsResult[key].category === "pagi" ? "pagi-Sore" : "malam"
                          ) +
                          ")"}
                      </MenuItem>
                    );
                  })
                : []}
            </Select>
          </FormControl>

          {/* <FormControl sx={{ minWidth: "30%" }}>
            <Select
              value={tanggal}
              onChange={this.handleChangee}
              sx={{
                height: "auto", // Set tinggi menjadi otomatis
                paddingY: "8px", // Sesuaikan padding secara vertikal
              }}
            >
              <MenuItem style={{ height: "50px" }} value={10}>
                2023-01-06
              </MenuItem>
              <MenuItem style={{ height: "50px" }} value={20}>
                2023-01-07
              </MenuItem>
              <MenuItem style={{ height: "50px" }} value={30}>
                2023-01-08
              </MenuItem>
              <MenuItem style={{ height: "50px" }} value={40}>
                2023-01-09
              </MenuItem>
            </Select>
          </FormControl> */}

          <ArgonBox ml={0.4} />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={selectedDate}
              onChange={(value) => this.handleDateChange(value)}
              format="DD-MM-YYYY" // Set the desired date format
            />
          </LocalizationProvider>
        </ArgonBox>
        <ArgonBox
          mx={3}
          mt={3}
          pt={3}
          sx={{
            borderBottom: ({ borders: { borderWidth, borderColor } }) =>
              `${borderWidth[1]} solid ${borderColor}`,
            borderTop: ({ borders: { borderWidth, borderColor } }) =>
              `${borderWidth[1]} solid ${borderColor}`,
          }}
        >
          <ArgonBox display="flex" alignItems="center" justifyContent="space-between">
            <ArgonBox display="flex" flexDirection="row">
              <ArgonBox
                component="img"
                src={dataLapangan.nama === "vinyl" ? LapanganVinyl : LapanganRumput}
                width={55}
                height={52}
                mb={4}
              />
              <ArgonBox mb={2} ml={2} display="flex" flexDirection="column">
                <ArgonTypography
                  variant="button"
                  color="primary"
                  fontWeight="medium"
                  fontSize={16}
                  textTransform="capitalize"
                >
                  {listFieldsResult ? "Lapangan " + dataLapangan.nama : []}
                </ArgonTypography>
                <ArgonTypography
                  variant="button"
                  color="text"
                  fontWeight="regular"
                  textTransform="capitalize"
                >
                  {dataLapangan && dataLapangan.category === "pagi"
                    ? "Jadwal Pagi-Sore"
                    : dataLapangan && dataLapangan.category === "malam"
                    ? "Jadwal Malam"
                    : []}
                </ArgonTypography>
                <ArgonTypography
                  variant="button"
                  color="text"
                  fontWeight="regular"
                  textTransform="capitalize"
                >
                  {listFieldsResult ? "Rp. " + numberWithCommas(dataLapangan.harga) + " / Jam" : []}
                </ArgonTypography>
              </ArgonBox>
            </ArgonBox>

            <ArgonBox mb={2} display="flex" flexDirection="column" alignItems="center" mr={1}>
              <ArgonTypography variant="button" color="error" fontWeight="medium" fontSize={18}>
                {/* {listFieldsResult ? "Rp. " + numberWithCommas(dataLapangan.harga) + " / Jam" : []} */}
                {formatDate(date).split(",")[0]}
              </ArgonTypography>
              <ArgonBox display="flex" flexDirection="row" color="text">
                <ArgonTypography variant="button" color="text" fontSize={14} fontWeight="medium">
                  {formatDate(date).split(",")[1]}
                </ArgonTypography>
              </ArgonBox>
            </ArgonBox>
          </ArgonBox>
        </ArgonBox>
        <ArgonBox pt={2} px={5}>
          <ArgonBox
            component="ul"
            display="flex"
            flexDirection="column"
            sx={{ listStyle: "none" }}
            mb={3}
          >
            <ArgonTypography
              variant="caption"
              color="text"
              fontWeight="bold"
              textTransform="uppercase"
            >
              Jadwal Tersedia
            </ArgonTypography>
          </ArgonBox>
        </ArgonBox>

        <ArgonBox display="flex" flexWrap="wrap" alignItems="center" justifyContent="center" ml={4}>
          {this.renderCheckboxes()}
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

        <ArgonBox display="flex" alignItems="center" justifyContent="center">
          <ArgonTypography variant="caption" color="text" fontWeight="medium" mt={1.5} mb={3}>
            Ket : Tidak Centang (Jadwal Kosong)
          </ArgonTypography>
        </ArgonBox>
      </Card>
    );
  }
}

const mapStateToProps = (state) => ({
  listFieldsResult: state.FieldReducer.listFieldsResult,
  listFieldsLoading: state.FieldReducer.listFieldsLoading,

  checkPesananResult: state.PesananReducer.checkPesananResult,
  checkPesananLoading: state.PesananReducer.checkPesananLoading,
});

export default connect(mapStateToProps, null)(Order);
