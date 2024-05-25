import { getCookie } from "/SoleyStudio/js/setcookie.js";
var upd_id = getCookie("u_id");
var flag_tel = true;
$(function () {
  //監聽 #upd_member_btn
  $("#upd_member_btn").click(function () {
    upd_id = $(this).data("id");
    $("#member_acc").val($(this).data("acc"));
    $("#member_userName").val($(this).data("name"));
    $("#member_tel").val($(this).data("tel"));
    $("#member_tel").removeClass("is-valid");
    $("#member_tel").removeClass("is-invalid");
  });

  //監聽 #member_tel
  $("#member_tel").bind("input propertychange", function () {
    if ($(this).val().length == 10 && $(this).val().substr(0, 2) == "09") {
      //符合規定
      var dataJSON = {};
      dataJSON["id"] = upd_id;
      dataJSON["tel"] = $("#member_tel").val();

      $.ajax({
        type: "POST",
        url: "https://soleystudio.000webhostapp.com/api/member/tel-UpdateCheckUni.php",
        data: JSON.stringify(dataJSON),
        dataType: "json",
        success: showdata_tel_CheckUni,
        error: function () {
          Swal.fire("error-- member/tel-UpdateCheckUni.php");
        },
      });
    } else if ($(this).val().substr(0, 2) !== "09") {
      //不符合規定
      $(this).removeClass("is-valid");
      $(this).addClass("is-invalid");
      $("#member_tel_text02").html("格式錯誤");
    } else {
      //不符合規定
      $(this).removeClass("is-valid");
      $(this).addClass("is-invalid");
      $("#member_tel_text02").html("字數不符合規定");
    }
  });

  //監聽 #modal_update_btn
  $("#updMember_ok_btn").click(function () {
    if (flag_tel) {
      var dataJSON = {};
      dataJSON["id"] = upd_id;
      dataJSON["userName"] = $("#member_userName").val();
      dataJSON["tel"] = $("#member_tel").val();

      $.ajax({
        type: "POST",
        url: "https://soleystudio.000webhostapp.com/api/member/member-Update.php",
        data: JSON.stringify(dataJSON),
        dataType: "json",
        success: showdataMember_upd,
        error: function () {
          Swal.fire("error-- member/member-Update.php");
        },
      });
    } else {
      Swal.fire("欄位有誤，請修正!");
    }
  });
}); //$function();

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
        location.href = "https://soleylin.github.io/SoleyStudio/member.html";
      }
    });
  } else {
    Swal.fire(data.message);
  }
}

function showdata_tel_CheckUni(data) {
  if (data.state) {
    //顯示電話不存在，可以使用
    $("#member_tel_text01").html(data.message);
    $("#member_tel").addClass("is-valid");
    $("#member_tel").removeClass("is-invalid");
    flag_tel = true;
  } else {
    //顯示電話已存在，不可使用
    $("#member_tel_text02").html(
      "<font color='red'>" + data.message + "</font>"
    );
    $("#member_tel").addClass("is-invalid");
    $("#member_tel").removeClass("is-valid");
    flag_tel = false;
  }
}
