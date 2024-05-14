var newData = [];
var lastpage = 0;
var nowpage = 0;
var p_all = "all";

$(function () {
  read(p_all);
  $.ajax({
    type: "GET",
    url: "https://http://soleystudio.infinityfreeapp.com/api/manager/faceItem/faceItem-Read.php",
    dataType: "json",
    async: false,
    success: showdataitemList,
    error: function () {
      Swal.fire(
        "系統串接錯誤！ - manager/faceItem/faceItem-Read.php"
      );
    },
  });

  //lightbox
  lightbox.option({
    resizeDuration: 200,
    wrapAround: true,
    disableScrolling: true,
    fitImagesInViewport: true,
    fadeDuration: 600,
    albumLabel: "",
    alwaysShowNavOnTouchDevices: true,
  });

  $("body").on("click", " #itemList #faceItem", function () {
    newData = [];
    read($(this).data("itemname"));
  });

  $("body").on("click", "#pre", function () {
    if (nowpage > 0) {
      drawdata(nowpage - 1);
    }
  });
  $("body").on("click", "#next", function () {
    if (nowpage + 1 < lastpage) {
      drawdata(nowpage + 1);
    }
  });

  //監聽頁碼
  $("body").on("click", ".page-item .page-link[name='page-link']", function () {
    nowpage = $(this).data("key");
    drawdata(nowpage);
  });
});

function showdataitemList(data) {
  //渲染左側選單
  $("#itemList").empty();
  data.data.forEach(function (item, key) {
    var strHTML =
      '<li class="list-group-item my-2" id="faceItem" data-itemname="' +
      item.name +
      '"><div class="d-flex"><div class="fw-700">' +
      item.name +
      "</div></div></li>";
    $("#itemList").append(strHTML);
  });
}

function showdataProduct(data) {
  lastpage = 0;
  nowpage = 0;
  data.data.forEach(function (item, key) {
    if (key % 6 == 0) {
      newData.push([]);
      lastpage++;
    }
    var page = parseInt(key / 6);
    newData[page].push(item);
  });

  drawdata(nowpage);

  //渲染頁碼
  $("#pageList").empty();

  var strHTML =
    '<li class="page-item disabled" id="pre"><a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>';
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
    '<li class="page-item" id="next"><a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>';
  $("#pageList").append(strHTML);

  //第一頁active
  $("#page1").addClass("active");

  if (lastpage == 1) {
    $("#pre").addClass("d-none");
    $("#next").addClass("d-none");
  }
}

function drawdata(page) {
  $("#List").empty();

  //設定前後頁出現與否
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

  //page active顯示當前頁面
  $(".page-link").removeClass("active");
  var pageid = "#page" + (page + 1);
  $(pageid).addClass("active");

  //渲染產品
  newData[page].forEach(function (item) {
    var strHTML =
      '<div class="col-md-6 col-xl-4"><div class="s2_box ms-auto me-auto"><div class="s2_bgbox"></div><div class="s2_img"><img src="https://soleystudio.000webhostapp.com/image/admin/product/' +
      item.image +
      '" alt="" /></div><a href="https://soleystudio.000webhostapp.com/image/admin/product/' +
      item.image +
      '" data-lightbox="itemImage"><button class="btn mt-auto text-center fw-700">放大查看</button></a></div></div>';
    $("#List").append(strHTML);
    nowpage = page;
  });
}

function read(itemName) {
  var dataJSON = {};
  dataJSON["itemName"] = itemName;
  $.ajax({
    type: "POST",
    url: "https://http://soleystudio.infinityfreeapp.com/api/member/face-Read.php",
    data: JSON.stringify(dataJSON),
    dataType: "json",
    async: false,
    success: showdataProduct,
    error: function () {
      Swal.fire("系統串接錯誤！ - member/face-Read.php");
    },
  });
}
