import { getCookie } from " https://soleylin.github.io/SoleyStudio/js/cookie.js";
var consumptionNum;
var chartMember;
var chartPrice;
var chartItem;
var chartMaterial;
var chartColor;
$(function () {
  //確認登入者身分
  // 判斷是否有uidCookie
  if (getCookie("uid") != "") {
    //uid存在，傳遞至後端api判斷是否正確
    var dataJSON = {};
    dataJSON["uid"] = getCookie("uid");
    $.ajax({
      type: "POST",
      url: "https://soleystudio.000webhostapp.com/api/manager/checkManager.php",
      data: JSON.stringify(dataJSON),
      dataType: "json",
      success: showdata_loginUid,
      error: function () {
        Swal.fire("error-- manager/checkManager.php");
      },
    });
  } else {
    $(".s2").html("");
    Swal.fire({
      title: "請登入會員",
      showDenyButton: false,
      showCancelButton: false,
      confirmButtonText: "前往登入頁面",
      confirmButtonColor: "#7d6868",
    }).then((result) => {
      if (result.isConfirmed) {
        location.href = "https://soleystudio.000webhostapp.com/";
      }
    });
  }

  //setChart
  var ctxPrice = document.getElementById("priceChart");
  chartPrice = new Chart(ctxPrice, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "每月營收成長圖",
          data: [],
          borderWidth: 2,
          backgroundColor: "#476da6",
          fill: true,
          pointRadius: 0,
          cubicInterpolationMode: "monotone",
        },
      ],
    },
    options: {
      maintainAspectRatio: false, 
      responsive: true, 
      scales: {
        y: {
          beginAtZero: false,
          ticks: {
            stepSize: 500,
          },
        },
      },
    },
  });

  var ctxMember = document.getElementById("memberChart");
  chartMember = new Chart(ctxMember, {
    type: "bar",
    data: {
      labels: [],
      datasets: [
        {
          label: "每月會員成長圖",
          data: [],
          borderWidth: 0,
          backgroundColor: "#494c64",
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 5,
          },
        },
      },
    },
  });

  var ctxItem = document.getElementById("itemChart");
  chartItem = new Chart(ctxItem, {
    type: "doughnut",
    data: {
      labels: [],
      datasets: [
        {
          label: "本月施作項目人數統計",
          data: [],
          borderWidth: 2,
          backgroundColor: ["#A6C2CE", "#EBC57C", "#6B799E"],
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 5,
          },
        },
      },
    },
  });

  var ctxColor = document.getElementById("colorChart");
  chartColor = new Chart(ctxColor, {
    type: "bar",
    data: {
      labels: [],
      datasets: [
        {
          label: "本季凝膠色系統計圖",
          data: [],
          borderWidth: 0,
          backgroundColor: [
            "#94553d",
            "#f08054",
            "#f5f5f0",
            "#f2cbde",
            "#ddb6f2",
            "#9feda7",
            "#9fc3ed",
            "#f5efba",
            "#5e5e5b",
          ],
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 5,
          },
        },
      },
    },
  });

  var ctxMaterial = document.getElementById("materialChart");
  chartMaterial = new Chart(ctxMaterial, {
    type: "bar",
    data: {
      labels: [],
      datasets: [
        {
          label: "本季材料使用統計圖",
          data: [],
          borderWidth: 0,
          backgroundColor: ["#9795A3", "#847072", "#9E6D70"],
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 5,
          },
        },
      },
    },
  });

  //渲染內容
  //會員人數
  $.ajax({
    type: "GET",
    url: "https://soleystudio.000webhostapp.com/api/manager/home/member-Read.php",
    dataType: "json",
    async: false,
    success: showdatamemberData,
    error: function () {
      Swal.fire("系統串接錯誤！ - manager/home/member-Read.php");
    },
  });

  //本月消費人數
  $.ajax({
    type: "GET",
    url: "https://soleystudio.000webhostapp.com/api/manager/home/record-Read.php",
    dataType: "json",
    async: false,
    success: showdataRecordData,
    error: function () {
      Swal.fire("系統串接錯誤！ - manager/home/record-Read.php");
    },
  });

  //回訪人數
  $.ajax({
    type: "GET",
    url: "https://soleystudio.000webhostapp.com/api/manager/home/recordVisit-Read.php",
    dataType: "json",
    async: false,
    success: showdataVisitData,
    error: function () {
      Swal.fire(
        "系統串接錯誤！ - manager/home/recordVisit-Read.php"
      );
    },
  });

  //每月會員新增人數
  $.ajax({
    type: "GET",
    url: "https://soleystudio.000webhostapp.com/api/manager/home/memberCount-Read.php",
    dataType: "json",
    async: false,
    success: showdataMemberCountData,
    error: function () {
      Swal.fire(
        "系統串接錯誤！ - manager/home/memberCount-Read.php"
      );
    },
  });

  //每月營收
  $.ajax({
    type: "GET",
    url: "https://soleystudio.000webhostapp.com/api/manager/home/priceCount-Read.php",
    dataType: "json",
    async: false,
    success: showdataPriceCountData,
    error: function () {
      Swal.fire("系統串接錯誤！ - manager/home/priceCount-Read.php");
    },
  });

  //本月項目數量
  $.ajax({
    type: "GET",
    url: "https://soleystudio.000webhostapp.com/api/manager/home/itemCount-Read.php",
    dataType: "json",
    async: false,
    success: showdataItemCountData,
    error: function () {
      Swal.fire("系統串接錯誤！ - manager/home/itemCount-Read.php");
    },
  });

  //本月營收
  $.ajax({
    type: "GET",
    url: "https://soleystudio.000webhostapp.com/api/manager/home/price-Read.php",
    dataType: "json",
    async: false,
    success: showdataPriceData,
    error: function () {
      Swal.fire("系統串接錯誤！ - manager/home/price-Read.php");
    },
  });

  //最新預約
  $.ajax({
    type: "GET",
    url: "https://soleystudio.000webhostapp.com/api/manager/home/reserve-Read.php",
    dataType: "json",
    async: false,
    success: showdataReserve,
    error: function () {
      Swal.fire("系統串接錯誤！ - manager/home/reserve-Read.php");
    },
  });

  //本季色系統計
  $.ajax({
    type: "GET",
    url: "https://soleystudio.000webhostapp.com/api/manager/home/colorCount-Read.php",
    dataType: "json",
    async: false,
    success: showdataColor,
    error: function () {
      Swal.fire("系統串接錯誤！ - manager/home/colorCount-Read.php");
    },
  });

  //本季材料統計
  $.ajax({
    type: "GET",
    url: "https://soleystudio.000webhostapp.com/api/manager/home/materialCount-Read.php",
    dataType: "json",
    async: false,
    success: showdataMaterial,
    error: function () {
      Swal.fire(
        "系統串接錯誤！ - manager/home/materialCount-Read.php"
      );
    },
  });
});

