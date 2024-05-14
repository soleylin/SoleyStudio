import { drawTable } from "./reserveList.js";
import { showdataReserve } from "./reserveList.js";
import { clear_data } from "./reserveList.js";
import { nowpage } from "./reserveList.js";

var upd_id;
var olditemId;
var olddate;
var oldtime;
var flag_tel = true;
var selected_itemId; //現在選取的item
var deposit; //紀錄訂金

$(function () {
  //監聽 #update_btn
  $("body").on("click", " #mybody #update_btn", function () {
    olditemId = $(this).data("itemid");
    olddate = $(this).data("date").substr(0, 10);
    oldtime = $(this).data("date").substr(11, 5);
    upd_id = $(this).data("id");
    $("#upd_memberId").val($(this).data("memberid"));
    $("#upd_userName").val($(this).data("name"));
    $("#upd_tel").val($(this).data("tel"));
    $("#upd_itemId").val("");
    $("#upd_date").val("");
    $("#upd_time").val("");
    $("#upd_deposit").val($(this).data("deposit"));
    showDate();

    if ($(this).data("deposit") == "Y") {
      $("input[id=upd_deposit]").prop("checked", true);
      $("#upd_deposit_text").text("已繳訂金");
      deposit = "Y";
    } else if ($(this).data("deposit") == "N") {
      $("input[id=upd_deposit]").prop("checked", false);
      $("#upd_deposit_text").text("未付訂金");
      deposit = "N";
    }
  });

  //監聽訂金狀態
  $("#upd_deposit").change(function () {
    if ($(this).is(":checked")) {
      $("#upd_deposit_text").text("已繳訂金");
      deposit = "Y";
    } else {
      $("#upd_deposit_text").text("未付訂金");
      deposit = "N";
    }
  });

  $("#upd_itemId").change(function () {
    $("#upd_date").empty();
    $("#upd_date").append(
      "<option disabled selected value=''>請選擇預約日期</option>"
    );
    $("#upd_time").empty();
    $("#upd_time").append(
      "<option disabled selected value=''>請選擇預約時段</option>"
    );
    selected_itemId = $(this).val();
    var dataJSON = {};
    dataJSON["itemId"] = selected_itemId;

    $.ajax({
      type: "POST",
      url: "http://https://soleystudio.000webhostapp.com/api/member/reserveTime-Read.php",
      data: JSON.stringify(dataJSON),
      dataType: "json",
      async: false,
      success: showdataReserveTime,
      error: function () {
        Swal.fire("系統串接錯誤！ - member/reserveTime-Read.php");
      },
    });
  });

  $("#upd_date").change(function () {
    selected_date = $(this).val();
    $("#upd_time").empty();
    $("#upd_time").append(
      "<option disabled selected value=''>請選擇預約時段</option>"
    );
    reserveTimeData.forEach(function (item) {
      if (item.date == selected_date) {
        var strHTML =
          '<option value="' + item.time + '">' + item.time + "</option>";
        $("#upd_time").append(strHTML);
      }
    });
  });

  //監聽 #add_tel
  $("#add_tel").bind("input propertychange", function () {
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

  //監聽 #modal_update_btn
  $("#modal_update_btn").click(function () {
    if (flag_tel) {
      var dataJSON = {};
      dataJSON["id"] = upd_id;
      dataJSON["memberId"] = $("#upd_memberid").val();
      dataJSON["userName"] = $("#upd_userName").val();
      dataJSON["tel"] = $("#upd_tel").val();
      dataJSON["itemId"] = $("#upd_itemId").val();
      dataJSON["date"] = $("#upd_date").val();
      dataJSON["time"] = $("#upd_time").val();
      dataJSON["olditemId"] = olditemId;
      dataJSON["olddate"] = olddate;
      dataJSON["oldtime"] = oldtime;

      $.ajax({
        type: "POST",
        url: "http://https://soleystudio.000webhostapp.com/api/manager/reserve/reserve-Update.php",
        data: JSON.stringify(dataJSON),
        dataType: "json",
        success: showdataReserve_upd,
        error: function () {
          Swal.fire("error-- manager/reserve/reserve-Update.php");
        },
      });

      var dataJSON = {};
      dataJSON["id"] = upd_id;
      dataJSON["deposit"] = deposit;

      $.ajax({
        type: "POST",
        url: "http://https://soleystudio.000webhostapp.com/api/manager/reserve/reserveDeposit-Update.php",
        data: JSON.stringify(dataJSON),
        dataType: "json",
        success: showdataReserve_upd,
        error: function () {
          Swal.fire(
            "error-- manager/reserve/reserveDeposit-Update.php"
          );
        },
      });
    } else {
      Swal.fire("欄位有誤，請修正!");
    }
  });
});

function showDate() {
  $("#upd_date").empty();
  $("#upd_time").empty();
  $("#upd_date").append(
    "<option selected disabled value=''>請選擇預約日期</option>"
  );
  $("#upd_time").append(
    "<option selected disabled value=''>請選擇預約時段</option>"
  );
}

function showdataReserveTime(data) {
  dateData = [];
  counter = [];
  reserveTimeData = data.data;
  //資料重構
  data.data.forEach(function (item) {
    if (counter[item.date] == undefined) {
      counter[item.date] = dateData.length;
      dateData[counter[item.date]] = item.date;
    }
  });

  $("#upd_date").empty();
  $("#upd_date").append(
    "<option disabled selected value=''>請選擇預約日期</option>"
  );
  $("#upd_time").empty();
  $("#upd_time").append(
    "<option disabled selected value=''>請選擇預約時段</option>"
  );
  dateData.forEach(function (item) {
    var strHTML = '<option value="' + item + '">' + item + "</option>";
    $("#upd_date").append(strHTML);
  });
}

function showdataReserve_upd(data) {
  if (data.state) {
    Swal.fire({
      title: data.message,
      showDenyButton: false,
      showCancelButton: false,
      confirmButtonText: "確定",
      confirmButtonColor: "#7d6868",
    }).then((result) => {
      if (result.isConfirmed) {
        update_data();
        drawTable(nowpage);
        $("#UpdateModal").modal("hide");
      }
    });
  } else {
    Swal.fire(data.message);
  }
}

function update_data() {
  clear_data();

  $.ajax({
    type: "GET",
    url: "http://https://soleystudio.000webhostapp.com/api/manager/reserve/reserve-Read.php",
    dataType: "json",
    async: false,
    success: showdataReserve,
    error: function () {
      Swal.fire("系統串接錯誤！-- manager/reserve/reserve-Read.php");
    },
  });
}
