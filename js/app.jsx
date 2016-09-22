var $ = require("jquery");
var React = require("react");
var TimerMixin = require("react-timer-mixin");
var ReactRouter = require('react-router')
var Router = ReactRouter.Router
var Navigation = ReactRouter.Navigation
var Route = ReactRouter.Route
var Link = ReactRouter.Link

var moment = require("moment");
moment().utc();

var storageAffix = "newtab-";
var weatherApiBase = "http://api.openweathermap.org/data/2.5/weather?APPID=732e78b853a08a9dfdeeba03592cf1aa";

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

    mixins: [Navigation],

    getInitialState: function() {
        return {
            name: 'Old chump',
            city: 'Auto',
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
                            <label htmlFor="city">Location</label>
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
                        <a href="#" className="button" onClick={this.handleClick}>Save</a>
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
        $('img').stop().fadeIn(500);
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
                <span id="greeting">Hello {this.props.name}</span> <Link className="edit" to={'/settings'}>(settings)</Link>
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

    getDecimalsBetween: function(current, target, delay, callback) {
        return new Promise(function(resolve) {
            var arr = [];
            var runningValue = current;

            var index = 0;
            while (parseFloat(runningValue) != parseFloat(target))
            {
                var difference = ( parseFloat(runningValue) - parseFloat(target) ).toFixed(1)
                var tick = 0;
                if (parseFloat(difference) > 0) {
                    // 20.0 -> 19.0 = 1
                    // colder than before -0.1
                    runningValue = (parseFloat(runningValue) - parseFloat(0.1)).toFixed(1);
                } else if (parseFloat(difference) < 0) {
                    // 19.0 -> 29.0 = -1
                    // warmer than before +0.1
                    runningValue = (parseFloat(runningValue) + parseFloat(0.1)).toFixed(1);
                }
                
                arr[index] = parseFloat(runningValue).toFixed(1);
                index ++;
            }

            resolve(arr);
        });
    },

    setDeceleratingTimeout: function(callback, factor, times) {
      var internalCallback = function( t, counter )
      {
        return function()
        {
          if ( --t > 0 )
          {
            window.setTimeout( internalCallback, ++counter * factor );
            callback();
          }
        }
      }( times, 0 );

      window.setTimeout( internalCallback, factor );
    },

    getWeather() {
        console.log('Fetching forecast');
        var userData = getData("user");
        var url;

        if (userData.city.toLowerCase() == 'auto')
        {
            //TODO: Save the current position instead of polling it constantly
            navigator.geolocation.getCurrentPosition(function (loc) {
                url = weatherApiBase + '&lat=' + loc.coords.latitude + '&lon=' + loc.coords.longitude + '&units=metric';
                this.getWeatherForUrl(url);
            }.bind(this));
        } else {
            url = weatherApiBase + '&q=' + userData.city + '&units=metric';
            this.getWeatherForUrl(url);
        }
    },

    getWeatherForUrl: function(url) {
        var now = moment();
        var userData = getData("user");
        var weatherData = getData(this.state.storageId);
        if (weatherData == null 
            || userData == null
            || userData.city != weatherData.weather.city
            || now.diff(moment(weatherData.lastUpdated), 'minutes') >= 1) {
                $.get(url, function(result) {

                var data = {
                    weather: { 
                        temp: parseFloat((Math.round(result.main.temp * 10) / 10).toFixed(1)),
                        wind: result.wind.speed,
                        city: result.name
                    },
                    lastUpdated: now
                };
                
                if (this.state.weather.temp != data.weather.temp)
                {
                    this.getDecimalsBetween(this.state.weather.temp, data.weather.temp, 50).then(function(arr) {
                        var startPos = (arr.length - arr.length / 15).toFixed(0);
                        this.setDeceleratingTimeout(function() {
                            var newData = data;
                            newData.weather.temp = arr[startPos];
                            this.setState(newData);
                            startPos++;
                        }.bind(this), 50, arr.length - startPos);
                    }.bind(this));
                }

                this.setState( data );
                setData(this.state.storageId,  data );
            }.bind(this))
        } else {
            this.setState( weatherData );
        }
    },

    getWindText: function(ms) {
        if (ms >= 12)
            return 'Hurricane force';
        if (ms >= 11)
            return 'Violent storm';
        if (ms >= 10)
            return 'Whole gale';
        if (ms >= 9)
            return 'Severe gale';
        if (ms >= 8)
            return 'Gale';
        if (ms >= 7)
            return 'Moderate gale';
        if (ms >= 6)
            return 'Strong breeze';
        if (ms >= 5)
            return 'Fresh breeze';
        if (ms >= 4)
            return 'Moderate breeze';
        if (ms >= 3)
            return 'Gentle breeze';
        if (ms >= 2)
            return 'Light breeze';
        if (ms >= 1)
            return 'Light air';
        if (ms >= 0)
            return 'Calm';
    },

    render: function() {

        var userData = getData("user");

        var temperature = userData.showTemperature ? (
                <div className="temperature">
                    <div id="temp">
                        {this.state.weather.temp} 
                        <span id="tempUnit">&deg;C</span>
                    </div>
                    <span id="location">{this.state.weather.city}</span>
                </div>
            ) : null;

        var wind = userData.showWindSpeed ? (
                <div className="wind">
                    <div id="wind">
                        {this.state.weather.wind} 
                        <span id="windUnit">m/s</span>
                    </div>
                    <span id="windText">{this.getWindText(this.state.weather.wind)}</span>
                </div>
            ) : null;

        return (
            <div id="weather">
                {temperature}
                {wind}                
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

                    <svg id="loading" height="32" width="32">
                      <polygon points="1,16 16,1 16,16" style={{ fill: 'transparent', stroke:'white', strokeWidth: 2}} />
                      <polygon points="16,16, 16,31 31,16" style={{ fill: 'transparent', stroke:'white', strokeWidth: 2}} />
                    </svg>

                    <Background />
                </section>
            );
        }


    }
});

React.render((
  <Router>
    <Route path="/" component={App}/>
    <Route path="/settings" component={Settings}/>
  </Router>
), document.body)
