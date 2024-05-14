var flag_no = false;
var flag_item = false;
var flag_name = false;
var flag_image = false;
var price = 500;
var active = "N";
var chkArray = [];
$(function () {
  //監聽add_btn
  $(".add_btn").click(function () {
    $("#add_itemNo").val("");
    $("#add_itemId").val("");
    $("#add_name").val("");
    $("#add_image").val("");
    $("#add_prevImg").addClass("d-none");
    $("#add_price").val("500");
    $("#add_price_text").text("500");
    $("#add_active").prop("checked", false);
  });

  //監聽 #add_itemNo
  $("#add_itemNo").bind("input propertychange", function () {
    if ($(this).val().length > 0) {
      flag_no = true;
    }
  });

  //監聽 #add_itemId
  $("#add_itemId").change(function () {
    if ($(this).val() !== "4") {
      $("#add_name").removeClass("d-none");
      $("#add_name").addClass("d-block");
      $("#add_faceItem").removeClass("d-block");
      $("#add_faceItem").addClass("d-none");
      flag_item = true;
    } else if ($(this).val() == "4") {
      $("#add_name").removeClass("d-block");
      $("#add_name").addClass("d-none");
      $("#add_faceItem").removeClass("d-none");
      $("#add_faceItem").addClass("d-block");
      flag_item = true;
    } else if ($(this).val() == "") {
      flag_item = false;
    }
  });

  $("#add_image").change(function () {
    if (
      add_image.files[0].type == "image/jpeg" ||
      add_image.files[0].type == "image/png"
    ) {
      //顯示預覽圖
      $("#add_prevImg").removeClass("d-none");
      $("#add_prevImg").attr("src", URL.createObjectURL(add_image.files[0]));
      flag_image = true;
    } else {
      Swal.fire("圖片格式不符合");
      flag_image = false;
    }
  });

  //監聽price
  $("#add_price").bind("input propertychange", function () {
    $("#add_price_text").text($(this).val());
    price = $(this).val();
  });

  //監聽上架狀態
  $("#add_active").change(function () {
    if ($(this).is(":checked")) {
      active = "Y";
    } else {
      active = "N";
    }
  });

  //監聽確認鈕
  $("#modal_add_btn").click(function () {
    //蒐集臉部保養資料
    $.each($("input[name='add_chk']:checked"), function () {
      chkArray.push($(this).val());
    });
    //判斷flag_name
    if ($("#add_itemId").val() == 4) {
      if (chkArray.length == 0) {
        flag_name = false;
        Swal.fire("請填入臉部保養名稱");
      } else {
        flag_name = true;
      }
    } else {
      if ($("#add_name").val().length > 0) {
        flag_name = true;
      }
    }

    if (flag_no && flag_item && flag_name && flag_image) {
      var formdata = new FormData();
      formdata.append("file", add_image.files[0]);

      $.ajax({
        type: "POST",
        url: "https://http://soleystudio.infinityfreeapp.com/api/manager/image/productImage-Create.php",
        data: formdata,
        dataType: "json",
        cache: false,
        contentType: false,
        processData: false,
        success: showdataImage,
        error: function () {
          alert("error-- manager/image/productImage-Create.php");
        },
      });
    } else {
      Swal.fire("欄位有誤，請修正!");
    }
  });
});

function showdataImage(data) {
  var dataJSON = {};
  if ($("#add_itemId").val() == "4") {
    dataJSON["name"] = chkArray.join(", ");
  } else {
    dataJSON["name"] = $("#add_name").val();
  }
  dataJSON["itemNo"] = $("#add_itemNo").val();
  dataJSON["itemId"] = $("#add_itemId").val();
  dataJSON["image"] = data.datainfo["name"];
  dataJSON["price"] = price;
  dataJSON["active"] = active;

  $.ajax({
    type: "POST",
    url: "https://http://soleystudio.infinityfreeapp.com/api/manager/product/product-Create.php",
    data: JSON.stringify(dataJSON),
    dataType: "json",
    success: showdata,
    error: function () {
      Swal.fire("error-- manager/product/product-Create.php");
    },
  });
}

function showdata(data) {
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
        location.href = "https://soleylin.github.io/SoleyStudio/admin/product.html";
      }
    });
  } else {
    //顯示錯誤訊息
    Swal.fire(data.message);
  }
}
