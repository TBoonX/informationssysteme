#!/usr/local/bin/bash -l



#GREPFILE="`wget -qO- http://85.114.130.113/ip`"
##DATE="`date +'%Y %m %d %H %M %S'`"
DATE="`date +'%H:%M:%S %d.%m.%Y'`"
HTMLFILE="/tmp/dude.html"

IP=$( echo $GREPFILE |  grep -Eo '\b[[:digit:]]{1,3}\.[[:digit:]]{1,3}\.[[:digit:]]{1,3}\.[[:digit:]]{1,3}\b' )

echo $GREPFILE > /tmp/grepfile.html
echo "${DATE}: detected ip: ${IP}" >> /tmp/ip.log

echo "<HTML><HEAD><TITLE>dude ip</TITLE><meta http-equiv=\"refresh\" content=\"60\"></HEAD><BODY>dude ip: ${IP} </br>timestamp: ${DATE}</BODY></HTML>" > $HTMLFILE
scp -P44444 $HTMLFILE m@85.114.130.113:/home/m/public_html/dude.html
