(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-0389b3d5"],{"762c":function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{attrs:{id:"report"}},[a("Public"),a("div",{staticClass:"sub",staticStyle:{height:"1000px"}},[a("Aside"),a("div",{staticClass:"right",staticStyle:{background:"white"}},[a("h2",{staticClass:"item"},[t._v("yoya股份有限公司数据统计")]),a("div",{staticClass:"up"},[a("Chartone"),a("el-row",{staticClass:"one",attrs:{gutter:12}},[a("el-col",{attrs:{span:8}},[a("el-card",{staticStyle:{width:"400px",height:"100px",position:"absolute",top:"-100px",left:"312px"},attrs:{shadow:"always"}},[t._v(" 注释：查询本店的的所有商品所占的比重， 为采购部和财务部提供可参考数据 ")])],1)],1)],1),a("div",{staticClass:"down"},[a("Charttwo"),a("el-row",{staticClass:"two",attrs:{gutter:12}},[a("el-col",{attrs:{span:8}},[a("el-card",{staticStyle:{width:"400px",height:"100px",position:"absolute",top:"-165px",left:"381px"},attrs:{shadow:"always"}},[t._v("注释：横坐标表示评分的等级，纵坐标表示每个等级的数量， 滑动上去可以实现相应的数据 ")])],1)],1)],1)])],1)],1)},n=[],s=a("d84b"),o=a.n(s),r=function(){var t=this,e=t.$createElement;t._self._c;return t._m(0)},l=[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticStyle:{width:"300px",height:"300px"},attrs:{id:"main"}})])}],c=(a("861e"),{data:function(){return{charts:"",classList:[],opinion:["水果","蛋糕","火锅","鲜花店","清吧"],opinionData:[{value:335,name:"水果"},{value:310,name:"蛋糕"},{value:234,name:"火锅"},{value:135,name:"鲜花店"},{value:100,name:"清吧"}]}},methods:{drawPie:function(t){var e=this;this.charts=o.a.init(document.getElementById(t)),this.opinion.map((function(t,a){e.$axios.get("/vue/goodsClassify",{params:{type:t}}).then((function(t){e.classList.push(t.data.result),e.charts.setOption({backgroundColor:"#2c343c",title:{text:"yoya销售数量占比",left:"center",top:20,textStyle:{color:"#ccc"}},tooltip:{trigger:"item",formatter:"{a} <br/>{b} : {c} ({d}%)"},visualMap:{show:!1,min:80,max:600,inRange:{colorLightness:[0,1]}},legend:{orient:"vertical",x:"left",data:e.opinion},series:[{name:"销售占比",type:"pie",radius:"55%",center:["50%","50%"],roseType:"radius",label:{normal:{textStyle:{color:"rgba(255, 255, 255, 0.3)"}}},labelLine:{normal:{lineStyle:{color:"rgba(255, 255, 255, 0.3)"},smooth:.2,length:10,length2:20}},itemStyle:{normal:{color:"#c23531",shadowBlur:200,shadowColor:"rgba(0, 0, 0, 0.5)"}},animationType:"scale",animationEasing:"elasticOut",animationDelay:function(t){return 200*Math.random()},data:e.opinionData}]})}))}))}},mounted:function(){this.$nextTick((function(){this.drawPie("main")}))}}),u=c,d=a("4e82"),h=Object(d["a"])(u,r,l,!1,null,"5205f06e",null),p=h.exports,m=function(){var t=this,e=t.$createElement;t._self._c;return t._m(0)},f=[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticStyle:{width:"400px",height:"400px"},attrs:{id:"myChart"}})])}],v={name:"hello",data:function(){return{msg:"Welcome to Your Vue.js App",data:"",data1:""}},mounted:function(){this.drawLine()},methods:{drawLine:function(){var t=this,e=this.$echarts.init(document.getElementById("myChart"));this.$axios.get("/vue/score1").then((function(e){t.data=e.data.result})),this.$axios.get("/vue/score2").then((function(e){t.data1=e.data.result})),e.setOption({title:{text:"评分数量统计"},tooltip:{},xAxis:{data:[1,2,3,4,5]},yAxis:{},series:[{name:"评分",type:"bar",data:[30,60,46,80,150]}]})}}},g=v,x=Object(d["a"])(g,m,f,!1,null,"bd93391a",null),y=x.exports,w={name:"",components:{Chartone:p,Charttwo:y},data:function(){return{}},methods:{}},b=w,C=(a("d58b"),Object(d["a"])(b,i,n,!1,null,"5a93f718",null));e["default"]=C.exports},"861e":function(t,e,a){"use strict";var i=a("0e84"),n=a("92e5").map,s=a("8dc3");i({target:"Array",proto:!0,forced:!s("map")},{map:function(t){return n(this,t,arguments.length>1?arguments[1]:void 0)}})},b3d9:function(t,e,a){},d58b:function(t,e,a){"use strict";var i=a("b3d9"),n=a.n(i);n.a}}]);
//# sourceMappingURL=chunk-0389b3d5.c0482209.js.map