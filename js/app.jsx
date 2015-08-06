/*
    TODO:   Templates (Dark/Light)       
*/

var $ = require("jquery");
var React = require("react");
var TimerMixin = require("react-timer-mixin");
var Backbone = require("backbone");

var moment = require("moment");
    moment = require("moment-timezone");

var storageAffix = "newtab-";
moment.tz.add('Europe/Helsinki');

function getData(name) {
    var data = localStorage[storageAffix + name];
    return data != undefined ? JSON.parse(data) : null;
}

function setData(name, data) {
    delData(name);
    localStorage[storageAffix + name] = JSON.stringify(data);
}

function delData(name)
{
    localStorage.removeItem(storageAffix + name);
}

var Settings = React.createClass({
    getInitialState: function() {
        return {
            name: 'Old chump',
            city: 'Helsinki',
            showWeather: true,
            showTemperature: true,
            showWindSpeed: false,
            darkTheme: true
        };
    },

    componentWillMount: function() {
        var data = getData("user");
        if (data != null) {
            this.setState(data);
        }
    },

    handleClick: function(e) {
        setData("user", this.state);
    },

    handleChange: function(event) {
        var data = {
            name: event.target.id == 'name' ?  event.target.value : this.state.name,
            city: event.target.id == 'city' ?  event.target.value : this.state.city,
            showWeather: event.target.id == 'showWeather' ?  event.target.checked : this.state.showWeather,
            showTemperature: event.target.id == 'showTemperature' ?  event.target.checked : this.state.showTemperature,
            showWindSpeed: event.target.id == 'showWindSpeed' ?  event.target.checked : this.state.showWindSpeed,
            darkTheme: event.target.id == 'darkTheme' ?  event.target.checked : this.state.darkTheme,
        };

        this.setState(data);
    },

    toggleWeather: function() {
        this.setState({showWeather: !this.state.showWeather});
    },

    toggleTemperature: function() {
        this.setState({showTemperature: !this.state.showTemperature});
    },

    toggleWindSpeed: function() {
        this.setState({showWindSpeed: !this.state.showWindSpeed});
    },

    toggleDarkTheme: function() {
        this.setState({darkTheme: !this.state.darkTheme});
    },

    render: function() {
        return (
            <div id="settings">
                <header>
                    <h1>Settings</h1>
                    <p className="lead">You may use the fields below to personalize your NewTab.</p>
                    <hr/>
                </header>
                <section className="settings-area">                    
                    <h2>Basic</h2>
                    <div className="form-group">
                        <div className="form-item">
                            <label htmlFor="name">Your name</label>
                            <input id="name" value={this.state.name} onChange={this.handleChange} placeholder="Your name." type="text"/>
                        </div>
                        <div className="form-item form-space-after">
                            <label htmlFor="city">City</label>
                            <input id="city" value={this.state.city} onChange={this.handleChange} placeholder="City to provide a forecast for." type="text"/>
                        </div>
                    </div>
                </section>
                <section className="settings-area">
                    <h2>Settings</h2>
                    <div className="form-group">
                        <h3>Weather</h3>
                        <div className="form-item form-space-after">
                            <label htmlFor="showWeather">Show Weather</label>
                            <div className="onoffswitch">
                                <input className="onoffswitch-checkbox" id="showWeather" checked={this.state.showWeather} type="checkbox"/>
                                <label onClick={this.toggleWeather} className="onoffswitch-label" htmlFor="myonoffswitch">
                                    <span className="onoffswitch-inner"></span>
                                    <span className="onoffswitch-switch"></span>
                                </label>
                            </div>
                        </div>
                        <div className="form-item form-space-after">
                            <label htmlFor="showTemperature">Show Forecast</label>
                            <div className="onoffswitch">
                                <input className="onoffswitch-checkbox" id="showTemperature" checked={this.state.showTemperature} type="checkbox"/>
                                <label onClick={this.toggleTemperature} className="onoffswitch-label" htmlFor="myonoffswitch">
                                    <span className="onoffswitch-inner"></span>
                                    <span className="onoffswitch-switch"></span>
                                </label>
                            </div>
                        </div>
                        <div className="form-item">
                            <label htmlFor="showWindSpeed">Show Wind Speed</label>
                            <div className="onoffswitch">
                                <input className="onoffswitch-checkbox" id="showWindSpeed" checked={this.state.showWindSpeed} type="checkbox"/>
                                <label onClick={this.toggleWindSpeed} className="onoffswitch-label" htmlFor="myonoffswitch">
                                    <span className="onoffswitch-inner"></span>
                                    <span className="onoffswitch-switch"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="form-group form-group-seamless">
                        <h3>General</h3>
                        <div className="form-item form-space-after">
                            <label htmlFor="darkTheme">Theme</label>
                            <div className="onoffswitch">
                                <input className="onoffswitch-checkbox" id="darkTheme" checked={this.state.darkTheme} type="checkbox"/>
                                <label onClick={this.toggleDarkTheme} className="onoffswitch-label" htmlFor="myonoffswitch">
                                    <span className="onoffswitch-inner onoffswitch-theme-inner"></span>
                                    <span className="onoffswitch-switch"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </section>
                <section>
                    <h2>Actions</h2>
                    <div className="form-group">
                        <a href="/" className="button" onClick={this.handleClick}>Save</a>
                    </div>
                </section>
            </div>
        );
    }
});

