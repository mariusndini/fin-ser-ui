var screenrSort = {col:'ACCUMULATEDVOLUME', type: 'desc'}

function getEconomy(){
    var SQL = ` select DISTINCT EXCHANGE
                FROM FIN_DEMO_UI.UI.SCREENER
                order by 1 asc;`; 
    runSQL(gbl.indconn, SQL).then((res)=>{
        $('#exchange-input-select').html(' ');

        var options = '<option selected>All</option>';

        for(i=0; i < res.length; i++){
            options += `<option>${res[i].EXCHANGE}</option>`;
        }

        $('#exchange-input-select').append(options);
        
    })//end get data

}// end get econ

function getSector(){
    var economy = $('#exchange-input-select').find(":selected").text()
    var SQL = ` select DISTINCT SECTOR
                FROM FIN_DEMO_UI.UI.SCREENER `;
    if (economy != 'All'){
        SQL += ` WHERE EXCHANGE = '${economy}'`;
    }
    SQL += ` order by 1 asc`;

    runSQL(gbl.indconn, SQL).then((res)=>{
        $('#sector-input-select').html(' ');

        var options = '<option selected>All</option>';

        for(i=0; i < res.length; i++){
            options += `<option>${res[i].SECTOR}</option>`;
        }

        $('#sector-input-select').append(options);
    })//end get data

}// end get econ

function getIndustry(){
    var sector = $('#sector-input-select').find(":selected").text()
    var SQL = ` select DISTINCT INDUSTRY
                FROM FIN_DEMO_UI.UI.SCREENER `;
    if (sector != 'All'){
        SQL += ` WHERE SECTOR = '${sector}'`;
    }
    SQL += ` order by 1 asc`;

    runSQL(gbl.indconn, SQL).then((res)=>{
        $('#industry-input-select').html(' ');

        var options = '<option selected>All</option>';

        for(i=0; i < res.length; i++){
            options += `<option>${res[i].INDUSTRY}</option>`;
        }

        $('#industry-input-select').append(options);
    })//end get data

}// end get econ

