var webpackJsonp = webpackJsonp || null;
JSON.tryParse = function(data) {
    try {
        return JSON.parse(data)
    } catch {
        return null
    }
}
window.BBExpr = f => ((10-f*0.2)/10).toFixed(2)
window.SSExpr = f => ((10-f*0.2)/10).toFixed(2)
window.BB = JSON.tryParse(localStorage.getItem('BB')) || Array.from(Array(10).keys()).map(window.BBExpr)
window.SS = JSON.tryParse(localStorage.getItem('SS')) || Array.from(Array(10).keys()).map(window.SSExpr)
function setRateBuys() {
    var response = prompt('Rate buys, vd: 1 0.9 .. 0.1 hoặc expr: i => (10 - i * 0.2) / 10')
    if (response) {
        if (response.trim().indexOf('i') == 0) {
            window.BBExpr = eval(response)
            window.BB = Array.from(Array(10).keys()).map(window.BBExpr)
        } else {
            BB = response.split(/,|\s/).filter(f => f != '')
        }
    }
    else {
        BB = Array.from(Array(10).keys()).map(f => ((10-f*0.2)/10).toFixed(2))
    }
    localStorage.setItem('BB', JSON.stringify(BB))
}
function setRateSells() {
    var response = prompt('Rate sells, vd: 1 0.9 .. 0.1 hoặc expr: i => (10 - i * 0.2) / 10')
    if (response) {
        if (response.trim().indexOf('i') == 0) {
            window.SSExpr = eval(response)
            window.SS = Array.from(Array(10).keys()).map(window.BBExpr)
        } else {
            SS = response.split(/,|\s/).filter(f => f != '')
        }
    }
    else {
        SS = Array.from(Array(10).keys()).map(f => ((10-f*0.2)/10).toFixed(2));
    }
    localStorage.setItem('SS', JSON.stringify(SS))
}

