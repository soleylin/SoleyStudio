<?php
$data = file_get_contents("php://input", "r");
if ($data != "") {
    $mydata = array();
    $mydata = json_decode($data, true);
    if (isset($mydata["chk"]) && $mydata["chk"] !== []) {

        $chk = $mydata["chk"];
        $ids = implode("', '", $chk);

        $servername = "localhost";
        $username = "soley";
        $password = "123";
        $dbname = "demodb";

        $conn = mysqli_connect($servername, $username, $password, $dbname);
        if (!$conn) {
            die("連線失敗" . mysqli_connect_error());
        }
        if ($chk !== []) {
            $sql = "SELECT a.*, b.name AS serviceName FROM reserve a LEFT JOIN service_item b ON a.itemId = b.id WHERE a.id IN ('$ids')";


            $result = mysqli_query($conn, $sql);
            $mydata = array();

            if (mysqli_num_rows($result) > 0) {
                while ($row = mysqli_fetch_assoc($result)) {
                    $mydata[] = $row;
                }
                echo '{"state": true, "data":' . json_encode($mydata) . ', "message":"資料查詢成功"}';
            } else {
                echo ($sql);
                echo '{"state": false, "message":"查無資料"}';
            }
        } else {
            echo '{"state" : false, "message" :"請選取欲完成之選項！"}';
        }
    } else {
        echo '{"state" : false, "message" :"格式錯誤！"}';
    }
} else {
    echo '{"state" : false, "message" :"未傳遞任何參數！"}';
}

mysqli_close($conn);