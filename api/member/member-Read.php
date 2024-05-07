<?php
$data = file_get_contents("php://input", "r");
if ($data != "") {

    $mydata = array();
    $mydata = json_decode($data, true);

    if (isset($mydata["id"]) && $mydata["id"] != "") {

        $id = $mydata["id"];

        $servername = "localhost";
        $username = "id22010393_soley";
        $password = "Fdio3_dine";
        $dbname = "id22010393_soleystudio";

        $conn = mysqli_connect($servername, $username, $password, $dbname);
        if (!$conn) {
            die("連線失敗" . mysqli_connect_error());
        }

        $sql = "SELECT id, account, userName, password, tel FROM member WHERE id = '$id'";
        $result = mysqli_query($conn, $sql);        
        if (mysqli_num_rows($result) == 1) {
            $row = mysqli_fetch_assoc($result);
            $mydata = array();
            $mydata [] = $row;

            echo '{"state" : true, "data" : ' . json_encode($mydata) . ', "message" :"查詢資料成功！"}';
        } else {
            echo '{"state" : false, "message" :"查詢資料失敗,查無資料！"}';
        }
    } else {
        echo '{"state" :false, "message": "傳遞參數格式錯誤！"}';
    }
} else {
    echo '{"state" :false, "message": "未傳遞任何參數！"}';
}
mysqli_close($conn);
