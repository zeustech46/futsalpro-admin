// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import LogoFutsalPro from "assets/images/logo-futsalpro.png";

// Argon Dashboard 2 MUI example components
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import PageLayout from "examples/LayoutContainers/PageLayout";
import Card from "@mui/material/Card";

function IllustrationLayout({ color, header, title, description, button, illustration, children }) {
  return (
    <PageLayout background="white">
      <Grid container>
        <Grid item xs={12} lg={6}>
          <ArgonBox
            display={{ xs: "none", lg: "flex" }}
            flexDirection="column"
            justifyContent="end"
            alignItems="center"
            width="calc(100% - 2rem)"
            height="calc(100% - 2rem)"
            position="relative"
            textAlign="start"
            borderRadius="lg"
          >
            <ArgonBox
              component="img"
              src={illustration.image}
              alt="background"
              width="130%"
              height="100%"
              position="absolute"
              bottom={0}
              left={0}
            />
          </ArgonBox>
        </Grid>
        <Grid item xs={11} sm={8} md={6} lg={4} xl={3} sx={{ mx: "auto" }}>
          <ArgonBox
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="100vh"
          >
            <Card sx={{ px: 8, py: 6 }}>
              <ArgonBox py={3}>
                <ArgonBox mb={8}>
                  <ArgonBox
                    component="img"
                    src={LogoFutsalPro}
                    height={90}
                    alt="background"
                    px={5}
                  />
                </ArgonBox>
                <>
                  <ArgonBox mb={1}>
                    <ArgonTypography variant="h5" fontWeight="bold">
                      {title}
                    </ArgonTypography>
                  </ArgonBox>
                  <ArgonTypography variant="body2" fontWeight="regular" color="text">
                    {description}
                  </ArgonTypography>
                </>
                <ArgonBox pt={5}>{children}</ArgonBox>
              </ArgonBox>
            </Card>
          </ArgonBox>
        </Grid>
      </Grid>
    </PageLayout>
  );
}

// Setting default values for the props of IllustrationLayout
IllustrationLayout.defaultProps = {
  color: "primary",
  header: "",
  title: "",
  description: "",
  button: { color: "primary" },
  illustration: {},
};

// Typechecking props for the IllustrationLayout
IllustrationLayout.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  header: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
  button: PropTypes.object,
  children: PropTypes.node.isRequired,
  illustration: PropTypes.shape({
    image: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
  }),
};

export default IllustrationLayout;
