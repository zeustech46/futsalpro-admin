export const numberWithCommas = (angka) => {
  return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
