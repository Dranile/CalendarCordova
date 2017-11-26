class Calendar{

	initialize(date, titre, descr, eventType, localisation, photo){
		this.date = date;
		this.titre = titre;
		this.eventType = eventType;
		this.description = descr;
		this.localisation = localisation;
		this.photo = photo;
	}

	toObject(){
		return {
            "date": this.date,
            "titre": this.titre,
            "description": this.descr,
            "eventType": this.selectElement
        };
	}

}