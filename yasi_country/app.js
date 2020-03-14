var express = require("express");
var cheerio = require("cheerio");
var superagent = require("superagent");
// Include modules.
var xlsx = require("node-xlsx");
var fs = require("fs");

var app = express();
let len = 0;
let index = 0; //计数器

app.get("/", function(req, res, next) {
    superagent
        .get(
            "https://www.ielts.org/book-a-test/find-a-test-location/location-list/canada/tv"
        )
        .end(async function(err, sres) {
            if (err) {
                return next(err);
            }
            try {
                var $ = cheerio.load(sres.text);
            } catch (error) {
                resolve(null);
                return;
            }

            let postArr = []; //要传出去的变量
            let countryList = $(".custom-select-country option");
            let promiseList = [];
            len = countryList.length;
            for (let i = 0; i < countryList.length; i++) {}
            let result = []; /* 返回数组 */
            for (let i = 0; i < countryList.length; i++) {
                const city = countryList[i];
                let bindFn = getJson.bind(this, city.children[0].data);
                promiseList.push(bindFn);
            }

            result = await PromiseAll(promiseList, 15);

            result.forEach((element, index) => {
                if (element && Array.from(element)) {
                    console.log(index, element);
                    postArr.push(...element);
                }
            });
            console.log(JSON.stringify(postArr));

            // 写入excel之后是一个一行两列的表格
            var data1 = [
                ["centreName", "locationName", "isMachine"]
            ];
            data1.push(
                ...postArr.map(v => {
                    return [v.centreName, v.locationName, v.isMachine];
                })
            );

            var buffer = xlsx.build([{
                name: "sheet1",
                data: data1
            }]);

            fs.writeFileSync("book.xlsx", buffer, { flag: "w" }); // 如果文件存在，覆盖
            res.send(postArr);
        });
});

async function PromiseAll(promises, batchSize = 10) {
    const result = [];
    while (promises.length > 0) {
        let backup = promises.splice(0, batchSize);
        console.log("backup", backup);
        console.log(`剩余数量为${promises.length}`);
        for (let i = 0; i < backup.length; i++) {
            backup[i] = backup[i]();
        }
        const data = await Promise.all(backup).catch(err => {
            console.error(err);
        });
        result.push(...data);
    }
    return result;
}

async function getJson(cityName) {
    return new Promise((resolve, reject) => {
        let s = cityName.toLowerCase();
        console.log("1", s);
        try {
            console.log(`正在执行${cityName}`);
            superagent
                .get(
                    `https://www.ielts.org/book-a-test/find-a-test-location/location-list/${s}/tv`
                )
                .end(function(err, sres) {
                    console.log(`完成请求${cityName}`);
                    if (err) {
                        console.error(`${s}这个请求不了`, err);
                        resolve(null);
                        return;
                    }
                    var $ = cheerio.load(sres.text);
                    let centreNameArr = [];
                    let locationArr = [];
                    let elementPost = [];
                    centreNameArr = $(".item-text--name");
                    locationArr = $(".item-text--location");
                    let resultArr = $(".result-item-title");
                    console.log(centreNameArr);

                    for (let i = 0; i < centreNameArr.length; i++) {
                        const element = centreNameArr[i];
                        elementPost.push({
                            centreName: resultArr[i].children[0].data,
                            locationName: locationArr[i].children[0].data,
                            country: `${s}`,
                            isMachine: element.children.length > 3 ? true : false
                        });
                    }
                    resolve(elementPost);
                });
        } catch (error) {
            console.error("请求异常", error);
            return null;
        }
    });
}

app.listen(3000, function() {
    console.log("app is listening at port 3000");
});