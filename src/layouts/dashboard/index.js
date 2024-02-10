// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";

// Argon Dashboard 2 MUI example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DetailedStatisticsCard from "examples/Cards/StatisticsCards/DetailedStatisticsCard";
import SalesTable from "examples/Tables/SalesTable";
import CategoriesList from "examples/Lists/CategoriesList";
import GradientLineChart from "examples/Charts/LineCharts/GradientLineChart";
// import Swal from "sweetalert2";

// Argon Dashboard 2 MUI base styles
import typography from "assets/theme/base/typography";

// Dashboard layout components
import Slider from "layouts/dashboard/components/Slider";
import React, { Component } from "react";
// import { useDispatch } from "react-redux";

// Data
import gradientLineChartData from "layouts/dashboard/data/gradientLineChartData";
import categoriesListData from "layouts/dashboard/data/categoriesListData";
import { connect } from "react-redux";
import { numberWithCommas } from "../../utils/numberFormat/index";
import {
  getListUserTotal,
  getListQuotes,
  orderToday,
  moneyToday,
  salesThisMonth,
  salesSixMonths,
} from "../../action/DashboardAction";
import { LastSixMonths, getMonthNamesForLastSixMonths } from "utils/sixMonth";
import { hitungTotalHarga } from "../../utils/totalHarga/index";
import { useNavigate } from "react-router-dom";
import { checkAuthentication } from "../../utils/checkAuthentication/index";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.props.dispatch(getListUserTotal());
    this.props.dispatch(orderToday(new Date().toLocaleDateString("en-CA")));
    this.props.dispatch(moneyToday(new Date().toLocaleDateString("en-CA")));
    this.props.dispatch(salesSixMonths(LastSixMonths()));
    this.props.dispatch(salesThisMonth(new Date().toLocaleDateString("en-CA")));
    this.props.dispatch(getListQuotes());
  }

  // Fungsi untuk menghitung percentBar dalam bentuk persentase %
  percentBar(data) {
    let totalData = 0;
    for (let i = 0; i < data.length; i++) {
      totalData += data[i].length;
    }
    return Math.floor((totalData / 26) * 100);
  }

  // Fungsi untuk menghitung Kenaikan/Penurunan dalam bentuk persentase %
  hitungPersentase(nilaiAwal, nilaiAkhir) {
    const nilaiPembagi = nilaiAwal === 0 ? nilaiAwal + 1 : nilaiAwal;

    const selisih = nilaiAkhir - nilaiAwal;
    const persentase = (selisih / nilaiPembagi) * 100;
    return Math.floor(persentase);
  }

  // Fungsi untuk menghitung Today's Money
  todaysMoney(data) {
    const hasilPerhitungan = data.map((dataPesanan) => hitungTotalHarga(dataPesanan));

    const hasilPerhitunganMoneyYesterday = numberWithCommas(hasilPerhitungan[0]);
    const hasilPerhitunganMoneyToday = numberWithCommas(hasilPerhitungan[1]);
    const perbandinganMoney = this.hitungPersentase(hasilPerhitungan[0], hasilPerhitungan[1]);

    return [hasilPerhitunganMoneyToday, perbandinganMoney];
  }

  // Fungsi untuk menghitung Sales This Month
  salesThisMonth(data) {
    const hasilPerhitunganBulan = data.map((item) =>
      Object.keys(item).map((dataPesanan) => hitungTotalHarga(item[dataPesanan]))
    );

    const jumlahNilaiBulanLalu = hasilPerhitunganBulan[0].reduce(
      (total, nilai) => total + nilai,
      0
    );
    const jumlahNilaiBulanIni = hasilPerhitunganBulan[1].reduce((total, nilai) => total + nilai, 0);

    const hasilPerhitunganBulanIni = numberWithCommas(jumlahNilaiBulanIni);
    const hasilPerhitunganBulanLalu = numberWithCommas(jumlahNilaiBulanLalu);

    const perbandinganBulan = this.hitungPersentase(jumlahNilaiBulanLalu, jumlahNilaiBulanIni);

    return [hasilPerhitunganBulanIni, perbandinganBulan];
  }

  //dapatkan nama bulan di hari ini
  getMonthNameToday() {
    var today = new Date();
    var monthNames = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    var currentMonth = monthNames[today.getMonth()];
    return currentMonth;
  }

  render() {
    const {
      listUserTotalResult,
      orderTodayResult,
      moneyTodayResult,
      salesThisMonthResult,
      salesSixMonthResult,
      logoutLoading,
    } = this.props;
    const { size } = typography;

    //TODAY'S ORDER
    const dataPercentageOrder = this.percentBar(Object.values(orderTodayResult));
    const countOrder = dataPercentageOrder ? 100 - dataPercentageOrder : 100;

    //TODAY'S MONEY
    const perbandinganMoney = moneyTodayResult ? this.todaysMoney(moneyTodayResult) : 0;

    //SALES THIS MONTH
    const perbandinganBulan = salesThisMonthResult ? this.salesThisMonth(salesThisMonthResult) : 0;

    //SALES SIX MONTH
    const dataSixMonth = salesSixMonthResult ? salesSixMonthResult : [];
    const namaBulan = getMonthNamesForLastSixMonths();

    return (
      <DashboardLayout>
        <DashboardNavbar />

        <ArgonBox py={3}>
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} md={6} lg={3}>
              <DetailedStatisticsCard
                title="TODAY'S ORDER"
                count={
                  dataPercentageOrder ? "Progress " + dataPercentageOrder + "%" : "Progress 0%"
                }
                icon={{ color: "success", component: <i className="ni ni-paper-diploma" /> }}
                percentage={{
                  color: countOrder > 50 ? "success" : "error",
                  count: countOrder + "%",
                  text: "available",
                }}
                percentBar={dataPercentageOrder}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <DetailedStatisticsCard
                title="today's money"
                count={perbandinganMoney ? "Rp. " + perbandinganMoney[0] : "Rp. -"}
                icon={{ color: "info", component: <i className="ni ni-money-coins" /> }}
                percentage={{
                  color:
                    perbandinganMoney[1] === 0
                      ? "dark"
                      : perbandinganMoney[1] < 0
                      ? "error"
                      : "success",
                  count: perbandinganMoney ? perbandinganMoney[1] + "%" : "0",
                  text: "since yesterday",
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <DetailedStatisticsCard
                title="total users"
                count={listUserTotalResult ? listUserTotalResult : "-"}
                icon={{ color: "error", component: <i className="ni ni-world" /> }}
                percentage={{ color: "success", text: "user / pengguna" }}
              />
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <DetailedStatisticsCard
                title={"sales ( " + this.getMonthNameToday() + " )"}
                count={perbandinganBulan ? "Rp. " + perbandinganBulan[0] : "Rp. -"}
                icon={{ color: "warning", component: <i className="ni ni-cart" /> }}
                percentage={{
                  color:
                    perbandinganBulan[1] === 0
                      ? "dark"
                      : perbandinganBulan[1] < 0
                      ? "error"
                      : "success",
                  count: perbandinganBulan ? perbandinganBulan[1] + "%" : 0,
                  text: "than last month",
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} lg={7}>
              <GradientLineChart
                title="SALES OVERVIEW"
                description={
                  <ArgonBox display="flex" alignItems="center">
                    <ArgonTypography variant="button" color="text" fontWeight="medium">
                      Last 6 Months{" "}
                    </ArgonTypography>
                  </ArgonBox>
                }
                chart={gradientLineChartData(namaBulan, dataSixMonth)}
              />
            </Grid>
            <Grid item xs={12} lg={5}>
              <Slider />
            </Grid>
          </Grid>
        </ArgonBox>
        <Footer />
      </DashboardLayout>
    );
  }
}

const mapStateToProps = (state) => ({
  listUserTotalResult: state.DashboardReducer.listUserTotalResult,
  listUserTotalLoading: state.DashboardReducer.listUserTotalLoading,

  orderTodayResult: state.DashboardReducer.orderTodayResult,
  orderTodayLoading: state.DashboardReducer.orderTodayLoading,

  moneyTodayResult: state.DashboardReducer.moneyTodayResult,
  moneyTodayLoading: state.DashboardReducer.moneyTodayLoading,

  salesThisMonthResult: state.DashboardReducer.salesThisMonthResult,
  salesThisMonthLoading: state.DashboardReducer.salesThisMonthLoading,

  salesSixMonthResult: state.DashboardReducer.salesSixMonthResult,
  salesSixMonthLoading: state.DashboardReducer.salesSixMonthLoading,

  checkLoginResult: state.AuthReducer.checkLoginResult,
  logoutLoading: state.AuthReducer.logoutLoading,
});

export default checkAuthentication(connect(mapStateToProps, null)(Dashboard));
