function resetCharts() {
    $.each(pageEcharts, function(index) {
        this.resize();
    })
}
var top10OrderBy = 'productSaleNumber'; // productSaleNumber:销量；productSaleAmount:销售金额；
var curStartDate;
var curEndDate;
var mode=0;
$(function() {
    window.pageEcharts = []; // 记录页面上所有的echart，方便统一resize
    $('#menu_toggle').on('click', function() {
        resetCharts();
    });
    $(window).resize(function() {
        resetCharts();
    });

 // 初始化品类矩形树状chart
    window.categoryRectangleStatisticsChart = echarts.init(document.getElementById('categoryRectangleStatistics'));
    pageEcharts.push(categoryRectangleStatisticsChart);
    categoryRectangleStatisticsChart.showLoading('default', loadingOption);
    //获取树图数据
     function getCategoryRectangle(startDateFormat, endDateFormat) {
        if(!startDateFormat) {
            startDateFormat = curStartDate
        }
        if(!endDateFormat) {
            endDateFormat = curEndDate
        }
        if(mode==0){//商品导航
            url=ctx + 'GuideOrderAction/getGuideTotalListByParentStoreIdAction.do?storeId=' + storeId + '&startDate=' + startDateFormat + '&endDate=' + endDateFormat;
        }else if(mode==1){
            url=ctx + '/GroupsOrderAction/getGroupsOrderTotalList.do?parentStoreId=' + storeId + '&startDate=' + startDateFormat + '&endDate=' + endDateFormat;
        }
        categoryRectangleStatisticsChart.showLoading('default', loadingOption);
        $.ajax({
            url:url,
            type: 'post',
            success: function(response) {
                if(response.code === 0) {
                    categoryRectangleStatisticsChart.hideLoading();

                }
            }
        })
    }
     function createSeriesCommon() {
        return {
            type: 'treemap',
            label: {
                show: true,
                formatter: "",
                normal: {
                    textStyle: {
                        ellipsis: true
                    }
                }
            },
            itemStyle: {
                normal: {
                    borderColor: 'black'
                }
            }
        };
    }

    var modes = ['销量', '销售额'];
    categoryRectangleStatisticsChart.setOption({
        title: {
            show: false,
        },
        color:['#1ABB9C', '#7bd9a5', '#3fb1e3'],
        tooltip: {},
        legend: {
            show: true,
            data: modes,
            selected: {
                '销量': true,
                '销售额': false
            },
            itemGap: 5,
            selectedMode: 'single',
            top: 0,
            left:0
        },
        series: modes.map(function (mode, idx) {
            var seriesOpt = createSeriesCommon();
            seriesOpt.name = mode;
            seriesOpt.top = 30;
            seriesOpt.leafDepth =3,
            seriesOpt.data =data;
            return seriesOpt;
        })

    })


















    // 初始化商品top10chart
    window.categoryTop10StatisticsChart = echarts.init(document.getElementById('categoryTop10Statistics'));
    pageEcharts.push(categoryTop10StatisticsChart);
    categoryTop10StatisticsChart.showLoading('default', loadingOption);
    var categoryTop10StatisticsColor = ['#1ABB9C', '#7bd9a5', '#3fb1e3'];
    categoryTop10StatisticsChart.setOption({
        color: categoryTop10StatisticsColor,
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
            name: '',
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
    // 获取导航数据
    function getTop10Category(parentGuideId,startDateFormat, endDateFormat) {
        if(!startDateFormat) {
            startDateFormat = curStartDate
        }
        if(!endDateFormat) {
            endDateFormat = curEndDate
        }
        categoryTop10StatisticsChart.showLoading('default', loadingOption);
        $.ajax({
            url:ctx + 'GuideOrderAction/getGuideListByGuideIdAction.do?parentGuideId=' + '829' + '&startDate=' + startDateFormat + '&endDate=' + endDateFormat,
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
                    categoryTop10StatisticsChart.off('legendselectchanged');
                    categoryTop10StatisticsChart.on('legendselectchanged', function(event) {
                        if(event.name === '销量') {
                            top10OrderBy = 'productSaleNumber'; // productSaleNumber:销量；productSaleAmount:销售金额；
                        } else if(event.name === '销售额') {
                            top10OrderBy = 'productSaleAmount'; // productSaleNumber:销量；productSaleAmount:销售金额；
                        }
                        getTop10Category();
                    });
                }
            }
        })
    }
    //切换一级导航/二级导航
    $('input[name="guide-check"]').click(function(){
        getAllGuide();
    })
    // 点击表格的一行查询对应导航/分类销售数据
    $('#productTable tbody').on('click', 'tr', function() {
        $('#productTable tbody tr.success').removeClass('success');
        $(this).addClass('success');
        $('#activeGoodsName').text($(this).find('.product-name').text());
        getGoodsTrend($(this).find('.product-name').attr('data-id'));
    })
    // 获取所有导航/分类数据
    function getAllGuide(startDateFormat, endDateFormat) {
        if(!startDateFormat) {
            startDateFormat = curStartDate
        }
        if(!endDateFormat) {
            endDateFormat = curEndDate
        }
        var guidelevel=$('input[name="guide-check"]:checked').val()||0;
        if(mode==0){
             url=ctx + 'GuideOrderAction/getGuideTotalListByLevelAction.do?parentStoreId=' + '383' + '&startDate=' + startDateFormat + '&endDate=' + endDateFormat + '&guidelevel=' +guidelevel;
        }else if(mode==1){//分组
            url=ctx + '/GroupsOrderAction/getGroupsOrderTotalList.do?parentStoreId=' + '383' + '&startDate=' + startDateFormat + '&endDate=' + endDateFormat + '&orderBy=';
        }
        $.ajax({
            url:url,
            type: 'post',
            success: function(response) {
                if(response.code === 0) {
                    $('#productTable tbody').html('');

                        $.each(response.data, function(index, obj) {
                            if(mode==0){
                                var trHtml =
                                '<tr>' +
                                '<td class="product-name" data-id="' + obj.guideId + '">' + obj.guName + '</td>' +
                                '<td>' + obj.guideId + '</td>' +
                                '<td>' + obj.guideSaleNumber + '</td>' +
                                '<td>' + (obj.guideSaleAmount / 100).toFixed(2) + '</td>' +
                                '<td></td>' +
                                '<td></td>' +
                                '</tr>';
                            }
                            if(mode==1){
                                var trHtml =
                                '<tr>' +
                                '<td class="product-name" data-id="' + obj.groupsId + '">' + obj.gname + '</td>' +
                                '<td>' + obj.groupsId + '</td>' +
                                '<td>' + obj.groupsSaleNumber + '</td>' +
                                '<td>' + (obj.groupsSaleAmount / 100).toFixed(2) + '</td>' +
                                '<td></td>' +
                                '<td></td>' +
                                '</tr>';
                            }
                            $('#productTable tbody').append(trHtml);
                        });
                        $('#productTable').DataTable();
                }
            }
        })
    }

    // 单个导航/分类销售趋势chart初始化
    window.goodsTrendStatisticsChart = echarts.init(document.getElementById('goodsTrendStatistics'));
    pageEcharts.push(goodsTrendStatisticsChart);
    goodsTrendStatisticsChart.showLoading('default', loadingOption);
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
        getGoodsTrend($('#productTable tbody tr.success').find('.product-name').attr('data-id'))
    })
    // 查询某一导航/分类的销售数据
    function getGoodsTrend (groupsId, startDateFormat, endDateFormat) {
        if(!startDateFormat) {
            startDateFormat = curStartDate
        }
        if(!endDateFormat) {
            endDateFormat = curEndDate
        }
        goodsTrendStatisticsChart.showLoading('default', loadingOption);
        if(mode==0){
             url=ctx + 'GuideOrderAction/getGuideOrderTotalListByDateAction.do?guideId=' + groupsId + '&startDate=' + startDateFormat + '&endDate=' + endDateFormat+ '&orderBy=&dataType=' + $('#goodTrendType span.active').attr('data-value');
        }else if(mode==1){//分组
            url=ctx + 'GroupsOrderAction/getGroupsOrderTotalListByDate.do?groupsId=' + groupsId + '&startDate=' + startDateFormat + '&endDate=' + endDateFormat + '&orderBy=&dataType=' + $('#goodTrendType span.active').attr('data-value');
        }
        $.ajax({
            url: url,
            type: 'post',
            success: function(response) {
                if(response.code === 0) {
                    var seriesData = [
                        response.data.map(function(item) {
                            if(mode==0){
                               return item.guideSaleNumber
                           }else if(mode==1){
                            return item.groupsSaleNumber
                           }
                        }),
                        response.data.map(function(item) {
                            if(mode==0){
                                return(item.guideSaleAmount / 100).toFixed(2)
                            }else if(mode==1){
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

    curStartDate = moment().subtract(6, 'days').format('YYYY-MM-DD');
    curEndDate = moment().format('YYYY-MM-DD');
    // 初始化数据
    getCategoryRectangle();
    getTop10Category();
    getAllGuide();

    // 选择时间段
    $('#everyDateRange').daterangepicker(dateRangeOption);
    $('#everyDateRange').on('apply.daterangepicker', function(ev, picker) {
        $('#everyDateRange span').html(picker.startDate.format('YYYY.MM.DD') + ' - ' + picker.endDate.format('YYYY.MM.DD'));
        $('#everyDateChange span').removeClass('active');
        curStartDate = picker.startDate.format('YYYY-MM-DD');
        curEndDate = picker.endDate.format('YYYY-MM-DD');
        getTop10Category();
        getAllGuide();
    });
    $('#everyDateChange span').click(function() {
        $('#everyDateRange span').html('点击选择日期');
        var dateRange = parseInt($(this).attr('data-value'));
        curStartDate = moment().subtract(dateRange - 1, 'days').format('YYYY-MM-DD');
        curEndDate = moment().format('YYYY-MM-DD')
        getTop10Category();
        getAllGuide();
    })
    //切换模式，商品导航/活动分组
    $('.category-style .mode').click(function(){
        mode=$(this).attr('data-mode');
        if(mode==1){
            $('.table-check').hide();
        }else{
            $('.table-check').show();
        }
        $('.mode').removeClass('active')
        $(this).addClass('active');
        getCategoryRectangle();
        getTop10Category();
        getAllGuide();
    })

})