const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const {env} = require("process");
const app = express();
const PORT = env.PORT || 3000;
app.use(express.json({ limit: '50mb' }));
const imagesFolder = path.join(__dirname, env.IMAGES_DIR || 'images');

if (!fs.existsSync(imagesFolder)) {
    fs.mkdirSync(imagesFolder, { recursive: true });
}

function deleteAllImagesInFolder(folderPath) {
    fs.readdir(folderPath, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlink(path.join(folderPath, file), err => {
                if (err) throw err;
            });
        }
    });
}

async function uploadToCustomService(imagePath) {
//Configure urselft the upload url
}


app.post('/image', async (req, res) => {
    const { imageData } = req.body;
    if (!imageData) {
        return res.status(400).send('No image data provided.');
    }

    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    const imageName = `image-${Date.now()}.png`;
    const imagePath = path.join(imagesFolder, imageName);

    deleteAllImagesInFolder(imagesFolder);

    try {
        console.log('Saving image to:', imagePath);
        fs.writeFileSync(imagePath, imageBuffer);
        
        const uploadResponse = await uploadToCustomService(imagePath);
        const imagePublicUrl = uploadResponse; 

        let googleLensUrl = 'https://lens.google.com/uploadbyurl?url=' + imagePublicUrl;
        console.log('Google Lens URL:', googleLensUrl);
        res.status(200).json({ googleLensUrl });



    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).send('Error processing image or Google Lens search');
    }
});




app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
