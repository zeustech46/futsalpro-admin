import ArgonBox from "components/ArgonBox/index";
import ArgonTypography from "components/ArgonTypography";
import Card from "@mui/material/Card";
import { alpha } from "@mui/material/styles";
import LapanganVinyl from "assets/images/lapangan-vinyl.png";
import LapanganRumput from "assets/images/lapangan-rumput.png";
import { numberWithCommas } from "../../../../utils/numberFormat/index";
import Icon from "@mui/material/Icon";
import { formatDate } from "../../../../utils/formatDate/index";
import ArgonButton from "components/ArgonButton";
import { deleteKeranjang } from "../../../../action/KeranjangAction";
import { connect } from "react-redux";
import Swal from "sweetalert2";

function CardKeranjang({
  keranjang,
  keranjangUtama,
  tanggal,
  dispatch,
  navigation,
  hariLibur,
  deleteButton,
}) {
  //membuat dataBaru yang berisi data berdasarkan tanggal
  const data = { ...keranjang };
  delete data.totalHarga;
  const dataBaru = Object.values(data);
  const dataBarudenganTanggal = dataBaru.map((item) => ({ ...item, tanggal }));

  const deleteItemKeranjang = (item) => {
    // console.log(keranjangUtama, item, keranjang.totalHarga);
    // dispatch(deleteKeranjang(keranjangUtama, item, keranjang.totalHarga));

    Swal.fire({
      title: "Hapus Jadwal",
      text: "Apakah Kamu Yakin?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      confirmButtonColor: "#d33",
      focusConfirm: false,
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteKeranjang(keranjangUtama, item, keranjang.totalHarga));

        Swal.fire({
          title: "Berhasil",
          text: "Jadwal Berhasil Dihapus",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
          // timerProgressBar: true,
        });
      }
      // } else if (
      //   /* Read more about handling dismissals below */
      //   result.dismiss === Swal.DismissReason.cancel
      // ) {
      //   Swal.fire({
      //     title: "Cancel",
      //     icon: "error",
      //   });
      // }
    });
  };

  // const color = "#fb6340";
  const color = "#627594";

  return (
    <ArgonBox mt={3}>
      <ArgonBox>
        <ArgonBox style={{ backgroundColor: alpha(color, 0.1), borderRadius: 10 }}>
          <ArgonTypography
            style={{ color: color }}
            variant="body2"
            fontWeight="medium"
            px={2}
            py={0.4}
          >
            {formatDate(tanggal)}
          </ArgonTypography>
        </ArgonBox>
      </ArgonBox>
      {dataBarudenganTanggal.map((item, index) => {
        return (
          <ArgonBox
            key={index}
            mt={2}
            mx={2}
            sx={{
              borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                `${borderWidth[1]} solid ${borderColor}`,
            }}
          >
            <ArgonBox
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <ArgonBox display="flex" flexDirection="row">
                <ArgonTypography variant="caption" mr={1}>
                  {index + 1 + ". "}
                </ArgonTypography>

                <ArgonBox
                  component="img"
                  src={item.nama === "vinyl" ? LapanganVinyl : LapanganRumput}
                  width={60}
                  height={60}
                  mb={3}
                />
                <ArgonBox ml={2} display="flex" flexDirection="column">
                  <ArgonTypography
                    variant="button"
                    color="primary"
                    fontWeight="medium"
                    fontSize={16}
                    textTransform="capitalize"
                  >
                    Lapangan {item.nama}
                  </ArgonTypography>
                  <ArgonTypography
                    variant="button"
                    color="text"
                    fontWeight="regular"
                    textTransform="capitalize"
                  >
                    {item.category === "pagi" ? "pagi-sore" : "malam"}
                  </ArgonTypography>
                  <ArgonTypography
                    variant="button"
                    color="text"
                    fontWeight="medium"
                    textTransform="capitalize"
                  >
                    {"Rp. " + numberWithCommas(item.harga) + " /Jam"}
                  </ArgonTypography>
                </ArgonBox>
              </ArgonBox>

              {deleteButton && (
                <ArgonBox
                  display="flex"
                  p={1}
                  sx={{
                    backgroundColor: "#FFEDED",
                    borderRadius: 3,
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => deleteItemKeranjang(item)}
                >
                  <Icon
                    style={{
                      color: "red",
                      marginRight: 4,
                    }}
                  >
                    delete
                  </Icon>
                  <ArgonTypography fontWeight="medium" fontSize={15} color="error" mr={0.5}>
                    Hapus
                  </ArgonTypography>
                </ArgonBox>
              )}
            </ArgonBox>

            <ArgonBox>
              <ArgonBox
                display="flex"
                flexWrap="wrap"
                flexDirection="row"
                alignItems="center"
                ml={2}
                mb={1}
              >
                <ArgonTypography variant="button" fontWeight="medium" mr={1}>
                  Waktu :
                </ArgonTypography>
                <ArgonBox display="flex" flexDirection="row" flexWrap="wrap">
                  {item.waktu.map((key, index) => {
                    return (
                      <ArgonBox
                        key={index}
                        sx={{ backgroundColor: "#F5F5F9", borderRadius: 2 }}
                        mr={1}
                        my={1}
                      >
                        <ArgonTypography fontWeight="medium" color="text" fontSize={11} mx={1}>
                          {key}
                        </ArgonTypography>
                      </ArgonBox>
                    );
                  })}
                </ArgonBox>
              </ArgonBox>

              {!hariLibur ? (
                <ArgonBox display="flex" flexDirection="row" alignItems="center" ml={2} mb={3}>
                  <ArgonTypography variant="button" fontWeight="medium" mr={1}>
                    Total Harga :
                  </ArgonTypography>
                  <ArgonTypography variant="button" color="warning" fontWeight="medium" mr={1}>
                    {"Rp. " + numberWithCommas(item.hargaTotal)}
                  </ArgonTypography>
                </ArgonBox>
              ) : (
                []
              )}
            </ArgonBox>
          </ArgonBox>
        );
      })}
    </ArgonBox>
  );
}

export default connect()(CardKeranjang);
