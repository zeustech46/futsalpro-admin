import React, { Component } from "react";
import { Link, Navigate } from "react-router-dom";
import { connect } from "react-redux";
import Switch from "@mui/material/Switch";
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonInput from "components/ArgonInput";
import ArgonButton from "components/ArgonButton";
import IllustrationLayout from "layouts/authentication/components/IllustrationLayout";
import { loginUser } from "../../../action/AuthAction";
import bgImage from "assets/images/signin-illustration.jpg";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { checkAuthenticationLogin } from "../../../utils/checkAuthentication/index";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movePage: false,

      formData: {
        email: "",
        password: "",
      },
    };
  }
  componentDidMount() {
    console.log(window.localStorage.getItem("user"));
    window.localStorage.getItem("user") ? this.setState({ movePage: true }) : [];
  }

  componentDidUpdate(prevProps) {
    const { loginResult } = this.props;

    if (loginResult && prevProps.loginResult !== loginResult) {
      this.setState({
        movePage: true,
      });
    }
  }

  onSubmit() {
    const { formData } = this.state;
    this.props.dispatch(loginUser(formData.email, formData.password));
  }

  handleInputChange(fieldName, event) {
    const { value } = event.target;

    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [fieldName]: event.target.value,
      },
    }));
  }

  render() {
    const { rememberMe, formData, movePage } = this.state;
    const { loginLoading, loginResult } = this.props;

    return (
      <>
        {loginLoading && (
          <Box
            sx={{
              display: "flex",
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              position: "absolute",
              zIndex: 1,
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
        <IllustrationLayout
          title="Login Admin"
          description="Masukkan email dan password"
          illustration={{
            image: bgImage,
          }}
        >
          <ArgonBox component="form" role="form">
            {movePage && <Navigate to="/dashboard" />}

            <ArgonBox mb={2}>
              <ArgonInput
                type="email"
                value={formData.email}
                onChange={(event) => this.handleInputChange("email", event)}
                placeholder="Email"
                size="large"
              />
            </ArgonBox>
            <ArgonBox mb={2}>
              <ArgonInput
                type="password"
                value={formData.password}
                onChange={(event) => this.handleInputChange("password", event)}
                placeholder="Password"
                size="large"
              />
            </ArgonBox>

            <ArgonBox mt={5} mb={1} onClick={() => this.onSubmit()}>
              <ArgonButton color="primary" size="large" fullWidth>
                Login
              </ArgonButton>
            </ArgonBox>
          </ArgonBox>
        </IllustrationLayout>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  loginResult: state.AuthReducer.loginResult,
  loginLoading: state.AuthReducer.loginLoading,
});

export default connect(mapStateToProps, null)(Login);
