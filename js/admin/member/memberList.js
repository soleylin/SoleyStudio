var newData = [];
var lastpage = 0;
var nowpage = 0;
var selected_sort = "0"; //選擇的排序

export { drawTable };
export { showdataMember };
export { clear_data };
export { nowpage };
$(function () {
  read();

  $.ajax({
    type: "GET",
    url: "https://soleystudio.000webhostapp.com/SoleyStudio/api/manager/level/level-Read.php",
    dataType: "json",
    async: false,
    success: showdataLevel,
    error: function () {
      Swal.fire("系統串接錯誤！ - manager/level/level-Read.php");
    },
  });

  //監聽排序
  $(".avgPrice .sort_up").click(function () {
    $(this).removeClass("d-block");
    $(this).addClass("d-none");
    $(".avgPrice .sort_down").removeClass("d-none");
    $(".avgPrice .sort_down").addClass("d-block");
    $(".recent .sort_up").removeClass("d-block");
    $(".recent .sort_up").addClass("d-none");
    $(".recent .sort_down").removeClass("d-none");
    $(".recent .sort_down").addClass("d-block");
    selected_sort = "avgPrice ASC";
    read();
  });

  $(".avgPrice .sort_down").click(function () {
    $(this).removeClass("d-block");
    $(this).addClass("d-none");
    $(".avgPrice .sort_up").removeClass("d-none");
    $(".avgPrice .sort_up").addClass("d-block");
    $(".recent .sort_up").removeClass("d-block");
    $(".recent .sort_up").addClass("d-none");
    $(".recent .sort_down").removeClass("d-none");
    $(".recent .sort_down").addClass("d-block");
    selected_sort = "avgPrice DESC";
    read();
  });

  $(".recent .sort_up").click(function () {
    $(this).removeClass("d-block");
    $(this).addClass("d-none");
    $(".recent .sort_down").removeClass("d-none");
    $(".recent .sort_down").addClass("d-block");
    $(".avgPrice .sort_up").removeClass("d-block");
    $(".avgPrice .sort_up").addClass("d-none");
    $(".avgPrice .sort_down").removeClass("d-none");
    $(".avgPrice .sort_down").addClass("d-block");
    selected_sort = "recent ASC";
    read();
  });

  $(".recent .sort_down").click(function () {
    $(this).removeClass("d-block");
    $(this).addClass("d-none");
    $(".recent .sort_up").removeClass("d-none");
    $(".recent .sort_up").addClass("d-block");
    $(".avgPrice .sort_up").removeClass("d-block");
    $(".avgPrice .sort_up").addClass("d-none");
    $(".avgPrice .sort_down").removeClass("d-none");
    $(".avgPrice .sort_down").addClass("d-block");
    selected_sort = "recent DESC";
    read();
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
          url: "https://soleystudio.000webhostapp.com/SoleyStudio/api/manager/member/member-Delete.php",
          data: JSON.stringify(dataJSON),
          dataType: "json",
          success: showdata_delete,
          error: function () {
            Swal.fire("error-- manager/member/member-Delete.php");
          },
        });
      }
    });
  });

  //監聽submit
  $(".submit").click(function () {
    if ($("#search").val() == "") {
      read();
    } else {
      var dataJSON = {};
      dataJSON["msg"] = $("#search").val();

      $.ajax({
        type: "POST",
        url: "https://soleystudio.000webhostapp.com/SoleyStudio/api/manager/member/member-Search.php",
        data: JSON.stringify(dataJSON),
        dataType: "json",
        success: showdataSearch,
        error: function () {
          Swal.fire("error-- manager/member/member-Search.php");
        },
      });
    }
  });
});

