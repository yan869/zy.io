function search() {
    var key = "";
    $(".btn").click(function () {
        key = $("#mofa").bind('input propertychange', function () {

        }).val()

        if (key != "") {
            $.ajax({
                type: "get",
                url: "../../php/searchGoodsByName.php",
                data: { key },
                cache: false,
                ifModified: true,
                dataType: "json",
                success: function (res) {
                    var html = '';
                    res.forEach(element => {
                        const { goods_id, goods_name, small_img1, goods_originPrice, goods_currentPrice } = element;
                        html += `
               <li>
                       <a href="./detail.html" class="toDetail" data-code="${goods_id}">
                           <div class="main">
                               <img src="${small_img1}"
                                   alt="" srcset="">
                           </div>
                           <div class="info">
                               <p class="name">
                                   ${goods_name}
                               </p>
                               <p class="price">
                                   <span class="now">
                                   ${  goods_currentPrice}</span>
                                   <span class="prev">
                                   ${goods_originPrice}
                                   </span>
                                   <img src="../img/cart.png" alt="" srcset="">
                               </p>
                           </div>
                       </a>
                   </li>
               `
                    });
                    $(".oul").html(html)
                }
            })
        } else {
            return creatHTML()
        }

    })
}

function creatHTML() {
    $.ajax({
        type: "get",
        url: "../../php/goodsList.php",
        // data: {

        // },
        async: true,
        dataType: "json",
        success: function (result) {
            // console.log(result);
            var html = "";

            result.splice(1, 16).forEach(element => {
                const { goods_id, goods_name, small_img1, goods_originPrice, goods_currentPrice } = element;
                // console.log("asdfag")
                html += `
               <li>
                       <a href="./detail.html" class="toDetail" data-code="${goods_id}">
                           <div class="main">
                               <img src="${small_img1}"
                                   alt="" srcset="">
                           </div>
                           <div class="info">
                               <p class="name">
                                   ${goods_name}
                               </p>
                               <p class="price">
                                   <span class="now">
                                   ${  goods_currentPrice}</span>
                                   <span class="prev">
                                   ${goods_originPrice}
                                   </span>
                                   <img src="../img/cart.png" alt="" srcset="">
                               </p>
                           </div>
                       </a>
                   </li>
                   
               `
            });
            $(".oul").html(html)
        }

    })
}


// 请求数据，改变登录注册的状态
// $.ajax({
//     type: "post",
//     url: "../../php/login.php",

//     data: {
//         count: user,
//         password: pwd,
//     },
//     success:function(res){
//         var result = JSON.parse(res)
//         if(result.status){
//             $('.loging').html(result.user);
//             $('.register').html('退出登录')
//         }
//     }
// })

var getLogin = localStorage.getItem('user');
// 如果该用户已经登陆过，显示用户名和退出登录

if (getLogin) {
    $('.loging').html(getLogin);
    $('.register').html('退出登录')

    var login = window.location.href;
    var currentUrl = localStorage.setItem('loginUrl', login);

    $('.toRegister').click(function () {

        var getLoginoutUrl = localStorage.getItem('loginUrl');
        var car=localStorage.getItem('addCar')
        
        if(getLoginoutUrl){
           
            // localStorage.removeItem('loginUrl')
            $('.loging').html('请登录');
            $('.register').html('免费注册')
    
        }else{
            location.href=decodeURIComponent(car)
            
        }

        localStorage.removeItem('user');
        $('.toRegister').attr('href',`${getLoginoutUrl}`);   
       

    })
} else {
    $('.loging').html('请登录');
}



