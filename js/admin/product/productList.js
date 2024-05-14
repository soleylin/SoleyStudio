var newData = [];
var lastpage = 0;
var nowpage = 0;
var number = 5; //每頁顯示筆數
var selected_itemId = "0"; //已選擇的類別
var selected_sort = "0"; //選擇的排序

export { drawTable };
export { showdataProduct };
export { clear_data };
export { nowpage };
export { selected_sort };
$(function () {
  read();
  readFaceItem();
  readServiceItem();

  //監聽selectList
  $("#searchList").change(function () {
    nowpage = 0;
    read();
  });

  //監聽numberList
  $("#numberList").change(function () {
    nowpage = 0;
    number = $(this).val();
    read();
  });

  //監聽排序
  $(".itemNo .sort_up").click(function () {
    $(this).removeClass("d-block");
    $(this).addClass("d-none");
    $(".itemNo .sort_down").removeClass("d-none");
    $(".itemNo .sort_down").addClass("d-block");
    $(".active .sort_up").removeClass("d-block");
    $(".active .sort_up").addClass("d-none");
    $(".active .sort_down").removeClass("d-none");
    $(".active .sort_down").addClass("d-block");
    $(".created .sort_up").removeClass("d-block");
    $(".created .sort_up").addClass("d-none");
    $(".created .sort_down").removeClass("d-none");
    $(".created .sort_down").addClass("d-block");
    selected_sort = "itemNo DESC";
    read();
  });

  $(".itemNo .sort_down").click(function () {
    $(this).removeClass("d-block");
    $(this).addClass("d-none");
    $(".itemNo .sort_up").removeClass("d-none");
    $(".itemNo .sort_up").addClass("d-block");
    $(".active .sort_up").removeClass("d-block");
    $(".active .sort_up").addClass("d-none");
    $(".active .sort_down").removeClass("d-none");
    $(".active .sort_down").addClass("d-block");
    $(".created .sort_up").removeClass("d-block");
    $(".created .sort_up").addClass("d-none");
    $(".created .sort_down").removeClass("d-none");
    $(".created .sort_down").addClass("d-block");
    selected_sort = "itemNo ASC";
    read();
  });

  $(".active .sort_up").click(function () {
    $(this).removeClass("d-block");
    $(this).addClass("d-none");
    $(".active .sort_down").removeClass("d-none");
    $(".active .sort_down").addClass("d-block");
    $(".itemNo .sort_up").removeClass("d-block");
    $(".itemNo .sort_up").addClass("d-none");
    $(".itemNo .sort_down").removeClass("d-none");
    $(".itemNo .sort_down").addClass("d-block");
    $(".created .sort_up").removeClass("d-block");
    $(".created .sort_up").addClass("d-none");
    $(".created .sort_down").removeClass("d-none");
    $(".created .sort_down").addClass("d-block");
    selected_sort = "active ASC";
    read();
  });

  $(".active .sort_down").click(function () {
    $(this).removeClass("d-block");
    $(this).addClass("d-none");
    $(".active .sort_up").removeClass("d-none");
    $(".active .sort_up").addClass("d-block");
    $(".itemNo .sort_up").removeClass("d-block");
    $(".itemNo .sort_up").addClass("d-none");
    $(".itemNo .sort_down").removeClass("d-none");
    $(".itemNo .sort_down").addClass("d-block");
    $(".created .sort_up").removeClass("d-block");
    $(".created .sort_up").addClass("d-none");
    $(".created .sort_down").removeClass("d-none");
    $(".created .sort_down").addClass("d-block");
    selected_sort = "active DESC";
    read();
  });

  $(".created .sort_up").click(function () {
    $(this).removeClass("d-block");
    $(this).addClass("d-none");
    $(".created .sort_down").removeClass("d-none");
    $(".created .sort_down").addClass("d-block");
    $(".itemNo .sort_up").removeClass("d-block");
    $(".itemNo .sort_up").addClass("d-none");
    $(".itemNo .sort_down").removeClass("d-none");
    $(".itemNo .sort_down").addClass("d-block");
    $(".active .sort_up").removeClass("d-block");
    $(".active .sort_up").addClass("d-none");
    $(".active .sort_down").removeClass("d-none");
    $(".active .sort_down").addClass("d-block");
    selected_sort = "created_at DESC";
    read();
  });

  $(".created .sort_down").click(function () {
    $(this).removeClass("d-block");
    $(this).addClass("d-none");
    $(".created .sort_up").removeClass("d-none");
    $(".created .sort_up").addClass("d-block");
    $(".itemNo .sort_up").removeClass("d-block");
    $(".itemNo .sort_up").addClass("d-none");
    $(".itemNo .sort_down").removeClass("d-none");
    $(".itemNo .sort_down").addClass("d-block");
    $(".active .sort_up").removeClass("d-block");
    $(".active .sort_up").addClass("d-none");
    $(".active .sort_down").removeClass("d-none");
    $(".active .sort_down").addClass("d-block");
    selected_sort = "created_at ASC";
    read();
  });

  //監聽前一頁按鈕
  $("body").on("click", "#pre", function () {
    if (nowpage > 0) {
      drawTable(nowpage - 1);
    }
  });

  //監聽下一頁按鈕
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
          url: "http://https://soleystudio.000webhostapp.com/api/manager/product/product-Delete.php",
          data: JSON.stringify(dataJSON),
          dataType: "json",
          success: showdata_delete,
          error: function () {
            Swal.fire("error-- manager/product/product-Delete.php");
          },
        });
      }
    });
  });
});

