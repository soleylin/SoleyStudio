var newData = [];
var lastpage = 0;
var nowpage = 0;
var reserveData = []; //reserve資料
var reserveNewData = []; //挑選過itemId的reserve資料
var selected_itemId = "0"; //已選擇的類別
var selected_id = []; //chk勾選的id

export { drawTable };
export { showdataReserve };
export { clear_data };
export { nowpage };

$(document).ready(function () {
  $("#all").click(function () {
    if ($(this).is(":checked")) {
      $(".chk").prop("checked", true);
    } else {
      $(".chk").prop("checked", false);
    }
  });
});

$(function () {
  read();

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

  //監聽selectList
  $("#searchList").change(function () {
    $("#mybody").empty();
    nowpage = 0;
    reserveNewData = [];
    selected_itemId = $(this).val();
    if ($(this).val() !== "") {
      reserveData.forEach(function (item) {
        if (item.itemId == selected_itemId) {
          reserveNewData.push(item);
        }
      });
      drawPage(reserveNewData);
    } else {
      drawPage(reserveData);
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
  $("body").on("click", "#delete_btn", function () {
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
        //每次點選都先清空
        selected_id = [];
        //蒐集勾選的id
        $.each($("input[name='id[]']:checked"), function () {
          selected_id.push($(this).val());
        });

        var dataJSON = {};
        dataJSON["chk"] = selected_id;

        $.ajax({
          type: "POST",
          url: "http://soleystudio.infinityfreeapp.com/api/manager/reserve/reserve-Delete.php",
          data: JSON.stringify(dataJSON),
          dataType: "json",
          success: showdata_delete,
          error: function () {
            Swal.fire("error-- manager/reserve/reserve-Delete.php");
          },
        });
      }
    });
  });
});

function showdataReserve(data) {
  reserveData = data.data;
  if (data.state) {
    drawPage(reserveData);
  } else {
    $("#mybody").html("");
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
  $("#searchList").append("<option selected value=''>預約總覽</option>");
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
        location.href = "https://soleylin.github.io/SoleyStudio/admin/reserveList.html";
      }
    });
  } else {
    alert(data.message);
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
      '<tr><td class="d-none d-md-block tdc input_chk"><input type="checkbox" class="chk form-check-input" name="id[]" value="' +
      item.id +
      '"/></td><td data-th="會員編號" class="tdc">' +
      item.memberId +
      '</td><td data-th="會員姓名" class="tdc">' +
      item.name +
      '</td><td data-th="會員電話" class="tdc">' +
      item.tel +
      '</td><td data-th="預約項目" class="tdc">' +
      item.serviceName +
      '</td><td data-th="預約時間" class="tdc">' +
      item.date +
      '</td><td data-th="訂金狀態" class="tdc" id="deposit' +
      item.id +
      '">' +
      item.deposit +
      '</td><td data-th="更新/完成" class="tdc"><button class="btn btn-success me-1" data-bs-toggle="modal" data-bs-target="#UpdateModal" data-id="' +
      item.id +
      '" data-memberid="' +
      item.memberId +
      '" data-name="' +
      item.name +
      '" data-tel="' +
      item.tel +
      '" data-itemid="' +
      item.itemId +
      '" data-deposit="' +
      item.deposit +
      '" data-date="' +
      item.date +
      '" id="update_btn">更新</button><button class="btn btn-danger d-md-none me-1" id="delete_btn" data-id="' +
      item.id +
      '" data-itemId="' +
      item.itemId +
      '" data-date="' +
      item.date +
      '">刪除</button><button class="btn done_btn" id="done_btn"  data-bs-toggle="modal" data-bs-target="#DoneModal" data-id="' +
      item.id +
      '" data-memberid="' +
      item.memberId +
      '" data-name="' +
      item.name +
      '"  data-servicename="' +
      item.serviceName +
      '" data-date="' +
      item.date +
      '">完成</button></td></tr>';
    $("#mybody").append(strHTML);
    if (item.deposit == "N") {
      $("#deposit" + item.id).addClass("text-danger");
    }
  });
  nowpage = page;
}

function clear_data() {
  newData = [];
  lastpage = 0;
}

function read() {
  $.ajax({
    type: "GET",
    url: "http://soleystudio.infinityfreeapp.com/api/manager/reserve/reserve-Read.php",
    dataType: "json",
    async: false,
    success: showdataReserve,
    error: function () {
      Swal.fire("系統串接錯誤！ - manager/reserve/reserve-Read.php");
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
