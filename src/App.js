import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { select as d3select, mouse as d3mouse } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { extendObservable, transaction, computed } from 'mobx';
import { observer } from 'mobx-react';

import Pythagoras from './Pythagoras';

class App extends Component {
    constructor() {
        super();
        extendObservable(this, {
            currentMax: 0,
            x: 0,
            y: 0,
            heightFactor: computed(() => this.scaleFactor(this.y)),
            lean: computed(() => this.scaleLean(this.x)),
        });

        this.baseW = 80;
        this.svg = {
            width: 1280,
            height: 600
        };
        this.realMax = 11;
        this.scaleFactor = scaleLinear()
            .domain([this.svg.height, 0])
            .range([0, .8]);

        this.scaleLean = scaleLinear()
            .domain([0, this.svg.width/2, this.svg.width])
            .range([.5, 0, -.5]);
    }

    componentDidMount() {
        d3select(this.refs.svg).on("mousemove", this.onMouseMove.bind(this));

        this.next();
    }

    next() {
        if (this.currentMax < this.realMax) {
            this.currentMax += 1;
            setTimeout(this.next.bind(this), 500);
        }
    }

    update(x, y) {
        transaction(() => {
            this.x = x;
            this.y = y;
        })
    }

    // Throttling doesn't seem to have much impact when using mobx
    // so removed from here, but might be just the testing setup
    onMouseMove(event) {
        const [x, y] = d3mouse(this.refs.svg);
        this.update(x,y);
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>This is a dancing Pythagoras tree</h2>
                </div>
                <p className="App-intro">
                    <svg width={this.svg.width} height={this.svg.height} ref="svg"
                         style={{border: "1px solid lightgray"}}>

                        <Pythagoras w={this.baseW}
                                    h={this.baseW}
                                    heightFactor={this.heightFactor}
                                    lean={this.lean}
                                    x={this.svg.width/2-40}
                                    y={this.svg.height-this.baseW}
                                    lvl={0}
                                    maxlvl={this.currentMax}/>

                    </svg>
                </p>
            </div>
        );
    }
}

export default observer(App);
