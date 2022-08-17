const PORT = 8000
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const app = express()
const dotenv = require("dotenv");
// init env file
dotenv.config();

const initalPage = 2
const maxPageNumber = process.env.Max_Page_Count
var maxPageCount = [] 
var addItemsPerPage = []
var getTotalAdsCountPerPage = []
var getTructItemPerPage = []

const url = 'https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz'

app.get('/', function (req, res) {
    res.json('This is my webscraper')
})


function scrapNumberOfPages(){
    for(let i = 0; i< Number(maxPageNumber); i++){
        maxPageCount.push(i+1)
    }
    console.log(maxPageCount)
}

async function getNextPageUrl(pageNumber) {
    console.log("pageNumber",typeof(pageNumber))
    let data 
    try {
        if(pageNumber==1){
            console.log("ASHDAHSDHASDh")
            let url = `https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz`
            await axios.get(url).then(response=>{
                data = response.data
            })
        }else {
            console.log("ASHDAHSDHASDh1111")

            let url = `https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz?page=${pageNumber}`
            axios.get(url, (req, res) => {
                axios(url)
                    .then(response => {
                        data = response.data
                    })
                })
        }
    return data
    }catch(err){
        console.log("error",err)
    }
}

async function getTotalAdsCount($,html,pageNumber){
    console.log('pageNumber',pageNumber)
    let initalAdsThisPage = 0
    $('.ooa-aolmt8.e1b25f6f17', html).each(function () { //<-- cannot be a function expression
        const id = $(this).attr('id')
        if(id){
            initalAdsThisPage++
        }
    })
    let pageCountJson = {}
    pageCountJson[`page ${pageNumber}`] = initalAdsThisPage
    getTotalAdsCountPerPage.push(pageCountJson)
    return getTotalAdsCountPerPage
}

async function addItems($,html){

     $('.ooa-aolmt8.e1b25f6f17', html).each(function () { //<-- cannot be a function expression
                console.log("HERE")
                const title = $(this).text()
                const url = $(this).find('a').attr('href')
                const id = $(this).attr('id')
                addItemsPerPage.push({"URL" : url, "ID":id})
                // console.log(title)
                // const url = $(this).find('a').attr('href')
                // articles.push({
                //     title,
                //     url
                // })
            })
    return addItemsPerPage
}

async function scrapeTruckItem($,html){
    let cnt = 0
    $('.ooa-aolmt8.e1b25f6f17', html).get().map(ele=>{
        let id = $(ele).attr('id')
        let tempTractInfo = {}
        let title = $(ele).find('.e1b25f6f12.ooa-1mgjl0z-Text.eu5v0x0').text()
        let price = $(ele).find('.ooa-epvm6.e1b25f6f7').text()
        console.log('price',price)
        tempTractInfo['item'] = id 
        tempTractInfo['title'] = title 
        tempTractInfo['price'] = price 
        $(ele).find('.ooa-qhdd6a.e1teo0cs0').get().map((item,index)=>{
            if(Number(index)%2==0){
                console.log("item",item.children[0].data)
                    tempTractInfo['registration'] = item.children[0].data
                    tempTractInfo['registration'] = item.children[0].data
                    tempTractInfo['registration'] = item.children[0].data
            }
        })
    
    })

    // $('.ooa-aolmt8.e1b25f6f17', html).each(function () { //<-- cannot be a function expression
    //     // let title = $(this).find('.e1b25f6f12.ooa-1mgjl0z-Text.eu5v0x0').text()
    //     // console.log("idk",idk)
    //     let asd = $(this).find('.ooa-qhdd6a.e1teo0cs0').get().map((item,ele)=>{
    //         console.log("item",ele,item.children[0].data)
    //     })
        
        
    // })
return getTructItemPerPage
}

app.get('/results',async (req, res) => {
    await Promise.all(maxPageCount.map(async (index) =>
    scrapPageData(index)))

        async function scrapPageData(index) {
            console.log('index',index)
            let pageHTML = await getNextPageUrl(index)
            const $ = cheerio.load(pageHTML);
            // let  getAddItems = await addItems($,pageHTML)
            // let getTotalAdsCountsss = await getTotalAdsCount($,pageHTML,index)
            let getAllScrapeTructItem = await scrapeTruckItem($,pageHTML)
            res.send(getAllScrapeTructItem) 
        }

        //     const html = response.data
        //     const $ = cheerio.load(html);
        //     const articles = []
        //     // $('.ooa-aolmt8 e1b25f6f17').each((index , element) => {
        //     //     console.log("HERE")
        //     // })
        //     $('.ooa-aolmt8.e1b25f6f17', html).each(function () { //<-- cannot be a function expression
        //         console.log("HERE")
        //         const title = $(this).text()
        //         const url = $(this).find('a').attr('href')
        //         const id = $(this).attr('id')
        //         console.log("url",url)
        //         console.log("ID",id)
        //         // console.log(title)
        //         // const url = $(this).find('a').attr('href')
        //         // articles.push({
        //         //     title,
        //         //     url
        //         // })
        //     })
        //     res.json(html)

})
scrapNumberOfPages()
app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))

