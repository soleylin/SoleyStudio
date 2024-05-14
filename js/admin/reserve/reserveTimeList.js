var newData = [];
var lastpage = 0;
var nowpage = 0;
var reserveTimeData = []; //reserveTime資料
var reserveTimeNewData = []; //挑選過itemId的reserveTime資料
var selected_itemId = "0"; //已選擇的類別
var active_chk = "All"; //顯示active狀態

export { drawTable };
export { showdataReserveTime };
export { clear_data };
export { nowpage };
$(function () {
  read();

  $.ajax({
    type: "GET",
    url: "http://https://soleystudio.000webhostapp.com/api/manager/serviceItem/serviceItem-Read.php",
    dataType: "json",
    async: false,
    success: showdataItemId,
    error: function () {
      Swal.fire(
        "系統串接錯誤！ - manager/serviceItem/serviceItem-Read.php"
      );
    },
  });

  //監聽selectList
  $("#searchList").change(function () {
    $("#mybody").empty();
    nowpage = 0;
    reserveTimeNewData = [];
    selected_itemId = $(this).val();
    if ($(this).val() !== "") {
      if ($("#active_chk").is(":checked")) {
        reserveTimeData.forEach(function (item) {
          if (item.itemId == selected_itemId && item.active == "N") {
            reserveTimeNewData.push(item);
          }
        });
        drawPage(reserveTimeNewData);
      } else {
        reserveTimeData.forEach(function (item) {
          if (item.itemId == selected_itemId) {
            reserveTimeNewData.push(item);
          }
        });
        drawPage(reserveTimeNewData);
      }
    } else {
      if ($("#active_chk").is(":checked")) {
        reserveTimeData.forEach(function (item) {
          if (item.active == "N") {
            reserveTimeNewData.push(item);
          }
        });
        drawPage(reserveTimeNewData);
      } else {
        drawPage(reserveTimeData);
      }
    }
  });

  //監聽active_chk
  $("#active_chk").change(function () {
    nowpage = 0;
    reserveTimeNewData = [];
    if ($(this).is(":checked")) {
      if ($("#searchList").val() !== "") {
        reserveTimeData.forEach(function (item) {
          if (item.itemId == selected_itemId && item.active == "N") {
            reserveTimeNewData.push(item);
          }
        });
      } else {
        reserveTimeData.forEach(function (item) {
          if (item.active == "N") {
            reserveTimeNewData.push(item);
          }
        });
      }
      drawPage(reserveTimeNewData);
    } else {
      if ($("#searchList").val() !== "") {
        reserveTimeData.forEach(function (item, key) {
          if (item.itemId == selected_itemId) {
            reserveTimeNewData.push(item);
          }
        });
        drawPage(reserveTimeNewData);
      } else {
        drawPage(reserveTimeData);
      }
    }
  });

  //監聽前一頁紐
  $("body").on("click", "#pre", function () {
    if (nowpage > 0) {
      drawTable(nowpage - 1);
    }
  });

  //監聽下一頁紐
  $("body").on("click", "#next", function () {
    if (nowpage + 1 < lastpage) {
      drawTable(nowpage + 1);
    }
  });

  //監聽頁碼
  $("body").on("click", ".page-item .page-link[name='page-link']", function () {
    nowpage = $(this).data("key");
    drawTable(nowpage);
  });

  //監聽 #delete_btn
  $("body").on("click", "#mybody #delete_btn", function () {
    Swal.fire({
      title: "確認要刪除這筆資料嗎?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "確定刪除",
      denyButtonText: "取消",
      confirmButtonColor: "#7d6868",
      denyButtonColor: "#7c7c7c",
    }).then((result) => {
      if (result.isConfirmed) {
        var dataJSON = {};
        dataJSON["id"] = $(this).data("id");

        $.ajax({
          type: "POST",
          url: "http://https://soleystudio.000webhostapp.com/api/manager/reserve/reserveTime-Delete.php",
          data: JSON.stringify(dataJSON),
          dataType: "json",
          success: showdata_delete,
          error: function () {
            Swal.fire(
              "error-- manager/reserve/reserveTime-Delete.php"
            );
          },
        });
      }
    });
  });
});

function showdataReserveTime(data) {
  reserveTimeData = data.data;
  if (data.state) {
    drawPage(reserveTimeData);
  } else {
    Swal.fire(data.message);
  }
}

function showdataItemId(data) {
  $("#add_itemId").empty();
  $("#upd_itemId").empty();
  $("#searchList").empty();
  $("#add_itemId").append(
    "<option selected disabled value=''>請選擇項目</option>"
  );
  $("#upd_itemId").append(
    "<option selected disabled value=''>請選擇項目</option>"
  );
  $("#searchList").append("<option selected value=''>預約時間總覽</option>");
  data.data.forEach(function (item) {
    var strHTML = '<option value="' + item.id + '">' + item.name + "</option>";

    $("#add_itemId").append(strHTML);
    $("#upd_itemId").append(strHTML);
    $("#searchList").append(strHTML);
  });
}

