import React, {Component} from 'react';
import { Row, Col , Spin } from 'antd';
import axios from "axios";

import SatSetting from "./SatSetting";
import SatelliteList from "./SatelliteList";
import WorldMap from "./WorldMap";

import { SAT_API_KEY, STARLINK_CATEGORY, NEARBY_SATELLITE} from "../constants";

class Main extends Component {
    state = {
        setting: null,
        satInfo: null,
        satList: null,
        isLoadingList: false
    }

    render() {
        const { isLoadingList, satInfo , satList, setting} = this.state;
        return (
            <Row className="main">
                <Col span={8}
                     className="left-side">
                    <SatSetting onShow={this.showNearbySatellite}/>
                    <SatelliteList satInfo={satInfo}
                                   isLoad={isLoadingList}
                                   onShowMap={this.showMap}/>
                </Col>
                <Col span={16} className="right-side">
                    <WorldMap satData={satList} observerData={setting}/>
                </Col>
            </Row>
        );
    }

    showMap = selected => {
        console.log(selected);
        // setState will re-render
        this.setState(preState => ({
            ...preState,
            satList: [...selected]
        }))
    }
    showNearbySatellite = setting => {
        console.log(setting);
        this.setState({setting: setting})
        this.fetchSatellite(setting);
    }

    fetchSatellite = setting => {
        // step1: extract api paras from the setting
        const {latitude, longitude, elevation, altitude} = setting;

        // step2: send request to fetch data
        const url = `/api/${NEARBY_SATELLITE}/${latitude}/${longitude}/${elevation}/${altitude}/${STARLINK_CATEGORY}/&apiKey=${SAT_API_KEY}`;

        // step3: add spin
        this.setState({isLoadingList: true});

        axios.get(url).then( response => {
            console.log(response);
            // step4: remove spin
            this.setState({
                satInfo: response.data,
                isLoadingList: false});
        }).catch( error => {
            console.log('err in fetch satellite list -> ',error);
            // step4: remove spin
            this.setState({isLoadingList: false});
        })
    }
}

export default Main;