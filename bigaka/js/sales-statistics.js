$(function(){
	// 标题tips
	var userStatisticsTipsContent = 
		'总量分析，将针对本门店及其下上级管理门店，已支付订单的相关销售分析。分析维度提供按日、周、月汇总后，进行累计及趋势等分析。您也可以通过时间段筛选，统计固定时间段内的销售数据。'
	$('#userStatisticsTips').popover({
		content: userStatisticsTipsContent,
		html: true,
		placement: 'bottom',
		trigger: 'hover'
	})
})