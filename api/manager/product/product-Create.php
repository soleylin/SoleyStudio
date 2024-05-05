<?php

$data = file_get_contents("php://input", "r");
if ($data != "") {

    $mydata = array();
    $mydata = json_decode($data, true);

    if (isset($mydata["itemNo"])  && isset($mydata["itemId"]) && isset($mydata["name"]) && isset($mydata["image"]) && isset($mydata["price"]) && isset($mydata["active"]) && $mydata["itemNo"] != "" && $mydata["itemId"] != "" && $mydata["name"] != "" && $mydata["image"] != "" && $mydata["price"] != "" && $mydata["active"] != "") {
        
        $itemNo = $mydata["itemNo"];
        $itemId = $mydata["itemId"];
        $name = $mydata["name"];
        $image = $mydata["image"];
        $price = $mydata["price"];
        $active = $mydata["active"];

        $servername = "localhost";
        $username = "soley";
        $password = "123";
        $dbname = "demodb";

        $conn = mysqli_connect($servername, $username, $password, $dbname);

        if (!$conn) {
            die("連線失敗" . mysqli_connect_error());
        }

        $sql = "INSERT INTO product (itemNo, itemId, name, image, price, active) VALUES ('$itemNo','$itemId','$name','$image','$price','$active')";

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
