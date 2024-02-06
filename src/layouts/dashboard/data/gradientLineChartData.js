const gradientLineChartData = (namaBulan, dataBulan) => ({
  labels: namaBulan,
  datasets: [
    {
      label: "Pendapatan",
      color: "info",
      data: dataBulan,
    },
  ],
});

export default gradientLineChartData;
