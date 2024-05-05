import { setCookie } from "/project/js/cookie.js";
$(function () {
  //監聽 #logout_btn
  $("#logout_btn").click(function () {
    Swal.fire({
      title: "是否登出會員",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "確認",
      denyButtonText: `取消`,
      confirmButtonColor: "#705429",
      denyButtonColor: "#b1a6a6cc",
    }).then((result) => {
      if (result.isConfirmed) {
        setCookie("uid", "", 7);
        setCookie("u_id", "", 7);
        location.href = "http://192.168.10.60/project/home.html";
      }
    });
  });
});
