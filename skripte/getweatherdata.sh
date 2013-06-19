#!/usr/local/bin/bash

cd /home/m/wetter
rm -f derived-stations.txt*
## wetterdaten ermitteln
wget ftp://ftp.ncdc.noaa.gov./pub/data/igra/derived-v2/derived-stations.txt
#RESULT="`wget -qO- ftp://ftp.ncdc.noaa.gov./pub/data/igra/derived-v2/derived-stations.txt`"
#echo $RESULT | grep ^GM

##                          nur deutsche stationen
#cat derived-stations.txt | grep ^GM | awk '{print $2}' > stationids.txt

## urls der wetterstationsdaten richtig zusammenbauen:
rm -rf batchdownload.sh
## alte wetterdaten
#cat derived-stations.txt | grep ^GM | awk '{print "wget ftp\://ftp\.ncdc\.noaa.gov\./pub/data/igra/derived-v2/data-por/"$2"\.dat\.gz"}' > batchdownload.sh
cat derived-stations.txt | awk '{print "wget ftp\://ftp\.ncdc\.noaa.gov\./pub/data/igra/derived-v2/data-por/"$2"\.dat\.gz"}' > batchdownload.sh

## neu von kurt
cat derived-stations.txt | awk '{print "wget ftp\://ftp\.ncdc\.noaa\.gov\./pub/data/igra/data-y2d/"$2"\.dat\.gz"}' > batchdownload-y2d.sh


chmod 755 batchdownload.sh

