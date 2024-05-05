var newData = [];
var lastpage = 0;
var nowpage = 0;
var dragged; // 保存拖動元素

export { drawTable };
export { showdataFeedback };
export { clear_data };
export { nowpage };

$(function () {
  $.ajax({
    type: "GET",
    url: "https://soleystudio.000webhostapp.com/SoleyStudio/api/manager/feedback/feedback-Read.php",
    dataType: "json",
    async: false,
    success: showdataFeedback,
    error: function () {
      Swal.fire(
        "系統串接錯誤！ - manager/feedback/feedback-Read.php"
      );
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
      denyButtonColor: "#9E5757",
    }).then((result) => {
      if (result.isConfirmed) {
        var dataJSON = {};
        dataJSON["id"] = $(this).data("id");
        dataJSON["image"] = $(this).data("image");

        $.ajax({
          type: "POST",
          url: "https://soleystudio.000webhostapp.com/SoleyStudio/api/manager/feedback/feedback-Delete.php",
          data: JSON.stringify(dataJSON),
          dataType: "json",
          success: showdata_delete,
          error: function () {
            Swal.fire(
              "error-- manager/feedback/feedback-Delete.php"
            );
          },
        });
      }
    });
  });
});

function showdataFeedback(data) {
  if (data.state) {
    newData = [];
    lastpage = 0;
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
  } else {
    Swal.fire(data.message);
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
        location.href = "http://192.168.10.60/project/admin/feedback.html";
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
      '<tr><td data-th="圖檔" class="tdc"><img src="/project/image/admin/feedback/' +
      item.image +
      '" alt="" class="mt-3" style="height: 300px" /></td><td data-th="建檔時間" class="tdc">' +
      item.created_at +
      '</td><td data-th="更新/刪除" class="tdc"><button class="btn btn-success me-1" data-bs-toggle="modal" data-bs-target="#UpdateModal" data-id="' +
      item.id +
      '" data-sort="' +
      item.sort +
      '" data-image="' +
      item.image +
      '" id="update_btn">更新</button><button class="btn btn-danger" id="delete_btn" data-id="' +
      item.id +
      '" data-image="' +
      item.image +
      '">刪除</button></td></tr>';

    $("body #mybody").append(strHTML);
    nowpage = page;
  });
}

function clear_data() {
  newData = [];
  lastpage = 0;
}
