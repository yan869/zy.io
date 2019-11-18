<?php
@require_once("common.php");

$key = $_GET["key"]; //根据关键字查询商品
// 是否包含关键字
$sql = "select goods_id,goods_name,small_img1,goods_currentPrice,goods_originPrice from goodslist where goods_name  like '%$key%'";

$result = mysql_query($sql);
    $all = array();
    while($item = mysql_fetch_assoc($result)){
        $all[] =  $item;
    }

    
    echo json_encode($all);