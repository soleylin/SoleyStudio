var dateData = [];
var counter = [];
var reserveTimeData = [];
var selected_itemId; //已選擇服務項目
var selected_date; //已選擇日期

$(function () {
  $.ajax({
    type: "GET",
    url: "http://soleystudio.infinityfreeapp.com/api/manager/serviceItem/serviceItem-Read.php",
    dataType: "json",
    async: false,
    success: showdataItemId,
    error: function () {
      Swal.fire(
        "系統串接錯誤！ - manager/serviceItem/serviceItem-Read.php"
      );
    },
  });

  $("#itemList").change(function () {
    $("#dateList").empty();
    $("#dateList").append(
      "<option disabled selected value=''>請選擇預約日期</option>"
    );
    $("#timeList").empty();
    $("#timeList").append(
      "<option disabled selected value=''>請選擇預約日期</option>"
    );
    
    selected_itemId = $(this).val();
    var dataJSON = {};
    dataJSON["itemId"] = selected_itemId;
    $.ajax({
      type: "POST",
      url: "http://soleystudio.infinityfreeapp.com/api/member/reserveTime-Read.php",
      data: JSON.stringify(dataJSON),
      dataType: "json",
      async: false,
      success: showdataReserveTime,
      error: function () {
        Swal.fire("系統串接錯誤！ - member/reserveTime-Read.php");
      },
    });
  });

  $("#dateList").change(function () {
    selected_date = $(this).val();
    $("#timeList").empty();
    $("#timeList").append(
      "<option disabled selected value=''>請選擇預約時段</option>"
    );
    reserveTimeData.forEach(function (item) {
      if (item.date == selected_date) {
        var strHTML =
          '<option value="' + item.time + '">' + item.time + "</option>";
        $("#timeList").append(strHTML);
      }
    });
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

  $("#dateList").empty();
  $("#dateList").append(
    "<option disabled selected value=''>請選擇預約日期</option>"
  );
  $("#timeList").empty();
  $("#timeList").append(
    "<option disabled selected value=''>請選擇預約時段</option>"
  );
  dateData.forEach(function (item) {
    var strHTML = '<option value="' + item + '">' + item + "</option>";
    $("#dateList").append(strHTML);
  });
}

function showdataItemId(data) {
  $("#itemList").empty();
  $("#itemList").append(
    "<option selected disabled value=''>請選擇預約項目</option>"
  );
  data.data.forEach(function (item) {
    var strHTML = '<option value="' + item.id + '">' + item.name + "</option>";

    $("#itemList").append(strHTML);
  });
}
