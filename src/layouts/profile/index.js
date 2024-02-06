// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";

// Argon Dashboard 2 MUI example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import ProfilesList from "examples/Lists/ProfilesList";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";
import PlaceholderCard from "examples/Cards/PlaceholderCard";

// Overview page components
import Header from "layouts/profile/components/Header";
import PlatformSettings from "layouts/profile/components/PlatformSettings";

// Data
import profilesListData from "layouts/profile/data/profilesListData";

// Images
import homeDecor1 from "assets/images/home-decor-1.jpg";
import homeDecor2 from "assets/images/home-decor-2.jpg";
import homeDecor3 from "assets/images/home-decor-3.jpg";
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import { checkAuthentication } from "../../utils/checkAuthentication/index";
const bgImage =
  "https://imgsrv2.voi.id/nHeoXhUuyNuplc6AczUMqkBrCx69DxO0_Zyq-cVv4nY/auto/1280/853/sm/1/bG9jYWw6Ly8vcHVibGlzaGVycy8yMTg0OTIvMjAyMjEwMTQxMTQzLW1haW4uanBn.jpg";

function Overview() {
  const user = JSON.parse(window.localStorage.getItem("user"));

  return (
    <DashboardLayout
      sx={{
        backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
          `${linearGradient(
            rgba(gradients.primary.main, 0.8),
            rgba(gradients.primary.state, 0.8)
          )}, url(${bgImage})`,
        backgroundPositionY: "80%",
      }}
    >
      <Header fullName={user.fullName} photo={user.photo} />
      <ArgonBox mt={5} mb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} xl={12}>
            <ProfileInfoCard
              title="profile information"
              description={user.profile_information}
              info={{
                username: user.username,
                mobile: user.noHp,
                email: user.email,
                location: user.address,
              }}
              social={[
                {
                  link: "https://www.facebook.com/hadishirath",
                  icon: <FacebookIcon />,
                  color: "facebook",
                },
                {
                  link: "https://twitter.com/HadiShirath_",
                  icon: <TwitterIcon />,
                  color: "twitter",
                },
                {
                  link: "https://www.instagram.com/hadi.shirath",
                  icon: <InstagramIcon />,
                  color: "instagram",
                },
              ]}
              action={{ route: "", tooltip: "Edit Profile" }}
            />
          </Grid>
        </Grid>
      </ArgonBox>

      <Footer />
    </DashboardLayout>
  );
}

export default checkAuthentication(Overview);