function showdatamemberData(data) {
  var memberNum = data.data.length;
  $(".counter01").text(memberNum);
}

function showdataRecordData(data) {
  consumptionNum = data.data.length;
  var PriceNum = data.pricedata[0].avgPrice;
  $(".counter02").text(consumptionNum);
}

function showdataPriceCountData(data) {
  $(".counter03").text(data.data[0].price);
}

function showdataVisitData(data) {
  var visitNum = data.data.length;
  var preVisit = data.predata.length;
  var rate = ((visitNum / preVisit) * 100).toFixed(2);
  $(".counter04").text(rate + " %");
}

function showdataMemberCountData(data) {
  //繪製圖表
  data.data.forEach(function (item, key) {
    chartMember.data.labels.push(item.month + "月"); 
    chartMember.data.datasets[0].data.push(item.num); 
  });
  chartMember.update();
}

function showdataPriceData(data) {
  //繪製圖表
  data.data.forEach(function (item, key) {
    var price = (item.price * 1).toFixed(0);
    chartPrice.data.labels.push(item.month + "月"); 
    chartPrice.data.datasets[0].data.push(price);
  });
  chartPrice.update();
}

function showdataItemCountData(data) {
  //繪製圖表
  data.data.forEach(function (item, key) {
    chartItem.data.labels.push(item.item); 
    chartItem.data.datasets[0].data.push(item.num); 
  });
  chartItem.update();
}

function showdataReserve(data) {
  var item = [];
  item = data.data;
  if (data.state) {
    var icon;
    $("#reserve_content").empty();
    for (var i = 0; i < 6; i++) {
      if (item[i].serviceName == "凝膠美甲") {
        icon = '<i class="fa-solid fa-palette"></i>';
      } else if (item[i].serviceName == "霧眉") {
        icon = '<i class="fa-solid fa-paper-plane"></i>';
      } else {
        icon = '<i class="fa-solid fa-face-smile"></i>';
      }
      var strHTML =
        '<div class="row reserve_content"><div class="col-md-1 icon">' +
        icon +
        '</div><div class="col-md-3 userName">' +
        item[i].name +
        '</div><div class="col-md-3 item">' +
        item[i].serviceName +
        '</div><div class="col-md-4 date"> ' +
        item[i].date +
        "</div></div>";

      $("#reserve_content").append(strHTML);
    }
  } else {
    $("#reserve_content").html("");
  }
}

function showdataColor(data) {
  //繪製圖表
  data.data.forEach(function (item, key) {
    chartColor.data.labels.push(item.color); 
    chartColor.data.datasets[0].data.push(item.num);
  });
  chartColor.update();
}

function showdataMaterial(data) {
  //繪製圖表
  data.data.forEach(function (item, key) {
    chartMaterial.data.labels.push(item.materialType);
    chartMaterial.data.datasets[0].data.push(item.num);
  });
  chartMaterial.update();
}

function showdata_loginUid(data) {
  if (data.data[0].level == "B100") {
    $(".s2").html("");
    Swal.fire({
      title: "僅提供管理者觀看, 將倒回首頁",
      showDenyButton: false,
      showCancelButton: false,
      confirmButtonText: "前往首頁",
      confirmButtonColor: "#7d6868",
    }).then((result) => {
      if (result.isConfirmed) {
        location.href = "https://soleystudio.000webhostapp.com/";
      }
    });
  } else {
    $(".home_logout").removeClass("d-none");
    $(".home_logout").addClass("d-block");
    $("#user_message").text(data.data[0].userName);
  }
}