function showdataProduct(data) {
  if (data.state) {
    $("#searchList").val(data.itemId[0]);
    newData = [];
    lastpage = 0;
    data.data.forEach(function (item, key) {
      if (key % number == 0) {
        newData.push([]);
        lastpage++;
      }

      var page = parseInt(key / number);
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
  $("#searchList").append("<option selected value='0'>產品總覽</option>");
  data.data.forEach(function (item) {
    var strHTML = '<option value="' + item.id + '">' + item.name + "</option>";

    $("#add_itemId").append(strHTML);
    $("#upd_itemId").append(strHTML);
    $("#searchList").append(strHTML);
  });
}

function showdataFaceItem(data) {
  $("#add_faceItem").empty();
  $("#upd_faceItem").empty();
  //渲染臉部保養item
  data.data.forEach(function (item) {
    var strHTML =
      '<div class="form-check form-check-inline"><input type="checkbox" class="form-check-input" name="add_chk" id="add_chk' +
      item.id +
      '" value="' +
      item.name +
      '"/> <label for="chk' +
      item.id +
      '" class="form-check-label">' +
      item.name +
      "</label></div>";

    $("#add_faceItem").append(strHTML);

    var strHTML =
      '<div class="form-check form-check-inline"><input type="checkbox" class="form-check-input" name="upd_chk" id="upd_chk' +
      item.id +
      '" value="' +
      item.name +
      '"/> <label for="chk' +
      item.id +
      '" class="form-check-label">' +
      item.name +
      "</label></div>";

    $("#upd_faceItem").append(strHTML);
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
        location.href = "https://soleylin.github.io/SoleyStudio/admin/product.html";
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
    var priceComma = numberComma(item.price);
    var strHTML =
      '<tr><td data-th="產品編號" class="tdc">' +
      item.itemNo +
      '</td><td data-th="服務項目" class="tdc">' +
      item.serviceName +
      '</td><td data-th="名稱" class="tdc">' +
      item.name +
      '</td><td data-th="圖片" class="tdc"> <img src="https://soleystudio.000webhostapp.com/image/admin/product/' +
      item.image +
      '" alt="" class="mt-1 mb-1 bg-cover imgList" ></td><td data-th="價格" class="tdc">' +
      priceComma +
      '</td><td data-th="上架狀態" class="tdc">' +
      item.active +
      '</td><td data-th="建檔時間" class="tdc">' +
      item.created_at +
      '</td><td data-th="更新/刪除" class="tdc"><button class="btn btn-success me-1" data-bs-toggle="modal" data-bs-target="#UpdateModal" data-id="' +
      item.id +
      '" data-itemno="' +
      item.itemNo +
      '" data-itemid="' +
      item.itemId +
      '" data-name="' +
      item.name +
      '" data-image="' +
      item.image +
      '" data-price="' +
      item.price +
      '" data-active="' +
      item.active +
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

function read() {
  var dataJSON = {};
  selected_itemId = $("#searchList").val();
  dataJSON["itemId"] = selected_itemId;
  dataJSON["sort"] = selected_sort;

  $.ajax({
    type: "POST",
    url: "http://https://soleystudio.000webhostapp.com/api/manager/product/product-Read.php",
    data: JSON.stringify(dataJSON),
    dataType: "json",
    async: false,
    success: showdataProduct,
    error: function () {
      Swal.fire("系統串接錯誤！ - manager/product/product-Read.php");
    },
  });
}

function readFaceItem() {
  $.ajax({
    type: "GET",
    url: "http://https://soleystudio.000webhostapp.com/api/manager/faceItem/faceItem-Read.php",
    dataType: "json",
    async: false,
    success: showdataFaceItem,
    error: function () {
      Swal.fire(
        "系統串接錯誤！ - manager/faceItem/faceItem-Read.php"
      );
    },
  });
}

function readServiceItem() {
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
}

function numberComma(num) {
  var comma = /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g;
  return num.toString().replace(comma, ",");
}
