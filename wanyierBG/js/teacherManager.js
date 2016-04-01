(function(){
	var searchByName=[],searchByNum=[];
	
	$("#teacherManager").on("init",function(){
		alert("ok")
		refreshData();
		$("#getPreTeacherBtn").on("click",refreshData);
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
	})
	$("#teacherManager").on("show",function(){
		refreshData();
	})
	$("#teacherManager").on("hide",function(){
		//refreshData();
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
	
	function refreshData(){
		$("#preCheckList_teacher").empty();
		var searchObj=new Object;
		searchObj.command="getTeacherInfo";
		$.theAjax.post(searchObj,function(res){
			if(res.result=="success"){
				
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
										"<p class='id' style='display:none'>"+searchByName[i]._id+"</p>"+
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
										"<p class='id' style='display:none'>"+searchByNum[i]._id+"</p>"+
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
	
})()
