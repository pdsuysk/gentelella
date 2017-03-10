function resetCharts() {
	$.each(pageEcharts, function(index) {
		this.resize();
	})
}
var curStoreId = storeId;
var startDateFormat = moment().subtract(6, 'days').format('YYYY-MM-DD');
var endDateFormat = moment().format('YYYY-MM-DD');
var showTotalShopData = true;
$(function() {
	window.pageEcharts = []; // 记录页面上所有的echart，方便统一resize
	$('#menu_toggle').on('click', function() {
		resetCharts();
	});
	$(window).resize(function() {
		resetCharts();
	});
	// 标题tips
	var userStatisticsTipsContent = '<p>会员统计，将针对<b>本门店及其下上级管理门店</b>，包括<b>微信会员</b>及<b>手机会员</b>的会员做数据统计分析。冻结状态会员也将统计在内，但不包括下级自主经营门店的会员数据。</p>'
			+ '<p>• 全部会员，指<b>本门店及其下上级管理门店</b>，包括<b>微信会员</b>及<b>手机会员</b>的会员总数。冻结状态会员也将统计在内，但不包括下级自主经营门店的会员数据。</p>'
			+ '<p>• 微信会员，指商户将公众号授权给舞象云后，在微信用户访问商城时，系统为微信用户自动注册的会员。微信会员需完成手机号绑定操作后，才可进行下单、抽奖等操作。已关注公众号的微信会员将能收到通过舞象云精准推送的公众号推文。</p>'
			+ '<p>• 手机会员，指用户通过微信会员绑定，或直接通过手机号注册的会员。</p>';
	$('#userStatisticsTips').popover({
		content : userStatisticsTipsContent,
		html : true,
		placement : 'bottom',
		trigger : 'hover'
	});
	// 累计会员数tips
	var totalUserTipsContent = '<p>• 累计会员总数，指<b>本门店及其下上级管理门店</b>，包括<b>微信会员</b>及<b>手机会员</b>的会员总数。冻结状态会员也将统计在内，但不包括下级自主经营门店的会员数据。</p>'
			+ '<p>• 微信会员，指商户将公众号授权给舞象云后，在微信用户访问商城时，系统为微信用户自动注册的会员。微信会员需完成手机号绑定操作后，才可进行下单、抽奖等操作。已关注公众号的微信会员将能收到通过舞象云精准推送的公众号推文。</p>'
			+ '<p>• 手机会员，指用户通过微信会员绑定，或直接通过手机号注册的会员。</p>';
	$('#totalUserTips').popover({
		content : totalUserTipsContent,
		container : 'body',
		html : true,
		placement : 'bottom',
		trigger : 'hover'
	});
	// 累计客单价tips
	var everyPersonPriceTipsContent = '<p>指标统计会员客单价为成交会员客单价。</p>'
			+ '<p>• 累计客单价=累计已支付订单金额/累计消费会员数。金额及消费会员数均为历史汇总值</p>';
	$('#everyPersonPriceTips').popover({
		content : everyPersonPriceTipsContent,
		container : 'body',
		html : true,
		placement : 'bottom',
		trigger : 'hover'
	});
	// 七天新增会员tips
	var days7NewUsersTipsContent = '<p>• 7日新增会员，指<b>本门店及其下上级管理门店</b>，包括<b>微信会员</b>及<b>手机会员</b>的7日（含今日）新增注册会员总数。</p>'
			+ '<p>• 当微信会员绑定已注册手机号时，可能出现今日新增会员数减小的情况，是由于绑定后系统将2个账号合并为1个。</p>';
	$('#days7NewUsersTips').popover({
		content : days7NewUsersTipsContent,
		container : 'body',
		html : true,
		placement : 'bottom',
		trigger : 'hover'
	});
	// 会员漏斗tips
	var userFunnelTipsContent = '<p>会员漏斗展示各节点（绑定手机、消费下单）会员转化情况。</p>'
			+ '<p>• 全部会员（微信+手机号）=100%</p>' + '<p>• 绑定手机=绑定手机号会员/全部会员*100%</p>'
			+ '<p>• 已消费=已消费会员数/全部会员*100%</p>'
			+ '<p>• 消费占手机会员比=已消费会员数/已绑定手机会员数*100%</p>';
	$('#userFunnelTips').popover({
		content : userFunnelTipsContent,
		container : 'body',
		html : true,
		placement : 'bottom',
		trigger : 'hover'
	});
	// 门店会员统计柱状图***************************************************************************************************
	var shopUsersStatisticsChart = echarts.init(document.getElementById('shopUsersStatistics'));
	pageEcharts.push(shopUsersStatisticsChart);
	shopUsersStatisticsChart.showLoading('default', loadingOption);
	shopUsersStatisticsChart.setOption({
		color : [ '#1ABB9C', '#7bd9a5' ],
		title : {
			show : false
		},
		textStyle: {
			fontFamily: 'Hiragino Sans GB, Microsoft Yahei, SimSun, Helvetica, Arial, Sans-serif'
		},
		legend : {
			data : [ '全部会员', '手机会员' ],
			selected : {
				'全部会员' : true,
				'手机会员' : false
			},
			selectedMode : 'single',
			left : 0
		},
		tooltip : {
			trigger : 'axis',
			axisPointer : {
				type : 'shadow'
			}
		},
		grid : { // 网格
			left : 0,
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
			name : '全部会员',
			type : 'bar',
			legendHoverLink : false,
			barCategoryGap : '40%',
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
			name : '手机会员',
			type : 'bar',
			legendHoverLink : false,
			barCategoryGap : '40%',
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
	// 会员漏斗***************************************************************************************************
	var userFunnelChart = echarts.init(document.getElementById('userFunnel'));
	pageEcharts.push(userFunnelChart);
	userFunnelChart.showLoading('default', loadingOption);
	userFunnelChart.setOption({
		color : [ '#1ABB9C', '#7bd9a5', '#3fb1e3' ],
		title : {
			show : false
		},
		textStyle: {
			fontFamily: 'Hiragino Sans GB, Microsoft Yahei, SimSun, Helvetica, Arial, Sans-serif'
		},
		tooltip : {
			trigger : 'item',
			formatter : '{b} : {c}%'
		},
		legend : {
			orient : 'vertical',
			right : 'right',
			bottom : '80'
		},
		series : [ {
			type : 'funnel',
			left : '0',
			top : '0',
			bottom : '10',
			width : '80%',
			label : {
				normal : {
					position : 'inside',
					formatter : '{c}%'
				},
				emphasis : {
					position : 'inside',
					formatter : '{c}%'
				}
			}
		} ]
	});
	// 门店新增会员***************************************************************************************************
	window.timesNewUserChart = echarts.init(document
			.getElementById('timesNewUser'));
	pageEcharts.push(timesNewUserChart);
	timesNewUserChart.showLoading('default', loadingOption);
	timesNewUserChart.setOption({
		color : [ '#1ABB9C' ],
		title : { // 标题
			show : false
		},
		textStyle: {
			fontFamily: 'Hiragino Sans GB, Microsoft Yahei, SimSun, Helvetica, Arial, Sans-serif'
		},
		tooltip : { // 鼠标悬浮提示框
			position : 'top'
		},
		grid : { // 网格
			top : 5,
			left : 5,
			right : 35,
			bottom : 10,
			containLabel : true
		},
		xAxis : {
			boundaryGap : false,
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
		series : []
	});

	// moment.js获取时间
	var nowDateFormat = moment().format('YYYY-MM-DD'); // 今天
	var last7DayDateFormat = moment().subtract(6, 'days').format('YYYY-MM-DD'); // 七天前

	// 会员数据概览
	$.ajax({ // 获取累计会员数据
		url: ctx + 'StoreCustomerAction/getStoreCustomerTotalByPid.do?parentStoreId=' + storeId,
		type: 'post',
		success: function (response) {
			if (response.code === 0) {
				$('#customerTotal').text(response.data.customerTotal);
				$('#phoneCustomerTotal').text(response.data.phoneCustomerTotal);
				$('#phoneCustomerPercent').text((response.data.phoneCustomerTotal/response.data.customerTotal*100).toFixed(2));
				$.ajax({ // 获取累计订单数据
					url: ctx + 'OrderStoreDateAction/getOSDTotal.do?parentStoreId=' + storeId,
					type: 'post',
					success: function (response_o) {
						if (response_o.code === 0) {
							$('#customerEveryPrice').text((parseFloat((response_o.data.orderPaidTotal/100).toFixed(2))/response.data.customerTotal).toFixed(2));
						}
					}
				})
				$.ajax({ // 获取7天累计会员数据
					url: ctx + 'StoreCustomerAction/getStoreCustomerTotalByPid.do?parentStoreId=' + storeId + '&startDate=' + last7DayDateFormat + '&endDate=' + nowDateFormat,
					type: 'post',
					success: function (response_) {
						if (response_.code === 0) {
							$('#7DayCustomerTotal').text(response_.data.customerTotal);
							$('#7DayPhoneCustomerTotal').text(response_.data.phoneCustomerTotal);
							$('#7DayPhoneCustomerPercent').text((response_.data.phoneCustomerTotal/response_.data.customerTotal*100).toFixed(2));
							$('#7DayCustomerPercent').text((response_.data.customerTotal/response.data.customerTotal*100).toFixed(2));
						}
					}
				})
			}
		}
	})
	// 门店会员统计数据
	$.ajax({
		url: ctx + 'StoreCustomerAction/getStoreCustomerTotalListForStore.do?parentStoreId=' + storeId,
		type: 'post',
		success: function (response) {
			if (response.code === 0) {
				shopUsersStatisticsChart.hideLoading();
				var seriesData = [
					{
						data: response.data.sort(function (a, b) {
								return a.customerTotal - b.customerTotal;
						}).map(function(item){
							return {
								value: item.customerTotal,
								id: item.storeId
							}
						})
					}, {
						data: response.data.sort(function (a, b) {
								return a.phoneCustomerTotal - b.phoneCustomerTotal;
						}).map(function(item){
							return {
								value: item.phoneCustomerTotal,
								id: item.storeId
							}
						})
					}
				];
				var xAxisData = [{
					data: response.data.sort(function (a, b) {
							return a.customerTotal - b.customerTotal;
					}).map(function(item){
						return item.storeShortName
					})
				},{
					data: response.data.sort(function (a, b) {
							return a.phoneCustomerTotal - b.phoneCustomerTotal;
					}).map(function(item){
						return item.storeShortName
					})
				}]
				// 固定显示25个门店
				var userZoomPercent = 25 / response.data.length;
				shopUsersStatisticsChart.setOption({
					dataZoom : [ {
						type : 'inside',
						start : 100 * (1 - userZoomPercent),
						end : 100
					}, {
						type : 'slider',
						show : true,
						height : 20,
						bottom : 10,
						start : 100 * (1 - userZoomPercent),
						end : 100
					}, {
						type : 'slider',
						show : true,
						yAxisIndex : 0,
						right : 0,
						width : 20,
						start : 0,
						end : 100
					} ],
					xAxis : xAxisData[0],
					series : seriesData
				});
				shopUsersStatisticsChart.on('legendselectchanged', function(event) { // 切换会员类型时切换X轴
					if (event.name === '手机会员') {
						shopUsersStatisticsChart.setOption({
							xAxis : xAxisData[1]
						});
					} else if (event.name === '全部会员') {
						shopUsersStatisticsChart.setOption({
							xAxis : xAxisData[0]
						});
					}
				});
				shopUsersStatisticsChart.on('click', function(event) { // 选中一个门店-------------------------------------
					if (event.componentType === 'series') {
						var newUserData = seriesData[0].data.concat();
						var newPhoneUserData = seriesData[1].data.concat();
						if (!event.data.name || event.data.name !== 'selected') { // 选中一个门店
							if (event.seriesName === '手机会员') {
								$('#currentShopName').text(xAxisData[1].data[event.dataIndex]);
								curStoreId = newPhoneUserData[event.dataIndex].id;
								showTotalShopData = false;
								resetUserChartData();
								newPhoneUserData[event.dataIndex] = {
									value : newPhoneUserData[event.dataIndex].value,
									id: newPhoneUserData[event.dataIndex].id,
									name : 'selected',
									label : {
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
									},
									itemStyle : {
										normal : {
											color : '#E74C3C'
										},
										emphasis : {
											color : '#E74C3C'
										}
									}
								}
							} else if (event.seriesName === '全部会员') {
								$('#currentShopName').text(xAxisData[0].data[event.dataIndex]);
								curStoreId = newUserData[event.dataIndex].id;
								showTotalShopData = false;
								resetUserChartData();
								newUserData[event.dataIndex] = {
									value : newUserData[event.dataIndex].value,
									id: newUserData[event.dataIndex].id,
									name : 'selected',
									label : {
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
									},
									itemStyle : {
										normal : {
											color : '#E74C3C'
										},
										emphasis : {
											color : '#E74C3C'
										}
									}
								}
							}
						}else {
							$('#currentShopName').text('全部门店');
							curStoreId = storeId;
							showTotalShopData = true;
							resetUserChartData();
						}
						shopUsersStatisticsChart.setOption({
							series : [ {
								data : newUserData
							}, {
								data : newPhoneUserData
							} ]
						});
					}
				});
				$('#showAllUserData').click(function () {
					shopUsersStatisticsChart.setOption({
						series : [ {
							data : seriesData[0].data
						}, {
							data : seriesData[1].data
						} ]
					});
					$('#currentShopName').text('全部门店');
					curStoreId = storeId;
					showTotalShopData = true;
					resetUserChartData();
				})
			}
		}
	})
	// 门店会员数据分析
	resetUserChartData();

	// 门店新增会员切换日期
	$('#userChartRange').daterangepicker(dateRangeOption);
	$('#userChartRange').on('apply.daterangepicker', function(ev, picker) {
		$('#userChartRange span').html(picker.startDate.format('YYYY.MM.DD') + ' - ' + picker.endDate.format('YYYY.MM.DD'));
		$('.chart-tabs span').removeClass('active');
		startDateFormat = picker.startDate.format('YYYY.MM.DD');
		endDateFormat = picker.endDate.format('YYYY.MM.DD');
		resetUserChartData();
	});
	$('.chart-tabs span').on('click', function() {
		$('#userChartRange span').html('点击选择日期');
		startDateFormat = moment().subtract(parseInt($(this).attr('data-value')) - 1, 'days').format('YYYY-MM-DD');
		endDateFormat = moment().format('YYYY-MM-DD');
		resetUserChartData();
	});

	function resetUserChartData() {
		var getStoreCustomerTotalForDateUrl = ctx + 'StoreCustomerAction/getStoreCustomerTotalForDate.do?storeId=' + curStoreId + '&startDate=' + startDateFormat + '&endDate=' + endDateFormat;
		var getStoreCustomerTotalByStoreIdUrl = ctx + 'StoreCustomerAction/getStoreCustomerTotalByStoreId.do?storeId=' + curStoreId + '&startDate=' + startDateFormat + '&endDate=' + endDateFormat;
		if (showTotalShopData) {
			getStoreCustomerTotalForDateUrl = ctx + 'StoreCustomerAction/getParentStoreCustomerTotalForDate.do?parentStoreId=' + curStoreId + '&startDate=' + startDateFormat + '&endDate=' + endDateFormat;
			getStoreCustomerTotalByStoreIdUrl = ctx + 'StoreCustomerAction/getStoreCustomerTotalByPid.do?parentStoreId=' + curStoreId + '&startDate=' + startDateFormat + '&endDate=' + endDateFormat;
		}
		timesNewUserChart.showLoading('default', loadingOption);
		$.ajax({ // 对应门店下七天新增会员
			url: getStoreCustomerTotalForDateUrl,
			type: 'post',
			success: function (response) {
				if (response.code === 0) {
					timesNewUserChart.hideLoading();
					timesNewUserChart.setOption({
						xAxis : {
							data : response.data.map(function(item) {
								return item.dateTime;
							})
						},
						series : [ {
							name : '新增会员',
							type : 'line',
							areaStyle : {
								normal : {
									opacity : 0.4
								}
							},
							data : response.data.map(function(item) {
								return item.customerTotal;
							})
						} ]
					});
				}
			}
		})
		userFunnelChart.showLoading('default', loadingOption);
		$.ajax({ // 设置会员漏斗数据
			url: getStoreCustomerTotalByStoreIdUrl,
			type: 'post',
			success: function (response) {
				if (response.code === 0) {
					userFunnelChart.hideLoading();
					userFunnelChart.setOption({
						legend : {
							data : [ '全部会员', '绑定手机', '已消费' ]
						},
						series : [ {
							data : [ {
								value : 100,
								name : '全部会员'
							}, {
								value : (response.data.phoneCustomerTotal/response.data.customerTotal*100).toFixed(2),
								name : '绑定手机'
							}, {
								value : (response.data.paidCustomerTotal/response.data.customerTotal*100).toFixed(2),
								name : '已消费'
							}, ]
						} ]
					});
					$('.custom-user-percent').show().find('h4').text((response.data.paidCustomerTotal/response.data.phoneCustomerTotal*100).toFixed(2) + '%');
				}
			}
		})
	}
})
