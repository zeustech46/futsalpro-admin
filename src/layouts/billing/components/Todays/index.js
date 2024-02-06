// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import React, { Component } from "react";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import { getListFields } from "../../../../action/FieldAction";
import { checkSchedule } from "../../../../action/PesananAction";

// import ArgonButton from "components/ArgonButton";

// Billing page components
import ListToday from "layouts/billing/components/ListToday";
import ArgonButton from "components/ArgonButton";
import { formatDate } from "../../../../utils/formatDate/index";
import { connect } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";

class Todays extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: new Date().toLocaleDateString("en-CA"),
      dataSchedule: [],
    };
  }
  componentDidMount() {
    this.props.dispatch(getListFields());
    this.props.dispatch(checkSchedule(this.state.date));
  }

  componentDidUpdate(prevProps) {
    const { checkScheduleResult } = this.props;

    if (checkScheduleResult && prevProps.checkScheduleResult !== checkScheduleResult) {
      this.setState({
        dataSchedule: checkScheduleResult,
      });
    }
  }

  render() {
    const { date, dataSchedule } = this.state;
    const { listFieldsResult, listFieldsLoading, checkScheduleResult } = this.props;

    return (
      <Card sx={{ height: "100%", marginBottom: 3 }}>
        <ArgonBox
          sx={{
            borderBottom: ({ borders: { borderWidth, borderColor } }) =>
              `${borderWidth[1]} solid ${borderColor}`,
          }}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          pt={4}
          pb={3}
          mx={3}
        >
          <ArgonBox ml={2}>
            <ArgonTypography variant="h4" fontWeight="bold" textTransform="capitalize">
              Jadwal Hari Ini
            </ArgonTypography>

            <ArgonBox display="flex" pt={1} alignItems="center">
              <ArgonBox color="text" mr={1} lineHeight={0}>
                <Icon color="warning" fontSize="small">
                  date_range
                </Icon>
              </ArgonBox>
              <ArgonTypography
                variant="h5"
                textTransform="capitalize"
                fontWeight="medium"
                color="warning"
              >
                {formatDate(date)}
              </ArgonTypography>
            </ArgonBox>
          </ArgonBox>

          <ArgonBox display="flex" justifyContent="center" mr={2}>
            <ArgonButton
              component={Link}
              to="/keranjang"
              color="warning"
              size="large"
              variant="gradient"
            >
              <Icon color="inherit" fontSize="small">
                add
              </Icon>
              <ArgonTypography variant="button" color="white" pl={2} fontSize={17}>
                Pesan jadwal
              </ArgonTypography>
            </ArgonButton>
          </ArgonBox>
        </ArgonBox>

        <ArgonBox pt={2} pb={2} px={4}>
          <ArgonBox
            component="ul"
            display="flex"
            flexDirection="column"
            p={0}
            m={0}
            sx={{ listStyle: "none" }}
            mt={1}
            mb={2}
          >
            <ArgonTypography
              variant="caption"
              color="text"
              fontWeight="bold"
              textTransform="uppercase"
            >
              Jadwal Tersedia Hari Ini
            </ArgonTypography>
          </ArgonBox>

          <ArgonBox
            component="ul"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            flexWrap="wrap"
            px={5}
            m={0}
            sx={{ listStyle: "none" }}
          >
            {listFieldsResult ? (
              Object.keys(listFieldsResult).map((key, index) => {
                return (
                  <ListToday
                    key={index}
                    name={listFieldsResult[key].nama}
                    category={listFieldsResult[key].category}
                    rating={listFieldsResult[key].rating}
                    idLapangan={listFieldsResult[key].idLapangan}
                    dataSchedule={
                      dataSchedule[listFieldsResult[key].nama]
                        ? dataSchedule[listFieldsResult[key].nama]
                        : []
                    }
                  />
                );
              })
            ) : listFieldsLoading ? (
              <ArgonBox
                sx={{
                  display: "flex",
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                <CircularProgress />
              </ArgonBox>
            ) : (
              []
            )}
          </ArgonBox>
        </ArgonBox>
      </Card>
    );
  }
}

const mapStateToProps = (state) => ({
  listFieldsResult: state.FieldReducer.listFieldsResult,
  listFieldsLoading: state.FieldReducer.listFieldsLoading,

  checkScheduleResult: state.PesananReducer.checkScheduleResult,
  checkScheduleLoading: state.PesananReducer.checkScheduleLoading,
});

export default connect(mapStateToProps, null)(Todays);
