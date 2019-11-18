<?php
@require_once("common.php");

// 接受前端传过来的数据
$count= $_POST["count"];//用户名或者手机号
$password = $_POST["password"];

// 查询
$sql = "select * from `userinfo` where username='$count' or telephone = '$count'";

// 得到一个数组
$result = mysql_query($sql);
// echo $result;
$item = mysql_fetch_array($result);//解析是否有着条数据

$msg=array();

if($item){
    $sql_pwd = $item[2];//取出数据库里面的密码
    // echo $sql_pwd;
    if($sql_pwd==$password){
        $msg["status"]=true;
        $msg["user"] = $item[1];
        $msg["msg"]="登录成功!";
    }else{
        $msg["status"]=false;
        $msg["msg"]="密码有误!";
    }

}else{
    $msg["status"]=false;
    $msg["msg"]="该账号不存在!";
}

// 打印出来
echo json_encode($msg);
?>