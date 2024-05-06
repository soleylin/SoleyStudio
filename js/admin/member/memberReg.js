var flag_username = false;
var flag_acc = false;
var flag_pwd = false;
var flag_re_pwd = false;
var flag_tel = false;

$(function () {
  //監聽reg_btn
  $(".reg_btn").click(function () {
    $("#reg_userName").val("");
    $("#reg_acc").val("");
    $("#reg_pwd").val("");
    $("#reg_re_pwd").val("");
    $("#reg_tel").val("");
    $("#reg_acc").removeClass("is-valid");
    $("#reg_acc").removeClass("is-invalid");
    $("#reg_pwd").removeClass("is-valid");
    $("#reg_pwd").removeClass("is-invalid");
    $("#reg_re_pwd").removeClass("is-valid");
    $("#reg_re_pwd").removeClass("is-invalid");
    $("#reg_tel").removeClass("is-valid");
    $("#reg_tel").removeClass("is-invalid");
    $("#reg_agree_chk").prop("checked", false);
    $("#reg_agree_text").html("");
  });

  //監聽 #reg_userName
  $("#reg_userName").bind("input propertychange", function () {
    if ($(this).val.length > 0) {
      flag_username = true;
    }
  });

  //監聽reg_username_placehoder
  $("#reg_userName").focus(function () {
    $(this).prop("placeholder", "");
  });
  $("#reg_userName").blur(function () {
    $(this).prop("placeholder", "請輸入真實姓名");
  });

  //監聽 #reg_acc
  $("#reg_acc").bind("input propertychange", function () {
    if ($(this).val().length > 4 && $(this).val().length < 16) {
      //符合規定
      var dataJSON = {};
      dataJSON["account"] = $("#reg_acc").val();

      $.ajax({
        type: "POST",
        url: "https://soleystudio.000webhostapp.com/api/member/acc-CheckUni.php",
        data: JSON.stringify(dataJSON),
        dataType: "json",
        success: showdata_acc_CheckUni,
        error: function () {
          Swal.fire("error-- member/acc-CheckUni.php");
        },
      });
    } else {
      //不符合規定
      $(this).addClass("is-invalid");
      $(this).removeClass("is-valid");
      $("#reg_acc_text02").html("字數不符合規定");
    }
  });

  //監聽 #reg_pwd
  $("#reg_pwd").bind("input propertychange", function () {
    if ($(this).val().length > 2 && $(this).val().length < 16) {
      //符合規定
      $(this).removeClass("is-invalid");
      $(this).addClass("is-valid");
      flag_pwd = true;
    } else {
      //不符合規定
      $(this).removeClass("is-valid");
      $(this).addClass("is-invalid");
      flag_pwd = false;
    }
  });

  //監聽 #reg_re_pwd
  $("#reg_re_pwd").bind("input propertychange", function () {
    if ($(this).val() == $("#reg_pwd").val()) {
      //與密碼相同
      $(this).removeClass("is-invalid");
      $(this).addClass("is-valid");
      flag_re_pwd = true;
    } else {
      //與密碼不同
      $(this).removeClass("is-valid");
      $(this).addClass("is-invalid");
      flag_re_pwd = false;
    }
  });

  //監聽 #reg_tel
  $("#reg_tel").bind("input propertychange", function () {
    if ($(this).val().length == 10 && $(this).val().substr(0, 2) == "09") {
      //符合規定
      var dataJSON = {};
      dataJSON["tel"] = $("#reg_tel").val();

      $.ajax({
        type: "POST",
        url: "https://soleystudio.000webhostapp.com/api/member/tel-CheckUni.php",
        data: JSON.stringify(dataJSON),
        dataType: "json",
        success: showdata_tel_CheckUni,
        error: function () {
          Swal.fire("error-- member/tel-CheckUni.php");
        },
      });
    } else if ($(this).val().substr(0, 2) !== "09") {
      //不符合規定
      $(this).removeClass("is-valid");
      $(this).addClass("is-invalid");
      $("#reg_tel_text02").html("格式錯誤");
    } else {
      //不符合規定
      $(this).removeClass("is-valid");
      $(this).addClass("is-invalid");
      $("#reg_tel_text02").html("字數不符合規定");
    }
  });

  //監聽reg_tel_placehoder
  $("#reg_tel").focus(function () {
    $(this).prop("placeholder", "");
  });
  $("#reg_tel").blur(function () {
    $(this).prop("placeholder", "0912345678");
  });

  //監聽確認鈕
  $("#reg_ok_btn").click(function () {
    if (flag_username && flag_acc && flag_pwd && flag_re_pwd && flag_tel) {
      var dataJSON = {};
      dataJSON["userName"] = $("#reg_userName").val();
      dataJSON["account"] = $("#reg_acc").val();
      dataJSON["password"] = $("#reg_pwd").val();
      dataJSON["tel"] = $("#reg_tel").val();

      $.ajax({
        type: "POST",
        url: "https://soleystudio.000webhostapp.com/api/member/member-Create.php",
        data: JSON.stringify(dataJSON),
        dataType: "json",
        success: showdata,
        error: function () {
          Swal.fire("error-- member/member-Create.php");
        },
      });
    } else {
      Swal.fire("欄位有誤，請修正!");
    }

    //註冊密碼輸入格式錯誤時
    if (flag_pwd == false) {
      $("#reg_pwd").val("");
      $("#reg_re_pwd").val("");
      $("#reg_re_pwd").removeClass("is-valid");
      $("#reg_re_pwd").removeClass("is-invalid");
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
        location.href = "http://192.168.10.60/project/admin/member.html";
      }
    });
  } else {
    //顯示錯誤訊息
    Swal.fire(data.message);
  }
}

function showdata_acc_CheckUni(data) {
  if (data.state) {
    //顯示帳號不存在，可以使用
    $("#reg_acc_text01").html(data.message);
    $("#reg_acc").addClass("is-valid");
    $("#reg_acc").removeClass("is-invalid");
    flag_acc = true;
  } else {
    //顯示帳號已存在，不可使用
    $("#reg_acc_text02").html("<font color='red'>" + data.message + "</font>");
    $("#reg_acc").addClass("is-invalid");
    $("#reg_acc").removeClass("is-valid");
    flag_acc = false;
  }
}

function showdata_tel_CheckUni(data) {
  if (data.state) {
    //顯示電話不存在，可以使用
    $("#reg_tel").addClass("is-valid");
    $("#reg_tel").removeClass("is-invalid");
    flag_tel = true;
  } else {
    //顯示電話已存在，不可使用
    $("#reg_tel_text02").html("<font color='red'>" + data.message + "</font>");
    $("#reg_tel").addClass("is-invalid");
    $("#reg_tel").removeClass("is-valid");
    flag_tel = false;
  }
}
