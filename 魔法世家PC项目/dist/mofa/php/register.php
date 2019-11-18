<?php
    @header("Content-type:text/html;charset=utf-8");
    header('Access-Control-Allow-Origin: *');
    mysql_connect("localhost","root","root");
    $res = mysql_select_db("1909");

 
    $username = $_POST["username"];
    $password = $_POST["password"];
    $telephone = $_POST["telephone"];
   
    $search_sql="SELECT * FROM `userinfo` where username = '$username' or telephone = '$telephone'";

    $result = mysql_query($search_sql);
    
    $item = mysql_fetch_array($result);
    
    $msg = array();
    
    if($item){
        $msg["status"] = false;
        $msg["msg"] = "用户名或手机号已存在！";
    }else{
        // 新增数据 
        $insert_sql = "insert into `userinfo`(username,password,telephone) values('$username','$password','$telephone')";
        mysql_query($insert_sql); // 执行mysql语句

        $row = mysql_affected_rows(); //  $row>0  ,$row==0 , $row==-1   //语法问题
        $msg = array();
        if($row>0){
            $msg["status"] = true;
            $msg["msg"] = "新增成功！";
        }else{
            $msg["status"] = false;
            $msg["msg"] = "新增失败！";
        }
    }

    echo json_encode($msg); 












?>