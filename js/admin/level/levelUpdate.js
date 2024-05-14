import { drawTable } from "./levelList.js";
import { showdataLevel } from "./levelList.js";
import { clear_data } from "./levelList.js";
import { nowpage } from "./levelList.js";

$(function () {
  var upd_id;

  //監聽 #update_btn
  $("body").on("click", " #mybody #update_btn", function () {
    upd_id = $(this).data("id");
    $("#upd_name").val($(this).data("name"));
    $("#upd_code").val($(this).data("code"));
  });

  //監聽 #modal_update_btn
  $("#modal_update_btn").click(function () {
    var dataJSON = {};
    dataJSON["id"] = upd_id;
    dataJSON["name"] = $("#upd_name").val();
    dataJSON["code"] = $("#upd_code").val();

    $.ajax({
      type: "POST",
      url: "https://http://soleystudio.infinityfreeapp.com/api/manager/level/level-Update.php",
      data: JSON.stringify(dataJSON),
      dataType: "json",
      success: showdataLevel_upd,
      error: function () {
        Swal.fire("error-- manager/level/level-Update.php");
      },
    });
  });
});

function showdataLevel_upd(data) {
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
    url: "https://http://soleystudio.infinityfreeapp.com/api/manager/level/level-Read.php",
    dataType: "json",
    async: false,
    success: showdataLevel,
    error: function () {
      Swal.fire("系統串接錯誤！-- manager/level/level-Read.php");
    },
  });
}
