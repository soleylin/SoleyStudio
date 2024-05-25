import { callback } from "./member/memberList.js";

export { drawTable };
export { nowpage };
export { pagination };

var newData = [];
var lastpage = 0;
var nowpage = 0;
function pagination(data, show_num, strHTML) {
  newData = [];
  lastpage = 0;
  nowpage = 0;
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

  //繪製頁碼
  data.data.forEach(function (item, key) {
    if (key % show_num == 0) {
      newData.push([]);
      lastpage++;
    }
    var page = parseInt(key / show_num);
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
  //刪除樣板
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

  //page active顯示當前頁面
  $(".page-link").removeClass("active");
  var pageid = "#page" + (page + 1);
  $(pageid).addClass("active");

  //forEach每次跑一列
  var thisPageData = [];

  newData[page].forEach(function (item) {
    thisPageData.push(item);
    nowpage = page;
  });
  callback(thisPageData);
}
