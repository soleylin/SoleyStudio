<?php
$data = file_get_contents("php://input", "r");

if ($data != "") {

    $mydata = array();
    $mydata = json_decode($data, true);
    if (isset($mydata["itemName"]) && $mydata["itemName"] != "") {

        $itemName = $mydata["itemName"];

        header("Access-Control-Allow-Origin: https://soleylin.github.io");
        $servername = "localhost";
        $username = "id22010393_soley";
        $password = "Fdio3_dine";
        $dbname = "id22010393_soleystudio";

        $conn = mysqli_connect($servername, $username, $password, $dbname);
        if (!$conn) {
            die("連線失敗" . mysqli_connect_error());
        }
        if ($itemName == "all") {
            $sql = "SELECT a.*, b.name as serviceName FROM product a LEFT JOIN service_item b ON a.itemId = b.id where b.name = '臉部保養' AND a.active = 'Y';";
        } else {
            $sql = "SELECT a.*, b.name as serviceName FROM product a LEFT JOIN service_item b ON a.itemId = b.id where b.name = '臉部保養' AND a.name LIKE '%$itemName%' AND a.active = 'Y';";
        }

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
