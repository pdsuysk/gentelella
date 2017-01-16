function resetCharts(){
	$.each(pageEcharts, function(index){
		this.resize();
	})
}
$(function(){
	// 标题tips
	var userStatisticsTipsContent = 
		'会员细分将基于会员的信息属性进行会员分析，包括标签维度、城市维度、员工招募维度等。各维度都对应各系统功能，若您未启用相应功能，则无数据统计内容。'
	$('#userStatisticsTips').popover({
		content: userStatisticsTipsContent,
		html: true,
		placement: 'bottom',
		trigger: 'hover'
	})
	// 会员标签分布tips
	var userTagTipsContent = 
		'会员标签分布，展示各标签组累计会员人数，包括手机会员及微信会员。由于1个会员可能存在多个标签，因此所有标签会员数累计可能大于总累计会员数。'
	$('#userTagTips').popover({
		content: userTagTipsContent,
		html: true,
		placement: 'bottom',
		trigger: 'hover'
	})
	window.pageEcharts = []; // 记录页面上所有的echart，方便统一resize
	$('#menu_toggle').on('click', function() {
		resetCharts();
	});
	$(window).resize(function(){
		resetCharts();
	});
	
//	会员标签***************************************************************************************************
	var userTagChart = echarts.init(document.getElementById('userTag')); // 基于准备好的dom，初始化echarts实例
	userTagChart.showLoading('default', loadingOption);
	pageEcharts.push(userTagChart);
	userTagChart.setOption({
		color : [ '#1ABB9C', '#7bd9a5' ],
		title : { // 标题
			show : false
		},
		tooltip : { // 鼠标悬浮提示框
			position: 'top'
		},
		legend : { // 图例
			show : true,
			left : 0,
			top: 0,
			data:[{
				name: '手机会员'
			},{
				name: '微信会员'
			}]
		},
		grid : { // 网格
			left: '1%',
			top: 40,
      right: 20,
      bottom: 20,
      containLabel: true
		},
		xAxis : {
			type : 'value',
			splitLine: {
				lineStyle:{
					type: 'dashed'
				}
			},
			axisLine: {
				lineStyle:{
					color: '#888888'
				}
			},
			axisLabel: {
				
			}
		},
		yAxis : {
			type : 'category',
			splitLine: {
				lineStyle:{
					type: 'dashed'
				}
			},
			axisLine: {
				lineStyle:{
					color: '#888888'
				}
			},
			data: []
		},
		series : [{
			name: '手机会员',
			type: 'bar',
			stack: '全部会员',
			label: {
				normal: {
					show: true,
					position: 'insideRight'
				}
			}
		},{
			name: '微信会员',
			type: 'bar',
			stack: '全部会员',
			label: {
				normal: {
					show: true,
					position: 'insideRight'
				}
			}
		}]
	}); // 生效配置
	// 设置会员标签数据
	var userTagPhoneData = [{
		value: 1438,
		name: '标签一'
	},{
		value: 866,
		name: '标签二'
	},{
		value: 1048,
		name: '标签三'
	},{
		value: 566,
		name: '标签四'
	},{
		value: 1255,
		name: '标签五'
	},{
		value: 788,
		name: '标签六'
	}];
	var userTagWchatData = [{
		value: 866,
		name: '标签一'
	},{
		value: 566,
		name: '标签二'
	},{
		value: 1255,
		name: '标签三'
	},{
		value: 788,
		name: '标签四'
	},{
		value: 1438,
		name: '标签五'
	},{
		value: 1048,
		name: '标签六'
	}];
	setTimeout(function(){
		userTagChart.hideLoading();
		userTagChart.setOption({
			yAxis : {
				data : userTagWchatData.map(function(item) {
					return item.name
				})
			},
			series : [{
				data : userTagPhoneData
			},{
				data: userTagWchatData
			}]
		});
	}, 1000)
})