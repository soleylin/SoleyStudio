<?php
$data = file_get_contents("php://input", "r");
if ($data != "") {   

    $mydata = array();
    $mydata = json_decode($data, true);

    if (isset($mydata["id"]) && isset($mydata["name"]) && isset($mydata["code"]) && $mydata["id"] != "" && $mydata["name"] != "" && $mydata["code"] != "" ) {

        $id = $mydata["id"];
        $name = $mydata["name"];
        $code = $mydata["code"];

       header("Access-Control-Allow-Origin: https://soleylin.github.io");
        $servername = "localhost";
        $username = "id22010393_soley";
        $password = "Fdio3_dine";
        $dbname = "id22010393_soleystudio";

        $conn = mysqli_connect($servername, $username, $password, $dbname);

        if (!$conn) {
            die("連線失敗" . mysqli_connect_error());
        }
        $conn->set_charset("utf8");

        $sql = "UPDATE level SET name = '$name', code = '$code' WHERE id = '$id'";

        if (mysqli_query($conn, $sql)) {
            echo '{"state" : true, "message":"更新成功"}';
        } else {
            echo '{"state" : false, "message" :"更新失敗"}';
        }
    } else {
        echo '{"state" : false, "message" :"參數格式錯誤！"}';
    }
} else {
    echo '{"state" : false, "message" :"未傳遞任何參數！"}';
}

mysqli_close($conn);