function showScreenr(){
    var exchange_filter = $('#exchange-input-select').find(':selected').text();
    var industry_filter = $('#industry-input-select').find(':selected').text();
    var sector_filter = $('#sector-input-select').find(':selected').text();
    var mc_start = $('#mc-start-input-select').find(':selected').text();
    var mc_end = $('#mc-end-input-select').find(':selected').text();
    var ticker = $('#ticker-input').val();

    var SQL = ` select DISTINCT SYMBOL, T, PCT_CHANGE, OFFICIALOPEN, HIGH, ACCUMULATEDVOLUME, VWAP,
                       MKTCAP, LASTDIV, EXCHANGE, INDUSTRY, SECTOR, RANGE, SYM_ID::STRING AS SYM_ID, NAME, ENTITY_ID, ENTITY_PROPER_NAME
                       ,ENTITY_PROFILE, FIGI
                from FIN_DEMO_UI.UI.SCREENER
                where true `;

    if(exchange_filter != 'All'){
        SQL += ` and EXCHANGE = '${exchange_filter}'`
    }

    if(industry_filter != 'All'){
        SQL += ` and INDUSTRY = '${industry_filter}'`
    }

    if(sector_filter != 'All'){
        SQL += ` and SECTOR = '${sector_filter}'`
    }

    if(ticker != ""){
        SQL += ` and (SYMBOL like UPPER('%${ticker}%') or ENTITY_ID like UPPER('%${ticker}%') or FIGI like UPPER('%${ticker}%'))`
    }

    SQL += ` and MKTCAP >= ${mc_start} * 1000 and MKTCAP <= ${mc_end} * 1000 `
    
    SQL += ` order by ${screenrSort.col} ${screenrSort.type}
            limit 100`;


    $('#screenrDiv').html(' ')
        .append(`<table class="table table-sm table-dark table-hover" id='screenr-table'>
                    <thead></thead>
                </table>`)
    
    var th = `<tr>
                <th class="text-center" onclick='setScreenrOrder("1")' scope="col">🎫<br>Symbol</th>
                    <td style='width:20px'></td>
                <th class="text-center" onclick='setScreenrOrder("2")' scope="col">⏰<br>Time</th>

                <th class="text-center" style='width:70px;' onclick='setScreenrOrder("10")' scope="col">🏛<br>Economy</th>
                <th class="text-center" style='width:70px;' onclick='setScreenrOrder("11")' scope="col">🏭<br>Industry</th>
                <th class="text-center" style='width:70px;' onclick='setScreenrOrder("12")' scope="col">𑅀<br>Sector</th>


                <th class="text-center" onclick='setScreenrOrder("3")' scope="col">%<br>Pct Change</th>
                <th class="text-center" onclick='setScreenrOrder("5")' scope="col">🏷<br>Price</th>

                <th class="text-center" onclick='setScreenrOrder("6")' scope="col">💹<br>Volume</th>
                <th class="text-center" onclick='setScreenrOrder("8")' scope="col">💰<br>Market Cap</th>

                <th class="text-center" onclick='setScreenrOrder("7")' scope="col">💸<br>VWAP</th>

                </tr>`;
    $('#screenr-table thead').append(th)
    
    $('#screenr-table').append(`<tbody style='background-color:black'></tbody>`)

    runSQL(gbl.indconn, SQL).then((res)=>{
        gbl.screener_result = res;
        for( i=0; i <res.length; i++ ){
            var p = '';
            for(k=0; k < gbl.portfolio.length; k++){
                p +=`<div class="input-group mb-1">
                        <span style='padding-left:10px; width:60%' >
                            <strong onclick='showPortfolioBreakdown("${gbl.portfolio[k].name}", ${k})'> <a href='#'>`+gbl.portfolio[k].name+`</a>  </strong>
                            <br>
                            <span style='font-size:12px;font-weight:bolder'>$${(gbl.portfolio[k].cash).toLocaleString('en', {maximumFractionDigits: 0})}</span>
                            <span style='font-size:12px;font-weight:bold' id='port-add-purchase-price-screenr-${i}-${k}'></span>
                        </span>

                        <input type="number" style='50px' class="form-control" onchange="portPurchaseInfo('unit-buy-input-screenr-','port-add-purchase-price-screenr-',${i},${k}, ${res[i].HIGH}, ${gbl.portfolio[k].cash})" onkeyup="portPurchaseInfo('unit-buy-input-screenr-','port-add-purchase-price-screenr-',${i},${k}, ${res[i].HIGH}, ${gbl.portfolio[k].cash})" id='unit-buy-input-screenr-`+i+`-`+k+`' placeholder="Units" min="1"  aria-describedby="basic-addon1">
                        <button type="button" class="btn btn-dark" onclick='addAssetToPortfolio("${res[i].SYMBOL}",$("#unit-buy-input-screenr-`+i+`-`+k+`").val(), ${k}, "${res[i].SYM_ID}", ${parseFloat(res[i].HIGH)} )'>👍</button>
                    </div>`;
            }//end port list
    
            var stock_popup = `<div class="btn-group dropright w-20">
                <button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                <div class="dropdown-menu" x-placement="right-start" style="position: absolute; transform: translate3d(111px, 0px, 0px); top: 0px; left: 0px; will-change: transform; width:350px">
                <a class="dropdown-item" href="#" onclick="showAsset('${res[i].SYMBOL}', ${i})">View Asset: <b>${res[i].SYMBOL}</b></a>
                <div class="dropdown-divider"></div>
                    `+p+`
                </div>
            </div>`

            var tr = $(`<tr>`).append(`<td style="width: 1%;white-space: nowrap;"><a href='#' onclick="showAsset('${res[i].SYMBOL}', ${i} )">${res[i].SYMBOL} | ${(res[i].ENTITY_ID==null ? "-" : res[i].ENTITY_ID)} | ${(res[i].FIGI==null ? "-" : res[i].FIGI)}</a>
                                            <br><span style='font-size:12px'>${(res[i].ENTITY_PROPER_NAME==null ? "-" : res[i].ENTITY_PROPER_NAME)}</span>
                                       </td>
                                       
                                       <td>${stock_popup}</td>
                                       
                                       <td style='font-size:12px;'>${(res[i].T==null ? "-" : res[i].T)}</td>
                                       <td style='font-size:10px;'>${(res[i].EXCHANGE==null ? "" : res[i].EXCHANGE)}</td>
                                       <td style='font-size:10px;'>${(res[i].INDUSTRY==null ? "" : res[i].INDUSTRY)}</td>
                                       <td style='font-size:10px;'>${(res[i].SECTOR==null ? "" : res[i].SECTOR)}</td>
                                       
                                       <td class="text-right" style='color:${(res[i].PCT_CHANGE>0)?"#05AC72":"#FF5639"}'>${(res[i].PCT_CHANGE+'').substring(0,5)}%</td>
                                       <td class="text-right" style='color:${(res[i].PCT_CHANGE>0)?"#05AC72":"#FF5639"}'>${parseFloat(res[i].HIGH).toLocaleString('en', {maximumFractionDigits: 2, minimumFractionDigits: 2})}</td>

                                       <td class="text-right" >${parseFloat(res[i].ACCUMULATEDVOLUME).toLocaleString('en',{maximumFractionDigits: 0})}</td>
                                       <td class="text-right" >${parseFloat(res[i].MKTCAP).toLocaleString('en',{maximumFractionDigits: 0})}</td>

                                       <td class="text-right" >${parseFloat(res[i].VWAP).toLocaleString('en', {maximumFractionDigits: 2, minimumFractionDigits: 2})}</td>
                                       `)
            
            $('#screenr-table tbody').append(tr)
        }

    })

    showMenu('screenrDiv'); 
    $('#screener-side-bar').show();
    
}


//adds a new column to the screener table 
function addColumn(){
    $('#screenr-table').find('tr').each(function(){
        $(this).find('td').eq(10).after('<td>new cell added</td>');
   });


}