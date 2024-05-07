import { getCookie } from "SoleyStudio/js/cookie.js";
var flag_name = false;
var flag_tel = false;
var flag_itemId = false;
var flag_date = false;
var flag_time = false;
var upd_id = getCookie("u_id");

$(function () {
  //監聽userName
  $("#userName").bind("input propertychange", function () {
    if ($(this).val().length > 0) {
      flag_name = true;
    }
  });

  //監聽 #tel
  $("#tel").bind("input propertychange", function () {
    if ($(this).val().length == 10 && $(this).val().substr(0, 2) == "09") {
      //符合規定
      flag_tel = true;
    } else if ($(this).val().substr(0, 2) !== "09") {
      //不符合規定
      flag_tel = false;
    } else {
      //不符合規定
      flag_tel = false;
    }
  });

  //監聽reserve_btn
  $("#reserve_btn").click(function () {
    if ($("#itemList").val() !== null && $("#itemList").val() !== "") {
      flag_itemId = true;
    } else {
      flag_itemId = false;
    }
    if ($("#dateList").val() !== null && $("#dateList").val() !== "") {
      flag_date = true;
    } else {
      flag_date = false;
    }
    if ($("#timeList").val() !== null && $("#timeList").val() !== "") {
      flag_time = true;
    } else {
      flag_time = false;
    }

    if (flag_name && flag_tel && flag_itemId && flag_date && flag_time) {
      var dataJSON = {};
      dataJSON["id"] = upd_id;
      dataJSON["userName"] = $("#userName").val();
      dataJSON["tel"] = $("#tel").val();
      dataJSON["itemId"] = $("#itemList").val();
      dataJSON["date"] = $("#dateList").val();
      dataJSON["time"] = $("#timeList").val();

      $.ajax({
        type: "POST",
        url: "https://soleystudio.000webhostapp.com/api/member/reserve-Create.php",
        data: JSON.stringify(dataJSON),
        dataType: "json",
        success: showdataReserve,
        error: function () {
          Swal.fire("error-- member/reserve-Create.php");
        },
      });
    } else {
      Swal.fire("欄位有誤，請修正!");
    }
  });
});

function showdataReserve(data) {
  if (data.state) {
    //顯示成功訊息
    Swal.fire({
      title: data.message,
      showDenyButton: false,
      showCancelButton: false,
      confirmButtonText: "確定",
      confirmButtonColor: "#7d6868",
    }).then((result) => {
      if (result.isConfirmed) {
        location.href = "https://soleystudio.000webhostapp.com/reserve.html";
      }
    });
  } else {
    //顯示錯誤訊息
    Swal.fire(data.message);
  }
}
