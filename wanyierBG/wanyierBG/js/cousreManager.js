(function(){
	var preCourse=[],courseType=[];
	var showNum=0,typeNum=0,deletType="";
	
	$("#courseManager").on("init",function(){
		refreshCourseData();
		refreshCourseTypeData()
		$("#getPreCourseBtn").on('click',refreshCourseData);
		$('#courseInfo').on('show.bs.modal', function (){
  			$("#rejectArea_course").css('display','none');
  			showDetail();
  		})
		$('#courseInfo').on('hide.bs.modal',function(){
			$("#courseName").html("")
			$("#courseType").html("")
			$("#courseLength").html("")
			$("#courseTotal").html("")
			$("#courseDay").html("")
			$("#courseTime").html("")
			$("#coursePrice").html("")
			$("#courseNote").html("")
			$("#courseTrail").html("");
			$("#courseAddress").find("p.address1").html("")
			$("#courseAddress").find("p.address2").html("")
			$("#rejectArea_course").css('display','none');
			$("#courseRejectBtn").unbind('click')
			$("#courseReject").unbind('click')
			$("#courseConfirBtn").unbind('click')
			$("#rejectReason_course").val("");
		})
		$("#deletWarning").on('hide.bs.modal',function(){
			$("#yesBtn").unbind("click");
			$("#noBtn").unbind("click");
		})
		$("#getCourseStyleBtn").on('click',refreshCourseTypeData);
	})
	$("#courseManager").on("show",function(){
		refreshCourseData();
		refreshCourseTypeData();
	})
	$("#courseManager").on("hide",function(){
		
	})
	
	function refreshCourseData(){
		$("#preCheckList_course").empty();
		var getPrecourse=new Object();
		getPrecourse.command="getWaitCourse";
		$.theAjax.post(getPrecourse,function(res){
			if(res.result=="success"){
				preCourse=res.data;
				for(var i=0;i<preCourse.length;i++){
					var $item=$("<li class='list-group-item'>"+
									"<p class='id' style='display:none'>"+i+"</p>"+
									"<span class='name'>"+preCourse[i].courseName+"</span>"+
									"<a class='detail'>[详情]</a>"+
									"<span class='badge pull-right'>未审核</span>"+
								"</li>"
								);
					$("#preCheckList_course").append($item);
					$item.on('click',function(e){
						showState=0;
						showNum=Number($(e.currentTarget).children('.id').html());
						$("#courseInfo").modal('show');
					})
				}
			}
			else{
				$("#preCheckList_course").append($("<li class='list-group-item-warning'>目前没有带审核的课程</li>"));
			}
		},null)
	}
	
	function showDetail(){
		var tempInfo=preCourse[showNum];
		try{$("#courseName").html(tempInfo.courseName)}catch(e){}
		try{$("#courseType").html(tempInfo.courseType)}catch(e){}
		try{$("#courseLength").html(tempInfo.courseLength)}catch(e){}
		try{$("#courseTotal").html(tempInfo.totalCourse)}catch(e){}
		try{$("#courseDay").html(tempInfo.day)}catch(e){}
		try{$("#courseTime").html(tempInfo.time)}catch(e){}
		try{$("#coursePrice").html(Number(tempInfo.price)/100+"元")}catch(e){}
		try{$("#courseNote").html(tempInfo.note)}catch(e){}
		if(tempInfo.trail!="none"){
			$("#courseTrail").html(tempInfo.trail)
		}
		else{
			$("#courseTrail").html("否");
		}
		if(tempInfo.address1!="none"){
			var addres1=new Object;
			addres1.command="getAddressById";
			addres1.addressId=tempInfo.address1;
			$.theAjax.post(addres1,function(res){
				if(res.result=="success"){
					$("#courseAddress").find("p.address1").css("display","block");
					$("#courseAddress").find("p.address1").html("地址1："+res.data[0].address);
				}
			},null);
		}
		if(tempInfo.address2!="none"){
			var addres2=new Object;
			addres2.command="getAddressById";
			addres2.addressId=tempInfo.address1;
			$.theAjax.post(addres1,function(res){
				if(res.result=="success"){
					$("#courseAddress").find("p.address2").css("display","block");
					$("#courseAddress").find("p.address2").html("地址2："+res.data[0].address);
				}
			},null);
		}
		var sendObj=new Object;
		sendObj.command="findUserByOpenid";
		sendObj.openid=tempInfo.openid;
		$.theAjax.post(sendObj,function(res){
			if(res.result="success"){
				for(var j=0;j<res.data.length;j++){
					if(res.data[j].userType=="teacher"){
						$("#courseTeacher").html(res.data[j].userName);
						$("#courseTeacher_short").html(res.data[j].desLong);
						$("#courseTeacher_long").html(res.data[j].desShort);
						$("#courseTeacher_phoneNum").html(res.data[j].phoneNum);
					}
				}
			}
			else{
				alert("获取老师信息失败，请重新查询！");
			}
		},null);
		
		$("#courseConfirBtn").on('click',function(){
			var confitObj=new Object();
			confitObj.command="authCourse";
			confitObj.id=tempInfo._id;
			$.theAjax.post(confitObj,function(res){
				if(res.result=="success"){
					alert("操作成功!");
					$("#courseInfo").modal('hide');
					refreshCourseData()
				}
				else{
					alert("操作失败！原因：\n"+res.msg);
				}
			},null);
		})
		
		$("#courseRejectBtn").on('click',function(){
			if($("#rejectArea_course").css('display')=="block"){
				$("#rejectArea_course").css('display','none');
			}
			else{
				$("#rejectArea_course").css('display','block');
			}
		})
		$("#courseReject").on('click',function(){
			if($("#rejectReason_course").val()==""){
				alert("请填写拒绝原因");
			}
			else{
				var rejectObj=new Object();
				rejectObj.command="unauthCourse";
				rejectObj.id=tempObj._id;
				rejectObj.unauth=$("#rejectReason_course").val();
				$.theAjax.post(rejectObj,function(res){
					if(res.result=="success"){
						$("#courseInfo").modal('hide');
						alert('操作成功');
						refreshCourseData()
					}
					else{
						alert("操作失败！原因：\n"+res.msg);
					}
				},null);
			}
		})
	}
	
	function refreshCourseTypeData(){
		$("#preCheckList_courseStyle").empty();
		var cyObj=new Object();
		cyObj.command="getAllCourseType";
		$.theAjax.post(cyObj,function(res){
			if(res.result=="success"){
				courseType=res.data;
				for(var i=0;i<courseType.length;i++){
//					<li class="list-group-item clearfix" style="padding: 5px;">
//										<img src="bootstrap-3.3.5-dist/Map.png" style="height: 50px;"></img>
//										<span>sss</span>
//										<button class="btn btn-danger" style="float: right;margin-top: 8px;margin-right: 10px;">删除</button>
//									</li>
					var $item=$("<li class='list-group-item clearfix' style='padding: 5px;'>"+
									"<p style='display:none' class='id'>"+i+"</p>"+
									"<img src='"+courseType[i].url+"' style='height: 50px;'></img>"+
									"<b style='font-size:1.2em;margin-left:5px'>"+courseType[i].typeName+"</b>"+
									"<button class='btn btn-danger' style='float: right;margin-top: 8px;margin-right: 10px;'>删除</button>"+
								"</li>"
								);
					$("#preCheckList_courseStyle").append($item);
					$item.children('button').on("click",function(e){
						typeNum=Number($(e.currentTarget).children('.id').html());
						deletType="delectCourseType";
						$("#deletWarning").modal('show');
						$("#deletWarning").find("#yesBtn").bind('click',function(){
							if(deletType=="delectCourseType"){
								var deletObj=new Object;
								deletObj.command="delectCourseType";
								deletObj.id=courseType[typeNum]._id;
								$.theAjax.post(deletObj,function(res){
									if(res.result=="success"){
										alert("操作成功！");
										$("#deletWarning").modal('hide');
										refreshCourseTypeData();
									}
									else{
										alert("操作失败！");
									}
								},null);
							}
						})
						$("#deletWarning").find("#noBtn").bind('click',function(){
							$("#deletWarning").modal('hide');
						})
					})
				}
			}
			else{
				$("#preCheckList_courseStyle").append($("<li class='list-group-item-warning'>没有查询到课程分类</li>"));
			}
		},null)
	}
})()
