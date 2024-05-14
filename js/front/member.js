import { getCookie } from "/js/cookie.js";
var u_id = getCookie("u_id");
$(function () {
  var dataJSON = {};
  dataJSON["id"] = u_id;

  $.ajax({
    type: "POST",
    url: "https://http://soleystudio.infinityfreeapp.com/api/member/member-Read.php",
    data: JSON.stringify(dataJSON),
    dataType: "json",
    async: false,
    success: showdata,
    error: function () {
      Swal.fire("系統串接錯誤！-- member/member-Read.php");
    },
  });

  $.ajax({
    type: "POST",
    url: "https://http://soleystudio.infinityfreeapp.com/api/member/memberReserve-Read.php",
    data: JSON.stringify(dataJSON),
    dataType: "json",
    async: false,
    success: showdataReserve,
    error: function () {
      Swal.fire("系統串接錯誤！-- member/memberReserve-Read.php");
    },
  });

  //監聽 #update_btn
  $("#mybody #update_btn").click(function () {
    $("#member_userName").val($(this).data("name"));
    $("#member_email").val($(this).data("email"));
    $("#member_email").removeClass("is-invalid");
    $("#member_email").removeClass("is-valid");
  });

  //監聽 #updatePwd_btn
  $("#mybody #updatePwd_btn").click(function () {
    $("#memberPwd_userName").val($(this).data("name"));
    $("#memberPwd_oldpwd").val("");
    $("#memberPwd_oldpwd").removeClass("is-invalid");
    $("#memberPwd_oldpwd").removeClass("is-valid");
    $("#memberPwd_pwd").val("");
    $("#memberPwd_pwd").removeClass("is-invalid");
    $("#memberPwd_pwd").removeClass("is-valid");
    $("#memberPwd_repwd").val("");
    $("#memberPwd_repwd_text").html("");
    $("#memberPwd_repwd").removeClass("is-invalid");
    $("#memberPwd_repwd").removeClass("is-valid");
  });

  $("#member_ok_btn").click(function () {
    $("#memberModal").modal("hide");
  });

  $("#memberPwd_ok_btn").click(function () {
    $("#memberPwdModal").modal("hide");
  });
});

function showdata(data) {
  $("#dataList").empty();
  $("#endList").empty();
  $("#endText").empty();
  data.data.forEach(function (item) {
    var strHTML =
      '<div class="mb-4"><div class="s2_content_title">會員帳號</div><div class="s2_content_box"><span>' +
      item.account +
      '</span></div></div><div class="mb-4"><div class="s2_content_title">姓名</div><div class="s2_content_box"><span>' +
      item.userName +
      '</span></div></div><div class="mb-4"><div class="s2_content_title">連絡電話</div><div class="s2_content_box"><span>' +
      item.tel +
      "</span></div></div>";
    $("#dataList").append(strHTML);
    var strHTML =
      '<div class="text-end"><button class="btn me-2" id="upd_member_btn" data-bs-toggle="modal" data-bs-target="#updMemberModal" data-id="' +
      item.id +
      '" data-acc="' +
      item.account +
      '" data-name="' +
      item.userName +
      '"data-tel="' +
      item.tel +
      '">修改資料</button><button class="btn" id="upd_pwd_btn" data-bs-toggle="modal" data-bs-target="#updPwdModal" data-id="' +
      item.id +
      '" data-acc="' +
      item.account +
      '" data-name="' +
      item.userName +
      '">修改密碼</button></div>';
    $("#endList").append(strHTML);
    $("#endText").append('<div class="remark_text text-end mt-1">欲修改預約項目或日期請洽詢 line</div>');
  });
}

function showdataReserve(data) {
  $("#reserveList").empty();
  data.data.forEach(function (item) {
    var strHTML =
      '<div class="col-md-5"><div class="mb-4"><div class="s2_content_title">預約項目</div><div class="s2_content_box"><span>' +
      item.serviceName +
      '</span></div></div></div><div class="col-md-7"><div class="mb-4"><div class="s2_content_title">預約日期</div><div class="s2_content_box"><span>' +
      item.date +
      "</span></div></div></div>";
    $("#reserveList").append(strHTML);
  });
}
