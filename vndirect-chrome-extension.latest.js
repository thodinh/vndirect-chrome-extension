webpackJsonp([1], [function(e, t, a) {
    var event = a(3)
    window.ee = event
    var decreaseColor = '#f7941d'
    var increaseColor = '#1fd525'
    var darkgreen = '#04a004'
    var darkred = '#ff3737'
    console.log('Hello World!')
    ee.emitter.on('DERIVATIVEVN30F2006', (data) => {
        if (!document.querySelector('.vn30f1-sumbid')) {
            appendWrapper()
        }
        if (data.totalBidQtty) {
            var oldSumBid = !document.querySelector('.vn30f1-sumbid').textContent ? 0 : parseFloat(document.querySelector('.vn30f1-sumbid').textContent.replace(/,/g,''))
            if (oldSumBid != data.totalBidQtty) {
                console.log(oldSumBid, addCommas(data.totalBidQtty), oldSumBid - data.totalBidQtty)
                document.querySelector('.vn30f1-sumbid').textContent = addCommas(data.totalBidQtty) + ';'
                document.querySelector('.vn30f1-sumbid').style.backgroundColor = oldSumBid < data.totalBidQtty ? increaseColor : decreaseColor
            }
            var oldSumOffer = !document.querySelector('.vn30f1-sumoffer').textContent ? 0 : parseFloat(document.querySelector('.vn30f1-sumoffer').textContent.replace(/,/g,''))
            if (oldSumOffer != data.totalOfferQtty) {
                document.querySelector('.vn30f1-sumoffer').textContent = addCommas(data.totalOfferQtty) + ';'
                document.querySelector('.vn30f1-sumoffer').style.backgroundColor = oldSumOffer < data.totalOfferQtty ? increaseColor : decreaseColor
            }
            // var deltaNumber = !document.querySelector('.vn30f1-delta').textContent ? 0 : parseFloat(document.querySelector('.vn30f1-sumoffer').textContent.replace(/,/g,''))
            // if (deltaNumber != data.totalOfferQtty) {
                var delta = data.totalBidQtty  - data.totalOfferQtty
                document.querySelector('.vn30f1-delta').textContent = addCommas(delta) + ';'
                document.querySelector('.vn30f1-delta').style.backgroundColor = delta > 0 ? increaseColor : decreaseColor
            // }
            setTimeout(() => {
                document.querySelector('.vn30f1-sumbid').style.backgroundColor = ''
                document.querySelector('.vn30f1-sumoffer').style.backgroundColor = ''
                if (data.totalBidQtty < data.totalOfferQtty) {
                    document.querySelector('.vn30f1-sumoffer').style.color = darkgreen
                    document.querySelector('.vn30f1-sumbid').style.color = darkred
                } else {
                    document.querySelector('.vn30f1-sumoffer').style.color = darkred
                    document.querySelector('.vn30f1-sumbid').style.color = darkgreen
                }
            }, 1000)
        }
    })
    setTimeout(() => {
        appendWrapper()
    }, 3000)

    function appendWrapper() {
        if (!document.querySelector('.i-infobar')) {
            var infobar = document.createElement('div')
            infobar.classList.add('i-infobar')
            infobar.style = 'height: 30px;background-color: white;position: relative'
            var vn30f1 = document.createElement('div')
            vn30f1.style = 'color: darkblue;font-size: 16px;margin-top: 5px;position: absolute;display: inline-block;'
            vn30f1.classList.add('vn30f1')
        
            var vn30f1SumBidText = document.createElement('span')
            vn30f1SumBidText.style = 'color: darkblue;font-size: 16px;margin-top: 5px'
            vn30f1SumBidText.classList.add('vn30f1-sumbid-text')
            vn30f1SumBidText.textContent = 'Tổng mua: '
        
            var vn30f1SumBid = document.createElement('span')
            vn30f1SumBid.style = 'color: darkblue;font-size: 16px;margin-top: 5px'
            vn30f1SumBid.classList.add('vn30f1-sumbid')
        
            var vn30f1SumOfferText = document.createElement('span')
            vn30f1SumOfferText.style = 'color: darkblue;font-size: 16px;margin-top: 5px'
            vn30f1SumOfferText.classList.add('vn30f1-sumoffer-text')
            vn30f1SumOfferText.textContent = 'Tổng bán: '
        
            var vn30f1SumOffer = document.createElement('span')
            vn30f1SumOffer.style = 'color: darkblue;font-size: 16px;margin-top: 5px'
            vn30f1SumOffer.classList.add('vn30f1-sumoffer')
        
            var deltaText = document.createElement('span')
            deltaText.style = 'color: darkblue;font-size: 16px;margin-top: 5px'
            deltaText.classList.add('vn30f1-delta-text')
            deltaText.textContent = ' Chênh lệch: '
        
            var deltaNumber = document.createElement('span')
            deltaNumber.style = 'color: darkblue;font-size: 16px;margin-top: 5px'
            deltaNumber.classList.add('vn30f1-delta')
        
            vn30f1.appendChild(vn30f1SumBidText)
            vn30f1.appendChild(vn30f1SumBid)
            vn30f1.appendChild(vn30f1SumOfferText)
            vn30f1.appendChild(vn30f1SumOffer)
            vn30f1.appendChild(deltaText)
            vn30f1.appendChild(deltaNumber)
            infobar.appendChild(vn30f1)
            var navigation = document.getElementById('navigation')
            navigation.insertBefore(infobar, document.getElementById('nav'))
            document.querySelector('body.menu-horizontal .sticky-table-header-wrapper').style.top = "300px"
            document.querySelector('table.proboard').style.marginTop = '90px'
        }
    }

    function addCommas(nStr)
    {
        return $.number(nStr, 2);
    }
}])