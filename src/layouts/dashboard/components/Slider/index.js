import { useRef } from "react";

// SwiperJS
import SwiperCore, { Autoplay, Navigation } from "swiper";

// SwiperJS react components
import { Swiper, SwiperSlide } from "swiper/react";

// SwiperJS styles
import "swiper/swiper-bundle.min.css";

// @mui material components
import Card from "@mui/material/Card";
import Skeleton from "@mui/material/Skeleton";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";

// Images
import bg1 from "assets/images/img-2.jpg";
import bg2 from "assets/images/img-1.jpg";
import bg3 from "assets/images/img-3.jpg";

import { connect } from "react-redux";

function Slider({ listQuotesResult, listPicturesResult }) {
  // install SwiperJS modules
  SwiperCore.use([Autoplay, Navigation]);

  // SwiperJS navigation buttons ref
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);

  const slider = [bg3, bg2, bg1];
  const sliderQoutes = listQuotesResult;

  return (
    <Card sx={{ position: "relative", display: "block", height: "100%", overflow: "hidden" }}>
      <Swiper
        onInit={({ params, navigation }) => {
          const { navigation: nav } = params;

          nav.prevEl = navigationPrevRef.current;
          nav.nextEl = navigationNextRef.current;
          navigation.init();
          navigation.update();
        }}
        autoplay={{ delay: 5000 }}
        speed={300}
        spaceBetween={0}
        slidesPerView={1}
        loop
        style={{ height: "100%" }}
      >
        <ArgonBox
          display="flex"
          alignItems="center"
          position="absolute"
          top={12}
          right={12}
          zIndex={5}
        >
          <ArgonBox
            width="3.25rem"
            height="3.25rem"
            color="white"
            p={2}
            sx={{ cursor: "pointer" }}
            ref={navigationPrevRef}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </ArgonBox>
          <ArgonBox
            width="3.25rem"
            height="3.25rem"
            color="white"
            p={2}
            sx={{ cursor: "pointer" }}
            ref={navigationNextRef}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </ArgonBox>
        </ArgonBox>

        {slider.map((item, index) => (
          <SwiperSlide key={index}>
            {/* {listPicturesResult ? ( */}
            <ArgonBox
              sx={{
                position: "relative",
                backgroundImage: ({
                  functions: { rgba, linearGradient },
                  palette: { gradients },
                }) =>
                  `${linearGradient(
                    rgba(gradients.primary.main, 0.5),
                    rgba(gradients.primary.state, 0.5)
                  )}, url(${item})`,
                backgroundSize: "cover",
                height: "100%",
              }}
            >
              <ArgonBox
                position="absolute"
                bottom={16}
                ml={6}
                py={2.5}
                textAlign="left"
                width="80%"
              >
                <ArgonBox
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width="32px"
                  height="32px"
                  bgColor="white"
                  borderRadius="md"
                  textAlign="center"
                  mb={2}
                >
                  <ArgonTypography variant="caption" lineHeight={0}>
                    <ArgonBox component="i" color="dark" className="ni ni-bulb-61" />
                  </ArgonTypography>
                </ArgonBox>
                <ArgonTypography variant="h5" color="white" mb={0.5}>
                  &quot;{sliderQoutes ? sliderQoutes[index].author : ""}&quot;
                </ArgonTypography>
                <ArgonTypography variant="h3" color="white">
                  {sliderQoutes ? sliderQoutes[index].content : ""}
                </ArgonTypography>
              </ArgonBox>
            </ArgonBox>
            {/* ) : (
              <Skeleton variant="rounded" animation="wave" width="100%" height="100%" />
            )} */}
          </SwiperSlide>
        ))}
      </Swiper>
    </Card>
  );
}

const mapStateToProps = (state) => ({
  listQuotesResult: state.DashboardReducer.listQuotesResult,
  listQuotesLoading: state.DashboardReducer.listQuotesLoading,

  listPicturesResult: state.DashboardReducer.listPicturesResult,
  listPicturesLoading: state.DashboardReducer.listPicturesLoading,
});

export default connect(mapStateToProps, null)(Slider);
