<?php
$data = file_get_contents("php://input", "r");
if ($data != "") {

    $mydata = array();
    $mydata = json_decode($data, true);

    if (isset($mydata["memberId"]) && isset($mydata["serviceName"]) && isset($mydata["date"]) && $mydata["memberId"] !== "" && $mydata["serviceName"] !== "" && $mydata["date"] !== "") {

        $memberId = $mydata["memberId"];
        $serviceName = $mydata["serviceName"];
        $date = substr($mydata["date"], 0, 10);

        $servername = "localhost";
        $username = "soley";
        $password = "123";
        $dbname = "demodb";

        $conn = mysqli_connect($servername, $username, $password, $dbname);

        if (!$conn) {
            die("連線失敗" . mysqli_connect_error());
        }

        $sql = "SELECT AVG(price) as avgPrice FROM final WHERE memberId = $memberId";
        $result = mysqli_query($conn, $sql);
        $mydata = array();
        if (mysqli_num_rows($result) == 1) {
            //搜尋平均消費
            $row = mysqli_fetch_assoc($result);
            $mydata = array();
            $mydata[] = $row;
            $avgPrice = $mydata[0]['avgPrice'];

            //搜尋所有資料
            $sql = "SELECT * FROM final WHERE memberId = $memberId";
            $mydata = [];
            $result = mysqli_query($conn, $sql);
            if (mysqli_num_rows($result) > 0) {
                while ($row = mysqli_fetch_assoc($result)) {
                    $mydata[] = $row;
                }
                $length = count($mydata);

                $sql = "UPDATE member SET times = '$length', avgPrice = '$avgPrice', item = '$serviceName', recent = '$date' WHERE id = $memberId";
                if (mysqli_query($conn, $sql)) {
                    echo '{"state": true, "message":"已完成消費紀錄"}';
                } else {
                    echo '{"state" : false, "message" :"消費紀錄失敗！"}';
                }
            } else {
                echo '{"state" : false, "message" :"查無資料！"}';
            }
        } else {
            echo '{"state" : false, "message" :"查無資料！"}';
        }
    } else {
        echo '{"state" : false, "message" :"參數格式錯誤！"}';
    }
} else {
    echo '{"state" : false, "message" :"未傳遞任何參數！"}';
}

mysqli_close($conn);
