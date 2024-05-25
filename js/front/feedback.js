var newData = [];
var lastpage = 0;
var nowpage = 0;

$(function () {
  $.ajax({
    type: "GET",
    url: "https://https://soleystudio.000webhostapp.com/api/member/feedback-Read.php",
    dataType: "json",
    async: false,
    success: showdataProduct,
    error: function () {
      Swal.fire("系統串接錯誤！ - member/feedback-Read.php");
    },
  });

  //lightbox
  lightbox.option({
    resizeDuration: 200,
    wrapAround: true,
    disableScrolling: true,
    fitImagesInViewport: true,
    fadeDuration: 600,
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

function showdataProduct(data) {
  data.data.forEach(function (item, key) {
    if (key % 8 == 0) {
      newData.push([]);
      lastpage++;
    }
    var page = parseInt(key / 8);
    newData[page].push(item);
  });

  drawTable(nowpage);

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

  $("#page1").addClass("active");

  if (lastpage == 1) {
    $("#pre").addClass("d-none");
    $("#next").addClass("d-none");
  }
}

function drawTable(page) {
  $("#List").empty();

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
      '<div class="col-md-6 col-lg-4 col-xl-3"><div class="s2_box ms-auto me-auto"><div class="s2_bgbox"></div><div class="s2_img bg-cover"><img src="https://soleylin.github.io/SoleyStudio/image/admin/feedback/' +
      item.image +
      '" alt="" /></div><a href="https://soleylin.github.io/SoleyStudio/image/admin/feedback/' +
      item.image +
      '" data-lightbox="itemImage"><button class="btn mt-auto text-center fw-700">放大查看</button></a></div></div>';

    $("#List").append(strHTML);
    nowpage = page;
  });
}
