function resetCharts() {
	$.each(pageEcharts, function(index) {
		this.resize();
	})
}
var curStartDate;
var curEndDate;
var curCouponId = '';
$(function() {
	window.pageEcharts = []; // 记录页面上所有的echart，方便统一resize
	$('#menu_toggle').on('click', function() {
		resetCharts();
	});
	$(window).resize(function() {
		resetCharts();
	});
	// tips
	var allCouponTipsContent = '<p>所有优惠券，包括未生效、进行中及已结束（已失效）优惠券。</p>';
	$('#allCouponTips').popover({
		content: allCouponTipsContent,
		html: true,
		placement: 'bottom',
		trigger: 'hover'
	});
	// 优惠券漏斗***************************************************************************************************
	var activeCouponFunnelChart = echarts.init(document.getElementById('activeCouponFunnel'));
	var allCouponFunnelChart = echarts.init(document.getElementById('allCouponFunnel'));
	pageEcharts.push(activeCouponFunnelChart);
	pageEcharts.push(allCouponFunnelChart);
	activeCouponFunnelChart.showLoading('default', loadingOption);
	allCouponFunnelChart.showLoading('default', loadingOption);
	var couponFunnelOption = {
		color: ['#1ABB9C', '#7bd9a5', '#3fb1e3'],
		title: {
			show: false
		},
		tooltip: {
			trigger: 'item',
			formatter: '{b} : {c}%'
		},
		legend: {
			show: false
		},
		series: [{
			type: 'funnel',
			left: '10',
			right: '10',
			top: '0',
			bottom: '0',
			label: {
				normal: {
					position: 'inside',
					formatter: '{b}'
				},
				emphasis: {
					position: 'inside',
					formatter: '{b}'
				}
			}
		}]
	}
	activeCouponFunnelChart.setOption(couponFunnelOption);
	allCouponFunnelChart.setOption(couponFunnelOption);
	// 单个优惠券数据chart初始化
	window.couponTrendStatisticsChart = echarts.init(document.getElementById('couponTrendStatistics'));
	pageEcharts.push(couponTrendStatisticsChart);
	// couponTrendStatisticsChart.showLoading('default', loadingOption);
	couponTrendStatisticsChart.setOption({
		title: {
			show: false
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				animation: false
			}
		},
		legend: {
			show: false
		},
		grid: [{
			left: 50,
			right: 50,
			height: '35%'
		}, {
			left: 50,
			right: 50,
			top: '55%',
			height: '35%'
		}],
		xAxis: [{
				type: 'category',
				boundaryGap: false,
				axisLine: { onZero: true },
				axisLine: {
					lineStyle: {
						color: '#888888'
					}
				},
				data: []
			},
			{
				gridIndex: 1,
				type: 'category',
				boundaryGap: false,
				axisLine: { onZero: true },
				data: [],
				axisLine: {
					lineStyle: {
						color: '#888888'
					}
				},
				position: 'top'
			}
		],
		yAxis: [{
				name: '领取量(张)',
				type: 'value',
				axisLine: {
					lineStyle: {
						color: '#888888'
					}
				},
				splitLine: {
					lineStyle: {
						type: 'dashed'
					}
				},
			},
			{
				gridIndex: 1,
				name: '核销量(张)',
				type: 'value',
				inverse: true,
				axisLine: {
					lineStyle: {
						color: '#888888'
					}
				},
				splitLine: {
					lineStyle: {
						type: 'dashed'
					}
				},
			}
		],
		series: [{
				name: '领取量',
				type: 'line',
				symbolSize: 8,
				hoverAnimation: false,
				data: []
			},
			{
				name: '核销量',
				type: 'line',
				xAxisIndex: 1,
				yAxisIndex: 1,
				symbolSize: 8,
				hoverAnimation: false,
				data: []
			}
		]
	})
	// 单个优惠券和总数据对比漏斗图初始化
	window.oneAndAllCouponFunnelChart = echarts.init(document.getElementById('oneAndAllCouponFunnel'));
	pageEcharts.push(oneAndAllCouponFunnelChart);
	oneAndAllCouponFunnelChart.setOption({
		title: {
			show: false
		},
		color: ['#1ABB9C', '#7bd9a5', '#3fb1e3'],
		series: [{
				name: '全部优惠券',
				type: 'funnel',
				left: '10%',
				top: '0',
				width: '80%',
				label: {
					normal: {
						formatter: '{b}'
					},
					emphasis: {
						formatter: '{b}: {c}%'
					}
				},
				labelLine: {
					normal: {
						show: false
					}
				},
				itemStyle: {
					normal: {
						opacity: 0.3
					}
				},
				data: []
			},
			{
				name: 'xx优惠券',
				type: 'funnel',
				left: '10%',
				top: '0',
				width: '80%',
				label: {
					normal: {
						position: 'inside',
						formatter: '{b}',
					},
					emphasis: {
						position: 'inside',
						formatter: '{b}: {c}%'
					}
				},
				itemStyle: {
					normal: {
						opacity: 0.7,
						borderColor: '#fff',
						borderWidth: 2
					}
				},
				data: []
			}
		]
	});
	// 单个优惠券数据柱状图
	window.oneCouponStatisticsChart = echarts.init(document.getElementById('oneCouponStatistics'));
	pageEcharts.push(oneCouponStatisticsChart);
	oneCouponStatisticsChart.setOption({
		title: {
			show: false
		},
		color: ['#1ABB9C', '#7bd9a5', '#3fb1e3'],
		tooltip: {
			trigger: 'axis'
		},
		grid: {
			left : '2%',
			top : 20,
			right : 20,
			bottom : 20,
			containLabel : true
		},
		xAxis: [{
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
			type: 'category',
			data: []
		}],
		yAxis: [{
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
			type: 'value'
		}],
		series: [{
				name: '转化订单数',
				type: 'bar',
				data: []
			},
			{
				name: '转化订单金额',
				type: 'bar',
				data: []
			}
		]
	});

	// 获取门店下优惠券数据
	$.ajax({ // 进行中优惠券
		url: ctx + 'CouponDateAction/getByCouponSumTotal.do?storeId=' + storeId + '&status=3',
		type: 'post',
		success: function(response) {
			if(response.code === 0) {
				$('#activeKindNumber').text(response.data.kindNumber);
				$('#activeQuantityTotal').text(response.data.quantityTotal);
				$('#activeCollectNumber').text(response.data.collectNumberTotal);
				$('#activeCollectPercent').text((response.data.collectNumberTotal / response.data.quantityTotal * 100).toFixed(2));
				$('#activeAppliedNumber').text(response.data.appliedAmountTotal);
				$('#activeAppliedPercent').text((response.data.appliedAmountTotal / response.data.quantityTotal * 100).toFixed(2));
				$('#activeOrderNumber').text(response.data.couponOrderNumberTotal);
				$('#activeOrderMoney').text((response.data.couponOrderAmountTotal / 100).toFixed(2));
				$('#activePrefeMoney').text((response.data.couponOrderPreferentialAmountTotal / 100).toFixed(2));
				activeCouponFunnelChart.hideLoading();
				activeCouponFunnelChart.setOption({
					series: [{
						data: [{
							value: 100,
							name: '发放'
						}, {
							value: (response.data.collectNumberTotal / response.data.quantityTotal * 100).toFixed(2),
							name: '领取'
						}, {
							value: (response.data.appliedAmountTotal / response.data.quantityTotal * 100).toFixed(2),
							name: '核销'
						}, ]
					}]
				});
			}
		}
	});
	getAllCouponFunnelData(true);
	$('#showUnableCheck').on('ifChecked', function() {
		getAllCouponFunnelData(false)
	});
	$('#showUnableCheck').on('ifUnchecked', function() {
		getAllCouponFunnelData(true)
	});

	function getAllCouponFunnelData(showUnable) {
		allCouponFunnelChart.showLoading('default', loadingOption);
		$.ajax({
			url: ctx + 'CouponDateAction/getByCouponSumTotal.do?storeId=' + storeId + '&status=' + (showUnable ? '1' : '2'),
			type: 'post',
			success: function(response) {
				if(response.code === 0) {
					$('#allKindNumber').text(response.data.kindNumber);
					$('#allQuantityTotal').text(response.data.quantityTotal);
					$('#allCollectNumber').text(response.data.collectNumberTotal);
					$('[id=allCollectPercent]').text((response.data.collectNumberTotal / response.data.quantityTotal * 100).toFixed(2));
					$('#allAppliedNumber').text(response.data.appliedAmountTotal);
					$('[id=allAppliedPercent]').text((response.data.appliedAmountTotal / response.data.quantityTotal * 100).toFixed(2));
					$('#allOrderNumber').text(response.data.couponOrderNumberTotal);
					$('#allOrderMoney').text((response.data.couponOrderAmountTotal / 100).toFixed(2));
					$('#allPrefeMoney').text((response.data.couponOrderPreferentialAmountTotal / 100).toFixed(2));
					allCouponFunnelChart.hideLoading();
					allCouponFunnelChart.setOption({
						series: [{
							data: [{
								value: 100,
								name: '发放'
							}, {
								value: (response.data.collectNumberTotal / response.data.quantityTotal * 100).toFixed(2),
								name: '领取率'
							}, {
								value: (response.data.appliedAmountTotal / response.data.quantityTotal * 100).toFixed(2),
								name: '核销率'
							}, ]
						}]
					});
					oneAndAllCouponFunnelChart.setOption({
						series: [{
							data: [{
								value: 100,
								name: '发放'
							}, {
								value: (response.data.collectNumberTotal / response.data.quantityTotal * 100).toFixed(2),
								name: '平均领取率'
							}, {
								value: (response.data.appliedAmountTotal / response.data.quantityTotal * 100).toFixed(2),
								name: '平均核销率'
							}, ]
						}, {}]
					});
				}
			}
		})
	}
	curStartDate = moment().subtract(6, 'days').format('YYYY-MM-DD');
	curEndDate = moment().format('YYYY-MM-DD');
	// 初始化数据
	getAllCouponData();
	// 切换优惠券状态
	$('body').on('click', '.chart-tabs#couponStatusChange span', function() {
		getAllCouponData($(this).attr('data-value'));
	})
	$('#tableShowUnableCheck').on('ifChecked', function() {
		getAllCouponData(2)
	});
	$('#tableShowUnableCheck').on('ifUnchecked', function() {
		getAllCouponData(1)
	});
	// 选择时间段
	$('#everyDateRange').daterangepicker(dateRangeOption);
	$('#everyDateRange').on('apply.daterangepicker', function(ev, picker) {
		$('#everyDateRange span').html(picker.startDate.format('YYYY.MM.DD') + ' - ' + picker.endDate.format('YYYY.MM.DD'));
		$('#everyDateChange span').removeClass('active');
		curStartDate = picker.startDate.format('YYYY-MM-DD');
		curEndDate = picker.endDate.format('YYYY-MM-DD');
		getAllCouponData();
		if(curCouponId){
			getCouponTrend(curCouponId);
		}
	});
	$('#everyDateChange span').click(function() {
		$('#everyDateRange span').html('点击选择日期');
		var dateRange = parseInt($(this).attr('data-value'));
		curStartDate = moment().subtract(dateRange - 1, 'days').format('YYYY-MM-DD');
		curEndDate = moment().format('YYYY-MM-DD')
		getAllCouponData();
		if(curCouponId){
			getCouponTrend(curCouponId);
		}
	})
	// 点击表格的一行查询对应优惠券数据
	$('#couponTable tbody').on('click', 'tr', function() {
		$('#couponTable tbody tr.success').removeClass('success');
		$(this).addClass('success');
		$('[id=activeCouponName]').text($(this).find('.coupon-name').attr('data-name'));
		curCouponId = $(this).find('.coupon-name').attr('data-id');
		getCouponTrend($(this).find('.coupon-name').attr('data-id'));
	})

	// 查询某一优惠券数据
	function getCouponTrend(couponId, startDateFormat, endDateFormat) {
		debugger
		if(!startDateFormat) {
			startDateFormat = curStartDate
		}
		if(!endDateFormat) {
			endDateFormat = curEndDate
		}
		oneAndAllCouponFunnelChart.showLoading('default', loadingOption);
		$.ajax({
			url: ctx + 'CouponDateAction/getCouponTotalByCouponId.do?couponId=' + couponId + '&startDate=' + startDateFormat + '&endDate=' + endDateFormat,
			type: 'post',
			success: function(response) {
				if(response.code === 0) {
					$('#oneCouponQuantityTotal').text(response.data.quantityTotal);
					$('#oneCouponCollectNumberTotal').text(response.data.collectNumberTotal);
					$('#oneCouponAppliedAmountTotal').text(response.data.appliedAmountTotal);

					$('#oneCouponCollectPercent').text((response.data.collectNumberTotal / response.data.quantityTotal * 100).toFixed(2));
					$('#oneCouponAppliedPercent').text((response.data.appliedAmountTotal / response.data.quantityTotal * 100).toFixed(2));

					var oneCouponCollectPercentGrow = parseFloat($('#oneCouponCollectPercent').text()) - parseFloat($('#allCollectPercent').text());
					var oneCouponAppliedPercentGrow = parseFloat($('#oneCouponAppliedPercent').text()) - parseFloat($('#allAppliedPercent').text());
					$('#oneCouponCollectPercentGrow').text(oneCouponCollectPercentGrow >= 0 ? ('+' + oneCouponCollectPercentGrow.toFixed(2)) : oneCouponCollectPercentGrow.toFixed(2));
					$('#oneCouponAppliedPercentGrow').text(oneCouponAppliedPercentGrow >= 0 ? ('+' + oneCouponAppliedPercentGrow.toFixed(2)) : oneCouponAppliedPercentGrow.toFixed(2));

					$('#oneCouponOrderNumberTotal').text(response.data.couponOrderNumberTotal);
					$('#oneCouponOrderAmountTotal').text((response.data.couponOrderAmountTotal / 100).toFixed(2));
					$('#oneCouponOrderPreferentialAmountTotal').text((response.data.couponOrderPreferentialAmountTotal / 100).toFixed(2));

					oneAndAllCouponFunnelChart.hideLoading();
					oneAndAllCouponFunnelChart.setOption({
						series: [{}, {
							data: [{
								value: 100,
								name: '发放'
							}, {
								value: (response.data.collectNumberTotal / response.data.quantityTotal * 100).toFixed(2),
								name: '领取率'
							}, {
								value: (response.data.appliedAmountTotal / response.data.quantityTotal * 100).toFixed(2),
								name: '核销率'
							}, ]
						}]
					});
				}
			}
		});
		couponTrendStatisticsChart.showLoading('default', loadingOption);
		oneCouponStatisticsChart.showLoading('default', loadingOption);
		$.ajax({
			url: ctx + 'CouponDateAction/getListByCouponIdAndDate.do?couponId=' + couponId + '&startDate=' + startDateFormat + '&endDate=' + endDateFormat,
			type: 'post',
			success: function(response) {
				if(response.code === 0) {
					couponTrendStatisticsChart.hideLoading();
					couponTrendStatisticsChart.setOption({
						xAxis: [{
							data: response.data.map(function(item) {
								return moment(item.date).format('YYYY-MM-DD');
							})
						}, {
							data: response.data.map(function(item) {
								return moment(item.date).format('YYYY-MM-DD');
							})
						}],
						series: [{
							data: response.data.map(function(item) {
								return item.collectNumber
							})
						}, {
							data: response.data.map(function(item) {
								return item.appliedAmount
							})
						}]
					});
					oneCouponStatisticsChart.hideLoading();
					oneCouponStatisticsChart.setOption({
						xAxis: [{
							data: response.data.map(function(item) {
								return moment(item.date).format('YYYY-MM-DD');
							})
						}],
						series: [{
							data: response.data.map(function(item) {
								return item.couponOrderNumber
							})
						}, {
							data: response.data.map(function(item) {
								return (item.couponOrderAmount / 100).toFixed(2)
							})
						}]
					});
				}
			}
		})
	}

	function getAllCouponData(couponStatus, startDateFormat, endDateFormat) {
		if(!couponStatus) {
			couponStatus = 1
		}
		if(!startDateFormat) {
			startDateFormat = curStartDate
		}
		if(!endDateFormat) {
			endDateFormat = curEndDate
		}
		$.ajax({
			url: ctx + 'CouponDateAction/getCouponTotalGroupByCouponId.do?storeId=' + storeId + '&status=' + couponStatus + '&startDate=' + startDateFormat + '&endDate=' + endDateFormat,
			type: 'post',
			success: function(response) {
				if(response.code === 0) {
					console.log(response.data);
					$('#couponTable tbody').html('');
					$.each(response.data, function(index, coupon) {
						var trHtml =
							'<tr>' +
							'<td class="coupon-name" data-id="' + coupon.couponId + '" data-name="' + coupon.title + '">' + coupon.title;
						if(coupon.status === 1) {
							trHtml += '<span class="status-tag pull-right">未开始</span>'
						}
						if(coupon.status === 2) {
							trHtml += '<span class="status-tag pull-right">已开始</span>'
						}
						if(coupon.status === 3) {
							trHtml += '<span class="status-tag pull-right">已结束</span>'
						}
						if(coupon.status === 4) {
							trHtml += '<span class="status-tag pull-right">已删除</span>'
						}
						trHtml +=
							'</td>' +
							'<td>' + coupon.quantityTotal + '</td>' +
							'<td>' + coupon.collectNumberTotal + '</td>' +
							'<td>' + coupon.appliedAmountTotal + '</td>' +
							'<td>' + (coupon.collectNumberTotal / coupon.quantityTotal * 100).toFixed(2) + '</td>' +
							'<td>' + (coupon.appliedAmountTotal / coupon.quantityTotal * 100).toFixed(2) + '</td>' +
							'<td>' + coupon.couponOrderNumberTotal + '</td>' +
							'<td>' + (coupon.couponOrderAmountTotal / 100).toFixed(2) + '</td>' +
							'<td>' + (coupon.couponOrderPreferentialAmountTotal / 100).toFixed(2) + '</td>' +
							'</tr>'
						$('#couponTable tbody').append(trHtml);
					});
					$('#couponTable').DataTable();
				}
			}
		})
	}
})