import { dispatchLoading, dispatchSuccess, dispatchError } from "../utils/dispatch/index";
import { ref, onValue, query, orderByChild, equalTo } from "firebase/database";
import { db } from "../config/Firebase/index";
import axios from "axios";
import { URL_QUOTES, URL_PICTURES, HEADER_PICTURES, API_TIMEOUT } from "../utils/constant/index";
import { hitungTotalHarga } from "utils/totalHarga/index";

export const GET_LIST_USER_TOTAL = "GET_LIST_USER_TOTAL";
export const GET_LIST_QUOTES = "GET_LIST_QUOTES";
export const ORDER_TODAY = "ORDER_TODAY";
export const MONEY_TODAY = "MONEY_TODAY";
export const SALES_THIS_MONTH = "SALES_THIS_MONTH";
export const SALES_SIX_MONTH = "SALES_SIX_MONTH";

export const getListUserTotal = () => {
  return (dispatch) => {
    dispatchLoading(dispatch, GET_LIST_USER_TOTAL);

    onValue(
      ref(db, `users/`),
      (snapshot) => {
        if (snapshot.val()) {
          const lengthData = Object.keys(snapshot.val()).length;
          dispatchSuccess(dispatch, GET_LIST_USER_TOTAL, lengthData);
        }
      },
      {
        onlyOnce: true,
      }
    );
  };
};

export const getListQuotes = () => {
  return (dispatch) => {
    dispatchLoading(dispatch, GET_LIST_QUOTES);

    axios({
      method: "get",
      url: URL_QUOTES,
    })
      .then((res) => {
        dispatchSuccess(dispatch, GET_LIST_QUOTES, res.data);
      })
      .catch((error) => {
        dispatchError(dispatch, GET_LIST_QUOTES, error);
      });
  };
};

export const orderToday = (tanggal) => {
  return (dispatch) => {
    dispatchLoading(dispatch, ORDER_TODAY);

    onValue(
      ref(db, `pesanans/${tanggal}`),
      (snapshot) => {
        if (snapshot.val()) {
          const dataDB = snapshot.val();
          delete dataDB.bulan;

          dispatchSuccess(dispatch, ORDER_TODAY, dataDB);
        }
      },
      {
        onlyOnce: true,
      }
    );
  };
};

export const moneyToday = (tanggal) => {
  return (dispatch) => {
    dispatchLoading(dispatch, MONEY_TODAY);

    let tanggalSekarang = new Date(tanggal);
    // Mengurangkan 1 hari dari tanggal sekarang
    tanggalSekarang.setDate(tanggalSekarang.getDate() - 1);
    // Format tanggal menjadi YYYY-MM-DD
    let tanggalSehariSebelum = tanggalSekarang.toISOString().split("T")[0];

    const dataTanggal = [tanggalSehariSebelum, tanggal];

    let dataHari = [];

    dataTanggal.map((item, index) => {
      onValue(
        ref(db, `pesanans/${item}`),
        (snapshot) => {
          if (snapshot.val()) {
            const dataDB = snapshot.val();
            delete dataDB.bulan;

            dataHari[index] = dataDB;
          } else {
            dataHari[index] = [];
          }

          if (dataHari[0] && dataHari[1]) {
            dispatchSuccess(dispatch, MONEY_TODAY, dataHari);
          }
        },
        {
          onlyOnce: true,
        }
      );
    });
  };
};

export const salesThisMonth = (tanggal) => {
  return (dispatch) => {
    dispatchLoading(dispatch, SALES_THIS_MONTH);

    // Tanggal awal
    var tanggalAwal = new Date(tanggal);

    // Mendapatkan tanggal satu bulan sebelumnya
    var tanggalSebulanSebelumnya = new Date(tanggalAwal);
    tanggalSebulanSebelumnya.setMonth(tanggalAwal.getMonth() - 1);

    // Format tanggal menjadi "YYYY-MM-DD"
    var dataBulanKemarin = tanggalSebulanSebelumnya.toISOString().split("T")[0];

    //ubah menjadi format "YYYY--MM"
    const bulanIni = tanggal.slice(0, 7);
    const bulanKemarin = dataBulanKemarin.slice(0, 7);

    const dataListBulan = [bulanKemarin, bulanIni];

    let dataBulan = [];

    dataListBulan.map((item, index) => {
      onValue(
        query(ref(db, "pesanans/"), orderByChild("bulan"), equalTo(item)),
        (snapshot) => {
          if (snapshot.val()) {
            // berhasil
            const dataDB = Object.values(snapshot.val());

            //hapus bulan disetiap data
            const dataDBNew = Object.fromEntries(
              Object.entries(dataDB).map(([tanggal, entri]) => {
                delete entri.bulan;
                return [tanggal, entri];
              })
            );

            dataBulan[index] = dataDBNew;
          } else {
            dataBulan[index] = [];
          }

          if (dataBulan[0] && dataBulan[1]) {
            dispatchSuccess(dispatch, SALES_THIS_MONTH, dataBulan);
          }
        },
        {
          onlyOnce: true,
        }
      );
    });
  };
};

export const salesSixMonths = (data) => {
  return (dispatch) => {
    dispatchLoading(dispatch, SALES_SIX_MONTH);

    let dataHasil = [];

    data.map((item, index) => {
      onValue(
        query(ref(db, "pesanans/"), orderByChild("bulan"), equalTo(item)),
        (snapshot) => {
          if (snapshot.val()) {
            // berhasil
            const dataDB = Object.values(snapshot.val());

            //hapus bulan disetiap data
            const dataDBNew = Object.fromEntries(
              Object.entries(dataDB).map(([tanggal, entri]) => {
                delete entri.bulan;
                return [tanggal, entri];
              })
            );

            const hasilPerhitunganBulan = Object.keys(dataDBNew).map((item) =>
              hitungTotalHarga(dataDBNew[item])
            );

            const jumlahHargaBulanIni = hasilPerhitunganBulan.reduce(
              (total, nilai) => total + nilai,
              0
            );

            dataHasil[index] = jumlahHargaBulanIni;
          } else {
            dataHasil[index] = 0;
          }

          if (index === 5) {
            dispatchSuccess(dispatch, SALES_SIX_MONTH, dataHasil);
          }
        },
        {
          onlyOnce: true,
        }
      );
    });
  };
};
