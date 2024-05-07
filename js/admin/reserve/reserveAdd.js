var flag_name = false;
var flag_tel = false;
var flag_itemId = false;
var flag_date = false;
var flag_time = false;
var flag_id = false;
var dateData = [];
var counter = [];
var reserveTimeData = [];
var selected_itemId; //已選擇服務項目
var selected_date; //已選擇日期

$(function () {
  //監聽add_btn
  $(".add_btn").click(function () {
    $("#add_memberId").val("");
    $("#add_userName").val("");
    $("#add_tel").val("");
    $("#add_itemId").val("");
    $("#add_date").val("");
    $("#add_time").val("");
  });

  $.ajax({
    type: "GET",
    url: "https://soleystudio.000webhostapp.com/api/manager/serviceItem/serviceItem-Read.php",
    dataType: "json",
    async: false,
    success: showdataItemId,
    error: function () {
      Swal.fire(
        "系統串接錯誤！ - manager/serviceItem/serviceItem-Read.php"
      );
    },
  });

  //監聽memberId
  $("#add_memberId").bind("input propertychange", function () {
    if ($(this).val.length > 0) {
      flag_id = true;
    }
  });

  //監聽userName
  $("#add_userName").bind("input propertychange", function () {
    if ($(this).val.length > 0) {
      flag_name = true;
    }
  });

  //監聽 #tel
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

  //監聽itemList
  $("#add_itemId").change(function () {
    $("#add_date").empty();
    $("#add_date").append(
      "<option disabled selected value=''>請選擇預約日期</option>"
    );
    selected_itemId = $(this).val();
    var dataJSON = {};
    dataJSON["itemId"] = selected_itemId;
    $.ajax({
      type: "POST",
      url: "https://soleystudio.000webhostapp.com/api/member/reserveTime-Read.php",
      data: JSON.stringify(dataJSON),
      dataType: "json",
      async: false,
      success: showdataReserveTime,
      error: function () {
        Swal.fire("系統串接錯誤！ - member/reserveTime-Read.php");
      },
    });
  });

  //監聽dataList
  $("#add_date").change(function () {
    selected_date = $(this).val();
    $("#add_time").empty();
    $("#add_time").append(
      "<option disabled selected value=''>請選擇預約時段</option>"
    );
    reserveTimeData.forEach(function (item) {
      if (item.date == selected_date) {
        var strHTML =
          '<option value="' + item.time + '">' + item.time + "</option>";
        $("#add_time").append(strHTML);
      }
    });
  });

  //監聽 modal_add_btn
  $("#modal_add_btn").click(function () {
    if ($("#add_item").val() !== "" && $("#add_item").val() !== null) {
      flag_itemId = true;
    } else {
      flag_itemId = false;
    }
    if ($("#add_date").val() !== "" && $("#add_date").val() !== null) {
      flag_date = true;
    } else {
      flag_date = false;
    }
    if ($("#add_time").val() !== "" && $("#add_time").val() !== null) {
      flag_time = true;
    } else {
      flag_time = false;
    }

    if (flag_name && flag_tel && flag_itemId && flag_date && flag_time) {
      var dataJSON = {};
      dataJSON["id"] = $("#add_memberId").val();
      dataJSON["userName"] = $("#add_userName").val();
      dataJSON["tel"] = $("#add_tel").val();
      dataJSON["itemId"] = $("#add_itemId").val();
      dataJSON["date"] = $("#add_date").val();
      dataJSON["time"] = $("#add_time").val();

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

  $("#add_date").empty();
  $("#add_date").append(
    "<option disabled selected value=''>請選擇預約日期</option>"
  );
  $("#add_time").empty();
  $("#add_time").append(
    "<option disabled selected value=''>請選擇預約時段</option>"
  );
  dateData.forEach(function (item) {
    var strHTML = '<option value="' + item + '">' + item + "</option>";
    $("#add_date").append(strHTML);
  });
}

function showdataItemId(data) {
  $("#add_item").empty();
  $("#add_item").append(
    "<option selected disabled value=''>請選擇預約項目</option>"
  );
  $("#add_date").empty();
  $("#add_date").append(
    "<option disabled selected value=''>請選擇預約日期</option>"
  );
  $("#add_time").empty();
  $("#add_time").append(
    "<option disabled selected value=''>請選擇預約時段</option>"
  );
  data.data.forEach(function (item) {
    var strHTML = '<option value="' + item.id + '">' + item.name + "</option>";

    $("#add_item").append(strHTML);
  });
}

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
        location.href = "https://soleystudio.000webhostapp.com/admin/reserveList.html";
      }
    });
  } else {
    //顯示錯誤訊息
    Swal.fire(data.message);
  }
}
