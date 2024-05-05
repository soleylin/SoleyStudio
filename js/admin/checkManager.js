import { getCookie } from "/project/js/cookie.js";
$(function () {
  //判斷是否有uidCookie
  if (getCookie("uid") != "") {
    //uid存在，傳遞至後端api判斷是否正確
    var dataJSON = {};
    dataJSON["uid"] = getCookie("uid");
    $.ajax({
      type: "POST",
      url: "https://soleystudio.000webhostapp.com/SoleyStudio/api/manager/checkManager.php",
      data: JSON.stringify(dataJSON),
      dataType: "json",
      success: showdata_loginUid,
      error: function () {
        Swal.fire("error-- manager/checkManager.php");
      },
    });
  } else {
    $("#content").html("");
    Swal.fire({
      title: "請登入會員",
      showDenyButton: false,
      showCancelButton: false,
      confirmButtonText: "前往登入頁面",
      confirmButtonColor: "#7d6868",
    }).then((result) => {
      if (result.isConfirmed) {
        location.href = "http://192.168.10.60/project/home.html";
      }
    });
  }
});

function showdata_loginUid(data) {
  if (data.data[0].level == "B100") {
    $("#content").html("");
    Swal.fire({
      title: "僅提供管理者觀看, 將倒回首頁",
      showDenyButton: false,
      showCancelButton: false,
      confirmButtonText: "前往首頁",
      confirmButtonColor: "#7d6868",
    }).then((result) => {
      if (result.isConfirmed) {
        location.href = "http://192.168.10.60/project/home.html";
      }
    });
  } else {
    $("#user_message").removeClass("d-none");
    $("#user_message").addClass("d-block");
    $("#logout_btn").removeClass("d-none");
    $("#logout_btn").addClass("d-block");
    $("#user_message").text(data.data[0].userName);
  }
}