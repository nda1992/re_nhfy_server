(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-41bfc11e"],{"0711":function(e,t,n){},"16e6":function(e,t,n){"use strict";n("5dca")},"333d":function(e,t,n){"use strict";var s=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"pagination-container",class:{hidden:e.hidden}},[n("el-pagination",e._b({attrs:{background:e.background,"current-page":e.currentPage,"page-size":e.pageSize,layout:e.layout,"page-sizes":e.pageSizes,total:e.total},on:{"update:currentPage":function(t){e.currentPage=t},"update:current-page":function(t){e.currentPage=t},"update:pageSize":function(t){e.pageSize=t},"update:page-size":function(t){e.pageSize=t},"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}},"el-pagination",e.$attrs,!1))],1)},i=[];n("a9e3");Math.easeInOutQuad=function(e,t,n,s){return e/=s/2,e<1?n/2*e*e+t:(e--,-n/2*(e*(e-2)-1)+t)};var a=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(e){window.setTimeout(e,1e3/60)}}();function o(e){document.documentElement.scrollTop=e,document.body.parentNode.scrollTop=e,document.body.scrollTop=e}function r(){return document.documentElement.scrollTop||document.body.parentNode.scrollTop||document.body.scrollTop}function c(e,t,n){var s=r(),i=e-s,c=20,l=0;t="undefined"===typeof t?500:t;var u=function e(){l+=c;var r=Math.easeInOutQuad(l,s,i,t);o(r),l<t?a(e):n&&"function"===typeof n&&n()};u()}var l={name:"Pagination",props:{total:{required:!0,type:Number},page:{type:Number,default:1},limit:{type:Number,default:20},pageSizes:{type:Array,default:function(){return[10,15,20,30,50]}},layout:{type:String,default:"total, sizes, prev, pager, next, jumper"},background:{type:Boolean,default:!0},autoScroll:{type:Boolean,default:!0},hidden:{type:Boolean,default:!1}},computed:{currentPage:{get:function(){return this.page},set:function(e){this.$emit("update:page",e)}},pageSize:{get:function(){return this.limit},set:function(e){this.$emit("update:limit",e)}}},methods:{handleSizeChange:function(e){this.$emit("pagination",{page:this.currentPage,limit:e}),this.autoScroll&&c(0,800)},handleCurrentChange:function(e){this.$emit("pagination",{page:e,limit:this.pageSize}),this.autoScroll&&c(0,800)}}},u=l,d=(n("44d4"),n("2877")),g=Object(d["a"])(u,s,i,!1,null,"e28255f2",null);t["a"]=g.exports},"42b3":function(e,t,n){"use strict";n.r(t);var s=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"app-container"},[n("div",{staticClass:"title"},[n("span",{staticClass:"show-title"},[e._v("消息列表")]),n("el-badge",{staticClass:"item",attrs:{value:"activity"===e.activeTab?e.Receivetotal:e.sendTotal,hidden:"activity"===e.activeTab&&0===e.Receivetotal||"account"===e.activeTab&&0===e.sendTotal}},["activity"===e.activeTab?n("span",{staticClass:"show-tips",on:{click:e.removeAllReceiveMsg}},[e._v("清空所有接收到的消息")]):n("span",{staticClass:"show-tips",on:{click:e.removeAllSendMsg}},[e._v("清空所有已发送的消息")])]),n("el-tooltip",{staticClass:"item",attrs:{effect:"dark",content:"按下回车键搜索",placement:"bottom"}},["activity"===e.activeTab?n("el-input",{staticClass:"search",attrs:{placeholder:"搜索已收到的消息内容","prefix-icon":"el-icon-search"},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.searchReceiveMsg(t)}},model:{value:e.searchReceive,callback:function(t){e.searchReceive=t},expression:"searchReceive"}}):n("el-input",{staticClass:"search",attrs:{placeholder:"搜索已发送的消息内容","prefix-icon":"el-icon-search"},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.searchSendMsg(t)}},model:{value:e.searchSend,callback:function(t){e.searchSend=t},expression:"searchSend"}})],1)],1),n("div",[n("el-card",[n("el-tabs",{model:{value:e.activeTab,callback:function(t){e.activeTab=t},expression:"activeTab"}},[n("el-tab-pane",{attrs:{label:"已收到的消息列表",name:"activity"}},[n("ReceivePage",{attrs:{ReceiveMessageList:e.ReceiveMessageList,total:e.Receivetotal,listQuery:e.listQuery,showMsgBox:e.showMsgBox},on:{getAllReceiveMegList:e.getAllReceiveMsgList,receiveRemoveMsg:e.receiveRemoveMsg,HandlebulkSendMessageBox:e.HandlebulkSendMessageBox}})],1),n("el-tab-pane",{attrs:{label:"已发送的消息列表",name:"account"}},[n("SendPage",{attrs:{content:e.content,SendMessageList:e.SendMessageList,total:e.sendTotal,listQuery:e.listQuery,avatar:e.adminAvatar},on:{getAllSendMsg:e.getAllSendMsg,removeSendMsg:e.removeSendMsg}})],1)],1)],1)],1),n("el-dialog",{attrs:{title:"消息发送对话框",visible:e.showMsgBox},on:{"update:visible":function(t){e.showMsgBox=t}}},[n("el-form",{ref:"messageForm",staticStyle:{width:"700px",height:"120px"},attrs:{model:e.messageForm,"label-position":"left","label-width":"20px"}},[n("el-form-item",{attrs:{prop:"content"}},[n("el-input",{ref:"username",attrs:{width:"120",rows:5,placeholder:"请输入消息...",type:"textarea"},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.sendMessage(t)}},model:{value:e.messageForm.content,callback:function(t){e.$set(e.messageForm,"content",t)},expression:"messageForm.content"}})],1)],1),n("el-popover",{attrs:{placement:"bottom",width:"500",height:"100%",trigger:"click"},model:{value:e.emojiShow,callback:function(t){e.emojiShow=t},expression:"emojiShow"}},[n("el-button",{staticStyle:{transform:"translateX(640px)"},attrs:{slot:"reference"},slot:"reference"},[e._v("😀")]),n("div",{staticClass:"browBox"},[n("ul",e._l(e.faceList,(function(t,s){return n("li",{key:s,on:{click:function(t){return e.getBrow(s)}}},[e._v(e._s(t))])})),0)])],1),n("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[n("el-button",{on:{click:function(t){e.showMsgBox=!1}}},[e._v("取消")]),n("el-button",{attrs:{type:"primary"},on:{click:e.sendMessage}},[e._v("发送")])],1)],1)],1)},i=[],a=(n("d81d"),n("d3b7"),n("3ca3"),n("ddb0"),n("d829")),o=n("f65d"),r=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"user-activity"},[0!==e.ReceiveMessageList.length?s("div",[e._l(e.ReceiveMessageList,(function(t,n){return s("div",{key:t.id,staticClass:"post"},[s("div",{staticClass:"user-block"},[s("img",{staticClass:"img-circle",attrs:{src:t.faceimgUrl}}),s("span",{staticClass:"username text-muted"},[e._v("发送者是: "+e._s(t.username)+" ")]),s("span",{staticClass:"description"},[e._v("发送时间 "+e._s(t.format_send_date))])]),s("p",{staticStyle:{color:"#1f2d3d"}},[e._v(e._s(t.content))]),s("ul",{staticClass:"list-inline"},[s("li",[s("span",{staticClass:"link-black text-sm",on:{click:function(n){return e.HandlebulkSendMessageBox(!e.showMsgBox,t.send_id,t.content)}}},[e._v("回复")]),s("el-popconfirm",{attrs:{title:"确定删除该条消息吗?"},on:{onConfirm:function(n){return e.receiveRemoveMsg(t.id)}}},[s("el-button",{attrs:{slot:"reference",type:"text"},slot:"reference"},[s("span",{staticClass:"link-black text-sm"},[e._v("删除")])])],1)],1)])])})),s("pagination",{directives:[{name:"show",rawName:"v-show",value:e.total>0,expression:"total>0"}],attrs:{total:e.total,page:e.listQuery.page,limit:e.listQuery.limit},on:{"update:page":function(t){return e.$set(e.listQuery,"page",t)},"update:limit":function(t){return e.$set(e.listQuery,"limit",t)},pagination:function(t){return e.getAllReceiveMsgList()}}})],2):s("div",{staticClass:"message"},[s("img",{attrs:{src:n("7b62"),alt:"",height:"380",width:"350"}}),s("span",[e._v("你还没有收到消息哦~")])])])},c=[],l=(n("a9e3"),n("333d")),u={components:{Pagination:l["a"]},props:{avatar:{type:String,default:function(){return"http://localhost:3000/jobseekersAvatar/default.jpg"}},ReceiveMessageList:{type:Array,default:function(){return[]}},listQuery:{type:Object,default:function(){return{}}},total:{type:Number,default:function(){return 0}},showMsgBox:{type:Boolean,default:function(){return!1}}},methods:{getAllReceiveMsgList:function(){this.$emit("getAllReceiveMsgList")},receiveRemoveMsg:function(e){this.$emit("receiveRemoveMsg",e)},HandlebulkSendMessageBox:function(e,t,n){this.$emit("HandlebulkSendMessageBox",{showMsgBox:e,send_id:t,content:n})}}},d=u,g=(n("16e6"),n("2877")),f=Object(g["a"])(d,r,c,!1,null,"4ff11320",null),p=f.exports,m=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"user-account"},[0!==e.SendMessageList.length?s("div",[e._l(e.SendMessageList,(function(t,n){return s("div",{key:t.id,staticClass:"post"},[s("div",{staticClass:"user-block"},[s("img",{staticClass:"img-circle",attrs:{src:e.avatar}}),s("span",{staticClass:"username text-muted"},[e._v("你回复的人是: "+e._s(t.username)+" ")]),s("span",{staticClass:"description"},[e._v("回复时间 "+e._s(t.format_send_date))])]),null!==t.replycontent?s("el-popover",{attrs:{placement:"top-start",title:"你回复的消息是",width:"400",trigger:"hover",content:t.replycontent}},[s("p",{staticStyle:{color:"#1f2d3d"},attrs:{slot:"reference"},slot:"reference"},[e._v(e._s(t.content))])]):s("p",{staticStyle:{color:"#1f2d3d"},attrs:{slot:"reference"},slot:"reference"},[e._v(e._s(t.content))]),s("ul",{staticClass:"list-inline"},[s("li",[s("el-popconfirm",{attrs:{title:"确定删除该条消息吗?"},on:{onConfirm:function(n){return e.removeSendMsg(t.id)}}},[s("el-button",{attrs:{slot:"reference",type:"text"},slot:"reference"},[s("span",{staticClass:"link-black text-sm"},[e._v("删除")])])],1),t.is_read?s("span",{staticStyle:{"margin-left":"5px",color:"#97a8be"}},[e._v("已读")]):s("span",{staticStyle:{"margin-left":"5px",color:"#4455aa"}},[e._v("未读")])],1)])],1)})),s("pagination",{directives:[{name:"show",rawName:"v-show",value:e.total>0,expression:"total>0"}],attrs:{total:e.total,page:e.listQuery.page,limit:e.listQuery.limit},on:{"update:page":function(t){return e.$set(e.listQuery,"page",t)},"update:limit":function(t){return e.$set(e.listQuery,"limit",t)},pagination:function(t){return e.getAllSendMsg()}}})],2):s("div",{staticClass:"nomessage"},[s("img",{attrs:{src:n("7b62"),height:"380",width:"350"}}),s("span",[e._v("你还没有发送消息哦~")])])])},v=[],h={components:{Pagination:l["a"]},props:{avatar:{type:String,default:function(){return"http://localhost:3000/jobseekersAvatar/default.png"}},SendMessageList:{type:Array,default:function(){return[]}},listQuery:{type:Object,default:function(){return{}}},total:{type:Number,default:function(){return 0}},content:{type:String,default:function(){return""}}},methods:{getAllSendMsg:function(){this.$emit("getAllSendMsg")},removeSendMsg:function(e){this.$emit("removeSendMsg",e)}}},b=h,y=(n("5880"),Object(g["a"])(b,m,v,!1,null,"046f6eda",null)),S=y.exports,M={name:"NoticePage",components:{ReceivePage:p,SendPage:S},data:function(){return{activeTab:"activity",listQuery:{page:1,limit:10},Receivetotal:0,ReceiveMessageList:[],sendTotal:0,SendMessageList:[],showMsgBox:!1,messageForm:{content:""},bulkUid:[],emojiShow:!1,faceList:[],getBrowString:"",jid:"",content:"",searchReceive:"",searchSend:""}},created:function(){this.updateIsread(),this.getAllReceiveMsgList(),this.getAllSendMsg(),this.loadEmojis()},computed:{userCode:function(){return localStorage.getItem("userCode")},adminAvatar:function(){return localStorage.getItem("avatar")},avatar:function(){return""}},methods:{searchReceiveMsg:function(){},searchSendMsg:function(){},updateIsread:function(){var e={receive_id:this.userCode};Object(a["v"])(e).then((function(e){}))},getAllReceiveMsgList:function(){var e=this,t=Object.assign({},this.listQuery,{receive_id:this.userCode});Object(o["g"])(t).then((function(t){var n=t.msgList,s=t.total;e.Receivetotal=s,e.ReceiveMessageList=n}))},getAllSendMsg:function(){var e=this,t=Object.assign({},{send_id:this.userCode},this.listQuery);Object(o["h"])(t).then((function(t){var n=t.msgList,s=t.total;e.sendTotal=s,e.SendMessageList=n}))},receiveRemoveMsg:function(e){var t=this,n=Object.assign({},{id:e,receive_id:this.userCode});Object(a["o"])(n).then((function(e){var n=e.msg;t.$message.success(n),t.getAllReceiveMsgList()}))},removeAllReceiveMsg:function(){var e=this;this.$confirm("是否清空所有接收到的消息?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){var t=e.ReceiveMessageList.map((function(t){return{id:t.id,remove_receive_id:e.userCode}}));Object(a["p"])({msgList:t}).then((function(t){var n=t.msg;e.getAllReceiveMsgList(),e.$message.success(n)}))}))},removeSendMsg:function(e){var t=this,n=Object.assign({},{send_id:this.userCode,id:e});Object(a["r"])(n).then((function(e){var n=e.msg;t.$message.success(n),t.getAllSendMsg()}))},removeAllSendMsg:function(){var e=this;this.$confirm("是否清空所有已发送的消息?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){var t=e.SendMessageList.map((function(t){return{id:t.id,remove_send_id:e.userCode}}));Object(a["q"])({msgList:t}).then((function(t){var n=t.msg;e.$message.success(n),e.getAllSendMsg()}))}))},loadEmojis:function(){var e=this;n.e("chunk-6f110f08").then(n.bind(null,"1666")).then((function(t){e.faceList=t.default}))},HandlebulkSendMessageBox:function(e){var t=this;this.showMsgBox=e.showMsgBox,this.jid=e.send_id,this.content=e.content,this.messageForm.content="",this.$nextTick((function(){t.$refs["messageForm"].clearValidate()}))},getBrow:function(e){for(var t in this.faceList)parseInt(e)===parseInt(t)&&(this.getBrowString=this.faceList[e],this.messageForm.content+=this.getBrowString);this.emojiShow=!1},sendMessage:function(){var e=this,t={receive_id:this.jid,send_id:this.userCode,content:this.messageForm.content,replycontent:this.content,send_date:new Date,is_read:0,remove_receive_id:0,remove_send_id:0};Object(a["s"])(t).then((function(t){var n=t.msg;e.$message.success(n),e.showMsgBox=!1,e.getAllSendMsg()}))}}},_=M,w=(n("c174"),Object(g["a"])(_,s,i,!1,null,"74dd2ec4",null));t["default"]=w.exports},"44d4":function(e,t,n){"use strict";n("cad9")},"536b":function(e,t,n){},5880:function(e,t,n){"use strict";n("0711")},"5dca":function(e,t,n){},"7b62":function(e,t,n){e.exports=n.p+"static/img/NoMessage.1aed6254.png"},c174:function(e,t,n){"use strict";n("536b")},cad9:function(e,t,n){},f65d:function(e,t,n){"use strict";n.d(t,"b",(function(){return i})),n.d(t,"f",(function(){return a})),n.d(t,"k",(function(){return o})),n.d(t,"l",(function(){return r})),n.d(t,"d",(function(){return c})),n.d(t,"j",(function(){return l})),n.d(t,"g",(function(){return u})),n.d(t,"h",(function(){return d})),n.d(t,"e",(function(){return g})),n.d(t,"c",(function(){return f})),n.d(t,"a",(function(){return p})),n.d(t,"i",(function(){return m}));var s=n("b775");function i(e){return Object(s["a"])({url:"/recruit/addPosition",method:"post",data:e})}function a(e){return Object(s["a"])({url:"/position/getPositionList",method:"get",params:e})}function o(e){return Object(s["a"])({url:"/recruit/updatePosition",method:"post",data:e})}function r(e){return Object(s["a"])({url:"/recruit/updatepositionStatus",method:"post",data:e})}function c(e){return Object(s["a"])({url:"/recruit/deletePosition",method:"delete",params:{id:e}})}function l(e){return Object(s["a"])({url:"/recruit/recoverpositionStatus",method:"post",data:e})}function u(e){return Object(s["a"])({url:"/recruit/getReceiveMsg2Admin",method:"post",data:e})}function d(e){return Object(s["a"])({url:"/recruit/getSendMsg2Admin",method:"post",data:e})}function g(e){return Object(s["a"])({url:"/recruit/getAllSwiperImgs",method:"get",params:e})}function f(e){return Object(s["a"])({url:"/recruit/deleteImgById",method:"post",data:e})}function p(e){return Object(s["a"])({url:"/recruit/SetSwiperStatus",method:"get",params:e})}function m(e){return Object(s["a"])({url:"/recruit/getSwiperImgs2Run",method:"get",params:e})}}}]);