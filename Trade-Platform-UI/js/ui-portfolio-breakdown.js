function showPortfolioBreakdown(port, index, isLeaderboard){
    //local port vars
    var port, assets, body, tickers, SQL;

    if(!isLeaderboard){
        port = gbl.portfolio[index];
        $('#portfolio-id-in-div').html('💼' +gbl.portfolio[index].name)
        assets =  port.assets;
        body = ''

        tickers = $.map(assets, function(obj){
            return obj.sym_id
        }).join("','");

        SQL = ` select symbol, time, high, mx_price, id
                from STOCKS.UI.INDIVIDUAL_PORTFOLIO_PERF
                WHERE ID IN ('${tickers}') `;
        $('#portfolio-close-btn').click(()=>{
            showAllPortfolios()
        })
    }else{
        // IF LEADERBOARD PORTFOLIO GO ANOTHER ROUTE BELOW
        $('#portfolio-id-in-div').html('💼 ' +gbl.leaderboard[index].NAME)
        $('#portfolio-close-btn').click(()=>{
            showLeaderboard()
        })
        makeLeaderboardPort(gbl.leaderboard[index].PORTFOLIO_ID);
        return;
    }

    getCountryRevenue(assets);

    for(i=0; i < assets.length; i++){
        body += `<tr class="text-right" id='div-tick-${assets[i].sym_id}'> 
                    <td class="text-left">
                        <button type="button" id='ticker-sell-btn-${assets[i].ticker}-${i}' onclick='createSellModal("${assets[i].ticker}", ${index}, ${i})' data-toggle="modal" data-target="#sellModal" class="btn btn-sm btn-light" style='display: none;'>Sell</button>    
                        ${assets[i].ticker} 
                    </td>
                    <td id='p-time'>${' '}</td>
                    <td id='p-purchase-price'>${' '}</td>
                    <td id='p-current-price'>${' '}</td>
                    <td id='p-units'>${assets[i].units}</td>
                    <td id='p-cost'>${' '}</td>
                    <td id='p-fmv'>${' '}</td>
                    <td id='p-profit-loss'${' '}</td>
                </tr>`
    }

    body += `<tr> 
                <td class="text-left"></td><td>${' '}</td><td>${' '}</td><td>${' '}</td><td>${' '}</td><td>${' '}</td><td>${' '}</td><td></td>
            </tr>`
    //ADD CASH BALANCE TO THE BOTTOM OF THE TABLE
    body += `<tr class="text-right" id='div-tick-${' '}'> 
                <td class="text-left">Cash Balance</td>
                <td>${' '}</td>
                <td>${' '}</td>
                <td>${' '}</td>
                <td>${' '}</td>
                <td>${' '}</td>
                <td>${( port.cash ).toLocaleString('en',{maximumFractionDigits: 2, minimumFractionDigits: 2})}</td>
                <td></td>
            </tr>`
    //ADD TOTAL VALUE OF PORTFOLIO LINE
    body += `<tr class="text-right" id='div-tick-${' '}'> 
                <td class="text-left">Portfolio Value</td>
                <td></td>
                <td>${' '}</td>
                <td>${' '}</td>
                <td>${' '}</td>
                <td>${' '}</td>
                <td id='port-total-value'>$-</td>
                <td></td>
            </tr>`

    //go to snowflake and get values for the stocks
    runSQL(gbl.sfconn, SQL).then((res)=>{ 
        var sumProfits = 0;
        for (i=0; i < res.length; i++){
            var units = parseInt( $(`#div-tick-${res[i].ID} #p-units`).html() );
            profits = (res[i].MX_PRICE * units) - (res[i].HIGH *  units);
            sumProfits = sumProfits + res[i].MX_PRICE * units;

            $(`#div-tick-${res[i].ID} #p-time`).html( res[i].TIME );

            $(`#div-tick-${res[i].ID} #p-purchase-price`)
                .html(parseFloat( res[i].HIGH ).toLocaleString('en',{maximumFractionDigits: 2, minimumFractionDigits: 2}))
                .attr('style', `color:${(profits>0)?"#05AC72":"#FF5639"}`);

            $(`#div-tick-${res[i].ID} #p-current-price`)
                .html( parseFloat(res[i].MX_PRICE ).toLocaleString('en',{maximumFractionDigits: 2, minimumFractionDigits: 2}))
                .attr('style', `color:${(profits>0)?"#05AC72":"#FF5639"}`);

            $(`#div-tick-${res[i].ID} #p-cost`)
                .html( parseFloat(res[i].HIGH *  units).toLocaleString('en',{maximumFractionDigits: 2, minimumFractionDigits: 2}))
                .attr('style', `color:${(profits>0)?"#05AC72":"#FF5639"}`);

            $(`#div-tick-${res[i].ID} #p-fmv`)
                .html( parseFloat(res[i].MX_PRICE * units).toLocaleString('en',{maximumFractionDigits: 2, minimumFractionDigits: 2}))
                .attr('style', `color:${(profits>0)?"#05AC72":"#FF5639"}`);

            $(`#div-tick-${res[i].ID} #p-profit-loss`)
                .html( parseFloat( profits ).toLocaleString('en',{maximumFractionDigits: 2, minimumFractionDigits: 2}) )
                .attr('style', `color:${(profits>0)?"#05AC72":"#FF5639"}`);

        }// end for

        $('#port-total-value').html(parseFloat( port.cash + sumProfits ).toLocaleString('en',{maximumFractionDigits: 2, minimumFractionDigits: 2}));
        $("[id^=ticker-sell-btn]").show();
    });//end run sql


    $('#port-tbody').html( body )
    showMenu('indi-ports-Div'); // SHOW THE DIV



}//end port

