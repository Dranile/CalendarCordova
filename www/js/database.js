

class Database{
	/**
	 * Open or create the calendar database
	 */
	constructor(){
		this.db = window.openDatabase("Database", "1.0", "Calendar", 200000);
        this.db.transaction(populateDB, null , successCB, errorCB);
    

        // Populate the database
        function populateDB(tx) {
            //tx.executeSql('DROP TABLE CALENDAR');
            
            tx.executeSql('CREATE TABLE IF NOT EXISTS CALENDAR (id INTEGER PRIMARY KEY AUTOINCREMENT, date DATETIME DEFAULT (DATETIME(CURRENT_TIMESTAMP, \'LOCALTIME\')), eventType VARCHAR(20), titre VARCHAR(255), description VARCHAR(2048), latitude VARCHAR(255), longitude VARCHAR(255), photo VARCHAR(2048))', [], function(tx, result){
                console.log(result);
            }, function(tx, err){
                console.log(err);
            });
            
        }

        // Transaction error callback
        function errorCB(tx, err) {
            alert("Error processing SQL: "+err);
        }

        // Transaction success callback
        function successCB() {
            console.log("success");
        }
	}

	/**
	 * Insert une date dans le Calendar
	 * @param  {[type]} object Objet contenant les différentes valeurs à ajouter
	 */
	insertDate(object, callbackSuccess, callbackError){
		var sql = generateSQLRequest(object);
		console.log(sql);

		this.db.transaction(populateDB, null);

		function generateSQLRequest(object){
			var sqlRequest = "INSERT INTO Calendar(";
			var sqlData = "(";
			for (var obj in object){
				sqlRequest += obj + ",";
				if(typeof object[obj] === 'string'){
					sqlData += "'" + object[obj] + "',";
				}
				else{
					sqlData += object[obj] + ",";
				}
			}
			sqlRequest = sqlRequest.slice(0, -1);
			sqlData = sqlData.slice(0,-1);

			sqlRequest += ")";
			sqlData+= ")";
			sqlRequest = sqlRequest + " VALUES" + sqlData;
			return sqlRequest;	
		}

        // Populate the database
        function populateDB(tx) {
            tx.executeSql(sql, [], callbackSuccess, callbackError);
        }
	}

	/**
	 * permet d'avoir l'élément avec l'id sélectionné ou les éléments suivant un champ de recherche 
	 * @param  {[type]}   object   [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	selectData(object, callback){
		// il faut réaliser certaines choses avant de lancer la requête
		var sql = 'SELECT * FROM CALENDAR WHERE ';
		for(var item in object){
			if(typeof object[item]=== 'string'){
				sql += item + '=\'' + object[item] + "' AND "	
			}
			else{	
				sql += item + '=' + object[item] + " AND "
			}
		}

		sql += 'date > strftime(\'%Y-%m-%d %H:%M:%S\', datetime(\'now\',\'localtime\')) ORDER BY date';

		console.log(sql);

		this.db.transaction(populateDB, null);

        function populateDB(tx) {
        	//Changer la requête
            tx.executeSql(sql, [], callback, errorCB);
        }

        // Transaction error callback
        function errorCB(tx, err) {
            alert("Error processing SQL: "+err);
        }
	}

	/**
	 * Requête permettant de récupérer l'intégralité de la base de donnée Calendar
	 * @param  {Function} callback exécute dans le callback le résultat de la requête
	 */
	selectAllData(callback){
		this.db.transaction(populateDB, null);
    

        // Populate the database
        function populateDB(tx) {
        	var sql = 'SELECT * FROM CALENDAR WHERE date > strftime(\'%Y-%m-%d %H:%M:%S\', datetime(\'now\',\'localtime\')) ORDER BY date'
        	console.log(sql)
            tx.executeSql(sql, [], callback, errorCB);
        }

        // Transaction error callback
        function errorCB(tx, err) {
            alert("Error processing SQL: "+err);
        }
	}

	dropTable(){
		this.db.transaction(populateDB, null , successCB, errorCB);
		// Populate the database
        function populateDB(tx) {            
            tx.executeSql('DROP TABLE CALENDAR', [], function(tx, result){
                console.log(result);
            }, function(tx, err){
                console.log(err);
            });
            
        }

        // Transaction error callback
        function errorCB(tx, err) {
            alert("Error processing SQL: "+err);
        }

        // Transaction success callback
        function successCB() {
            console.log("success");
        }
	}


}