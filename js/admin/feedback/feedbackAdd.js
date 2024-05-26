var flag_image = false;
var arrayLength;

$(function () {
  //監聽add_btn
  $(".add_btn").click(function () {
    $("#add_image").val("");
    $("#add_prevImg").addClass("d-none");
  });

  $("#add_image").change(function () {
    if (
      add_image.files[0].type == "image/jpeg" ||
      add_image.files[0].type == "image/png"
    ) {
      //顯示預覽圖
      $("#add_prevImg").removeClass("d-none");
      $("#add_prevImg").attr("src", URL.createObjectURL(add_image.files[0]));
      flag_image = true;
    } else {
      Swal.fire("圖片格式不符合");
      flag_image = false;
    }
  });

  //監聽確認鈕
  $("#modal_add_btn").click(function () {
    $.ajax({
      type: "GET",
      url: "https://soleystudio.000webhostapp.com/api/manager/feedback/feedback-Read.php",
      dataType: "json",
      async: false,
      success: showdataFeedback,
      error: function () {
        Swal.fire("系統串接錯誤！ - manager/feedback/feedback-Read.php");
      },
    });

    if (flag_image) {
      var formdata = new FormData();
      formdata.append("file", add_image.files[0]);

      $.ajax({
        type: "POST",
        url: "https://soleystudio.000webhostapp.com/api/manager/image/feedbackImage-Create.php",
        data: formdata,
        cache: false,
        contentType: false,
        processData: false,
        success: showdataImage,
        error: function () {
          alert("error-- manager/image/feedbackImage-Create.php");
        },
      });
    } else {
      Swal.fire("欄位有誤，請修正!");
    }
  });
});

function showdataImage(data) {
  console.log(data);
  var dataJSON = {};
  arrayLength = arrayLength + 1;
  dataJSON["sort"] = arrayLength;
  dataJSON["image"] = data.datainfo["name"];
  $.ajax({
    type: "POST",
    url: "https://soleystudio.000webhostapp.com/api/manager/feedback/feedback-Create.php",
    data: JSON.stringify(dataJSON),
    dataType: "json",
    success: showdata,
    error: function () {
      Swal.fire("error-- manager/feedback/feedback-Create.php");
    },
  });
}

function showdata(data) {
  if (data.state) {
    //顯示成功訊息
    Swal.fire({
      title: data.message,
      showDenyButton: false,
      showCancelButton: false,
      confirmButtonText: "確定",
      confirmButtonColor: "#7d6868",
    }).then((result) => {
      if (result.isConfirmed) {
        location.href =
          "https://soleylin.github.io/SoleyStudio/admin/feedback.html";
      }
    });
  } else {
    //顯示錯誤訊息
    Swal.fire(data.message);
  }
}

function showdataFeedback(data) {
  arrayLength = data.data.length;
}
