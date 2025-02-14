import React, { Component } from "react";
import axios from "axios";
import { Spin } from "antd";
import { feature } from "topojson-client";
import { geoKavrayskiy7 } from "d3-geo-projection";
import { geoGraticule, geoPath } from "d3-geo";
import { select as d3Select } from "d3-selection";
import { schemeCategory10 } from "d3-scale-chromatic";
import * as d3Scale from "d3-scale";
import { timeFormat as d3TimeFormat } from "d3-time-format";

import {
    WORLD_MAP_URL,
    SATELLITE_POSITION_URL,
    SAT_API_KEY
} from "../constants";

const width = 960;
const height = 600;

class WorldMap extends Component {
    constructor(){
        super();
        this.state = {
            isLoading: false,
            isDrawing: false
        };
        this.map = null;
        this.color = d3Scale.scaleOrdinal(schemeCategory10);
        this.refMap = React.createRef();
        this.refTrack = React.createRef();
    }

    componentDidMount() {
        axios.get(WORLD_MAP_URL)
            .then(res => {
                const { data } = res;
                const land = feature(data, data.objects.countries).features;
                this.generateMap(land);
            })
            .catch(e => console.log('err in fetch world map data ', e))
    }

    generateMap(land) {
        const projection = geoKavrayskiy7()
            .scale(170)
            .translate([width / 2, height / 2])
            .precision(.1)

        // console.log(projection)
        // map
        const canvas = d3Select(this.refMap.current)
            .attr("width", width)
            .attr("height", height)

        // satellite track
        const canvas2 = d3Select(this.refTrack.current)
            .attr("width", width)
            .attr("height", height)


        let context = canvas.node().getContext("2d");
        let context2 = canvas2.node().getContext("2d");

        const graticule = geoGraticule();
        let path = geoPath().projection(projection).context(context);

        land.forEach( ele => {
            // country
            context.fillStyle = '#B3DDEF';
            context.strokeStyle = '#000';
            context.globalAlpha = 0.7;
            context.beginPath();
            path(ele);
            context.fill();
            context.stroke();

            // latitude and longitude (graticule)
            context.strokeStyle = 'rgba(220, 220, 220, 0.1)';
            context.beginPath();
            path(graticule());
            context.lineWidth = 0.1;
            context.stroke();

            // border of the map top and bottom
            context.beginPath();
            context.lineWidth = 0.5;
            path(graticule.outline());
            context.stroke();

        })

        this.map = {
            projection: projection,
            graticule: graticule,
            context: context,
            context2: context2,
        }

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log(prevProps)
        if (prevProps.satData !== this.props.satData) {
            const {latitude, longitude, elevation, duration} = this.props.observerData;
            const endTime = duration * 60; // speed

            // generate all satellite urls
            const urls = this.props.satData.map( sat => {
                const { satid } = sat;
                const url = `/api/${SATELLITE_POSITION_URL}/${satid}/${latitude}/${longitude}/${elevation}/${endTime}/&apiKey=${SAT_API_KEY}`;

                return axios.get(url);
            });


            //  promise链式调用
            // es 6.0 it can use async and await.
            axios
                .all(urls)
                .then(
                    axios.spread((...args) => {
                        return args.map(item => item.data);
                    })
                )
                .then(res => {
                    this.setState({
                        isLoading: false,
                        isDrawing: true
                    });

                    if (!prevState.isDrawing) {
                        this.track(res);
                    } else {
                        const oHint = document.getElementsByClassName("hint")[0];
                        oHint.innerHTML =
                            "Please wait for these satellite animation to finish before selection new ones!";
                    }
                })
                .catch(e => {
                    console.log("err in fetch satellite position -> ", e.message);
                });
        }
    }


    track = data => {
        if (!data[0].hasOwnProperty("positions")) {
            throw new Error("no position data");
            return;
        }

        // get amount of positions of selected satellite
        const len = data[0].positions.length;
        const { duration } = this.props.observerData;
        const { context2 } = this.map;

        // record current time
        let now = new Date();
        let i = 0;

        // every 1000ms, draw a dot
        let timer = setInterval(() => {
            // record current draw time
            let ct = new Date();

            let timePassed = i === 0 ? 0: ct - now;
            let time = new Date(now.getTime() + 60 * timePassed);

            context2.clearRect(0, 0, width, height);

            context2.font = "bold 14px sans-serif";
            context2.fillStyle = "#333";
            context2.textAlign = "center";
            context2.fillText(d3TimeFormat(time), width / 2, 10);

            // case 1: completed
            if (i >= len) {
                clearInterval(timer);
                return;
            }

            // case 2: continue
            data.forEach( sat => {
                const { info, positions } = sat;
                console.log(info)
                this.drawSat(info, positions[i])
            });

            i += 60;
        }, 1000);
    }

    drawSat = (sat, pos) => {
        const { satlongitude, satlatitude } = pos;
        if(!satlongitude || !satlatitude) {
            return;
        };

        const { satname} = sat;
        // regular expression: only use number to represent the satellite name
        const nameWithNumber = satname.match(/\d+/g).join("");
        const { projection, context2} = this.map;
        const xy = projection([satlongitude, satlatitude]);

        context2.fillStyle = this.color(nameWithNumber);
        context2.beginPath();
        // this is a definition for drawing a circle.
        context2.arc(xy[0], xy[1], 4, 0, 2 * Math.PI);
        context2.fill();

        context2.font = "bold 11px sans-serif";
        context2.textAlign = "center";
        context2.fillText(nameWithNumber, xy[0], xy[1] + 14);

    }

    render() {
        const { isLoading } = this.state;
        return (
            <div className = "map-box">
                {isLoading ? (
                    <div className="spinner">
                        <Spin tip="Loading..." size="large" />
                    </div>
                ) : null}
                <canvas className = "map" ref={this.refMap} />
                <canvas className="track" ref={this.refTrack} />
                <div className="hint" />
            </div>
        );
    }
}

export default WorldMap;