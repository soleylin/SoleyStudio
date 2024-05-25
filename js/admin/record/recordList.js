var newData = [];
var lastpage = 0;
var nowpage = 0;
var recordData = []; //reserve資料
var recordNewData = []; //挑選過itemId的資料
var selected_item = ""; //已選擇的類別

export { drawTable };
export { showdataRecord };
export { clear_data };
export { nowpage };

$(function () {
  $.ajax({
    type: "GET",
    url: "https://https://soleystudio.000webhostapp.com/api/manager/record/record-Read.php",
    dataType: "json",
    async: false,
    success: showdataRecord,
    error: function () {
      Swal.fire("系統串接錯誤！ - manager/record/record-Read.php");
    },
  });

  $.ajax({
    type: "GET",
    url: "https://https://soleystudio.000webhostapp.com/api/manager/serviceItem/serviceItem-Read.php",
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
    recordNewData = [];
    selected_item = $(this).val();
    if ($(this).val() !== "") {
      recordData.forEach(function (item) {
        if (item.item == selected_item) {
          recordNewData.push(item);
        }
      });
      drawPage(recordNewData);
    } else {
      drawPage(recordData);
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
});

function showdataRecord(data) {
  recordData = data.data;
  $("#mybody").empty();
  data.data.forEach(function (item) {
    if (data.state) {
      drawPage(recordData);
    } else {
      $("#mybody").html("");
      Swal.fire(data.message);
    }
  });
}

function showdataItemId(data) {
  $("#searchList").empty();
  $("#searchList").append("<option selected value=''>總覽</option>");
  data.data.forEach(function (item) {
    var strHTML =
      '<option value="' + item.name + '">' + item.name + "</option>";
    $("#searchList").append(strHTML);
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
    if (item.faceItem == "") {
      var detail = item.color + "/" + item.material;
    } else {
      var detail = item.faceItem;
    }
    var strHTML =
      '<tr><td data-th="會員編號" class="tdc">' +
      item.memberId +
      '</td><td data-th="會員姓名" class="tdc">' +
      item.name +
      '</td><td data-th="預約項目" class="tdc">' +
      item.item +
      '</td><td data-th="預約日期" class="tdc">' +
      item.date +
      '</td><td data-th="施作項目" class="tdc">' +
      detail +
      '</td><td data-th="消費金額" class="tdc">' +
      item.price +
      '</td><td data-th="修改" class="tdc"><button class="btn btn-success me-1" data-bs-toggle="modal" data-bs-target="#UpdateModal" data-id="' +
      item.id +
      '" data-memberid="' +
      item.memberId +
      '" data-name="' +
      item.name +
      '" data-item="' +
      item.item +
      '" data-date="' +
      item.date +
      '" data-color="' +
      item.color +
      '" data-material="' +
      item.material +
      '" data-faceitem="' +
      item.faceItem +
      '" data-price="' +
      item.price +
      '" id="update_btn">更新</button></td></tr>';
    $("#mybody").append(strHTML);
  });
  nowpage = page;
}

function clear_data() {
  newData = [];
  lastpage = 0;
}
