#!/bin/bash

timestamp () {

date +"%T"

}


while (true)
do
timestamp >> Terheleslog_suru.txt
docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}" --no-stream >> Terheleslog_suru.txt
echo -e "\n\n" >> Terheleslog_suru.txt
done