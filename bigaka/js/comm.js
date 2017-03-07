var ctx = '../../wx-big-data/';

var getUrlParam = function(param) {
	var query = window.location.search.substr(1)
	var vars = query.split('&')
	for ( var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=')
		if (pair[0] === param) {
			return pair[1]
		}
	}
	return false
}

var storeId = 3890;
if (getUrlParam('storeid')) {
	window.localStorage.setItem('storeid', getUrlParam('storeid'))
}
if (window.localStorage.getItem('storeid')) {
	storeId = window.localStorage.getItem('storeid')
}

var loadingOption = {
	text : '',
	color : '#1ABB9C',
	textColor : '#000',
	maskColor : 'rgba(255, 255, 255, 0.8)',
	zlevel : 0
}
var dateRangeOption = {
	minDate : '01/01/2000',
	maxDate : new Date(),
	showDropdowns : true,
	timePicker : false,
	timePickerIncrement : 1,
	timePicker12Hour : true,
	opens : 'left',
	buttonClasses : [ 'btn btn-default' ],
	applyClass : 'btn-small btn-success',
	cancelClass : 'btn-small',
	format : 'YYYY.MM.DD',
	separator : ' - ',
	locale : {
		applyLabel : '确定',
		cancelLabel : '取消',
		fromLabel : '开始',
		toLabel : '截至',
		customRangeLabel : '自定义',
		daysOfWeek : [ '周日', '周一', '周二', '周三', '周四', '周五', '周六' ],
		monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月',
				'十月', '十一月', '十二月' ],
		firstDay : 1
	}
};

$.ajaxSetup({
	beforeSend: function (xhr) {
　　　　	xhr.setRequestHeader('token', getUrlParam('token'));
	}
})
$(function() {
	$('body').on('click', '.chart-tabs span', function() {
		$(this).parents('.chart-tabs').find('span').removeClass('active');
		$(this).addClass('active');
	})
})
