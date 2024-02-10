import {
  ref,
  onValue,
  query,
  orderByChild,
  equalTo,
  get,
  limitToLast,
  endAt,
  remove,
  set,
  update,
} from "firebase/database";
import { db } from "../config/Firebase/index";
import { dispatchLoading, dispatchSuccess, dispatchError } from "../utils/dispatch/index";
import axios from "axios";

import { URL_MIDTRANS_STATUS, HEADER_MIDTRANS, API_TIMEOUT } from "../utils/constant/index";

export const CHECK_SCHEDULE = "CHECK_SCHEDULE";
export const CHECK_PESANAN = "CHECK_PESANAN";
export const CHECK_PESANAN_RANGE_DATE = "CHECK_PESANAN_RANGE_DATE";
export const UPDATE_PESANAN = "UPDATE_PESANAN";
export const DELETE_PESANAN = "DELETE_PESANAN";
export const CANCEL_PESANAN = "CANCEL_PESANAN";
export const UPDATE_PESANAN_TRANSACTION = "UPDATE_PESANAN_TRANSACTION";

export const checkSchedule = (tanggal) => {
  return (dispatch) => {
    dispatchLoading(dispatch, CHECK_SCHEDULE);

    onValue(
      ref(db, `pesanans/${tanggal}`),
      (snapshot) => {
        dispatchSuccess(dispatch, CHECK_SCHEDULE, snapshot.val());
      },
      {
        onlyOnce: true,
      }
    );
  };
};

export const checkPesanan = (tanggal, lapangan) => {
  return (dispatch) => {
    dispatchLoading(dispatch, CHECK_PESANAN);

    if (tanggal && lapangan) {
      onValue(
        ref(db, `pesanans/${tanggal}/${lapangan}`),
        (snapshot) => {
          dispatchSuccess(dispatch, CHECK_PESANAN, snapshot.val() ? snapshot.val() : []);
        },
        {
          onlyOnce: true,
        }
      );
    } else {
      onValue(
        ref(db, `pesanans/${tanggal}`),
        (snapshot) => {
          dispatchSuccess(dispatch, CHECK_PESANAN, snapshot.val() ? snapshot.val() : []);
        },
        {
          onlyOnce: true,
        }
      );
    }
  };
};

export const checkPesananRangeDate = (dataTanggal, lapangan) => {
  return (dispatch) => {
    dispatchLoading(dispatch, CHECK_PESANAN_RANGE_DATE);

    if (dataTanggal && lapangan) {
      const dataBaru = [];

      dataTanggal.map((item, index) => {
        onValue(
          ref(db, `pesanans/${item}/${lapangan}`),
          (snapshot) => {
            if (snapshot.val) {
              dataBaru.push({
                tanggal: item,
                jadwal: snapshot.val(),
              });
            } else {
              dataBaru.push({
                tanggal: item,
                jadwal: [],
              });
            }

            if (dataTanggal.length === index + 1) {
              dispatchSuccess(dispatch, CHECK_PESANAN_RANGE_DATE, dataBaru);
            }
          },
          {
            onlyOnce: true,
          }
        );
      });
    } else {
      dispatchSuccess(dispatch, CHECK_PESANAN_RANGE_DATE, "");
    }
  };
};

