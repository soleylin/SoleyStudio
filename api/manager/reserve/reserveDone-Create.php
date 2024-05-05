<?php
$data = file_get_contents("php://input", "r");
if ($data != "") {
    $mydata = array();
    $mydata = json_decode($data, true);
    if (isset($mydata["id"]) && isset($mydata["memberId"]) && isset($mydata["userName"]) && isset($mydata["serviceName"]) && isset($mydata["date"]) && isset($mydata["price"]) && $mydata["id"] !== "" && $mydata["memberId"] !== "" && $mydata["userName"] !== "" && $mydata["serviceName"] !== "" && $mydata["date"] !== "" && $mydata["price"] !== "") {

        $id = $mydata["id"];
        $memberId = $mydata["memberId"];
        $userName = $mydata["userName"];
        $serviceName = $mydata["serviceName"];
        $date = substr($mydata["date"], 0, 10);
        $price = $mydata["price"];
        $color = $mydata["color"];
        $material = $mydata["material"];
        $faceItem = $mydata["faceItem"];

        $servername = "localhost";
        $username = "soley";
        $password = "123";
        $dbname = "demodb";

        $conn = mysqli_connect($servername, $username, $password, $dbname);
        if (!$conn) {
            die("連線失敗" . mysqli_connect_error());
        }
        $sql = "INSERT INTO final (memberId, name, item, date, color, material, faceItem, price) VALUES ('$memberId','$userName','$serviceName','$date','$color','$material','$faceItem','$price')";

        if (mysqli_query($conn, $sql)) {
            $sql = "UPDATE reserve SET done = 'Y' WHERE id = $id";
            if (mysqli_query($conn, $sql)) {
                echo '{"state" : true, "message":"預約資料更新成功"}';
            } else {
                echo '{"state" : false, "message" :"預約資料更新失敗！"}';
            }
        } else {
            echo '{"state" : false, "message" :"新增失敗！"}';
        }
    } else {
        echo '{"state" : false, "message" :"格式錯誤！"}';
    }
} else {
    echo '{"state" : false, "message" :"未傳遞任何參數！"}';
}

mysqli_close($conn);