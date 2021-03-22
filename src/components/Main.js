import React, {Component} from 'react';
import axios from 'axios';
import SatSetting from './SatSetting';
import SatelliteList from './SatelliteList';
import {NEARBY_SATELLITE, SAT_API_KEY, STARLINK_CATEGORY} from "../constants";
import WorldMap from "./WorldMap";

class Main extends Component {
    constructor(){
        super();
        this.state = {
            satInfo: null,
            setting: null,
            satList: null,
            isLoadingList: false
        };
    }

    showNearbySatellite = (setting) => {
        this.setState({
            isLoadingList: true,
            setting: setting
        })
        this.fetchSatellite(setting);
    }


    fetchSatellite= (setting) => {
        const {latitude, longitude, elevation, altitude} = setting;
        const url = `/api/${NEARBY_SATELLITE}/${latitude}/${longitude}/${elevation}/${altitude}/${STARLINK_CATEGORY}/&apiKey=${SAT_API_KEY}`;

        this.setState({
            isLoadingList: true
        });

        // this is promise.
        axios.get(url)
            .then(response => {
                console.log(response.data)
                this.setState({
                    satInfo: response.data,
                    isLoadingList: false
                })
            })
            .catch(error => {
                console.log('err in fetch satellite -> ', error);
            })
    }

    showMap = selected => {
        // call back function.
        this.setState(preState => ({
            ...preState,
            satList: [...selected]
        }));
    };

    render() {
        const { satInfo, isLoadingList, satList, setting } = this.state;
        return (
            <div className='main'>
                <div className="left-side">
                    <SatSetting onShow={this.showNearbySatellite}/>
                    <SatelliteList satInfo={satInfo}
                                   isLoad={isLoadingList}
                                   onShowMap={this.showMap}
                    />
                </div>
                <div className="right-side">
                    <WorldMap satData={satList} observerData ={setting}/>
                </div>
            </div>
        );
    }
}

export default Main;
