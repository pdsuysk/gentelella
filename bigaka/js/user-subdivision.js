$(function(){
	// 标题tips
	var userStatisticsTipsContent = 
		'会员细分将基于会员的信息属性进行会员分析，包括标签维度、城市维度、员工招募维度等。各维度都对应各系统功能，若您未启用相应功能，则无数据统计内容。'
	$('#userStatisticsTips').popover({
		content: userStatisticsTipsContent,
		html: true,
		placement: 'bottom',
		trigger: 'hover'
	})
})