<?php
$data = file_get_contents("php://input", "r");
if ($data != "") {

    $mydata = array();
    $mydata = json_decode($data, true);

    if (isset($mydata["id"]) && $mydata["datechk"] !== "") {

        $id = $mydata["id"];

        $servername = "localhost";
        $username = "soley";
        $password = "123";
        $dbname = "demodb";

        $conn = mysqli_connect($servername, $username, $password, $dbname);

        if (!$conn) {
            die("連線失敗" . mysqli_connect_error());
        }
        if ($idchk !== [] && $idatechk !== []) {
            $sql = "DELETE FROM reserve_time WHERE id = $id";

            if (mysqli_query($conn, $sql)) {
                echo '{"state" : true, "message":"刪除成功"}';
            } else {
                echo '{"state" : false, "message" :"刪除失敗"}';
            }
        } else {
            echo '{"state" : false, "message" :"請選取欲刪除之選項！"}';
        }
    } else {
        echo '{"state" : false, "message" :"參數格式錯誤！"}';
    }
} else {
    echo '{"state" : false, "message" :"未傳遞任何參數！"}';
}

mysqli_close($conn);
