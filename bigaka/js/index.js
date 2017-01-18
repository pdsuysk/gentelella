function resetCharts(){
	$.each(pageEcharts, function(index){
		this.resize();
	})
}
$(function() {
	window.pageEcharts = []; // 记录页面上所有的echart，方便统一resize
	$('#menu_toggle').on('click', function() {
		resetCharts();
	});
	$(window).resize(function(){
		resetCharts();
	});

	var baseSimpleOption = { // 只显示图其他控件都不现实的基础配置
		color : [ '#1ABB9C' ],
		title : { // 标题
			show : false
		},
		tooltip : { // 鼠标悬浮提示框
			position: 'top'
		},
		legend : { // 图例
			show : false
		},
		grid : { // 网格
			left : 0,
			top : 0,
			right : 0,
			bottom : 10
		},
		xAxis : {
			axisLine : { // X轴线
				show : false
			},
			axisTick : { // X轴刻度
				show : false
			},
			axisLabel : { // X轴刻度标签
				show : false
			},
			splitLine : { // X坐标分隔线
				show : false
			},
			data : []
		},
		yAxis : {
			axisLine : { // Y轴线
				show : false
			},
			axisTick : { // Y轴刻度
				show : false
			},
			axisLabel : { // Y轴刻度标签
				show : false
			},
			splitLine : { // Y坐标分隔线
				show : false
			}
		}
	}
//	七日数据概览-新增绑定手机会员***************************************************************************************************
	var daysNewUserChart = echarts.init(document.getElementById('daysNewUser')); // 基于准备好的dom，初始化echarts实例
	daysNewUserChart.showLoading('default', loadingOption);
	pageEcharts.push(daysNewUserChart);
	daysNewUserChart.setOption($.extend(true, {}, baseSimpleOption, {
		series : [{
			type : 'line',
			showAllSymbol: true
		}]
	})); // 生效配置
//	七日数据概览-新增订单数***************************************************************************************************
	var daysNewOrderChart = echarts.init(document.getElementById('daysNewOrder')); // 基于准备好的dom，初始化echarts实例
	daysNewOrderChart.showLoading('default', loadingOption);
	pageEcharts.push(daysNewOrderChart);
	daysNewOrderChart.setOption($.extend(true, {}, baseSimpleOption, {
		series : [{
			type : 'bar'
		}]
	})); // 生效配置
//	七日数据概览-新增销售额***************************************************************************************************
	var daysNewMoneyChart = echarts.init(document.getElementById('daysNewMoney')); // 基于准备好的dom，初始化echarts实例
	daysNewMoneyChart.showLoading('default', loadingOption);
	pageEcharts.push(daysNewMoneyChart);
	daysNewMoneyChart.setOption($.extend(true, {}, baseSimpleOption, {
		series : [{
			type : 'bar'
		}]
	})); // 生效配置
//	七日数据概览-新增优惠券核销***************************************************************************************************
	var daysNewCouponChart = echarts.init(document.getElementById('daysNewCoupon')); // 基于准备好的dom，初始化echarts实例
	daysNewCouponChart.showLoading('default', loadingOption);
	pageEcharts.push(daysNewCouponChart);
	daysNewCouponChart.setOption($.extend(true, {}, baseSimpleOption, {
		series : [{
			type : 'line',
			showAllSymbol: true
		}]
	})); // 生效配置


	var baseMiddelOption = { // top5表格基础配置
		color : [ '#1ABB9C' ],
		title : { // 标题
			show : false
		},
		tooltip : { // 鼠标悬浮提示框
			position: 'top'
		},
		legend : { // 图例
			show : false
		},
		grid : { // 网格
			left : 5,
			top : 5,
			right : 20,
			bottom : 30
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
			inverse: true,
			axisLine : { // Y轴线
				show : false
			},
			axisTick : { // Y轴刻度
				show : false
			},
			axisLabel : { // Y轴刻度标签
				show : false
			},
			splitLine : { // Y坐标分隔线
				show : false
			},
			data: []
		},
		series : [{
			type : 'bar',
			label: {
				normal: {
					show: true,
					formatter: '{b}',
					position: [10, 14],
					textStyle: {
						color: '#626c91'
					}
				}
			}
		}]
	}
//	门店top5新增绑定手机会员***************************************************************************************************
	var top5ShopUserChart = echarts.init(document.getElementById('top5ShopUser')); // 基于准备好的dom，初始化echarts实例
	top5ShopUserChart.showLoading('default', loadingOption);
	pageEcharts.push(top5ShopUserChart);
	top5ShopUserChart.setOption(baseMiddelOption); // 生效配置
//	门店top5新增绑定手机会员***************************************************************************************************
	var top5ShopOrderChart = echarts.init(document.getElementById('top5ShopOrder')); // 基于准备好的dom，初始化echarts实例
	top5ShopOrderChart.showLoading('default', loadingOption);
	pageEcharts.push(top5ShopOrderChart);
	top5ShopOrderChart.setOption(baseMiddelOption); // 生效配置
//	门店top5新增绑定手机会员***************************************************************************************************
	var top5ShopMoneyChart = echarts.init(document.getElementById('top5ShopMoney')); // 基于准备好的dom，初始化echarts实例
	top5ShopMoneyChart.showLoading('default', loadingOption);
	pageEcharts.push(top5ShopMoneyChart);
	top5ShopMoneyChart.setOption(baseMiddelOption); // 生效配置
//	优惠券领取核销统计***************************************************************************************************
	var couponStatisticsChart = echarts.init(document.getElementById('couponStatistics')); // 基于准备好的dom，初始化echarts实例
	couponStatisticsChart.showLoading('default', loadingOption);
	pageEcharts.push(couponStatisticsChart);
	couponStatisticsChart.setOption({
		color : [ '#1ABB9C', '#7bd9a5'],
		title : { // 标题
			show : true,
			text: '日营销总数量',
			textStyle: {
				color: '#333',
				fontStyle: 'normal',
				fontWeight: 'border',
				fontFamily: 'sans-serif',
				fontSize: 12,
			}
		},
		tooltip : { // 鼠标悬浮提示框
			position: 'top'
		},
		grid : { // 网格
			left : 30,
			right : 30,
			bottom : 30
		},
		xAxis : {
			boundaryGap : false,
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
			data : ['周一','周二','周三','周四','周五','周六','周日']
		},
		yAxis : {
			splitLine: {
				lineStyle:{
					type: 'dashed'
				}
			},
			axisLine: {
				lineStyle:{
					color: '#888888'
				}
			}
		},
		series : []
	}); // 生效配置
	var couponRankChart = echarts.init(document.getElementById('couponRank')); // 基于准备好的dom，初始化echarts实例
	couponRankChart.showLoading('default', loadingOption);
	pageEcharts.push(couponRankChart);
	couponRankChart.setOption($.extend(true, {}, baseMiddelOption, {
		color : [ '#1ABB9C', '#7bd9a5'],
		title : { // 标题
			show : true,
			text: '营销数量TOP5',
			textStyle: {
				color: '#333',
				fontStyle: 'normal',
				fontWeight: 'border',
				fontFamily: 'sans-serif',
				fontSize: 12,
			}
		},
		tooltip : { // 鼠标悬浮提示框
			position: 'top'
		},
		legend : { // 图例
			show : true,
			left : 0,
			top: 22,
			data:[{
				name: '领取量'
			},{
				name: '核销量'
			}]
		},
		grid : { // 网格
			top: 50,
			left : 5,
			right : 10,
			bottom : 30
		},
		yAxis : {
			data : []
		},
		series : [{
	        name: '领取量',
	        type: 'bar',
	        label: {
	        	emphasis: {
					show: true,
					position: [10, 3],
					formatter: '{b}',
					textStyle: {
						color: '#626c91'
					}
				},
				normal: {
					show: true,
					position: [10, 3],
					formatter: '{b}',
					textStyle: {
						color: '#626c91'
					}
				}
			},
	    },
	    {
	        name: '核销量',
	        type: 'bar',
	        label: {
	        	emphasis: {
					show: true,
					position: [10, 3],
					formatter: '{b}',
					textStyle: {
						color: '#516b91'
					}
				},
				normal: {
					show: true,
					position: [10, 3],
					formatter: '{b}',
					textStyle: {
						color: '#516b91'
					}
				}
			},
	    }]
	})); // 生效配置

	$.ajax({
		url: ctx + 'OrderStoreDateAction/getOSDListByParentId.do?parentStoreId=1624',
		type: 'post',
		success: function () {

		}
	})

	setTimeout(function(){ // 填充数据
		var daysNewUserDatas = [10,20,5,20,5,36,10];
		var daysNewOrderDatas = [10,20,5,20,5,36,10];
		var daysNewMoneyDatas = [10,20,5,20,5,36,10];
		var daysNewCouponDatas = [10,20,5,20,5,36,10];

		var top5ShopUserDatas = [{
			value: 10000,
			name: '人民广场店'
		},{
			value: 8452,
			name: '徐家汇店'
		},{
			value: 7158,
			name: '马路牙子店'
		},{
			value: 5848,
			name: '南京东路店'
		},{
			value: 1000,
			name: '中山公园店'
		}];
		var top5ShopOrderDatas = [{
			value: 10000,
			name: '人民广场店'
		},{
			value: 8452,
			name: '徐家汇店'
		},{
			value: 7158,
			name: '马路牙子店'
		},{
			value: 5848,
			name: '南京东路店'
		},{
			value: 1000,
			name: '中山公园店'
		}];;
		var top5ShopMoneyDatas = [{
			value: 10000,
			name: '人民广场店'
		},{
			value: 8452,
			name: '徐家汇店'
		},{
			value: 7158,
			name: '马路牙子店'
		},{
			value: 5848,
			name: '南京东路店'
		},{
			value: 1000,
			name: '中山公园店'
		}];;

		var couponStatisticsGetDatas = [10,20,5,20,5,36,10];
		var couponStatisticsUseDatas = [20,10,36,5,10,20,36];

		var couponRankGetDatas = [{
			value: 500,
			name: '人民广场店'
		},{
			value: 451,
			name: '徐家汇店'
		},{
			value: 345,
			name: '马路牙子店'
		},{
			value: 344,
			name: '南京东路店'
		},{
			value: 122,
			name: '中山公园店'
		}];
		var couponRankUseDatas = [{
			value: 700,
			name: '人民广场店'
		},{
			value: 548,
			name: '徐家汇店'
		},{
			value: 385,
			name: '马路牙子店'
		},{
			value: 245,
			name: '南京东路店'
		},{
			value: 88,
			name: '中山公园店'
		}];
		daysNewUserChart.hideLoading();
		daysNewUserChart.setOption({
			series : [{
				data : daysNewUserDatas
			}]
		});
		daysNewOrderChart.hideLoading();
		daysNewOrderChart.setOption({
			series : [{
				data : daysNewOrderDatas
			}]
		});
		daysNewMoneyChart.hideLoading();
		daysNewMoneyChart.setOption({
			series : [{
				data : daysNewMoneyDatas
			}]
		});
		daysNewCouponChart.hideLoading();
		daysNewCouponChart.setOption({
			series : [{
				data : daysNewCouponDatas
			}]
		});

		top5ShopUserChart.hideLoading();
		top5ShopUserChart.setOption({
			series : [{
				data : top5ShopUserDatas
			}]
		});
		top5ShopOrderChart.hideLoading();
		top5ShopOrderChart.setOption({
			series : [{
				data : top5ShopOrderDatas
			}]
		});
		top5ShopMoneyChart.hideLoading();
		top5ShopMoneyChart.setOption({
			series : [{
				data : top5ShopMoneyDatas
			}]
		});

		couponStatisticsChart.hideLoading();
		couponStatisticsChart.setOption({
			legend : { // 图例
				data:[{
					name: '领取量'
				},{
					name: '核销量'
				}]
			},
			series : [{
		        name: '领取量',
		        type: 'line',
		        smooth: true,
		        smoothMonotone: 'x',
		        areaStyle: {
		        	normal: {
		        		opacity: 0.3
		        	}
		        },
		        data: couponStatisticsGetDatas
		    },
		    {
		        name: '核销量',
		        type: 'line',
		        smooth: true,
		        smoothMonotone: 'x',
		        areaStyle: {
		        	normal: {
		        		opacity: 0.3
		        	}
		        },
		        data: couponStatisticsUseDatas
		    }]
		});
		couponRankChart.hideLoading();
		couponRankChart.setOption({
			series : [{
				data : couponRankGetDatas
		    },
		    {
				data : couponRankUseDatas
		    }]
		})
	}, 1000)
})
