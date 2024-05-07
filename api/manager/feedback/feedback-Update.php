<?php

$data = file_get_contents("php://input", "r");
if ($data != "") {

    $mydata = array();
    $mydata = json_decode($data, true);

    if (isset($mydata["id"]) && $mydata["id"] != "" ) {

        $id = $mydata["id"];
        $sort = $mydata["sort"];
        $image = $mydata["image"];
        $oldImage = $mydata["oldImage"];

        $servername = "localhost";
        $username = "id22010393_soley";
        $password = "Fdio3_dine";
        $dbname = "id22010393_soleystudio";

        $conn = mysqli_connect($servername, $username, $password, $dbname);

        if (!$conn) {
            die("連線失敗" . mysqli_connect_error());
        }
        if ($image !== "") {
            $sql = "UPDATE feedback SET image='$image' WHERE id = '$id'";
        }

        if (mysqli_query($conn, $sql)) {
            unlink("/var/www/html/project/image/admin/feedback/" . $oldImage);
            echo '{"state" : true, "message":"更新成功！"}';
        } else {
            echo '{"state" : false, "message" :"更新失敗！"}';
        }
    } else {
        echo '{"state" : false, "message" :"傳遞參數格式錯誤！"}';
    }
} else {
    echo '{"state" : false, "message" :"未傳遞任何參數！"}';
}

mysqli_close($conn);
