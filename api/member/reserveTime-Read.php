<?php
$data = file_get_contents("php://input", "r");
if ($data != "") {

    $mydata = array();
    $mydata = json_decode($data, true);
    if (isset($mydata["itemId"]) && $mydata["itemId"] != "") {

        $itemId = $mydata["itemId"];

        header("Access-Control-Allow-Origin: https://soleylin.github.io");
        $servername = "localhost";
        $username = "id22010393_soley";
        $password = "Fdio3_dine";
        $dbname = "id22010393_soleystudio";

        $conn = mysqli_connect($servername, $username, $password, $dbname);
        if (!$conn) {
            die("連線失敗" . mysqli_connect_error());
        }

        $sql = "SELECT a.*, b.name AS serviceName FROM reserve_time a LEFT JOIN service_item b ON a.itemId = b.id WHERE active = 'N' AND itemId = $itemId AND ( a.date > CURDATE() OR (a.date = CURDATE() AND a.time > CURTIME())) ORDER BY a.date ASC";

        $result = mysqli_query($conn, $sql);
        $mydata = array();

        if (mysqli_num_rows($result) > 0) {
            while ($row = mysqli_fetch_assoc($result)) {
                $mydata[] = $row;
            }
            echo '{"state": true, "data":' . json_encode($mydata) . ', "message":"資料查詢成功"}';
        } else {
            echo '{"state": false, "message":"查無資料"}';
        }
    } else {
        echo '{"state" : false, "message" :"參數格式錯誤！"}';
    }
} else {
    echo '{"state" : false, "message" :"未傳遞任何參數！"}';
}

mysqli_close($conn);
