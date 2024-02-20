# Jklm.Lens

A script using Google Lens to detect the movie, the image from jklm.fun.

## Installation

Start by installing the [Tampermonkey for chrome](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) or [Tampermonkey for firefox](https://addons.mozilla.org/fr/firefox/addon/tampermonkey/) extension for your browser.

Then click on the **Create new script** button below to install the script.

![Install](https://maxsteel.karibsen.fr/image/61e044ad34f4ce2002fc19a01af97d60.png)

You'll be redirected to the Tampermonkey extension page, click **+**.

And add the following script:

```javascript
base64.js
```

Once this is installed, you need to set up a server that will communicate with the `base64.js` script to decode the image into base64, and upload it to a server like Imgur or similar.

*Personally, I use a private server for this task.

### Installing the server

To install the server, you need to have [Node.js](https://nodejs.org/en/) installed on your machine.

Then download the [jklm-lens-server](https://github.com/D3ller/jklm.fun-google-lens) project and install the dependencies with the `npm install` command.

Run the server either via nodemon or node.

```bash
nodemon index.js
```

or

```bash
node index.js
```

The console will display the server address. The server runs on port 7777 by default.
    
```bash
Server started on http://localhost:7777
```

### Script configuration

To modify the server configuration, use the `.env` file in the project root.

```env
PORT=7777
IMG_DIR=images
API_KEY=YOUR_API_KEY
```

## Usage

Once the script has been installed, you can go to [jklm.fun](https://jklm.fun) and visit a PopSauce game.

When the image is displayed, a google lens tab automatically launches and displays the result. The result is also stored in your clipboard. If the result is not exact, copy it yourself into Google Lens to get a more accurate result.


## Example

[![Jklm.Lens](https://i9.ytimg.com/vi/ZpxQzhyCyXQ/mqdefault.jpg?sqp=CKSs0a4G&rs=AOn4CLCiUMeal3sq2YJh-o3rLMAlnNNwww&retry=4)](https://youtu.be/ZpxQzhyCyXQ)

## Improvement

If you have any ideas for improvements or bugs to report, don't hesitate to open an issue.
