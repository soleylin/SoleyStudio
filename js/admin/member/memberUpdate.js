$(function () {
  var upd_id;

  //監聽 #update_btn
  $("body").on("click", " #mybody #update_btn", function () {
    upd_id = $(this).data("id");
    $("#md_userName").val($(this).data("username"));
    $("#md_tel").val($(this).data("tel"));
    $("#md_level").val($(this).data("level"));
  });

  //監聽 #modal_update_btn
  $("#modal_update_btn").click(function () {
    var dataJSON = {};
    dataJSON["id"] = upd_id;
    dataJSON["level"] = $("#md_level").val();

    $.ajax({
      type: "POST",
      url: "https://soleystudio.000webhostapp.com/api/manager/member/member-Update.php",
      data: JSON.stringify(dataJSON),
      dataType: "json",
      success: showdataMember_upd,
      error: function () {
        Swal.fire("error-- manager/member/member-Update.php");
      },
    });
  });
});
function showdataMember_upd(data) {
  if (data.state) {
    Swal.fire({
      title: data.message,
      showDenyButton: false,
      showCancelButton: false,
      confirmButtonText: "確定",
      confirmButtonColor: "#7d6868",
    }).then((result) => {
      if (result.isConfirmed) {
        location.href = "https://soleylin.github.io/SoleyStudio/admin/member.html";
      }
    });
  } else {
    Swal.fire(data.message);
  }
}
