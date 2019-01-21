var fs = require('fs');





for (let i=0;i<=100;i++) {
    var towrite = `#!/usr/bin/env python
# -*- coding: utf-8 -*-

import datetime
import time
import random
import paho.mqtt.client as mqtt
import json

MQTT_HOST = \"*Insert global IP here*\"
MQTT_PORT = 1883
MQTT_KEEPALIVE_INTERVAL = 1700
MQTT_TOPIC = \"Smartpot_`+i+`\"

mqttc = mqtt.Client(\"Smartpot_`+i+`_client\")
mqttc.connect(MQTT_HOST, MQTT_PORT, MQTT_KEEPALIVE_INTERVAL)

#1. phase. every 5 minutes for 10 minutes, which totals to 2 sending.
for x in range (0, 2):

    ido = str(datetime.datetime.today())
    temp = format(random.uniform(15.0,35.0), \'.1f\')
    para = format(random.uniform(0.0,100.0), \'.1f\')
    talajegy = format(random.uniform(500.0,800.0), \'.3f\')
    talajketto = format(random.uniform(300,600.0), \'.3f\')
    infrafeny = format(random.uniform(0,20000), \'.3f\')
    lathatofeny = format(random.uniform(0,7500), \'.3f\')
    teljfeny = format(float(lathatofeny)+float(infrafeny), \'.3f\')
    
    
    myData={\'Time\' : ido,
        \'Temperature [°C]\' : temp,
        \'Humidity [%]\' : para, 
        \'Soil-sensor I\' : talajegy, 
        \'Soil-sensor II\' : talajketto, 
        \'Full light intensity [lux]\' : teljfeny, 
        \'IR light intensity [lux]\' : infrafeny, 
        \'Visible light intensity [lux]\' : lathatofeny
        }

    MQTT_MSG=json.dumps(myData);
    
    
    
    mqttc.publish(MQTT_TOPIC, MQTT_MSG)
    time.sleep(300)

#2. phase. every minute for 10 minutes, which totals to 10 sending.
for x in range (0, 10):

    ido = str(datetime.datetime.today())
    temp = format(random.uniform(15.0,35.0), \'.1f\')
    para = format(random.uniform(0.0,100.0), \'.1f\')
    talajegy = format(random.uniform(500.0,800.0), \'.3f\')
    talajketto = format(random.uniform(300,600.0), \'.3f\')
    infrafeny = format(random.uniform(0,20000), \'.3f\')
    lathatofeny = format(random.uniform(0,7500), \'.3f\')
    teljfeny = format(float(lathatofeny)+float(infrafeny), \'.3f\')
    
    
    myData={\'Time\' : ido,
        \'Temperature [°C]\' : temp,
        \'Humidity [%]\' : para, 
        \'Soil-sensor I\' : talajegy, 
        \'Soil-sensor II\' : talajketto, 
        \'Full light intensity [lux]\' : teljfeny, 
        \'IR light intensity [lux]\' : infrafeny, 
        \'Visible light intensity [lux]\' : lathatofeny
        }

    MQTT_MSG=json.dumps(myData);
    
    
    
    mqttc.publish(MQTT_TOPIC, MQTT_MSG)
    time.sleep(60)

#3. phase, same as the first phase.
for x in range (0, 2):

    ido = str(datetime.datetime.today())
    temp = format(random.uniform(15.0,35.0), \'.1f\')
    para = format(random.uniform(0.0,100.0), \'.1f\')
    talajegy = format(random.uniform(500.0,800.0), \'.3f\')
    talajketto = format(random.uniform(300,600.0), \'.3f\')
    infrafeny = format(random.uniform(0,20000), \'.3f\')
    lathatofeny = format(random.uniform(0,7500), \'.3f\')
    teljfeny = format(float(lathatofeny)+float(infrafeny), \'.3f\')
    
    
    myData={\'Time\' : ido,
        \'Temperature [°C]\' : temp,
        \'Humidity [%]\' : para, 
        \'Soil-sensor I\' : talajegy, 
        \'Soil-sensor II\' : talajketto, 
        \'Full light intensity [lux]\' : teljfeny, 
        \'IR light intensity [lux]\' : infrafeny, 
        \'Visible light intensity [lux]\' : lathatofeny
        }

    MQTT_MSG=json.dumps(myData);
    
    
    
    mqttc.publish(MQTT_TOPIC, MQTT_MSG)
    time.sleep(300)

mqttc.disconnect()`

    fs.writeFileSync("./Smartpot_"+i+"_stresser.py", towrite, function(err) {
        if(err) {
            return console.log(err);
        }
    });
}