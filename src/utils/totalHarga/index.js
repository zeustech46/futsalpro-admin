// Fungsi untuk menghitung total harga berdasarkan waktu
export const hitungTotalHarga = (dataPesanan) => {
  const dataWaktuMalam = [
    "19.00-20.00",
    "22.00-23.00",
    "20.00-21.00",
    "23.00-23.59",
    "21.00-22.00",
  ];

  let totalHarga = 0;

  Object.keys(dataPesanan).forEach((jenisPesanan) => {
    dataPesanan[jenisPesanan].forEach((pesanan) => {
      const waktu = pesanan.waktu;
      const hargaItem =
        jenisPesanan === "vinyl" && dataWaktuMalam.includes(waktu)
          ? 300000
          : jenisPesanan === "vinyl"
          ? 220000
          : jenisPesanan === "rumput" && dataWaktuMalam.includes(waktu)
          ? 200000
          : jenisPesanan === "rumput"
          ? 150000
          : 0;

      totalHarga += hargaItem;
    });
  });
  return totalHarga;
};
