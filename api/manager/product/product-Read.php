<?php
$data = file_get_contents("php://input", "r");

if ($data != "") {

    $mydata = array();
    $mydata = json_decode($data, true);
    if (isset($mydata["itemId"]) && isset($mydata["sort"]) && $mydata["itemId"] != "" && $mydata["sort"] != "") {

        $itemId = $mydata["itemId"];
        $sort = $mydata["sort"];

        header("Access-Control-Allow-Origin: https://soleylin.github.io");
        $servername = "localhost";
        $username = "id22010393_soley";
        $password = "Fdio3_dine";
        $dbname = "id22010393_soleystudio";

        $conn = mysqli_connect($servername, $username, $password, $dbname);
        if (!$conn) {
            die("連線失敗" . mysqli_connect_error());
        }
        if ($itemId == "0") {
            if ($sort == "0") {
                $sql = "SELECT a.*, b.name as serviceName FROM product a LEFT JOIN service_item b ON a.itemId = b.id ORDER BY a.id DESC";
            } else {
                $sql = "SELECT a.*, b.name as serviceName FROM product a LEFT JOIN service_item b ON a.itemId = b.id ORDER BY a.$sort";
            }
        } else {
            if ($sort == "0") {
                $sql = "SELECT a.*, b.name as serviceName FROM product a LEFT JOIN service_item b ON a.itemId = b.id WHERE a.itemId = $itemId ORDER BY a.id DESC";
            } else {
                $sql = "SELECT a.*, b.name as serviceName FROM product a LEFT JOIN service_item b ON a.itemId = b.id WHERE a.itemId = $itemId ORDER BY a.$sort";
            }
        }

        $result = mysqli_query($conn, $sql);
        $mydata = array();

        if (mysqli_num_rows($result) > 0) {
            while ($row = mysqli_fetch_assoc($result)) {
                $mydata[] = $row;
            }
            echo '{"state": true, "itemId":' . json_encode($itemId) . ', "data":' . json_encode($mydata) . ', "message":"資料查詢成功"}';
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
