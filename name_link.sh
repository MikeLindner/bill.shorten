#!/bin/bash

# get link and details
echo -n "URL: " && read urlink
echo -n "Title: " && read destitle
echo -n "ShortLink: " && read shortlink

# create index page
echo "
<!doctype html>
<html lang=\"en\">

    <head>
        <meta charset=\"utf-8\">
        <title>$destitle</title>
        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">
        <link rel=\"stylesheet\" href=\"../mikes.page.css\">
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
aws s3 cp --quiet /tmp/index.html s3://mikes.page/$shortlink/ --profile mikes.page

# clean up
rm /tmp/index.html

echo "https://mikes.page/$shortlink"

