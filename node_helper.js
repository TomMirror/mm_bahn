/* Magic Mirror
 * 
 * Node Helper for mm_bahn module
 *
 * Tom
 * 
 */

const util = require('util');
const NodeHelper = require('node_helper');
const xml2js = require('xml2js');
const xmlhttpreq = require('xmlhttprequest');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var moment = require('moment');
var parser = new xml2js.Parser();

parser.on("error", function(err) { console.log("Parser error", err); } );

module.exports = NodeHelper.create({
        
    start: function() {
        console.log("Starting module: " + this.name);
    },

	getAbfahrtData: function() {
                var self = this;
                var na = moment();
                var b = na.get('year');
                b= b.toString().substr(-2);
                var c = na.get('month')+1;
                var d = na.get('date');
                var h = na.get('hour');
                 if(b < 10){b = '0'+b;} 
                 if(c < 10){c = '0'+c;} 
                 if(d < 10){d = '0'+d;}
                 if(h < 10){h = '0'+h;}
                var zeit = b+c+d;
//test Rostock:                 var url1 = 'https://api.deutschebahn.com/timetables/v1/plan/8010304/'+zeit+'/'+h;
		var url1 = 'https://api.deutschebahn.com/timetables/v1/plan/' + this.config.Abfahrtbahnhof +'/'+zeit+'/'+h;
		bahnRequest1 = new XMLHttpRequest();
		bahnRequest1.open("GET", url1, true);
		bahnRequest1.setRequestHeader("Authorization", this.config.BAHN_API_KEY);
                bahnRequest1.onreadystatechange = function() {
                    if (this.readyState === 4) {
                      if (this.status === 200) {
                          parser.parseString(this.responseText, function(err, result) {
                             self.sendSocketNotification("ABFAHRT_DATA", result);
                          		});
                      }
                      else {
                          result =[];
                          self.sendSocketNotification("KEINE_ABFAHRT_DATA", result);
                      }
                   }
                }
                bahnRequest1.send();
	},
        
        getAbfahrtDataPlus1: function() {
                var self = this;
                var na = moment().add(1, 'h');
                var b = na.get('year');
                b= b.toString().substr(-2);
                var c = na.get('month')+1;
                var d = na.get('date');
                var h = na.get('hour');
                if(c < 10){c = '0'+c;} 
                if(d < 10){d = '0'+d;}
                if(h < 10){h = '0'+h;}
                var zeit = b+c+d;
                var url3 = 'https://api.deutschebahn.com/timetables/v1/plan/' + this.config.Abfahrtbahnhof +'/'+zeit+'/'+h;
//test Rostock:                 var url3 = 'https://api.deutschebahn.com/timetables/v1/plan/8010304/'+zeit+'/'+h;
		bahnRequest3 = new XMLHttpRequest();
		bahnRequest3.open("GET", url3, true);
		bahnRequest3.setRequestHeader("Authorization", this.config.BAHN_API_KEY);
                bahnRequest3.onreadystatechange = function() {
                    if (this.readyState === 4) {
                      if (this.status === 200) {
                          parser.parseString(this.responseText, function(err, result) {
                             self.sendSocketNotification("ABFAHRT_DATA_PLUS_1", result);
                          		});
                    }
                    else {
//                          console.log(self.name + ": Kann Daten nicht laden");
                      }  
                  }
                }
                bahnRequest3.send();
	},
        getAktuellData: function() {
                var self = this;
                var url2 = 'https://api.deutschebahn.com/timetables/v1/fchg/' + this.config.Abfahrtbahnhof;
                var bahnfahrten1 = [];
		bahnRequest2 = new XMLHttpRequest();
		bahnRequest2.open("GET", url2, true);
		bahnRequest2.setRequestHeader("Authorization", this.config.BAHN_API_KEY);
                bahnRequest2.onreadystatechange = function() {
                    if (this.readyState === 4) {
                        if (this.status === 200) {
                           parser.parseString(this.responseText, function(err, result) {
                                self.sendSocketNotification("AKTUELL_DATA", result);
                           });
                                
                      }
                        else {
//                          console.log(self.name + ": Kann Daten nicht laden");
                      } 
                   }
                }
                bahnRequest2.send();
	},

        getData: function() {
		this.getAktuellData();
		this.getAbfahrtData();
		this.getAbfahrtDataPlus1();
        },
    
    socketNotificationReceived: function(notification, payload) {
        if (notification === "CONFIG") {
            this.config = payload;
        } else if (notification === "GET_DATA") {
            this.getData();
        }
    }

});