<?php
$data = file_get_contents("php://input", "r");
if ($data != "") {

    $mydata = array();
    $mydata = json_decode($data, true);

    if (isset($mydata["id"]) && isset($mydata["level"]) && $mydata["id"] != "" && $mydata["level"] != "") {
        
        if ($mydata["id"] !== 3) {

            $id = $mydata["id"];
            $level = $mydata["level"];

            $servername = "localhost";
            $username = "soley";
            $password = "123";
            $dbname = "demodb";

            $conn = mysqli_connect($servername, $username, $password, $dbname);

            if (!$conn) {
                die("連線失敗" . mysqli_connect_error());
            }

            $sql = "UPDATE member SET level = '$level' WHERE id = '$id'";

            if (mysqli_query($conn, $sql)) {
                echo '{"state" : true, "message":"更新成功"}';
            } else {
                echo '{"state" : false, "message" :"更新失敗"}';
            }
        } else {
            echo '{"state" : false, "message" :"此帳號不得更新管理員階級"}';
        }
    } else {
        echo '{"state" : false, "message" :"參數格式錯誤！"}';
    }
} else {
    echo '{"state" : false, "message" :"未傳遞任何參數！"}';
}

mysqli_close($conn);
