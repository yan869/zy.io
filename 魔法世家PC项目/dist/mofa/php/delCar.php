<?php

@require_once("common.php");

$id = $_GET["id"];

$sql="delete from `cartinfo` where id='$id'";

mysql_query($sql);

    $row = mysql_affected_rows();

    $msg = array();
    
    if($row>0){
        $msg["status"] = true;
        $msg["msg"] = "删除成功！";
    }else{
        $msg["status"] = false;
        $msg["msg"] = "删除失败！";
    }

    echo json_encode($msg);