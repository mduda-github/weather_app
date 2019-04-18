import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';


class Chart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartData: {
                labels: this.props.data.map(el => {return el.tempMin}).slice(2),
                datasets: [{
                borderColor: 'rgb(255, 255, 255)',
                data: this.props.data.map(el => {return el.temp}).slice(2),
                }]
            },
            chartOptions: {
                legend: {
                    display: false
                },
                elements: { 
                    point: { 
                        radius: 0 
                    } 
                },
                scales: {
                    yAxes: [{
                        display: false,
                        ticks: {
                            display: false,
                            max: Math.max.apply(null, this.props.data.map(el => {return el.tempMax}).slice(2)) + 2,
                            min: Math.min.apply(null, this.props.data.map(el => {return el.tempMin}).slice(2)) - 2,
                            stepSize: 1
                        },
                        gridLines: {
                            display:false
                        }  
                    }],
                    xAxes: [{
                        gridLines: {
                            display:false
                        },
                        display: false,
                        ticks: {
                            display: false,
                        },
                    }]
                }
            }
        } 
    }
    render() {
        console.log(this.state.chartData)
        return <div className="chart">
            <Line 
                data = {this.state.chartData}
                options= {this.state.chartOptions}
            />
        </div>
    }
}

export default Chart;