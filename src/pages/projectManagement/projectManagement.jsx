import React, { Component } from 'react'
import Top from '../../components/top/top'
import { Layout, Pagination, Progress, Button, Table, DatePicker, Input, message } from 'antd'
import moment from 'moment'
import { Link } from 'react-router-dom'
import './projectManagement.less'
import ReactEcharts from 'echarts-for-react'
import echarts from 'echarts'
import '../../../node_modules/echarts/map/js/province/sichuan'
import qionglaiJson from '../../utils/qionglai'
import axios from 'axios'

const { Content } = Layout
const columns = [
    {
        title: '地区',
        dataIndex: 'townName',
        key: 'townName',
        render: text => <a>{text}</a>,
    },
    {
        title: '项目数',
        dataIndex: 'value',
        key: 'value',
    },
    {
        title: '今年之前累计（万元）',
        dataIndex: 'totalsBefore',
        key: 'totalsBefore',
    },
    {
        title: '今年投资（万元）',
        dataIndex: 'totalsCurrent',
        key: 'totalsCurrent',
    },
    {
        title: '今年计划投资（万元）',
        dataIndex: 'totalsCurrentPlan',
        key: 'totalsCurrentPlan',
    },
    {
        title: '本年计划投资完成百分比',
        key: 'cumulative_completion_this_year',
        dataIndex: 'cumulative_completion_this_year',
        render: (text, record) => (
            <div>
                <Progress
                    strokeColor={{
                        from: '#00B8E7',
                        to: '#046ADB',
                    }}
                    percent={parseFloat(record.cumulative_completion_this_year)}
                    status="active"
                />
            </div>
        ),
    },
]


