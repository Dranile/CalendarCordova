/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var app = {
    intervalId: null,
    chrono: null,
    watchId: null,
    nbMeter: 0,
    latitude: null,
    longitude: null,
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        $('#js-start').on('click', app.start);
        $('#js-stop').on('click', app.stop);
        $('#js-reset').on('click', app.reset);
        var plugin = cordova.plugins.backgroundMode;
        //plugin.setDefaults({ silent: true });
        plugin.on('activate', app.startBackground);
        plugin.on('deactivate', app.stopBackground);

        app.chrono = new chrono(function(str){
            $('#js-chrono').text(str);
        })
    },

    start: function(){
        console.log('enable');
        app.chrono.play();
        var plugin = cordova.plugins.backgroundMode;
        plugin.setEnabled(true);

        watchId = navigator.geolocation.watchPosition(app.geolocationSuccess, app.geolocationError, {maximumAge: 3000, enableHighAccuracy: true });
    },

    stop: function(){
        console.log('disable');
        app.chrono.pause();
        app.pauseAndResetHandler();
    },

    reset: function(){
        console.log('reset');
        app.chrono.reset();
        $('#js-meter').text('0');
        app.nbMeter = 0;
        app.latitude = null,
        app.longitude = null,
        app.pauseAndResetHandler();

    },

    pauseAndResetHandler: function(){
        var plugin = cordova.plugins.backgroundMode;
        plugin.setEnabled(false);
        navigator.geolocation.clearWatch(watchId);
    },

    startBackground: function() {
        console.log('startBackgroundService');
        app.chrono.pause();
        navigator.geolocation.clearWatch(watchId);
        app.intervalId = setInterval(function () {
            app.chrono.tick();
            // Ne marche pas :(
            //navigator.geolocation.getCurrentPosition(app.geolocationSuccess, app.geolocationError, { enableHighAccuracy: true });
        }, 1000);
    },

    stopBackground: function() {
        console.log('stopBackgroundService');
        clearInterval(app.intervalId);
        app.chrono.updateShow();
        app.chrono.play();
        watchId = navigator.geolocation.watchPosition(app.geolocationSuccess, app.geolocationError, {maximumAge: 3000, enableHighAccuracy: true });
    },

    geolocationSuccess: function(position){

        var updatedLatitude = position.coords.latitude;
        var updatedLongitude = position.coords.longitude;
        if (updatedLatitude != app.latitude && updatedLongitude != app.longitude) {
            if(app.latitude !== null && app.longitude !== null){
                var result = app.calculDistance(app.latitude, app.longitude, updatedLatitude, updatedLongitude);
                app.nbMeter += result;
                console.log(result);    
            }
            app.latitude = updatedLatitude;
            app.longitude = updatedLongitude;

            $('#js-meter').text(Math.round(app.nbMeter));
        }
    },

    geolocationError: function(err){
        console.log(err)
    },

    calculDistance: function(oldLat, oldLong, newLat, newLong){
        oldPos = new LatLon(oldLat, oldLong);
        newPos = new LatLon(newLat, newLong);
        return oldPos.distanceTo(newPos);
    }

};

app.initialize();