// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Icon from "@mui/material/Icon";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonButton from "components/ArgonButton";
import ArgonProgress from "components/ArgonProgress";

import LapanganVinyl from "assets/images/lapangan-vinyl.png";
import LapanganRumput from "assets/images/lapangan-rumput.png";
import pxToRem from "assets/theme/functions/pxToRem";
import { percentBar } from "../../../../utils/percentBar/index";
import { Link } from "react-router-dom";
import { valueRating } from "../../../../utils/numberRating/index";

function ListToday({ name, category, dataSchedule, rating, idLapangan }) {
  const dataPercentBar = dataSchedule ? percentBar(dataSchedule, category) : 0;

  const captionPercentBar = (dataPercent) => {
    if (dataPercent < 50) {
      return "Tersedia";
    }
    if (dataPercent < 100) {
      return "Hampir Habis";
    }
    if (dataPercent === 100) {
      return "Habis";
    }
  };

  const gambar = name === "vinyl" ? LapanganVinyl : LapanganRumput;

  return (
    <ArgonBox key={name}>
      <ArgonButton
        sx={{ borderRadius: 6 }}
        component={Link}
        to={"/keranjang?item=" + idLapangan + "&name=" + name + "&category=" + category}
      >
        <ArgonBox justifyContent="space-between" alignItems="center" pt={2} pb={2}>
          <ArgonBox display="flex" flexDirection="column">
            <ArgonBox>
              <ArgonBox
                display="flex"
                flexDirection="row"
                alignItems="center"
                px={1.8}
                py={0.7}
                sx={{
                  position: "absolute",
                  backgroundColor: "#FFF5DA",
                  borderRadius: 3,
                  top: 20,
                  left: 20,
                }}
              >
                <Icon sx={{ color: "#FFB800" }}>star</Icon>
                <ArgonBox display="flex" flexDirection="column">
                  <ArgonTypography
                    variant="h5"
                    textTransform="capitalize"
                    color="text"
                    fontSize={17}
                  >
                    {valueRating(rating)}
                  </ArgonTypography>
                </ArgonBox>
              </ArgonBox>
              <ArgonBox component="img" src={gambar} width={110} height={100} mb={1} mx={4} />
            </ArgonBox>
            <ArgonBox display="flex" flexDirection="column">
              <ArgonTypography
                variant="h5"
                fontSize={18}
                textTransform="capitalize"
                fontWeight="medium"
                color="primary"
                gutterBottom
              >
                Lapangan {name}
              </ArgonTypography>
              <ArgonTypography
                variant="button"
                textTransform="capitalize"
                fontWeight="medium"
                fontSize={13}
                color="text"
              >
                Jadwal {category === "pagi" ? "pagi-sore" : "malam"}
              </ArgonTypography>
            </ArgonBox>
          </ArgonBox>

          <ArgonBox width="100%" mt={3}>
            <ArgonBox mb={1} px={1}>
              <ArgonProgress
                sx={{ height: 3 }}
                value={dataPercentBar}
                color={
                  dataPercentBar < 50
                    ? "success"
                    : dataPercentBar < 80
                    ? "warning"
                    : dataPercentBar < 100
                    ? "error"
                    : "dark"
                }
                variant="gradient"
                label={false}
              />
            </ArgonBox>
            <ArgonTypography
              variant="caption"
              fontSize={13}
              color={
                dataPercentBar < 50
                  ? "success"
                  : dataPercentBar < 80
                  ? "warning"
                  : dataPercentBar < 100
                  ? "error"
                  : "dark"
              }
            >
              {captionPercentBar(dataPercentBar)}
            </ArgonTypography>
          </ArgonBox>
        </ArgonBox>
      </ArgonButton>
    </ArgonBox>
  );
}

// Typechecking props of the Transaction
ListToday.propTypes = {
  name: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
};

export default ListToday;
