var layer1 = [];
var counter = [];
var titleData = [];

$(function () {
  $.ajax({
    type: "GET",
    url: "https://https://soleystudio.000webhostapp.com/api/manager/adminNav-Read.php",
    dataType: "json",
    async: false,
    success: showdata_nav,
    error: function () {
      Swal.fire("error-- manager/adminNav-Read.php");
    },
  });
});



function showdata_nav(data) {
  data.data.forEach(function (item, key) {
    var getLayer1 = item.layer1;
    if (getLayer1 == null || getLayer1 == "") {
      getLayer1 = "未分類";
    }
    if (counter[getLayer1] == undefined) {
      counter[getLayer1] = titleData.length;
      titleData.push(new Array());
      layer1[counter[getLayer1]] = getLayer1;
    }
    titleData[counter[getLayer1]].push(item);
  });

  $("#AdminList").empty();
  for (var i = 0; i < titleData[counter["未分類"]].length; i++) {
    var strHTML =
      '<li class="AdminList-item"><a href="' +
      titleData[counter["未分類"]][i].url +
      '" class=" text-white"><span>' +
      titleData[counter["未分類"]][i].title +
      "</span></a></li>";
    $("#AdminList").append(strHTML);
  }

  for (i = 0; i < layer1.length; i++) {
    if (layer1[i] !== "未分類") {
      var strHTML =
        '<li class="AdminList-item"><a class="dropdown-toggle text-white" role="button" data-bs-toggle="dropdown">' +
        layer1[i] +
        '</a><ul class="dropdown-menu" id="dropdown-menu' +
        i +
        '"></ul></li>';
      $("#AdminList").append(strHTML);
      if (titleData[i][0].layer1 == layer1[i]) {
        for (var k = 0; k < titleData[i].length; k++) {
          strHTML =
            '<li><a class="dropdown-item" href="' +
            titleData[i][k].url +
            '">' +
            titleData[i][k].title +
            "</a></li>";
          $("#dropdown-menu" + [i]).append(strHTML);
        }
      }
    }
  }
}
