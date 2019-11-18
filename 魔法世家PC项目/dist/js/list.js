
$(".head").load('../layout/head.html')
$(".footer").load('../layout/footer.html')
$.getScript("../js/head1.js", function () {
    search();
});
var key = "";
var orderCol = "id";
var orderType = "asc";

var showNum = 20;// 每页显示四条
var pageIndex = 3;



$(function () {
    $.ajax({
        type: "get",
        url: "../../php/goodsList.php",
        // data: {

        // },
        async: true,
        dataType: "json",
        success: function (result) {
            // console.log(result);
            // var html = "";
            showPage("", "goods_id", "asc", 3, 20);
            // result.forEach(element => {
            //     const { goods_id, goods_name, small_img1, goods_originPrice, goods_currentPrice } = element;
            //     // console.log("asdfag")
            //     html += `
            //     <li>
            //         <a href="./detail.html?goodsId=${goods_id}" class="toDetail" >
            //                 <div class="main">
            //                     <img src="${small_img1}"
            //                         alt="" srcset="">
            //                 </div>
            //                 <div class="info">
            //                     <p class="name">
            //                         ${goods_name}
            //                     </p>
            //                     <p class="price">
            //                         <span class="now">${  goods_currentPrice}</span>
            //                         <span class="prev">
                                        
            //                             ${goods_originPrice}
            //                         </span>
            //                         <img src="../img/cart.png" alt="" srcset="">
            //                     </p>
            //                 </div>
            //             </a>
            //         </li>
            //     `
            // });
            // $(".oul").html(html)
        }

    })
})


function Paging(element, options) {
    this.element = element;
    this.options = {
        pageNum: options.pageNum || 1, // 当前页码
        totalNum: options.totalNum, // 总页码
        totalList: options.totalList, // 数据总记录
        callback: options.callback // 回调函数
    };
    this.init();
}
Paging.prototype = {
    constructor: Paging,
    init: function () {
        this.createHtml();
        this.bindEvent();
    },
    createHtml: function () {
        var me = this;
        var content = [];
        var pageNum = me.options.pageNum;
        var totalNum = me.options.totalNum;
        var totalList = me.options.totalList;
        content.push("<button type='button' id='firstPage'>首页</button><button type='button' id='prePage'>上一页</button>");
        // 总页数大于6必显示省略号
        if (totalNum > 6) {
            // 1、当前页码小于5且总页码大于6 省略号显示后面+总页码
            if (pageNum < 5) {
                // 1与6主要看要显示多少个按钮 目前都显示5个
                for (var i = 1; i < 6; i++) {
                    if (pageNum !== i) {
                        content.push("<button type='button'>" + i + "</button>");
                    } else {
                        content.push("<button type='button' class='current'>" + i + "</button>");
                    }
                }
                content.push(". . .");
                content.push("<button type='button'>" + totalNum + "</button>");
            } else {
                // 2、当前页码接近后面 到最后页码隔3个 省略号显示后面+总页面
                if (pageNum < totalNum - 3) {
                    for (var i = pageNum - 2; i < pageNum + 3; i++) {
                        if (pageNum !== i) {
                            content.push("<button type='button'>" + i + "</button>");
                        } else {
                            content.push("<button type='button' class='current'>" + i + "</button>");
                        }
                    }
                    content.push(". . .");
                    content.push("<button type='button'>" + totalNum + "</button>");
                } else {
                    // 3、页码至少在5，最多在【totalNum - 3】的中间位置 第一页+省略号显示前面
                    content.push("<button type='button'>" + 1 + "</button>");
                    content.push(". . .");
                    for (var i = totalNum - 4; i < totalNum + 1; i++) {
                        if (pageNum !== i) {
                            content.push("<button type='button'>" + i + "</button>");
                        } else {
                            content.push("<button type='button' class='current'>" + i + "</button>");
                        }
                    }
                }
            }
        } else {
            // 总页数小于6
            for (var i = 1; i < totalNum + 1; i++) {
                if (pageNum !== i) {
                    content.push("<button type='button'>" + i + "</button>");
                } else {
                    content.push("<button type='button' class='current'>" + i + "</button>");
                }
            }
        }
        content.push("<button type='button' id='lastPage'>尾页</button><button type='button' id='nextPage'>下一页</button>");
        content.push("<span class='totalNum'> 共 " + totalNum + " 页 </span>");
        content.push("<span class='totalList'> 共 " + totalList + " 条记录 </span>");
        me.element.html(content.join(''));

        // DOM重新生成后每次调用是否禁用button
        setTimeout(function () {
            me.dis();
        }, 20);
    },
    bindEvent: function () {
        var me = this;
        me.element.off('click', 'button');
        // 委托新生成的dom监听事件
        me.element.on('click', 'button', function () {
            var id = $(this).attr('id');
            var num = parseInt($(this).html());
            var pageNum = me.options.pageNum;
            showPage("", "goods_id", "asc", 3, 20);
            if (id === 'prePage') {
                if (pageNum !== 1) {
                    me.options.pageNum -= 1;
                    pageIndex--;
                    showPage("", "goods_id", orderType, me.options.pageNum, showNum);
                }
            } else if (id === 'nextPage') {
                if (pageNum !== me.options.totalNum) {
                    me.options.pageNum += 1;
                    pageIndex++;
                    showPage("", "goods_id", orderType, me.options.pageNum, showNum);
                }
            } else if (id === 'firstPage') {
                if (pageNum !== 1) {
                    me.options.pageNum = 1;
                    pageIndex=1;
                    showPage("", "goods_id", orderType, me.options.pageNum, showNum);
                }
            } else if (id === 'lastPage') {
                if (pageNum !== me.options.totalNum) {
                    me.options.pageNum = me.options.totalNum;
                    pageIndex=16;
                    showPage("", "goods_id", orderType, me.options.pageNum, showNum);
                }
            } else {
                me.options.pageNum = num;
            }
            me.createHtml();
            if (me.options.callback) {
                me.options.callback(me.options.pageNum);
            }
        });
    },
    dis: function () {
        var me = this;
        var pageNum = me.options.pageNum;
        var totalNum = me.options.totalNum;
        if (pageNum === 1) {
            me.element.children('#firstPage, #prePage').prop('disabled', true);
        } else if (pageNum === totalNum) {
            me.element.children('#lastPage, #nextPage').prop('disabled', true);
        }
    }
};
$.fn.paging = function (options) {
    return new Paging($(this), options);
}




