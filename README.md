# IoLT Smart Pot Gateway

The Internet of Living Things (IoLT) project was launched in 2017 to integrate IoT technological research with applied research on specific, biological applications, with the collaboration of the University of Szeged and the Biological Research Institute of the Hungarian Academy of Sciences. One of the goals of this project is to develop a low cost plant phenotyping platform for small sized plants. The proposed IoLT Smart Pot is capable of monitoring environmental parameters by sensors placed above the plants and into the pots. An IoT device based on a Raspberry Pi board is placed under a pot, and the sensors are connected to it. 

This opensource project contains the IoT-Cloud gateway of our platform used for receiving, storing, visualizing and downloading the monitored parameters sent by the IoT devices of the pots.

It uses four different kinds of IoT and Cloud technology. The default component names (database, sensor, etc.) were named after the participating organizations. Please note, that the code of the gateway program is only for educational and academic purposes. It contains only a fraction of the IoLT project stack, it may not work fully without them.


## Getting Started

To get the gateway-program up and running, you need a NodeJS environment. Get the latest stable version at:

https://nodejs.org/en/


### Prerequisites

After you got both of them up and running, you should get the required node packages. Node environments have their own
package manager, the Node Package Manager, and you can call it in your command line (or terminal window) with the "npm" command.

Simply navigate to the folder of the gateway-program, and install the following packages:

 - express
 - express-session
 - mongoose
 - pug

To give you an example how should the commands look like, i'll give you an example, use:

```
npm install express
```

To install the first required module. Switch out the package name at the end of the command to install the other required packages.

### Running the program

Go to the gateway-program's folder with a command line (or terminal window), and use the command:

```
node index.js
```

To start the gateway-program. After it says the gateway is listening on port 3000, you're good to go.

Don't forget that since it is started in a terminal/command line window, the program will cease to run if you close it.

### Usage

Open your favorite web browser, and type 'localhost:3000' or '127.0.0.1:3000' to the URL bar. If you see the log-in window,
it is up and running.

## Dockerizing

To get more information about what docker is, please visit:

https://www.docker.com/


To dockerize the gateway-program, you are going to need a dockerfile. 

You can make your own dockerfile for it, but it is recommended to use the one I provided in the 'extra' directory. Go to the 'extra/docker/'
directory in your local copy, and copy or move the Dockerfile into the root directory.

After it is done, open a terminal/command prompt in the root directory, and run the following command:

```
docker build -t my_gateway_program .
```

to build the docker image of the gateway-program. After it is done, your image's name will be: my_gateway_program.

### Running a container from the image

To get an example of the gateway-program running, we need to create a container from the previously created image. To do this, simply run the following command:

```
docker run --name my-gateway-container --network my-network -p 3000:3000 -d my-gateway-program
```

This command creates a copy of the software (container), with the name 'my-gateway-container', adds the container to the 'my-network' inner docker-network, binds the
host machine's port number 3000 to the container's port number 3000, specifies to run the container as a daemon, and specifies the image 'my-gateway-program' as its core.



After this, since the port number 3000 is binded to the recently created container on your host machine, if you refer to the port 3000 in any way and/or in any program, it will point to
this container's port 3000.

This means if you open a web browser, and type in: 'localhost:3000' to the URL bar, it will work exactly like the un-dockerized version of the gateway-program, but now the communication
goes through the docker-environment. End-users notice nothing about this, though.





## Built With

* [NodeJS](https://nodejs.org/en/) - The java-script runtime
* [Express](https://expressjs.com/) - Web framework used with NodeJS
* [Pug](https://pugjs.org/api/getting-started.html) - HTML renderer
* [Mongoose](https://mongoosejs.com/) - MongoDB communication interface
