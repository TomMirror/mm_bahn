/* Module */

/* Magic Mirror
 * Module: mm_bahn
 *
 * By Tom 
 */

Module.register("mm_bahn",{

	// Default module config.
	defaults: {
		
		initialLoadDelay: 1000,
                BAHN_API_KEY: "Bearer YOUR_APIKEY", //"Bearer +ApiKey"
                Abfahrtbahnhof: 8000207,                                 // API evaid KÖLN HBF      
                Zielbahnhof: "Siegburg/Bonn",                            // Searchstring
		updateInterval:  2*60*1000 // every 2 minutes
                
	},

	// Define start sequence.
	start: function() {
		this.loaded = false;
                this.loaded1 = false;
		this.AbfahrtData = null;
                this.AbfahrtDataPlus = null;
		this.AktuellData = null;

		this.sendSocketNotification("CONFIG", this.config);

		this.scheduleUpdate(this.config.initialLoadDelay);
                this.Abfahrt = [];
                this.Aktuell = [];
                this.Ueberschrift = ['Typ', 'Nr.', 'Plan', 'Akt', 'Gleis', 'Gl-N','Ziel','S'];
	},

        getStyles: function() {
            return ['font-awesome.css', 'Abfahrt.css'];
        },
	getData: function() {
		Log.info("####################mm_bahn    Getting Data");
		this.sendSocketNotification("GET_DATA");
	},

	socketNotificationReceived: function(notification, payload) {
                this.Abfahrttafel =[];
		if (notification === "AKTUELL_DATA") {
                    this.AktuellData = payload;
                    this.Aktuell =[];
                    var count = 0;
                    var help = 'falsch';
                    for (var i = 0; i < this.AktuellData['timetable'].s.length; i++){
                        this.Aktuell[count] = [];
                        if(this.AktuellData['timetable'].s[i].hasOwnProperty('dp')){
                            this.Aktuell[count][0] = JSON.stringify(this.AktuellData['timetable'].s[i].$.id);
                            if (this.AktuellData['timetable'].s[i].dp[0].hasOwnProperty('$')){
                                if (this.AktuellData['timetable'].s[i].dp[0].$.hasOwnProperty('ct')){
                                    help = 'wahr';
                                    this.Aktuell[count][1] = this.AktuellData['timetable'].s[i].dp[0].$.ct.substr(6, 2)+':'+this.AktuellData['timetable'].s[i].dp[0].$.ct.substr(8, 2);
                                    this.Aktuell[count][4] = this.AktuellData['timetable'].s[i].dp[0].$.ct;
                                }
                                else {this.Aktuell[count][1] = '';
                                      this.Aktuell[count][4] = 0;}
                                if (this.AktuellData['timetable'].s[i].dp[0].$.hasOwnProperty('cp')){
                                    help = 'wahr';
                                    this.Aktuell[count][2] = this.AktuellData['timetable'].s[i].dp[0].$.cp;
                                }
                                else {this.Aktuell[count][2] = '';}
                                if (this.AktuellData['timetable'].s[i].dp[0].$.hasOwnProperty('cs')){
                                    help = 'wahr';
                                    this.Aktuell[count][3] = this.AktuellData['timetable'].s[i].dp[0].$.cs;
                                }else {this.Aktuell[count][3] = '';}
                            }
                            if (help == 'wahr'){
                                this.Aktuell[count].push();
                                count++;
                                help = 'falsch';
                            }
                        }
                    }
		} else if (notification === "STATION_DATA") {
			this.StationData = payload;
                } else if (notification === "KEINE_ABFAHRT_DATA") {
		       this.loaded = false;
                       this.loaded1 = false;
                       this.scheduleUpdate();
		} else if (notification === "ABFAHRT_DATA") {
			this.AbfahrtData = payload;
                        var anzeige1 = false;
                        var Abfahrtsliste = {};
                        var NahLinie = '';
                        for (var i = 0; i < this.AbfahrtData['timetable'].s.length; i++) {
                            if (this.AbfahrtData['timetable'].s[i].hasOwnProperty('dp')){
                                var route = this.AbfahrtData['timetable'].s[i].dp[0].$.ppth.split('|');
                                for (var j=0; j<route.length; j++) {
                                    if(route[j] === this.config.Zielbahnhof){
//                                            Log.info('Siegburg/Bonn FOUND');
                                        anzeige1 = true;
                                    }    
                                }
                                if (anzeige1 === true){
                                    var SuchId = JSON.stringify(this.AbfahrtData['timetable'].s[i].$.id);
                                    NahLinie = '';
                                    if(this.AbfahrtData['timetable'].s[i].dp[0].$.hasOwnProperty('l')){
                                        NahLinie = this.AbfahrtData['timetable'].s[i].dp[0].$.l;}
                                    
                                    var Abfahrtsliste = {
                                        Id: SuchId, //JSON.stringify(this.AbfahrtData['timetable'].s[i].$.id),
                                        Typ: this.AbfahrtData['timetable'].s[i].tl[0].$.c,
                                        Nummer: this.AbfahrtData['timetable'].s[i].tl[0].$.n,
                                        GleisGeplant: this.AbfahrtData['timetable'].s[i].dp[0].$.pp,
                                        AbfahrtGeplant: this.AbfahrtData['timetable'].s[i].dp[0].$.pt,
                                        UhrzeitGeplant: this.AbfahrtData['timetable'].s[i].dp[0].$.pt.substr(6, 2)+':'+this.AbfahrtData['timetable'].s[i].dp[0].$.pt.substr(8, 2),
                                        UhrzeitNeu: '',
                                        GleisNeu: '',
                                        Zustand: '',
                                        AbfahrtNeu: 0,
                                        Linie: NahLinie,
                                        Route: this.AbfahrtData['timetable'].s[i].dp[0].$.ppth.split('|'),
                                        Ziel: route[route.length-1]
                                    };
                                    this.Abfahrt.push(Abfahrtsliste);
                                    anzeige1 = false;
                                }
                            }
                        }
                        Log.info(Date() + ' ABFAHRT DATENSÄTZE '+this.Abfahrt.length);
			this.loaded1 = true;
			this.updateDom();
                     
		} else if (notification === "ABFAHRT_DATA_PLUS_1") {
                    this.AbfahrtDataPlus = payload;
                    var anzeige = false;
                    var AbfahrtslistePlus = {};
                    var NahLinie = '';
                    for (var i = 0; i < this.AbfahrtDataPlus['timetable'].s.length; i++) {
                        if (this.AbfahrtDataPlus['timetable'].s[i].hasOwnProperty('dp')){
                            var route = this.AbfahrtDataPlus['timetable'].s[i].dp[0].$.ppth.split('|');
//                              Log.info(' route '+route);
//                              Log.info(' routelänge'+route.length);
                            for (var j=0; j<route.length; j++) {
                                if(route[j] === this.config.Zielbahnhof){
                                    anzeige = true;
                                }    
                            }
                            if (anzeige === true){
                                var SuchId = JSON.stringify(this.AbfahrtDataPlus['timetable'].s[i].$.id);
                                NahLinie = '';
                                if(this.AbfahrtDataPlus['timetable'].s[i].dp[0].$.hasOwnProperty('l')){
                                    NahLinie = this.AbfahrtDataPlus['timetable'].s[i].dp[0].$.l;}
                                    
                                var AbfahrtslistePlus = {
                                    Id: SuchId, //JSON.stringify(this.AbfahrtDataPlus['timetable'].s[i].$.id),
                                    Typ: this.AbfahrtDataPlus['timetable'].s[i].tl[0].$.c,
                                    Nummer: this.AbfahrtDataPlus['timetable'].s[i].tl[0].$.n,
                                    GleisGeplant: this.AbfahrtDataPlus['timetable'].s[i].dp[0].$.pp,
                                    AbfahrtGeplant: this.AbfahrtDataPlus['timetable'].s[i].dp[0].$.pt,
                                    UhrzeitGeplant: this.AbfahrtDataPlus['timetable'].s[i].dp[0].$.pt.substr(6, 2)+':'+this.AbfahrtDataPlus['timetable'].s[i].dp[0].$.pt.substr(8, 2),
                                    UhrzeitNeu: '',
                                    GleisNeu: '',
                                    Zustand: '',
                                    AbfahrtNeu: 0,
                                    Linie: NahLinie,
                                    Route: this.AbfahrtDataPlus['timetable'].s[i].dp[0].$.ppth.split('|'),
                                    Ziel: route[route.length-1]
                                };
                                this.Abfahrt.push(AbfahrtslistePlus);
                                anzeige = false;
                            }
                        }
                    }
                     Log.info(Date() + ' PLUS ABFAHRT DATENSÄTZE '+this.Abfahrt.length);
                    this.loaded = true;
                    this.updateDom();
                    this.scheduleUpdate();
		} 
	},

	// Override dom generator.
	getDom: function() {

          var wrapper = document.createElement("div");
          if (!this.loaded || !this.loaded1) {
                wrapper.innerHTML = "Rufe Daten ab...";
                wrapper.className = "dimmed light small";
                return wrapper;
          }

          if ((this.loaded) && (this.loaded1)){
            if(this.Abfahrt.length){
		wrapper.className = "mm_bahn";
                this.Abfahrt.sort(function(a, b){return a.Id - b.Id});
                
                var a = new Date();
                var b = a.getFullYear();
                b= b.toString().substr(-2);
                var c = a.getMonth()+1;
                var d = a.getDate();
                var h = a.getHours();
                var m = a.getMinutes();
                 if(b < 10){b = '0'+b;} 
                 if(c < 10){c = '0'+c;} 
                 if(d < 10){d = '0'+d;}
                 if(h < 10){h = '0'+h;}
                 if(m < 10){m = '0'+m;}
                 var zeitvergleich = b+c+d+h+m;
            
                for (var lauf = 0, count = this.Abfahrt.length; lauf < count; lauf++){
                     for (var i = 0; i< this.Aktuell.length; i++){
                         if(this.Abfahrt[lauf].Id == this.Aktuell[i][0]){
                             this.Abfahrt[lauf].UhrzeitNeu = this.Aktuell[i][1];
                             this.Abfahrt[lauf].GleisNeu = this.Aktuell[i][2];
                             this.Abfahrt[lauf].Zustand = this.Aktuell[i][3];
                             this.Abfahrt[lauf].AbfahrtNeu = this.Aktuell[i][4];
                         }
                     }
                }
                this.Abfahrt.sort(function(a, b){return a.AbfahrtGeplant - b.AbfahrtGeplant});
			
                var table = document.createElement("table");
		table.className = "small";
                    var row = document.createElement("tr");
                    table.appendChild(row);
                    for(var tablespalt= 0; tablespalt <8 ; tablespalt++){
                        var AbfahrtTypCell = document.createElement("td");
			AbfahrtTypCell.innerHTML = this.Ueberschrift[tablespalt];
			AbfahrtTypCell.className = "align-right bright Typ";
			row.appendChild(AbfahrtTypCell);
                    
                    }
		
                var lauf = 0;
                for (var f in this.Abfahrt) {
			
			var Abfahrt = this.Abfahrt[f];
                        if(Abfahrt.AbfahrtGeplant >= zeitvergleich || Abfahrt.AbfahrtNeu >= zeitvergleich){
			lauf++;
			var row = document.createElement("tr");
			table.appendChild(row);
                        var AbfahrtTypCell = document.createElement("td");
			AbfahrtTypCell.innerHTML = Abfahrt.Typ;
			AbfahrtTypCell.className = "align-right bright Typ";
			row.appendChild(AbfahrtTypCell);
                        
                        if(Abfahrt.Linie !=''){ 
                            var AbfahrtNummerCell = document.createElement("td");
                            AbfahrtNummerCell.innerHTML = Abfahrt.Linie;
                            AbfahrtNummerCell.className = "align-left Nummer";
                            row.appendChild(AbfahrtNummerCell);
                        }
                        else{
                            var AbfahrtNummerCell = document.createElement("td");
                            AbfahrtNummerCell.innerHTML = Abfahrt.Nummer;
                            AbfahrtNummerCell.className = "align-left Nummer";
                            row.appendChild(AbfahrtNummerCell);
                        }
			var AbfahrtUhrzeitGeplantCell = document.createElement("td");
			AbfahrtUhrzeitGeplantCell.innerHTML = Abfahrt.UhrzeitGeplant;
			AbfahrtUhrzeitGeplantCell.className = "align-right bright Uhrzeit";
			row.appendChild(AbfahrtUhrzeitGeplantCell);
                        
                        var AbfahrtUhrzeitNeuCell = document.createElement("td");
			AbfahrtUhrzeitNeuCell.innerHTML = Abfahrt.UhrzeitNeu;
			AbfahrtUhrzeitNeuCell.className = "align-right bright Uhrzeit";
			row.appendChild(AbfahrtUhrzeitNeuCell);
                        
                        var AbfahrtGleisGeplantCell = document.createElement("td");
			AbfahrtGleisGeplantCell.innerHTML = Abfahrt.GleisGeplant;
			AbfahrtGleisGeplantCell.className = "align-right bright GleisGeplant";
                        row.appendChild(AbfahrtGleisGeplantCell);
                        
                        var AbfahrtGleisNeuCell = document.createElement("td");
			AbfahrtGleisNeuCell.innerHTML = Abfahrt.GleisNeu;
			AbfahrtGleisNeuCell.className = "align-right bright GleisGeplant";
			row.appendChild(AbfahrtGleisNeuCell);
                        
                        if(Abfahrt.Zustand == 'c'){
                            var AbfahrtZielCell = document.createElement("td");
                            AbfahrtZielCell.innerHTML = " FÄLLT AUS !!!";
                            AbfahrtZielCell.className = "align-left bright Typ";
                            row.appendChild(AbfahrtZielCell);
                        }
                        else{
                            var AbfahrtZielCell = document.createElement("td");
                            AbfahrtZielCell.innerHTML = Abfahrt.Ziel;
                            AbfahrtZielCell.className = "align-right Typ";
                            row.appendChild(AbfahrtZielCell);
                        }
                        
                        
                        var AbfahrtZustandCell = document.createElement("td");
			AbfahrtZustandCell.innerHTML = Abfahrt.Zustand;
			AbfahrtZustandCell.className = "align-right bright Typ";
			row.appendChild(AbfahrtZustandCell);
                    }
                    if (lauf == 16){
                        break;
                    }
                }
		this.Abfahrt = [];
                this.loaded = false;
                this.loaded1 = false;
		return table;
                }
                else{
                    wrapper.innerHTML = "Keine Daten wegen Betriebsruhe - Lade neu";
                    wrapper.className = "dimmed light small";
                    this.Abfahrt = [];
                    this.loaded = false;
                    this.loaded1 = false;
                    return wrapper;
                    
                } 
            }
               

	},

	notificationReceived: function(notification, payload, sender) {
		if (notification === "DOM_OBJECTS_CREATED") {	
			this.updateDom();
		}
	},

	scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = 120000; // alt delay;
		}

		var self = this;
		setTimeout(function() { self.getData(); }, nextLoad);
	},

});
