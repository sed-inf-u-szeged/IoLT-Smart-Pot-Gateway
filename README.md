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

## Built With

* [NodeJS](https://nodejs.org/en/) - The java-script runtime
* [Express](https://expressjs.com/) - Web framework used with NodeJS
* [Pug](https://pugjs.org/api/getting-started.html) - HTML renderer
* [Mongoose](https://mongoosejs.com/) - MongoDB communication interface
