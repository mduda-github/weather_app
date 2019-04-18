import React from 'react';
import Chart from './chart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faSearch, faBolt, faCloudRain, faCloudShowersHeavy, faSnowflake, faCloud, faSun} from '@fortawesome/free-solid-svg-icons'

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
            fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&APPID=${API_KEY}&units=metric`)
            .then(result => {
                if (result.ok) {
                    return result.json()
                } else {
                    throw new Error("Wystąpił błąd połączenia!");
                }})
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
        const today = new Date()
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
                        day: new Date(el.dt_txt).toLocaleDateString('en-UK', { weekday: 'long' }),
                        icon: el.weather[0].main,
                        temp: el.main.temp,
                        tempMin: el.main.temp_min,
                        tempMax: el.main.temp_max}
            }), []))
        for (let i = 0; i < 6; i++) {
            var day = new Date();
            day.setDate(today.getDate() + i );
            // eslint-disable-next-line
            var dayForecast = reduced.filter(el => new Date(el.date).getDate() === day.getDate())
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

    renderSearch = () => {
        return (
            <div className="search">
                <p>Please enter city and country:</p>
                <form onSubmit={this.getData}>
                    <input type="text" name="city" placeholder="City..."/>
                    <input type="text" name="country" placeholder="Country..."/>
                    {this.state.error && <p>{this.state.error}</p>}
                    <button><FontAwesomeIcon icon={faArrowRight} /></button>
                </form>
            </div>
        );
    }

    renderWeather = (data) => {
        const weatherToday = data[1];
        const forecast = data.slice(2);
        return (
            <div className="info">
                <div className="row--top">
                    <div className="weatherToday">
                        <p>{data[0].city}, {data[0].country}</p>
                        {isNaN(weatherToday.temp) === false && <h1>{weatherToday.temp}&deg;</h1>}
                        {weatherToday.day !== '' && <p>{weatherToday.day}</p>}
                        <p>
                            {weatherToday.tempMin !== Infinity && <span>{weatherToday.tempMin}&deg;</span>}
                            {weatherToday.tempMax !== -Infinity && <span>{weatherToday.tempMax}&deg;</span>}
                        </p>
                    </div>
                </div>
                <div className="row--bottom">
                    <div className="button" onClick={this.handleSearchClick}><FontAwesomeIcon icon={faSearch} /></div>
                    <div className="forecast forecast__top">
                        {forecast.map((el,i) => {
                        return <div key={i}>
                            { el.day !== '' && <p>{ el.day.slice(0,3) }</p>}
                            { el.icon !== '' && <p><FontAwesomeIcon icon={el.icon} /></p>}
                            { el.tempMax !== -Infinity && <p>{ el.tempMax }&deg;</p>}
                        </div>
                    })}
                    </div>
                    <div className="chart">
                        <Chart data={data}/>
                    </div>
                    <div className="forecast forecast__bottom">
                        {forecast.map((el,i) => {
                        return <div key={i}>
                            { el.tempMin !== Infinity && <p>{ el.tempMin }&deg;</p>}
                        </div>
                    })}
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const { flag } = this.state;
        return (
            <div className="container">
                {flag ? this.renderWeather(this.state.forecast) : this.renderSearch()}
            </div>
        );
    }
}


export default Main;