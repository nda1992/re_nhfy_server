(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-323f62b1"],{"3c7d":function(t,e,o){},"4ae7":function(t,e,o){"use strict";o.r(e);var s=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"createPost-container"},[o("el-form",{ref:"postForm",staticClass:"form-container",attrs:{model:t.postForm,rules:t.rules}},[o("sticky",{attrs:{"z-index":10,"class-name":"sub-navbar "+t.postForm.status}},[o("div",{staticClass:"stick"},[o("PlatformDropdown",{model:{value:t.postForm.platforms,callback:function(e){t.$set(t.postForm,"platforms",e)},expression:"postForm.platforms"}}),o("el-button",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticStyle:{"margin-left":"10px"},attrs:{type:"success",icon:"el-icon-s-promotion",plain:""},on:{click:t.submitForm}},[t._v("发布")]),o("el-button",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],attrs:{type:"warning",icon:"el-icon-document-checked",plain:""},on:{click:t.draftForm}},[t._v("存为草稿")]),o("el-autocomplete",{staticStyle:{"margin-left":"10px",width:"150px"},attrs:{clearable:"","prefix-icon":"el-icon-folder-opened","fetch-suggestions":t.querySearchAsync,placeholder:"草稿箱("+t.draftNums+")"},on:{select:t.handleSelect},model:{value:t.state,callback:function(e){t.state=e},expression:"state"}})],1)]),o("div",{staticClass:"createPost-main-container"},[o("el-row",[o("Warning"),o("el-col",{attrs:{span:24}},[o("el-form-item",{staticStyle:{"margin-bottom":"40px"},attrs:{prop:"title",name:"name",required:""}},[o("MDinput",{attrs:{maxlength:100},model:{value:t.postForm.title,callback:function(e){t.$set(t.postForm,"title",e)},expression:"postForm.title"}},[t._v("新闻标题")])],1),o("div",{staticClass:"postInfo-container"},[o("el-row",[o("el-col",{attrs:{span:6}},[o("el-form-item",{staticClass:"postInfo-container-item",attrs:{"label-width":"40px",label:"作者"}},[o("el-select",{attrs:{loading:t.select_loading,"remote-method":t.getRemoteUserList,filterable:"","default-first-option":"",remote:"",placeholder:"搜索作者"},model:{value:t.postForm.author,callback:function(e){t.$set(t.postForm,"author",e)},expression:"postForm.author"}},t._l(t.userListOptions,(function(t,e){return o("el-option",{key:t+e,attrs:{label:t,value:t}})})),1)],1)],1),o("el-col",{attrs:{span:6}},[o("el-form-item",{staticClass:"postInfo-container-item",attrs:{"label-width":"90px",label:"发布时间"}},[o("el-date-picker",{attrs:{type:"datetime",format:"yyyy-MM-dd HH:mm:ss",placeholder:"请选择时间"},model:{value:t.postForm.display_time,callback:function(e){t.$set(t.postForm,"display_time",e)},expression:"postForm.display_time"}})],1)],1),o("el-col",{attrs:{span:6}},[o("el-form-item",{staticClass:"postInfo-container-item",attrs:{"label-width":"90px",label:"新闻类别"}},[o("el-select",{attrs:{loading:t.select_loading,"remote-method":t.getRemoteCategoryList,filterable:"","default-first-option":"",remote:"",placeholder:"搜索新闻类别"},model:{value:t.postForm.category,callback:function(e){t.$set(t.postForm,"category",e)},expression:"postForm.category"}},t._l(t.categoryListOptions,(function(t,e){return o("el-option",{key:t+e,attrs:{label:t,value:t}})})),1)],1)],1),o("el-col",{attrs:{span:6}},[o("el-form-item",{staticClass:"postInfo-container-item",attrs:{"label-width":"90px",label:"所属部门"}},[o("el-select",{attrs:{loading:t.select_loading,"remote-method":t.getRemoteDeptList,filterable:"","default-first-option":"",remote:"",placeholder:"搜索部门"},model:{value:t.postForm.deptName,callback:function(e){t.$set(t.postForm,"deptName",e)},expression:"postForm.deptName"}},t._l(t.deptListOptions,(function(t,e){return o("el-option",{key:t+e,attrs:{label:t,value:t}})})),1)],1)],1)],1)],1)],1)],1),o("el-form-item",{staticStyle:{"margin-bottom":"30px"},attrs:{prop:"content"}},[o("Tinymce",{ref:"editor",attrs:{height:400},model:{value:t.postForm.content,callback:function(e){t.$set(t.postForm,"content",e)},expression:"postForm.content"}})],1)],1)],1)],1)},i=[],a=(o("d81d"),o("4de4"),o("b0c0"),o("3ee8")),r=o("8256"),n=o("1aba"),l=o("b804"),c=o("3df4"),m=o("0c37"),p={loginuserCode:"",author:"",status:"draft",title:"",content:"",image_uri:"",display_time:void 0,id:0,platforms:["院内网站"],category:"",deptName:"",type:"",role:"",newsStatus:void 0,currentRoute:""},u={components:{Tinymce:r["a"],Sticky:l["a"],MDinput:n["a"],Warning:c["a"],PlatformDropdown:m["b"]},data:function(){var t=this,e=function(e,o,s){""===o?(t.$message({message:e.field+"为必传项",type:"error"}),s(new Error(e.field+"为必传项"))):s()};return{draftTitleList:[],draftNums:0,state:"",timeout:null,postForm:Object.assign({},p),select_loading:!1,loading:!1,rules:{title:[{validator:e}],category:[{validator:e}],author:[{validator:e}],deptName:[{validator:e}]},tempRoute:{},userListOptions:[],categoryListOptions:[],deptListOptions:[]}},mounted:function(){this.getdraftTitleList(),this.postForm.currentRoute=this.$router.currentRoute.fullPath},methods:{resetPostForm:function(){var t=this;this.postForm={loginuserCode:"",author:"",status:"draft",title:"",content:"",image_uri:"",display_time:void 0,id:void 0,platforms:["院内网站"],category:"",deptName:"",type:"",role:"",newsStatus:void 0},this.$nextTick((function(){t.$refs["postForm"].clearValidate()}))},submitForm:function(){var t=this;0!==this.postForm.content.length&&0!==this.postForm.title.length?""!==this.postForm.author&&""!==this.postForm.deptName&&""!==this.postForm.category?this.$refs.postForm.validate((function(e){if(!e)return console.log("error submit!!"),!1;t.$confirm("是否发布文章?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){t.postForm.status="published",t.loading=!0,t.postForm.loginuserCode=localStorage.getItem("userCode"),t.postForm.type=2,t.postForm.newsStatus=2,t.postForm.role=localStorage.getItem("role"),Object(a["g"])(t.postForm).then((function(){t.$notify({title:"成功",message:"发布成功",type:"success",duration:2e3}),t.getdraftTitleList(),t.loading=!1}))}))})):this.$message({message:"请填写作者相关信息",type:"warning"}):this.$message({message:"请填写必要的标题和内容",type:"warning"})},getdraftTitleList:function(){var t=this,e={role:localStorage.getItem("role"),loginuserCode:localStorage.getItem("userCode")};Object(a["e"])(e).then((function(e){var o=e.items;t.draftTitleList=o.map((function(t){return{value:t.title,id:t.id}})),t.draftNums=o.length}))},draftForm:function(){var t=this;""!==this.postForm.title&&""!==this.postForm.content?(this.postForm.loginuserCode=localStorage.getItem("userCode"),this.postForm.role=localStorage.getItem("role"),this.postForm.newsStatus=4,this.postForm.type=1,this.$confirm("是否存为草稿?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){t.loading=!0,Object(a["h"])(t.postForm).then((function(e){t.getdraftTitleList(),t.$notify({message:"已经保存为草稿",type:"success",showClose:!0,duration:2e3}),t.postForm.status="draft",t.loading=!1,t.resetPostForm()}))}))):this.$message.warning("请输入必要的标题或内容")},querySearchAsync:function(t,e){var o=this.draftTitleList;this.draftNums=this.draftTitleList.length;var s=t?o.filter(this.createStateFilter(t)):o;clearTimeout(this.timeout),this.timeout=setTimeout((function(){e(s)}),2e3)},createStateFilter:function(t){return function(e){return 0===e.value.indexOf(t.toLowerCase())}},handleSelect:function(t){var e=this,o={id:t.id};Object(a["d"])(o).then((function(t){var o=t.result;e.postForm.id=o.id,e.postForm.title=o.title,e.postForm.content=o.content,e.postForm.display_time=o.createTime,e.postForm.category=o.category,e.postForm.author=o.userName,e.postForm.deptName=o.deptName,e.postForm.status=o.status}))},getRemoteUserList:function(t){var e=this;this.select_loading=!0,Object(a["k"])(t).then((function(t){var o=t.items;o&&(e.userListOptions=o.map((function(t){return t.username})))})),this.select_loading=!1},getRemoteCategoryList:function(t){var e=this;this.select_loading=!0,Object(a["i"])(t).then((function(t){var o=t.items;o&&(e.categoryListOptions=o.map((function(t){return t.name})))})),this.select_loading=!1},getRemoteDeptList:function(t){var e=this;this.select_loading=!0,Object(a["j"])(t).then((function(t){var o=t.items;o&&(e.deptListOptions=o.map((function(t){return t.name})))})),this.select_loading=!1}}},d=u,f=(o("6f06"),o("2877")),g=Object(f["a"])(d,s,i,!1,null,"da9a68ca",null);e["default"]=g.exports},"6f06":function(t,e,o){"use strict";o("3c7d")}}]);