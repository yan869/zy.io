<?php
    // @header("Content-type:text/html;charset=utf-8");
    header('Content-Type:text/html;charset=utf-8'); // 设置文件编码方式
    header('Access-Control-Allow-Origin:*'); // CORS允许跨域

    mysql_connect("b-icu3tceyv30yev.bch.rds.gz.baidubce.com:3306","
    zyzyzy00000000","242424");
    $res = mysql_select_db("b_icu3tceyv30yev");
    
    // if(res){
    //     echo "成功";
    // }

    mysql_query("set names utf8");  // 从数据库中取数据时将数据的编码格式转化为UTF-8  (解决数据库取数据时 中文乱码)
    mysql_query("set character set utf-8");  // 向数据库中 存储数据 时将编码转化为UTF-8  (解决向数据库存数据时 中文乱码)

    // 上述代码 经常要用 所以给它提出来作为公用的php


?>