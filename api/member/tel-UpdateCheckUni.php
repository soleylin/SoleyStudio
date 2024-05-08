<?php

$data = file_get_contents("php://input", "r");
if ($data != "") {

    $mydata = array();
    $mydata = json_decode($data, true);

    if (isset($mydata["id"]) && isset($mydata["tel"]) && $mydata["id"] != "" && $mydata["tel"] != "") {

        $id = $mydata["id"];
        $tel = $mydata["tel"];

        header("Access-Control-Allow-Origin: https://soleylin.github.io");
        $servername = "localhost";
        $username = "id22010393_soley";
        $password = "Fdio3_dine";
        $dbname = "id22010393_soleystudio";

        $conn = mysqli_connect($servername, $username, $password, $dbname);

        if (!$conn) {
            die("連線失敗" . mysqli_connect_error());
        }

        $sql = "SELECT * FROM member WHERE tel = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $tel);
        $stmt->execute();
        $result = $stmt->get_result();

        //結果不為0代表有重複
        if ($result->num_rows == 0) {
            echo '{"state" : true, "message":"此聯絡電話不存在，可以使用"}';
        } else {
            $sql = "SELECT tel FROM member WHERE id = $id";
            $result = mysqli_query($conn, $sql);
            $row = mysqli_fetch_assoc($result);
            if ($tel == $row["tel"]) {
                echo '{"state" : true, "message" :"不變更電話"}';
            } else {
                echo '{"state" : false, "message" :"此聯絡電話已存在，不可使用！"}';
            }
        }
    } else {
        echo '{"state" : false, "message" :"傳遞參數格式錯誤！"}';
    }
} else {
    echo '{"state" : false, "message" :"未傳遞任何參數！"}';
}

mysqli_close($conn);
