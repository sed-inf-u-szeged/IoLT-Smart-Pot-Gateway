#!/usr/bin/env python
# -*- coding: utf-8 -*-

import datetime
import random
import paho.mqtt.client as mqtt
import json

ido = str(datetime.datetime.today())
temp = format(random.uniform(15.0,35.0), '.1f')
para = format(random.uniform(0.0,100.0), '.1f')
talajegy = format(random.uniform(500.0,800.0), '.3f')
talajketto = format(random.uniform(300,600.0), '.3f')
infrafeny = format(random.uniform(0,20000), '.3f')
lathatofeny = format(random.uniform(0,7500), '.3f')
teljfeny = format(float(lathatofeny)+float(infrafeny), '.3f')

MQTT_HOST = "127.16.0.4"
MQTT_PORT = 1883
MQTT_KEEPALIVE_INTERVAL = 45
MQTT_TOPIC = "Dataupload_test"

myData={'Time' : ido,
   'Temperature [°C]' : temp,
   'Humidity [%]' : para, 
   'Soil-sensor I' : talajegy, 
   'Soil-sensor II' : talajketto, 
   'Full light intensity [lux]' : teljfeny, 
   'IR light intensity [lux]' : infrafeny, 
   'Visible light intensity [lux]' : lathatofeny
   }

MQTT_MSG=json.dumps(myData);

def on_connect(client, userdata, flags, rc):
 print(MQTT_MSG)
 client.publish(MQTT_TOPIC, MQTT_MSG)
 


def on_publish(client, userdata, mid):
 print ("Test-data has been published on the broker.")
 mqttc.disconnect()

mqttc = mqtt.Client("python_client")
mqttc.connect(MQTT_HOST, MQTT_PORT, MQTT_KEEPALIVE_INTERVAL)

mqttc.on_publish = on_publish
mqttc.on_connect = on_connect

mqttc.loop_forever()
