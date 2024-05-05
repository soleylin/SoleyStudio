<?php

$data = file_get_contents("php://input", "r");
if ($data != "") {   

    $mydata = array();
    $mydata = json_decode($data, true);

    if (isset($mydata["userName"]) && isset($mydata["account"]) && isset($mydata["password"]) && isset($mydata["tel"]) && $mydata["userName"] != "" && $mydata["account"] != "" && $mydata["password"] != "" && $mydata["tel"] != "") {

        $user = $mydata["userName"];
        $acc = $mydata["account"];
        $pwd = password_hash($mydata["password"], PASSWORD_DEFAULT);
        $tel = $mydata["tel"];
        $level = "B100";
        $times = 0;
        $avgPrice = 0;

        $servername = "localhost";
        $username = "soley";
        $password = "123";
        $dbname = "demodb";

        $conn = mysqli_connect($servername, $username, $password, $dbname);

        if (!$conn) {
            die("連線失敗" . mysqli_connect_error());
        }

        $sql = "INSERT INTO member (userName, account, password, tel, level, times, avgPrice) VALUES ('$user','$acc','$pwd','$tel','$level','$times','$avgPrice')";

        if (mysqli_query($conn, $sql)) {
            echo '{"state" : true, "message":"註冊成功！"}';
        } else {
            echo '{"state" : false, "message" :"註冊失敗！"}';
        }
    } else {
        echo '{"state" : false, "message" :"傳遞參數格式錯誤！"}';
    }
} else {
    echo '{"state" : false, "message" :"未傳遞任何參數！"}';
}

mysqli_close($conn);
