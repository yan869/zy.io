<?php
@require_once("common.php");

    $user= $_GET["user_id"];
    $goodsId = $_GET["goods_id"];
    $num = $_GET["goods_num"];

    // 新增之前应该判断 该用户 的 购物车 中的 该商品 是否存在  
    // 不存在   新增
    // 存在     数量更新

    $search_sql = "select * from `cartinfo` where user_id = '$user' and goods_id = '$goodsId'";

    $result = mysql_query($search_sql);

    $item = mysql_fetch_array($result);

    if($item){  //存在
        $update_sql = "update `cartinfo` set goods_num = goods_num + $num where user_id='$user' and goods_id ='$goodsId'";
        mysql_query($update_sql);
    }else{  //不存在
        // echo "不存在";
         // 新增数据  ->  新增之前应该判断购物车中的该商品是否存在
        $add_sql = "insert into `cartinfo`(user_id,goods_id,goods_num) values('$user','$goodsId','$num')";
        mysql_query($add_sql);
    }

    $row = mysql_affected_rows();

    $msg = array();
    if($row>0){
        $msg["status"] = true;
        $msg["msg"] = "新增成功！";
    }else{
        $msg["status"] = false;
        $msg["msg"] = "新增失败！";
    }
    echo json_encode($msg);
?>