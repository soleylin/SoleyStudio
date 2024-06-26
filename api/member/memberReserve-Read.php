<?php
$data = file_get_contents("php://input", "r");
if ($data != "") {

    $mydata = array();
    $mydata = json_decode($data, true);

    if (isset($mydata["id"]) && $mydata["id"] != "") {

        $id = $mydata["id"];

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

        $sql = "SELECT a.date, b.name AS serviceName FROM reserve a JOIN service_item b ON a.itemId = b.id WHERE a.memberId = '$id' AND DATE(a.date) > CURDATE() OR (DATE(a.date) = CURDATE() AND TIME(a.date) > CURTIME()) ORDER BY a.date ASC";
        $result = mysqli_query($conn, $sql);
        if (mysqli_num_rows($result) > 0) {
            $mydata = array();
            while ($row = mysqli_fetch_assoc($result)) {
                $mydata[] = $row;
            }
            echo '{"state" : true, "data" : ' . json_encode($mydata) . ', "message" :"查詢資料成功！"}';
        } else {
            $mydata = array();
            $row = array();
            $row["serviceName"] = "未預約";
            $row["date"] = "未預約";
            $mydata[] = $row;
            
            echo '{"state" : false, "data" : ' . json_encode($mydata) . ' ,"message" :"查詢資料失敗,查無資料！"}';
        }
    } else {
        echo '{"state" :false, "message": "傳遞參數格式錯誤！"}';
    }
} else {
    echo '{"state" :false, "message": "未傳遞任何參數！"}';
}
mysqli_close($conn);
