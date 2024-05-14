var flag_title = false;
var flag_sort = false;
var flag_url = false;
$(function () {
  //監聽add_btn
  $(".add_btn").click(function () {
    $("#add_layer1").val("");
    $("#add_title").val("");
    $("#add_sort").val("");
    $("#add_url").val("");
    $("#add_layer1").removeClass("is-valid");
    $("#add_layer1").removeClass("is-invalid");
    $("#add_title").removeClass("is-valid");
    $("#add_title").removeClass("is-invalid");
    $("#add_url").removeClass("is-valid");
    $("#add_url").removeClass("is-invalid");
  });

  //監聽 #add_sort
  $("#add_sort").bind("input propertychange", function () {
    if ($(this).val().length > 0) {
      flag_sort = true;
    }
  });

  //監聽 #add_title
  $("#add_title").bind("input propertychange", function () {
    if ($(this).val().length > 0) {
      flag_title = true;
    }
  });

  //監聽 #add_url
  $("#add_url").bind("input propertychange", function () {
    if ($(this).val().length > 0) {
      flag_url = true;
    }
  });

  //監聽確認鈕
  $("#modal_add_btn").click(function () {
    if (flag_title && flag_url && flag_sort) {
      var dataJSON = {};
      dataJSON["layer1"] = $("#add_layer1").val();
      dataJSON["sort"] = $("#add_sort").val();
      dataJSON["title"] = $("#add_title").val();
      dataJSON["url"] = $("#add_url").val();

      $.ajax({
        type: "POST",
        url: "https://http://soleystudio.infinityfreeapp.com/api/manager/menu/menu-Create.php",
        data: JSON.stringify(dataJSON),
        dataType: "json",
        success: showdata,
        error: function () {
          Swal.fire("error-- manager/menu/menu-Create.php");
        },
      });
    } else {
      Swal.fire("欄位有誤，請修正!");
    }
  });
});

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
        location.href = "https://soleylin.github.io/SoleyStudio/admin/menu.html";
      }
    });
  } else {
    //顯示錯誤訊息
    Swal.fire(data.message);
  }
}
