## bill.sh
##### A Very Tiny URL Shortener
bill.sh is a miniscule script, only 12 active lines, that creates a simple redirect page on a static website, hosted in an AWS S3 Bucket.

Having your own URL Shortener is all the rage with the cool kids now, so thanks to Bill, you can now have your own!  This one is pretty agricultural :) There are no bells and whistles, but it totally works, each object can take 5,500 hits per second with eleven-nines reliability.  What's not to love about S3!

![Demo](https://raw.githubusercontent.com/MikeLindner/bill.shorten/master/en_operation.png)

<a href="https://mikes.link/929">https://mikes.link/929<a>

```html
<!doctype html>
<html lang="en">

    <head>
        <meta charset="utf-8">
        <title>Bill!</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="../mikes.link.css">
        <meta property=og:image content=../star.png />
        <script type = "text/javascript">
            window.location = "https://en.wikipedia.org/wiki/Bill_Shorten";
        </script>  
    <head>

    <body>
        <img src="star.png" alt="star"/>
        <br><br><br>
        <p><a href="https://mikelindner.com">by mikelindner.com</a></p>
    </body>

</html>
```
Source of `https://mikes.link/929/index.html`

### You will need:
* An AWS account
* An S3 bucket set up for static web hosting
* The AWS CLI tools on your local system
* AWS CLI Credentials validated, logged in
* Permissions for your CLI to read and write your bucket
* CUSTOMISE the pictures and the code for yourself

### Installation
* First place all the files except `bill.sh` in your s3 bucket's root.

Then...

* Move `bill.sh` to somewhere in your shell's $PATH

### Running
* Run the bill.sh script however you like.  Because we moved it during "installation" just typing `bill.sh` at the command line should do it!  I go one quantum further and create a symlink so I can just type "bill".
* Rename the script however you like, it's name doesn't matter at all.
* Remember: the randoms file and the actual links all reside in your s3 bucket, so deleting anything locally won't hurt it.

### About the links file

The `randoms` file just needs to be filled with one unique URL-valid value per line.  I used the numbers 100..999 and then randomised them to make things interesting, but you can use words, alphanumeric, whatever you like.  Note that if you repeat a short link you will simply overwrite the previous link.  This may be recoverable with the use of s3 versioning if that's important to you.

***

## Bill Shorten
Bill Shorten is the Member of the Australian Parliament for Maribyrnong.
Previously Leader of the Australian Labor Party, he has also been National Secretary of the Australian Workers Union.

<p align="center">🇦🇺 This program has nothing at all to do with Mr Shorten, other than being named for him.  On Ya Bill 😂👍 </p>
