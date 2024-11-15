# electron-react-chokidar Starter

## What is this?

> this is a simple starter app utalizing electron, react, webpack and chokidar

## Info

this app simply is a desktop app made with electron that:

- renders a react component `Home.jsx`
- initialize a folder watcher with chokidar; - when first running the app a folder named `watched` will be created in the root directory this folder is being watched with `FSWatcher` which logs changes that happens to it to the console - then an event is sent from the backend (electron app) containing the **event** that happend and the **path** of the file affected (an event meaning a change on the watched folder) as shown below..
  <br>
  <br>

![console output](<screenshots/Screenshot 2024-10-30 211140.png>)
![electron app output](<screenshots/Screenshot 2024-10-30 210757.png>)

## Installaition

```sh
// clone the repository to your local machine
git clone https://github.com/Obaida00/electron-react-chokidar.git

// cd to the repo folder
cd electron-react-chokidar

// install required node packages
npm install

// run the app
npm start
```
