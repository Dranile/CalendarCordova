/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * 'License'); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
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
        var id = getGetParams();

        var db = new Database();
        db.selectDataWithId(id,function(tx, results){
            // Gérer les données à afficher
            var obj = results.rows.item(0);
            console.log(obj);

            $('#js-titre').text(obj.titre);
            $('#js-date').text(obj.date);
            $('#js-description').append('<h5>Description :</h5><p>' + obj.description + '</p>');
            $('#js-eventType').text(obj.eventType);

            if(obj.photo != null){
                var img  = document.createElement('img');
                img.src = obj.photo;
                img.class = 'responsive-img'; 
                document.querySelector('#js-photo').appendChild(img);

                var span = document.createElement('span');
                span.innerHTML = 'Photo associée : ';
                document.querySelector('#js-photoContainer').insertAdjacentElement('afterbegin', span);
            }
            if(obj.latitude != null && obj.longitude != null){
                //document.querySelector('.localisation').innerHTML = obj.latitude + ' : ' + obj.longitude;
            }

            if(obj.eventType === 'sport'){
                $('#js-sportActivity').removeClass('hide');

            }

        });


        function getGetParams(){
            var url = new URL(window.location.href);
            return url.searchParams.get('id'); 
        }
    }


};

app.initialize();