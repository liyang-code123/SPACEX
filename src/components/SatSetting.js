import React, {Component} from 'react';
import {Form, Button, InputNumber} from 'antd';

class SatSettingForm extends Component {

    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 11 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 13 },
            },
        };
        return (
            <Form {...formItemLayout} className="sat-setting" onSubmit={this.showSatellite}>
                <Form.Item label="Longitude(degrees)">
                    {
                        // this is HOC (Higher Order Component.)
                        getFieldDecorator("longitude", {
                            rules: [
                                {
                                    required: true,
                                    message: "Please input your Longitude",
                                }
                            ],
                        })(<InputNumber min={-180} max={180}
                                        style={{width: "100%"}}
                                        placeholder="Please input Longitude"
                        />)
                    }
                </Form.Item>

                <Form.Item label="Latitude(degrees)">
                    {
                        getFieldDecorator("latitude", {
                            rules: [
                                {
                                    required: true,
                                    message: "Please input your Latitude",
                                }
                            ],
                        })(<InputNumber placeholder="Please input Latitude"
                                        min={-90} max={90}
                                        style={{width: "100%"}}
                        />)
                    }
                </Form.Item>

                <Form.Item label="Elevation(meters)">
                    {
                        getFieldDecorator("elevation", {
                            rules: [
                                {
                                    required: true,
                                    message: "Please input your Elevation",
                                }
                            ],
                        })(<InputNumber placeholder="Please input Elevation"
                                        min={-413} max={8850}
                                        style={{width: "100%"}}
                        />)
                    }
                </Form.Item>

                <Form.Item label="Altitude(degrees)">
                    {
                        getFieldDecorator("altitude", {
                            rules: [
                                {
                                    required: true,
                                    message: "Please input your Altitude",
                                }
                            ],
                        })(<InputNumber placeholder="Please input Altitude"
                                        min={0} max={90}
                                        style={{width: "100%"}}
                        /> )
                    }
                </Form.Item>

                <Form.Item label="Duration(secs)">
                    {
                        getFieldDecorator("duration", {
                            rules: [
                                {
                                    required: true,
                                    message: "Please input your Duration",
                                }
                            ],
                        })(<InputNumber placeholder="Please input Duration" min={0} max={90} style={{width: "100%"}} />)
                    }
                </Form.Item>
                <Form.Item className="show-nearby">
                    <Button type="primary" htmlType="submit" style={{textAlign: "center"}}>
                        Find Nearby Satellite
                    </Button>
                </Form.Item>
            </Form>
        );
    }

    showSatellite = e => {
        // step 1: collect data from the forms;
        // step 2: pass data to Main component
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);
                this.props.onShow(values);
            }
        });
    }
}

// this is higher order component（HOC）; "Form.create" is HOC; it receive a component and return a new component.
// Form.create() return a function; because the parameter is a component.
// Form.create() -> function -> HOC == HOF - > fn(component);当一个函数返回函数的时候，如果这个函数的参数是组件，则这个函数是高阶函数，即高阶组件。
const SatSetting = Form.create({name: 'satellite-setting'})(SatSettingForm)

export default SatSetting;