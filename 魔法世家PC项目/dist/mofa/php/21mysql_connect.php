<?php
  header('Content-Type:text/html;charset=utf-8'); // 设置文件编码方式
  header('Access-Control-Allow-Origin: http://127.0.0.1:5500'); // CORS允许跨域

  $servername = '127.0.0.1:3306'; // 数据库地址
  $username = 'root';             // 数据库用户名 
  $password = 'root';             // 数据库密码
  $dbname = '1907';               // 数据库的名字

  $conn = mysqli_connect($servername, $username, $password, $dbname); // 连接数据库

  if(!$conn) {
    // 数据库连接失败
    die('数据库连接失败');
  }

  // echo '数据库连接成功';

  $sql = 'select * from userinfo';

  $result = mysqli_query($conn, $sql);

  $arr = array();

  while ($data = mysqli_fetch_array($result)) {
        // $data = mysqli_fetch_array($result);

    // echo json_encode($data);

    // echo 1;
    $obj = array();

    $obj["username"] = $data["username"];
    $obj["id"] = $data["id"];
    $obj["password"] = $data["password"];
    $obj["telephone"] = $data["telephone"];

    $arr[] = $obj;
  }

  echo json_encode($arr);


