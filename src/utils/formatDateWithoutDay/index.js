export const formatDateWithoutDay = (date) => {
  // inisialisasi nilai tanggal
  var kalender = new Date(date);
  const tahun = kalender.getFullYear();
  const bulan = kalender.getMonth();
  const tanggal = kalender.getDate();

  // Mengonversi nilai angka bulan ke nama bulan
  var namaBulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  return `${tanggal} ${namaBulan[bulan]} ${tahun}`;
};
