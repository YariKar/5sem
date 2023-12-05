const { Builder, By, Key, until } = require('selenium-webdriver');

(async function example() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        // Перейти по URL
        await driver.get('http://localhost:8080/?#/user/Yar');
        let price = "";
        let startBalance = "";
        let curBalance = "";
        let count = 1
        setTimeout(async () => {
            startBalance = await driver.findElement(By.xpath("//div[@id='BrokerMoney']")).getText();
            console.log("get start balance", startBalance)
        }, 4000)
        setTimeout(async () => {
            await driver.findElement(By.xpath("//button[@id='APPL_buy_stock']")).click();
            console.log("click buy")
        }, 6000)
        setTimeout(async () => {
            await driver.findElement(By.xpath("//input[@id='APPL_input_buy']")).sendKeys(count);
            console.log("input count")
        }, 8000)
        setTimeout(async () => {
            price = await driver.findElement(By.xpath("//div[@id='APPL_stock_price']")).getText();
            await driver.findElement(By.xpath("//button[@id='APPL_confirm_buy']")).click();

        }, 10000)
        setTimeout(async () => {
            curBalance = await driver.findElement(By.xpath("//div[@id='BrokerMoney']")).getText();
            console.log(startBalance)
            //console.log(price)
            console.log(curBalance, price)
            if (parseFloat(curBalance).toFixed(2) === (parseFloat(startBalance) - parseFloat(price)).toFixed(2)) {
                console.log("balance right")
            }
        }, 14000)

        //setTimeout(async () => {await driver.findElement(By.xpath("//button[@id='buyStock']")).click()}, 10000)

        /*setTimeout(async () => {await driver.findElement(By.xpath("//button[@id='APPLbuy']")).click()}, 10000)
       setTimeout(async () => {
           price = await driver.findElement(By.xpath("//div[@id='APPLtext']")).getText();
       }, 10000)
       setTimeout(async () => {
           curBalance = await driver.findElement(By.xpath("//div[@id='balance']")).getText();
           console.log(startBalance)
           console.log(price)
           console.log(curBalance)
           if(parseFloat(curBalance)===(parseFloat(startBalance)-parseFloat(price))){
               console.log("balance right")
           }

       }, 10000)*/

        //         let firstResult = await driver.wait(until.element -
        //             Located(By.css('.main__content')), 10000);
        //         console.log("wooorks")
        //         console.log(await firstResult.getAttribute('textContent'));
    } finally {
        //console.log("wooorks");
        //await driver.quit();
    }
})();