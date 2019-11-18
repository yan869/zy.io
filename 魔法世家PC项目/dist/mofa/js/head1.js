function search() {
    var key = "";
    $(".btn").click(function () {
        key = $("#mofa").bind('input propertychange', function () {

        }).val()

        if (key != "") {
            $.ajax({
                type: "get",
                url: "../php/searchGoodsByName.php",
                data: { key },
                cache:false, 
                ifModified :true ,
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
        url: "../php/goodsList.php",
        // data: {

        // },
        async: true,
        dataType: "json",
        success: function (result) {
            // console.log(result);
            var html = "";
           
            result.forEach(element => {
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
}

var getLogin=localStorage.getItem('user');
// alert(getLogin)
if(getLogin){
    $('.loging').html(getLogin);
    $('.register').html('退出登录')


    $('.register').click(function(){
        localStorage.removeItem('user');
        $('.loging').html('请登录');
        $('.register').html('免费注册')
    
    })
}else{
    $('.loging').html('请登录');
}

