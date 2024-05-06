<?php
$servername = "localhost";
$username = "soley";
$password = "Fdio3_dine";
$dbname = "id22010393_soleystudio";

$conn = mysqli_connect($servername, $username, $password, $dbname);
if (!$conn) {
    die("連線失敗" . mysqli_connect_error());
}
$sql = "SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(material, '+', n.digit+1), '+', -1)) AS materialType, COUNT(*) AS num FROM final JOIN ( SELECT 0 AS digit UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 ) n ON LENGTH(REPLACE(material, '+' , '')) <= LENGTH(material)-n.digit WHERE item='凝膠美甲' AND date > DATE_SUB(CURDATE(), INTERVAL 3 MONTH) AND date <= CURDATE() + INTERVAL 1 DAY GROUP BY materialType ORDER BY materialType;";
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
