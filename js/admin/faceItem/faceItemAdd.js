var flag_name = false;
$(function () {
  //監聽add_btn
  $(".add_btn").click(function () {
    $("#add_name").val("");
  });

  //監聽 #add_name
  $("#add_name").bind("input propertychange", function () {
    if ($(this).val().length > 0) {
      flag_name = true;
    }
  });

  //監聽確認鈕
  $("#modal_add_btn").click(function () {
    if (flag_name) {
      var dataJSON = {};
      dataJSON["name"] = $("#add_name").val();

      $.ajax({
        type: "POST",
        url: "https://soleystudio.000webhostapp.com/SoleyStudio/api/manager/faceItem/faceItem-Create.php",
        data: JSON.stringify(dataJSON),
        dataType: "json",
        success: showdata,
        error: function () {
          Swal.fire("error-- manager/faceItem/faceItem-Create.php");
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
        location.href = "http://192.168.10.60/project/admin/faceItem.html";
      }
    });
  } else {
    //顯示錯誤訊息
    Swal.fire(data.message);
  }
}
