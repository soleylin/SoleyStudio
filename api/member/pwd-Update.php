<?php

$data = file_get_contents("php://input", "r");
if ($data != "") {

    $mydata = array();
    $mydata = json_decode($data, true);

    if (isset($mydata["id"]) && isset($mydata["password"]) && isset($mydata["oldpassword"]) && $mydata["id"] != "" && $mydata["password"] != "" && $mydata["oldpassword"] != "") {

        $id = $mydata["id"];
        $oldpwd = $mydata["oldpassword"];
        $pwd = password_hash($mydata["password"], PASSWORD_DEFAULT);

       // header("Access-Control-Allow-Origin: https://soleylin.github.io");
        $servername = "localhost";
        $username = "id22010393_soley";
        $password = "Fdio3_dine";
        $dbname = "id22010393_soleystudio";

        $conn = mysqli_connect($servername, $username, $password, $dbname);

        if (!$conn) {
            die("連線失敗" . mysqli_connect_error());
        }

        $sql = "SELECT account, password FROM member WHERE id = '$id'";
        $result = mysqli_query($conn, $sql);
        $row = mysqli_fetch_assoc($result);
        if (password_verify($oldpwd, $row["password"])) {
            //密碼比對正確，撈取不包含密碼的使用者資料
            $sql = "UPDATE member SET password = '$pwd' WHERE id = '$id'";
            if (mysqli_query($conn, $sql)) {
                //更新成功
                echo '{"state" : true, "message":"更新成功"}';
                //更新失敗
            } else {
                echo '{"state" : false, "message" :"更新失敗"}';
            }
        } else {
            //密碼比對錯誤
            echo '{"state" :false, "message": "密碼錯誤"}';
        }
    } else {
        echo '{"state" :false, "message": "傳遞參數格式錯誤！"}';
    }
} else {
    echo '{"state" :false, "message": "未傳遞任何參數！"}';
}

mysqli_close($conn);
