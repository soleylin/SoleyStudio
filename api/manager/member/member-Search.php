<?php
$data = file_get_contents("php://input", "r");
if ($data != "") {

    $mydata = array();
    $mydata = json_decode($data, true);

    if (isset($mydata["msg"])) {

        $msg = $mydata["msg"];

        $servername = "localhost";
        $username = "soley";
        $password = "123";
        $dbname = "demodb";

        $conn = mysqli_connect($servername, $username, $password, $dbname);
        if (!$conn) {
            die("連線失敗" . mysqli_connect_error());
        }

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
