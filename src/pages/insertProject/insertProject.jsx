import React, { Component } from 'react'
import Top from '../../components/top/top'
import { Layout, message, Button, Form, Select, Input, DatePicker, Upload, Icon, Row, Col, InputNumber } from 'antd'
import './insertProject.less'
import { Link } from 'react-router-dom'
import { getProjectMesQueryAll } from '../../api/projectList'
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
    onChange: info => {
        if (info.file.status !== 'uploading') {
            // console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 上传成功`)
        }
    },
    // 拦截文件上传
    beforeUpload: file => {
        const isJPG = file.type === 'image/jpeg'
        const isPNG = file.type === 'image/png'
        const isGIF = file.type === 'image/gif'
        if (!isJPG && !isPNG && !isGIF) {
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
}

class InsertProject extends Component {
    constructor(props) {
        super(props)
        this.state = {
            area: [],
            classify: [],
            dates: '',
            datef: '',
            pictures: [],
        }
    }

    componentDidMount() {
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

    closeForm = () => {
        this.props.form.resetFields()
        this.props.history.push('/allPoliceInfo')
    };

    normFile = e => {
        // console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e
        }
        return e && e.fileList
    };

    insertForm = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.dates = moment(values.date[0]).format('YYYY-MM-DD')
                values.datef = moment(values.date[1]).format('YYYY-MM-DD')
                let temp = ''
                if (values.upload !== undefined) {
                    values.upload.forEach(v => {
                        temp += v.response.url[0].url + "," + v.response.url[0].name + ","
                        values.pictures = temp.substring(0, temp.lastIndexOf(','))
                    })
                } else {
                    values.pictures = ''
                }

                axios({
                    method: 'post',
                    url: window.BaseUrl + '/PM/projectMesAdd',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    params: {
                        townName: values.townName,
                        totals: values.totals,
                        name: values.name,
                        fundsSourec: values.fundsSourec,
                        planTotals: values.planTotals,
                        dates: values.dates,
                        datef: values.datef,
                        contents: values.contents,
                        classify: values.classify,
                        pictures: values.pictures,
                        totalsBefore: Number(values.totalsBefore),
                        totalsCurrent: Number(values.totalsCurrent),
                        totalsCurrentPlan: Number(values.totalsCurrentPlan),
                    }
                }).then((res) => {
                    if (res.data === true) {
                        message.success('新增项目成功')
                        this.closeForm()
                        this.props.history.push('/projectManagement')
                    }
                }).catch((error) => {
                    console.log(error)
                }
                )
            }
        })
    };

    totalsBefore_onChange = (value) => {
        console.log('changed', value)
    }

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
                <Content className='insertProject'>
                    <div className="overview">
                        <Link to='/projectManagement'>
                            <span>返回 总览</span>
                        </Link>
                    </div>
                    <div className='insertProject_content'>
                        <div className="item_info"><span>新增项目</span></div>
                        <div className="item_info_content">
                            <Form labelCol={{ span: 2 }} wrapperCol={{ span: 5 }} hideRequiredMark={'false'}
                                className='myForm' layout='horizontal'>
                                <Form.Item wrapperCol={{ span: 12, offset: 12 }}>
                                    <Button className='myInsert' type="primary" htmlType="submit"
                                        onClick={this.insertForm}>保存</Button>
                                    <Button className='myClose' onClick={this.closeForm}>取消</Button>
                                </Form.Item>
                                <Row gutter={16} style={{ marginLeft: 0, marginRight: 0, marginTop: '28px', paddingLeft: 0, paddingRight: 0 }}>
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
                                                rules: [{ required: true, message: '请输入正确的投资总额' },],
                                            })(<Input placeholder='请输入投资总额' autoComplete='off' />)}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={16} style={{ marginLeft: 0, marginRight: 0, paddingLeft: 0, paddingRight: 0 }}>
                                    <Col span={12}>
                                        <Form.Item label="项目区域">
                                            {getFieldDecorator('townName', {
                                                rules: [{ required: true, message: '请选择项目区域' }],
                                            })(
                                                <Select
                                                    style={selectStyle}
                                                    size='large'
                                                    placeholder="请选择项目区域"
                                                    className="townName_select"
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
                                                    placeholder="请选择行业分类"
                                                >
                                                    {classifyOptions}
                                                </Select>,
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={16} style={{ marginLeft: 0, marginRight: 0, paddingLeft: 0, paddingRight: 0 }}>
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
                                            })(
                                                <Input placeholder='请输入计划投资金额' autoComplete='off' />
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={16} style={{ marginLeft: 0, marginRight: 0, paddingLeft: 0, paddingRight: 0 }}>
                                    <Col span={12}>
                                        <Form.Item label="项目创建时间">
                                            {getFieldDecorator('date', rangeConfig)
                                                (
                                                    <RangePicker
                                                        onChange={this.onChange}
                                                        placeholder={['开始时间', '结束时间']}
                                                    />
                                                )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="规划及内容">
                                            {getFieldDecorator('contents', {
                                            })(
                                                <Input placeholder='请输入规划及内容' autoComplete='off' />
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={16} style={{ marginLeft: 0, marginRight: 0, paddingLeft: 0, paddingRight: 0 }}>
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
                                <Row gutter={16} style={{ marginLeft: 0, marginRight: 0, paddingLeft: 0, paddingRight: 0 }}>
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
                                                <Upload {...props}>
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

const WrappedApp = Form.create({ name: 'coordinated' })(InsertProject)

export default WrappedApp
