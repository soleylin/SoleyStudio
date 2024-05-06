import { drawTable } from "./feedbackList.js";
import { showdataFeedback } from "./feedbackList.js";
import { clear_data } from "./feedbackList.js";
import { nowpage } from "./feedbackList.js";

var upd_id; //紀錄id
var oldImage; //紀錄舊圖檔名稱
var flag_image = "";

$(function () {
  //監聽 #update_btn
  $("body").on("click", "#mybody #update_btn", function () {
    upd_id = $(this).data("id");
    $("#upd_image").val("");
    $("#upd_prevImg").attr(
      "src",
      "http://192.168.10.60/project/image/admin/feedback/" +
        $(this).data("image")
    );

    oldImage = $(this).data("image");

    $("#upd_image").change(function () {
      if (
        upd_image.files[0].type == "image/jpeg" ||
        upd_image.files[0].type == "image/png"
      ) {
        //顯示預覽圖
        $("#upd_prevImg").attr("src", URL.createObjectURL(upd_image.files[0]));
        flag_image = "Y";
      } else {
        Swal.fire("圖片格式不符合");
        flag_image = "N";
      }
    });

    //監聽 #modal_update_btn
    $("#modal_update_btn").click(function () {
      if (flag_image == "Y") {
        var formdata = new FormData();
        formdata.append("file", upd_image.files[0]);
        $.ajax({
          type: "POST",
          url: "https://soleystudio.000webhostapp.com/api/manager/image/feedbackImage-Create.php",
          data: formdata,
          dataType: "json",
          cache: false,
          contentType: false,
          processData: false,
          success: showdataImage_upd,
          error: function () {
            alert("erroe-- manager/image/feedbackImage-Create.php");
          },
        });
      } else if (flag_image == "") {
        var dataJSON = {};
        dataJSON["id"] = upd_id;
        dataJSON["sort"] = $("#sort").val();
        dataJSON["image"] = "";

        $.ajax({
          type: "POST",
          url: "https://soleystudio.000webhostapp.com/api/manager/feedback/feedback-Update.php",
          data: JSON.stringify(dataJSON),
          dataType: "json",
          success: showdataProduct_upd,
          error: function () {
            Swal.fire(
              "error-- manager/feedback/feedback-Update.php"
            );
          },
        });
      } else {
        Swal.fire("欄位有誤，請修正!");
      }
    });
  });
});

function showdataImage_upd(data) {
  var dataJSON = {};
  dataJSON["id"] = upd_id;
  dataJSON["sort"] = $("#sort").val();
  dataJSON["image"] = data.datainfo["name"];
  dataJSON["oldImage"] = oldImage;

  $.ajax({
    type: "POST",
    url: "https://soleystudio.000webhostapp.com/api/manager/feedback/feedback-Update.php",
    data: JSON.stringify(dataJSON),
    dataType: "json",
    success: showdataProduct_upd,
    error: function () {
      Swal.fire("error-- manager/feedback/feedback-Update.php");
    },
  });
}

function showdataProduct_upd(data) {
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
  flag_image = "";
  $.ajax({
    type: "GET",
    url: "https://soleystudio.000webhostapp.com/api/manager/feedback/feedback-Read.php",
    dataType: "json",
    async: false,
    success: showdataFeedback,
    error: function () {
      Swal.fire(
        "系統串接錯誤！-- manager/feedback/feedback-Read.php"
      );
    },
  });
}
