import { drawTable } from "./recordList.js";
import { showdataRecord } from "./recordList.js";
import { clear_data } from "./recordList.js";
import { nowpage } from "./recordList.js";
var flag_price = true;
var flag_itemContent = true;
var upd_id;
var memberId;
var chkArray = [];

$(function () {
  //監聽 #update_btn
  $("body").on("click", " #mybody #update_btn", function () {
    upd_id = $(this).data("id");
    memberId = $(this).data("memberid");
    $("#userName").text($(this).data("name"));
    $("#user_profile").text(
      $(this).data("memberid") + " / " + $(this).data("name")
    );
    $("#upd_serviceName").val($(this).data("item"));
    $("#upd_date").val($(this).data("date"));
    $("#upd_color").val($(this).data("color"));
    $("#upd_material").val($(this).data("material"));
    $("#upd_faceItem").val($(this).data("faceitem"));
    $("#upd_price").val($(this).data("price"));

    $.ajax({
      type: "GET",
      url: "https://soleystudio.000webhostapp.com/SoleyStudio/api/manager/faceItem/faceItem-Read.php",
      dataType: "json",
      async: false,
      success: showdataFaceItem,
      error: function () {
        Swal.fire(
          "系統串接錯誤！ - manager/faceItem/faceItem-Read.php"
        );
      },
    });

    if ($(this).data("item") == "臉部保養") {
      $("#upd_faceItem, #upd_faceItem_tilte").addClass("d-block");
      $("#upd_faceItem, #upd_faceItem_tilte").removeClass("d-none");
      $("#upd_color_content").addClass("d-none");
      $("#upd_color_content").removeClass("d-block");
      $("#upd_material_content").addClass("d-none");
      $("#upd_material_content").removeClass("d-block");
    } else {
      $("#upd_color_content").addClass("d-block");
      $("#upd_color_content").removeClass("d-none");
      $("#upd_material_content").addClass("d-block");
      $("#upd_material_content").removeClass("d-none");
      $("#upd_faceItem, #upd_faceItem_tilte").addClass("d-none");
      $("#upd_faceItem, #upd_faceItem_tilte").removeClass("d-block");
    }
  });
  $("#tabs").tabs();

  //監聽upd_price
  $("#upd_price").bind("input propertychange", function () {
    if ($(this).val() > 0) {
      flag_price = true;
    } else {
      flag_price = false;
    }
  });

  //監聽 #modal_update_btn
  $("#modal_update_btn").click(function () {
    //蒐集臉部保養資料
    chkArray = [];
    $.each($("input[name='upd_chk']:checked"), function () {
      chkArray.push($(this).val());
    });
    if (
      ($("#upd_color").val() !== "" && $("#upd_material").val() !== "") ||
      chkArray.length !== 0
    ) {
      flag_itemContent = true;
    } else {
      flag_itemContent = false;
    }

    if (flag_itemContent && flag_price) {
      var dataJSON = {};
      dataJSON["id"] = upd_id;
      dataJSON["memberId"] = memberId;
      dataJSON["color"] = $("#upd_color").val();
      dataJSON["material"] = $("#upd_material").val();
      dataJSON["faceItem"] = chkArray.join(", ");
      dataJSON["price"] = $("#upd_price").val();

      $.ajax({
        type: "POST",
        url: "https://soleystudio.000webhostapp.com/SoleyStudio/api/manager/record/record-Update.php",
        data: JSON.stringify(dataJSON),
        dataType: "json",
        success: showdataRecord_upd,
        error: function () {
          Swal.fire("error-- manager/record/record-Update.php");
        },
      });
    } else {
      Swal.fire("欄位有誤，請修正!");
    }
  });
});

function showdataFaceItem(data) {
  $("#upd_faceItem").empty();
  //渲染臉部保養item
  data.data.forEach(function (item) {
    var strHTML =
      '<div class="form-check form-check-inline"><input type="checkbox" class="form-check-input" name="upd_chk" id="upd_chk' +
      item.id +
      '" value="' +
      item.name +
      '"/> <label for="chk' +
      item.id +
      '" class="form-check-label">' +
      item.name +
      "</label></div>";

    $("#upd_faceItem").append(strHTML);
    $("input[id=upd_chk" + item.id + "]").prop(
      "checked",
      $("#upd_faceItem").val().includes(item.name)
    );
  });
}

function showdataRecord_upd(data) {
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
    url: "https://soleystudio.000webhostapp.com/SoleyStudio/api/manager/record/record-Read.php",
    dataType: "json",
    async: false,
    success: showdataRecord,
    error: function () {
      Swal.fire("系統串接錯誤！-- manager/record/record-Read.php");
    },
  });
}
