import React, { Component } from "react";
import { List, Avatar, Button, Checkbox, Spin } from "antd";
import satellite from "../assets/images/satellite.svg";

class SatelliteList extends Component {
    state = {
        selected: []
    }

    onChange = e => {
        // step1: satellite checked?
        const { dataInfo, checked } = e.target;

        // step 2: get selected list
        const { selected } = this.state;

        // step 3: get new selected list
        const list = this.addOrRemove(dataInfo, checked, selected);

        // step 4: update selected satellite list
        this.setState({
            selected: list
        });
    };

    addOrRemove = (item, status, list) => {
        // case 1: checked is true;
        // -> item not in the list -> add it
        // -> item is in the list -> do nothing

        // case 2: checked is false
        // -> item is in the list -> remove it
        // -> item is not in the list -> do nothing

        // som can traverse array, if it is in the array, return true; otherwise, return false.
        const found = list.some(entry => entry.satid === item.satid);
        if (status && !found) {
            list.push(item);
            // list =[...list, dataInfo]
        }

        if (!status && found) {
            list = list.filter(entry => {
                return entry.satid !== item.satid;
            });
        }
        // console.log(list)
        return list;
    };

    // onShowSatMap = () => {
    //     this.props.onShowMap(this.state.selected);
    // };

    onShowSatMap = () => {
        const { selected } = this.state;
        this.props.onShowMap(selected);
    }

    render() {
        const satList = this.props.satInfo ? this.props.satInfo.above : [];
        const { isLoad } = this.props;
        const { selected } = this.state;

        return (
            <div className="sat-list-box">
                <Button
                    className="sat-list-btn"
                    size="large"
                    disabled={selected.length === 0}
                    onClick={this.onShowSatMap}
                >
                    Track on the map
                </Button>
                <hr />

                {isLoad ? (
                    <div className="spin-box">
                        <Spin tip="Loading..." size="large" />
                    </div>
                ) : (
                    <List
                        className="sat-list"
                        itemLayout="horizontal"
                        size="small"
                        dataSource={satList}
                        renderItem={item => (
                            <List.Item
                                actions={[
                                    <Checkbox dataInfo={item} onChange={this.onChange} />
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar size={50} src={satellite} />}
                                    title={<p>{item.satname}</p>}
                                    description={`Launch Date: ${item.launchDate}`}
                                />
                            </List.Item>
                        )}
                    />
                )}
            </div>
        );
    }
}

export default SatelliteList;
