import React, {Component} from 'react';
import { Button, Spin, List, Avatar, Checkbox } from "antd";

import satellite from '../assets/images/satellite.svg';

class SatelliteList extends Component {
    state = {
        selected: []
    }
    render() {
        const satList = this.props.satInfo ? this.props.satInfo.above : [];
        const { isLoad } = this.props;
        return (
            <div className="sat-list-box">
                <div className="btn-container">
                    <Button className="sat-list-btn"
                            type="primary"
                            onClick={this.onShowSatMap}
                    >Track on the map</Button>
                </div>
                <hr />
                {
                    isLoad ?
                        <div className="spin-box">
                            <Spin tip="Loading..."/>
                        </div>
                        :
                        <List
                              className="sat-list"
                              itemLayout="horizontal"
                              dataSource={satList}
                              renderItem={ item => (
                                  <List.Item
                                      actions={[<Checkbox dataInfo={item} onChange={this.onChange}/>]}
                                  >
                                      <List.Item.Meta
                                          avatar={<Avatar src={satellite} size="large"/>}
                                          title={<p>{item.satname}</p>}
                                          description={`Launch date: ${item.launchDate}`}
                                      />
                                  </List.Item>
                              )}

                        />
                }
            </div>
        );
    }

    onShowSatMap = () => {
        this.props.onShowMap(this.state.selected);
    }

    onChange = (e) => {
        console.log(e.target);
        // get sat info and check status
        const { dataInfo, checked} = e.target;
        const { selected } = this.state;
        // add or remove the sat to selected satList
        const list = this.addOrRemove(dataInfo, checked, selected);
        // satState -> selected
        this.setState({selected: list});
    }

    addOrRemove = (item, status, list) => {
        // case 1: checked status is true
        // - if item not in list => add to list
        // - if item is in the list => do nothing

        // case 2: check status is false
        // - if item not in list => do nothing
        // - if item is in the list => remove to list

        const found = list.some( entry => entry.satid === item.satid);
        if (status && !found) {
            list = [...list, item]; // return a new list
        }

        if (!status && found) {
            list = list.filter( entry => {
                return entry.satid !== item.satid;
            });
        }
        return list;
    };
}

export default SatelliteList;