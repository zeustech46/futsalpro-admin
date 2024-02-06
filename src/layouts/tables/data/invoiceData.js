/* eslint-disable react/prop-types */
// @mui material components
import Icon from "@mui/material/Icon";
import Card from "@mui/material/Card";
import { alpha } from "@mui/material/styles";
// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonProgress from "components/ArgonProgress";
import ArgonButton from "components/ArgonButton";
import { Link } from "react-router-dom";

// Images
import logoSpotify from "assets/images/small-logos/logo-spotify.svg";
import logoInvesion from "assets/images/small-logos/logo-invision.svg";
import logoJira from "assets/images/small-logos/logo-jira.svg";
import logoSlack from "assets/images/small-logos/logo-slack.svg";
import logoWebDev from "assets/images/small-logos/logo-webdev.svg";
import logoXD from "assets/images/small-logos/logo-xd.svg";
import { connect } from "react-redux";
import { numberWithCommas } from "../../../utils/numberFormat/index";
import { generatePDF } from "../../../utils/printPdf/index";

function Completion({ value, color }) {
  return (
    <ArgonBox display="flex" alignItems="center">
      <ArgonTypography variant="caption" color="text" fontWeight="medium">
        {value}%&nbsp;
      </ArgonTypography>
      <ArgonBox width="8rem">
        <ArgonProgress value={value} color={color} variant="gradient" label={false} />
      </ArgonBox>
    </ArgonBox>
  );
}

export function Status({ value }) {
  let color;
  if (value === "pending") {
    color = "#fb6340";
  } else if (value === "lunas") {
    color = "#65CB8F";
  } else {
    color = "#f5365c";
  }

  return (
    <Card
      style={{
        backgroundColor: alpha(color, 0.1),
      }}
    >
      <ArgonTypography
        style={{ color: color }}
        textTransform="uppercase"
        variant="caption"
        fontWeight="medium"
        px={2}
        py={0.4}
      >
        {value}
      </ArgonTypography>
    </Card>
  );
}

export function Item({ value }) {
  return (
    <ArgonTypography variant="button" color="text" fontWeight="medium">
      {value}
    </ArgonTypography>
  );
}

export function Users({ value, uid, hariLibur }) {
  return (
    <>
      {uid ? (
        <Link to={"/user/" + uid}>
          <ArgonBox sx={{ cursor: "pointer" }}>
            <ArgonTypography
              variant="button"
              color={hariLibur ? "error" : "text"}
              fontWeight="medium"
            >
              {value}
            </ArgonTypography>
          </ArgonBox>
        </Link>
      ) : (
        <ArgonBox>
          <ArgonTypography
            variant="button"
            color={hariLibur ? "error" : "text"}
            fontWeight="medium"
          >
            {value}
          </ArgonTypography>
        </ArgonBox>
      )}
    </>
  );
}

export function Total({ value }) {
  return (
    <ArgonTypography variant="button" color="text" fontWeight="medium">
      {value ? "Rp. " + numberWithCommas(value) : "Rp. 0,-"}
    </ArgonTypography>
  );
}

export const cetak = (
  <ArgonBox>
    <ArgonButton variant="outlined" size="small" color="primary" onClick={() => generatePDF()}>
      <ArgonBox color="primary" mr={1}>
        <Icon color="inherit" fontSize="medium">
          picture_as_pdf
        </Icon>
      </ArgonBox>
      Cetak
    </ArgonButton>
  </ArgonBox>
);

const invoiceData = {
  columns: [
    { name: "no", align: "center" },
    { name: "invoice", align: "left" },
    { name: "name", align: "left" },
    { name: "tanggal_order", align: "center" },
    { name: "total", align: "center" },
    { name: "status", align: "center" },
    { name: "aksi", align: "center" },
  ],
};

export default invoiceData;
