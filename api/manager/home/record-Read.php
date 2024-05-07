<?php
header("Access-Control-Allow-Origin: https://soleylin.github.io");
$servername = "localhost";
$username = "id22010393_soley";
$password = "Fdio3_dine";
$dbname = "id22010393_soleystudio";

$conn = mysqli_connect($servername, $username, $password, $dbname);
if (!$conn) {
    die("連線失敗" . mysqli_connect_error());
}
$sql = "SELECT * FROM final WHERE date BETWEEN (DATE_SUB(CURDATE(), INTERVAL 1 MONTH))+ INTERVAL 1 DAY AND CURDATE() + INTERVAL 1 DAY;";
$result = mysqli_query($conn, $sql);
$mydata = array();

if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $mydata[] = $row;
    }
    $sql = "SELECT ROUND(AVG(price),0) AS avgPrice FROM final WHERE date BETWEEN DATE_SUB(CURDATE(), INTERVAL 1 MONTH) AND CURDATE();";

    $result = mysqli_query($conn, $sql);
    if (mysqli_num_rows($result) == 1) {
        $row = mysqli_fetch_assoc($result);
        $pricedata = array();
        $pricedata[] = $row;

        echo '{"state": true, "pricedata":' . json_encode($pricedata) . ', "data":' . json_encode($mydata) . ', "message":"資料查詢成功"}';
    } else {
        echo '{"state": false, "message":"平均消費金額查詢失敗"}';
    }
} else {
    echo '{"state": false, "message":"查無資料"}';
}
mysqli_close($conn);
