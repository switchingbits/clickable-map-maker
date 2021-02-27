it('should do stuff', async() => {
    const chrome = require('selenium-webdriver/chrome');
    const { Builder, By, Key, until } = require('selenium-webdriver');
    
    const width = 640;
    const height = 480;
    const testUrl = 'http://cmmexample/example/example.shtml';
    let driver = new Builder()
        .forBrowser('chrome')
        .setChromeOptions(
            new chrome.Options().headless().windowSize({ width, height })
        )
        .build();
    await driver.get(testUrl);

    // // Set field attributes (colors first)
    // await driver.findElement(By.id('background-fill')).sendKeys("#0000ff");
    // await driver.findElement(By.id('fill')).sendKeys("#00ff00");
    // await driver.findElement(By.id('hover-fill')).sendKeys("#ff0000");
    // //await driver.findElement(By.id('disabled-fill')).sendKeys("#000000"); -- Can't be tested yet
    // await driver.findElement(By.id('hover-label-color')).sendKeys("#000000");
    // await driver.findElement(By.id('inner-label-color')).sendKeys("#0000ff");
    // await driver.findElement(By.id('outer-label-color')).sendKeys("#00ff00");
    // await driver.findElement(By.id('border-stroke')).sendKeys("#ff0000");
    // await driver.findElement(By.id('width')).clear();
    // await driver.findElement(By.id('width')).sendKeys('75');
    // await driver.findElement(By.css('#width-units > option[value=\'%\']')).click();
    // await driver.findElement(By.css('#font-name > option[value=\'Tahoma\']')).click();
    // await driver.findElement(By.css('#font-size > option[value=\'12px\']')).click();
    // await driver.findElement(By.css('#border-type > option[value=\'3,5\']')).click();
    // await driver.findElement(By.id('map-title')).clear();
    // await driver.findElement(By.id('map-title')).sendKeys('<b>Title trick');
    
    // Map global width, font family, font size, background color
    var mapDiv = await driver.findElement(By.id('cmm-usa'));
    expect(await mapDiv.getCssValue('width')).toEqual('800px');
    expect(await mapDiv.getCssValue('font-family')).toEqual('Arial');
    expect(await mapDiv.getCssValue('font-size')).toEqual('12px');
    expect(await mapDiv.getCssValue('background-color')).toEqual('rgba(255, 255, 255, 1)');

    // State hover fill, hover label color
    var sampleState = await driver.findElement(By.css('#cmm-usa .cmm-usa-state-vt path'));
    await driver.actions().move({x: 1, y: 1, origin: sampleState}).perform();
    expect(await sampleState.getCssValue('fill')).toEqual('rgb(255, 255, 255)');
    var sampleStateHoverLabel = await driver.findElement(By.css('#cmm-usa .cmm-usa-state-vt text'));
    expect(await sampleStateHoverLabel.getCssValue('fill')).toEqual('rgb(214, 73, 51)');

    // Outer and inner state label color
    var sampleOuterStateLabel = await driver.findElement(By.css('#cmm-usa .cmm-usa-state-nj text'));
    expect(await sampleOuterStateLabel.getCssValue('fill')).toEqual('rgb(0, 0, 0)');
    var sampleInnerStateLabel = await driver.findElement(By.css('#cmm-usa .cmm-usa-state-ny text'));
    expect(await sampleInnerStateLabel.getCssValue('fill')).toEqual('rgb(255, 255, 255)');

    // State borders
    expect(await sampleState.getCssValue('stroke-dasharray')).toEqual('none');
    expect(await sampleState.getCssValue('stroke')).toEqual('rgb(34, 85, 136)');

    // Disabled state background color
    var co = await driver.findElement(By.css('#cmm-usa .cmm-usa-state-co path'));
    expect(await co.getCssValue('fill')).toEqual('rgb(194, 194, 194)');
    
    // Map title
    var mapTitle = await driver.findElement(By.css('#cmm-usa .cmm-usa-title'));
    expect(await mapTitle.getText()).toEqual('Select state');

    // Credit link
    var creditLink = await driver.findElement(By.css('.cmm-usa-credit-link'));
    expect(await creditLink.getText()).toEqual('Credit link');

    // State accessibility desc
    var alabamaDesc = await driver.findElement(By.css('#cmm-usa .cmm-usa-state-al desc'));
    expect(await alabamaDesc.getText()).toEqual('Short accessibility description');

    // State mouseover description
    var alabama = await driver.findElement(By.css('#cmm-usa .cmm-usa-state-al'));
    await driver.actions().move({x: 1, y: 1, origin: alabama}).perform();
    var hoverDesc = await driver.findElement(By.css('#cmm-usa .cmm-usa-hover-state-info span:first-of-type'));
    expect(await hoverDesc.getText()).toEqual('Alabama');

    // Check state linkover
    var sampleLink = await driver.findElement(By.css('#cmm-usa .cmm-usa-state-ny'));
    await driver.actions().click(sampleLink).perform();
    expect(await driver.getCurrentUrl()).toEqual('http://cmmexample/example/link/to/NY');
    await driver.navigate().back();

    // Check state override linkover
    alabama = await driver.findElement(By.css('#cmm-usa .cmm-usa-state-al'));
    await driver.actions().click(alabama).perform();
    expect(await driver.getCurrentUrl()).toEqual('http://www.example.com/');
    await driver.navigate().back();

    // State override colors
    alabama = await driver.findElement(By.css('#cmm-usa .cmm-usa-state-al'));
    var alabamaPath = await driver.findElement(By.css('#cmm-usa .cmm-usa-state-al path'));
    expect(await alabamaPath.getCssValue('fill')).toEqual('rgb(255, 0, 0)');
    await driver.actions().move({x: 1, y: 1, origin: alabama}).perform();
    expect(await alabamaPath.getCssValue('fill')).toEqual('rgb(0, 255, 0)');
    
    // // Map title
    // var mapTitle = await driver.findElement(By.css('#cmm-usa .cmm-usa-title'));
    // expect(await mapTitle.getText()).toEqual('<b>Title trick');

    // // State fills and label hover on/off
    // var sampleOuterStateLabel = await driver.findElement(By.css('#cmm-usa .cmm-usa-state-vt text'));
    // expect(await sampleOuterStateLabel.getCssValue('fill')).toEqual('rgb(0, 255, 0)');
    // var sampleInnerStateLabel = await driver.findElement(By.css('#cmm-usa .cmm-usa-state-ny text'));
    // expect(await sampleInnerStateLabel.getCssValue('fill')).toEqual('rgb(0, 0, 255)');
    // var sampleState = await driver.findElement(By.css('#cmm-usa .cmm-usa-state-vt path'));
    // expect(await sampleState.getCssValue('fill')).toEqual('rgb(0, 255, 0)');
    // await driver.actions().move({x: 1, y: 1, origin: sampleState}).perform();
    // expect(await sampleState.getCssValue('fill')).toEqual('rgb(255, 0, 0)');
    // expect(await sampleOuterStateLabel.getCssValue('fill')).toEqual('rgb(0, 0, 0)');

    // // Border
    // expect(await sampleState.getCssValue('stroke-dasharray')).toEqual('3px, 5px');

    expect("ee").toEqual('ee');
})
