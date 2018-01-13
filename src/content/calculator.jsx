
import * as React from 'react';

import { Form, Input, Tooltip, Icon, Cascader, Row, Col, Button, AutoComplete } from 'antd';
const FormItem = Form.Item;
const AutoCompleteOption = AutoComplete.Option;

const { ipcRenderer } = window.require('electron');

const residences = [{
    value: 'zhejiang',
    label: '浙江',
    children: [{
        value: 'hangzhou',
        label: '杭州',
        children: [{
            value: 'xihu',
            label: '西湖',
        }],
    }],
}, {
    value: 'jiangsu',
    label: '江苏',
    children: [{
        value: 'nanjing',
        label: '南京',
        children: [{
            value: 'zhonghuamen',
            label: '十三环',
        }],
    }],
}];

class Calculator extends React.Component {
    constructor() {
        super();
        this.state = {
            confirmDirty: false,
            cityResults: [],
            city: {},
        };
    }

    cities = []

    componentDidMount() {
        ipcRenderer.send('city:init');
        ipcRenderer.on('city:initResult', (event, arg) => {
            console.log(arg);
            this.cities = arg;
        });
    }

    handleInputCity = (value) => {
        const cityResults = this.cities.filter((city) => {
            return (city.name.indexOf(value) !== -1 || city.areaCityName.indexOf(value) !== -1);
        });
        this.setState({ cityResults });
    }

    handleSelectCity = (city) => {
        console.log(city);
        ipcRenderer.send('city:search', city);
        ipcRenderer.once('city:result', (e, _city) => {
            console.log(_city);
            this.setState({
                city: _city,
            });
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
            console.log(1321321);
        });
    }


    render() {
        const { getFieldDecorator } = this.props.form;
        const { cityResults, city } = this.state;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };

        const cityOptions = cityResults.map(city => (
            <AutoCompleteOption key={city.name}>{city.name}</AutoCompleteOption>
        ));
        const cityInfo = city.name ? <span>当前选择：{city.name}，区:{city.area}，类：{city.cat}</span> : null;

        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label={(
                        <span>
                            城市&nbsp;
                            <Tooltip title="输入城市名，从下拉框选择你想要的那一只">
                                <Icon type="question-circle-o" />
                            </Tooltip>
                        </span>
                    )}
                    extra={cityInfo}
                >
                    {getFieldDecorator('email', {
                        rules: [{
                            required: true, message: '请输入',
                        }]
                    })(<AutoComplete
                        dataSource={cityOptions}
                        onChange={this.handleInputCity}
                        onSelect={this.handleSelectCity}
                        placeholder="城市"
                        allowClear={true}
                    >
                        <Input />
                    </AutoComplete>)}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={(
                        <span>
                            参数2&nbsp;
                            <Tooltip title="参数提示收拾收拾收拾收拾?">
                                <Icon type="question-circle-o" />
                            </Tooltip>
                        </span>
                    )}
                >
                    {getFieldDecorator('nickname', {
                        rules: [{ required: true, message: '请输入', whitespace: true }],
                    })(<Input />)}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="地点"
                >
                    {getFieldDecorator('residence', {
                        initialValue: ['zhejiang', 'hangzhou', 'xihu'],
                        rules: [{ type: 'array', required: true, message: '请选择' }],
                    })(<Cascader options={residences} />)}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="参数n"
                >
                    {getFieldDecorator('captcha', {
                        rules: [{ required: true, message: '请输入' }],
                    })(<Input />)}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">开始计算</Button>
                </FormItem>
            </Form>
        );
    }
}

const WrappedCalculator = Form.create()(Calculator);

export default WrappedCalculator; 