function showdataMember(data) {
  data.data.forEach(function (item, key) {
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
    '<li class="page-item disabled" id="pre"><a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&lsaquo;Previous</span></a></li>';
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
    '<li class="page-item" id="next"><a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">Next&rsaquo;</span></a></li>';
  $("#pageList").append(strHTML);

  $("#page1").addClass("active");

  if (lastpage == 1) {
    $("#pre").addClass("d-none");
    $("#next").addClass("d-none");
  }
}

function showdataLevel(data) {
  data.data.forEach(function (item) {
    var strHTML =
      '<option value="' + item.code + '">' + item.name + "</option>";

    $("#md_level").append(strHTML);
  });
}

function showdataSearch(data) {
  $("#mybody").empty();
  $("#pageList").empty();
  if (data.data == undefined) {
    Swal.fire("查無資料");
  } else {
    data.data.forEach(function (item) {
      var recentItem;
      var recent;
      if (item.item == null) {
        recentItem = "";
      } else {
        recentItem = item.item;
      }
      if (item.recent == null) {
        recent = "";
      } else {
        recent = item.recent;
      }
      var strHTML =
        '<tr><td data-th="會員編號" class="tdc">' +
        item.id +
        '</td><td data-th="會員姓名" class="tdc">' +
        item.userName +
        '</td><td data-th="會員帳號" class="tdc">' +
        item.account +
        '</td><td data-th="會員電話" class="tdc">' +
        item.tel +
        '</td><td data-th="會員等級" class="tdc">' +
        item.levelName +
        '</td><td data-th="來店次數" class="tdc">' +
        item.times +
        '</td><td data-th="平均消費" class="tdc">' +
        item.avgPrice +
        '</td><td data-th="消費項目" class="tdc">' +
        recentItem +
        '</td><td data-th="消費日期" class="tdc">' +
        recent +
        '</td><td data-th="更新/刪除" class="tdc"><button class="btn btn-success me-1" data-bs-toggle="modal" data-bs-target="#UpdateModal" data-id="' +
        item.id +
        '" data-username="' +
        item.userName +
        '" data-tel="' +
        item.tel +
        '" data-level="' +
        item.level +
        '" data-times="' +
        item.times +
        '" data-avgprice="' +
        item.avgPrice +
        '" id="update_btn">更新</button><button class="btn btn-danger" id="delete_btn" data-id="' +
        item.id +
        '">刪除</button></td></tr>';

      $("#mybody").append(strHTML);
    });
  }
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
        location.href = "http://192.168.10.60/project/admin/member.html";
      }
    });
  } else {
    Swal.fire(data.message);
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
    var recentItem;
    var recent;
    if (item.item == null || item.item == "") {
      recentItem = "X";
    } else {
      recentItem = item.item;
    }
    if (item.recent == null || item.recent == "") {
      recent = "X";
    } else {
      recent = item.recent;
    }
    var avgPrice = numberComma(item.avgPrice);
    var strHTML =
      '<tr><td data-th="會員編號" class="tdc">' +
      item.id +
      '</td><td data-th="會員姓名" class="tdc">' +
      item.userName +
      '</td><td data-th="會員帳號" class="tdc">' +
      item.account +
      '</td><td data-th="會員電話" class="tdc">' +
      item.tel +
      '</td><td data-th="會員等級" class="tdc">' +
      item.levelName +
      '</td><td data-th="來店次數" class="tdc">' +
      item.times +
      '</td><td data-th="平均消費" class="tdc">' +
      avgPrice +
      '</td><td data-th="消費項目" class="tdc">' +
      recentItem +
      '</td><td data-th="消費日期" class="tdc">' +
      recent +
      '</td><td data-th="更新/刪除" class="tdc"><button class="btn btn-success me-1" data-bs-toggle="modal" data-bs-target="#UpdateModal" data-id="' +
      item.id +
      '" data-username="' +
      item.userName +
      '" data-tel="' +
      item.tel +
      '" data-level="' +
      item.level +
      '" data-times="' +
      item.times +
      '" data-avgprice="' +
      item.avgPrice +
      '" id="update_btn">更新</button><button class="btn btn-danger" id="delete_btn" data-id="' +
      item.id +
      '">刪除</button></td></tr>';

    $("#mybody").append(strHTML);
    nowpage = page;
  });
}

function clear_data() {
  newData = [];
  lastpage = 0;
}

function read() {
  newData = [];
  lastpage = 0;
  nowpage = 0;
  var dataJSON = {};
  dataJSON["sort"] = selected_sort;

  $.ajax({
    type: "GEPOSTT",
    url: "https://soleystudio.000webhostapp.com/SoleyStudio/api/manager/member/member-Read.php",
    data: JSON.stringify(dataJSON),
    dataType: "json",
    async: false,
    success: showdataMember,
    error: function () {
      Swal.fire("系統串接錯誤！ - manager/member/member-Read.php");
    },
  });
}

function numberComma(num) {
  var comma = /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g;
  return num.toString().replace(comma, ",");
}
