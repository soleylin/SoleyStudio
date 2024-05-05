<?php
$data = file_get_contents("php://input", "r");
if ($data != "") {

    $mydata = array();
    $mydata = json_decode($data, true);

    if (isset($mydata["id"]) && isset($mydata["image"]) && $mydata["id"] != "" && $mydata["image"] != "") {

        $id = $mydata["id"];
        $image = $mydata["image"];
        $location = "/var/www/html/project/image/admin/feedback/" . $image;

        $servername = "localhost";
        $username = "soley";
        $password = "123";
        $dbname = "demodb";

        $conn = mysqli_connect($servername, $username, $password, $dbname);

        if (!$conn) {
            die("連線失敗" . mysqli_connect_error());
        }

        $sql = "DELETE FROM feedback WHERE id = $id";

        if (mysqli_query($conn, $sql)) {
            unlink($location);
            echo '{"state" : true, "message":"刪除成功"}';
        } else {
            echo '{"state" : false, "message" :"刪除失敗"}';
        }
    } else {
        echo '{"state" : false, "message" :"參數格式錯誤！"}';
    }
} else {
    echo '{"state" : false, "message" :"未傳遞任何參數！"}';
}

mysqli_close($conn);
