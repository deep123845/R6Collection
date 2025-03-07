const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const app = express();

// Example image URL, replace with your actual URL
const R6URL = "https://r6s.skin/packs/celebration/";
const R6Image = "https://r6s.skin/media/icons/";

async function downloadImage(imageName) {
    if (fs.existsSync(path.join(__dirname, 'data', 'images', imageName))) {
        return;
    }

    try {
        const response = await axios.get(R6Image + imageName, { responseType: 'stream' });
        const writer = fs.createWriteStream(path.resolve(__dirname, 'data', 'images', imageName));
        response.data.pipe(writer);
    } catch (error) {
        console.error(error);
    }
}

async function scrapePage() {
    try {
        const { data } = await axios.get(R6URL);
        const $ = cheerio.load(data);
        const items = [];

        $('a.typeCard').each((index, element) => {
            const name = $(element).find('.name').text().trim();
            const imageUrl = $(element).find('img').attr('src').split('/').pop();

            const onclickContent = $(element).attr('onclick');
            let operatorName = '';
            if (onclickContent.split('<br><br>- ').length >= 2) {
                operatorName = onclickContent.split('<br><br>- ')[1].split('"')[0];
            } else if (onclickContent.split('n: "').length >= 2) {
                operatorName = onclickContent.split('n: "')[1].split(' ')[0];
            }

            let labelCategory = '';
            $(element).parents().each((i, parent) => {
                const label = $(parent).prevAll('p.label').first();
                if (label.length) {
                    labelCategory = label.text().split(' ')[0];
                    return false;
                }
            });

            if (name && imageUrl) {
                items.push({ name, operatorName, labelCategory, imageUrl });
            }
        });

        for (const item of items) {
            downloadImage(item.imageUrl);
        }

        return items;
    } catch (error) {
        console.error("Failed to scrape images:", error);
        return [];
    }
}

const PORT = 3101;
app.listen(PORT, async () => {
    const items = await scrapePage();
    console.log(items);
    console.log(`Server is running on http://localhost:${PORT}`);
});