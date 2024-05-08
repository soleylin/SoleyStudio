<?php

$data = file_get_contents("php://input", "r");
if ($data != "") {

    $mydata = array();
    $mydata = json_decode($data, true);

    if (isset($mydata["id"]) && isset($mydata["itemNo"]) && isset($mydata["itemId"]) && isset($mydata["name"]) && isset($mydata["price"]) && isset($mydata["active"]) && $mydata["id"] != "" && $mydata["itemNo"] != "" && $mydata["itemId"] != "" && $mydata["name"] != "" && $mydata["price"] != "" && $mydata["active"] != "") {

        $id = $mydata["id"];
        $itemNo = $mydata["itemNo"];
        $itemId = $mydata["itemId"];
        $name = $mydata["name"];
        $image = $mydata["image"];
        $oldImage = $mydata["oldImage"];
        $price = $mydata["price"];
        $active = $mydata["active"];

        header("Access-Control-Allow-Origin: https://soleylin.github.io");
        $servername = "localhost";
        $username = "id22010393_soley";
        $password = "Fdio3_dine";
        $dbname = "id22010393_soleystudio";

        $conn = mysqli_connect($servername, $username, $password, $dbname);

        if (!$conn) {
            die("連線失敗" . mysqli_connect_error());
        }
        if ($image !== "") {
            $sql = "UPDATE product SET  itemNo='$itemNo', itemId='$itemId', name='$name', image='$image', price='$price', active='$active' WHERE id = '$id'";
        } else {
            $sql = "UPDATE product SET  itemNo='$itemNo', itemId='$itemId', name='$name', price='$price', active='$active' WHERE id = '$id'";
        }

        if (mysqli_query($conn, $sql)) {
            unlink("/var/www/html/project/image/admin/product/" . $oldImage);
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