function makeLeaderboardPort(uuid){
    SQL = ` select *, RIGHT('00'||MONTH(PURCHASE_TIME),2)||'/'|| RIGHT('00'||DAY(PURCHASE_TIME),2) ||'/'|| RIGHT(YEAR(PURCHASE_TIME),2)||' '||RIGHT('00'||HOUR(PURCHASE_TIME),2)||':'|| RIGHT('00'||MINUTE(PURCHASE_TIME),2) AS T
            from FINSERV_ASSET_SHARE.UI.PORTFOLIO_PNL
            where PORTFOLIO_ID = '${uuid}' `;
    
    showMenu('indi-ports-Div'); // SHOW THE DIV
    
    runSQL(gbl.indconn, SQL).then((res)=>{
        makeUI(res);
    })

}//end 

function makeUI(assets){
    var body;
    var sumProfits = 0; 
    var sumPnL = 0;
    for(i=0; i < assets.length; i++){
        sumProfits = sumProfits + (assets[i].UNITS * assets[i].LAST_PRICE);
        sumPnL = sumPnL + (assets[i].UNITS * assets[i].LAST_PRICE) - assets[i].PURCHASE_VAL;
        var c = ( ((assets[i].UNITS * assets[i].LAST_PRICE) - assets[i].PURCHASE_VAL) >0)?"#05AC72":"#FF5639";
        body += `<tr class="text-right" id='div-tick-${assets[i].PURCHASE_ID}'> 
                    <td class="text-left">${assets[i].SYMBOL}</td>
                    <td id='p-time'>${assets[i].T}</td>
                    <td style='color:${c}' id='p-purchase-price'>${(assets[i].PURCHASE_PRICE).toLocaleString('en',{maximumFractionDigits: 2, minimumFractionDigits: 2})}</td>
                    <td style='color:${c}' id='p-current-price'>${(assets[i].LAST_PRICE).toLocaleString('en',{maximumFractionDigits: 2, minimumFractionDigits: 2})}</td>
                    <td id='p-units'>${(assets[i].UNITS).toLocaleString('en',{maximumFractionDigits: 0})}</td>
                    <td style='color:${c}' id='p-cost'>${(assets[i].PURCHASE_VAL).toLocaleString('en',{maximumFractionDigits: 2, minimumFractionDigits: 2})}</td>
                    <td style='color:${c}' id='p-fmv'>${((assets[i].UNITS * assets[i].LAST_PRICE)).toLocaleString('en',{maximumFractionDigits: 2, minimumFractionDigits: 2})}</td>
                    <td style='color:${c}' id='p-profit-loss'>${((assets[i].UNITS * assets[i].LAST_PRICE) - assets[i].PURCHASE_VAL).toLocaleString('en',{maximumFractionDigits: 2, minimumFractionDigits: 2})}</td>
                </tr>`
    }//end for

    body += `<tr> 
                <td class="text-left"></td><td>${' '}</td><td>${' '}</td><td>${' '}</td><td>${' '}</td><td>${' '}</td><td>${' '}</td><td></td>
            </tr>`
    //ADD CASH BALANCE TO THE BOTTOM OF THE TABLE
    body += `<tr class="text-right" id='div-tick-${' '}'> 
                <td class="text-left">Cash Balance</td>
                <td>${' '}</td>
                <td>${' '}</td>
                <td>${' '}</td>
                <td>${' '}</td>
                <td>${' '}</td>
                <td>${( assets[0].CASH ).toLocaleString('en',{maximumFractionDigits: 2, minimumFractionDigits: 2})}</td>
                <td></td>
            </tr>`
    //ADD TOTAL VALUE OF PORTFOLIO LINE
    body += `<tr class="text-right" id='div-tick-${' '}'> 
                <td class="text-left">Portfolio Value</td>
                <td></td>
                <td>${' '}</td>
                <td>${' '}</td>
                <td>${' '}</td>
                <td>${' '}</td>
                <td id='port-total-value'>$${(sumProfits + assets[0].CASH).toLocaleString('en',{maximumFractionDigits: 2, minimumFractionDigits: 2})}</td>
                <td>${( sumPnL ).toLocaleString('en',{maximumFractionDigits: 2, minimumFractionDigits: 2})}</td>
            </tr>`

    $('#port-tbody').html( body )
    

}//end make res



function getCountryRevenue(assets){
    var t = $.map(assets, function(obj){
        return obj.ticker
    }).join("'-US,'");

    SQL = ` select *
            from FIN_DEMO_UI.META.COUNTRY_REV_EXPOSURE
            where TICKER_REGION IN ('${t}')
            limit 10 `;
    
    runSQL(gbl.indconn, SQL).then((res)=>{
        console.log(res);
    })

}