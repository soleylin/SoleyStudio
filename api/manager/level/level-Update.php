<?php
$data = file_get_contents("php://input", "r");
if ($data != "") {   

    $mydata = array();
    $mydata = json_decode($data, true);

    if (isset($mydata["id"]) && isset($mydata["name"]) && isset($mydata["code"]) && $mydata["id"] != "" && $mydata["name"] != "" && $mydata["code"] != "" ) {

        $id = $mydata["id"];
        $name = $mydata["name"];
        $code = $mydata["code"];

        $servername = "localhost";
        $username = "soley";
        $password = "123";
        $dbname = "demodb";

        $conn = mysqli_connect($servername, $username, $password, $dbname);

        if (!$conn) {
            die("連線失敗" . mysqli_connect_error());
        }

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