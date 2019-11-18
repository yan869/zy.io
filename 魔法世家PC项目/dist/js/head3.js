function search(){
    var getLogin=localStorage.getItem('user')
    console.log(getLogin);
    $(".loging").html(getLogin);
    $('.register').html('退出登录')
}