<?php

@require_once("common.php");

$id=$_GET['id'];

$flag = $_GET["bool"];

$obj=array();

if($flag=='0'){
    $sql = "update `cartinfo` set goods_num = goods_num-1 where id = '$id'";
}else if($flag='-1'){
    $sql = "update `cartinfo` set goods_num = goods_num+1 where id = '$id'";
}else{
    $obj["status"]=false;
    $obj['msg']='内部错误';
}

// 如果是家或减 的时候，继续查询任务

if($flag=="0"||$flag=="-1"){
    mysql_query($sql);

    // 受影响行数
    $rows=mysql_affected_rows();

    $obj=array();

    if($rows>0){
        $obj["status"]=true;
        $obj['msg']='修改成功';
    }else{
        $obj["status"]=false;
        $obj['msg']='内部错误';
    }
}