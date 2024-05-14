var id;
var memberId; //紀錄會員編號
var userName; //紀錄會員名字
var serviceName; //紀錄服務項目
var date; //紀錄來店日期
var chkArray = [];
var flag_itemContent; //紀錄服務內容
var flag_price;

$(function () {
  $("body").on("click", "#mybody #done_btn", function () {
    $.ajax({
      type: "GET",
      url: "http://https://soleystudio.000webhostapp.com/api/manager/faceItem/faceItem-Read.php",
      dataType: "json",
      async: false,
      success: showdataFaceItem,
      error: function () {
        Swal.fire(
          "系統串接錯誤！ - manager/faceItem/faceItem-Read.php"
        );
      },
    });

    id = $(this).data("id");
    memberId = $(this).data("memberid");
    userName = $(this).data("name");
    serviceName = $(this).data("servicename");
    date = $(this).data("date").substr(0, 10);

    $("#userName").text(userName);
    $(".user_profile").text(memberId + " / " + userName);
    $("#done_serviceName").val(serviceName);
    $("#done_date").val(date);
    $("#done_color").val("");
    $("#done_material").val("");
    $("#done_price").val("");

    if ($(this).data("servicename") == "臉部保養") {
      $("#done_faceItem, #done_faceItem_tilte").addClass("d-block");
      $("#done_faceItem, #done_faceItem_tilte").removeClass("d-none");
      $("#done_color_content").addClass("d-none");
      $("#done_color_content").removeClass("d-block");
      $("#done_material_content").addClass("d-none");
      $("#done_material_content").removeClass("d-block");
    } else {
      $("#done_color_content").addClass("d-block");
      $("#done_color_content").removeClass("d-none");
      $("#done_material_content").addClass("d-block");
      $("#done_material_content").removeClass("d-none");
      $("#done_faceItem, #done_faceItem_tilte").addClass("d-none");
      $("#done_faceItem, #done_faceItem_tilte").removeClass("d-block");
    }
  });
  $("#tabs").tabs();

  //監聽done_price
  $("#done_price").bind("input propertychange", function () {
    if ($(this).val() > 0) {
      flag_price = true;
    } else {
      flag_price = false;
    }
  });

  //監聽modal_done_btn
  $("#modal_done_btn").click(function () {
    //蒐集臉部保養資料
    $.each($("input[name='done_chk']:checked"), function () {
      chkArray.push($(this).val());
    });
    if (
      ($("#done_color").val() !== "" && $("#done_material").val() !== "") ||
      chkArray.length !== 0
    ) {
      flag_itemContent = true;
    } else {
      flag_itemContent = false;
    }

    if (flag_itemContent && flag_price) {
      var dataJSON = {};
      dataJSON["id"] = id;
      dataJSON["memberId"] = memberId;
      dataJSON["userName"] = userName;
      dataJSON["serviceName"] = serviceName;
      dataJSON["date"] = date;
      dataJSON["color"] = $("#done_color").val();
      dataJSON["material"] = $("#done_material").val();
      dataJSON["faceItem"] = chkArray.join(", ");
      dataJSON["price"] = $("#done_price").val();

      $.ajax({
        type: "POST",
        url: "http://https://soleystudio.000webhostapp.com/api/manager/reserve/reserveDone-Create.php",
        data: JSON.stringify(dataJSON),
        dataType: "json",
        success: showdataReserveDone,
        error: function () {
          Swal.fire(
            "error-- manager/reserve/reserveDone-Create.php"
          );
        },
      });
    } else {
      Swal.fire("欄位有誤，請修正!");
    }
  });
});

function showdataFaceItem(data) {
  $("#done_faceItem").empty();
  //渲染臉部保養item
  data.data.forEach(function (item) {
    var strHTML =
      '<div class="form-check form-check-inline"><input type="checkbox" class="form-check-input" name="done_chk" id="done_chk' +
      item.id +
      '" value="' +
      item.name +
      '"/> <label for="chk' +
      item.id +
      '" class="form-check-label">' +
      item.name +
      "</label></div>";

    $("#done_faceItem").append(strHTML);
  });
}
function showdataReserveDone(data) {
  if (data.state) {
    var dataJSON = {};
    dataJSON["memberId"] = memberId;
    dataJSON["serviceName"] = serviceName;
    dataJSON["date"] = date;
    $.ajax({
      type: "POST",
      url: "http://https://soleystudio.000webhostapp.com/api/manager/member/memberConsumption-Update.php",
      data: JSON.stringify(dataJSON),
      dataType: "json",
      success: showdataMemberDone,
      error: function () {
        Swal.fire(
          "error-- manager/member/memberConsumption-Update.php"
        );
      },
    });
  } else {
    Swal.fire(data.message);
  }
}

function showdataMemberDone(data) {
  if (data.state) {
    Swal.fire({
      title: data.message,
      showDenyButton: false,
      showCancelButton: false,
      confirmButtonText: "確定",
      confirmButtonColor: "#7d6868",
    }).then((result) => {
      if (result.isConfirmed) {
        location.href = "https://soleylin.github.io/SoleyStudio/admin/reserveList.html";
      }
    });
  } else {
    Swal.fire(data.message);
  }
}
