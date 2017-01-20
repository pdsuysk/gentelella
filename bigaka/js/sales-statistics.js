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
  var userStatisticsTipsContent =
    '总量分析，将针对本门店及其下上级管理门店，已支付订单的相关销售分析。分析维度提供按日、周、月汇总后，进行累计及趋势等分析。您也可以通过时间段筛选，统计固定时间段内的销售数据。'
  $('#userStatisticsTips').popover({
    content: userStatisticsTipsContent,
    html: true,
    placement: 'bottom',
    trigger: 'hover'
  })

  // 总量分析表
	var salesStatisticsChart = echarts.init(document.getElementById('salesStatistics'));
	pageEcharts.push(salesStatisticsChart);
	salesStatisticsChart.showLoading('default', loadingOption);
	salesStatisticsColor = [ '#1ABB9C', '#7bd9a5', '#3fb1e3' ];
	salesStatisticsChart.setOption({
    color: salesStatisticsColor,
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
            color: salesStatisticsColor[0]
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
            color: salesStatisticsColor[1]
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
            color: salesStatisticsColor[2]
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


	getTotalOrderData(moment().subtract(6, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'));
	getEveryOrderData(moment().subtract(6, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'));
	$('#everyDateRange').daterangepicker(dateRangeOption);
	$('#everyDateRange').on('apply.daterangepicker', function(ev, picker) {
			$('#everyDateRange span').html(picker.startDate.format('YYYY.MM.DD') + ' - ' + picker.endDate.format('YYYY.MM.DD'));
			$('#everyDateChange span').removeClass('active');
			getTotalOrderData(picker.startDate.format('YYYY-MM-DD'), picker.endDate.format('YYYY-MM-DD'));
			getEveryOrderData(picker.startDate.format('YYYY-MM-DD'), picker.endDate.format('YYYY-MM-DD'));
		});
	$('#everyDateChange span').click(function(){
		$('#everyDateRange span').html('点击选择日期');
		var dateRange = parseInt($(this).attr('data-value'));
		getTotalOrderData(moment().subtract(dateRange-1, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'));
		getEveryOrderData(moment().subtract(dateRange-1, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'));
	})
	// 总订单数和销售额
	function getTotalOrderData (startDateFormat, endDateFormat) {
		$.ajax({
			url: ctx + 'OrderStoreDateAction/getOSDTotal.do?parentStoreId=' + storeId + '&startDate=' + startDateFormat + '&endDate=' + endDateFormat,
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
	function getEveryOrderData (startDateFormat, endDateFormat) {
		salesStatisticsChart.showLoading('default', loadingOption);
		$.ajax({
			url: ctx + 'OrderStoreDateAction/getStoreTotalListByDate.do?parentStoreId=' + storeId + '&startDate=' + startDateFormat + '&endDate=' + endDateFormat,
			type: 'post',
			success: function (response) {
				if (response.code === 0) {
					salesStatisticsChart.hideLoading();
					salesStatisticsChart.setOption({
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
