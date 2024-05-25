<?php

$data = file_get_contents("php://input", "r");
if ($data != "") {   

    $mydata = array();
    $mydata = json_decode($data, true);

    if (isset($mydata["itemId"]) && isset($mydata["date"]) && isset($mydata["time"]) && $mydata["itemId"] != "" && $mydata["date"] != "" && $mydata["time"] != "") {

        $itemId = $mydata["itemId"];
        $date = $mydata["date"];
        $time = $mydata["time"];
        $active = "N";

       header("Access-Control-Allow-Origin: https://soleylin.github.io");
        $servername = "localhost";
        $username = "id22010393_soley";
        $password = "Fdio3_dine";
        $dbname = "id22010393_soleystudio";

        $conn = mysqli_connect($servername, $username, $password, $dbname);

        if (!$conn) {
            die("連線失敗" . mysqli_connect_error());
        }
        $conn->set_charset("utf8");

        $sql = "INSERT INTO reserve_time (itemId, date, time, active) VALUES ('$itemId','$date','$time','$active')";

        if (mysqli_query($conn, $sql)) {
            echo '{"state" : true, "message":"新增成功！"}';
        } else {
            echo '{"state" : false, "message" :"新增失敗！"}';
        }
    } else {
        echo '{"state" : false, "message" :"傳遞參數格式錯誤！"}';
    }
} else {
    echo '{"state" : false, "message" :"未傳遞任何參數！"}';
}

mysqli_close($conn);