addScript('https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js', () => {
    addCss('https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css')
    webpackJsonp && webpackJsonp([1], [function(e, t, a) {
        window.aa = a
        window.chart = a(127)
        function listener (futureCode) {
            return function (data) {
                let futureCodeClass = '.vn30f-' + futureCode;
                if (data.totalBidQtty) {
                    console.log(data)
                    let bidQttyKeys = Array.from(Array(10).keys()).map(i => 'bidQtty' + `${i + 1}`.padStart(2, '0'))
                    let bidPriceKeys = Array.from(Array(10).keys()).map(i => 'bidPrice' + `${i + 1}`.padStart(2, '0'))
                    let offerQttyKeys = Array.from(Array(10).keys()).map(i => 'offerQtty' + `${i + 1}`.padStart(2, '0'))
                    let offerPriceKeys = Array.from(Array(10).keys()).map(i => 'offerPrice' + `${i + 1}`.padStart(2, '0'))
                    let totalBidQtty10 = bidQttyKeys.map(f => parseFloat(data[f]) * 10).reduce((a,b) => a + b, 0)
                    let total10BidPrice = bidPriceKeys.map(f => parseFloat(data[f]) * 1000).reduce((a,b) => a + b, 0)
                    let totalOfferQtty10 = offerQttyKeys.map(f => parseFloat(data[f]) * 10).reduce((a,b) => a + b, 0)
                    let total10OfferPrice = offerPriceKeys.map(f => parseFloat(data[f]) * 1000).reduce((a,b) => a + b, 0)
    
                    let totalBid10cost = Array.from(Array(10).keys()).map(i => {
                        if (data['bidPrice' + `${i + 1}`.padStart(2, '0')] == "") return 0;
                        let bid = (parseFloat(data['bidQtty' + `${i + 1}`.padStart(2, '0')]) * 10).toFixed(1),
                            price = (parseFloat(data['bidPrice' + `${i + 1}`.padStart(2, '0')]) * 1000).toFixed(1),
                            rate = window.BB[i]
                        return bid * price * rate;
                    }).reduce((a,b) => a+b, 0.0)
    
                    let totalOffer10cost = Array.from(Array(10).keys()).map(i => {
                        if (data['offerPrice' + `${i + 1}`.padStart(2, '0')] == "") return 0;
                        let bid = (parseFloat(data['offerQtty' + `${i + 1}`.padStart(2, '0')]) * 10).toFixed(1),
                            price = (parseFloat(data['offerPrice' + `${i + 1}`.padStart(2, '0')]) * 1000).toFixed(1),
                            rate = window.SS[i];
                        return bid * price * rate;
                    }).reduce((a,b) => a+b, 0.0)
    
                    let oldSumBid = $(futureCodeClass).find('.sumbid').data('prev') || 0;
                    if (oldSumBid != data.totalBidQtty) {
                        console.log(oldSumBid, addCommas(data.totalBidQtty), oldSumBid - data.totalBidQtty)
                        $(futureCodeClass).find('.sumbid').text(addCommas(data.totalBidQtty * 10))
                        $(futureCodeClass).find('.sumbid').css('background-color', oldSumBid < data.totalBidQtty ? increaseColor : decreaseColor)
                        $(futureCodeClass).find('.sumbid').data('prev', data.totalBidQtty);
                    }
                    let oldSumOffer = $(futureCodeClass).find('.sumoffer').data('prev') || 0;
                    if (oldSumOffer != data.totalOfferQtty) {
                        $(futureCodeClass).find('.sumoffer').text(addCommas(data.totalOfferQtty * 10))
                        $(futureCodeClass).find('.sumoffer').css('background-color', oldSumOffer < data.totalOfferQtty ? increaseColor : decreaseColor)
                        $(futureCodeClass).find('.sumoffer').data('prev', data.totalOfferQtty)
                    }
                    let delta = data.totalBidQtty  - data.totalOfferQtty
                    $(futureCodeClass).find('.delta').text(addCommas(delta))
                    $(futureCodeClass).find('.delta').css('color', delta > 0 ? increaseColor : decreaseColor)
                    setTimeout(() => {
                        $(futureCodeClass).find('.sumbid').css('background-color', '')
                        $(futureCodeClass).find('.sumoffer').css('background-color', '')
                        if (data.totalBidQtty < data.totalOfferQtty) {
                            $(futureCodeClass).find('.sumoffer').css('color', darkgreen)
                            $(futureCodeClass).find('.sumbid').css('color',  darkred)
                        } else {
                            $(futureCodeClass).find('.sumoffer').css('color', darkred)
                            $(futureCodeClass).find('.sumbid').css('color', darkgreen)
                        }
                    }, 1000)
        
                    let oldSumBid10 = $(futureCodeClass).find('.sumbid10').data('prev') || 0;
                    if (oldSumBid10 != totalBidQtty10) {
                        $(futureCodeClass).find('.sumbid10').text(addCommas(totalBidQtty10))
                        $(futureCodeClass).find('.sumbid10').css('background-color', oldSumBid10 < totalBidQtty10 ? increaseColor : decreaseColor)
                        $(futureCodeClass).find('.sumbid10').data('prev', totalBidQtty10);
                    }
                    let oldSumOffer10 = $(futureCodeClass).find('.sumoffer10').data('prev') || 0;
                    if (oldSumOffer10 != totalOfferQtty10) {
                        $(futureCodeClass).find('.sumoffer10').text(addCommas(totalOfferQtty10))
                        $(futureCodeClass).find('.sumoffer10').css('background-color', oldSumOffer10 < totalOfferQtty10 ? increaseColor : decreaseColor)
                        $(futureCodeClass).find('.sumoffer10').data('prev', totalOfferQtty10)
                    }
                    let delta10 = totalBidQtty10  - totalOfferQtty10
                    $(futureCodeClass).find('.delta10').text(addCommas(delta10))
                    $(futureCodeClass).find('.delta10').css('color', delta10 > 0 ? increaseColor : decreaseColor)
                    setTimeout(() => {
                        $(futureCodeClass).find('.sumbid10').css('background-color', '')
                        $(futureCodeClass).find('.sumoffer10').css('background-color', '')
                        if (totalBidQtty10 < totalOfferQtty10) {
                            $(futureCodeClass).find('.sumoffer10').css('color', darkgreen)
                            $(futureCodeClass).find('.sumbid10').css('color',  darkred)
                        } else {
                            $(futureCodeClass).find('.sumoffer10').css('color', darkred)
                            $(futureCodeClass).find('.sumbid10').css('color', darkgreen)
                        }
                    }, 1000)
    
        
                    let oldSumBid10cost = $(futureCodeClass).find('.sumbid10cost').data('prev') || 0;
                    if (oldSumBid10cost != totalBid10cost) {
                        $(futureCodeClass).find('.sumbid10cost').text(addCommas(totalBid10cost))
                        $(futureCodeClass).find('.sumbid10cost').css('background-color', oldSumBid10cost < totalBid10cost ? increaseColor : decreaseColor)
                        $(futureCodeClass).find('.sumbid10cost').data('prev', totalBid10cost);
                    }
                    let oldSumOffer10cost = $(futureCodeClass).find('.sumoffer10cost').data('prev') || 0;
                    if (oldSumOffer10cost != totalOffer10cost) {
                        $(futureCodeClass).find('.sumoffer10cost').text(addCommas(totalOffer10cost))
                        $(futureCodeClass).find('.sumoffer10cost').css('background-color', oldSumOffer10cost < totalOffer10cost ? increaseColor : decreaseColor)
                        $(futureCodeClass).find('.sumoffer10cost').data('prev', totalOffer10cost)
                    }
                    let delta10cost = totalBid10cost  - totalOffer10cost
                    $(futureCodeClass).find('.delta10cost').text(addCommas(delta10cost))
                    $(futureCodeClass).find('.delta10cost').css('color', delta10cost > 0 ? increaseColor : decreaseColor)
                    setTimeout(() => {
                        $(futureCodeClass).find('.sumbid10cost').css('background-color', '')
                        $(futureCodeClass).find('.sumoffer10cost').css('background-color', '')
                        if (totalBid10cost < totalOffer10cost) {
                            $(futureCodeClass).find('.sumoffer10cost').css('color', darkgreen)
                            $(futureCodeClass).find('.sumbid10cost').css('color',  darkred)
                        } else {
                            $(futureCodeClass).find('.sumoffer10cost').css('color', darkred)
                            $(futureCodeClass).find('.sumbid10cost').css('color', darkgreen)
                        }
                    }, 1000)
                }
            }
        }
    
        fetch('https://price-api.vndirect.com.vn/derivatives/snapshot?floorCode=DER01').then(r => r.json())
            .then(response => {
                let codes = response.map(decodeMessage).map(f => f.split('|')).map(f => transformMessage[f.shift()](f))
                codes.filter(f => f.code === 'VN30F2006').forEach(future => {
                    appendWrapper(future.code)
                    var eventListener = listener(future.code)
                    ee.emitter.on('DERIVATIVE' + future.code, eventListener)
                    ee.emitter.emit('DERIVATIVE' + future.code, future)
                })
    
    
            });
        let event = a(3)
        window.ee = event
        
        let decreaseColor = '#f7941d'
        let increaseColor = '#1fd525'
        let darkgreen = '#04a004'
        let darkred = '#ff3737'
        console.log('Hello World!')
    
        function appendWrapper(futureCode) {
            let infobar = $('.infobar');
            if (!infobar.length) {
                infobar = $('<div class="infobar" style="font-size: 14px; margin-top: 5px">').insertBefore('#nav')
                $('<button onclick="setRateBuys()">RB</button>').appendTo(infobar)
                $('<button onclick="setRateSells()">RS</button>').appendTo(infobar)
            }
            let vn30Class = 'vn30f-' + futureCode;
            if (!$(vn30Class).length) {
                let vn30f = $('<div style="display: inline-block;" class="' + vn30Class + '">').appendTo(infobar)
                $('<span style="color: #f7941d">' + futureCode  + ': </span>').appendTo(vn30f)
                $('<span>B: </span>').appendTo(vn30f)
                $('<span class="sumbid"></span>').appendTo(vn30f)
                $('<span> | </span>').appendTo(vn30f)
                $('<span class="sumbid10"></span>').appendTo(vn30f)
                $('<sub>T10</sub>').appendTo(vn30f)
                $('<span> S: </span>').appendTo(vn30f)
                $('<span class="sumoffer"></span>').appendTo(vn30f)
                $('<span> | </span>').appendTo(vn30f)
                $('<span class="sumoffer10"></span>').appendTo(vn30f)
                $('<sub>T10</sub>').appendTo(vn30f)
                $('<span> ΔBS: </span>').appendTo(vn30f)
                $('<span class="delta"></span>').appendTo(vn30f)
                $('<span> | </span>').appendTo(vn30f)
                $('<span class="delta10"></span>').appendTo(vn30f)
                $('<sub>T10</sub>').appendTo(vn30f)
    
                $('<span> CB: </span>').appendTo(vn30f)
                $('<span class="sumbid10cost"></span>').appendTo(vn30f)
                $('<span> CS: </span>').appendTo(vn30f)
                $('<span class="sumoffer10cost"></span>').appendTo(vn30f)
                $('<span> ΔCBS: </span>').appendTo(vn30f)
                $('<span class="delta10cost"></span>').appendTo(vn30f)
    
                $('body.menu-horizontal .sticky-table-header-wrapper').css('top', '300px')
                $('table.proboard').css('marginTop', '90px')
            }
        }
    
        function addCommas(nStr)
        {
            return $.number(nStr, 2);
        }
    }])
})

