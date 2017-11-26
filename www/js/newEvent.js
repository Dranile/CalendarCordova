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
        document.querySelector("input#send").addEventListener("click", this.insertDate);
        document.querySelector("input#cancel").addEventListener("click", function(){
            document.location.href="index.html";
        });
        document.querySelector("input#localisation").addEventListener("click", this.localize);
        document.querySelector("input#photo").addEventListener("click", this.takePicture);
    },

    insertDate: function(){
        // Récupération des différentes valeurs
        var date = document.querySelector("input#date").value;
        var heure = document.querySelector("input#heure").value;
        var min = document.querySelector("input#minute").value;
        var titre = document.querySelector("input#titre").value;
        var descr = document.querySelector("textarea#description").value;
        var selectElement = document.querySelector("select#select");
        var type = selectElement.options[selectElement.selectedIndex].value;
        var localisation = document.querySelector("input#textLocal").value;
        var photo = document.querySelector("img");
        heure = parseInt(heure);
        min = parseInt(min);


        if(date == null || titre == "" || descr == ""){
            alert("Un champ n'a pas été remplis");
            return;
        }
        if(heure > 23 || heure < 0 || min > 59 || min<0){
            alert("Le champ heure ou minute n'est pas bon");
            return;
        }
        date = dateFormat(date, heure, min);
        var dateObject = new Date(date);
        console.log(dateObject);

        var insertObject = {
            "date": date,
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
    

        function dateFormat(date, heure, min){
            if(heure < 10){
                heure = '0' + heure;
            }
            if(min < 10){
                min = '0' + min
            }
            var date = date + " " + heure + ":" + min;
            return date;
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
        navigator.geolocation.getCurrentPosition(onSuccess,onError, {timeout: 10000, enableHighAccuracy: true});
        console.log("test");
        function onSuccess(position){
            console.log(position.coords.latitude + " : " + position.coords.longitude);
            document.querySelector("input#textLocal").value = position.coords.latitude + ":" + position.coords.longitude;
        }

        function onError(error){
            alert('Veuillez activer la localisation');
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
            document.querySelector("div.content form").appendChild(p);
        }

        function onFail(message) {
            alert('Failed because: ' + message);
        }
    }
};

app.initialize();