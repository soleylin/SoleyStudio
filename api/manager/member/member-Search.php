<?php
$data = file_get_contents("php://input", "r");
if ($data != "") {

    $mydata = array();
    $mydata = json_decode($data, true);

    if (isset($mydata["msg"])) {

        $msg = $mydata["msg"];

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

        $sql = "SELECT a.*, b.name AS levelName FROM member a LEFT JOIN level b ON a.level = b.code WHERE a.id LIKE '%$msg%' OR a.userName LIKE '%$msg%' OR a.account LIKE '%$msg%' OR a.tel LIKE '%$msg%' ORDER BY a.id DESC";
        $result = mysqli_query($conn, $sql);
        $mydata = array();
        if (mysqli_num_rows($result) > 0) {
            while ($row = mysqli_fetch_assoc($result)) {
                $mydata[] = $row;
            }
            echo '{"state" : true, "data" : ' . json_encode($mydata) . ', "message" :"查詢資料成功！"}';
        } else {
            echo '{"state" : false, "message" :"查無資料！"}';
        }
    } else {
        echo '{"state" :false, "message": "傳遞參數格式錯誤！"}';
    }
} else {
    echo '{"state" :false, "message": "未傳遞任何參數！"}';
}
mysqli_close($conn);
