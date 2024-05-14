var newData = [];
var lastpage = 0;
var nowpage = 0;

$(function () {
  $.ajax({
    type: "GET",
    url: "https://http://soleystudio.infinityfreeapp.com/api/manager/menu/menu-Read.php",
    dataType: "json",
    async: false,
    success: showdataMenu,
    error: function () {
      Swal.fire("系統串接錯誤！ - manager/menu/menu-Read.php");
    },
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
          url: "https://http://soleystudio.infinityfreeapp.com/api/manager/menu/menu-Delete.php",
          data: JSON.stringify(dataJSON),
          dataType: "json",
          success: showdata_delete,
          error: function () {
            Swal.fire("error-- manager/menu/menu-Delete.php");
          },
        });
      }
    });
  });
});

function showdataMenu(data) {
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
        location.href = "https://soleylin.github.io/SoleyStudio/admin/menu.html";
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
      '<tr><td data-th="階層" class="tdc">' +
      item.layer1 +
      '</td><td data-th="排序" class="tdc">' +
      item.sort +
      '</td><td data-th="標題" class="tdc">' +
      item.title +
      '</td><td data-th="網址">' +
      item.url +
      '</td><td data-th="建檔時間" class="tdc">' +
      item.created_at +
      '</td><td data-th="更新/刪除" class="tdc"><button class="btn btn-success me-1" data-bs-toggle="modal" data-bs-target="#UpdateModal" data-id="' +
      item.id +
      '" data-layer1="' +
      item.layer1 +
      '" data-sort="' +
      item.sort +
      '" data-title="' +
      item.title +
      '" data-url="' +
      item.url +
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
