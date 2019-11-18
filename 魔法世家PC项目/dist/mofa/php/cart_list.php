<?php
 @require_once("common.php");

$user_id=$_GET["user_id"];


$sql = "SELECT s.id,s.user_id,s.goods_id,s.goods_num,g.goods_name,g.goods_currentPrice,g.goods_originPrice,g.small_img1 FROM `cartinfo` as s,`goodslist` as g where  s.goods_id = g.goods_id and s.user_id='$user_id'";

$result=mysql_query($sql);

$all = array();
while($item = mysql_fetch_assoc($result)){
  $data=array();
  $data['id']=$item["id"];
  $data['user_id']=$item["user_id"];
  $data["goods_id"]=$item["goods_id"];
  $data["goods_num"]=$item["goods_num"];
  $data["goods_name"]=$item["goods_name"];
  $data["small_img1"]=$item["small_img1"];
  $data["goods_originPrice"]=$item["goods_originPrice"];
  $data["goods_currentPrice"]=$item["goods_currentPrice"];
  $data['subtotal']=$item['goods_currentPrice']*$item["goods_num"];

  
    $all[] = $data;
}
$obj=array();
$obj["code"]=1;
$obj["msg"]="成功";
$obj["data"]=$all;
echo json_encode($all);


