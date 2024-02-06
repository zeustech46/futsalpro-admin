// Tanggal awal
const getSixMonthsAgo = () => {
  const tanggalAwal = new Date();
  // Mendapatkan tanggal satu bulan sebelumnya
  const tanggalSebulanSebelumnya = new Date();
  tanggalSebulanSebelumnya.setMonth(tanggalAwal.getMonth() - 5);
  return tanggalSebulanSebelumnya;
};

export const LastSixMonths = () => {
  var sixMonthsAgo = getSixMonthsAgo();
  var result = [];

  for (var i = 0; i < 6; i++) {
    result.push(sixMonthsAgo.toISOString().split("T")[0].slice(0, 7));
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() + 1);
  }
  return result;
};

export const getMonthNamesForLastSixMonths = () => {
  var monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  var sixMonthsAgo = getSixMonthsAgo();
  var result = [];

  for (var i = 0; i < 6; i++) {
    result.push(monthNames[sixMonthsAgo.getMonth()]);
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() + 1);
  }

  return result;
};
