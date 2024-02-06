// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";

// Argon Dashboard 2 MUI examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";

// Data

import BillingInformation from "layouts/billing/components/BillingInformation";
import Transactions from "layouts/billing/components/Transactions";
import Todays from "layouts/billing/components/Todays/index";
import Order from "layouts/billing/components/Order/index";
import ScheduleRequest from "../billing/components/ScheduleRequest/index";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { connect } from "react-redux";
import { checkAuthentication } from "../../utils/checkAuthentication/index";

function Tables({ checkPesananRangeDateLoading }) {
  return (
    <>
      {checkPesananRangeDateLoading && (
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            position: "absolute",
            zIndex: 100, //because Default Zindex Drawer Material Ui = 1200
          }}
        >
          <ArgonBox
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: 3,
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
            }}
            py={5}
            px={8}
          >
            <CircularProgress />
            <ArgonTypography ml={3}>Loading ...</ArgonTypography>
          </ArgonBox>
        </Box>
      )}

      <DashboardLayout>
        <DashboardNavbar />
        <ArgonBox py={3}>
          <ArgonBox mb={3}>
            <Grid container spacing={3} mb={3}>
              <Grid item xs={12} md={12}>
                <Todays />
              </Grid>
            </Grid>
          </ArgonBox>
          <ScheduleRequest />
        </ArgonBox>
        <Footer />
      </DashboardLayout>
    </>
  );
}

const mapStateToProps = (state) => ({
  checkPesananRangeDateLoading: state.PesananReducer.checkPesananRangeDateLoading,
});

export default checkAuthentication(connect(mapStateToProps, null)(Tables));
