<?php
header ("Access -Control-Allow-Origin: https://soleylin.github.io/SoleyStudio/");
$servername = "localhost";
$username = "soley";
$password = "Fdio3_dine";
$dbname = "id22010393_soleystudio";

$conn = mysqli_connect($servername, $username, $password, $dbname);
if (!$conn) {
    die("連線失敗" . mysqli_connect_error());
}
$sql = "SELECT DISTINCT memberId, COUNT(*) FROM final WHERE memberId IN (SELECT DISTINCT memberId FROM final WHERE MONTH(date) = MONTH(DATE_SUB(CURDATE() , INTERVAL 2 MONTH)) ) AND MONTH(date) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) GROUP BY memberId;";
$result = mysqli_query($conn, $sql);
$mydata = array();

if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $mydata[] = $row;
    }
    $sql = "SELECT DISTINCT memberId, COUNT(*) FROM final WHERE date > DATE_SUB(CURDATE(), INTERVAL 2 MONTH) AND date <= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) GROUP BY memberId;";
    $result = mysqli_query($conn, $sql);
    $predata = array();
    if (mysqli_num_rows($result) > 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $predata[] = $row;
        }
        echo '{"state": true, "predata":' . json_encode($predata) . ', "data":' . json_encode($mydata) . ', "message":"資料查詢成功"}';
    } else {
        echo '{"state": false, "message":"查無資料"}';
    }
} else {
    echo '{"state": false, "message":"查無資料"}';
}
mysqli_close($conn);
