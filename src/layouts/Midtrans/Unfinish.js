import React, { Component } from "react";
import { updatePesanan } from "../../action/PesananAction";
import { connect } from "react-redux";

import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import PageLayout from "examples/LayoutContainers/PageLayout";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import LogoFutsalPro from "assets/images/logo-futsalpro.png";
import AnimationSuccess from "assets/images/animation-success.json";
import AnimationPending from "assets/images/animation-pending.json";
import ArgonBox from "components/ArgonBox";
import Lottie from "lottie-react";
import ArgonTypography from "components/ArgonTypography";
import Icon from "@mui/material/Icon";

class UnFinish extends Component {
  constructor(props) {
    super(props);

    this.state = {
      order_id: "",
      transaction_status: "",
    };
  }

  componentDidMount() {
    // ?order_id=TEST-1696693136502-rnB3Qifs5jfnn0WMoyG0AVkfZIm1&status_code=201&transaction_status=pending

    let search = window.location.search;
    let params = new URLSearchParams(search);

    const order_id = params.get("order_id");
    const transaction_status = params.get("transaction_status");

    if (order_id) {
      this.setState({
        order_id: order_id,
        transaction_status: transaction_status,
      });
    }
  }

  toHistory() {
    window.ReactNativeWebView.postMessage("Selesai");
  }

  render() {
    const { transaction_status, order_id } = this.state;
    const { updatePesananLoading } = this.props;

    return (
      <Grid container justifyContent="center" height="100vh">
        <Grid item>
          <Box
            sx={{
              textAlign: "center",
              alignItems: "center",
              borderRadius: 15,
              paddingTop: 10,
              paddingBottom: 10,
              borderRadius: 10,
            }}
            display="flex"
            flexDirection="column"
          >
            <ArgonBox component="img" src={LogoFutsalPro} alt="gambar" width={200} mb={1} />

            <ArgonBox width={230}>
              <Lottie animationData={AnimationPending} loop={false} />
            </ArgonBox>

            <ArgonTypography fontSize={24} mt={1}>
              Pembayaran Belum Selesai
            </ArgonTypography>
            <ArgonTypography color="text" fontSize={19} mb={1}>
              Harap Selesaikan Pembayaran
            </ArgonTypography>
            <ArgonBox bgColor="#dee2e6" py={1} px={2} sx={{ borderRadius: 20 }} color="dark" mt={1}>
              <ArgonTypography color="dark" fontSize={18}>
                Order ID : {order_id}
              </ArgonTypography>
            </ArgonBox>

            <ArgonBox display="flex" flexDirection="row">
              <ArgonTypography fontSize={17} mt={2}>
                Status Pembayaran :
              </ArgonTypography>
              <ArgonTypography
                sx={{ textTransform: "uppercase" }}
                fontSize={17}
                fontWeight="bold"
                mt={2}
                ml={0.5}
                color={transaction_status === "settlement" ? "success" : "warning"}
              >
                Pending
              </ArgonTypography>
            </ArgonBox>

            <ArgonBox
              display="flex"
              flexDirection="row"
              bgColor="primary"
              alignItems="center"
              mt={7}
              py={1}
              px={2}
              color="white"
              onClick={() => this.toHistory()}
              sx={{ cursor: "pointer", borderRadius: 4 }}
            >
              <ArgonTypography color="white" fontSize={23} px={8}>
                Lanjutkan
              </ArgonTypography>
              <Icon>arrow_forward_icon</Icon>
            </ArgonBox>
          </Box>
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  updatePesananLoading: state.PesananReducer.updatePesananLoading,
});

export default connect(mapStateToProps, null)(UnFinish);
