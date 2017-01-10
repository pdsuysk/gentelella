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
	
	var daysNewUserDatas = [10,20,5,20,5,36,10];
	var daysNewOrderDatas = [10,20,5,20,5,36,10];
	var daysNewMoneyDatas = [10,20,5,20,5,36,10];
	var daysNewCouponDatas = [10,20,5,20,5,36,10];
	
	var top5ShopUserShops = ['人民广场店','徐家汇店','南京东路店','中山公园店','马路牙子店'];
	var top5ShopUserDatas = [10000,8452,7158,5848,1000];
	var top5ShopOrderShops = ['徐家汇店','南京东路店','人民广场店','中山公园店','马路牙子店'];
	var top5ShopOrderDatas = [500,451,345,344,122];
	var top5ShopMoneyShops = ['中山公园店','马路牙子店','人民广场店','徐家汇店','南京东路店'];	
	var top5ShopMoneyDatas = [21458,16845,7158,5848,1000];
	
	var couponStatisticsGetDatas = [10,20,5,20,5,36,10];
	var couponStatisticsUseDatas = [20,10,36,5,10,20,36];
	
	var couponRankGetShops = ['人民广场店','徐家汇店','马路牙子店','南京东路店','中山公园店'];
	var couponRankUseShops = ['徐家汇店','南京东路店','人民广场店','中山公园店','马路牙子店'];
	
	var couponRankGetDatas = [500,451,345,344,122];
	var couponRankUseDatas = [700,548,385,245,88];
	
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
	pageEcharts.push(daysNewUserChart);
	daysNewUserChart.setOption($.extend(true, {}, baseSimpleOption, {
		series : [ {
			type : 'line',
			showAllSymbol: true,
			data : daysNewUserDatas
		}]
	})); // 生效配置
//	七日数据概览-新增订单数***************************************************************************************************
	var daysNewOrderChart = echarts.init(document.getElementById('daysNewOrder')); // 基于准备好的dom，初始化echarts实例
	pageEcharts.push(daysNewOrderChart);
	daysNewOrderChart.setOption($.extend(true, {}, baseSimpleOption, {
		series : [ {
			type : 'bar',
			data : daysNewOrderDatas
		}]
	})); // 生效配置
//	七日数据概览-新增销售额***************************************************************************************************
	var daysNewMoneyChart = echarts.init(document.getElementById('daysNewMoney')); // 基于准备好的dom，初始化echarts实例
	pageEcharts.push(daysNewMoneyChart);
	daysNewMoneyChart.setOption($.extend(true, {}, baseSimpleOption, {
		series : [ {
			type : 'bar',
			data : daysNewMoneyDatas
		}]
	})); // 生效配置
//	七日数据概览-新增优惠券核销***************************************************************************************************
	var daysNewCouponChart = echarts.init(document.getElementById('daysNewCoupon')); // 基于准备好的dom，初始化echarts实例
	pageEcharts.push(daysNewCouponChart);
	daysNewCouponChart.setOption($.extend(true, {}, baseSimpleOption, {
		series : [ {
			type : 'line',
			showAllSymbol: true,
			data : daysNewCouponDatas
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
			}
		},
		series : [{
			type : 'bar',
			label: {
				normal: {
					show: true,
					formatter: '{b}',
					position: [10, 14],
					textStyle: {
						color: '#014b5a'
					}
				}
			}
		}]
	}
//	门店top5新增绑定手机会员***************************************************************************************************
	var top5ShopUserChart = echarts.init(document.getElementById('top5ShopUser')); // 基于准备好的dom，初始化echarts实例
	pageEcharts.push(top5ShopUserChart);
	top5ShopUserChart.setOption($.extend(true, {}, baseMiddelOption, {
		yAxis : {
			data : top5ShopUserShops
		},
		series : [{
			data : top5ShopUserDatas
		}]
	})); // 生效配置
//	门店top5新增绑定手机会员***************************************************************************************************
	var top5ShopOrderChart = echarts.init(document.getElementById('top5ShopOrder')); // 基于准备好的dom，初始化echarts实例
	pageEcharts.push(top5ShopOrderChart);
	top5ShopOrderChart.setOption($.extend(true, {}, baseMiddelOption, {
		yAxis : {
			data : top5ShopOrderShops
		},
		series : [{
			data : top5ShopOrderDatas
		}]
	})); // 生效配置
//	门店top5新增绑定手机会员***************************************************************************************************
	var top5ShopMoneyChart = echarts.init(document.getElementById('top5ShopMoney')); // 基于准备好的dom，初始化echarts实例
	pageEcharts.push(top5ShopMoneyChart);
	top5ShopMoneyChart.setOption($.extend(true, {}, baseMiddelOption, {
		yAxis : {
			data : top5ShopMoneyShops
		},
		series : [{
			data : top5ShopMoneyDatas
		}]
	})); // 生效配置
//	优惠券领取核销统计***************************************************************************************************
	var couponStatisticsChart = echarts.init(document.getElementById('couponStatistics')); // 基于准备好的dom，初始化echarts实例
	pageEcharts.push(couponStatisticsChart);
	couponStatisticsChart.setOption({
		color : [ '#1ABB9C', '#0d748a'],
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
		legend : { // 图例
			data:[{
				name: '领取量'
			},{
				name: '核销量'
			}]
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
	}); // 生效配置
	var couponRankChart = echarts.init(document.getElementById('couponRank')); // 基于准备好的dom，初始化echarts实例
	pageEcharts.push(couponRankChart);
	couponRankChart.setOption($.extend(true, {}, baseMiddelOption, {
		color : [ '#1ABB9C', '#0d748a'],
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
				normal: {
					show: true,
					formatter: function (response){
						return couponRankGetShops[response.dataIndex]
					},
					position: [10, 3],
					textStyle: {
						color: '#014b5a'
					}
				}
			},
			data : couponRankGetDatas
	    },
	    {
	        name: '核销量',
	        type: 'bar',
	        label: {
				normal: {
					show: true,
					formatter: function (response){
						return couponRankUseShops[response.dataIndex]
					},
					position: [10, 3],
					textStyle: {
						color: '#00c19c'
					}
				}
			},
			data : couponRankUseDatas
	    }]
	})); // 生效配置
})