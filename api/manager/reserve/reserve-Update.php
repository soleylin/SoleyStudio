<?php
    $data = file_get_contents("php://input", "r");
    if ($data != "") {

        $mydata = array();
        $mydata = json_decode($data, true);

        if (isset($mydata["id"]) && isset($mydata["userName"]) && isset($mydata["tel"]) && isset($mydata["olditemId"]) && isset($mydata["itemId"]) && isset($mydata["olddate"]) && isset($mydata["oldtime"]) && isset($mydata["date"]) && isset($mydata["time"]) && $mydata["id"] != "" && $mydata["userName"] != "" && $mydata["tel"] != "" && $mydata["olditemId"] != "" && $mydata["itemId"] != "" && $mydata["olddate"] != "" && $mydata["oldtime"] != "" && $mydata["date"] != "" && $mydata["time"] != "") {

            $id = $mydata["id"];
            $name = $mydata["userName"];
            $tel = $mydata["tel"];
            $itemId = $mydata["itemId"];
            $date = $mydata["date"];
            $time = $mydata["time"];
            $reserve = $mydata["date"] . " " . $mydata["time"];
            $olditemId = $mydata["olditemId"];
            $olddate = $mydata["olddate"];
            $oldtime = $mydata["oldtime"];

           header("Access-Control-Allow-Origin: https://soleylin.github.io");
            $servername = "localhost";
            $username = "id22010393_soley";
            $password = "Fdio3_dine";
            $dbname = "id22010393_soleystudio";

            $conn = mysqli_connect($servername, $username, $password, $dbname);

            if (!$conn) {
                die("連線失敗" . mysqli_connect_error());
            }

            //更新舊時段
            $sql = "UPDATE reserve_time SET active = 'N' WHERE itemId = '$olditemId' AND date = '$olddate' AND time = '$oldtime'";

            if (mysqli_query($conn, $sql)) {
                //判斷重複預約
                $sql = "SELECT * FROM reserve WHERE itemId = ? AND date = ?";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("is", $itemId, $reserve);
                $stmt->execute();
                $result = $stmt->get_result();
                //沒有重複
                if ($result->num_rows == 0) {
                    //更新預約資料
                    $sql =  "UPDATE reserve SET name = '$name', tel = '$tel',itemId = '$itemId', date = '$reserve' WHERE id = '$id'";
                    if (mysqli_query($conn, $sql)) {
                        //更新新時段
                        $sql = "UPDATE reserve_time SET active = 'Y' WHERE itemId = '$itemId' AND date = '$date' AND time = '$time' ";
                        if (mysqli_query($conn, $sql)) {
                            echo '{"state" : true, "message":"更新成功"}';
                        } else {
                            echo '{"state" : false, "message" :"新時段更新失敗"}';
                        }
                    } else {
                        echo '{"state" : false, "message" :"預約更新失敗"}';
                    }
                } else {
                    echo '{"state" : false, "message" :"已被預約"}';
                }
            } else {
                echo '{"state" : false, "message" :"舊時段更新失敗"}';
            }
        } else {
            echo '{"state" : false, "message" :"參數格式錯誤！"}';
        }
    } else {
        echo '{"state" : false, "message" :"未傳遞任何參數！"}';
    }

    mysqli_close($conn);
