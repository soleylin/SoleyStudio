<?php
$data = file_get_contents("php://input", "r");
if ($data != "") {

    $mydata = array();
    $mydata = json_decode($data, true);

    if (isset($mydata["id"]) && $mydata["id"] != "") {
        if ($mydata["id"] !== 3) {

            $id = $mydata["id"];

            $servername = "localhost";
            $username = "id22010393_soley";
            $password = "Fdio3_dine";
            $dbname = "id22010393_soleystudio";

            $conn = mysqli_connect($servername, $username, $password, $dbname);

            if (!$conn) {
                die("連線失敗" . mysqli_connect_error());
            }

            $sql = "DELETEw FROM member WHERE id = '$id'";

            if (mysqli_query($conn, $sql)) {
                echo '{"state" : true, "message":"刪除成功"}';
            } else {
                echo '{"state" : false, "message" :"刪除失敗"}';
            }
        } else {
            echo '{"state" : false, "message" :"此帳號不得刪除"}';
        }
    } else {
        echo '{"state" : false, "message" :"參數格式錯誤！"}';
    }
} else {
    echo '{"state" : false, "message" :"未傳遞任何參數！"}';
}

mysqli_close($conn);
