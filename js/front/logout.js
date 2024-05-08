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
        location.href = "https://soleylin.github.io/SoleyStudio";
      }
    });
  });
});

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}