<?php

$data = file_get_contents("php://input", "r");
if ($data != "") {   

    $mydata = array();
    $mydata = json_decode($data, true);

    if (isset($mydata["layer1"])  && isset($mydata["sort"])&& isset($mydata["title"]) && isset($mydata["url"]) && $mydata["sort"] != "" && $mydata["title"] != "" && $mydata["url"] != "") {

        $layer1 = $mydata["layer1"];
        $sort = $mydata["sort"];
        $title = $mydata["title"];
        $url = $mydata["url"];

        header("Access-Control-Allow-Origin: https://soleylin.github.io");
        $servername = "localhost";
        $username = "id22010393_soley";
        $password = "Fdio3_dine";
        $dbname = "id22010393_soleystudio";

        $conn = mysqli_connect($servername, $username, $password, $dbname);

        if (!$conn) {
            die("連線失敗" . mysqli_connect_error());
        }

        $sql = "INSERT INTO menu (layer1, title, url,sort) VALUES ('$layer1','$title','$url','$sort')";

        if (mysqli_query($conn, $sql)) {
            echo '{"state" : true, "message":"新增成功！"}';
        } else {
            echo '{"state" : false, "message" :"新增失敗！"}';
        }
    } else {
        echo '{"state" : false, "message" :"傳遞參數格式錯誤！"}';
    }
} else {
    echo '{"state" : false, "message" :"未傳遞任何參數！"}';
}

mysqli_close($conn);
