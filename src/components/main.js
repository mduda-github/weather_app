import React from "react";

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
        fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&APPID=${API_KEY}&units=metric`)
        .then(result => {return result.json()})
        .then(reduce => {return this.reduceData(reduce)})
        .then(data => {console.log(data);return this.setState({forecast: data, flag: true, error: ""});})
    }

    reduceData = (data) => {
        const today = new Date()
        const weekForecast = [{city: data.city.name, country: data.city.country}];
        let reduced = Object.values(data.list.reduce((total, el, i) => ({
            ...total, [i]: {
                        date: el.dt_txt.slice(0,10), 
                        day: new Date(el.dt_txt).toLocaleDateString('en-UK', { weekday: 'short' }),
                        icon: el.weather[0].main,
                        temp: el.main.temp,
                        tempMin: el.main.temp_min,
                        tempMax: el.main.temp_max}
            }), []))
        for (let i = 0; i < 6; i++) {
            var day = new Date();
            day.setDate(today.getDate() + i );
            var dayForecast = reduced.filter(el => new Date(el.date).getDate() === day.getDate())
            weekForecast.push({
                day: this.findMode(dayForecast.map(el => el.day)),
                icon: this.findMode(dayForecast.map(el => el.icon)),
                temp: Number((dayForecast.reduce((accumulator, obj) => accumulator + obj.temp, 0) / dayForecast.length).toFixed(1)),
                tempMin: Number(Math.min.apply(null, dayForecast.map(el => el.tempMin)).toFixed(1)),
                tempMax: Number(Math.max.apply(null, dayForecast.map(el => el.tempMax)).toFixed(1))
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
            <form onSubmit={this.getData}>
                <input type="text" name="city" placeholder="City..."/>
                <input type="text" name="country" placeholder="Country..."/>
                <button>Get Weather</button>
            </form>
        );
    }

    renderWeather = (data) => {
        const weatherToday = data[1];
        const forecast = data.slice(2);
        return (
            <div>
                <div className="weatherToday">
                    <h1>{data[0].city}, {data[0].country}</h1>
                    <p>{weatherToday.temp}</p>
                    <p>{weatherToday.day}</p>
                    <p>{weatherToday.tempMin}  {weatherToday.tempMax}</p>
                </div>
                <button onClick={this.handleSearchClick}>Search</button>
                <div className="forecast">
                    {forecast.map((el,i) => {
                    return <div key={i}>
                        { el.day !== '' && <p>Day: { el.day }</p>}
                        { el.icon !== '' && <p>Icon: { el.icon }</p>}
                        { isNaN(el.temp) === false && <p>Temp: { el.temp }</p>}
                        { el.tempMin !== Infinity && <p>Temp Min: { el.tempMin }</p>}
                        { el.tempMax !== -Infinity && <p>Temp Max: { el.tempMax }</p>}
                    </div>
                })}
                </div>
            </div>
        );
    }

    render() {
        const { flag } = this.state;
        return (
            <div>
                {flag ? this.renderWeather(this.state.forecast) : this.renderSearch()}
            </div>
        );
    }
}


export default Main;