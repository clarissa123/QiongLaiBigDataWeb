import React, {Component} from 'react'
import {Result, Button} from 'antd';
import {Link} from 'react-router-dom';
import './404.less'

export default class  extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {

    }

    render() {
        return (
            <Result
                status="404"
                title="404"
                subTitle="对不起，该页不存在"
                extra={<Button type="primary" onClick={() => {
                    this.props.history.push("/videoSurveillance")
                }}><Link to='/videoSurveillance'>返回首页</Link></Button>}
            />
        )
    }
}
