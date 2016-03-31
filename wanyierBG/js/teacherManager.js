(function(){
	var searchAll=[];searchByName=[],searchByNum=[];
	var showState=0,showNum=0;;//0 searchAll  1 searchByName  2 searchByNum
	
	$("#teacherManager").on("init",function(){
		refreshTeacherData();
		$("#getPreTeacherBtn").on("click",refreshTeacherData);
		$("#searchTeacherByNameBtn").on("click",getTeacherByName);
		$("#searchTeacherByNameText").keydown(function(event){ 
    			if(event.which==13){
    				getTeacherByName();
    			}
  		});
		$("#checkShowByName").on('click',checkShowByName);
		$("#searchTeacherByNumBtn").on("click",getTeacherByNum);
		$("#checkShowByNum").on('click',checkShowByNum);
		$("#searchTeacherByNumText").keydown(function(event){ 
			if(event.which==13){
				getTeacherByName();
			}
  		});
  		
  		$('#teacherInfo').on('show.bs.modal', function (){
  			$("#rejectArea_teacher").css('display','none');
  			showDetail();
  		})
  		$('#teacherInfo').on('hide.bs.modal',function(){
  			$("#teacherConfirBtn").unbind("click");
			$("#teacherRejectBtn").unbind("click");
			$("#teacherReject").unbind("click");
			$("#teacherName").html("");
			$("#teacherDeslong").html("");
			$("#teacherDesshort").html("");
			$("#teacherName").html("");
			$("#teacherNum").html("");
			$("#rejectReason_teacher").html("");
			$("#teacherAddress").html("");
  		})
	})
	$("#teacherManager").on("show",function(){
		refreshTeacherData();
	})
	$("#teacherManager").on("hide",function(){
		//refreshTeacherData();
		$("#preCheckList_teacher").empty();
		$("#searchList_teacherName").empty();
		$("#searchTeacherByNameText").val("");
		$("#checkShowByName").attr("showMode","all");
		$("#checkShowByName").html("[未审核教师]");
		$("#searchList_teacherNum").empty();
		$("#searchTeacherByNumText").val("");
		$("#checkShowByNum").attr("showMode","all");
		$("#checkShowByNum").html("[未审核教师]");
	})
	
	function refreshTeacherData(){
		$("#preCheckList_teacher").empty();
		var searchObj=new Object;
		searchObj.command="getTeacherInfo";
		$.theAjax.post(searchObj,function(res){
			if(res.result=="success"){
				searchAll=res.data;
				for(var i=0;i<searchAll.length;i++){
					var $item=$("<li class='list-group-item'>"+
										"<p class='id' style='display:none'>"+i+"</p>"+
										"<span class='name'></span>"+
										"<a class='detail'>[详情]</a>"+
										"<span class='badge pull-right'>未审核</span>"+
									"</li>"
									);
					if(searchAll[i].userName==undefined){
						$item.children('.name').html("新注册教师");
						searchAll[i].userName="新注册教师";
					}
					else{
						$item.children('.name').html(searchAll[i].userName);
					}
					$("#preCheckList_teacher").append($item)
					$item.on('click',function(e){
						showState=0;
						showNum=Number($(e.currentTarget).children('.id').html());
						$("#teacherInfo").modal('show');
					})
				}
			}
			else{
				$("#preCheckList_teacher").append($("<li class='list-group-item-warning'>目前没有待审核的老师</li>"));
			}
		},null)
	}
	
	function getTeacherByName(){
		$("#searchList_teacherName").empty();
		if($("#searchTeacherByNameText").val()==""){
			alert("请输入您需要查询的教师名字");
		}
		else{
			var searchObj=new Object;
			searchObj.command="getTeacherByName";
			searchObj.userName=$("#searchTeacherByNameText").val();
			$.theAjax.post(searchObj,function(res){
				if(res.result=="success"){
					searchByName=res.data;
					for(var i=0;i<searchByName.length;i++){
						var $item=$("<li class='list-group-item'>"+
										"<p class='id' style='display:none'>"+i+"</p>"+
										"<span>"+searchByName[i].userName+"</span>"+
										"<a class='detail'>[详情]</a>"+
										"<span class='badge pull-right'>未审核</span>"+
									"</li>"
									);
						if(searchByName[i].state!=0){
							$item.find('.badge').css('display',"none");
							if($("#checkShowByName").attr("showMode")!="all"){
								$item.css("display","none");
							}
						}
						$("#searchList_teacherName").append($item);
						$item.on('click',function(e){
							showState=1;
							showNum=Number($(e.currentTarget).children('.id').html());
							$("#teacherInfo").modal('show');
						})
					}
				}
				else{
					$("#searchList_teacherName").append($("<li class='list-group-item-warning'>没有查询到目标</li>"));
				}
			},null);
		}
	}
	
	function checkShowByName(){
		if($("#checkShowByName").attr("showMode")=="all"){
			$("#searchList_teacherName").find('li').each(function(){
				//$(this).css("display","none");
				if($(this).find('badge').css('display')!="none"){
					$(this).css('display',"none");
				}
			})
			$("#checkShowByName").attr("showMode","check");
			$("#checkShowByName").html("[显示全部]");
		}
		else{
			$("#searchList_teacherName").find('li').each(function(){
				$(this).css('display',"block");
			})
			$("#checkShowByName").attr("showMode","all");
				$("#checkShowByName").html("[未审核教师]");
		}
	}
	
	function getTeacherByNum(){
		$("#searchList_teacherNum").empty();
		if(!($.regExp.regTel($("#searchTeacherByNumText").val()))){
			alert("请输入您需要查询的教师的手机号码");
		}
		else{
			var searchObj=new Object;
			searchObj.command="getTeacherByPhone";
			searchObj.userName=$("#searchTeacherByNumText").val();
			$.theAjax.post(searchObj,function(res){
				if(res.result=="success"){
					searchByNum=res.data;
					for(var i=0;i<searchByNum.length;i++){
						var $item=$("<li class='list-group-item'>"+
										"<p class='id' style='display:none'>"+i+"</p>"+
										"<span>"+searchByNum[i].userName+"</span>"+
										"<a class='detail'>[详情]</a>"+
										"<span class='badge pull-right'>未审核</span>"+
									"</li>"
									);
						if(searchByNum[i].state!=0){
							$item.find('.badge').css('display',"none");
							if($("#checkShowByNum").attr("showMode")!="all"){
								$item.css("display","none");
							}
						}
						$("#searchList_teacherNum").append($item);
						$item.on('click',function(e){
							showState=2;
							showNum=Number($(e.currentTarget).children('.id').html());
							$("#teacherInfo").modal('show');
						})
					}
				}
				else{
					$("#searchList_teacherNum").append($("<li class='list-group-item-warning'>没有查询到目标</li>"));
				}
			},null);
		}
	}
	
	function checkShowByNum(){
		if($("#checkShowByNum").attr("showMode")=="all"){
			$("#searchList_teacherNum").find('li').each(function(){
				//$(this).css("display","none");
				if($(this).find('badge').css('display')!="none"){
					$(this).css('display',"none");
				}
			})
			$("#checkShowByNum").attr("showMode","check");
			$("#checkShowByNum").html("[显示全部]");
		}
		else{
			$("#searchList_teacherNum").find('li').each(function(){
				$(this).css('display',"block");
			})
			$("#checkShowByNum").attr("showMode","all");
			$("#checkShowByNum").html("[未审核教师]");
		}
	}
	
	function showDetail(){
		var tempArr;
		switch (showState){
			case 0:
				tempArr=searchAll;
				break;
			case 1:
				tempArr=searchByName;
				break;
			case 2:
				tempArr=searchByNum;
				break;
			default:
				break;
		}
		var tempObj=tempArr[showNum];
		
		try{$("#teacherName").html(tempObj.userName)}catch(e){};
		try{$("#teacherDeslong").html(tempObj.desLong)}catch(e){};
		try{$("#teacherDesshort").html(tempObj.desShort)}catch(e){};
		try{$("#teacherName").html(tempObj.userName)}catch(e){};
		try{$("#teacherNum").html(tempObj.phoneNum)}catch(e){};
		
		if(tempObj.homeAddressId!=undefined){
			var teacherHome=new Object();
			teacherHome.command="getAddressById";
			teacherHome.addressId=tempObj.homeAddressId;
			$.theAjax.post(teacherHome,function(res){
				if(res.result=="success"){
					$("#teacherAddress").html(res.data[0].address);
				}
			},null)
		}
		if(tempObj.state!=1){
			$("#teacherRejectBtn").css('display','inline');
			$("#teacherConfirBtn").css('display','inline');
		}
		else{
			$("#teacherRejectBtn").css('display','inline');
			$("#teacherConfirBtn").css('display','none');
		}
		
		$("#teacherConfirBtn").on('click',function(){
			var confirObj=new Object();
			confirObj.command="modTeacherState";
			confirObj.id=tempObj._id;
			confirObj.auth=1;
			$.theAjax.post(confirObj,function(res){
				if(res.result=="success"){
					$("#teacherInfo").modal('hide');
					alert('操作成功');
					refreshTeacherData();
				}
				else{
					alert("操作失败！原因：\n"+res.msg);
				}
			},null);
		})
		$("#teacherRejectBtn").on('click',function(){
			if($("#rejectArea_teacher").css('display')=="block"){
				$("#rejectArea_teacher").css('display','none');
			}
			else{
				$("#rejectArea_teacher").css('display','block');
			}
		})
		$("#teacherReject").on('click',function(){
			if($("#rejectReason_teacher").val()==""){
				alert("请填写拒绝原因");
			}
			else{
				var rejectObj=new Object();
				rejectObj.command="modTeacherState";
				rejectObj.id=tempObj._id;
				rejectObj.auth=0;
				$.theAjax.post(rejectObj,function(res){
					if(res.result=="success"){
						$("#teacherInfo").modal('hide');
						alert('操作成功');
						refreshTeacherData();
					}
					else{
						alert("操作失败！原因：\n"+res.msg);
					}
				},null);
			}
		})
	}
	
})()
