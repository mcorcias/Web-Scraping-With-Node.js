const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')
const writeStream = fs.createWriteStream('data.csv')
writeStream.write("\ufeff");
writeStream.write('שם הרשת, שם החנות,כתובת, מחיר \n')
let region = 'חיפה'
let barcode = '7290005896835'
request( encodeURI(`https://chp.co.il/${region}/0/0/${barcode}/0`),(error,response,html)=>{
    
    if(!error && response.statusCode == 200){
        const $ = cheerio.load(html)

       const table = $('#compare_results .results-table tbody tr')
       
        table.each((i,el)=>{
            if(i%2==0){
                const market_name = $(el).children()[0].firstChild.data
                const store_name = $(el).children()[1].firstChild.data
                const address = $(el).children()[2].firstChild.data.replace(/,/g, '')
                const price = $(el).children()[4].firstChild.data
                writeStream.write(`${market_name}, ${store_name}, ${address}, ${price} \n`)
            }
        });
        

        


    }
})