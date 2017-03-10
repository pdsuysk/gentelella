function resetCharts() {
	$.each(pageEcharts, function(index) {
		this.resize();
	})
}
var top10OrderBy = 'productSaleNumber'; // productSaleNumber:销量；productSaleAmount:销售金额；
var curStartDate; // 当前选择的时间段
var curEndDate; // 当前选择的时间段
var sortMode = 'number'; // number销量；amount销售额
var productMode = '0'; // 0导航；1分组
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
	// 初始化品类矩形树状chart
	window.categoryRectangleStatisticsChart = echarts.init(document.getElementById('categoryRectangleStatistics'));
	pageEcharts.push(categoryRectangleStatisticsChart);
	categoryRectangleStatisticsChart.showLoading('default', loadingOption);
	categoryRectangleStatisticsChart.setOption({
		title: {
			show: false
		},
		color: ['#1ABB9C', '#7bd9a5', '#3fb1e3'],
		textStyle: {
			fontFamily: 'Hiragino Sans GB, Microsoft Yahei, SimSun, Helvetica, Arial, Sans-serif'
		},
		grid: { // 网格
			left: 0,
			top: 0,
			right: 0,
			bottom: 0,
			containLabel: true
		},
		tooltip: {},
		series: [{
			name: '销量',
			type: 'treemap',
			left: 0,
			top: 30,
			width: '100%',
			height: 660,
			roam: false,
			breadcrumb: {
				show: true,
				left: 0,
				top: 0
			},
			leafDepth: 1,
			levels: [{
					itemStyle: {
						normal: {
							borderColor: '#555',
							borderWidth: 4,
							gapWidth: 4
						}
					}
				},
				{
					colorSaturation: [0.3, 0.6],
					itemStyle: {
						normal: {
							borderColorSaturation: 0.7,
							gapWidth: 2,
							borderWidth: 2
						}
					}
				},
				{
					colorSaturation: [0.3, 0.5],
					itemStyle: {
						normal: {
							borderColorSaturation: 0.6,
							gapWidth: 1
						}
					}
				},
				{
					colorSaturation: [0.3, 0.5]
				}
			]
		}]
	})
	// 初始化导航/分组top10chart
	window.categoryTop10StatisticsChart = echarts.init(document.getElementById('categoryTop10Statistics'));
	pageEcharts.push(categoryTop10StatisticsChart);
	categoryTop10StatisticsChart.showLoading('default', loadingOption);
	categoryTop10StatisticsChart.setOption({
		color: ['#1ABB9C', '#7bd9a5', '#3fb1e3'],
		title: {
			show: false
		},
		textStyle: {
			fontFamily: 'Hiragino Sans GB, Microsoft Yahei, SimSun, Helvetica, Arial, Sans-serif'
		},
		legend: {
			show: false
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			}
		},
		grid: { // 网格
			left: 25,
			top: 30,
			right: 30,
			bottom: 10,
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
			type: 'category',
			inverse: true,
			z: 2,
			axisLabel: {
				inside: true,
				textStyle: {
					color: '#626c91'
				}
			},
			axisTick: {
				show: false
			},
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
		}]
	});
	// 处理树图数据
	function convertTreeData(treeData, valueKey) {
		return treeData.map(function(guide) {
			if(productMode === '0') {
				var tempData = {
					name: guide.guideName
				}
				if(typeof(guide.guideData) === 'object' && guide.guideData.length > 0) {
					tempData.children = convertTreeData(guide.guideData, valueKey);
				} else {
					tempData.value = valueKey === 'guideSaleAmount' ? parseFloat((guide.guideSaleAmount / 100).toFixed(2)) : guide[valueKey];
				}
				return tempData;
			} else if(productMode === '1') {
				var tempData = {
					name: guide.gname
				}
				if(typeof(guide.groupsData) === 'object' && guide.guideData.length > 0) {
					tempData.children = convertTreeData(guide.guideData, valueKey);
				} else {
					tempData.value = valueKey === 'groupsSaleAmount' ? parseFloat((guide.groupsSaleAmount / 100).toFixed(2)) : guide[valueKey];
				}
				return tempData;
			}
		});
	}
	// 获取树图数据
	function getCategoryRectangle(startDateFormat, endDateFormat) {
		$.ajax({
			url: ctx + 'InfoProductNavAction/findByStoreIdActions.do?parentStoreId=' + storeId + '&level=-1',
			type: 'post',
			success: function(response_) {
				if(response_.code === 0) {
					var fullGuideData = response_.data;
					if(!startDateFormat) {
						startDateFormat = curStartDate
					}
					if(!endDateFormat) {
						endDateFormat = curEndDate
					}
					var ajaxUrl = '';
					if(productMode === '0') { //商品导航
						//						ajaxUrl = ctx + 'GuideOrderAction/getGuideTotalListByParentStoreIdAction.do?storeId=' + storeId + '&startDate=' + startDateFormat + '&endDate=' + endDateFormat;
						ajaxUrl = ctx + 'GuideOrderAction/getGuideSaleTotalListForPStoreIdByGuideIdAction.do?parentStoreId=' + storeId + '&startDate=' + startDateFormat + '&endDate=' + endDateFormat;
					} else if(productMode === '1') {
						ajaxUrl = ctx + 'GroupsOrderAction/getGroupsOrderTotalList.do?parentStoreId=' + storeId + '&startDate=' + startDateFormat + '&endDate=' + endDateFormat;
					}
					categoryRectangleStatisticsChart.showLoading('default', loadingOption);
					categoryTop10StatisticsChart.showLoading('default', loadingOption);
					$.ajax({
						url: ajaxUrl,
						type: 'post',
						success: function(response) {
							if(response.code === 0) {
								// 显示矩形树图
								var tempData = [];
								if(productMode === '0') { // 导航
									$.each(response.data, function(index, guide) {
										$.each(fullGuideData, function(index_f, guide_f) {
											if(guide_f.id === guide.guideId) {
												fullGuideData[index_f].guideSaleAmount = guide.guideSaleAmount ? guide.guideSaleAmount : 0;
												fullGuideData[index_f].guideSaleNumber = guide.guideSaleNumber ? guide.guideSaleNumber : 0;
												return false;
											}
										});
									});
									var tempParentIds = [];
									var tempConvertDatas = [];
									$.each(fullGuideData, function(index, guide) {
										if(guide.parentId === 0) {
											if(tempParentIds.indexOf(guide.id) > -1) {
												tempConvertDatas[tempParentIds.indexOf(guide.id)].guideName = guide.name;
												tempConvertDatas[tempParentIds.indexOf(guide.id)].guideSaleAmount = guide.guideSaleAmount ? guide.guideSaleAmount : 0;
												tempConvertDatas[tempParentIds.indexOf(guide.id)].guideSaleNumber = guide.guideSaleNumber ? guide.guideSaleNumber : 0;
											} else {
												tempParentIds.push(guide.id);
												tempConvertDatas.push({
													guideData: [],
													guideId: guide.id,
													guideName: guide.name,
													guideSaleAmount: guide.guideSaleAmount ? 　guide.guideSaleAmount : 0,
													guideSaleNumber: guide.guideSaleNumber ? guide.guideSaleNumber : 0
												})
											}
										} else {
											if(tempParentIds.indexOf(guide.parentId) > -1) {
												tempConvertDatas[tempParentIds.indexOf(guide.parentId)].guideData.push({
													guideData: [],
													guideId: guide.id,
													guideName: guide.name,
													guideSaleAmount: guide.guideSaleAmount ? guide.guideSaleAmount : 0,
													guideSaleNumber: guide.guideSaleNumber ? guide.guideSaleNumber : 0
												})
											} else {
												tempParentIds.push(guide.parentId);
												tempConvertDatas.push({
													guideData: [{
														guideData: [],
														guideId: guide.id,
														guideName: guide.name,
														guideSaleAmount: guide.guideSaleAmount ? guide.guideSaleAmount : 0,
														guideSaleNumber: guide.guideSaleNumber ? guide.guideSaleNumber : 0
													}],
													guideId: guide.parentId,
													guideName: '',
													guideSaleAmount: 0,
													guideSaleNumber: 0
												})
											}
										}
									});
									tempData = convertTreeData(tempConvertDatas, sortMode === 'number' ? 'guideSaleNumber' : 'guideSaleAmount');
//									tempData = convertTreeData(response.data, sortMode === 'number' ? 'guideSaleNumber' : 'guideSaleAmount');
								} else if(productMode === '1') {
									tempData = convertTreeData(response.data, sortMode === 'number' ? 'groupsSaleNumber' : 'groupsSaleAmount');
								}
								categoryRectangleStatisticsChart.hideLoading();
								categoryRectangleStatisticsChart.setOption({
									series: [{
										name: sortMode === 'number' ? '销量' : '销售额',
										data: tempData
									}]
								});
								console.log(tempData)
								categoryRectangleStatisticsChart.off('click');
								categoryRectangleStatisticsChart.on('click', function(params){
									console.log(params)
								})
								// 显示top10柱状图
								categoryTop10StatisticsChart.hideLoading();
								if(productMode === '0') {
									categoryTop10StatisticsChart.setOption({
										yAxis: {
											data: tempConvertDatas.sort(function(a, b) {
												return sortMode === 'number' ? (b.guideSaleNumber - a.guideSaleNumber) : (b.guideSaleAmount - a.guideSaleAmount);
											}).map(function(item, index) {
												if(index < 10) {
													return item.guideName
												}
											}).splice(0, 10)
										},
										series: [{
											name: sortMode === 'number' ? '销量' : '销售额',
											data: tempConvertDatas.sort(function(a, b) {
												return sortMode === 'number' ? (b.guideSaleNumber - a.guideSaleNumber) : (b.guideSaleAmount - a.guideSaleAmount);
											}).map(function(item, index) {
												if(index < 10) {
													return sortMode === 'number' ? item.guideSaleNumber : parseFloat((item.guideSaleAmount / 100).toFixed(2))
												}
											}).splice(0, 10)
										}]
									});
								} else if(productMode === '1') {
									categoryTop10StatisticsChart.setOption({
										yAxis: {
											data: response.data.sort(function(a, b) {
												return sortMode === 'number' ? (b.groupsSaleNumber - a.groupsSaleNumber) : (b.groupsSaleAmount - a.groupsSaleAmount);
											}).map(function(item, index) {
												if(index < 10) {
													return item.gname
												}
											}).splice(0, 10)
										},
										series: [{
											name: sortMode === 'number' ? '销量' : '销售额',
											data: response.data.sort(function(a, b) {
												return sortMode === 'number' ? (b.groupsSaleNumber - a.groupsSaleNumber) : (b.groupsSaleAmount - a.groupsSaleAmount);
											}).map(function(item, index) {
												if(index < 10) {
													return sortMode === 'number' ? item.groupsSaleNumber : parseFloat((item.groupsSaleAmount / 100).toFixed(2))
												}
											}).splice(0, 10)
										}]
									});
								}
							}
						}
					})
				}
			}
		})
	}

	// 获取top10导航/分组
	function getTop10Category(parentGuideId, startDateFormat, endDateFormat) {
		if(!startDateFormat) {
			startDateFormat = curStartDate
		}
		if(!endDateFormat) {
			endDateFormat = curEndDate
		}
		categoryTop10StatisticsChart.showLoading('default', loadingOption);
		$.ajax({
			url: ctx + 'GuideOrderAction/getGuideListByGuideIdAction.do?parentGuideId=' + '829' + '&startDate=' + startDateFormat + '&endDate=' + endDateFormat,
			type: 'post',
			success: function(response) {
				if(response.code === 0) {
					categoryTop10StatisticsChart.hideLoading();
					var seriesData = [
						response.data.map(function(item) {
							return item.productSaleNumber
						}),
						response.data.map(function(item) {
							return(item.productSaleAmount / 100).toFixed(2)
						})
					]
					categoryTop10StatisticsChart.setOption({
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
				}
			}
		})
	}
	//切换一级导航/二级导航
	$('input[name="guide-check"]').on('ifChecked', function() {
		getAllGuide();
	})
	// 点击表格的一行查询对应导航/分类销售数据
	$('#productTable tbody').on('click', 'tr', function() {
		$('#productTable tbody tr.success').removeClass('success');
		$(this).addClass('success');
		$('#activeGoodsName').text($(this).find('.product-name').text());
		curProductId = $(this).find('.product-name').attr('data-id');
		getGoodsTrend(curProductId);
	})
	// 获取所有导航/分类数据
	function getAllGuide(startDateFormat, endDateFormat) {
		if(!startDateFormat) {
			startDateFormat = curStartDate
		}
		if(!endDateFormat) {
			endDateFormat = curEndDate
		}
		var guidelevel = $('input[name="guide-check"]:checked').val();
		if(productMode === '0') {
			url = ctx + 'GuideOrderAction/getGuideTotalListByLevelAction.do?parentStoreId=' + storeId + '&startDate=' + startDateFormat + '&endDate=' + endDateFormat + '&guidelevel=' + guidelevel;
		} else if(productMode === '1') { //分组
			url = ctx + 'GroupsOrderAction/getGroupsOrderTotalList.do?parentStoreId=' + storeId + '&startDate=' + startDateFormat + '&endDate=' + endDateFormat + '&orderBy=';
		}
		$('#productTable').showLoading();
		$.ajax({
			url: url,
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
								
								if(productMode === '0') {
									response.data.sort(function(a, b){ // 销售量由高到低排序，计算累计销量占比
										return b.guideSaleNumber - a.guideSaleNumber
									});
									$.each(response.data, function(index, product) {
										var addUpSaleNumberPercent;
										if(index === 0){
											addUpSaleNumberPercent = product.guideSaleNumber / productSaleNumber * 100
										}else{
											addUpSaleNumberPercent = response.data[index - 1].addUpSaleNumberPercent + product.guideSaleNumber / productSaleNumber * 100
										}
										response.data[index].addUpSaleNumberPercent = addUpSaleNumberPercent;
									});
									
									response.data.sort(function(a, b){ // 销售量由高到低排序，计算累计销售额占比
										return b.guideSaleAmount - a.guideSaleAmount
									});
									$.each(response.data, function(index, product) {
										var addUpSaleAmountPercent;
										if(index === 0){
											addUpSaleAmountPercent = product.guideSaleAmount / productSaleAmount * 100
										}else{
											addUpSaleAmountPercent = response.data[index - 1].addUpSaleAmountPercent + product.guideSaleAmount / productSaleAmount * 100
										}
										response.data[index].addUpSaleAmountPercent = addUpSaleAmountPercent;
									});
									
									$.each(response.data, function(index, obj) {
										var trHtml =
											'<tr class="' + (curProductId == obj.guideId ? 'success' : '') + '">' +
											'<td class="product-name" data-id="' + obj.guideId + '">' + obj.guName + '</td>' +
											'<td>' + obj.guideSaleNumber + '</td>' +
											'<td>' + (obj.guideSaleAmount / 100).toFixed(2) + '</td>' +
											'<td>' + obj.addUpSaleNumberPercent.toFixed(2) + '%</td>' +
											'<td>' + obj.addUpSaleAmountPercent.toFixed(2) + '%</td>' +
											'</tr>';
										productTable.row.add($(trHtml)).draw();
									});
								}
								if(productMode === '1') {
									response.data.sort(function(a, b){ // 销售量由高到低排序，计算累计销量占比
										return b.groupsSaleNumber - a.groupsSaleNumber
									});
									$.each(response.data, function(index, product) {
										var addUpSaleNumberPercent;
										if(index === 0){
											addUpSaleNumberPercent = product.groupsSaleNumber / productSaleNumber * 100
										}else{
											addUpSaleNumberPercent = response.data[index - 1].addUpSaleNumberPercent + product.groupsSaleNumber / productSaleNumber * 100
										}
										response.data[index].addUpSaleNumberPercent = addUpSaleNumberPercent;
									});
									
									response.data.sort(function(a, b){ // 销售量由高到低排序，计算累计销售额占比
										return b.groupsSaleAmount - a.groupsSaleAmount
									});
									$.each(response.data, function(index, product) {
										var addUpSaleAmountPercent;
										if(index === 0){
											addUpSaleAmountPercent = product.groupsSaleAmount / productSaleAmount * 100
										}else{
											addUpSaleAmountPercent = response.data[index - 1].addUpSaleAmountPercent + product.groupsSaleAmount / productSaleAmount * 100
										}
										response.data[index].addUpSaleAmountPercent = addUpSaleAmountPercent;
									});
									
									$.each(response.data, function(index, obj) {
										var trHtml =
											'<tr class="' + (curProductId == obj.groupsId ? 'success' : '') + '">' +
											'<td class="product-name" data-id="' + obj.groupsId + '">' + obj.gname + '</td>' +
											'<td>' + obj.groupsSaleNumber + '</td>' +
											'<td>' + (obj.groupsSaleAmount / 100).toFixed(2) + '</td>' +
											'<td>' + obj.addUpSaleNumberPercent.toFixed(2) + '%</td>' +
											'<td>' + obj.addUpSaleAmountPercent.toFixed(2) + '%</td>' +
											'</tr>';
										productTable.row.add($(trHtml)).draw();
									});
								}
								
								$('#productTable').hideLoading();
							}
						}
					});
				}
			}
		})
	}

	// 单个导航/分类销售趋势chart初始化
	window.goodsTrendStatisticsChart = echarts.init(document.getElementById('goodsTrendStatistics'));
	pageEcharts.push(goodsTrendStatisticsChart);
	// goodsTrendStatisticsChart.showLoading('default', loadingOption);
	var goodsTrendStatisticsColor = ['#1ABB9C', '#7bd9a5', '#3fb1e3'];
	goodsTrendStatisticsChart.setOption({
		color: goodsTrendStatisticsColor,
		title: {
			show: false
		},
		textStyle: {
			fontFamily: 'Hiragino Sans GB, Microsoft Yahei, SimSun, Helvetica, Arial, Sans-serif'
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
			axisTick: {
				alignWithLabel: true
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
	$('body').on('click', '.chart-tabs#goodTrendType span', function() {
		getGoodsTrend(curProductId)
	})
	// 查询某一导航/分类的销售数据
	function getGoodsTrend(groupsId, startDateFormat, endDateFormat) {
		if(!startDateFormat) {
			startDateFormat = curStartDate
		}
		if(!endDateFormat) {
			endDateFormat = curEndDate
		}
		goodsTrendStatisticsChart.showLoading('default', loadingOption);
		if(productMode === '0') {
			url = ctx + 'GuideOrderAction/getGuideOrderTotalListByDateAction.do?guideId=' + groupsId + '&startDate=' + startDateFormat + '&endDate=' + endDateFormat + '&orderBy=&dataType=' + $('#goodTrendType span.active').attr('data-value');
		} else if(productMode === '1') { //分组
			url = ctx + 'GroupsOrderAction/getGroupsOrderTotalListByDate.do?groupsId=' + groupsId + '&startDate=' + startDateFormat + '&endDate=' + endDateFormat + '&orderBy=&dataType=' + $('#goodTrendType span.active').attr('data-value');
		}
		$.ajax({
			url: url,
			type: 'post',
			success: function(response) {
				if(response.code === 0) {
					var seriesData = [
						response.data.map(function(item) {
							if(productMode === '0') {
								return item.guideSaleNumber
							} else if(productMode === '1') {
								return item.groupsSaleNumber
							}
						}),
						response.data.map(function(item) {
							if(productMode === '0') {
								return(item.guideSaleAmount / 100).toFixed(2)
							} else if(productMode === '1') {
								return(item.groupsSaleAmount / 100).toFixed(2)
							}
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

	// 初始化数据
	curStartDate = moment().subtract(6, 'days').format('YYYY-MM-DD');
	curEndDate = moment().format('YYYY-MM-DD');
	getCategoryRectangle();
	getAllGuide();
	// 选择时间段
	$('#everyDateRange').daterangepicker(dateRangeOption);
	$('#everyDateRange').on('apply.daterangepicker', function(ev, picker) {
		$('#everyDateRange span').html(picker.startDate.format('YYYY.MM.DD') + ' - ' + picker.endDate.format('YYYY.MM.DD'));
		$('#everyDateChange span').removeClass('active');
		curStartDate = picker.startDate.format('YYYY-MM-DD');
		curEndDate = picker.endDate.format('YYYY-MM-DD');
		getCategoryRectangle();
		getAllGuide();
		if(curProductId) {
			getGoodsTrend(curProductId);
		}
	});
	$('#everyDateChange span').click(function() {
		$('#everyDateRange span').html('点击选择日期');
		var dateRange = parseInt($(this).attr('data-value'));
		curStartDate = moment().subtract(dateRange - 1, 'days').format('YYYY-MM-DD');
		curEndDate = moment().format('YYYY-MM-DD')
		getCategoryRectangle();
		getAllGuide();
		if(curProductId) {
			getGoodsTrend(curProductId);
		}
	})
	// 切换商品导航/活动分组
	$('#productsModeChange span').click(function() {
		productMode = $(this).attr('data-value');
		if(productMode === '0') {
			$('.table-check').show();
		} else {
			$('.table-check').hide();
		}
		getCategoryRectangle();
		getAllGuide();
	})
	// 切换销量和销售额
	$('#sortModeChange span').click(function() {
		sortMode = $(this).attr('data-value');
		getCategoryRectangle();
	})
})