var Background = React.createClass({

    mixins: [TimerMixin],

    getInitialState: function() {
        return {
            delay: 7500,
            loaded: false,
            src: ''
        };
    },

    componentDidMount: function() {
        console.log('Background loaded.');
        this.initImage(); // load first time without delay
        this.setTimer();
    },

    componentWillUnmount: function() {
        console.log('bg unmounted');
    },

    initImage: function() {
        $('img').fadeOut(1000, function() {
            //preload image
            var img = new window.Image();
            img.onload = this.onImageLoad;
            img.src = this.randomImage();
        }.bind(this));
    },

    // render loop
    setTimer: function() {
        this.setInterval(
          function () { this.initImage(); }.bind(this),
          this.state.delay
        );
    },

    onImageLoad: function(event) {
        this.setState({loaded: true, src: event.target.src});
        $('img').stop().fadeIn(1000);
    },

    random: function() {
        return Math.floor(Math.random() * (59)) + 1;
    },

    randomImage : function() {
        var imgSrc = "http://res.cloudinary.com/jakke/image/upload/c_crop,g_center,h_1240,w_1920/v1438865317/NewTab/" + this.random() + ".jpg";
        return imgSrc;
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        return nextState.loaded && nextState.src != null ;//nextState.loaded;
    },

    render: function() {
        return <img id="background" src={this.state.src}/>;
    }
});

var Clock = React.createClass({
    mixins: [TimerMixin],

    getInitialState: function() {
        return {
            currentTime: moment().format("HH:mm:ss")
        };
    },

    componentDidMount: function() {
        console.log('Clock loaded.');
        this.setTimer();
    },

    checkTime: function(i) {
        if (i<10) {i = "0" + i};  // add zero in front of numbers < 10
        return i;
    },

    tick: function() {
        this.setState({
            currentTime: moment().format("HH:mm:ss")
        });
    },

    setTimer: function() {
        this.setInterval(
          function () { this.tick(); }.bind(this),
          500
        );
    },

    render: function() {
        return (
            <div id="clock">
                <div id="dial">{this.state.currentTime}</div>
                <span id="greeting">Hello {this.props.name}</span> <a href="#/settings" className="edit">(settings)</a>
            </div>

        );
    }
})

var Weather = React.createClass({
    mixins: [TimerMixin],

    getInitialState: function() {
        return {
            storageId: 'weather',
            lastUpdated: null,
            weather: {
                wind: 0,
                temp: 0
            }
        };
    },

    componentDidMount: function() {
        console.log('Weather loaded.');
        this.setTimer();
    },

    setTimer: function() {

        this.getWeather();
        this.setInterval(
          function () { this.getWeather(); }.bind(this),
          60000
        );
    },

    getWeather: function() {

        var now = moment();
        var storedData = getData(this.state.storageId);
        if (storedData == null 
            || storedData.city != this.props.city
            || now.diff(moment(storedData.lastUpdated).tz("Europe/Helsinki"), 'minutes') >= 15) {
                $.get('http://api.openweathermap.org/data/2.5/weather?q=' + this.props.city + '&units=metric', function(result) {

                var data = {
                    weather: { 
                        temp: parseFloat((Math.round(result.main.temp * 10) / 10).toFixed(1)),
                        wind: result.wind.speed,
                        city: this.props.city
                    },
                    lastUpdated: now
                };

                this.setState(data);
                setData(this.state.storageId, data);
            }.bind(this))
        } else {
            this.setState({
                weather: storedData.weather
            });
        }
    },

    render: function() {

        var storedData = getData("user");
        var temperature = storedData.showTemperature ? <div id="temp">{this.state.weather.temp} <span id="tempUnit">&deg;C</span></div> : null;
        var windSpeed = storedData.showWindSpeed ? <div id="wind">{this.state.weather.wind} <span id="windUnit">m/s</span></div> : null;

        return (
            <div id="weather">
                <div className="weather-top">
                    {temperature}
                    {windSpeed}
                </div>
                <span id="location">{this.props.city}</span>
            </div>
        );
    }
});

var App = React.createClass({

    getInitialState: function() {
        return {
            storageId: "user" 
        };
    },

    render: function() {
        var storedData = getData(this.state.storageId);
        if (storedData == null) {
            return <Settings />;
        } else {
            var weather = storedData.showWeather ? <Weather city={storedData.city}/> : null;

            return (
                <section>
                    <aside>
                        <Clock name={storedData.name}/>
                        {weather}
                    </aside>
                    <Background />
                </section>
            );
        }


    }
});

var Router = Backbone.Router.extend({
  routes : {
    '':  'default',
    'settings' : 'settings'
  },
  default: function() {
    React.render(
      <App />,
      document.getElementById("view")
    );
  }.bind(React),
  settings : function() {
    React.render(
      <Settings />,
      document.getElementById("view")
    );
  }.bind(React)
});

var router = new Router();

Backbone.history.start();
