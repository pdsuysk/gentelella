function resetCharts() {
	$.each(pageEcharts, function(index) {
		this.resize();
	})
}
var top10OrderBy = 'productSaleNumber'; // productSaleNumber:销量；productSaleAmount:销售金额；
var curStartDate;
var curEndDate;
var curProductId = ''; // 选中产品id
$(function() {
	var productTable = $('#productTable').DataTable(datatableLanguage);
	window.pageEcharts = []; // 记录页面上所有的echart，方便统一resize
	$('#menu_toggle').on('click', function() {
		resetCharts();
	});
	$(window).resize(function() {
		resetCharts();
	});
	// tips
	var addUpPercentTipsContent =
    '累计占比，针对销量及销售额指标，指对应品类/商品，在所有品类/商品中，按销量/销售额降序排列后，按对应顺序累计而成，不随列表排序规则变化。旨在通过二八法则找到关键品类/商品。'
  $('#addUpPercentTips').popover({
    content: addUpPercentTipsContent,
    html: true,
    placement: 'bottom',
    trigger: 'hover'
  })
	// 初始化商品top10chart
	window.goodsTop10StatisticsChart = echarts.init(document.getElementById('goodsTop10Statistics'));
	pageEcharts.push(goodsTop10StatisticsChart);
	goodsTop10StatisticsChart.showLoading('default', loadingOption);
	var goodsTop10StatisticsColor = ['#1ABB9C', '#7bd9a5', '#3fb1e3'];
	goodsTop10StatisticsChart.setOption({
		color: goodsTop10StatisticsColor,
		title: {
			show: false
		},
		legend: {
			data: ['销量', '销售额'],
			selected: {
				'销量': true,
				'销售额': false
			},
			selectedMode: 'single',
			right: 10
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			}
		},
		grid: { // 网格
			left: 25,
			top: 40,
			right: 30,
			bottom: 20,
			containLabel: true
		},
		xAxis: {
			type: 'value',
			splitLine: {
				lineStyle: {
					type: 'dashed'
				}
			},
			axisLine: {
				lineStyle: {
					color: '#888888'
				}
			},
			axisTick: {
				alignWithLabel: true
			}
		},
		yAxis: {
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
			splitLine: {
				lineStyle: {
					type: 'dashed'
				}
			},
			axisLine: {
				lineStyle: {
					color: '#888888'
				}
			},
			data: []
		},
		series: [{
			name: '销量',
			type: 'bar',
			legendHoverLink: false
		}, {
			name: '销售额',
			type: 'bar',
			legendHoverLink: false
		}]
	});
	// 获取商品top10数据
	function getTop10Goods(startDateFormat, endDateFormat) {
		if(!startDateFormat) {
			startDateFormat = curStartDate
		}
		if(!endDateFormat) {
			endDateFormat = curEndDate
		}
		goodsTop10StatisticsChart.showLoading('default', loadingOption);
		$.ajax({
			url: ctx + 'ProductOrderAction/getProductTotalList.do?parentStoreId=' + storeId + '&startDate=' + startDateFormat + '&endDate=' + endDateFormat + '&orderBy=' + top10OrderBy + '&limitSize=10',
			type: 'post',
			success: function(response) {
				if(response.code === 0) {
					var seriesData = [
						response.data.map(function(item) {
							return item.productSaleNumber
						}),
						response.data.map(function(item) {
							return(item.productSaleAmount / 100).toFixed(2)
						})
					]
					goodsTop10StatisticsChart.hideLoading();
					goodsTop10StatisticsChart.setOption({
						yAxis: {
							data: response.data.map(function(item) {
								return item.productName
							})
						},
						series: [{
							data: seriesData[0]
						}, {
							data: seriesData[1]
						}]
					});
					goodsTop10StatisticsChart.off('legendselectchanged');
					goodsTop10StatisticsChart.on('legendselectchanged', function(event) {
						if(event.name === '销量') {
							top10OrderBy = 'productSaleNumber'; // productSaleNumber:销量；productSaleAmount:销售金额；
						} else if(event.name === '销售额') {
							top10OrderBy = 'productSaleAmount'; // productSaleNumber:销量；productSaleAmount:销售金额；
						}
						getTop10Goods();
					});
				}
			}
		})
	}

	// 点击表格的一行查询对应商品销售数据
	$('#productTable tbody').on('click', 'tr', function() {
		$('#productTable tbody tr.success').removeClass('success');
		$(this).addClass('success');
		$('#activeGoodsName').text($(this).find('.product-name').text());
		curProductId = $(this).find('.product-name').attr('data-id');
		getGoodsTrend(curProductId);
	})
	// 获取所有商品数据
	function getAllGoods(startDateFormat, endDateFormat) {
		if(!startDateFormat) {
			startDateFormat = curStartDate
		}
		if(!endDateFormat) {
			endDateFormat = curEndDate
		}
		$('#productTable').showLoading();
		$.ajax({
			url: ctx + 'ProductOrderAction/getProductTotalList.do?parentStoreId=' + storeId + '&startDate=' + startDateFormat + '&endDate=' + endDateFormat + '&orderBy=' + top10OrderBy + '&limitSize=',
			type: 'post',
			success: function(response) {
				if(response.code === 0) {
					productTable.clear().draw();
					$.ajax({ // 获取门店所有商品总销量和总销售额
						url: ctx + 'ProductOrderAction/getProductTotalByPStoreIdAction.do?parentStoreId=' + storeId + '&startDate=' + startDateFormat + '&endDate=' + endDateFormat,
						type: 'post',
						success: function(response_){
							if(response_.code === 0){
								var productSaleNumber = response_.data.productSaleNumber; // 总销售量
								var productSaleAmount = response_.data.productSaleAmount; // 总销售额
								
								response.data.sort(function(a, b){ // 销售量由高到低排序，计算累计销量占比
									return b.productSaleNumber - a.productSaleNumber
								});
								$.each(response.data, function(index, product) {
									var addUpSaleNumberPercent;
									if(index === 0){
										addUpSaleNumberPercent = product.productSaleNumber / productSaleNumber * 100
									}else{
										addUpSaleNumberPercent = response.data[index - 1].addUpSaleNumberPercent + product.productSaleNumber / productSaleNumber * 100
									}
									response.data[index].addUpSaleNumberPercent = addUpSaleNumberPercent;
								});
								
								response.data.sort(function(a, b){ // 销售量由高到低排序，计算累计销售额占比
									return b.productSaleAmount - a.productSaleAmount
								});
								$.each(response.data, function(index, product) {
									var addUpSaleAmountPercent;
									if(index === 0){
										addUpSaleAmountPercent = product.productSaleAmount / productSaleAmount * 100
									}else{
										addUpSaleAmountPercent = response.data[index - 1].addUpSaleAmountPercent + product.productSaleAmount / productSaleAmount * 100
									}
									response.data[index].addUpSaleAmountPercent = addUpSaleAmountPercent;
								});
								
								$.each(response.data, function(index, product) {
									var trHtml =
										'<tr class="' + (curProductId == product.productId ? 'success' : '') + '">' +
										'<td class="product-name" data-id="' + product.productId + '">' + product.productName + '</td>' +
										'<td>' + product.productId + '</td>' +
										'<td>' + product.productSaleNumber + '</td>' +
										'<td>' + (product.productSaleAmount / 100).toFixed(2) + '</td>' +
										'<td>' + product.addUpSaleNumberPercent.toFixed(2) + '%</td>' +
										'<td>' + product.addUpSaleAmountPercent.toFixed(2) + '%</td>' +
										'</tr>'
									productTable.row.add($(trHtml)).draw();
								});
								$('#productTable').hideLoading();
							}
						}
					})
				}
			}
		})
	}

	// 单个商品销售趋势chart初始化
	window.goodsTrendStatisticsChart = echarts.init(document.getElementById('goodsTrendStatistics'));
	pageEcharts.push(goodsTrendStatisticsChart);
	// goodsTrendStatisticsChart.showLoading('default', loadingOption);
	var goodsTrendStatisticsColor = ['#1ABB9C', '#7bd9a5', '#3fb1e3'];
	goodsTrendStatisticsChart.setOption({
		color: goodsTrendStatisticsColor,
		title: {
			show: false
		},
		legend: {
			data: ['销量', '销售额'],
			selected: {
				'销量': true,
				'销售额': false
			},
			selectedMode: 'single',
			left: '1%'
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			}
		},
		grid: { // 网格
			left: '1%',
			top: 40,
			right: 30,
			bottom: 40,
			containLabel: true
		},
		xAxis: {
			splitLine: {
				lineStyle: {
					type: 'dashed'
				}
			},
			axisLine: {
				lineStyle: {
					color: '#888888'
				}
			},
			axisTick : {
				alignWithLabel : true
			},
			data: []
		},
		yAxis: {
			splitLine: {
				lineStyle: {
					type: 'dashed'
				}
			},
			axisLine: {
				lineStyle: {
					color: '#888888'
				}
			}
		},
		series: [{
			name: '销量',
			type: 'bar',
			legendHoverLink: false
		}, {
			name: '销售额',
			type: 'bar',
			legendHoverLink: false
		}]
	});
	// 切换按日、周、月统计
	$('body').on('click', '.chart-tabs#goodTrendType span', function(){
		getGoodsTrend(curProductId)
	})
	// 查询某一商品的销售数据
	function getGoodsTrend (productId, startDateFormat, endDateFormat) {
		if(!startDateFormat) {
			startDateFormat = curStartDate
		}
		if(!endDateFormat) {
			endDateFormat = curEndDate
		}
		goodsTrendStatisticsChart.showLoading('default', loadingOption);
		$.ajax({
			url: ctx + 'ProductOrderAction/getProductTotalListByDate.do?productId=' + productId + '&startDate=' + startDateFormat + '&endDate=' + endDateFormat + '&dataType=' + $('#goodTrendType span.active').attr('data-value'),
			type: 'post',
			success: function(response) {
				if(response.code === 0) {
					var seriesData = [
						response.data.map(function(item) {
							return item.productAsleNumber
						}),
						response.data.map(function(item) {
							return(item.productSaleAmount / 100).toFixed(2)
						})
					]
					goodsTrendStatisticsChart.hideLoading();
					goodsTrendStatisticsChart.setOption({
						xAxis: {
							data: response.data.map(function(item) {
								return item.dateTime
							})
						},
						series: [{
							data: seriesData[0]
						}, {
							data: seriesData[1]
						}]
					});
				}
			}
		})
	}

	curStartDate = moment().subtract(6, 'days').format('YYYY-MM-DD');
	curEndDate = moment().format('YYYY-MM-DD');
	// 初始化数据
	getTop10Goods();
	getAllGoods();
	// 选择时间段
	$('#everyDateRange').daterangepicker(dateRangeOption);
	$('#everyDateRange').on('apply.daterangepicker', function(ev, picker) {
		$('#everyDateRange span').html(picker.startDate.format('YYYY.MM.DD') + ' - ' + picker.endDate.format('YYYY.MM.DD'));
		$('#everyDateChange span').removeClass('active');
		curStartDate = picker.startDate.format('YYYY-MM-DD');
		curEndDate = picker.endDate.format('YYYY-MM-DD');
		getTop10Goods();
		getAllGoods();
		if(curProductId) {
			getGoodsTrend(curProductId);
		}
	});
	$('#everyDateChange span').click(function() {
		$('#everyDateRange span').html('点击选择日期');
		var dateRange = parseInt($(this).attr('data-value'));
		curStartDate = moment().subtract(dateRange - 1, 'days').format('YYYY-MM-DD');
		curEndDate = moment().format('YYYY-MM-DD')
		getTop10Goods();
		getAllGoods();
		if(curProductId) {
			getGoodsTrend(curProductId);
		}
	})
})
