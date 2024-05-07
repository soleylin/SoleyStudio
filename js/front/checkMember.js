import { getCookie } from "/SoleyStudio/js/cookie.js";
$(function () {
  //判斷是否有uidCookie
  if (getCookie("uid") != "") {
    //uid存在，傳遞至後端api判斷是否正確
    var dataJSON = {};
    dataJSON["uid01"] = getCookie("uid");
    $.ajax({
      type: "POST",
      url: "https://soleystudio.000webhostapp.com/api/member/member-LoginUid.php",
      data: JSON.stringify(dataJSON),
      dataType: "json",
      success: showdata_loginUid,
      error: function () {
        Swal.fire("error-- member/member-LoginUid.php");
      },
    });
  } else {
    $("#dataList").empty();
    Swal.fire({
      title: "請登入會員",
      showDenyButton: false,
      showCancelButton: false,
      confirmButtonText: "前往登入頁面",
      denyButtonText: `Don't save`,
      confirmButtonColor: "#7d6868",
    }).then((result) => {
      if (result.isConfirmed) {
        location.href = "https://soleystudio.000webhostapp.com/";
      }
    });
  }
});

function showdata_loginUid(data) {
  $("#user_message").removeClass("d-none");
  $("#user_message").addClass("d-block");
  $("#logout_btn").removeClass("d-none");
  $("#logout_btn").addClass("d-block");
  $("#user_message").text(data.data[0].userName);
}