export const updatePesanan = (dataInput, libur) => {
  return (dispatch) => {
    dispatchLoading(dispatch, UPDATE_PESANAN);

    //get Keranjang By UID User
    onValue(
      ref(db, `keranjangs/${dataInput.uid}`),
      (snapshot) => {
        if (snapshot.val()) {
          //ambil data keranjang
          const data = snapshot.val();

          const now = new Date();
          const jam = String(now.getHours()).padStart(2, "0"); // Mendapatkan jam (dalam format 24 jam)
          const menit = String(now.getMinutes()).padStart(2, "0"); // Mendapatkan menit

          const waktuOrder = `${jam}:${menit}`;

          // hapus data di keranjang
          remove(ref(db, `keranjangs/${dataInput.uid}`));

          // data pesanan "YYYY-MM-DD":{}
          const dataBaru = { ...data.pesanans };

          const newData = Object.fromEntries(
            Object.entries(dataBaru).map(([date, bookings]) => {
              const { totalHarga, ...rest } = bookings;
              return [date, rest];
            })
          );

          onValue(
            ref(db, `admin/${dataInput.uid}`),
            (snapshot) => {
              if (snapshot.val()) {
                const dataUser = snapshot.val();

                const dataDiri = {
                  nama: dataInput.deskripsi,
                  uid: dataUser.uid,
                  photo: dataUser.photo,
                  email: dataUser.email,
                };

                const dataHistoryDB = {
                  ...data,
                  status: "lunas",
                  reminder: "",
                  tanggalOrder: new Date().toLocaleDateString("en-CA"),
                  waktuOrder: waktuOrder,
                  order_id: dataInput.order_id_user,
                  nama: dataInput.deskripsi,
                };

                if (libur) {
                  dataHistoryDB.totalHarga = 0;
                  dataHistoryDB.libur = true;
                  dataHistoryDB.status = "-";
                  dataDiri.libur = true;
                }

                set(ref(db, `histories/${dataInput.order_id}`), dataHistoryDB);

                // Transforming the data structure
                const transformedData = Object.entries(newData).reduce((acc, [date, bookings]) => {
                  const transformedBookings = Object.entries(bookings).map(([id, booking]) => ({
                    [id]: booking,
                  }));
                  acc[date] = transformedBookings;
                  return acc;
                }, {});

                const dataPesanan = Object.entries(transformedData).map(([date, bookings]) => ({
                  [date]: bookings.reduce((acc, booking) => {
                    const { nama, waktu } = Object.values(booking)[0];
                    acc[nama] = (acc[nama] || []).concat(
                      waktu.map((timeSlot) => ({ ...dataDiri, waktu: timeSlot }))
                    );
                    return acc;
                  }, {}),
                }));

                dataPesanan.map(
                  (item, index) => {
                    onValue(
                      ref(db, `pesanans/${Object.keys(item)[0]}`),
                      (snapshot) => {
                        if (snapshot.val()) {
                          const dataPesananDB = Object.keys(snapshot.val());

                          //data pesanan yang sudah di filter tanpa BULAN
                          const dataPesananDBNew = dataPesananDB.filter(
                            (filter) => filter !== "bulan"
                          );

                          const dataKeranjang = Object.keys(Object.values(item)[0]);

                          const Pesanan =
                            dataPesananDBNew.length > dataKeranjang.length
                              ? dataPesananDBNew
                              : dataKeranjang;

                          Pesanan.map((itemm) => {
                            const dataPesananFilter = snapshot.val()[itemm]
                              ? snapshot.val()[itemm]
                              : [];
                            const itemValue = Object.values(item)[0][itemm]
                              ? Object.values(item)[0][itemm]
                              : [];
                            const dataBaruu = [...dataPesananFilter, ...itemValue];

                            //update ke database
                            set(ref(db, `pesanans/${Object.keys(item)[0]}/${itemm}`), dataBaruu);
                          });

                          dispatchSuccess(dispatch, UPDATE_PESANAN, snapshot.val());
                        } else {
                          const dataPesananBaru = {
                            ...Object.values(item)[0],
                            bulan: Object.keys(item)[0].slice(0, 7),
                          };

                          set(ref(db, `pesanans/${Object.keys(item)[0]}`), dataPesananBaru);
                          dispatchSuccess(dispatch, UPDATE_PESANAN, "tambahkan data");
                        }
                      },
                      {
                        onlyOnce: true,
                      }
                    );
                  },
                  {
                    onlyOnce: true,
                  }
                );
              }
            },
            {
              onlyOnce: true,
            }
          );
        }
      },
      {
        onlyOnce: true,
      }
    );
  };
};

export const deletePesanan = (order_id_user, uid) => {
  return (dispatch) => {
    dispatchLoading(dispatch, DELETE_PESANAN);

    const order_id = `${order_id_user}-${uid}`;

    //get Keranjang By UID User
    onValue(
      ref(db, `histories/${order_id}`),
      (snapshot) => {
        if (snapshot.val()) {
          //hapus di histories
          remove(ref(db, `histories/${order_id}`));

          //ambil data keranjang
          const data = snapshot.val();
          dispatch(deletePesananDetail(data));
        }
      },
      {
        onlyOnce: true,
      }
    );
  };
};

