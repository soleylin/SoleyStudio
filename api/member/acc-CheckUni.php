<?php

$data = file_get_contents("php://input", "r");
if ($data != "") {

    $mydata = array();
    $mydata = json_decode($data, true);

    if (isset($mydata["account"]) && $mydata["account"] != "") {

        $acc = $mydata["account"];

       // header("Access-Control-Allow-Origin: https://soleylin.github.io");
        $servername = "localhost";
        $username = "id22010393_soley";
        $password = "Fdio3_dine";
        $dbname = "id22010393_soleystudio";

        $conn = mysqli_connect($servername, $username, $password, $dbname);

        if (!$conn) {
            die("連線失敗" . mysqli_connect_error());
        }

        $sql = "SELECT * FROM member WHERE account = ?";
        //stmt = 資料庫與sql連接
        $stmt = $conn->prepare($sql);
        //比對字串
        $stmt->bind_param("s", $acc);
        //執行
        $stmt->execute();
        //得到結果
        $result = $stmt->get_result();

        //結果不為0代表有重複
        if ($result->num_rows == 0) {
            echo '{"state" : true, "message":"帳號不存在，可以使用"}';
        } else {
            echo '{"state" : false, "message" :"帳號已存在，不可使用！"}';
        }
    } else {
        echo '{"state" : false, "message" :"傳遞參數格式錯誤！"}';
    }
} else {
    echo '{"state" : false, "message" :"未傳遞任何參數！"}';
}

mysqli_close($conn);
