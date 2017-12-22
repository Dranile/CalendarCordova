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

    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        document.querySelector("#send").addEventListener("click", this.insertDate);
        document.querySelector("#js-localisation").addEventListener("click", this.localize);
        document.querySelector("#js-photo").addEventListener("click", this.takePicture);

        $('.datepicker').pickadate({
            selectMonths: true, // Creates a dropdown to control month
            selectYears: 15, // Creates a dropdown of 15 years to control year,
            today: 'Today',
            clear: 'Clear',
            close: 'Ok',
            closeOnSelect: false // Close upon selecting a date,
          });


        $('.timepicker').pickatime({
            default: 'now', // Set default time: 'now', '1:30AM', '16:30'
            fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
            twelvehour: false, // Use AM/PM or 24-hour format
            donetext: 'OK', // text for done-button
            cleartext: 'Clear', // text for clear-button
            canceltext: 'Cancel', // Text for cancel-button
            autoclose: false, // automatic close timepicker
            ampmclickable: true, // make AM PM clickable
            aftershow: function(){} //Function for after opening timepicker
          });

        $('select').material_select();
    },

    insertDate: function(){
        // Récupération des différentes valeurs
        var date = document.querySelector("input#date").value;
        var heure = document.querySelector("input#heure").value;
        var titre = document.querySelector("input#titre").value;
        var descr = document.querySelector("textarea#description").value;
        var selectElement = document.querySelector("select#select");
        var type = selectElement.options[selectElement.selectedIndex].value;
        var localisation = document.querySelector("#js-textLocal").value;
        var photo = document.querySelector("img");



        if(date == null || heure == null || titre == "" || descr == ""){
            alert("Un champ n'a pas été remplis");
            return;
        }
        date = date + ' ' + heure;
        var dateObject = new Date(date);
        date = dateFormat(dateObject);
        var insertObject = {
            "date": date.toString(),
            "titre": titre,
            "description": descr,
            "eventType": type
        };

        if(localisation != ""){
            var coordonnees = localisation.split(":")
            insertObject["latitude"] = coordonnees[0]
            insertObject["longitude"] = coordonnees[1]
        }
        if(photo != null){
            insertObject["photo"] = photo.src;
        }

        var db = new Database();
        db.insertDate(insertObject, function (tx, result) {
            console.log(result);
            createNotification(result.insertId, titre, descr, dateObject);
            document.location.href="index.html"
        }, function (error) {
            console.log(error);
        });
    

        function dateFormat(date){
            var year = date.getFullYear();
            var month = date.getMonth();
            var day = date.getDate();
            var hour = date.getHours();
            var min = date.getMinutes();

            month += 1;
            console.log(month);
            if(month < 10){
                month = '0' + month;
            }
            if(day < 10){
                day = '0' + day;
            }
            if(hour < 10){
                hour = '0' + hour;
            }
            if(min < 10){
                min = '0' + min;
            }
            var dateReturn = year + '-' + month + '-' + day + ' ' + hour + ':' + min;
            return dateReturn;
        }

        function createNotification(id, title, description, date){
            console.log(cordova);
            cordova.plugins.notification.local.schedule({
                id: id,
                title: title,
                message: description,
                at: date,
                smallIcon: 'res://cordova',
                sound: null,
                foreground: true,
                data: { idEvent: id }
            });
        }
    },

    localize: function(){
        console.log("on recupère la localisation");
        cordova.plugins.diagnostic.isGpsLocationEnabled(function(enabled){
            console.log("GPS location is " + (enabled ? "enabled" : "disabled"));
            if(enabled){
                navigator.geolocation.getCurrentPosition(onSuccess,onError, {timeout: 10000, enableHighAccuracy: true});
            }
            else{
                cordova.plugins.locationAccuracy.request(onRequestSuccess, onRequestFailure, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
            }
        }, function(error){
            console.error("The following error occurred: "+error);
        });

        function onRequestSuccess(success){
            console.log("Successfully requested accuracy: "+success.message);
            navigator.geolocation.getCurrentPosition(onSuccess,onError, {timeout: 10000, enableHighAccuracy: true});
        }

        function onRequestFailure(error){
            console.error("Accuracy request failed: error code="+error.code+"; error message="+error.message);
            if(error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED){
                if(window.confirm("Failed to automatically set Location Mode to 'High Accuracy'. Would you like to switch to the Location Settings page and do this manually?")){
                    cordova.plugins.diagnostic.switchToLocationSettings();
                }
            }
        }

        function onSuccess(position){
            console.log(position.coords.latitude + " : " + position.coords.longitude);
            document.querySelector("#js-textLocal").value = position.coords.latitude + ":" + position.coords.longitude;
        }

        function onError(error){
            console.log(error);
            alert('Il y a eu une erreur, veuillez réessayer...');
        }
    },

    takePicture: function(){
        navigator.camera.getPicture(onSuccess, onFail, { quality: 50,destinationType: Camera.DestinationType.FILE_URI, targetHeight: 300, targetWidth:300 });

        function onSuccess(imageURI) {
            console.log(imageURI);
            //Créer un élément img, et l'ajoute
            var p = document.createElement("p");
            var image = document.createElement("img");
            image.src = imageURI;
            p.appendChild(image);
            document.querySelector(".content").appendChild(p);
        }

        function onFail(message) {
            alert('Failed because: ' + message);
        }
    }
};

app.initialize();