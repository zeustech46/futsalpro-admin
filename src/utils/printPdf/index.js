import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const generatePDF = () => {
  // Buat elemen div dan tambahkan konten HTML sederhana
  const divToConvert = document.createElement("div");
  divToConvert.innerHTML = `
     <div style="text-align: center; padding: 20px; border: 1px solid #ccc;">
       <h2>Contoh Div Sederhana</h2>
       <p>Ini adalah contoh div sederhana yang akan diubah menjadi file PDF.</p>
       <img src="https://placekitten.com/200/200" alt="Kucing Lucu" />
     </div>
   `;

  // Tambahkan elemen ke dalam DOM
  document.body.appendChild(divToConvert);

  // Gunakan html2canvas untuk membuat gambar dari elemen
  html2canvas(divToConvert).then((canvas) => {
    // Untuk kesederhanaan, Anda bisa menyimpan gambar canvas sebagai file PNG
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(
      imgData,
      "PNG",
      15,
      15,
      pdf.internal.pageSize.width - 30,
      pdf.internal.pageSize.height - 30
    );
    pdf.save("example.pdf");

    // Hapus elemen yang telah ditambahkan dari DOM
    document.body.removeChild(divToConvert);
  });
};
