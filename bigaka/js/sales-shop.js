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
	window.allShopStatisticsChart = echarts.init(document.getElementById('allShopStatistics'));
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
					var seriesData = [
						response.data.sort(function (a, b) {
							return a.orderPaidNumberTotal - b.orderPaidNumberTotal;
						}).map(function(item){
							return {value: item.orderPaidNumberTotal, id: item.sub_store_id, name: item.store_short_name}
						}),
						response.data.sort(function (a, b) {
							return a.orderPaidTotal - b.orderPaidTotal;
						}).map(function(item){
							return {value: (item.orderPaidTotal / 100).toFixed(2), id: item.sub_store_id, name: item.store_short_name}
						}),
						response.data.sort(function (a, b) {
							var aEverOrderPrice = (a.orderPaidNumberTotal > 0) ? (a.orderPaidTotal/a.orderPaidNumberTotal) : 0;
							var bEverOrderPrice = (b.orderPaidNumberTotal > 0) ? (b.orderPaidTotal/b.orderPaidNumberTotal) : 0;
							return aEverOrderPrice - bEverOrderPrice;
						}).map(function(item){
							var everyOrderPrice = (item.orderPaidNumberTotal > 0) ? (item.orderPaidTotal / item.orderPaidNumberTotal) : 0;
							return {value: (everyOrderPrice / 100).toFixed(2), id: item.sub_store_id, name: item.store_short_name}
						})
					]
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
								return item.store_short_name
							})
						},
						series: [{
							data:	seriesData[0]
						},{
							data: seriesData[1]
						},{
							data: seriesData[2]
						}]
					});
					allShopStatisticsChart.off('click');
					allShopStatisticsChart.on('click', function(event) { // 选中一个门店-------------------------------------
						if (event.componentType === 'series') {
							var newSeriesData = $.extend(true, {}, seriesData);
							newSeriesData[event.seriesIndex][event.dataIndex].label = {
								normal : {
									show : true,
									position : 'top',
									textStyle : {
										color : '#E74C3C'
									}
								},
								emphasis : {
									show : true,
									position : 'top',
									textStyle : {
										color : '#E74C3C'
									}
								}
							};
							newSeriesData[event.seriesIndex][event.dataIndex].itemStyle = {
								normal : {
									color : '#E74C3C'
								},
								emphasis : {
									color : '#E74C3C'
								}
							}

							allShopStatisticsChart.setOption({
								series: [{
									data:	newSeriesData[0]
								},{
									data: newSeriesData[1]
								},{
									data: newSeriesData[2]
								}]
							});
							$('#selectedStoreName').text(newSeriesData[event.seriesIndex][event.dataIndex].name)
							getTotalOrderData(moment().subtract(6, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'), newSeriesData[event.seriesIndex][event.dataIndex].id);
							getEveryOrderData(moment().subtract(6, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'), newSeriesData[event.seriesIndex][event.dataIndex].id);
						}
					});
					allShopStatisticsChart.off('legendselectchanged');
					allShopStatisticsChart.on('legendselectchanged', function(event) {
						if (event.name === '订单数') {
							allShopStatisticsChart.setOption({
								xAxis: {
									data: response.data.sort(function (a, b) {
							        return a.orderPaidNumberTotal - b.orderPaidNumberTotal;
							    }).map(function(item){
										return item.store_short_name
									})
								}
							});
						} else if (event.name === '销售额') {
							allShopStatisticsChart.setOption({
								xAxis: {
									data: response.data.sort(function (a, b) {
							        return a.orderPaidTotal - b.orderPaidTotal;
							    }).map(function(item){
										return item.store_short_name
									})
								}
							});
						} else if (event.name === '单均价') {
							allShopStatisticsChart.setOption({
								xAxis: {
									data: response.data.sort(function (a, b) {
										var aEverOrderPrice = (a.orderPaidNumberTotal > 0) ? (a.orderPaidTotal/a.orderPaidNumberTotal) : 0;
										var bEverOrderPrice = (b.orderPaidNumberTotal > 0) ? (b.orderPaidTotal/b.orderPaidNumberTotal) : 0;
						        return aEverOrderPrice - bEverOrderPrice;
							    }).map(function(item){
										return item.store_short_name
									})
								}
							});
						}
					});
				}
			}
		})
	}
	// 门店详情
	var oneShopStatisticsChart = echarts.init(document.getElementById('oneShopStatistics'));
	pageEcharts.push(oneShopStatisticsChart);
	// oneShopStatisticsChart.showLoading('default', loadingOption);
	oneShopStatisticsColor = [ '#1ABB9C', '#7bd9a5', '#3fb1e3' ];
	oneShopStatisticsChart.setOption({
    color: oneShopStatisticsColor,
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: 0,
			bottom: 20,
			containLabel : true
    },
    legend: {
      data: ['付款订单', '付款金额', '单均价']
    },
    xAxis: [{
      type: 'category',
			axisLine: {
				lineStyle: {
					color: '#888'
				}
			},
      axisTick: {
        alignWithLabel: true
      },
      data: []
    }],
    yAxis: [{
        type: 'value',
        name: '付款订单',
        // min: 0,
        // max: 250,
        position: 'right',
        axisLine: {
          lineStyle: {
            color: oneShopStatisticsColor[0]
          }
        },
				splitLine : {
					show: false,
					lineStyle : {
						type : 'dashed'
					}
				},
        axisLabel: {
          formatter: '{value}'
        }
      },
      {
        type: 'value',
        name: '付款金额',
        // min: 0,
        // max: 250,
        position: 'right',
        offset: 80,
        axisLine: {
          lineStyle: {
            color: oneShopStatisticsColor[1]
          }
        },
				splitLine : {
					show: false,
					lineStyle : {
						type : 'dashed'
					}
				},
        axisLabel: {
          formatter: '{value}'
        }
      },
      {
        type: 'value',
        name: '单均价',
        // min: 0,
        // max: 25,
        position: 'left',
        axisLine: {
          lineStyle: {
            color: oneShopStatisticsColor[2]
          }
        },
				splitLine : {
					lineStyle : {
						type : 'dashed'
					}
				},
        axisLabel: {
          formatter: '{value}'
        }
      }
    ],
    series: []
  });

	// 总订单数和销售额
	function getTotalOrderData (startDateFormat, endDateFormat, subStoreId) {
		if(!subStoreId){
			subStoreId = storeId;
		}
		$.ajax({
			url: ctx + 'OrderStoreDateAction/getOSDTotalByStoreId.do?storeId=' + subStoreId + '&startDate=' + startDateFormat + '&endDate=' + endDateFormat,
			type: 'post',
			success: function (response) {
				if (response.code === 0) {
					$('#totalOrderNum').text(response.data.orderPaidNumberTotal);
					$('#totalOrderPrice').text((response.data.orderPaidTotal / 100).toFixed(2));
					$('#everyOrderPrice').text((response.data.orderPaidTotal / response.data.orderPaidNumberTotal / 100).toFixed(2))
				}
			}
		})
	}
	// 每日订单数和销售额
	function getEveryOrderData (startDateFormat, endDateFormat, subStoreId) {
		oneShopStatisticsChart.showLoading('default', loadingOption);
		if(!subStoreId){
			subStoreId = storeId;
		}
		$.ajax({
			url: ctx + 'OrderStoreDateAction/getSubStoreTotalListByDate.do?storeId=' + subStoreId + '&startDate=' + startDateFormat + '&endDate=' + endDateFormat,
			type: 'post',
			success: function (response) {
				if (response.code === 0) {
					oneShopStatisticsChart.hideLoading();
					oneShopStatisticsChart.setOption({
						xAxis: [{
				      data: response.data.map(function(item){
								return item.dateTime
							})
				    }],
						series : [{
				      name: '付款订单',
				      type: 'bar',
							data : response.data.map(function(item){
								return item.orderPaidNumberTotal
							})
				    },
				    {
				      name: '付款金额',
				      type: 'bar',
				      yAxisIndex: 1,
							data : response.data.map(function(item){
								return (item.orderPaidTotal / 100).toFixed(2)
							})
				    },
				    {
				      name: '单均价',
				      type: 'line',
				      yAxisIndex: 2,
							data : response.data.map(function(item){
								return (item.orderPaidTotal / item.orderPaidNumberTotal / 100).toFixed(2)
							})
				    }]
					})
				}
			}
		})
	}
})
