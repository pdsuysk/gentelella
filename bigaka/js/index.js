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
				inside: true,
				textStyle: {
					color: '#626c91'
				}
			},
			splitLine : { // Y坐标分隔线
				show : false
			},
			z: 2,
			data: []
		},
		series : [{
			type : 'bar'
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
			left : 0,
			right : 40,
			bottom : 10,
			containLabel: true
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
			data : []
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
			axisLabel : { // Y轴刻度标签
				show: false
			},
			data : []
		},
		series : [{
      name: '领取量',
      type: 'bar',
      label: {
				normal: {
					show: true,
					position: 'insideLeft',
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
				normal: {
					show: true,
					position: 'insideLeft',
					formatter: '{b}',
					textStyle: {
						color: '#516b91'
					}
				}
			},
    }]
	})); // 生效配置

// 设置数据 *********************************************************************
// moment.js获取时间
	var nowDateFormat = moment().format('YYYY-MM-DD'); // 今天
	var last7DayDateFormat = moment().subtract(6, 'days').format('YYYY-MM-DD'); // 七天前

	// 七天优惠券核销数量
	$.ajax({
		url: ctx + 'CouponDateAction/getByCouponSumTotal.do?storeId=' + storeId + '&startDate=' + last7DayDateFormat + '&endDate=' + nowDateFormat,
		type: 'post',
		success: function (response) {
			if (response.code === 0) {
				$('#7daysTotalCouponNum').text(response.data.appliedAmountTotal)
			}
		}
	})
	// 七天优惠券核销数据
	$.ajax({
		url: ctx + 'CouponDateAction/getCouponTotalGroupByDate.do?storeId=' + storeId + '&startDate=' + last7DayDateFormat + '&endDate=' + nowDateFormat,
		type: 'post',
		success: function (response) {
			if (response.code === 0) {
				daysNewCouponChart.hideLoading();
				daysNewCouponChart.setOption({
					series : [{
						data : response.data.map(function(item){
							return item.appliedAmountTotal
						})
					}]
				});
			}
		}
	})
	// 七天新增绑定手机会员
	$.ajax({
		url: ctx + 'StoreCustomerAction/getStoreCustomerTotalByPid.do?parentStoreId=' + storeId + '&startDate=' + last7DayDateFormat + '&endDate=' + nowDateFormat,
		type: 'post',
		success: function (response) {
			if (response.code === 0) {
				$('#7daysTotalPhoneUser').text(response.data.phoneCustomerTotal)
			}
		}
	})
	// 七天绑定手机会员数据
	// $.ajax({
	// 	url: ctx + 'StoreCustomerAction/getStoreCustomerTotalForDate.do?parentStoreId=' + storeId + '&startDate=' + last7DayDateFormat + '&endDate=' + nowDateFormat,
	// 	type: 'post',
	// 	success: function (response) {
	// 		debugger
	// 		if (response.code === 0) {
	// 			daysNewUserChart.hideLoading();
	// 			daysNewUserChart.setOption({
	// 				series : [{
	// 					data : response.data.map(function(item){
	// 						return item.phoneCustomerTotal
	// 					})
	// 				}]
	// 			});
	// 		}
	// 	}
	// })
	// 7天总订单数和销售额
	$.ajax({
		url: ctx + 'OrderStoreDateAction/getOSDTotal.do?parentStoreId=' + storeId + '&startDate=' + last7DayDateFormat + '&endDate=' + nowDateFormat,
		type: 'post',
		success: function (response) {
			if (response.code === 0) {
				$('#7daysTotalOrderNum').text(response.data.orderPaidNumberTotal);
				$('#7daysTotalOrderPrice').text((response.data.orderPaidTotal / 100).toFixed(2));
			}
		}
	})
	// 七天每日订单数和金额总数据
	$.ajax({
		url: ctx + 'OrderStoreDateAction/getStoreTotalListByDate.do?parentStoreId=' + storeId + '&startDate=' + last7DayDateFormat + '&endDate=' + nowDateFormat,
		type: 'post',
		success: function (response) {
			if (response.code === 0) {
				daysNewOrderChart.hideLoading();
				daysNewOrderChart.setOption({
					series : [{
						data : response.data.map(function(item){
							return item.orderPaidNumberTotal
						})
					}]
				});

				daysNewMoneyChart.hideLoading();
				daysNewMoneyChart.setOption({
					series : [{
						data : response.data.map(function(item){
							return (item.orderPaidTotal/100).toFixed(2)
						})
					}]
				});
			}
		}
	})
	// 7天新增手机会员top5
	$.ajax({
		url: ctx + 'StoreCustomerAction/getStoreCustomerTotalListForStore.do?parentStoreId=' + storeId + '&startDate=' + last7DayDateFormat + '&endDate=' + nowDateFormat + '&orderBy=phoneCustomerTotal&limitSize=5',
		type: 'post',
		success: function (response) {
			if (response.code === 0) {
				top5ShopUserChart.hideLoading();
				top5ShopUserChart.setOption({
					yAxis: {
						data: response.data.map(function(item){
							return item.storeShortName
						})
					},
					series : [{
						data : response.data.map(function(item){
							return item.phoneCustomerTotal
						})
					}]
				});
			}
		}
	})
	// 7天门店订单数top5
	$.ajax({
		url: ctx + 'OrderStoreDateAction/getStoreTotalList.do?parentStoreId=' + storeId + '&startDate=' + last7DayDateFormat + '&endDate=' + nowDateFormat + '&orderBy=orderPaidNumberTotal&size=5',
		type: 'post',
		success: function (response) {
			if (response.code === 0) {
				top5ShopOrderChart.hideLoading();
				top5ShopOrderChart.setOption({
					yAxis: {
						data: response.data.map(function(item){
							return item.store_short_name
						})
					},
					series : [{
						data : response.data.map(function(item){
							return item.orderPaidNumberTotal
						})
					}]
				});
			}
		}
	})
	// 7天门店销售额top5
	$.ajax({
		url: ctx + 'OrderStoreDateAction/getStoreTotalList.do?parentStoreId=' + storeId + '&startDate=' + last7DayDateFormat + '&endDate=' + nowDateFormat + '&orderBy=orderPaidTotal&size=5',
		type: 'post',
		success: function (response) {
			if (response.code === 0) {
				top5ShopMoneyChart.hideLoading();
				top5ShopMoneyChart.setOption({
					yAxis: {
						data: response.data.map(function(item){
							return item.store_short_name
						})
					},
					series : [{
						data : response.data.map(function(item){
							return (item.orderPaidTotal / 100).toFixed(2)
						})
					}]
				});
			}
		}
	})
	// 优惠券营销数据top5
	$.ajax({
		url: ctx + 'CouponDateAction/getCouponTotalGroupByCouponId.do?storeId=' + storeId + '&startDate=' + last7DayDateFormat + '&endDate=' + nowDateFormat + '&orderBy=collectNumberTotal&limitSize=5',
		type: 'post',
		success: function (response) {
			if (response.code === 0) {
				couponRankChart.hideLoading();
				couponRankChart.setOption({
					series : [{
						data : response.data.map(function(item){
							return {
								value: item.collectNumberTotal,
								name: item.title
							}
						})
					},{
					}]
				})
			}
		}
	})
	$.ajax({
		url: ctx + 'CouponDateAction/getCouponTotalGroupByCouponId.do?storeId=' + storeId + '&startDate=' + last7DayDateFormat + '&endDate=' + nowDateFormat + '&orderBy=appliedAmountTotal&limitSize=5',
		type: 'post',
		success: function (response) {
			if (response.code === 0) {
				couponRankChart.hideLoading();
				couponRankChart.setOption({
					series : [{
					},{
						data : response.data.map(function(item){
							return {
								value: item.appliedAmountTotal,
								name: item.title
							}
						})
					}]
				})
			}
		}
	})
	// 7天营销数据概览
	$.ajax({
		url: ctx + 'CouponDateAction/getCouponTotalGroupByDate.do?storeId=' + storeId + '&startDate=' + last7DayDateFormat + '&endDate=' + nowDateFormat,
		type: 'post',
		success: function (response) {
			if (response.code === 0) {
				couponStatisticsChart.hideLoading();
				couponStatisticsChart.setOption({
					legend : { // 图例
						data:[{
							name: '领取量'
						},{
							name: '核销量'
						}]
					},
					xAxis : {
						data : response.data.map(function(item){
							return item.dataTime
						})
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
				        data: response.data.map(function(item){
									return item.collectNumberTotal
								})
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
				        data: response.data.map(function(item){
									return item.appliedAmountTotal
								})
				    }]
				});
			}
		}
	})

	setTimeout(function(){ // 填充数据
		// var couponStatisticsGetDatas = [10,20,5,20,5,36,10];
		// var couponStatisticsUseDatas = [20,10,36,5,10,20,36];


		// couponStatisticsChart.hideLoading();
		// couponStatisticsChart.setOption({
		// 	legend : { // 图例
		// 		data:[{
		// 			name: '领取量'
		// 		},{
		// 			name: '核销量'
		// 		}]
		// 	},
		// 	series : [{
		//         name: '领取量',
		//         type: 'line',
		//         smooth: true,
		//         smoothMonotone: 'x',
		//         areaStyle: {
		//         	normal: {
		//         		opacity: 0.3
		//         	}
		//         },
		//         data: couponStatisticsGetDatas
		//     },
		//     {
		//         name: '核销量',
		//         type: 'line',
		//         smooth: true,
		//         smoothMonotone: 'x',
		//         areaStyle: {
		//         	normal: {
		//         		opacity: 0.3
		//         	}
		//         },
		//         data: couponStatisticsUseDatas
		//     }]
		// });
	}, 1000)
})