export const deletePesananDetail = (data) => {
  return (dispatch) => {
    // data pesanan "YYYY-MM-DD":{}
    const dataBaru = { ...data.pesanans };

    const newData = Object.fromEntries(
      Object.entries(dataBaru).map(([date, bookings]) => {
        const { totalHarga, ...rest } = bookings;
        return [date, rest];
      })
    );

    // Transforming the data structure
    const transformedData = Object.entries(newData).reduce((acc, [date, bookings]) => {
      const transformedBookings = Object.entries(bookings).map(([id, booking]) => ({
        [id]: booking,
      }));
      acc[date] = transformedBookings;
      return acc;
    }, {});

    const dataPesanan = Object.entries(transformedData).map(([date, bookings]) => ({
      [date]: bookings.reduce((acc, booking) => {
        const { nama, waktu } = Object.values(booking)[0];
        acc[nama] = (acc[nama] || []).concat(waktu.map((timeSlot) => ({ waktu: timeSlot })));
        return acc;
      }, {}),
    }));

    dataPesanan.map(
      (item, index) => {
        onValue(
          ref(db, `pesanans/${Object.keys(item)[0]}`),
          (snapshot) => {
            if (snapshot.val()) {
              const dataPesananDB = Object.keys(snapshot.val());

              //data pesanan yang sudah di filter tanpa BULAN
              const dataPesananDBNew = dataPesananDB.filter((filter) => filter !== "bulan");

              const dataKeranjang = Object.keys(Object.values(item)[0]);

              //pesanan = ["vinyl", "rumput"]
              const Pesanan =
                dataPesananDBNew.length > dataKeranjang.length ? dataPesananDBNew : dataKeranjang;

              Pesanan.map((itemm) => {
                const dataPesananFilter = snapshot.val()[itemm] ? snapshot.val()[itemm] : [];
                const itemValue = Object.values(item)[0][itemm]
                  ? Object.values(item)[0][itemm]
                  : [];

                // filter data yang memiliki waktu yang sama dengan itemValue
                // itemValue = [{waktu:"10.00-11.00"}]
                const dataBaruu = dataPesananFilter.filter(
                  (filter) => !itemValue.map((t) => t.waktu).includes(filter.waktu)
                );

                //update ke database
                set(ref(db, `pesanans/${Object.keys(item)[0]}/${itemm}`), dataBaruu);
              });

              dispatchSuccess(dispatch, DELETE_PESANAN, "berhasil hapus 1");
            } else {
              remove(ref(db, `pesanans/${Object.keys(item)[0]}`));

              dispatchSuccess(dispatch, DELETE_PESANAN, "berhasil hapus 2");
            }

            onValue(
              ref(db, `pesanans/${Object.keys(item)[0]}`),
              (snapshot) => {
                const data = Object.keys(snapshot.val()).map((item) => item);

                if (data.length === 1 && data[0] === "bulan") {
                  remove(ref(db, `pesanans/${Object.keys(item)[0]}`));
                }
              },
              {
                onlyOnce: true,
              }
            );
          },
          {
            onlyOnce: true,
          }
        );
      },
      {
        onlyOnce: true,
      }
    );
  };
};

export const cancelPesanan = (order_id) => {
  return (dispatch) => {
    dispatchLoading(dispatch, CANCEL_PESANAN);

    //get Keranjang By UID User
    onValue(
      ref(db, `histories/${order_id}`),
      (snapshot) => {
        if (snapshot.val()) {
          //ambil data keranjang
          const data = snapshot.val();
          dispatch(deletePesananDetail(data));

          //update status menjadi "GAGAL"
          update(ref(db, `histories/${order_id}`), { status: "gagal" });

          dispatchSuccess(dispatch, CANCEL_PESANAN, data);
        }
      },
      {
        onlyOnce: true,
      }
    );
  };
};

export const updatePesananTransaction = (order_id, transaction_status) => {
  return (dispatch) => {
    dispatchLoading(dispatch, UPDATE_PESANAN_TRANSACTION);

    const uid = order_id.split("-")[2];

    const status =
      transaction_status === "settlement" || transaction_status === "capture"
        ? "lunas"
        : transaction_status;

    if (transaction_status === "settlement") {
      //hapus data di notifications waitings
      remove(ref(db, `notifications/${uid}/waitings/${order_id}`));

      //notification
      const idNotification = new Date().getTime();
      const now = new Date();
      const jam = String(now.getHours()).padStart(2, "0"); // Mendapatkan jam (dalam format 24 jam)
      const menit = String(now.getMinutes()).padStart(2, "0"); // Mendapatkan menit
      const dataBaruNotification = {
        id: idNotification,
        tanggal: new Date().toLocaleDateString("en-CA"),
        waktu: `${jam}:${menit}`,
        title: "✅ Pembayaran Berhasil 💸",
        message: "Enjoy, jadwal pesananmu sedang menantimu",
        unread: true,
      };
      //Kirim Pesan Informasi Notification
      set(ref(db, `notifications/${uid}/all/${idNotification}`), dataBaruNotification);
    }

    update(ref(db, `histories/${order_id}`), {
      status: status,
    })
      .then((res) => {
        // berhasil
        dispatchSuccess(dispatch, UPDATE_PESANAN_TRANSACTION, "Update Berhasil");
      })
      .catch((error) => {
        dispatchError(dispatch, UPDATE_PESANAN_TRANSACTION, error);
      });
  };
};
