import React from 'react';

import { faBolt, faCloudRain, faCloudShowersHeavy, faSnowflake, faCloud, faSun} from '@fortawesome/free-solid-svg-icons'

import Weather from './weather';
import Search from './search';

var moment = require('./../../node_modules/moment/moment.js');


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

        if (city && country) {
            fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&APPID=${API_KEY}&units=metric`)
            .then(result => {
                if (result.ok) {
                    return result.json()
                } else {
                    throw new Error("Connection error!");
                }})
            .then(reduce => {console.log(reduce);return this.reduceData(reduce)})
            .then(data => {return this.setState({forecast: data, flag: true, error: ""});})
            .catch(() => this.setState({forecast: [], error: 'City is not found.'}));
        } else {
            this.setState({
                error: 'Both fields must be filled out.'
            })
        }
      
    }

    reduceData = (data) => {
        const weekForecast = [{city: data.city.name, country: data.city.country}];
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
        let reduced = Object.values(data.list.reduce((total, el, i) => ({
            ...total, [i]: {
                        date: el.dt_txt.slice(0,10), 
                        day: moment(el.dt_txt).format('dddd'),
                        icon: el.weather[0].main,
                        temp: el.main.temp,
                        tempMin: el.main.temp_min,
                        tempMax: el.main.temp_max}
            }), []))
        for (let i = 0; i < 6; i++) {
            let today = moment().add(i, 'days').format('dddd');
            // eslint-disable-next-line
            var dayForecast = reduced.filter(el => el.day === today)
            weekForecast.push({
                day: this.findMode(dayForecast.map(el => el.day)),
                icon: matchIcon(this.findMode(dayForecast.map(el => el.icon))),
                temp: Number((dayForecast.reduce((accumulator, obj) => accumulator + obj.temp, 0) / dayForecast.length).toFixed()),
                tempMin: Number(Math.min.apply(null, dayForecast.map(el => el.tempMin)).toFixed()),
                tempMax: Number(Math.max.apply(null, dayForecast.map(el => el.tempMax)).toFixed())
            })
        }
        return weekForecast;
    }

    /* credits to ... */
    findMode = (input) => {
        if (input.length > 0) {
          let counted = input.reduce((acc, curr) => { 
            if (curr in acc) {
                acc[curr]++;
            } else {
                acc[curr] = 1;
            }
            return acc;
          }, {});
          let mode = Object.keys(counted).reduce((a, b) => counted[a] > counted[b] ? a : b);
          return mode;
        } else {
          return '';
        }
    }

    handleSearchClick = () => {
        this.setState({forecast: [], flag: false})
    }

    render() {
        const { flag } = this.state;
        return (
            <div className="container">
                {
                flag 
                    ? <Weather data={this.state.forecast} click={this.handleSearchClick}/>
                    : <Search getData={this.getData} error={this.state.error}/>
                }
            </div>
        );
    }
}


export default Main;