//项目管理的路由组件
export default class ProjectManagement extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ztze: '',       //总投资额
            bnljtz: 0,    //本年累计投资额
            xmgs: '',      //项目个数
            zxt: [],       //折线图总项目个数
            zxt_name: [],  //折线图 x 坐标年份
            total_num: 0,
            bnyjtz: '',    //本年预计投资额
            predict: 0,     //本年预计投资额
            xmbdkey: {},
            uPage: {},
            xmbd: [],       //项目榜单
            totalNumber: 0,        //数据总数
            xmfb: [],       //项目数量
            currentPage: 1, //当前页数
            bnyjtz_id: 0,   //本年预计投资默认id
            cumulative_completion_this_year: 0, //每个镇的本年预计投资百分比
            //年份选择器
            isopen: false,      //是否开启
            time: moment(new Date().getFullYear(), 'YYYY'),     //年份
            // year: '2019',
            year: new Date().getFullYear(),
            startValue: null,
            //根据年份查询的数据
            bpiss: 1,         //入库数量
            value: 1,         //项目数
            statess: 1,     //已开工数
            totalss: "",    //本年预计投资
            townName: "",   //区域名称
            //是否显示修改本年预计投资按钮
            isSpanShow: 'block',
            //地图
            data: [],
            xmbd_nopage: [], //不带分页的全部数据
            ljwc: '',    //累计完成投资百分比
            planTotals: 0,  //总计划投资额
        }
    };

    // 组件渲染后调用
    componentDidMount() {
        //获取项目总览数据
        this.queryFromYear(this.state.currentPage, new Date().getFullYear())
    }

    //获取项目总览数据
    queryFromYear = (currentPage, year) => {
        axios({
            method: 'get',
            url: window.BaseUrl + '/PM/projectQueryAll',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
                currentPage: currentPage,
                yea: year
            }
        }).then((response) => {
            console.log('response______', response)
            let res = response.data
            this.setState({
                ztze: '',
                bnljtz: '',
                xmgs: '',
                zxt: '',
                zxt_name: [],
                xmbdkey: {},
                xmbd: [],
                predict: '',
                totalNumber: 0,
                bnyjtz_id: 0,
                mapData: [],
                xmbd_nopage: [],
                ljwc: '',
                planTotals: 0,
            })
            if (res.bnyjtz === null) {
                this.setState({
                    xmbd_nopage: res.xmbd,   //不带分页的全部数据
                    ztze: res.ztze,         //总投资额
                    bnljtz: res.bnljtz,   //本年累计投资
                    xmgs: res.xmgs,         //项目个数
                    zxt: res.zxt,          //折线图总项目个数
                    zxt_name: res.zxt_name,   //折线图x坐标年份
                    xmbdkey: res.xmbdkey,
                    xmbd: res.xmbdkey.xmbd,
                    totalNumber: res.xmbdkey.uPage.totalNumber, //数据总数
                    bnyjtz_id: 0,   //本年预计投资额的默认id
                    predict: 0,
                    ljwc: (Number(res.ljwc) * 100).toFixed(2),
                    planTotals: res.planTotals,
                })
            } else {
                this.setState({
                    xmbd_nopage: res.xmbd,   //不带分页的全部数据
                    ztze: res.ztze,         //总投资额
                    bnljtz: res.bnljtz,   //本年累计投资
                    xmgs: res.xmgs,         //项目个数
                    zxt: res.zxt,          //折线图总项目个数
                    zxt_name: res.zxt_name,   //折线图x坐标年份
                    xmbdkey: res.xmbdkey,
                    xmbd: res.xmbdkey.xmbd,
                    totalNumber: res.xmbdkey.uPage.totalNumber, //数据总数
                    // predict: res.bnyjtz.predict, //本年预计投资额
                    predict: res.bnyjtz, //本年预计投资额
                    bnyjtz_id: res.bnyjtz.id,   //本年预计投资额的默认id
                    ljwc: (Number(res.ljwc) * 100).toFixed(2),
                    planTotals: res.planTotals,
                })
            }
            // totalsCurrent: "0.11"
            // totalsCurrentPlan: "0.11"
            this.state.xmbd.map((v, i) => {
                this.setState({
                    // cumulative_completion_this_year: v.cumulative_completion_this_year = (v.totalss * 100 / this.state.predict).toFixed(2),
                    // cumulative_completion_this_year: v.cumulative_completion_this_year = ((Number(v.totalsCurrent) + Number(v.totalsCurrentPlan)) / this.state.predict).toFixed(2),
                    cumulative_completion_this_year: v.cumulative_completion_this_year = 100 * (Number(v.totalsCurrent) / Number(v.totalsCurrentPlan)).toFixed(2),
                })
            })
            this.getQiongLaiOption()
        }).catch((error) => {
            console.log(error)
        }
        )
    };

    // 年份选择器
    handlePanelChange = (value) => {
        const year = parseInt(JSON.stringify(value._d).slice(1, 5)) + 1
        this.setState({
            time: value,
            isopen: false,
            year: year,
        }, () => {
            //根据年份获取数据
            this.queryFromYear(this.state.currentPage, this.state.year)
        })
    };
    handleOpenChange = (status) => {
        if (status) {
            this.setState({ isopen: true })
        } else {
            this.setState({ isopen: false })
        }
    };
    clearValue = () => {
        this.setState({
            time: null,
            year: ''
        })
    };

    //分页
    pageChange = (page, pageSize) => {
        this.queryFromYear(page, this.state.year)
    };

    //饼图
    getOption = () => {
        var dataStyle = {
            normal: {
                label: {
                    show: false
                },
                labelLine: {
                    show: false
                },
                shadowBlur: 0,
                shadowColor: '#203665'
            }
        }
        let option = {
            backgroundColor: "transparent",
            series: [{
                name: '第一个圆环',
                type: 'pie',
                clockWise: false,
                radius: [70, 80],
                itemStyle: dataStyle,
                hoverAnimation: false,
                startAngle: 180,
                center: ['50%', '50%'],
                data: [
                    {
                        value: ((this.state.bnljtz / this.state.predict) * 100).toFixed(2),
                        name: '本年完成投资',
                        label: {
                            normal: {
                                rich: {
                                    a: {
                                        color: 'rgba(255,255,255,.9)',
                                        align: 'center',
                                        fontSize: 20,
                                        fontWeight: "bold"
                                    },
                                },
                                formatter: function (params) {
                                    return "{b|本年完成投资}\n\n" + "{a|" + params.value + "%}"
                                },
                                position: 'center',
                                show: true,
                                textStyle: {
                                    fontSize: '14',
                                    fontWeight: 'normal',
                                    color: '#fff'
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#41FFD8',
                                shadowColor: '#2c6cc4',
                                shadowBlur: 0
                            }
                        }
                    },
                    {
                        value: (((this.state.predict - this.state.bnljtz) / this.state.predict).toFixed(4)) * 100,
                        name: '本年未完成投资',
                        itemStyle: {
                            normal: {
                                color: '#273B6A'
                            }
                        },
                    },
                ],
            }]
        }
        return option
    };
    //折线图
    getOption2 = () => {
        let axisLine_lineWidth = 3
        let axisLabel_fontSize = 16
        let series_lineWidth = 3
        let symbolSize = 10
        let label_fontSize = 16
        let option = {
            xAxis: {
                show: true,
                type: 'category',
                boundaryGap: false,
                splitLine: { show: false }, //网格线
                // axisLine: {show: false},//x轴
                axisTick: {
                    show: true,
                    lineStyle: {
                        width: axisLine_lineWidth,
                    }
                },//x轴刻度线
                data: this.state.zxt_name,
                axisLine: {
                    lineStyle: {
                        color: '#41FFD8', // X轴及其文字颜色
                        width: axisLine_lineWidth,
                    }
                },
                axisLabel: {
                    textStyle: {
                        fontSize: axisLabel_fontSize,
                    }
                }
            },
            yAxis: {
                show: false,
                type: 'value',
            },
            series: [{
                data: this.state.zxt,
                type: 'line',
                smooth: true,
                symbolSize: symbolSize,
                color: ['#41FFD8'], //折线颜色
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        textStyle: {
                            fontSize: label_fontSize,
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        lineStyle: {
                            width: series_lineWidth    //设置线条粗细
                        }
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 1, color: "rgba(44,177,255,0) " },
                            { offset: 0, color: "rgba(65,255,216,0.34)" }
                        ])
                    }
                }
            }],
        }
        return option
    };
    //邛崃地图
    getQiongLaiOption = () => {
        let geoJson = qionglaiJson
        let myChart = echarts.init(document.getElementById('container'))
        echarts.registerMap('邛崃', geoJson)
        for (let i in this.state.xmbd_nopage) {
            delete this.state.xmbd_nopage[i].totalss
        }
        let data = this.state.xmbd_nopage
        const convertData = function (data) {
            let res = []
            for (var i = 0;i < data.length;i++) {
                let item = {}
                item.name = data[i].townName
                item.value = data[i].value
                res.push(item)
            }
            return res
        }

        let option = {
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    if (params.value) {
                        return params.name + ' : ' + params.value
                    } else {
                        return params.name + ' : ' + '0'
                    }
                },
                textStyle: {
                    color: '#fff',
                    fontSize: 25,
                },
            },
            visualMap: {
                show: true,
                type: 'continuous', // 定义为分段型 piecewise ，连续型 continuous
                left: 'center',
                bottom: '5%',
                orient: 'horizontal',
                text: ['高', '低'], // 文本，默认为数值文本
                itemWidth: 10,
                min: 1,
                max: 50,
                textStyle: {
                    color: '#fff',
                    fontSize: 18,
                },
                calculable: false,
                seriesIndex: [1],
                inRange: {
                    color: ['#0F8CD0', '#2CB1FF', '#3E82F7', '#2868B5'],
                    symbolSize: [30, 100]
                },
            },
            geo: {
                show: true,
                map: '邛崃',
                label: {
                    normal: {
                        show: true,
                        textStyle: {
                            color: '#fff',
                            fontSize: 16,
                        }
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            color: '#fff',
                        }
                    }
                },
                roam: false,    //禁止地图随着鼠标滚轮缩放
                itemStyle: {
                    normal: {
                        areaColor: '#00B3CE',
                        borderColor: '#000',
                        borderWidth: 1,
                    },
                    emphasis: {
                        areaColor: '#2045A0',
                        borderWidth: 1.5,
                    }
                }
            },
            series: [{
                name: '邛崃',
                type: 'scatter',
                coordinateSystem: 'geo',
                data: convertData(data),
                symbolSize: 5,
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'right',
                        show: true
                    },
                    emphasis: {
                        show: true
                    }
                },
            },
            {
                map: '邛崃',
                type: 'map',
                geoIndex: 0,
                aspectScale: 0.75, //长宽比
                showLegendSymbol: false, // 存在legend时显示
                roam: false,    //禁止地图随着鼠标滚轮
                animation: false,
                data: convertData(data)
            },
            ]
        }
        myChart.setOption(option)
    };

    //表格隔行变色
    rowClassName = (record, index) => {
        let className = 'dark-row'
        if (index % 2 === 1) className = 'light-row'
        return className
    }

    render() {
        return (
            <Layout>
                <Top />
                <Content className='projectManagement'>
                    <div className="overview"><span>总览</span></div>
                    <div className="total_amount">
                        <div className="item total_investment">
                            <div className="item_tit total_investment_title"><span>累积总投资额（万元）</span></div>
                            <div className="item_con total_investment_content">
                                <span className="total_investment_content_con">{this.state.ztze}</span>
                                <div className="total_investment_extra">
                                    <span className="extra extra1">计划总投资额：</span><span className="extra_con">{this.state.planTotals}</span>
                                    <br />
                                    <span className="extra extra2">计划总投资完成百分比：</span><span className="extra_con">{this.state.ljwc + ' %'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="item cumulative_investment_this_year">
                            <div className="item_tit cumulative_investment_this_year_title">
                                {/* <span>{this.state.year}年总计划投资额（万元）</span> */}
                                <span>本年计划投资额（万元）</span>
                            </div>
                            <div className="item_con cumulative_investment_this_year_content">
                                <div className='edit_container'>
                                    <span
                                        style={{ display: this.state.isSpanShow }}>{this.state.predict === '' ? '暂无数据' : this.state.predict}</span>
                                </div>
                            </div>
                        </div>

                        <div className="item accumulated_investment_this_month">
                            <div className="item_tit accumulated_investment_this_month_title">
                                {/* <span>{this.state.year}年累计投资（万元）</span> */}
                                <span>本年累计投资（万元）</span>
                            </div>
                            <div className="item_con accumulated_investment_this_month_content">
                                <span>{this.state.bnljtz === '' ? '暂无数据' : this.state.bnljtz}</span>
                            </div>
                        </div>
                        <div className="item cumulative_completion_this_year">
                            <div className="item_tit cumulative_completion_this_year_title">
                                {/* <span>{this.state.year}年累计完成（%）</span> */}
                                <span>本年计划投资完成百分比</span>
                            </div>
                            <div className="item_con cumulative_completion_this_year_content">
                                {
                                    this.state.bnljtz === 0 || this.state.predict === 0 ? '暂无数据' :
                                        <ReactEcharts option={this.getOption()} theme="Imooc"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                            }} />
                                }
                            </div>
                        </div>
                        <div className="item number_items">
                            <div className="item_tit number_items_title"><span>总项目个数</span></div>
                            <div className="item_con number_items_content">
                                {
                                    this.state.zxt === '' || this.state.zxt_name === '' ? '暂无数据' :
                                        <ReactEcharts option={this.getOption2()} theme="Imooc"
                                            style={{
                                                height: '100%',
                                                width: '100%',
                                                display: (this.state.zxt === '' || this.state.zxt_name === '' ? 'none' : 'block')
                                            }} />
                                }
                                {/* <ReactEcharts option={this.getOption2()} theme="Imooc"
                                    style={{
                                        height: '100%',
                                        width: '100%',
                                        left: '0%',
                                        top: '16%',
                                        display: (this.state.zxt === '' || this.state.zxt_name === '' ? 'none' : 'block')
                                    }} />
                                <span
                                    style={{ display: (this.state.zxt === '' || this.state.zxt_name === '' ? 'block' : 'none') }}>暂无数据</span>
                             */}
                            </div>
                        </div>
                    </div>
                    <div className="show_table">
                        <div className="projectList">
                            <div className="item_tit projectList_title"><span>各地区重大项目榜单</span></div>
                            <div className="projectList_content">
                                <div className="top_content">
                                    <div className="left_item">
                                        {/* <div className="year_select2">
                                            <DatePicker
                                                value={this.state.time}
                                                open={this.state.isopen}
                                                mode="year"
                                                placeholder='请选择年份'
                                                format="YYYY"
                                                onOpenChange={this.handleOpenChange}
                                                onPanelChange={this.handlePanelChange}
                                                onChange={this.clearValue}
                                                className='year_input2'
                                            />
                                        </div> */}
                                    </div>
                                    <div className="right_item">
                                        <div className="add_btn">
                                            <Link to='/insertProject'><Button>新建</Button></Link>
                                        </div>
                                        <div className="more_btn">
                                            <Pagination simple defaultCurrent={1}
                                                total={this.state.totalNumber}
                                                defaultPageSize={8}
                                                className='myPage'
                                                onChange={this.pageChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="table_data">
                                    <Table
                                        locale={{ emptyText: <div>暂无数据</div> }}
                                        pagination={false}
                                        rowClassName={this.rowClassName}
                                        columns={columns}
                                        rowKey={(record, index) => index}
                                        dataSource={this.state.xmbd}
                                        className='myTable' />
                                </div>
                            </div>
                        </div>
                        <div className="projectMap">
                            <div className="item_tit projectMap_title"><span>{this.state.year}年邛崃市项目统计分析-项目数量</span>
                            </div>
                            <div className="projectMap_content">
                                <div id="container" style={{ width: '100%', height: "100%" }}></div>
                            </div>
                        </div>
                    </div>
                </Content>
            </Layout >
        )
    }
}
