<?php

$data = file_get_contents("php://input", "r");
if ($data != "") {

    $mydata = array();
    $mydata = json_decode($data, true);

    if (isset($mydata["uid01"]) && $mydata["uid01"] != "") {
        $uid = $mydata["uid01"];

        $servername = "localhost";
        $username = "id22010393_soley";
        $password = "Fdio3_dine";
        $dbname = "id22010393_soleystudio";

        $conn = mysqli_connect($servername, $username, $password, $dbname);
        if (!$conn) {
            die("連線失敗" . mysqli_connect_error());
        }

        $sql = "SELECT id, userName, account, tel, level, uid01 FROM member WHERE uid01 = '$uid'";
        $result = mysqli_query($conn, $sql);
        if (mysqli_num_rows($result) == 1) {
            //驗證成功
            $mydata = array();
            while ($row = mysqli_fetch_assoc($result)) {
                $mydata[] = $row;
            }
            echo '{"state" :true, "data": ' . json_encode($mydata) . ', "message": "驗證成功，可以登入！"}';
        } else {
            //驗證失敗
            echo '{"state" :false, "message": "驗證失敗！"}';
        }
    } else {
        echo '{"state" :false, "message": "傳遞參數格式錯誤！"}';
    }
} else {
    echo '{"state" :false, "message": "未傳遞任何參數！"}';
}

mysqli_close($conn);
