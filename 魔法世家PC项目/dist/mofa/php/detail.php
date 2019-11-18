<?php

@require_once("common.php");

$id = $_GET["id"];

$sql="select * from `goodslist` where goods_id ='$id'";

$result = mysql_query($sql);

$item = mysql_fetch_assoc($result);

$msg = array();

    if($item){
        $msg["status"] = true;
        $msg["data"] = $item;
    }else{
        $msg["status"] = false;
        $msg["data"] = "服务器出错！";
    }

echo json_encode($msg);
mysql_close();