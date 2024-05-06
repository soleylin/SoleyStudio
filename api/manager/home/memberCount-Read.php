<?php
$servername = "localhost";
$username = "soley";
$password = "Fdio3_dine";
$dbname = "id22010393_soleystudio";

$conn = mysqli_connect($servername, $username, $password, $dbname);
if (!$conn) {
    die("連線失敗" . mysqli_connect_error());
}
$sql = "SELECT YEAR(created_at) AS year, MONTH(created_at) AS month, COUNT(*) AS num FROM member WHERE created_at > DATE_SUB(CURDATE(), INTERVAL 1 YEAR) AND created_at <= CURDATE() + INTERVAL 1 DAY GROUP BY YEAR(created_at), MONTH(created_at) ORDER BY year ASC, month ASC;";
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
