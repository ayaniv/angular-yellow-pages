//Lets require/import the HTTP module
var http = require('http');
var fs = require("fs");

//Lets define a port we want to listen to
const PORT=8069; 

//We need a function which handles requests and send response
function handleRequest(request, response){
	var url = request.url.toString();
	if (/^\/[\_\-a-zA-Z0-9\/]*.css$/.test(url)){
   		sendFileContent(response, url.substring(1), "text/css");
	} else if (/^\/[\_a-zA-Z0-9\/]*.js$/.test(url)) {
		sendFileContent(response, url.substring(1), "text/javascript");
	} else if (/^\/[\_a-zA-Z0-9\/]*.(gif|jpg|jpeg|tiff|png)$/.test(url)) {
		sendFileContent(response, url.substring(1), "image");
	} else {
		sendFileContent(response, url.substring(1), "text/html");
	}
}

function sendFileContent(response, fileName, contentType){	
  if (fileName == "klarna") {
  	fileName = 'public/index.html';
  }
  fs.readFile(fileName, function(err, data){
    if(err){
      response.writeHead(404);
      response.write("The resource you are looking for is not found!");
    }
    else{
      response.writeHead(200, {'Content-Type': contentType});
      response.write(data);
    }
    response.end();
  });
}


//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});