<?php
$data = file_get_contents("php://input", "r");
if ($data != "") {
    $mydata = array();
    $mydata = json_decode($data, true);
    if (isset($mydata["id"]) && isset($mydata["memberId"]) && isset($mydata["price"]) && $mydata["id"] !== "" && $mydata["memberId"] !== "" && $mydata["price"] !== "") {
        $id = $mydata["id"];
        $memberId = $mydata["memberId"];
        $price = $mydata["price"];
        $color = $mydata["color"];
        $material = $mydata["material"];
        $faceItem = $mydata["faceItem"];

       header("Access-Control-Allow-Origin: https://soleylin.github.io");
        $servername = "localhost";
        $username = "id22010393_soley";
        $password = "Fdio3_dine";
        $dbname = "id22010393_soleystudio";

        $conn = mysqli_connect($servername, $username, $password, $dbname);
        if (!$conn) {
            die("連線失敗" . mysqli_connect_error());
        }
        $sql = "UPDATE final SET  color = '$color', material = '$material', faceItem = '$faceItem', price = '$price' WHERE id = '$id'";
        if (mysqli_query($conn, $sql)) {
            //更新消費紀錄成功
            $sql = "SELECT AVG(price) as avgPrice FROM final WHERE memberId = $memberId";
            $result = mysqli_query($conn, $sql);
            $mydata = array();
            if (mysqli_num_rows($result) == 1) {
                //計算平均消費
                $row = mysqli_fetch_assoc($result);
                $mydata = array();
                $mydata[] = $row;
                $avgPrice = $mydata[0]['avgPrice'];

                $sql = "UPDATE member SET avgPrice = '$avgPrice' WHERE id = $memberId";
                if (mysqli_query($conn, $sql)) {
                    //更新來店次數與平均消費
                    echo '{"state": true, "message":"資料更新成功"}';
                } else {
                    echo '{"state" : false, "message" :"資料更新失敗"}';
                }
            } else {
                //查無平均消費
                echo '{"state" : false, "message" :"查無資料！"}';
            }
        } else {
            //更新消費紀錄失敗
            echo '{"state" : false, "message" :"消費紀錄更新失敗！"}';
        }
    } else {
        echo '{"state" : false, "message" :"格式錯誤！"}';
    }
} else {
    echo '{"state" : false, "message" :"未傳遞任何參數！"}';
}

mysqli_close($conn);
