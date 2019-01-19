# Smart-pot Gateway

This project was started by the Hungarian Academy of Sciences, in collaboration with the University of Szeged. The goal of
the project was to monitor and collect real-time data from different species of plants, which were implanted in a special
kind of pot, embedded with sensors and a camera.

It was a project that required at least 4 different kind of technology to use, a fraction out of one of those technologies was the gateway-program.

The gateway-program's objective in the project was to enable the researchers to look into the collected data on different kind
of graphs, and also to manage projects that were using these smart-pots.

One could argue that this is the "most important" part of the project, because this is what the researchers see and use.

Since this whole project was specifically crafted and tailored around their requests, a lot of the components are following strict patterns.

This means, for example that the database-names are already given, and are named after the organization.

Please note, that the code of the gateway-program is here only for educative purposes. It is only a fraction of a way bigger
project, with a lot more components, and does not work fully without them.


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
