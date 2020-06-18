var css = `
<style>
/* Corner radius */
.ui-corner-all,
.ui-corner-top,
.ui-corner-left,
.ui-corner-tl {
	border-top-left-radius: 1px;
}
.ui-corner-all,
.ui-corner-top,
.ui-corner-right,
.ui-corner-tr {
	border-top-right-radius: 1px;
}
.ui-corner-all,
.ui-corner-bottom,
.ui-corner-left,
.ui-corner-bl {
	border-bottom-left-radius: 1px;
}
.ui-corner-all,
.ui-corner-bottom,
.ui-corner-right,
.ui-corner-br {
	border-bottom-right-radius: 1px;
}

.ui-dialog .ui-dialog-titlebar {
    background: #262626;
    color: white;
    border: 0;
}
.ui-dialog {
    padding: 0;
}
.ui-dialog .ui-dialog-titlebar {
    padding: 0.2em 1em;
}
<style>
`

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
let vn30 = {}
$(function(){
    addScript('https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js', () => {
        loadDialogExtend()
        addCss('https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css')
        $(css).appendTo('head')
        webpackJsonp && webpackJsonp([1], [function(e, t, a) {
            window.aa = a
            window.Chart = a(96).Chart
            window.socketClient = a(51).default.socketClient
            function listener (futureCode, isStockCode) {
                if (!isStockCode) {
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
                else {
                    return function(data) {
                        if (data.bidPrice02) {
                            var dataCode = vn30[data.code] = data
                            let futureCodeClass = '.vn30f-' + futureCode;
                            
                            let bidQttyKeys = Array.from(Array(3).keys()).map(i => 'bidQtty' + `${i + 1}`.padStart(2, '0'))
                            let bidPriceKeys = Array.from(Array(3).keys()).map(i => 'bidPrice' + `${i + 1}`.padStart(2, '0'))
                            let offerQttyKeys = Array.from(Array(3).keys()).map(i => 'offerQtty' + `${i + 1}`.padStart(2, '0'))
                            let offerPriceKeys = Array.from(Array(3).keys()).map(i => 'offerPrice' + `${i + 1}`.padStart(2, '0'))
                            let totalBidQtty10 = bidQttyKeys.map(f => parseFloat(dataCode[f]) * 10).reduce((a,b) => a + b, 0)
                            let total10BidPrice = bidPriceKeys.map(f => parseFloat(dataCode[f]) * 1000).reduce((a,b) => a + b, 0)
                            let totalOfferQtty10 = offerQttyKeys.map(f => parseFloat(dataCode[f]) * 10).reduce((a,b) => a + b, 0)
                            let total10OfferPrice = offerPriceKeys.map(f => parseFloat(dataCode[f]) * 1000).reduce((a,b) => a + b, 0)
            
                            let totalBid10cost = Object.keys(vn30).map(f => 
                                vn30[f]["bidQtty01"] * 10 * vn30[f]["bidPrice01"] * 1000  * BB[0]
                                + vn30[f]["bidQtty02"] * 10 * vn30[f]["bidPrice02"] * 1000 * BB[1]
                                + vn30[f]["bidQtty03"] * 10 * vn30[f]["bidPrice03"] * 1000 * BB[2]
                            ).reduce((a,b) => a+b,0.0)
            
                            let totalOffer10cost = Object.keys(vn30).map(f => 
                                vn30[f]["offerQtty01"] * 10 * vn30[f]["offerPrice01"] * 1000 * SS[0]
                                + vn30[f]["offerQtty02"] * 10 * vn30[f]["offerPrice02"] * 1000 * SS[1]
                                + vn30[f]["offerQtty03"] * 10 * vn30[f]["offerPrice03"] * 1000 * SS[2]
                            ).reduce((a,b) => a+b,0.0)
            
                            let oldSumBid = $(futureCodeClass).find('.sumbid').data('prev') || 0;
                            if (oldSumBid != dataCode.totalBidQtty) {
                                console.log(oldSumBid, addCommas(dataCode.totalBidQtty), oldSumBid - dataCode.totalBidQtty)
                                $(futureCodeClass).find('.sumbid').text(addCommas(dataCode.totalBidQtty * 10))
                                $(futureCodeClass).find('.sumbid').css('background-color', oldSumBid < dataCode.totalBidQtty ? increaseColor : decreaseColor)
                                $(futureCodeClass).find('.sumbid').data('prev', dataCode.totalBidQtty);
                            }
                            let oldSumOffer = $(futureCodeClass).find('.sumoffer').data('prev') || 0;
                            if (oldSumOffer != dataCode.totalOfferQtty) {
                                $(futureCodeClass).find('.sumoffer').text(addCommas(dataCode.totalOfferQtty * 10))
                                $(futureCodeClass).find('.sumoffer').css('background-color', oldSumOffer < dataCode.totalOfferQtty ? increaseColor : decreaseColor)
                                $(futureCodeClass).find('.sumoffer').data('prev', dataCode.totalOfferQtty)
                            }
                            let delta = dataCode.totalBidQtty  - dataCode.totalOfferQtty
                            $(futureCodeClass).find('.delta').text(addCommas(delta))
                            $(futureCodeClass).find('.delta').css('color', delta > 0 ? increaseColor : decreaseColor)
                            setTimeout(() => {
                                $(futureCodeClass).find('.sumbid').css('background-color', '')
                                $(futureCodeClass).find('.sumoffer').css('background-color', '')
                                if (dataCode.totalBidQtty < dataCode.totalOfferQtty) {
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
            }
        
            fetch('https://price-api.vndirect.com.vn/derivatives/snapshot?floorCode=DER01').then(r => r.json())
                .then(response => {
                    let codes = response.map(decodeMessage).map(f => f.split('|')).map(f => transformMessage[f.shift()](f))
                    codes.filter(f => f.code === 'VN30F2006').forEach(future => {
                        appendWrapper(future.code)
                        var eventListener = listener(future.code)
                        ee.emitter.on('DERIVATIVE' + future.code, eventListener)
                        ee.emitter.emit('DERIVATIVE' + future.code, future)
                        socketClient.send('s|D:VN30F2006,VN30F2007,VN30F2009,GB05F2103,GB05F2009,GB05F2012,VN30F2012')
                    })
                });
            fetch('https://price-api.vndirect.com.vn/stocks/snapshot?floorCode=10&top30=true').then(r => r.json())
                .then(response => {
                    let codes = response.map(decodeMessage).map(f => f.split('|')).map(f => transformMessage[f.shift()](f))
                    let future = codes[0]
                    appendWrapper('VN30BASIC', 1)
                    var eventListener = listener('VN30BASIC', 1)
                    ee.emitter.on('UPDATE_STOCK_PARTIAL_REALTIME', eventListener)
                    ee.emitter.emit('UPDATE_STOCK_PARTIAL_REALTIME', future)
                    socketClient.send('s|S:BID,BVH,CTD,CTG,EIB,FPT,GAS,HDB,HPG,MBB,MSN,MWG,NVL,PLX,PNJ,POW,REE,ROS,SAB,SBT,SSI,STB,TCB,VCB,VHM,VIC,VJC,VNM,VPB,VRE')
                    
                });
            let event = a(3)
            window.ee = event
            let decreaseColor = '#f7941d'
            let increaseColor = '#1fd525'
            let darkgreen = '#04a004'
            let darkred = '#ff3737'
            console.log('Hello World!')
        
            function appendWrapper(futureCode, isStockCode) {
                
                let infobar = $('.infobar');
                let dialog = $(`<div id="dialog-infobar" title="Chỉ số phái sinh"></div>`);
                if (!infobar.length) {
                    dialog.appendTo('body');
                    // infobar = $('<div class="infobar" style="font-size: 14px; margin-top: 5px">').insertBefore('#nav')
                    infobar = $('<div class="infobar" style="font-size: 14px; margin-top: 5px">').appendTo(dialog)
                    $('<button onclick="setRateBuys()">RB</button>').appendTo(infobar)
                    $('<button onclick="setRateSells()">RS</button><br/>').appendTo(infobar)
                }
                let vn30Class = 'vn30f-' + futureCode;
                if (!$(vn30Class).length && !isStockCode) {
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
                    $(window).on('resize', () => {
                        setTimeout(() => {
                            $('body.menu-horizontal .sticky-table-header-wrapper').css('top', '300px')
                            $('table.proboard').css('marginTop', '90px')
                        }, 1000)
                    })
                }
                else {
                    if (!$(vn30Class).length) {
                        let vn30f = $('<div style="display: inline-block;" class="' + vn30Class + '">').appendTo(infobar)
                        $('<span style="color: #f7941d">' + futureCode  + ': </span>').appendTo(vn30f)
                        $('<span class="sumbid10"></span>').appendTo(vn30f)
                        $('<sub>T3</sub>').appendTo(vn30f)
                        $('<span> S: </span>').appendTo(vn30f)
                        $('<span class="sumoffer10"></span>').appendTo(vn30f)
                        $('<sub>T3</sub>').appendTo(vn30f)
                        $('<span> ΔBS: </span>').appendTo(vn30f)
                        $('<span class="delta10"></span>').appendTo(vn30f)
                        $('<sub>T3</sub>').appendTo(vn30f)
                        $('<span> CB: </span>').appendTo(vn30f)
                        $('<span class="sumbid10cost"></span>').appendTo(vn30f)
                        $('<span> CS: </span>').appendTo(vn30f)
                        $('<span class="sumoffer10cost"></span>').appendTo(vn30f)
                        $('<span> ΔCBS: </span>').appendTo(vn30f)
                        $('<span class="delta10cost"></span>').appendTo(vn30f)
                        $(window).on('resize', () => {
                            setTimeout(() => {
                                $('body.menu-horizontal .sticky-table-header-wrapper').css('top', '300px')
                                $('table.proboard').css('marginTop', '90px')
                            }, 1000)
                        })
                    }
                }
                showDialogInfoBar()
            }
        
            function addCommas(nStr)
            {
                return $.number(nStr, 2);
            }
        }])
    })
})
function showDialogInfoBar() {
    // $(`<div id="dialog-x" title="${title}">${body}</div>`).appendTo('body');
    $("#dialog-infobar").dialog({
        autoOpen : false, modal : false, show : "blind", hide : "blind",
        draggable: true, width: '80%',
        // drag: function(event, ui) {
        //     var iObj = ui.position
        //     iObj.top = iObj.top - parseInt($('.header.pullable').css('margin-top'))
        //     ui.position = iObj;
        // },
        close: function( event, ui ) {
            if (callback) callback(ui)
            // setTimeout(() => {
            //     $("#dialog-infobar").remove()
            // }, 100)
        }
    }).dialogExtend({
        "closable" : false,
        "maximizable" : true,
        "minimizable" : true,
        "collapsable" : true,
        "dblclick" : false,
        "titlebar" : false
      });
    
    $("#dialog-infobar").parent().css({position:"fixed"}).end().dialog('open')
}

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
    $("#dialog-x").dialog('open')
}

function addScript(scriptURL, callback) {
    setTimeout(() => {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.onload = function() {
            console.log('Added script', scriptURL)
            if (callback) callback()
        }
        script.src = scriptURL;
        head.appendChild(script);  
    }, 1000) 
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
    fetch('https://price-api.vndirect.com.vn/derivatives/snapshot?floorCode=DER01').then(r => r.json())
            .then(response => {
                let codes = response.map(decodeMessage).map(f => f.split('|')).map(f => transformMessage[f.shift()](f))
                codes.filter(f => f.code === 'VN30F2006').forEach(future => {
                    ee.emitter.emit('DERIVATIVE' + future.code, future)
                })
            });
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
    fetch('https://price-api.vndirect.com.vn/derivatives/snapshot?floorCode=DER01').then(r => r.json())
            .then(response => {
                let codes = response.map(decodeMessage).map(f => f.split('|')).map(f => transformMessage[f.shift()](f))
                codes.filter(f => f.code === 'VN30F2006').forEach(future => {
                    ee.emitter.emit('DERIVATIVE' + future.code, future)
                })
            });
}

function loadDialogExtend() {
    (function() {
        var $;
      
        $ = jQuery;
      
        $.widget("ui.dialogExtend", {
          version: "2.0.0",
          modes: {},
          options: {
            "closable": true,
            "dblclick": false,
            "titlebar": false,
            "icons": {
              "close": "ui-icon-closethick",
              "restore": "ui-icon-newwin"
            },
            "load": null,
            "beforeRestore": null,
            "restore": null
          },
          _create: function() {
            this._state = "normal";
            if (!$(this.element[0]).data("ui-dialog")) {
              $.error("jQuery.dialogExtend Error : Only jQuery UI Dialog element is accepted");
            }
            this._verifyOptions();
            this._initStyles();
            this._initButtons();
            this._initTitleBar();
            this._setState("normal");
            this._on("load", function(e) {
              return console.log("test", e);
            });
            return this._trigger("load");
          },
          _setState: function(state) {
            $(this.element[0]).removeClass("ui-dialog-" + this._state).addClass("ui-dialog-" + state);
            return this._state = state;
          },
          _verifyOptions: function() {
            var name, _ref, _results;
      
            if (this.options.dblclick && !(this.options.dblclick in this.modes)) {
              $.error("jQuery.dialogExtend Error : Invalid <dblclick> value '" + this.options.dblclick + "'");
              this.options.dblclick = false;
            }
            if (this.options.titlebar && ((_ref = this.options.titlebar) !== "none" && _ref !== "transparent")) {
              $.error("jQuery.dialogExtend Error : Invalid <titlebar> value '" + this.options.titlebar + "'");
              this.options.titlebar = false;
            }
            _results = [];
            for (name in this.modes) {
              if (this["_verifyOptions_" + name]) {
                _results.push(this["_verifyOptions_" + name]());
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          },
          _initStyles: function() {
            var name, style, _results;
      
            if (!$(".dialog-extend-css").length) {
              style = '';
              style += '<style class="dialog-extend-css" type="text/css">';
              style += '.ui-dialog .ui-dialog-titlebar-buttonpane>a { float: right; }';
              style += '.ui-dialog .ui-dialog-titlebar-restore { width: 19px; height: 18px; }';
              style += '.ui-dialog .ui-dialog-titlebar-restore span { display: block; margin: 1px; }';
              style += '.ui-dialog .ui-dialog-titlebar-restore:hover,';
              style += '.ui-dialog .ui-dialog-titlebar-restore:focus { padding: 0; }';
              style += '.ui-dialog .ui-dialog-titlebar ::selection { background-color: transparent; }';
              style += '</style>';
              $(style).appendTo("body");
            }
            _results = [];
            for (name in this.modes) {
              _results.push(this["_initStyles_" + name]());
            }
            return _results;
          },
          _initButtons: function() {
            var buttonPane, mode, name, titlebar, _ref,
              _this = this;
      
            titlebar = $(this.element[0]).dialog("widget").find(".ui-dialog-titlebar");
            buttonPane = $('<div class="ui-dialog-titlebar-buttonpane"></div>').appendTo(titlebar);
            buttonPane.css({
              "position": "absolute",
              "top": "50%",
              "right": "0.3em",
              "margin-top": "-10px",
              "height": "18px"
            });
            titlebar.find(".ui-dialog-titlebar-close").css({
              "position": "relative",
              "float": "right",
              "top": "auto",
              "right": "auto",
              "margin": 0
            }).find(".ui-icon").removeClass("ui-icon-closethick").addClass(this.options.icons.close).end().appendTo(buttonPane).end();
            buttonPane.append('<a class="ui-dialog-titlebar-restore ui-corner-all ui-state-default" href="#"><span class="ui-icon ' + this.options.icons.restore + '" title="restore">restore</span></a>').find('.ui-dialog-titlebar-restore').attr("role", "button").mouseover(function() {
              return $(this).addClass("ui-state-hover");
            }).mouseout(function() {
              return $(this).removeClass("ui-state-hover");
            }).focus(function() {
              return $(this).addClass("ui-state-focus");
            }).blur(function() {
              return $(this).removeClass("ui-state-focus");
            }).end().find(".ui-dialog-titlebar-close").toggle(this.options.closable).end().find(".ui-dialog-titlebar-restore").hide().click(function(e) {
              e.preventDefault();
              return _this.restore();
            }).end();
            _ref = this.modes;
            for (name in _ref) {
              mode = _ref[name];
              this._initModuleButton(name, mode);
            }
            return titlebar.dblclick(function(evt) {
              if (_this.options.dblclick) {
                if (_this._state !== "normal") {
                  return _this.restore();
                } else {
                  return _this[_this.options.dblclick]();
                }
              }
            }).select(function() {
              return false;
            });
          },
          _initModuleButton: function(name, mode) {
            var buttonPane,
              _this = this;
      
            buttonPane = $(this.element[0]).dialog("widget").find('.ui-dialog-titlebar-buttonpane');
            return buttonPane.append('<a class="ui-dialog-titlebar-' + name + ' ui-corner-all ui-state-default" href="#" title="' + name + '"><span class="ui-icon ' + this.options.icons[name] + '">' + name + '</span></a>').find(".ui-dialog-titlebar-" + name).attr("role", "button").mouseover(function() {
              return $(this).addClass("ui-state-hover");
            }).mouseout(function() {
              return $(this).removeClass("ui-state-hover");
            }).focus(function() {
              return $(this).addClass("ui-state-focus");
            }).blur(function() {
              return $(this).removeClass("ui-state-focus");
            }).end().find(".ui-dialog-titlebar-" + name).toggle(this.options[mode.option]).click(function(e) {
              e.preventDefault();
              return _this[name]();
            }).end();
          },
          _initTitleBar: function() {
            var handle;
      
            switch (this.options.titlebar) {
              case false:
                return 0;
              case "none":
                if ($(this.element[0]).dialog("option", "draggable")) {
                  handle = $("<div />").addClass("ui-dialog-draggable-handle").css("cursor", "move").height(5);
                  $(this.element[0]).dialog("widget").prepend(handle).draggable("option", "handle", handle);
                }
                return $(this.element[0]).dialog("widget").find(".ui-dialog-titlebar").find(".ui-dialog-title").html("&nbsp;").end().css({
                  "background-color": "transparent",
                  "background-image": "none",
                  "border": 0,
                  "position": "absolute",
                  "right": 0,
                  "top": 0,
                  "z-index": 9999
                }).end();
              case "transparent":
                return $(this.element[0]).dialog("widget").find(".ui-dialog-titlebar").css({
                  "background-color": "transparent",
                  "background-image": "none",
                  "border": 0
                });
              default:
                return $.error("jQuery.dialogExtend Error : Invalid <titlebar> value '" + this.options.titlebar + "'");
            }
          },
          state: function() {
            return this._state;
          },
          restore: function() {
            this._trigger("beforeRestore");
            this._restore();
            this._toggleButtons();
            return this._trigger("restore");
          },
          _restore: function() {
            if (this._state !== "normal") {
              this["_restore_" + this._state]();
              this._setState("normal");
              return $(this.element[0]).dialog("widget").focus();
            }
          },
          _saveSnapshot: function() {
            if (this._state === "normal") {
              this.original_config_resizable = $(this.element[0]).dialog("option", "resizable");
              this.original_config_draggable = $(this.element[0]).dialog("option", "draggable");
              this.original_size_height = $(this.element[0]).dialog("widget").outerHeight();
              this.original_size_width = $(this.element[0]).dialog("option", "width");
              this.original_size_maxHeight = $(this.element[0]).dialog("option", "maxHeight");
              this.original_position_mode = $(this.element[0]).dialog("widget").css("position");
              this.original_position_left = $(this.element[0]).dialog("widget").offset().left - $('body').scrollLeft();
              this.original_position_top = $(this.element[0]).dialog("widget").offset().top - $('body').scrollTop();
              return this.original_titlebar_wrap = $(this.element[0]).dialog("widget").find(".ui-dialog-titlebar").css("white-space");
            }
          },
          _loadSnapshot: function() {
            return {
              "config": {
                "resizable": this.original_config_resizable,
                "draggable": this.original_config_draggable
              },
              "size": {
                "height": this.original_size_height,
                "width": this.original_size_width,
                "maxHeight": this.original_size_maxHeight
              },
              "position": {
                "mode": this.original_position_mode,
                "left": this.original_position_left,
                "top": this.original_position_top
              },
              "titlebar": {
                "wrap": this.original_titlebar_wrap
              }
            };
          },
          _toggleButtons: function(newstate) {
            var mode, name, state, _ref, _ref1, _results;
      
            state = newstate || this._state;
            $(this.element[0]).dialog("widget").find(".ui-dialog-titlebar-restore").toggle(state !== "normal").css({
              "right": "1.4em"
            }).end();
            _ref = this.modes;
            for (name in _ref) {
              mode = _ref[name];
              $(this.element[0]).dialog("widget").find(".ui-dialog-titlebar-" + name).toggle(state !== mode.state && this.options[mode.option]);
            }
            _ref1 = this.modes;
            _results = [];
            for (name in _ref1) {
              mode = _ref1[name];
              if (mode.state === state) {
                _results.push($(this.element[0]).dialog("widget").find(".ui-dialog-titlebar-restore").insertAfter($(this.element[0]).dialog("widget").find(".ui-dialog-titlebar-" + name)).end());
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          }
        });
      
    }).call(this);
    
    (function() {
    var $;
    
    $ = jQuery;
    
    $.extend(true, $.ui.dialogExtend.prototype, {
        modes: {
        "collapse": {
            option: "collapsable",
            state: "collapsed"
        }
        },
        options: {
        "collapsable": false,
        "icons": {
            "collapse": "ui-icon-triangle-1-s"
        },
        "beforeCollapse": null,
        "collapse": null
        },
        collapse: function() {
        var newHeight, pos;
    
        newHeight = $(this.element[0]).dialog("widget").find(".ui-dialog-titlebar").height() + 15;
        this._trigger("beforeCollapse");
        if (this._state !== "normal") {
            this._restore();
        }
        this._saveSnapshot();
        pos = $(this.element[0]).dialog("widget").position();
        $(this.element[0]).dialog("option", {
            "resizable": false,
            "height": newHeight,
            "maxHeight": newHeight,
            "position": [pos.left - $(document).scrollLeft(), pos.top - $(document).scrollTop()]
        }).on('dialogclose', this._collapse_restore).hide().dialog("widget").find(".ui-dialog-buttonpane:visible").hide().end().find(".ui-dialog-titlebar").css("white-space", "nowrap").end().find(".ui-dialog-content");
        this._setState("collapsed");
        this._toggleButtons();
        return this._trigger("collapse");
        },
        _restore_collapsed: function() {
        var original;
    
        original = this._loadSnapshot();
        return $(this.element[0]).show().dialog("widget").find(".ui-dialog-buttonpane:hidden").show().end().find(".ui-dialog-titlebar").css("white-space", original.titlebar.wrap).end().find(".ui-dialog-content").dialog("option", {
            "resizable": original.config.resizable,
            "height": original.size.height,
            "maxHeight": original.size.maxHeight
        }).off('dialogclose', this._collapse_restore);
        },
        _initStyles_collapse: function() {
        var style;
    
        if (!$(".dialog-extend-collapse-css").length) {
            style = '';
            style += '<style class="dialog-extend-collapse-css" type="text/css">';
            style += '.ui-dialog .ui-dialog-titlebar-collapse { width: 19px; height: 18px; }';
            style += '.ui-dialog .ui-dialog-titlebar-collapse span { display: block; margin: 1px; }';
            style += '.ui-dialog .ui-dialog-titlebar-collapse:hover,';
            style += '.ui-dialog .ui-dialog-titlebar-collapse:focus { padding: 0; }';
            style += '</style>';
            return $(style).appendTo("body");
        }
        },
        _collapse_restore: function() {
        return $(this).dialogExtend("restore");
        }
    });
    
    }).call(this);
    
    (function() {
    var $;
    
    $ = jQuery;
    
    $.extend(true, $.ui.dialogExtend.prototype, {
        modes: {
        "maximize": {
            option: "maximizable",
            state: "maximized"
        }
        },
        options: {
        "maximizable": false,
        "icons": {
            "maximize": "ui-icon-extlink"
        },
        "beforeMaximize": null,
        "maximize": null
        },
        maximize: function() {
        var newHeight, newWidth;
    
        newHeight = $(window).height() - 11;
        newWidth = $(window).width() - 11;
        this._trigger("beforeMaximize");
        if (this._state !== "normal") {
            this._restore();
        }
        this._saveSnapshot();
        if ($(this.element[0]).dialog("option", "draggable")) {
            $(this.element[0]).dialog("widget").draggable("option", "handle", null).find(".ui-dialog-draggable-handle").css("cursor", "text").end();
        }
        $(this.element[0]).dialog("widget").css("position", "fixed").find(".ui-dialog-content").show().dialog("widget").find(".ui-dialog-buttonpane").show().end().find(".ui-dialog-content").dialog("option", {
            "resizable": false,
            "draggable": false,
            "height": newHeight,
            "width": newWidth,
            "position": {
            my: "left top",
            at: "left top",
            of: window
            }
        });
        this._setState("maximized");
        this._toggleButtons();
        return this._trigger("maximize");
        },
        _restore_maximized: function() {
        var original;
    
        original = this._loadSnapshot();
        $(this.element[0]).dialog("widget").css("position", original.position.mode).find(".ui-dialog-titlebar").css("white-space", original.titlebar.wrap).end().find(".ui-dialog-content").dialog("option", {
            "resizable": original.config.resizable,
            "draggable": original.config.draggable,
            "height": original.size.height,
            "width": original.size.width,
            "maxHeight": original.size.maxHeight,
            "position": {
            my: "left top",
            at: "left+" + original.position.left + " top+" + original.position.top,
            of: window
            }
        });
        if ($(this.element[0]).dialog("option", "draggable")) {
            return $(this.element[0]).dialog("widget").draggable("option", "handle", $(this.element[0]).dialog("widget").find(".ui-dialog-draggable-handle").length ? $(this.element[0]).dialog("widget").find(".ui-dialog-draggable-handle") : ".ui-dialog-titlebar").find(".ui-dialog-draggable-handle").css("cursor", "move");
        }
        },
        _initStyles_maximize: function() {
        var style;
    
        if (!$(".dialog-extend-maximize-css").length) {
            style = '';
            style += '<style class="dialog-extend-maximize-css" type="text/css">';
            style += '.ui-dialog .ui-dialog-titlebar-maximize { width: 19px; height: 18px; }';
            style += '.ui-dialog .ui-dialog-titlebar-maximize span { display: block; margin: 1px; }';
            style += '.ui-dialog .ui-dialog-titlebar-maximize:hover,';
            style += '.ui-dialog .ui-dialog-titlebar-maximize:focus { padding: 0; }';
            style += '</style>';
            return $(style).appendTo("body");
        }
        }
    });
    
    }).call(this);
    
    (function() {
    var $;
    
    $ = jQuery;
    
    $.extend(true, $.ui.dialogExtend.prototype, {
        modes: {
        "minimize": {
            option: "minimizable",
            state: "minimized"
        }
        },
        options: {
        "minimizable": false,
        "minimizeLocation": "left",
        "icons": {
            "minimize": "ui-icon-minus"
        },
        "beforeMinimize": null,
        "minimize": null
        },
        minimize: function() {
        var dialogcontrols, fixedContainer, newWidth;
    
        this._trigger("beforeMinimize");
        if (this._state !== "normal") {
            this._restore();
        }
        newWidth = 200;
        if ($("#dialog-extend-fixed-container").length) {
            fixedContainer = $("#dialog-extend-fixed-container");
        } else {
            fixedContainer = $('<div id="dialog-extend-fixed-container"></div>').appendTo("body");
            fixedContainer.css({
            "position": "fixed",
            "bottom": 1,
            "left": 1,
            "right": 1,
            "z-index": 9999
            });
        }
        this._toggleButtons("minimized");
        dialogcontrols = $(this.element[0]).dialog("widget").clone().children().remove().end();
        $(this.element[0]).dialog("widget").find('.ui-dialog-titlebar').clone(true, true).appendTo(dialogcontrols);
        dialogcontrols.css({
            "float": this.options.minimizeLocation,
            "margin": 1
        });
        fixedContainer.append(dialogcontrols);
        $(this.element[0]).data("dialog-extend-minimize-controls", dialogcontrols);
        if ($(this.element[0]).dialog("option", "draggable")) {
            dialogcontrols.removeClass("ui-draggable");
        }
        dialogcontrols.css({
            "height": "auto",
            "width": newWidth,
            "position": "static"
        });
        $(this.element[0]).on('dialogbeforeclose', this._minimize_restoreOnClose).dialog("widget").hide();
        this._setState("minimized");
        return this._trigger("minimize");
        },
        _restore_minimized: function() {
        $(this.element[0]).dialog("widget").show();
        $(this.element[0]).off('dialogbeforeclose', this._minimize_restoreOnClose);
        $(this.element[0]).data("dialog-extend-minimize-controls").remove();
        return $(this.element[0]).removeData("dialog-extend-minimize-controls");
        },
        _initStyles_minimize: function() {
        var style;
    
        if (!$(".dialog-extend-minimize-css").length) {
            style = '';
            style += '<style class="dialog-extend-minimize-css" type="text/css">';
            style += '.ui-dialog .ui-dialog-titlebar-minimize { width: 19px; height: 18px; }';
            style += '.ui-dialog .ui-dialog-titlebar-minimize span { display: block; margin: 1px; }';
            style += '.ui-dialog .ui-dialog-titlebar-minimize:hover,';
            style += '.ui-dialog .ui-dialog-titlebar-minimize:focus { padding: 0; }';
            style += '</style>';
            return $(style).appendTo("body");
        }
        },
        _verifyOptions_minimize: function() {
        var _ref;
    
        if (!this.options.minimizeLocation || ((_ref = this.options.minimizeLocation) !== 'left' && _ref !== 'right')) {
            $.error("jQuery.dialogExtend Error : Invalid <minimizeLocation> value '" + this.options.minimizeLocation + "'");
            return this.options.minimizeLocation = "left";
        }
        },
        _minimize_restoreOnClose: function() {
        return $(this).dialogExtend("restore");
        }
    });
    
    }).call(this);
}