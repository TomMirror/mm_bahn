# mm_bahn
## DB OpenData Directrelations - Monitor

**(SORRY FOR MY BAD ENGLISH)**

After building my own mirror I've realized that there is no module available to display direct relations for DB supported trains.
I'm not so familiar with this programming language but after checking the code of other modules I've decided to write my own extension module for the MagicMirror2 project by MichMich.
Please feel free to contact me in case you have questions, comments or improvements.

Í've programmed a module (in poorely code) which shows direct relations between two german cities.
The ressource is based on a ct' project shown at:

https://www.heise.de/ct/ausgabe/2017-21-Echtzeitdaten-der-Deutschen-Bahn-auslesen-und-verarbeiten-3837602.html#p_2

and

https://github.com/jamct/phpbahn

To receive data you must register at: https://developer.deutschebahn.com/store/

And follow the steps shown at the ct' article


## Description
The departure monitor displays all trains for a given station with direct connection to the destination. It is necessary to specify the station ID to define the departure station. To define the destination of trains you must specify this as searchstring. The module will not display all departures of a station, only the departures for the given final destinations.

## Version:
v1.0.0: First Release

## Note:
Translation
This module is available in German (de).

## Dependencies
- 	At work.

## Installation of the module
As similar to other modules:
- Navigate into your MagicMirror/modules folder
- git clone 'https://github.com/TomMirror/mm_bahn.git'
- Navigate into MagicMirror/modules/mm_bahn
- unzip the archive node_modules.zip to ./node_modules (esp. sudo unzip node_modules.zip -d ./node_modules)
- the files of node_modules.zip must be at: your_path_to_MM/modules/mm_bahn/node_modules/*.*
- Execute npm intall mm_bahn
- set your API-KEY at mm_bahn.js

## Configuration
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
?
    BAHN_API_KEY: "Bearer YOUR_APIKEY", //"Bearer +ApiKey"
    Abfahrtbahnhof: 8000207,            // API evaid KÖLN HBF      
    Zielbahnhof: "Siegburg/Bonn",       // Searchstring
?
}
```

## Station ID and apiKey
An apiKey has to be requested at https://developer.deutschebahn.com/store/

## Config Options
Option | Default | Description
-------|---------|------------
Abfahrtbahnhof | 8000207 | default value of evaId: 8000207 ? Köln Hbf (see DB API at ct' article)
Zielbahnhof | "Siegburg/Bonn" |	The destination to search as String
updateInterval | optional '60000' |	Update interval in milliseconds

## Screenshots
![Screenshot](https://github.com/TomMirror/mm_bahn/blob/master/screenshots/sample.PNG)

## THANKS
- [Michael Teeuw](https://github.com/MichMich) for the MagicMirror idea and inspiring me build a MagicMirror module.
- [ct'](https://www.heise.de/ct) for the inspiration to use DB-Open-Data.
- The community for the inspiration of various code-segments, which could be useful...
  
## Licence
MIT License
Copyright (c) 2018 TomMirror  (https://github.com/TomMirror/)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
