<?php
@require_once("common.php");

// /*
// 从结果集中取得一行作为关联数组
// 假如从数据库取出一个用户的用户名和密码
// username password
// test 123456
// 用assoc来取得结果集中的 一行 是array（[username]=>'test',[password]=>'123456'）
// 也就是结果的数组中的索引是 所查数据库表的字段名*/ 


$sql ="select * from `goodslist`";

    $result = mysql_query($sql);//定义一个空数组转存获得道德数据

    $all = array();
    while($item = mysql_fetch_assoc($result)){

        $all[] = $item;
    }

    echo json_encode($all);


?>