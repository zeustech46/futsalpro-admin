import { useState, useEffect } from "react";

// react-router components
import { useLocation, Link, Navigate } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";
import Grid from "@mui/material/Grid";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonAvatar from "components/ArgonAvatar";
import ArgonInput from "components/ArgonInput";
import Slide from "@mui/material/Slide";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";

// Argon Dashboard 2 MUI example components
import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarDesktopMenu,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Argon Dashboard 2 MUI context
import {
  useArgonController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";

// Images
import logoSpotify from "assets/images/small-logos/logo-spotify.svg";
import MenuItem from "@mui/material/MenuItem";
import burceMars from "assets/images/bruce-mars.jpg";
import Swal from "sweetalert2";
import { connect } from "react-redux";
import { logOutUser } from "../../../action/AuthAction";

function DashboardNavbar({ absolute, light, isMini, dispatch: reduxDispatch, logoutResult }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useArgonController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);
  const [movePage, setMovePage] = useState(false);

  //data admin
  const user = JSON.parse(window.localStorage.getItem("user"));

  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    /** 
     The event listener that's calling the handleTransparentNavbar function when 
     scrolling the window.
    */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  // Render the notifications menu

  const dialogLogout = () => {
    handleCloseMenu();

    Swal.fire({
      title: "Keluar Akun",
      text: "Apakah Kamu Yakin?",
      // icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Keluar",
      confirmButtonColor: "#d33",
      focusConfirm: false,
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setMovePage(true);
        reduxDispatch(logOutUser());
      }
    });
  };

  const renderMenu = () => (
    <Menu anchorEl={openMenu} open={Boolean(openMenu)} onClose={handleCloseMenu}>
      <MenuItem onClick={dialogLogout}>
        <ArgonBox px={4}>
          <Icon
            sx={{
              mr: 1,
            }}
          >
            logout
          </Icon>
          <ArgonTypography variant="button" textTransform="capitalize" color="warning">
            <strong>Keluar</strong>
          </ArgonTypography>
        </ArgonBox>
      </MenuItem>
    </Menu>
  );

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme, { navbarType })}>
        <ArgonBox
          color={light && transparentNavbar ? "white" : "dark"}
          mb={{ xs: 1, md: 0 }}
          sx={(theme) => navbarRow(theme, { isMini })}
        >
          <Breadcrumbs
            icon="home"
            title={route[route.length - 1]}
            route={route}
            light={transparentNavbar ? light : false}
          />
          <Icon fontSize="medium" sx={navbarDesktopMenu} onClick={handleMiniSidenav}>
            {miniSidenav ? "menu_open" : "menu"}
          </Icon>
        </ArgonBox>

        {isMini ? null : (
          <ArgonBox sx={(theme) => navbarRow(theme, { isMini })}>
            {/* <ArgonBox pr={1}>
              <ArgonInput
                placeholder="Type here..."
                startAdornment={
                  <Icon fontSize="small" style={{ marginRight: "6px" }}>
                    search
                  </Icon>
                }
              />
            </ArgonBox> */}

            <ArgonBox color={light ? "white" : "inherit"}>
              <IconButton
                size="small"
                color={light && transparentNavbar ? "white" : "dark"}
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon>{miniSidenav ? "menu_open" : "menu"}</Icon>
              </IconButton>

              <Link to="/keranjang">
                <IconButton
                  size="small"
                  color={light && transparentNavbar ? "white" : "dark"}
                  sx={navbarIconButton}
                >
                  <Icon>shopping_cart</Icon>
                </IconButton>
              </Link>

              {!user && <Navigate to="/login" />}

              <IconButton
                size="small"
                color={light && transparentNavbar ? "white" : "dark"}
                sx={navbarIconButton}
                aria-controls="notification-menu"
                aria-haspopup="true"
                variant="contained"
                onClick={handleOpenMenu}
              >
                <Grid>
                  {user && user.photo && (
                    <ArgonAvatar
                      src={`data:image/png;base64, ${user.photo}`}
                      alt="profile-image"
                      variant="rounded"
                      size="xs"
                      shadow="sm"
                    />
                  )}
                </Grid>
                <ArgonTypography
                  variant="body2"
                  fontWeight="medium"
                  color={light && transparentNavbar ? "white" : "dark"}
                >
                  {user && user.username}
                </ArgonTypography>
                <Icon sx={{ ml: 1 }}>keyboard_arrow_down</Icon>
              </IconButton>
              {renderMenu()}
            </ArgonBox>
          </ArgonBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: true,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  logoutResult: state.AuthReducer.logoutResult,
});

export default connect(mapStateToProps, null)(DashboardNavbar);
