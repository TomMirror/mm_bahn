# mm_bahn
MagicMirror modul for DB directrelations using DB-API
(SORRY FOR MY BAD ENGLISH)
I’ve programmed a module (in poorely code) which shows direct relations between two german cities.
The ressource is based on a ct’ project shown at:

https://www.heise.de/ct/ausgabe/2017-21-Echtzeitdaten-der-Deutschen-Bahn-auslesen-und-verarbeiten-3837602.html#p_2
and
https://github.com/jamct/phpbahn

To receive data you must register at: https://developer.deutschebahn.com/store/

And follow the steps shown at the ct' article

mm_bahn
# DB OpenData Directrelations - Monitor
After building my own mirror I've realized that there is no module available to display direct relations for DB supported trains.
I'm not so familiar with this programming language but after checking the code of other modules I've decided to write my own extension module for the MagicMirror2 project by MichMich.
Please feel free to contact me in case you have questions, comments or improvements.

## Description
The departure monitor displays all trains for a given station with direct connection to the destination. It is necessary to specify the station ID to define the departure station. To define the destination of trains you must specify this as searchstring. The module will not display all departures of a station, only the departures for the given final destinations.

## Version:
v1.0.0: First Release

## Note:
Translation
This module is available in German (de).

## Dependencies
•	At work….

## Installation of the module
As similar to other modules:
- Navigate into your MagicMirror/modules folder
- git clone 'https://github.com/TomMirror/mm_bahn.git'
- Navigate into MagicMirror/modules/mm_bahn
- Execute npm intall

# Note
- If there is an error during data retrieving process it will be shown in the console

# Configuration
1.	minimum configuration within config.js:
```
{
    module: 'mm_bahn',
    position: 'top_right',
    header: 'Bahnverbindung Köln - Siegburg',	
    config: {
            updateInterval:  60000
    }
}
````

2.	Configuration within mm_bahn.js:
```
{
…
    BAHN_API_KEY: "Bearer YOUR_APIKEY", //"Bearer +ApiKey"
    Abfahrtbahnhof: 8000207,            // API evaid KÖLN HBF      
    Zielbahnhof: "Siegburg/Bonn",       // Searchstring
…
}
```

# Station ID and apiKey
An apiKey has to be requested at https://developer.deutschebahn.com/store/

# Config Options
Option	Default	Description
stationId	8000207	
Choose your departure station
default value: '8000207' – Köln Hbf'
Zielbahnhof	Siegburg/Bonn'	The destination to search
updateInterval
optional	'60000'	
Update interval in milliseconds 
default: Once per minute
Screenshots
  
Licence
MIT License
Copyright (c) 2018 TomMirror  (https://github.com/TomMirror/)
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


