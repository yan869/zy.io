

    
    // 注册登录的入口
    $(function () { $("[data-toggle='tooltip']").tooltip(); });

    $("#login").popover({
        trigger: 'focus',
        html: true,
        content: `<img src="../img/mofa16.png" />
    <br />
    <p>请<a class="register">注册</a> | <a>登录</a></p>`
        // 在点击这里的时候注意事件冒泡
    })
    $("#chat").popover({
        trigger: 'focus',
        html: true,
        content: `<img src="../img/qq.png" />
    QQ`,
        width: 35,
        height: 35
        // 在点击这里的时候注意事件冒泡
    })

    $('.verticalNav').css("display", "none");
    // 全部分类鼠标经过展开收缩效果
    $('.all').hover((function () {
        $('.verticalNav ').css('display', 'block');
        $(".verticalNav li ul").hide()
    }), (function () {
        $('.verticalNav').css("display", "none");
    }));



    // 三级菜单收缩


    // 尝试发现jq的on方法不支持绑定hover，所以如下测试用原生的事件委托来写hover收展功能

    $(".verticalNav").on('mouseover', "li", function () {
        $(this).on('mouseover', function () {
            $(this).find('.active').css("display", "block")

            $(this).find('.active li').css('background', "rgba(255,255,255,.8)")
        }),

            $(this).on('mouseout', function () {
                $(this).find('.active').css("display", "none")

            })
    })



