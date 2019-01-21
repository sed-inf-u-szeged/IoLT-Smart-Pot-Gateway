#!/bin/bash

timestamp () {

date +"%T"

}


while (true)
do
timestamp >> Terheleslog_sima.txt
docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}" --no-stream >> Terheleslog_sima.txt
echo -e "\n\n" >> Terheleslog_sima.txt
sleep 8
done