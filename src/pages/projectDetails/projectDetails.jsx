import React, { Component } from 'react'
import { Button, Layout, message, Modal, Upload } from "antd"
import Top from '../../components/top/top'
import './projectDetails.less'
import { Link } from 'react-router-dom'
import axios from 'axios'

const { Content } = Layout
const amapkey = '65dbd865aa5a1eddb73c23c18a01eea2'
const version = '1.4.15'
const props = {
    listType: "picture-card",
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    showUploadList: {
        showRemoveIcon: false
    },
    onChange({ file, fileList }) {
        if (file.status !== 'uploading') {
        }
    },
}
export default class ProjectDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tableData: {},
            pictures: [],
            visible1: false,
            defaultFileList: [],
            picturesName: [],
            previewVisible: false,
            previewImage: '',
        }
    }

    componentDidMount() {
        this.getDataById()
    };

    //获取数据
    getDataById = () => {
        axios({
            method: 'get',
            url: window.BaseUrl + '/PM/TownIndustryQueryAll',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
                id: this.props.match.params.id
            }
        }).then((response) => {
            let res = response.data
            res.dates = res.dates.replace(/-/g, '/')
            res.datef = res.datef.replace(/-/g, '/')
            this.setState({
                tableData: res,
            })
            if (res.pictures != 'url') {
                const pictures = res.pictures.split(',')
                const tempArray = []
                for (var i = 0;i < pictures.length / 2;i++) {
                    var temObj = {}
                    temObj.url = window.BaseUrl + pictures[2 * i]
                    temObj.name = pictures[2 * i + 1]
                    temObj.status = 'done'
                    temObj.uid = i
                    tempArray.push(temObj)
                }
                this.setState({
                    defaultFileList: tempArray,
                })
            } else {
                res.pictures = ''
            }
            this.getSiteMap()
        }).catch((error) => {
            console.log(error)
        }
        )
    }

    //高德地图
    getSiteMap = () => {
        const AMap = window.AMap
        const map = new AMap.Map(document.getElementById('container'), {
            resizeEnable: true,
        })
        const geocoder = new AMap.Geocoder({
            city: "邛崃",
        })
        const marker = new AMap.Marker()
        var address = "邛崃市" + this.state.tableData.townName
        geocoder.getLocation(address, function (status, result) {
            if (address === '邛崃市高埂街道') {
                result.geocodes[0].location.Q = 103.633878
                result.geocodes[0].location.lng = 103.633878
                result.geocodes[0].location.P = 30.378403
                result.geocodes[0].location.lat = 30.378403
            }
            if (status === 'complete' && result.geocodes.length) {
                var lnglat = result.geocodes[0].location
                // document.getElementById('lnglat').value = lnglat;
                marker.setPosition(lnglat)
                map.add(marker)
                map.setFitView(marker)
            } else {
                message.error('根据地址查询位置失败')
            }
        })
    };

    handlePicutres = () => {
        this.setState({
            visible1: true,
        })
    };
    handleCancel1 = e => {
        this.setState({
            visible1: false,
        })
    };
    downloadFile = (file) => {
        let formElement = document.createElement('form')
        formElement.style.display = 'display:none;'
        formElement.method = 'get'
        formElement.action = this.state.defaultFileList[0].url // 请求地址
        let inputElement = document.createElement('input') // 参数1：文件路径
        inputElement.type = 'hidden'
        inputElement.name = 'filePath'
        inputElement.value = file.url
        let inputElement2 = document.createElement('input') // 参数2: 文件名
        inputElement2.type = 'hidden'
        inputElement2.name = 'fileName'
        inputElement2.value = file.name[0]
        formElement.appendChild(inputElement).appendChild(inputElement2)
        document.body.appendChild(formElement)
        formElement.submit()
        document.body.removeChild(formElement)
    };

    getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result)
            reader.onerror = error => reject(error)
        })
    };

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await this.getBase64(file.originFileObj)
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        })
    };

    handleCancel = () => this.setState({ previewVisible: false });

    render() {
        const { previewVisible, previewImage } = this.state
        return (
            <Layout>
                <Top />
                <Content className='projectDetails'>
                    <div className="overview">
                        <Link to='/projectList'><span>返回项目列表</span></Link>
                    </div>
                    <div className='projectDetails_content'>
                        <div className="item_info"><span>项目详情</span></div>
                        <div className="item_info_content">
                            <div className="info_text">
                                <div className="info_describe">
                                    <div className="info_describe_container">
                                        <span>{this.state.tableData.name}</span>
                                        <span>区域：{this.state.tableData.townName}</span>
                                        <span>时间：{this.state.tableData.dates} - {this.state.tableData.datef}</span>
                                        <Button className='details' type="link"
                                            onClick={this.handlePicutres}><span>查看项目图片</span></Button>
                                    </div>
                                </div>
                                <div className="info_content">
                                    <div className="total_investment">
                                        <span>&emsp;累计完成投资</span>
                                        <span>{this.state.tableData.totals}</span>
                                    </div>
                                    <div className="planTotals">
                                        <span>&emsp;计划投资金额</span>
                                        <span>{this.state.tableData.planTotals}</span>
                                    </div>

                                    <div className="totalsBefore">
                                        <span>&emsp;历史投资金额</span>
                                        <span>{this.state.tableData.totalsBefore}</span>
                                    </div>
                                    <div className="totalsCurrent">
                                        <span>&emsp;今年投资金额</span>
                                        <span>{this.state.tableData.totalsCurrent}</span>
                                    </div>
                                    <div className="totalsCurrentPlan">
                                        <span>今年计划投资额</span>
                                        <span>{this.state.tableData.totalsCurrentPlan}</span>
                                    </div>

                                    <div className="industry_classification">
                                        <span>&emsp;&ensp;行业分类&emsp;&ensp;</span>
                                        <span>{this.state.tableData.classify}</span>
                                    </div>
                                    <div className="money_source">
                                        <span>&emsp;&ensp;资金来源&emsp;&ensp;</span>
                                        <span>{this.state.tableData.fundsSourec}</span>
                                    </div>
                                    <div className="construction_scale">
                                        <span className='construction_scale_tit'>&emsp;规划及内容&emsp;</span>
                                        <span className='construction_scale_con'>{this.state.tableData.contents}</span>
                                    </div>

                                </div>
                            </div>
                            <div className="info_map" id='container' style={{width:"736px",height:"701px"}}></div>
                        </div>
                    </div>
                    {/*查看项目图片弹框*/}
                    <Modal
                        wrapClassName={'myModal1'}
                        visible={this.state.visible1}
                        onCancel={this.handleCancel1}
                        width='39vw'
                    >
                        <div className="modal_title">
                            <span>项目图片</span>
                        </div>
                        <div className="modal_content" style={{ display: this.state.defaultFileList.length > 0 ? 'block' : 'none' }}>
                            <Upload {...props} onDownload={this.downloadFile} fileList={this.state.defaultFileList} onPreview={this.handlePreview}></Upload>
                            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                <img alt="example" style={{ width: '100%' }} src={previewImage} />
                            </Modal>
                        </div>
                        <div className="modal_content" style={{ display: this.state.defaultFileList.length == 0 ? 'block' : 'none' }}>
                            <span style={{ fontSize: '0.8vw', display: 'block', marginTop: '0.5vw' }}>暂无图片</span>
                        </div>
                    </Modal>
                </Content>
            </Layout>
        )
    }
}
