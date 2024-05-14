$(function () {
  //判斷是否有uidCookie
  if (getCookie("uid") != "") {
    //uid存在，傳遞至後端api判斷是否正確
    var dataJSON = {};
    dataJSON["uid"] = getCookie("uid");
    $.ajax({
      type: "POST",
      url: "http://https://soleystudio.000webhostapp.com/api/manager/checkManager.php",
      data: JSON.stringify(dataJSON),
      dataType: "json",
      success: showdata_loginUid,
      error: function () {
        Swal.fire("error-- manager/checkManager.php");
      },
    });
  } else {
    $("#content").html("");
    Swal.fire({
      title: "請登入會員",
      showDenyButton: false,
      showCancelButton: false,
      confirmButtonText: "前往登入頁面",
      confirmButtonColor: "#7d6868",
    }).then((result) => {
      if (result.isConfirmed) {
        location.href = "https://soleylin.github.io/SoleyStudio";
      }
    });
  }
});

function showdata_loginUid(data) {
  if (data.data[0].level == "B100") {
    $("#content").html("");
    Swal.fire({
      title: "僅提供管理者觀看, 將倒回首頁",
      showDenyButton: false,
      showCancelButton: false,
      confirmButtonText: "前往首頁",
      confirmButtonColor: "#7d6868",
    }).then((result) => {
      if (result.isConfirmed) {
        location.href = "https://soleylin.github.io/SoleyStudio";
      }
    });
  } else if (data.data[0].level !== "A100") {
    $("#content").html("");
    Swal.fire({
      title: "僅提供最高管理者觀看, <br/>將倒回首頁",
      showDenyButton: false,
      showCancelButton: false,
      confirmButtonText: "返回",
      confirmButtonColor: "#7d6868",
    }).then((result) => {
      if (result.isConfirmed) {
        location.href = "https://soleylin.github.io/SoleyStudio/admin/home.html";
      }
    });
  } else {
    $("#user_message").removeClass("d-none");
    $("#user_message").addClass("d-block");
    $("#logout_btn").removeClass("d-none");
    $("#logout_btn").addClass("d-block");
    $("#user_message").text(data.data[0].userName);
  }
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