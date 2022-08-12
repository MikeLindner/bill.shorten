## bill.sh
bill.sh is a miniscule script that creates a simple redirect page in a static website, hosted in an AWS S3 Bucket.

Having your own URL Shortener is all the rage with the cool kids now, so thanks to Bill, you can now have your own!

### You will need:
* An AWS account
* An S3 bucket set up for static web hosting
* The AWS CLI tools on your system
* AWS CLI Credentials validated, logged in.
* Permissions for your CLI to read and write your bucket
* CUSTOMISE the pictures and the code for yourself.

### Installation
* First place all the files except `bill.sh` in your s3 bucket's root.

Then...

* Move `bill.sh` to somewhere in your shell's $PATH

### Running
* Run the bill.sh script however you like.  moved it during "installation" just typing `bill.sh` at the command line should do it!
* Rename the script however you like, it's name doesn't matter at all.

### About the links file

The `randoms` file just needs to be filled with one unique URL-valid value per line.  I used the numbers 100..999 and then randomised them to make things interesting, but you can use words, alphanumeric, whatever you like.  Note that if you repeat a short link you will simply overwrite the previous link.  This may be recoverable with the use of s3 versioning if that's important to you.

***

## Bill Shorten
Bill Shorten is the Member of the Australian Parliament for Maribyrnong.  

Previously Leader of the Australian Labor Party he has also been National Secretary of the Australian Workers Union.

This program has nothing at all to do with Bill, other than being named for him.

