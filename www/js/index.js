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
        document.querySelector("#js-search").addEventListener("click",this.onSearch);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        $('select').material_select();
        cordova.plugins.notification.local.on('click', function(notification){
            document.location.href='event.html?id=' + notification.id;
        });

        var db = new Database();

        db.selectAllData(function(tx, results) {
            var len = results.rows.length;
            console.log(len);
            if(len > 0){
                var el = document.querySelector(".collection");
                for (i = 0; i < len; i++){
                    app.createEvent(el, results.rows.item(i));
                }
            }
        });
    },

    onSearch: function(){
        var selectElement = document.querySelector("select#select");
        var selectValue = selectElement.options[selectElement.selectedIndex].value;
        var searchValue = document.querySelector("input#textSearch").value;
        console.log(selectValue + " : " + searchValue);

        var db = new Database();
        var object = {};

        if(searchValue != ""){
            object["titre"] = searchValue
        }
        if(selectValue != "all"){
            object["eventType"] = selectValue 
        }
        db.selectData(object, function(tx, results){
            var len = results.rows.length;
            var el = document.querySelector(".collection");
            el.innerHTML = "";
            console.log(len);
            if(len > 0){
                for (i = 0; i < len; i++){
                    app.createEvent(el, results.rows.item(i));
                }
            }
        });
    },

    createEvent: function(element, item){
        console.log(item);
        var collectionItem = $('<ul></ul>')
            .addClass('collection-item')
            .append($('<a></a>')
                .attr('href', 'event.html?id=' + item.id)
                .append($('<div></div>')
                    .append($('<span></span>')
                        .addClass('title')
                        .text(item.titre))
                    .append($('<p></p>')
                        .text(item.date)))
                .append($('<span></span>')
                    .addClass('secondary-content')
                    .addClass('valign-wrapper')
                    .text(item.eventType)));

        $(element).append(collectionItem);
    }

};

app.initialize();