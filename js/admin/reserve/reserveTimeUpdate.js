import { drawTable } from "./reserveTimeList.js";
import { showdataReserveTime } from "./reserveTimeList.js";
import { clear_data } from "./reserveTimeList.js";
import { nowpage } from "./reserveTimeList.js";

var upd_id;
var active;
var actived; //是否已被預約
$(function () {
  //監聽 #update_btn
  $("body").on("click", " #mybody #update_btn", function () {
    upd_id = $(this).data("id");
    $("#upd_itemId").val($(this).data("itemid"));
    $("#upd_date").val($(this).data("date"));
    $("#upd_time").val($(this).data("time"));
    $("#upd_active").val($(this).data("active"));

    //預約狀態顯示active
    if ($(this).data("active") == "Y") {
      $("input[id=upd_active]").prop("checked", true);
      active = "Y";
      actived = "Y";
    } else if ($(this).data("active") == "N") {
      $("input[id=upd_active]").prop("checked", false);
      active = "N";
      actived = "N";
    }
  });

  //監聽預約狀態
  $("#upd_active").change(function () {
    if ($(this).is(":checked")) {
      active = "Y";
    } else {
      active = "N";
    }
  });

  //監聽 #modal_update_btn
  $("#modal_update_btn").click(function () {
    if (actived == "Y") {
      Swal.fire({
        title: "原時段已有人預約，是否確定更改內容",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        confirmButtonColor: "#7d6868",
      }).then((result) => {
        if (result.isConfirmed) {
          var dataJSON = {};
          dataJSON["id"] = upd_id;
          dataJSON["itemId"] = $("#upd_itemId").val();
          dataJSON["date"] = $("#upd_date").val();
          dataJSON["time"] = $("#upd_time").val();
          dataJSON["active"] = active;

          $.ajax({
            type: "POST",
            url: "https://https://soleystudio.000webhostapp.com/api/manager/reserve/reserveTime-Update.php",
            data: JSON.stringify(dataJSON),
            dataType: "json",
            success: showdataReserveTime_upd,
            error: function () {
              Swal.fire("error-- manager/reserve/reserveTime-Update.php");
            },
          });
        }
      });
    } else {
      var dataJSON = {};
      dataJSON["id"] = upd_id;
      dataJSON["itemId"] = $("#upd_itemId").val();
      dataJSON["date"] = $("#upd_date").val();
      dataJSON["time"] = $("#upd_time").val();
      dataJSON["active"] = active;

      $.ajax({
        type: "POST",
        url: "https://https://soleystudio.000webhostapp.com/api/manager/reserve/reserveTime-Update.php",
        data: JSON.stringify(dataJSON),
        dataType: "json",
        success: showdataReserveTime_upd,
        error: function () {
          Swal.fire("error-- manager/reserve/reserveTime-Update.php");
        },
      });
    }
  });
});

function showdataReserveTime_upd(data) {
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

  var dataJSON = {};
  dataJSON["itemId"] = $("#upd_itemId").val();

  $.ajax({
    type: "POST",
    url: "https://https://soleystudio.000webhostapp.com/api/manager/reserve/reserveTime-Read.php",
    data: JSON.stringify(dataJSON),
    dataType: "json",
    async: false,
    success: showdataReserveTime,
    error: function () {
      Swal.fire("系統串接錯誤！-- manager/reserve/reserveTime-Read.php");
    },
  });
}
