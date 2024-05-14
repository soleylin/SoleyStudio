<?php
$data = file_get_contents("php://input", "r");
if ($data != "") {

    $mydata = array();
    $mydata = json_decode($data, true);

    if (isset($mydata["chk"])) {

        $chk = $mydata["chk"];
        $ids = implode("', '", $chk);

       // header("Access-Control-Allow-Origin: https://soleylin.github.io");
        $servername = "localhost";
        $username = "id22010393_soley";
        $password = "Fdio3_dine";
        $dbname = "id22010393_soleystudio";

        $conn = mysqli_connect($servername, $username, $password, $dbname);

        if (!$conn) {
            die("連線失敗" . mysqli_connect_error());
        }
        if ($chk !== []) {
            //有選取ids
            $sql = "SELECT itemId, date FROM reserve WHERE id IN ('$ids')";
            $result = mysqli_query($conn, $sql);
            $mydata = array();
            if (mysqli_num_rows($result) > 0) {
                //資料查詢成功
                while ($row = mysqli_fetch_assoc($result)) {

                    $itemId = $row["itemId"];
                    $date = substr($row["date"], 0, 10);
                    $time = substr($row["date"], 11, 5);

                    $sql = "UPDATE reserve_time SET active = 'N' WHERE itemId = $itemId AND date = '$date' AND time = '$time'";
                    $update_result = mysqli_query($conn, $sql);
                    if ($update_result == false) {
                        echo '{"state" : false, "message" :"預約時間更新失敗"}';
                    }
                }
                $sql = "DELETE FROM reserve WHERE id IN ('$ids')";

                if (mysqli_query($conn, $sql)) {
                    echo '{"state" : true, "message":"刪除成功"}';
                } else {
                    echo '{"state" : false, "message" :"刪除失敗"}';
                }
            } else {
                echo '{"state" : false, "message" :"資料查詢失敗"}';
            }
        } else {
            echo '{"state" : false, "message" :"請選取欲刪除之選項"}';
        }
    } else {
        echo '{"state" : false, "message" :"參數格式錯誤！"}';
    }
} else {
    echo '{"state" : false, "message" :"未傳遞任何參數！"}';
}

mysqli_close($conn);
