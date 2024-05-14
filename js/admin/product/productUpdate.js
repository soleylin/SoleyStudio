import { drawTable } from "./productList.js";
import { showdataProduct } from "./productList.js";
import { clear_data } from "./productList.js";
import { nowpage } from "./productList.js";
import { selected_sort } from "./productList.js";

var upd_id; //紀錄id
var oldImage; //紀錄舊圖檔名稱
var flag_image = "";
var active; //紀錄active
var chkArray = [];

$(function () {
  //監聽 #update_btn
  $("body").on("click", "#mybody #update_btn", function () {
    if ($(this).data("itemid") !== 4) {
      $("#upd_name").removeClass("d-none");
      $("#upd_name").addClass("d-block");
      $("#upd_faceItem").removeClass("d-block");
      $("#upd_faceItem").addClass("d-none");
    } else if ($(this).data("itemid") == 4) {
      $("#upd_name").removeClass("d-block");
      $("#upd_name").addClass("d-none");
      $("#upd_faceItem").removeClass("d-none");
      $("#upd_faceItem").addClass("d-block");
    }

    upd_id = $(this).data("id");
    $("#upd_itemNo").val($(this).data("itemno"));
    $("#upd_itemId").val($(this).data("itemid"));
    $("#upd_name").val($(this).data("name"));
    $("#upd_image").val("");
    $("#upd_prevImg").attr(
      "src",
      "https://soleystudio.000webhostapp.com/image/admin/product/" +
        $(this).data("image")
    );
    $("#upd_price").val($(this).data("price"));
    $("#upd_price_text").text($(this).data("price"));
    $("#upd_active").val($(this).data("active"));

    oldImage = $(this).data("image");

    $.ajax({
      type: "GET",
      url: "https://http://soleystudio.infinityfreeapp.com/api/manager/faceItem/faceItem-Read.php",
      dataType: "json",
      async: false,
      success: showdataFaceItem,
      error: function () {
        Swal.fire(
          "系統串接錯誤！ - manager/faceItem/faceItem-Read.php"
        );
      },
    });

    if ($(this).data("active") == "Y") {
      $("input[id=upd_active]").prop("checked", true);
      active = "Y";
    } else if ($(this).data("active") == "N") {
      $("input[id=upd_active]").prop("checked", false);
      active = "N";
    }
  });

  //監聽 #upd_itemId
  $("#upd_itemId").change(function () {
    if ($(this).val() !== "4") {
      $("#upd_name").removeClass("d-none");
      $("#upd_name").addClass("d-block");
      $("#upd_faceItem").removeClass("d-block");
      $("#upd_faceItem").addClass("d-none");
    } else if ($(this).val() == "4") {
      $("#upd_name").removeClass("d-block");
      $("#upd_name").addClass("d-none");
      $("#upd_faceItem").removeClass("d-none");
      $("#upd_faceItem").addClass("d-block");
    }
  });

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

  //監聽price
  $("#upd_price").bind("input propertychange", function () {
    $("#upd_price_text").text($(this).val());
  });

  //監聽上架狀態
  $("#upd_active").change(function () {
    if ($(this).is(":checked")) {
      active = "Y";
    } else {
      active = "N";
    }
  });

  //監聽 #modal_update_btn
  $("#modal_update_btn").click(function () {
    //蒐集臉部保養資料
    $.each($("input[name='upd_chk']:checked"), function () {
      chkArray.push($(this).val());
    });
    if (flag_image == "Y") {
      var formdata = new FormData();
      formdata.append("file", upd_image.files[0]);

      $.ajax({
        type: "POST",
        url: "https://http://soleystudio.infinityfreeapp.com/api/manager/image/productImage-Create.php",
        data: formdata,
        dataType: "json",
        cache: false,
        contentType: false,
        processData: false,
        success: showdataImage_upd,
        error: function () {
          alert("error-- manager/image/productImage-Create.php");
        },
      });
    } else if (flag_image == "") {
      var dataJSON = {};
      if ($("#upd_itemId").val() == 4) {
        dataJSON["name"] = chkArray.join(", ");
      } else {
        dataJSON["name"] = $("#upd_name").val();
      }
      dataJSON["id"] = upd_id;
      dataJSON["itemNo"] = $("#upd_itemNo").val();
      dataJSON["itemId"] = $("#upd_itemId").val();
      dataJSON["image"] = "";
      dataJSON["price"] = $("#upd_price").val();
      dataJSON["active"] = active;

      $.ajax({
        type: "POST",
        url: "https://http://soleystudio.infinityfreeapp.com/api/manager/product/product-Update.php",
        data: JSON.stringify(dataJSON),
        dataType: "json",
        success: showdataProduct_upd,
        error: function () {
          Swal.fire("error-- manager/product/product-Update.php");
        },
      });
    } else {
      Swal.fire("欄位有誤，請修正!");
    }
  });
});

function showdataImage_upd(data) {
  var dataJSON = {};
  if ($("#upd_itemId").val() == 4) {
    dataJSON["name"] = chkArray.join(", ");
  } else {
    dataJSON["name"] = $("#upd_name").val();
  }
  dataJSON["id"] = upd_id;
  dataJSON["itemNo"] = $("#upd_itemNo").val();
  dataJSON["itemId"] = $("#upd_itemId").val();
  dataJSON["image"] = data.datainfo["name"];
  dataJSON["oldImage"] = oldImage;
  dataJSON["price"] = $("#upd_price").val();
  dataJSON["active"] = active;

  $.ajax({
    type: "POST",
    url: "https://http://soleystudio.infinityfreeapp.com/api/manager/product/product-Update.php",
    data: JSON.stringify(dataJSON),
    dataType: "json",
    success: showdataProduct_upd,
    error: function () {
      Swal.fire("error-- manager/product/product-Update.php");
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
  chkArray = [];
  flag_image = "";
  var dataJSON = {};
  dataJSON["itemId"] = $("#upd_itemId").val();
  dataJSON["sort"] = selected_sort;
  $.ajax({
    type: "POST",
    url: "https://http://soleystudio.infinityfreeapp.com/api/manager/product/product-Read.php",
    data: JSON.stringify(dataJSON),
    dataType: "json",
    async: false,
    success: showdataProduct,
    error: function () {
      Swal.fire("系統串接錯誤！-- manager/product/product-Read.php");
    },
  });
}

function showdataFaceItem(data) {
  data.data.forEach(function (item) {
    $("input[id=upd_chk" + item.id + "]").prop(
      "checked",
      $("#upd_name").val().includes(item.name)
    );
  });
}
