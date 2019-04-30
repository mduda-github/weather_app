import React from 'react';
import { faBolt, faCloudRain, faCloudShowersHeavy, faSnowflake, faCloud, faSun } from '@fortawesome/free-solid-svg-icons'
import Weather from './weather';
import Search from './search';

const moment = require('./../../node_modules/moment/moment.js');
const API_KEY = '3d76823d3b8852cd38d0ca9b1fccd7ff';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            forecast: [],
            flag: false
        }
    }
    getData = async (e) => {
        e.preventDefault();
        const city = e.target.elements.city.value;
        const country = e.target.elements.country.value;

        /* input validation; fetching data and catching potential errors */
        if (city && country) {
            fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&APPID=${API_KEY}&units=metric`)
            .then(result => {
                if (result.ok) {return result.json();}
                else {throw new Error("Connection error!");}})
            .then(reduce => {return this.reduceData(reduce)})
            .then(data => {return this.setState({forecast: data, flag: true, error: ""});})
            .catch(() => this.setState({forecast: [], error: 'City is not found.'}));
        } else {
            this.setState({
                error: 'Both fields must be filled out.'
            })
        }
    }

    reduceData = (data) => {
        /* preparing basic information */
        const weekForecast = [{city: data.city.name, country: data.city.country}];

        /* function that matches weather description with appropriate icon */
        const matchIcon = (icon) => {
            switch (icon) {
                case 'Thunderstorm': return faBolt;
                case 'Drizzle': return faCloudRain;
                case 'Rain': return faCloudShowersHeavy;
                case 'Snow': return faSnowflake;
                case 'Clouds': return faCloud;
                case 'Clear': return faSun;
                default: return '';
            }
        }
        /* function that returns the most frequent element in array */
        const findMode = (input) => {
            let counted = input.reduce((accu, obj) => { 
                if (obj in accu) {
                    accu[obj]++;
                } else {
                    accu[obj] = 1;
                }
                return accu;
            }, {});
            let mode = Object.keys(counted).reduce((a, b) => counted[a] > counted[b] ? a : b);
            return mode;
        }

        /* reducing data - leaving only information that will be used */
        let reduced = Object.values(data.list.reduce((total, el, i) => ({
            ...total, [i]: {
                        date: el.dt_txt.slice(0,10), 
                        day: moment(el.dt_txt).format('dddd'),
                        icon: el.weather[0].main,
                        temp: el.main.temp,
                        tempMin: el.main.temp_min,
                        tempMax: el.main.temp_max}
            }), []))

        /* preparing forecast for next five days */
        for (let i = 0; i < 6; i++) {
            let today = moment().add(i, 'days').format('dddd');
            /* grouping information based on specific day; finding min, max and average temperatures; preparing icon */
            let dayForecast = reduced.filter(el => el.day === today)
            weekForecast.push({
                day: findMode(dayForecast.map(el => el.day)),
                icon: matchIcon(findMode(dayForecast.map(el => el.icon))),
                temp: Number((dayForecast.reduce((accu, obj) => accu + obj.temp, 0) / dayForecast.length).toFixed()),
                tempMin: Number(Math.min.apply(null, dayForecast.map(el => el.tempMin)).toFixed()),
                tempMax: Number(Math.max.apply(null, dayForecast.map(el => el.tempMax)).toFixed())
            })
        }
        return weekForecast;
    }

    /* resetting results and displaying search screen */
    handleSearchClick = () => {
        this.setState({forecast: [], flag: false})
    }

    /* conditional rendering - search or result screen whether the data is present */
    render() {
        const { flag } = this.state;
        return (
                <div className="container">
                    {flag 
                        ? <Weather data={this.state.forecast} click={this.handleSearchClick}/>
                        : <Search getData={this.getData} error={this.state.error}/>}
                </div>
        );
    }
}


export default Main;