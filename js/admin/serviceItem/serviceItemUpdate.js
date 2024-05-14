import { drawTable} from "./serviceItemList.js";
import { showdataServiceItem} from "./serviceItemList.js";
import { clear_data} from "./serviceItemList.js";
import { nowpage } from "./serviceItemList.js";


$(function () {
  var upd_id;

  //監聽 #update_btn
  $("body").on("click", " #mybody #update_btn", function () {
    upd_id = $(this).data("id");
    $("#upd_name").val($(this).data("name"));
  });

  //監聽 #modal_update_btn
  $("#modal_update_btn").click(function () {
    var dataJSON = {};
    dataJSON["id"] = upd_id;
    dataJSON["name"] = $("#upd_name").val();

    $.ajax({
      type: "POST",
      url: "http://https://soleystudio.000webhostapp.com/api/manager/serviceItem/serviceItem-Update.php",
      data: JSON.stringify(dataJSON),
      dataType: "json",
      success: showdataServiceItem_upd,
      error: function () {
        Swal.fire("error-- manager/serviceItem/serviceItem-Update.php");
      },
    });
  });
}); 
function showdataServiceItem_upd(data) {
  if (data.state) {
    Swal.fire({
      title: data.message,
      showDenyButton: false,
      showCancelButton: false,
      confirmButtonText: "確定",
      confirmButtonColor: "#7d6868"
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

function update_data(){
    clear_data();
    $.ajax({
      type: "GET",
      url: "http://https://soleystudio.000webhostapp.com/api/manager/serviceItem/serviceItem-Read.php",
      dataType: "json",
      async: false,
      success: showdataServiceItem,
      error: function () {
        Swal.fire(
          "系統串接錯誤！-- manager/serviceItem/serviceItem-Read.php"
        );
      },
    });
  }

