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
	var shopUsersStatisticsChart = echarts.init(document
			.getElementById('shopUsersStatistics'));
	pageEcharts.push(shopUsersStatisticsChart);
	shopUsersStatisticsChart.showLoading('default', loadingOption);
	shopUsersStatisticsChart.setOption({
		color : [ '#1ABB9C', '#7bd9a5' ],
		title : {
			show : false
		},
		legend : {
			data : [ '全部会员', '手机会员' ],
			selected : {
				'全部会员' : true,
				'手机会员' : false
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
			name : '全部会员',
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
			name : '手机会员',
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
		} ]
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
	setTimeout(function() {
		shopUsersStatisticsChart.hideLoading();
		// 设置门店会员统计相关数据---------------------------------------------------------
		var shopUsersStatisticsData = [], shopPhoneUsersStatisticsData = [];
		var baseShopUsersStatistics1 = 100, baseShopUsersStatistics2 = 100;
		for ( var i = 0; i < 200; i++) {
			baseShopUsersStatistics1 += 5000 * Math.random() * Math.random();
			baseShopUsersStatistics2 += 5000 * Math.random() * Math.random();
			shopUsersStatisticsData.push({
				value : parseInt(baseShopUsersStatistics1),
				name : '门店门店门店门店' + Math.random().toFixed(2)
			});
			shopPhoneUsersStatisticsData.push({
				value : parseInt(baseShopUsersStatistics2),
				name : '门店门店门店门店' + Math.random().toFixed(2)
			})
		}

		shopUsersStatisticsChart.setOption({
			dataZoom : [ {
				type : 'inside',
				start : 0,
				end : 100
			}, {
				type : 'slider',
				show : true,
				height : 20,
				bottom : 10,
				start : 70,
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
			xAxis : {
				data : shopUsersStatisticsData.map(function(item) {
					return item.name
				})
			},
			series : [ {
				data : shopUsersStatisticsData
			}, {
				data : shopPhoneUsersStatisticsData
			} ]
		});
		shopUsersStatisticsChart.on('legendselectchanged', function(event) { // 切换会员类型时切换X轴
			if (event.name === '手机会员') {
				shopUsersStatisticsChart.setOption({
					xAxis : {
						data : shopPhoneUsersStatisticsData.map(function(item) {
							return item.name
						})
					}
				});
			} else if (event.name === '全部会员') {
				shopUsersStatisticsChart.setOption({
					xAxis : {
						data : shopUsersStatisticsData.map(function(item) {
							return item.name
						})
					}
				});
			}
		});
		shopUsersStatisticsChart.on('click', function(event) { // 选中一个门店-------------------------------------
			if (event.componentType === 'series') {
				var newUserData = shopUsersStatisticsData.concat();
				var newPhoneUserData = shopPhoneUsersStatisticsData.concat();
				if (!event.data.name || event.data.name !== 'selected') { // 选中一个门店
					if (event.seriesName === '手机会员') {
						newPhoneUserData[event.dataIndex] = {
							value : newPhoneUserData[event.dataIndex].value,
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
						newUserData[event.dataIndex] = {
							value : newUserData[event.dataIndex].value,
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
		// 设置会员漏斗数据-----------------------------------
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
					value : 80,
					name : '绑定手机'
				}, {
					value : 70,
					name : '已消费'
				}, ]
			} ]
		});
		$('.custom-user-percent').show().find('h4').text('70%');
		// 设置新增会员数据-----------------------------------
		var timesNewUserData = [ {
			value : 100,
			date : '2017.01.01'
		}, {
			value : 150,
			date : '2017.01.02'
		}, {
			value : 78,
			date : '2017.01.03'
		}, {
			value : 50,
			date : '2017.01.04'
		}, {
			value : 122,
			date : '2017.01.05'
		}, {
			value : 90,
			date : '2017.01.06'
		}, {
			value : 200,
			date : '2017.01.07'
		} ];
		timesNewUserChart.hideLoading();
		timesNewUserChart.setOption({
			xAxis : {
				data : timesNewUserData.map(function(item) {
					return item.date;
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
				data : timesNewUserData
			} ]
		});
	}, 1000)
	// 门店新增会员切换日期
	$('#userChartRange').daterangepicker(dateRangeOption);
	$('#userChartRange').on(
			'apply.daterangepicker',
			function(ev, picker) {
				$('#userChartRange span').html(
						picker.startDate.format('YYYY.MM.DD') + ' - '
								+ picker.endDate.format('YYYY.MM.DD'));
				$('.chart-tabs span').removeClass('active');
				resetUserChartData();
			});
	$('.chart-tabs span').on('click', function() {
		$('#userChartRange span').html('点击选择日期');
		resetUserChartData();
	})
})
function resetUserChartData() {
	timesNewUserChart.showLoading('default', loadingOption);
	setTimeout(function() {
		timesNewUserChart.hideLoading();
		var timesNewUserData = [];
		for ( var i = 0; i < parseInt(100 * Math.random()); i++) {
			timesNewUserData.push({
				value : parseInt(500 * Math.random()),
				date : '2017.01.' + i
			})
		}
		timesNewUserChart.setOption({
			xAxis : {
				data : timesNewUserData.map(function(item) {
					return item.date;
				})
			},
			series : [{
				data : timesNewUserData
			}]
		});
	}, 1000)
}
