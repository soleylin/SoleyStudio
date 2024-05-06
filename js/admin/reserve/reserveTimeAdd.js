var flag_itemId = false;
var flag_date = false;
var flag_time = false;
$(function () {
  //監聽add_btn
  $(".add_btn").click(function () {
    $("#add_itemId").val("");
    $("#add_date").val("");
    $("#add_time").val("");
  });

  //監聽 #add_itemId
  $("#add_itemId").change(function () {
    if ($(this).val() !== 0) {
      flag_itemId = true;
    }
  });

  //監聽 #add_date
  $("#add_date").change(function () {
    if ($(this).val() !== 0) {
      flag_date = true;
    }
  });

  //監聽 #add_time
  $("#add_time").change(function () {
    if ($(this).val() !== 0) {
      flag_time = true;
    }
  });

  //監聽確認鈕
  $("#modal_add_btn").click(function () {
    if (flag_itemId && flag_date && flag_time) {
      var dataJSON = {};
      dataJSON["itemId"] = $("#add_itemId").val();
      dataJSON["date"] = $("#add_date").val();
      dataJSON["time"] = $("#add_time").val();

      $.ajax({
        type: "POST",
        url: "https://soleystudio.000webhostapp.com/api/manager/reserve/reserveTime-Create.php",
        data: JSON.stringify(dataJSON),
        dataType: "json",
        success: showdata,
        error: function () {
          Swal.fire("error-- manager/reserve/reserveTime-Create.php");
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
        location.href = "http://192.168.10.60/project/admin/reserveTime.html";
      }
    });
  } else {
    //顯示錯誤訊息
    Swal.fire(data.message);
  }
}
