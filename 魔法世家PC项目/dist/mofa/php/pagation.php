<?php
    @require_once("common.php");

    $key = $_GET["key"];  //接收关键词
    $orderCol = $_GET["orderCol"];
    $orderType = $_GET["orderType"];
    $pageIndex = $_GET["pageIndex"];
    $showNum = $_GET["showNum"];

    $skipNum =  $pageIndex*$showNum; //0 -> 0   1->4

    $sql = "select goods_id,goods_name,goods_originPrice,goods_currentPrice,goods_label,small_img1 from `goodslist` WHERE goods_name like '%$key%' ORDER BY $orderCol $orderType limit $skipNum,$showNum";

    $result = mysql_query($sql);

    $all = array();
    while($item = mysql_fetch_assoc($result)){
        $all[] =  $item;
    }

    
    echo json_encode($all);


?>