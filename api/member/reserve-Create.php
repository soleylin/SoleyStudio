<?php

$data = file_get_contents("php://input", "r");
if ($data != "") {

    $mydata = array();
    $mydata = json_decode($data, true);

    if (isset($mydata["id"]) && isset($mydata["userName"]) && isset($mydata["tel"]) && isset($mydata["itemId"]) && isset($mydata["date"]) && isset($mydata["time"]) && $mydata["id"] != "" && $mydata["userName"] != "" && $mydata["tel"] != "" && $mydata["itemId"] != "" && $mydata["date"] != "" && $mydata["time"] != "") {

        $id = $mydata["id"];
        $userName = $mydata["userName"];
        $tel = $mydata["tel"];
        $itemId = $mydata["itemId"];
        $date = $mydata["date"];
        $time = $mydata["time"];
        $reserve = $mydata["date"] . " " . $mydata["time"];
        $done = "N";

       // header("Access-Control-Allow-Origin: https://soleylin.github.io");
        $servername = "localhost";
        $username = "id22010393_soley";
        $password = "Fdio3_dine";
        $dbname = "id22010393_soleystudio";

        $conn = mysqli_connect($servername, $username, $password, $dbname);

        if (!$conn) {
            die("連線失敗" . mysqli_connect_error());
        }

        $sql = "SELECT userName FROM member WHERE id = '$id'";
        $result = mysqli_query($conn, $sql);
        while ($row = mysqli_fetch_assoc($result)) {
            $user = $row["userName"];
        }
        if ($user == $userName) {
            //預約者姓名比對正確
            $sql = "SELECT done FROM reserve WHERE memberId = '$id' AND done = 'Y'";
            $result = mysqli_query($conn, $sql);
            if (mysqli_num_rows($result) > 2) {
                $deposit = "Y";
            } else {
                $deposit = "N";
            }
            $sql = "SELECT * FROM reserve WHERE itemId = ? AND date = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("is", $itemId, $reserve);
            $stmt->execute();
            $result = $stmt->get_result();

            //沒有重複預約
            if ($result->num_rows == 0) {
                $sql = "INSERT INTO reserve (memberId, name, tel, itemId, date,deposit, done) VALUES ('$id','$userName', '$tel', '$itemId', '$reserve', '$deposit', '$done')";

                if (mysqli_query($conn, $sql)) {
                    $sql = "UPDATE reserve_time SET active = 'Y' WHERE itemId = '$itemId' AND date = '$date' AND time = '$time' ";

                    if (mysqli_query($conn, $sql)) {
                        echo '{"state" : true, "message":"預約成功！"}';
                    } else {
                        echo '{"state" : false, "message":"預約時間更新失敗！"}';
                    }
                } else {
                    echo '{"state" : false, "message" :"預約失敗！"}';
                }
            } else {
                echo '{"state" : false, "message" :"已被預約！"}';
            }
        } else {
            //姓名不符合，預約失敗
            echo '{"state" :false, "message": "預約者姓名與帳號使用者不同！"}';
        }
    } else {
        echo '{"state" :false, "message": "傳遞參數格式錯誤！"}';
    }
} else {
    echo '{"state" :false, "message": "未傳遞任何參數！"}';
}

mysqli_close($conn);
