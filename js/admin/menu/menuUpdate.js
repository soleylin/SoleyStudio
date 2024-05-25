$(function () {
  var upd_id;

  //監聽 #update_btn
  $("body").on("click", " #mybody #update_btn", function () {
    upd_id = $(this).data("id");
    $("#upd_layer1").val($(this).data("layer1"));
    $("#upd_sort").val($(this).data("sort"));
    $("#upd_title").val($(this).data("title"));
    $("#upd_url").val($(this).data("url"));
  });

  //監聽 #modal_update_btn
  $("#modal_update_btn").click(function () {
    var dataJSON = {};
    dataJSON["id"] = upd_id;
    dataJSON["layer1"] = $("#upd_layer1").val();
    dataJSON["sort"] = $("#upd_sort").val();
    dataJSON["title"] = $("#upd_title").val();
    dataJSON["url"] = $("#upd_url").val();

    $.ajax({
      type: "POST",
      url: "https://https://soleystudio.000webhostapp.com/api/manager/menu/menu-Update.php",
      data: JSON.stringify(dataJSON),
      dataType: "json",
      success: showdataMenu_upd,
      error: function () {
        Swal.fire("error-- manager/menu/menu-Update.php");
      },
    });
  });
});

function showdataMenu_upd(data) {
  if (data.state) {
    Swal.fire({
      title: data.message,
      showDenyButton: false,
      showCancelButton: false,
      confirmButtonText: "確定",
      confirmButtonColor: "#7d6868",
    }).then((result) => {
      if (result.isConfirmed) {
        location.href="https://soleylin.github.io/SoleyStudio/admin/menu.html";
      }
    });
  } else {
    Swal.fire(data.message);
  }
}