function showdata_delete(data) {
  if (data.state) {
    Swal.fire({
      title: data.message,
      showDenyButton: false,
      showCancelButton: false,
      confirmButtonText: "確定",
      denyButtonText: `Don't save`,
      confirmButtonColor: "#7d6868",
    }).then((result) => {
      if (result.isConfirmed) {
        location.href = "https://soleylin.github.io/SoleyStudio/admin/reserveTime.html";
      }
    });
  }
}

function drawTable(page) {
  $("#mybody").empty();

  if (page == 0) {
    $("#pre").addClass("disabled");
    $("#next").removeClass("disabled");
  } else if (page + 1 == lastpage) {
    $("#pre").removeClass("disabled");
    $("#next").addClass("disabled");
  } else {
    $("#pre").removeClass("disabled");
    $("#next").removeClass("disabled");
  }

  $(".page-link").removeClass("active");
  var pageid = "#page" + (page + 1);
  $(pageid).addClass("active");

  newData[page].forEach(function (item) {
    var strHTML =
      '<tr><td data-th="服務項目" class="tdc">' +
      item.serviceName +
      '</td><td data-th="日期" class="tdc">' +
      item.date +
      '</td><td data-th="時間" class="tdc">' +
      item.time +
      '</td><td data-th="預約狀態" class="tdc fw-700" id="active' +
      item.id +
      '">' +
      item.active +
      '</td><td data-th="建檔時間" class="tdc">' +
      item.created_at +
      '</td><td data-th="更新/刪除" class="tdc"><button class="btn btn-success me-1" data-bs-toggle="modal" data-bs-target="#UpdateModal" data-id="' +
      item.id +
      '" data-itemid="' +
      item.itemId +
      '" data-date="' +
      item.date +
      '" data-time="' +
      item.time +
      '" data-active="' +
      item.active +
      '" id="update_btn">更新</button><button class="btn btn-danger" id="delete_btn" data-id="' +
      item.id +
      '">刪除</button></td></tr>';
    $("#mybody").append(strHTML);
    if (item.active == "Y") {
      $("#active" + item.id).addClass("text-danger");
    }
    nowpage = page;
  });

  //檢查重複
  var seen = {};
  var firstSeen = {};
  $("#mybody tr").each(function () {
    var serviceName = $(this).find("td:eq(0)").text();
    var date = $(this).find("td:eq(1)").text();
    var time = $(this).find("td:eq(2)").text();
    var key = serviceName + "|" + date + "|" + time;
    //第三次見到，顯示紅字
    if (seen[key]) {
      $(this).find("td:eq(0), td:eq(1), td:eq(2)").addClass("text-danger");
    } else if (firstSeen[key]) {
      //第二次見到
      $("#mybody tr")
        //篩選符合條件的元素
        .filter(function () {
          return (
            $(this).find("td:eq(0)").text() === serviceName &&
            $(this).find("td:eq(1)").text() === date &&
            $(this).find("td:eq(2)").text() === time
          );
        })
        .find("td:eq(0), td:eq(1), td:eq(2)")
        .addClass("text-danger");
      //標示為已見過兩次
      seen[key] = true;
    } else {
      //第一次見到，標示為已見過一次
      firstSeen[key] = true;
    }
  });
}

function clear_data() {
  newData = [];
  lastpage = 0;
}

function read() {
  $.ajax({
    type: "GET",
    url: "http://https://soleystudio.000webhostapp.com/api/manager/reserve/reserveTime-Read.php",
    dataType: "json",
    async: false,
    success: showdataReserveTime,
    error: function () {
      Swal.fire(
        "系統串接錯誤！ - manager/reserve/reserveTime-Read.php"
      );
    },
  });
}

function drawPage(data) {
  newData = [];
  lastpage = 0;
  data.forEach(function (item, key) {
    if (key % 20 == 0) {
      newData.push([]);
      lastpage++;
    }
    var page = parseInt(key / 20);
    newData[page].push(item);
  });

  drawTable(nowpage);

  $("#pageList").empty();
  var strHTML =
    '<li class="page-item disabled" id="pre"><a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;Previous</span></a></li>';
  $("#pageList").append(strHTML);

  newData.forEach(function (item, key) {
    var thisPage = key + 1;
    var strHTML =
      '<li class="page-item"><a class="page-link" name="page-link" href="#" id="page' +
      thisPage +
      '" data-key="' +
      key +
      '">' +
      thisPage +
      "</a></li>";
    $("#pageList").append(strHTML);
  });

  var strHTML =
    '<li class="page-item" id="next"><a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">Next&raquo;</span></a></li>';
  $("#pageList").append(strHTML);

  $("#page1").addClass("active");

  if (lastpage == 1) {
    $("#pre").addClass("d-none");
    $("#next").addClass("d-none");
  }
}