showPage("", "goods_id", orderType, pageIndex, showNum);

function showPage(key, orderCol, orderType, pageIndex, showNum) {
    $.ajax(
        {
            type: "get",
            url: "../../php/pagation.php",
            data: {
                key,
                orderCol,
                orderType,
                pageIndex,
                showNum,
            },
            dataType: "json",
            success: function (res) {
                console.log(res);
                var html='';
                res.forEach(ele=>{
                  const { goods_id, goods_name, small_img1, goods_originPrice, goods_currentPrice,goods_num } = ele;
                  console.log('12313124');
                  
                  html+=`
                  <li>
                  <a href="./detail.html?goodsId=${goods_id}" class="toDetail" >
                          <div class="main">
                              <img src="${small_img1}"
                                  alt="" srcset="">
                          </div>
                          <div class="info">
                              <p class="name">
                                  ${goods_name}
                              </p>
                              <p class="price">
                                  <span class="now">${  goods_currentPrice}</span>
                                  <span class="prev">
                                      
                                      ${goods_originPrice}
                                  </span>
                                  <img src="../img/cart.png" alt="" srcset="">
                              </p>
                          </div>
                      </a>
                  </li>
                  
                  `
                })
                $(".oul").html(html)

            }

        })
}
// $(".oul").html(html)

// 渲染页面
$("#page").paging({
    pageNum: 3, // 当前页面
    totalNum: 11,// 总页码
    totalList: 344, // 记录总数量

    callback: function () { //回调函数
        // console.log(this);
        $(".oul").html('')
        showPage("", "goods_id", orderType, pageIndex, showNum);
   
    }
})


var count=0;
$('.top').html('');
$('.down').html('');

$(".rank").find('.salenum').click(
    function(){
        count++;
        // 点一下，升序
        if(count%3==1){
            $(".top.s-top").html('↑');
            // 请求接口，进行排序
            // function theRank(key,orderCol,orderType,pageIndex,showNum){
            //     $.ajax({
            //         type:'get',
            //         url:"../../../php/magic/php/pagation.php",
            //         dataType:'json',
            //         data:{
            //             key,
            //             orderCol,
            //             orderType,
            //             pageIndex ,
            //             showNum 
            //         },
            //         success:function(res){
            //             const {goos_name,goods_id,goods_num,small_img1,goods_currentPrice,goods_originPrice}=res;
                       
            //         }
            //     })
            // }
            // theRank(" ",orderCol,orderType,pageIndex,showNum)
         
            showPage("", "goods_num", "asc", pageIndex, showNum);
        }
        if(count%3==2){
            $(".top.s-top").html('↓');
            showPage("", "goods_num", "desc", pageIndex, showNum);
           
        }
        if(count%3==0){
            $(".top.s-top").html('');
            showPage("", "goods_id", orderType, pageIndex, showNum);
        }
    }
)

$(".rank").find('.goodsprice').click(
    function(){
        count++;
        // 点一下，升序
        if(count%3==1){
            $(".top.j-top").html('↑')
            showPage("", "goods_currentPrice", "asc", pageIndex, showNum);
        }
        if(count%3==2){
            $(".top.j-top").html('↓');
            showPage("", "goods_currentPrice", "desc", pageIndex, showNum);
        }
        if(count%3==0){
            $(".top.j-top").html('');
            showPage("", "goods_id", orderType, pageIndex, showNum);
        }
    }
)

$(".rank").find('.hot').click(
    function(){
        count++;
        // 点一下，升序
        if(count%3==1){
            $(".top.h-top").html('↑')
            showPage("", "goods_comment", "asc", pageIndex, showNum);
            
        }
        if(count%3==2){
            $(".top.h-top").html('↓');
            showPage("", "goods_comment", "desc", pageIndex, showNum);
           
        }
        if(count%3==0){
            $(".top.h-top").html('');
            showPage("", "goods_id", orderType, pageIndex, showNum);
        }
    }
)






