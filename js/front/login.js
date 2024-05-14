$(function () {
  //判斷是否有uidCookie
  if (getCookie("uid") != "") {
    //uid存在
    var dataJSON = {};
    dataJSON["uid01"] = getCookie("uid");
    $.ajax({
      type: "POST",
      url: "http://https://soleystudio.000webhostapp.com/api/member/member-LoginUid.php",
      data: JSON.stringify(dataJSON),
      dataType: "json",
      success: showdata_loginUid,
      error: function () {
        Swal.fire("error-- member/member-LoginUid.php");
      },
    });
  }

  $("#login_btn").click(function () {
    $("#login_acc").val("");
    $("#login_pwd").val("");
  });

  $("#login_icon1").click(function () {
    $("#login_icon1").addClass("d-none");
    $("#login_icon1").removeClass("d-block");
    $("#login_icon2").addClass("d-block");
    $("#login_icon2").removeClass("d-none");
    $("#login_pwd").attr("type", "text");
  });

  $("#login_icon2").click(function () {
    $("#login_icon2").addClass("d-none");
    $("#login_icon2").removeClass("d-block");
    $("#login_icon1").addClass("d-block");
    $("#login_icon1").removeClass("d-none");
    $("#login_pwd").attr("type", "password");
  });

  $("#login_ok_btn").click(function () {
    var dataJSON = {};
    dataJSON["account"] = $("#login_acc").val();
    dataJSON["password"] = $("#login_pwd").val();
    $.ajax({
      type: "POST",
      url: "http://https://soleystudio.000webhostapp.com/api/member/member-Login.php",
      data: JSON.stringify(dataJSON),
      dataType: "json",
      success: showdata_login,
      error: function () {
        Swal.fire("error-- member/member-Login.php");
      },
    });
  });
});

function showdata_login(data) {
  if (data.state) {
    if (data.data[0].level !== "B100") {
      Swal.fire({
        title: data.message,
        showDenyButton: false,
        showCancelButton: false,
        confirmButtonText: "確定",
        confirmButtonColor: "#7d6868",
      });
      setCookie("uid", data.data[0].uid01, 7);
      setCookie("u_id", data.data[0].id, 7);
      $("#loginModal").modal("hide");
      $("#user_message").text(data.data[0].userName);
      $("#login_btn").addClass("d-none");
      $("#logout_btn").removeClass("d-none");
      $("#logout_btn").addClass("d-block");
      $("#navbar_admin").removeClass("d-none");
      $("#navbar_admin").addClass("d-block");
      $("#user_message").removeClass("d-none");
      $("#user_message").addClass("d-block");
      $("#navbar_member").removeClass("disabled");
      $("#navbar_member").removeClass("disabled");
      $("#navbar_reserve").removeClass("disabled");
      $("#navbar_reserve").removeClass("disabled");
    } else {
      Swal.fire({
        title: data.message,
        showDenyButton: false,
        showCancelButton: false,
        confirmButtonText: "確定",
        confirmButtonColor: "#7d6868",
      });
      setCookie("uid", data.data[0].uid01, 7);
      setCookie("u_id", data.data[0].id, 7);
      $("#loginModal").modal("hide");
      $("#user_message").text(data.data[0].userName);
      $("#login_btn").addClass("d-none");
      $("#logout_btn").removeClass("d-none");
      $("#logout_btn").addClass("d-block");
      $("#user_message").removeClass("d-none");
      $("#user_message").addClass("d-block");
      $("#navbar_member").removeClass("disabled");
      $("#navbar_member").removeClass("disabled");
      $("#navbar_reserve").removeClass("disabled");
      $("#navbar_reserve").removeClass("disabled");
    }
  } else {
    Swal.fire(data.message);
  }
}

function showdata_loginUid(data) {
  if (data.state) {
    if (data.data[0].level !== "B100") {
      setCookie("u_id", data.data[0].id, 7);
      $("#loginModal").modal("hide");
      $("#user_message").text(data.data[0].userName);
      $("#login_btn").addClass("d-none");
      $("#logout_btn").removeClass("d-none");
      $("#logout_btn").addClass("d-block");
      $("#navbar_admin").removeClass("d-none");
      $("#navbar_admin").addClass("d-block");
      $("#user_message").removeClass("d-none");
      $("#user_message").addClass("d-block");
      $("#navbar_member").removeClass("disabled");
      $("#navbar_member").removeClass("disabled");
      $("#navbar_reserve").removeClass("disabled");
      $("#navbar_reserve").removeClass("disabled");
    } else {
      setCookie("u_id", data.data[0].id, 7);
      $("#loginModal").modal("hide");
      $("#user_message").text(data.data[0].userName);
      $("#login_btn").addClass("d-none");
      $("#logout_btn").removeClass("d-none");
      $("#logout_btn").addClass("d-block");
      $("#user_message").removeClass("d-none");
      $("#user_message").addClass("d-block");
      $("#navbar_member").removeClass("disabled");
      $("#navbar_member").removeClass("disabled");
      $("#navbar_reserve").removeClass("disabled");
      $("#navbar_reserve").removeClass("disabled");
    }
  }
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}