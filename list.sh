#!/bin/bash
tput civis  # hide cursor


## Create a list of index.html files with their prefix
aws s3 ls s3://mikes.link --recursive | grep index.html > /tmp/temp.out
awk '{print $4}' /tmp/temp.out > /tmp/list.out

## loop through the list file and get the redirect out of the index file

for i in $(cat /tmp/list.out)

do ((num++)); echo -n $i >> /tmp/out.tmp; 
	curl https://mikes.link/$i;	
done



#cat /tmp/list.out
tput cnorm # show cursor