// var ClickableMap = require('../src/clickable_map');

// test('Set global data and make sure settings are retained', () => {
//     var map = ClickableMap.create('dummy');
//     newGlobalData = {
//         width: '50',
//         widthUnits: '%',
//         fontSize: '14px',
//         fontName: 'Verdana',
//         fill: '#aaaaaa',
//         hoverFill: '#bbbbbb',
//         disabledFill: '#cccccc',
//         backgroundFill: '#dddddd',
//         innerLabelColor: '#eeeeee',
//         outerLabelColor: '#ffffff',
//         hoverLabelColor: '#000000',
//         borderType: '3,5',
//         borderStroke: '#111111',
//         enableShadows: false,
//         popLink: true,
//         showStateTitleAndDescOnHover: false,
//         showLinksList: false,
//         globalLinkUrl: '/test/url',
//         globalJsCallback: 'call_function',
//         mapTitle: 'test1',
//         creditLink: 'test2'
//     }
//     map.setGlobalData(newGlobalData);
//     var checkData = map.getGlobalData();
//     for(const prop in newGlobalData) {
//         expect(newGlobalData[prop]).toBe(checkData[prop]);
//     }
// });