# imagesearch-api
written in response to <https://www.freecodecamp.com/challenges/image-search-abstraction-layer>
basically provides an abstraction layer over google-images

## Usage
Requires mongodb to running
and a custom google-search-engine setup.
see <https://www.npmjs.com/package/google-images> for instructions on how to do this 
```bash
  node server.js
```
and in other terminal
```bash
 curl http://0.0.0.0:8080/search/lolcats
 # Will perform the search
 # and to check the most recent searches
 curl http://0.0.0.0:8080/latest
```
 
