function resetCharts() {
	$.each(pageEcharts, function(index) {
		this.resize();
	})
}
var top10OrderBy = 'productSaleNumber'; // productSaleNumber:销量；productSaleAmount:销售金额；
var curStartDate;
var curEndDate;
$(function() {
	window.pageEcharts = []; // 记录页面上所有的echart，方便统一resize
	$('#menu_toggle').on('click', function() {
		resetCharts();
	});
	$(window).resize(function() {
		resetCharts();
	});

  // 所有门店数据
	window.goodsTop10StatisticsChart = echarts.init(document.getElementById('goodsTop10Statistics'));
	pageEcharts.push(goodsTop10StatisticsChart);
	goodsTop10StatisticsChart.showLoading('default', loadingOption);
	var goodsTop10StatisticsColor = [ '#1ABB9C', '#7bd9a5', '#3fb1e3' ];
	goodsTop10StatisticsChart.setOption({
		color : goodsTop10StatisticsColor,
		title : {
			show : false
		},
		legend : {
			data : [ '销量', '销售额' ],
			selected : {
				'销量' : true,
				'销售额' : false
			},
			selectedMode : 'single',
			right : 10
		},
		tooltip : {
			trigger : 'axis',
			axisPointer : {
				type : 'shadow'
			}
		},
		grid : { // 网格
			left : 25,
			top : 40,
			right : 30,
			bottom : 20,
			containLabel : true
		},
		xAxis : {
			type: 'value',
			splitLine : {
				lineStyle : {
					type : 'dashed'
				}
			},
			axisLine : {
				lineStyle : {
					color : '#888888'
				}
			},
			axisTick : {
				alignWithLabel : true
			}
		},
		yAxis : {
			name: 'Top10',
			nameLocation: 'start',
			nameTextStyle: {
				fontSize: 16,
				color: '#73879C'
			},
			type: 'category',
			inverse: true,
			axisLabel: {
				inside: true,
				textStyle: {
					color: '#626c91'
				}
			},
			axisTick: {
				show: false
			},
			z: 2,
			splitLine : {
				lineStyle : {
					type : 'dashed'
				}
			},
			axisLine : {
				lineStyle : {
					color : '#888888'
				}
			},
			data : []
		},
		series : [ {
			name : '销量',
			type : 'bar',
			legendHoverLink : false
		}, {
			name : '销售额',
			type : 'bar',
			legendHoverLink : false
		}]
	});

	curStartDate = moment().subtract(6, 'days').format('YYYY-MM-DD');
	curEndDate = moment().format('YYYY-MM-DD');
	getTop10Goods();
	$('#everyDateRange').daterangepicker(dateRangeOption);
	$('#everyDateRange').on('apply.daterangepicker', function(ev, picker) {
		$('#everyDateRange span').html(picker.startDate.format('YYYY.MM.DD') + ' - ' + picker.endDate.format('YYYY.MM.DD'));
		$('#everyDateChange span').removeClass('active');
		curStartDate = picker.startDate.format('YYYY-MM-DD');
		curEndDate = picker.endDate.format('YYYY-MM-DD');
		getTop10Goods();
	});
	$('#everyDateChange span').click(function(){
		$('#everyDateRange span').html('点击选择日期');
		var dateRange = parseInt($(this).attr('data-value'));
		curStartDate = moment().subtract(dateRange-1, 'days').format('YYYY-MM-DD');
		curEndDate = moment().format('YYYY-MM-DD')
		getTop10Goods();
	})
	// 所有门店数据
	function getTop10Goods (startDateFormat, endDateFormat) {
		if(!startDateFormat){
			startDateFormat = curStartDate
		}
		if(!endDateFormat){
			endDateFormat = curEndDate
		}
		goodsTop10StatisticsChart.showLoading('default', loadingOption);
		$.ajax({
			url: ctx + 'ProductOrderAction /getProductTotalList.do?parentStoreId=' + storeId + '&startDate=' + startDateFormat + '&endDate=' + endDateFormat + '&orderBy=' + top10OrderBy + '&limitSize=10',
			type: 'post',
			success: function (response) {
				if (response.code === 0) {
					var seriesData = [
						response.data.map(function(item){
							return item.productSaleNumber
						}),
						response.data.map(function(item){
							return (item.productSaleAmount / 100).toFixed(2)
					})]
					goodsTop10StatisticsChart.hideLoading();
					goodsTop10StatisticsChart.setOption({
						yAxis: {
							data: response.data.map(function(item){
								return item.productName
							})
						},
						series: [{
							data: seriesData[0]
						},{
							data: seriesData[1]
						}]
					});
//					goodsTop10StatisticsChart.off('click');
//					goodsTop10StatisticsChart.on('click', function(event) { // 选中一个门店-------------------------------------
//						if (event.componentType === 'series') {
//							var newSeriesData = $.extend(true, {}, seriesData);
//							newSeriesData[event.seriesIndex][event.dataIndex].label = {
//								normal : {
//									show : true,
//									position : 'top',
//									textStyle : {
//										color : '#E74C3C'
//									}
//								},
//								emphasis : {
//									show : true,
//									position : 'top',
//									textStyle : {
//										color : '#E74C3C'
//									}
//								}
//							};
//							newSeriesData[event.seriesIndex][event.dataIndex].itemStyle = {
//								normal : {
//									color : '#E74C3C'
//								},
//								emphasis : {
//									color : '#E74C3C'
//								}
//							}
//
//							goodsTop10StatisticsChart.setOption({
//								series: [{
//									data:	newSeriesData[0]
//								},{
//									data: newSeriesData[1]
//								},{
//									data: newSeriesData[2]
//								}]
//							});
//							$('#selectedStoreName').text(newSeriesData[event.seriesIndex][event.dataIndex].name)
//							getTotalOrderData(moment().subtract(6, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'), newSeriesData[event.seriesIndex][event.dataIndex].id);
//							getEveryOrderData(moment().subtract(6, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'), newSeriesData[event.seriesIndex][event.dataIndex].id);
//						}
//					});
					goodsTop10StatisticsChart.off('legendselectchanged');
					goodsTop10StatisticsChart.on('legendselectchanged', function(event) {
						if (event.name === '销量') {
							top10OrderBy = 'productSaleNumber'; // productSaleNumber:销量；productSaleAmount:销售金额；
						} else if (event.name === '销售额') {
							top10OrderBy = 'productSaleAmount'; // productSaleNumber:销量；productSaleAmount:销售金额；
						}
						getTop10Goods();
					});
				}
			}
		})
	}
	// 门店详情
//	var oneShopStatisticsChart = echarts.init(document.getElementById('oneShopStatistics'));
//	pageEcharts.push(oneShopStatisticsChart);
//	// oneShopStatisticsChart.showLoading('default', loadingOption);
//	oneShopStatisticsColor = [ '#1ABB9C', '#7bd9a5', '#3fb1e3' ];
//	oneShopStatisticsChart.setOption({
//  color: oneShopStatisticsColor,
//  tooltip: {
//    trigger: 'axis'
//  },
//  grid: {
//    left: 0,
//			bottom: 20,
//			containLabel : true
//  },
//  legend: {
//    data: ['付款订单', '付款金额', '单均价']
//  },
//  xAxis: [{
//    type: 'category',
//			axisLine: {
//				lineStyle: {
//					color: '#888'
//				}
//			},
//    axisTick: {
//      alignWithLabel: true
//    },
//    data: []
//  }],
//  yAxis: [{
//      type: 'value',
//      name: '付款订单',
//      // min: 0,
//      // max: 250,
//      position: 'right',
//      axisLine: {
//        lineStyle: {
//          color: oneShopStatisticsColor[0]
//        }
//      },
//				splitLine : {
//					show: false,
//					lineStyle : {
//						type : 'dashed'
//					}
//				},
//      axisLabel: {
//        formatter: '{value}'
//      }
//    },
//    {
//      type: 'value',
//      name: '付款金额',
//      // min: 0,
//      // max: 250,
//      position: 'right',
//      offset: 80,
//      axisLine: {
//        lineStyle: {
//          color: oneShopStatisticsColor[1]
//        }
//      },
//				splitLine : {
//					show: false,
//					lineStyle : {
//						type : 'dashed'
//					}
//				},
//      axisLabel: {
//        formatter: '{value}'
//      }
//    },
//    {
//      type: 'value',
//      name: '单均价',
//      // min: 0,
//      // max: 25,
//      position: 'left',
//      axisLine: {
//        lineStyle: {
//          color: oneShopStatisticsColor[2]
//        }
//      },
//				splitLine : {
//					lineStyle : {
//						type : 'dashed'
//					}
//				},
//      axisLabel: {
//        formatter: '{value}'
//      }
//    }
//  ],
//  series: []
//});
//
//	// 总订单数和销售额
//	function getTotalOrderData (startDateFormat, endDateFormat, subStoreId) {
//		if(!subStoreId){
//			subStoreId = storeId;
//		}
//		$.ajax({
//			url: ctx + 'OrderStoreDateAction/getOSDTotalByStoreId.do?storeId=' + subStoreId + '&startDate=' + startDateFormat + '&endDate=' + endDateFormat,
//			type: 'post',
//			success: function (response) {
//				if (response.code === 0) {
//					$('#totalOrderNum').text(response.data.orderPaidNumberTotal);
//					$('#totalOrderPrice').text((response.data.orderPaidTotal / 100).toFixed(2));
//					$('#everyOrderPrice').text((response.data.orderPaidTotal / response.data.orderPaidNumberTotal / 100).toFixed(2))
//				}
//			}
//		})
//	}
//	// 每日订单数和销售额
//	function getEveryOrderData (startDateFormat, endDateFormat, subStoreId) {
//		oneShopStatisticsChart.showLoading('default', loadingOption);
//		if(!subStoreId){
//			subStoreId = storeId;
//		}
//		$.ajax({
//			url: ctx + 'OrderStoreDateAction/getSubStoreTotalListByDate.do?storeId=' + subStoreId + '&startDate=' + startDateFormat + '&endDate=' + endDateFormat,
//			type: 'post',
//			success: function (response) {
//				if (response.code === 0) {
//					oneShopStatisticsChart.hideLoading();
//					oneShopStatisticsChart.setOption({
//						xAxis: [{
//				      data: response.data.map(function(item){
//								return item.dateTime
//							})
//				    }],
//						series : [{
//				      name: '付款订单',
//				      type: 'bar',
//							data : response.data.map(function(item){
//								return item.orderPaidNumberTotal
//							})
//				    },
//				    {
//				      name: '付款金额',
//				      type: 'bar',
//				      yAxisIndex: 1,
//							data : response.data.map(function(item){
//								return (item.orderPaidTotal / 100).toFixed(2)
//							})
//				    },
//				    {
//				      name: '单均价',
//				      type: 'line',
//				      yAxisIndex: 2,
//							data : response.data.map(function(item){
//								return (item.orderPaidTotal / item.orderPaidNumberTotal / 100).toFixed(2)
//							})
//				    }]
//					})
//				}
//			}
//		})
//	}
})
