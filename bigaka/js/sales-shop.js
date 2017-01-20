function resetCharts() {
	$.each(pageEcharts, function(index) {
		this.resize();
	})
}
$(function() {
	window.pageEcharts = []; // 记录页面上所有的echart，方便统一resize
	$('#menu_toggle').on('click', function() {
		resetCharts();
	});
	$(window).resize(function() {
		resetCharts();
	});

  // 所有门店数据
	var allShopStatisticsChart = echarts.init(document.getElementById('allShopStatistics'));
	pageEcharts.push(allShopStatisticsChart);
	allShopStatisticsChart.showLoading('default', loadingOption);
	var allShopStatisticsColor = [ '#1ABB9C', '#7bd9a5', '#3fb1e3' ];
	allShopStatisticsChart.setOption({
		color : allShopStatisticsColor,
		title : {
			show : false
		},
		legend : {
			data : [ '订单数', '销售额', '单均价' ],
			selected : {
				'订单数' : true,
				'销售额' : false,
				'单均价' : false
			},
			selectedMode : 'single',
			left : '1%'
		},
		tooltip : {
			trigger : 'axis',
			axisPointer : {
				type : 'shadow'
			}
		},
		grid : { // 网格
			left : '1%',
			top : 40,
			right : 30,
			bottom : 40,
			containLabel : true
		},
		xAxis : {
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
			},
			data : []
		},
		yAxis : {
			splitLine : {
				lineStyle : {
					type : 'dashed'
				}
			},
			axisLine : {
				lineStyle : {
					color : '#888888'
				}
			}
		},
		series : [ {
			name : '订单数',
			type : 'bar',
			legendHoverLink : false,
			label : {
				normal : {
					position : 'top',
					formatter : '{b}'
				},
				emphasis : {
					position : 'top',
					formatter : '{b}'
				}
			}
		}, {
			name : '销售额',
			type : 'bar',
			legendHoverLink : false,
			label : {
				normal : {
					position : 'top',
					formatter : '{b}'
				},
				emphasis : {
					position : 'top',
					formatter : '{b}'
				}
			}
		}, {
			name : '单均价',
			type : 'bar',
			legendHoverLink : false,
			label : {
				normal : {
					position : 'top',
					formatter : '{b}'
				},
				emphasis : {
					position : 'top',
					formatter : '{b}'
				}
			}
		}]
	});


	getAllShopData(moment().subtract(6, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'));
	$('#everyDateRange').daterangepicker(dateRangeOption);
	$('#everyDateRange').on('apply.daterangepicker', function(ev, picker) {
		$('#everyDateRange span').html(picker.startDate.format('YYYY.MM.DD') + ' - ' + picker.endDate.format('YYYY.MM.DD'));
		$('#everyDateChange span').removeClass('active');
		getAllShopData(picker.startDate.format('YYYY-MM-DD'), picker.endDate.format('YYYY-MM-DD'));
	});
	$('#everyDateChange span').click(function(){
		$('#everyDateRange span').html('点击选择日期');
		var dateRange = parseInt($(this).attr('data-value'));
		getAllShopData(moment().subtract(dateRange-1, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'));
	})
	// 所有门店数据
	function getAllShopData (startDateFormat, endDateFormat) {
		allShopStatisticsChart.showLoading('default', loadingOption);
		$.ajax({
			url: ctx + 'OrderStoreDateAction/getStoreTotalList.do?parentStoreId=' + storeId + '&startDate=' + startDateFormat + '&endDate=' + endDateFormat,
			type: 'post',
			success: function (response) {
				if (response.code === 0) {
					var shopZoomPercent = 25 / response.data.length;
					allShopStatisticsChart.hideLoading();
					allShopStatisticsChart.setOption({
						dataZoom : [{
							type : 'inside',
							start : 100 * (1 - shopZoomPercent),
							end : 100
						}, {
							type : 'slider',
							show : true,
							height : 20,
							bottom : 10,
							start : 100 * (1 - shopZoomPercent),
							end : 100
						}, {
							type : 'slider',
							show : true,
							yAxisIndex : 0,
							right : 0,
							width : 20,
							start : 0,
							end : 100
						}],
						xAxis: {
							data: response.data.sort(function (a, b) {
					        return a.orderPaidNumberTotal - b.orderPaidNumberTotal;
					    }).map(function(item){
								return item.sub_store_id
							})
						},
						series: [{
							data: response.data.sort(function (a, b) {
					        return a.orderPaidNumberTotal - b.orderPaidNumberTotal;
					    }).map(function(item){
								return item.orderPaidNumberTotal
							})
						},{
							data: response.data.sort(function (a, b) {
					        return a.orderPaidTotal - b.orderPaidTotal;
					    }).map(function(item){
								return (item.orderPaidTotal / 100).toFixed(2)
							})
						},{
							data: response.data.sort(function (a, b) {
					        return (a.orderPaidTotal/a.orderPaidNumberTotal) - (b.orderPaidTotal/b.orderPaidNumberTotal);
					    }).map(function(item){
								return (item.orderPaidTotal / item.orderPaidNumberTotal / 100).toFixed(2)
							})
						}]
					});
					allShopStatisticsChart.off('legendselectchanged');
					allShopStatisticsChart.on('legendselectchanged', function(event) {
						if (event.name === '订单数') {
							allShopStatisticsChart.setOption({
								xAxis: {
									data: response.data.sort(function (a, b) {
							        return a.orderPaidNumberTotal - b.orderPaidNumberTotal;
							    }).map(function(item){
										return item.sub_store_id
									})
								}
							});
						} else if (event.name === '销售额') {
							allShopStatisticsChart.setOption({
								xAxis: {
									data: response.data.sort(function (a, b) {
							        return a.orderPaidTotal - b.orderPaidTotal;
							    }).map(function(item){
										return item.sub_store_id
									})
								}
							});
						} else if (event.name === '单均价') {
							allShopStatisticsChart.setOption({
								xAxis: {
									data: response.data.sort(function (a, b) {
							        return (a.orderPaidTotal/a.orderPaidNumberTotal) - (b.orderPaidTotal/b.orderPaidNumberTotal);
							    }).map(function(item){
										return item.sub_store_id
									})
								}
							});
						}
					});
				}
			}
		})
	}
})
