This is a web interface to AWS S3 made with React.

The files are uploadded using the multipart method. It's much more reliable than the regular method.
The files are sent directly to S3 in small chunked parts.
If one chunk fails, the browser doesn't have to resend the whole file but just the failed chunk.


The back-end is in ruby on rails but it should be easy to make a different back-end.
The most interesting part of this project is the front-end.

### Features :
* Browse files and folders
* upload files
* create folders
* delete files and folders


At the moment it looks like that: 
![screenshot](https://raw.githubusercontent.com/Kalagan/react-s3-chunk-upload/master/pic.png)


#### TODO :
* sorting by name or size
* cut and paste (rename)
* copy and paste
* download file


##### Major dependencies :
* EvaporateJS <https://github.com/TTLabs/EvaporateJS>
* React
* aws-sdk (the ruby gem)