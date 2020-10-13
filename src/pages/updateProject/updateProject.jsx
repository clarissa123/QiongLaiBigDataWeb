import React, { Component } from 'react'
import Top from '../../components/top/top'
import { Layout, message, Button, Form, Select, Input, DatePicker, Upload, Icon, Row, Col } from 'antd'
import './updateProject.less'
import { getProjectMesQueryAll, TownIndustryQueryAll } from '../../api/projectList'
import moment from 'moment'
import axios from 'axios'

const { Content } = Layout
const { Option } = Select
const { RangePicker } = DatePicker
const selectStyle = {
    width: '34.26vw',
    height: '3.86vw',
    backgroundColor: 'transparent',
    border: '1px solid rgba(43, 177, 255, 0.17)'
}
const props = {
    action: window.BaseUrl + '/PM/fileuploadExecl',
    name: 'pictureFile',
    showUploadList: {
        showDownloadIcon: false,
    },
    headers: {
        authorization: 'authorization-text',
    },
}

class UpdateProject extends Component {
    constructor(props) {
        super(props)
        this.state = {
            area: [],
            classify: [],
            dates: '',
            datef: '',
            pictures: [],
            defaultFileList: [],
            picturesName: [],
        }
    }

    componentDidMount() {
        this.getDataById()
        this.getSelectData()
    }

