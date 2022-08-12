#!/bin/bash

# get link and details
echo -n "Please enter URL: " && read urlink
echo -n "Enter Title: " && read destitle

# now get the list of available short links
aws s3 cp --quiet s3://mikes.link/randoms /tmp

# pop the top short link into linknumber
linknumber=$(head -1 /tmp/randoms)
sed '1d' /tmp/randoms > /tmp/randoms2
mv /tmp/randoms2 /tmp/randoms

# create index page
echo "
<!doctype html>
<html lang=\"en\">

    <head>
        <meta charset=\"utf-8\">
        <title>$destitle</title>
        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">
        <link rel=\"stylesheet\" href=\"../mikes.link.css\">
        <meta property="og:image" content="../star.png" />
        <script type = \"text/javascript\">
            window.location = \"$urlink\";
        </script>  
    <head>

    <body>
        <img src=\"star.png\" alt=\"star\"/>
        <br><br><br>
        <p><a href=\"https://mikelindner.com\">by mikelindner.com</a></p>
    </body>

</html>
" > /tmp/index.html

# upload index page
aws s3 cp --quiet /tmp/index.html s3://mikes.link/$linknumber/

# put the list of available links back up
aws s3 cp --quiet /tmp/randoms s3://mikes.link/

# clean up
rm /tmp/index.html
rm /tmp/randoms

echo "https://mikes.link/$linknumber"

