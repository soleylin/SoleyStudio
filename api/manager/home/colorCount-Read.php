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
$conn->set_charset("utf8");

$sql = "SELECT color, COUNT(*) AS num FROM `final` WHERE item='凝膠美甲' AND date>DATE_SUB(CURDATE(), INTERVAL 3 MONTH) AND date <= CURDATE() + INTERVAL 1 DAY GROUP BY color ORDER BY color;";
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
mysqli_close($conn);
