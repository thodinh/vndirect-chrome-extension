// Code here.
// If you want to use a variable, use $ and curly braces.
// For example, to use a fixed random number:
// NOTE: Do not insert unsafe variables in this way, see below
// at "Dynamic values in the injected code"
webpackJsonp([1], [function(e, t, a) {
    var event = a(3)
    window.ee = event
    var decreaseColor = '#f7941d'
    var increaseColor = '#1fd525'
    var darkgreen = '#0f0'
    var darkred = '#ff3737'
    console.log('Hello World!')
    ee.emitter.on('DERIVATIVEVN30F2006', (data) => {
        if (!document.querySelector('.vn30f1-sumbid')) {
            appendWrapper()
        }
        if (data.totalBidQtty) {
            var oldSumBid = parseFloat(document.querySelector('.vn30f1-sumbid').textConent.replace(/,/g,''))
            if (oldSumBid != data.totalBidQtty) {
                document.querySelector('.vn30f1-sumbid').textContent = addCommas(data.totalBidQtty) + ';'
                document.querySelector('.vn30f1-sumbid').style.backgroundColor = oldSumBid < data.totalBidQtty ? increaseColor : decreaseColor
            }
            var oldSumOffer = parseFloat(document.querySelector('.vn30f1-sumoffer').textConent.replace(/,/g,''))
            if (oldSumOffer != data.totalOfferQtty) {
                document.querySelector('.vn30f1-sumoffer').textContent = addCommas(data.totalOfferQtty) + ';'
                document.querySelector('.vn30f1-sumoffer').style.backgroundColor = oldSumOffer < data.totalOfferQtty ? increaseColor : decreaseColor
            }
            setTimeout(() => {
                document.querySelector('.vn30f1-sumbid').style.backgroundColor = ''
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
            vn30f1SumOfferText.classList.add('vn30f1-sumOffer-text')
            vn30f1SumOfferText.textContent = 'Tổng bán: '
        
            var vn30f1SumOffer = document.createElement('span')
            vn30f1SumOffer.style = 'color: darkblue;font-size: 16px;margin-top: 5px'
            vn30f1SumOffer.classList.add('vn30f1-sumoffer')
        
            vn30f1.appendChild(vn30f1SumBidText)
            vn30f1.appendChild(vn30f1SumBid)
            vn30f1.appendChild(vn30f1SumOfferText)
            vn30f1.appendChild(vn30f1SumOffer)
            infobar.appendChild(vn30f1)
            var navigation = document.getElementById('navigation')
            navigation.insertBefore(infobar, document.getElementById('nav'))
            document.querySelector('body.menu-horizontal .sticky-table-header-wrapper').style.top = "300px"
            document.querySelector('table.proboard').style.marginTop = '90px'
        }
    }

    function addCommas(nStr)
    {
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }
}])