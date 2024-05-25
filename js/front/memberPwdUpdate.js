import { getCookie } from "/SoleyStudio/js/setcookie.js";
var upd_id = getCookie("u_id");
var flag_oldpwd = false;
var flag_pwd = false;
var flag_repwd = false;
$(function () {
  //監聽 #upd_pwd_btn
  $("#upd_pwd_btn").click(function () {
    upd_id = $(this).data("id");
    $("#memberPwd_acc").val($(this).data("acc"));
    $("#memberPwd_oldpwd").val("");
    $("#memberPwd_pwd").val("");
    $("#memberPwd_repwd").val("");
    $("#memberPwd_repwd").removeClass("is-valid");
    $("#memberPwd_repwd").removeClass("is-invalid");
  });

  //監聽 #memberPwd_pwd
  $("#memberPwd_pwd").bind("input propertychange", function () {
    if ($(this).val().length > 2 && $(this).val().length < 16) {
      //符合規定
      $(this).removeClass("is-invalid");
      $(this).addClass("is-valid");
      flag_pwd = true;

      if ($("#memberPwd_repwd").val() == $(this).val()) {
        //與確認密碼相同
        $("#memberPwd_repwd").removeClass("is-invalid");
        $("#memberPwd_repwd").addClass("is-valid");
        flag_repwd = true;
      } else {
        //與確認密碼不同
        $("#memberPwd_repwd").removeClass("is-valid");
        $("#memberPwd_repwd").addClass("is-invalid");
        flag_repwd = false;
      }
    } else {
      //不符合規定
      $(this).removeClass("is-valid");
      $(this).addClass("is-invalid");
      $("#memberPwd_pwd").removeClass("is-valid");
      $("#memberPwd_pwd").addClass("is-invalid");
      $("#memberPwd_repwd").removeClass("is-valid");
      $("#memberPwd_repwd").addClass("is-invalid");
      flag_pwd = false;
    }
  });

  //監聽 #memberPwd_repwd
  $("#memberPwd_repwd").bind("input propertychange", function () {
    if ($(this).val() == $("#memberPwd_pwd").val()) {
      //與密碼相同
      $(this).removeClass("is-invalid");
      $(this).addClass("is-valid");
      flag_repwd = true;
    } else {
      //與密碼不同
      $(this).removeClass("is-valid");
      $(this).addClass("is-invalid");
      flag_repwd = false;
    }
  });

  //舊密碼顯示
  $("#oldPwd_icon1").click(function () {
    $("#oldPwd_icon1").addClass("d-none");
    $("#oldPwd_icon1").removeClass("d-block");
    $("#oldPwd_icon2").addClass("d-block");
    $("#oldPwd_icon2").removeClass("d-none");
    $("#memberPwd_oldpwd").attr("type", "text");
  });

  $("#oldPwd_icon2").click(function () {
    $("#oldPwd_icon2").addClass("d-none");
    $("#oldPwd_icon2").removeClass("d-block");
    $("#oldPwd_icon1").addClass("d-block");
    $("#oldPwd_icon1").removeClass("d-none");
    $("#memberPwd_oldpwd").attr("type", "password");
  });

  //新密碼顯示
  $("#pwd_icon1").click(function () {
    $("#pwd_icon1").addClass("d-none");
    $("#pwd_icon1").removeClass("d-block");
    $("#pwd_icon2").addClass("d-block");
    $("#pwd_icon2").removeClass("d-none");
    $("#memberPwd_pwd").attr("type", "text");
  });

  $("#pwd_icon2").click(function () {
    $("#pwd_icon2").addClass("d-none");
    $("#pwd_icon2").removeClass("d-block");
    $("#pwd_icon1").addClass("d-block");
    $("#pwd_icon1").removeClass("d-none");
    $("#memberPwd_pwd").attr("type", "password");
  });

  //確認密碼顯示
  $("#rePwd_icon1").click(function () {
    $("#rePwd_icon1").addClass("d-none");
    $("#rePwd_icon1").removeClass("d-block");
    $("#rePwd_icon2").addClass("d-block");
    $("#rePwd_icon2").removeClass("d-none");
    $("#memberPwd_repwd").attr("type", "text");
  });

  $("#rePwd_icon2").click(function () {
    $("#rePwd_icon2").addClass("d-none");
    $("#rePwd_icon2").removeClass("d-block");
    $("#rePwd_icon1").addClass("d-block");
    $("#rePwd_icon1").removeClass("d-none");
    $("#memberPwd_repwd").attr("type", "password");
  });

  //監聽 #updPwd_ok_btn
  $("#updPwd_ok_btn").click(function () {
    if ($("#memberPwd_oldpwd").val().length > 0) {
      flag_oldpwd = true;
    } else {
      flag_oldpwd = false;
    }

    if (flag_oldpwd && flag_pwd && flag_repwd) {
      var dataJSON = {};
      dataJSON["id"] = upd_id;
      dataJSON["password"] = $("#memberPwd_pwd").val();
      dataJSON["oldpassword"] = $("#memberPwd_oldpwd").val();

      $.ajax({
        type: "POST",
        url: "https://soleystudio.000webhostapp.com/api/member/pwd-Update.php",
        data: JSON.stringify(dataJSON),
        dataType: "json",
        success: showdata_memberPwd_update,
        error: function () {
          Swal.fire("error-- member/pwd-Update.php");
        },
      });
    } else {
      Swal.fire("欄位有誤，請修正!");
      if ($("#memberPwd_repwd").val().length > 0) {
        $("#memberPwd_repwd_text").html("");
      } else {
        $("#memberPwd_repwd_text").html("請確認密碼");
      }
    }
  });
});

function showdata_memberPwd_update(data) {
  if (data.state) {
    Swal.fire({
      title: data.message,
      showDenyButton: false,
      showCancelButton: false,
      confirmButtonText: "確定",
    }).then((result) => {
      if (result.isConfirmed) {
        location.href = "https://soleylin.github.io/SoleyStudio/member.html";
      }
    });
  } else {
    Swal.fire({
      title: data.message,
      showDenyButton: false,
      showCancelButton: false,
      confirmButtonText: "確定",
    });
  }
}