    getSelectData = () => {
        getProjectMesQueryAll({ currentPage: 1 }).then(res => {
            this.setState({
                area: res.qy,
                classify: res.hy,
            })
        })
    };
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
            const dates = moment(res.dates)
            moment(res.dates).milliseconds(0)
            const datef = moment(res.datef)
            datef.milliseconds(0)
            this.props.form.setFieldsValue({
                name: res.name,
                townName: res.townName,
                totals: res.totals,
                classify: res.classify,
                fundsSourec: res.fundsSourec,
                contents: res.contents,
                date: [dates, datef],
                planTotals: res.planTotals,
                totalsBefore: res.totalsBefore,
                totalsCurrent: res.totalsCurrent,
                totalsCurrentPlan: res.totalsCurrentPlan,
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
        }).catch((error) => {
            console.log(error)
        }
        )
    };
    beforeUpload = (file) => {
        const isJPEG = file.type === 'image/jpeg'
        const isJPG = file.type === 'image/jpg'
        const isPNG = file.type === 'image/png'
        const isGIF = file.type === 'image/gif'
        if (!isJPEG && !isJPG && !isPNG && !isGIF) {
            file.status = 'error'
            message.error('只能上传 JPG/JPEG/JIF/PNG 格式图片!')
            return false
        }
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
            file.status = 'error'
            message.error('图片必须小于 2MB!')
            return false
        }
        return
    }
    onChange = (info) => {
        if (info.file.status !== 'uploading') {
            // console.log(info)
            // console.log('---------------', info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 上传成功`)
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败`)
        };
        this.setState({
            defaultFileList: info.fileList
        })

    };
    removeFile = (file) => {
        const index = this.state.defaultFileList.indexOf(file)
        const newFileList = this.state.defaultFileList.slice()
        newFileList.splice(index, 1)
        this.setState({
            defaultFileList: newFileList
        })
    };
    normFile = e => {
        if (Array.isArray(e)) {
            return e
        }
        this.setState({
            defaultFileList: e.fileList
        })
        return e && e.fileList
    };

    updateForm = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.id = this.props.match.params.id
                values.dates = moment(values.date[0]).format('YYYY-MM-DD')
                values.datef = moment(values.date[1]).format('YYYY-MM-DD')
                let temp = ''
                let tempArr = []

                if (values.upload !== undefined) {

                    values.upload.forEach((v, i) => {
                        if ('response' in v) {
                            let temp = {}
                            temp.url = v.response.url[0].url
                            temp.name = v.response.url[0].name
                            temp.status = 'done'
                            temp.uid = i
                            tempArr.push(temp)
                        } else {
                            tempArr.push(v)
                        }
                        // if (v.url.indexOf(window.BaseUrl) != -1) {
                        //     v.url = v.url.split(window.BaseUrl)[1]
                        // }
                        // temp += v.url + "," + v.name + ","
                        // values.pictures = temp.substring(0, temp.lastIndexOf(','))
                    })
                    values.upload = []
                    values.upload = tempArr
                    let tempStr = ''
                    for (var i = 0;i < tempArr.length;i++) {
                        if (tempArr[i].url.indexOf(window.BaseUrl) != -1) {
                            tempArr[i].url = tempArr[i].url.split(window.BaseUrl)[1]
                        }
                        tempStr += tempArr[i].url + ',' + tempArr[i].name + ","
                    }
                    values.pictures = tempStr.substring(0, tempStr.lastIndexOf(','))
                } else {
                    values.pictures = ''
                }

                axios({
                    method: 'post',
                    url: window.BaseUrl + '/PM/projectMesUpdate',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    params: {
                        id: this.props.match.params.id,
                        townName: values.townName,
                        totals: parseInt(values.totals),
                        planTotals: values.planTotals,
                        name: values.name,
                        fundsSourec: values.fundsSourec,
                        dates: values.dates,
                        datef: values.datef,
                        contents: values.contents,
                        classify: values.classify,
                        pictures: values.pictures,
                        // picturesName: values.picName,
                        totalsBefore: values.totalsBefore,
                        totalsCurrent: values.totalsCurrent,
                        totalsCurrentPlan: values.totalsCurrentPlan,
                    }
                }).then((res) => {
                    if (res.data === true) {
                        message.success('编辑项目成功')
                        this.props.history.replace('/projectList')
                    }
                }).catch((error) => {
                    console.log(error)
                }
                )
            }
        })
    };

    render() {
        const { getFieldDecorator, getFieldsError } = this.props.form
        const areaOptions = this.state.area.map((val, key) => {
            return (
                <Option key={val.id} value={val.townName}>{val.townName}</Option>
            )
        })
        const classifyOptions = this.state.classify.map((val, key) => {
            return (
                <Option key={val.id} value={val.name}>{val.name}</Option>
            )
        })
        const rangeConfig = {
            rules: [{ type: 'array', required: true, message: '请选择项目起止时间' }],
        }

        return (
            <Layout>
                <Top />
                <Content className='updateProject'>
                    <div className='insertProject_content'>
                        <div className="item_info"><span>编辑</span></div>
                        <div className="item_info_content">
                            <Form labelCol={{ span: 2 }} wrapperCol={{ span: 5 }} hideRequiredMark={true}
                                className='myForm' layout='horizontal'>
                                <Form.Item wrapperCol={{ span: 12, offset: 12 }}>
                                    <Button className='myInsert' type="primary"
                                        onClick={this.updateForm}>保存</Button>
                                </Form.Item>
                                <Row gutter={16} style={{ marginTop: '1.46vw', marginLeft: 0, marginRight: 0 }}>
                                    <Col span={12}>
                                        <Form.Item label="项目名称">
                                            {getFieldDecorator('name', {
                                                rules: [{ required: true, message: '请输入项目名称' }],
                                            })(<Input placeholder='请输入项目名称' autoComplete='off' />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="累计完成投资（万元）">
                                            {getFieldDecorator('totals', {
                                                rules: [{ required: true, message: '请输入投资总额' }],
                                            })(<Input placeholder='请输入投资总额' autoComplete='off' />)}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={16} style={{ marginLeft: 0, marginRight: 0 }}>
                                    <Col span={12}>
                                        <Form.Item label="项目区域">
                                            {getFieldDecorator('townName', {
                                                rules: [{ required: true, message: '请选择项目区域' }],
                                            })(
                                                <Select
                                                    style={selectStyle}
                                                    size='large'
                                                    placeholder="请选择"
                                                >
                                                    {areaOptions}
                                                </Select>,
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="行业分类">
                                            {getFieldDecorator('classify', {
                                                rules: [{ required: true, message: '请选择行业分类' }],
                                            })(
                                                <Select
                                                    style={selectStyle}
                                                    size='large'
                                                    placeholder="请选择"
                                                >
                                                    {classifyOptions}
                                                </Select>,
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={16} style={{ marginLeft: 0, marginRight: 0 }}>
                                    {/* <Col span={12}>
                                        <Form.Item label="是否开工">
                                            {getFieldDecorator('states', {
                                                rules: [{required: true, message: '请选择是否开工'}],
                                            })(
                                                <Select
                                                    placeholder="请选择"
                                                >
                                                    <Option value="是">是</Option>
                                                    <Option value="否">否</Option>
                                                </Select>,
                                            )}
                                        </Form.Item>
                                    </Col> */}
                                    <Col span={12}>
                                        <Form.Item label="资金来源">
                                            {getFieldDecorator('fundsSourec', {
                                                rules: [{ required: true, message: '请输入资金来源' }],
                                            })(<Input placeholder='请输入资金来源' autoComplete='off' />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="计划投资金额（万元）">
                                            {getFieldDecorator('planTotals', {
                                                rules: [{ required: true, message: '请输入计划投资金额' }],
                                            })(
                                                <Input placeholder='请输入计划投资金额' autoComplete='off' />
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={16} style={{ marginLeft: 0, marginRight: 0 }}>
                                    <Col span={12}>
                                        <Form.Item label="项目创建时间">
                                            {getFieldDecorator('date', rangeConfig)
                                                (
                                                    <RangePicker
                                                        // onChange={this.onChange}
                                                        placeholder={['开始时间', '结束时间']}
                                                    />
                                                )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="规划及内容">
                                            {getFieldDecorator('contents', {
                                                rules: [{ required: true, message: '请输入规划及内容' }],
                                            })(<Input placeholder='请输入规划及内容' autoComplete='off'
                                                className='contentsCls' />)}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={16} style={{ marginLeft: 0, marginRight: 0 }}>
                                    <Col span={12}>
                                        <Form.Item label="历史投资额（万元）">
                                            {getFieldDecorator('totalsBefore', {
                                            })(<Input placeholder='请输入历史投资额' autoComplete='off' />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="今年投资额（万元）">
                                            {getFieldDecorator('totalsCurrent', {
                                            })(<Input placeholder='请输入今年投资额' autoComplete='off' />)}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={16} style={{ marginLeft: 0, marginRight: 0 }}>
                                    <Col span={12}>
                                        <Form.Item label="今年计划投资额（万元）">
                                            {getFieldDecorator('totalsCurrentPlan', {
                                            })(<Input placeholder='请输入今年计划投资额' autoComplete='off' />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item extra="" className='upload_item'>
                                            {getFieldDecorator('upload', {
                                                valuePropName: 'pictures',
                                                getValueFromEvent: this.normFile,
                                            })(
                                                <Upload {...props}
                                                    beforeUpload={this.beforeUpload}
                                                    onChange={this.onChange}
                                                    onRemove={this.removeFile}
                                                    fileList={this.state.defaultFileList}
                                                >
                                                    <Button className='upload_btn'>
                                                        <Icon type="upload" /> 项目图片上传
                                                    </Button>
                                                </Upload>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </div>
                </Content>
            </Layout>
        )
    }
}

const WrappedApp = Form.create({ name: 'coordinated' })(UpdateProject)

export default WrappedApp
