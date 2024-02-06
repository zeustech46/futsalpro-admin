import Swal from "sweetalert2";

export const AlertError = (icon, text) => {
  Swal.fire({
    title: "Perhatian",
    icon: icon,
    text: text,
    showConfirmButton: false,
    confirmButtonColor: "#33b4b7",
    timer: 2000,
  });
};
