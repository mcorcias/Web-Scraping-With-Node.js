const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')
const writeStream = fs.createWriteStream('data.csv')
writeStream.write("\ufeff");
writeStream.write('שם הרשת, שם החנות,כתובת,מבצע,מחיר \n')
let region = 'קריית חיים'
let barcode = 'שוקולד פרה'

request( encodeURI(`https://chp.co.il/${region}/0/0/${barcode}/0`),(error,response,html)=>{
    if(!error && response.statusCode == 200){
        const $ = cheerio.load(html)

       const table = $('#compare_results #results-table tbody tr')
       const table_online_stores = $('#compare_results .results-table').eq(1)
       
        table.each((i,el)=>{
            if(i%2==0){
                let deal
                const market_name = $(el).children()[0].firstChild.data
                const store_name = $(el).children()[1].firstChild.data
                const address = $(el).children()[2].firstChild.data.replace(/,/g, '')
                if($(el).children()[3].firstChild.attribs){
                    deal = $(el).children()[3].firstChild.attribs['data-discount-desc'].split('<BR>').join(' ')
                }else{
                    deal = 'לא קיים מבצע'
                }
                const price = $(el).children()[4].firstChild.data
                writeStream.write(`${market_name}, ${store_name}, ${address},${deal}, ${price} \n`)
            }
        });
        table_online_stores.find('tbody tr').each((i,el)=>{
            let deal
            const market_name = $(el).children()[0].firstChild.data
            const store_name = $(el).children()[1].firstChild.data || "חנות אינטרנטית"
            const address = $(el).children()[2].firstChild.data.replace(/,/g, '')
            if($(el).children()[3].firstChild.attribs){
                deal = $(el).children()[3].firstChild.attribs['data-discount-desc'].split('<BR>').join(' ')
            }else{
                deal = 'לא קיים מבצע'
            }
            const price = $(el).children()[4].firstChild.data
            writeStream.write(`${market_name}, ${store_name}, ${address},${deal},${price} \n`)
        })

        console.log('finish');

      
        

        


    }
})