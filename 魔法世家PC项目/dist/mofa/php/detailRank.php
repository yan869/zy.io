<?php
  @require_once("common.php");


  $key = $_GET["key"];  //
  $orderCol = $_GET["orderCol"];
  $orderType = $_GET["orderType"];

  $sql="select goods_id,goods_name,small_img1,goods_currentPrice,goods_comment,goods_sale from goodslist_copy  order by  $orderCol $orderType";

  $res=mysql_query($sql);//返回来的是一个数组a

  $arr=array();

  
  while($item = mysql_fetch_assoc($res)){
    $arr[] =  $item;
}

echo json_encode($arr);