function showDialog(title, body, callback) {
    $(`<div id="dialog-x" title="${title}">${body}</div>`).appendTo('body');
    $("#dialog-x").dialog({
        autoOpen : false, modal : false, show : "blind", hide : "blind",
        draggable: true,
        drag: function(event, ui) {
            var iObj = ui.position
            iObj.top = iObj.top - parseInt($('.header.pullable').css('margin-top'))
            ui.position = iObj;
        },
        close: function( event, ui ) {
            if (callback) callback(ui)
            setTimeout(() => {
                $("#dialog-x").remove()
            }, 100)
        }
    });
}

function addScript(scriptURL, callback) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.onload = function() {
        console.log('Added script', scriptURL)
        if (callback) callback()
    }
    script.src = scriptURL;
    head.appendChild(script);   
}

function addCss(linkHref) {
    var link = document.createElement("link");
    link.href = linkHref;
    link.type = "text/css";
    link.rel = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(link);
}

function decodeMessage (message) {
    return message.split("").map((char, index) => String.fromCharCode(char.charCodeAt(0) + index % 5)).join('')
}

function transformMessageArrayToObject (keys, values) {
    if (values) {
        return keys.reduce(function(result, key, index) {
            return result[key] = values[index], result
        }, {})
    }
}

let transformMessage = {
    SFU: function(e) {
        let t = e[1];
        return "ST" === t ? (0,
        transformMessageArrayToObject)(["code", "stockType", "floorCode", "basicPrice", "floorPrice", "ceilingPrice", "bidPrice01", "bidPrice02", "bidPrice03", "bidPrice04", "bidPrice05", "bidPrice06", "bidPrice07", "bidPrice08", "bidPrice09", "bidPrice10", "bidQtty01", "bidQtty02", "bidQtty03", "bidQtty04", "bidQtty05", "bidQtty06", "bidQtty07", "bidQtty08", "bidQtty09", "bidQtty10", "offerPrice01", "offerPrice02", "offerPrice03", "offerPrice04", "offerPrice05", "offerPrice06", "offerPrice07", "offerPrice08", "offerPrice09", "offerPrice10", "offerQtty01", "offerQtty02", "offerQtty03", "offerQtty04", "offerQtty05", "offerQtty06", "offerQtty07", "offerQtty08", "offerQtty09", "offerQtty10", "totalBidQtty", "totalOfferQtty", "tradingSessionId", "buyForeignQtty", "sellForeignQtty", "highestPrice", "lowestPrice", "accumulatedVal", "accumulatedVol", "matchPrice", "matchQtty", "currentPrice", "currentQtty", "projectOpen", "totalRoom", "currentRoom"], e) : "W" === t ? (0,
        transformMessageArrayToObject)(["code", "stockType", "floorCode", "basicPrice", "floorPrice", "ceilingPrice", "underlyingSymbol", "issuerName", "exercisePrice", "exerciseRatio", "bidPrice01", "bidPrice02", "bidPrice03", "bidQtty01", "bidQtty02", "bidQtty03", "offerPrice01", "offerPrice02", "offerPrice03", "offerQtty01", "offerQtty02", "offerQtty03", "totalBidQtty", "totalOfferQtty", "tradingSessionId", "buyForeignQtty", "sellForeignQtty", "highestPrice", "lowestPrice", "accumulatedVal", "accumulatedVol", "matchPrice", "matchQtty", "currentPrice", "currentQtty", "projectOpen", "totalRoom", "currentRoom"], e) : (0,
        transformMessageArrayToObject)(["code", "stockType", "floorCode", "basicPrice", "floorPrice", "ceilingPrice", "bidPrice01", "bidPrice02", "bidPrice03", "bidQtty01", "bidQtty02", "bidQtty03", "offerPrice01", "offerPrice02", "offerPrice03", "offerQtty01", "offerQtty02", "offerQtty03", "totalBidQtty", "totalOfferQtty", "tradingSessionId", "buyForeignQtty", "sellForeignQtty", "highestPrice", "lowestPrice", "accumulatedVal", "accumulatedVol", "matchPrice", "matchQtty", "currentPrice", "currentQtty", "projectOpen", "totalRoom", "currentRoom"], e)
    },
    SBA: function(e) {
        let t = e[1];
        return "ST" === t ? (0,
        transformMessageArrayToObject)(["code", "stockType", "bidPrice01", "bidPrice02", "bidPrice03", "bidPrice04", "bidPrice05", "bidPrice06", "bidPrice07", "bidPrice08", "bidPrice09", "bidPrice10", "bidQtty01", "bidQtty02", "bidQtty03", "bidQtty04", "bidQtty05", "bidQtty06", "bidQtty07", "bidQtty08", "bidQtty09", "bidQtty10", "offerPrice01", "offerPrice02", "offerPrice03", "offerPrice04", "offerPrice05", "offerPrice06", "offerPrice07", "offerPrice08", "offerPrice09", "offerPrice10", "offerQtty01", "offerQtty02", "offerQtty03", "offerQtty04", "offerQtty05", "offerQtty06", "offerQtty07", "offerQtty08", "offerQtty09", "offerQtty10", "totalBidQtty", "totalOfferQtty"], e) : (0,
        transformMessageArrayToObject)(["code", "stockType", "bidPrice01", "bidPrice02", "bidPrice03", "bidQtty01", "bidQtty02", "bidQtty03", "offerPrice01", "offerPrice02", "offerPrice03", "offerQtty01", "offerQtty02", "offerQtty03", "totalBidQtty", "totalOfferQtty"], e)
    },
    SMA: function(e) {
        return (0,
        transformMessageArrayToObject)(["code", "stockType", "tradingSessionId", "buyForeignQtty", "sellForeignQtty", "highestPrice", "lowestPrice", "accumulatedVal", "accumulatedVol", "matchPrice", "matchQtty", "currentPrice", "currentQtty", "projectOpen", "totalRoom", "currentRoom"], e)
    },
    SBS: function(e) {
        let t = e[1];
        return "W" === t ? (0,
        transformMessageArrayToObject)(["code", "stockType", "floorCode", "basicPrice", "floorPrice", "ceilingPrice", "underlyingSymbol", "issuerName", "exercisePrice", "exerciseRatio"], e) : (0,
        transformMessageArrayToObject)(["code", "stockType", "floorCode", "basicPrice", "floorPrice", "ceilingPrice"], e)
    },
    MI: function(e) {
        return transformMessageArrayToObject(["floorCode", "tradingTime", "status", "advance", "noChange", "decline", "marketIndex", "priorMarketIndex", "highestIndex", "lowestIndex", "totalShareTraded", "totalValueTraded"], e)
    },
    MARKET_HISTORY: function(e) {
        return {
            floorCode: e[0],
            tradingDate: e[1],
            priorMarketIndex: e[2],
            tradingTime: e[3] ? e[3].split(",") : [],
            marketIndex: e[4] ? e[4].split(",").map(function(e) {
                return 1 * e
            }) : [],
            totalShareTraded: e[5] ? e[5].split(",") : [],
            status: e[6] ? e[6].split(",") : []
        }
    },
    DFU: function(e) {
        return (0,
        transformMessageArrayToObject)(["code", "time", "bidPrice01", "bidPrice02", "bidPrice03", "bidPrice04", "bidPrice05", "bidPrice06", "bidPrice07", "bidPrice08", "bidPrice09", "bidPrice10", "bidQtty01", "bidQtty02", "bidQtty03", "bidQtty04", "bidQtty05", "bidQtty06", "bidQtty07", "bidQtty08", "bidQtty09", "bidQtty10", "offerPrice01", "offerPrice02", "offerPrice03", "offerPrice04", "offerPrice05", "offerPrice06", "offerPrice07", "offerPrice08", "offerPrice09", "offerPrice10", "offerQtty01", "offerQtty02", "offerQtty03", "offerQtty04", "offerQtty05", "offerQtty06", "offerQtty07", "offerQtty08", "offerQtty09", "offerQtty10", "totalBidQtty", "totalOfferQtty", "tradingSessionId", "buyForeignQtty", "sellForeignQtty", "highestPrice", "lowestPrice", "accumulatedVal", "accumulatedVol", "matchPrice", "currentPrice", "matchQtty", "currentQtty", "floorCode", "stockType", "tradingDate", "lastTradingDate", "underlying", "basicPrice", "floorPrice", "ceilingPrice", "openInterest", "openPrice"], e)
    },
    DBA: function(e) {
        return (0,
        transformMessageArrayToObject)(["code", "bidPrice01", "bidPrice02", "bidPrice03", "bidPrice04", "bidPrice05", "bidPrice06", "bidPrice07", "bidPrice08", "bidPrice09", "bidPrice10", "bidQtty01", "bidQtty02", "bidQtty03", "bidQtty04", "bidQtty05", "bidQtty06", "bidQtty07", "bidQtty08", "bidQtty09", "bidQtty10", "offerPrice01", "offerPrice02", "offerPrice03", "offerPrice04", "offerPrice05", "offerPrice06", "offerPrice07", "offerPrice08", "offerPrice09", "offerPrice10", "offerQtty01", "offerQtty02", "offerQtty03", "offerQtty04", "offerQtty05", "offerQtty06", "offerQtty07", "offerQtty08", "offerQtty09", "offerQtty10", "totalBidQtty", "totalOfferQtty"], e)
    },
    DMA: function(e) {
        return (0,
        transformMessageArrayToObject)(["code", "time", "tradingSessionId", "buyForeignQtty", "sellForeignQtty", "highestPrice", "lowestPrice", "accumulatedVal", "accumulatedVol", "matchPrice", "currentPrice", "matchQtty", "currentQtty"], e)
    },
    DBS: function(e) {
        return (0,
        transformMessageArrayToObject)(["code", "floorCode", "stockType", "tradingDate", "lastTradingDate", "underlying", "basicPrice", "floorPrice", "ceilingPrice", "openInterest", "openPrice"], e)
    }
};