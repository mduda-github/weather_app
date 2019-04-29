import React from "react";
import Chart from './chart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

class Weather extends React.Component {
    
    render() {
        const weatherToday = this.props.data[1];
        const forecast = this.props.data.slice(2);
        return (
            <div className="info">
                <div className="row--top">
                    <div className="weatherToday">
                        <p>{this.props.data[0].city}, {this.props.data[0].country}</p>
                        {isNaN(weatherToday.temp) === false && <h1>{weatherToday.temp}&deg;</h1>}
                        {weatherToday.day !== '' && <p>{weatherToday.day}</p>}
                        <p>
                            {weatherToday.tempMin !== Infinity && <span>{weatherToday.tempMin}&deg;</span>}
                            {weatherToday.tempMax !== -Infinity && <span>{weatherToday.tempMax}&deg;</span>}
                        </p>
                    </div>
                </div>
                <div className="row--bottom">
                    <div className="button" onClick={this.props.click}><FontAwesomeIcon icon={faSearch} /></div>
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
                        <Chart data={this.props.data}/>
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
}


export default Weather;