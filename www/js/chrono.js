
class chrono{

	constructor(call){
		if(typeof call === 'function')
			this.callback = call;
		else
			this.callback = null;
		this.hour = 0;
		this.sec = 0;
		this.min = 0;
		this.intervalId = null;
		this.isPlaying = false;
	}

	setCallback(call){
		if(typeof call === 'function')
			this.callback = call;
	}

	updateShow(){
		if(this.callback !== null){
			this.callback(this.toString());
		}
	}

	play(){
		if(this.isPlaying)
			return;
		var scope = this;
		this.isPlaying = true;
		this.intervalId = window.setInterval(function(){
			scope.tick();
			scope.updateShow();
		},1000);
	}

	pause(){
		this.isPlaying = false;
		clearInterval(this.intervalId);
	}

	reset(){
		this.pause();
		this.hour = 0;
		this.sec = 0;
		this.min = 0;
		this.intervalId = null;
		this.updateShow();
	}

	tick(){
		this.sec += 1;
		this.checkTimer();
	}

	checkTimer(){
		if(this.sec === 60){
			this.sec = 0;
			this.min += 1; 
		}
		if(this.min === 60){
			this.min = 0;
			this.hour += 1;
		}
	}

	getTimeInSecond(){
		return this.sec + (this.min * 60) + (this.hour * 3600);
	}

	/**
	 * [toString retourne la chaine de caractere du chrono]
	 * @return {string} [chaine de caractère représentant le chrono]
	 */
	toString(){
		return (this.hour > 9 ? this.hour : ('0' + this.hour)) + ':' + (this.min > 9 ? this.min : ('0' + this.min)) + ':' + (this.sec > 9 ? this.sec : ('0' + this.sec));
	}
}