#!/bin/bash
tput civis
clear
rm /tmp/out.tmp

num=1

for i in $(aws s3 ls s3://mikes.page/ | \
	awk '{print substr($0, index($0, "PRE")+length("PRE"))}' | \
	grep -v "^22|^23" | \
	sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'); 
	
do ((num++)); echo -n $i >> /tmp/out.tmp; 
	curl --silent https://mikes.page/$i | \
	# ONLY THE window-location LINE, MINUS THE WORDS "window-location"
	grep window.location  | \
	sed 's/window.location = //' >> /tmp/out.tmp ;
	# PRINT PROGRESS
	printf "%s\r" "getting data $num" ;
	
	done
	sed -i '$d' /tmp/out.tmp
		
echo

id_width=21
link_width=85

awk -v id_width="$id_width" -v link_width="$link_width" -F'"' 'BEGIN {

###############   TOP   LINE   ############################
		printf("+");
		for (i=1; i<=id_width+2; i++) printf("-"); printf("+");
	  	for (i=1; i<=link_width+2; i++) printf("-"); printf("+");printf("\n");

###############   HEADING   ############################
		printf("| %-*s | %-*s |\n", id_width, "Identifier", link_width, "URL");printf("|");

###############   HEADING   LINE   ############################
		for (i=1; i<=id_width+2; i++) printf("-"); printf("+");
	  	for (i=1; i<=link_width+2; i++) printf("-"); printf("+");printf("\n");
	}
	{ 
###############   DATA   LINES   ############################
		printf("| %-*s | %-*s |\n", id_width, $1, link_width, $2)
#		for (i=1; i<=id_width+3; i++) printf("-"); printf("+");
#	  	for (i=1; i<=link_width+2	; i++) printf("-"); printf("+");printf("\n");
	}
END {###############   END   LINE   ############################
		printf("+");
		for (i=1; i<=id_width+2; i++) printf("-"); printf("+");
	  	for (i=1; i<=link_width+2; i++) printf("-"); printf("+");printf("\n");
 }' < /tmp/out.tmp
tput cnorm
