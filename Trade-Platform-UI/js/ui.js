function select_exchange(d){ //NOT USED AND DEPRECATED I BELIEVE - JUST SCARED TO DELETE
    gbl.exchange = d; 

    gbl.sql = `select SYMBOL AS SYMBOL, 'EXCHANGE' as EXCHANGE, MKTCAP as VALUE, 100 as EQ
        from ZEPL_US_STOCKS_DAILY.PUBLIC.COMPANY_PROFILE
        where exchange = '`+gbl.exchange+`'
        order by MKTCAP DESC
        limit 500`;
        
    getTreeMap(gbl.sql);
}

function add_stock_portolio(sym){
    gbl.portfolio.push(`'`+sym+`'`)
    console.log( gbl.portfolio );
}

function show_portfolio_chart(){
    gbl.sql = `select SYMBOL AS SYMBOL, 'EXCHANGE' as EXCHANGE, MKTCAP as VALUE, 100 as EQ
        from ZEPL_US_STOCKS_DAILY.PUBLIC.COMPANY_PROFILE
        where SYMBOL in (`+ gbl.portfolio.join() +`)
        order by MKTCAP DESC
        limit 500`;

    getTreeMap(gbl.sql);
}


function portPurchaseInfo(idUnits, idSpan,i, k, price, cash){
    var units = $('#'+idUnits+i+'-'+k).val();

    $('#'+idSpan+i+'-'+k).html( (price * units).toLocaleString('en', {maximumFractionDigits: 2, minimumFractionDigits: 2}) );
    if((price * units) > cash){
        $('#'+idSpan+i+'-'+k).css('color','#FF5639')
    }else{
        $('#'+idSpan+i+'-'+k).css('color','#05AC72')
    }
}

function setScreenrOrder(id){
    if(screenrSort.type == 'asc'){
        screenrSort.type = 'desc'
    }else{
        screenrSort.type = 'asc'
    }
    
    screenrSort.col = id;
    showScreenr();
}

function showProfile(){
    showMenu('profileDiv');
}

function showBitcoin(){
    showMenu('bitcoin-div');
}

function showAllPortfolios(){
    showMenu('all-ports-Div');
    
    $('#all-ports-Div').html(' ')
        .append(`<table class="table table-sm table-dark table-hover" id='all-ports-table'><thead></thead></table>`);

    var th = `<tr>
            <th class="text-right" scope="col">ID</th>
            
            <th class="text-left" scope="col">Name</th>
            <th class="text-right" scope="col">Asset Count</th>
            <th class="text-right" scope="col">Profit/ Loss</th>
        </tr>`;
    $('#all-ports-table thead').append(th)

    $('#all-ports-table').append(`<tbody style='background-color:black'></tbody>`)

    for(i=0; i < gbl.portfolio.length; i++){
        var tr = $(`<tr>`).append(`<td class="text-right">${i + 1}</td>
                <td class="text-left"><a href='#' onclick='showPortfolioBreakdown("${gbl.portfolio[i].name}", ${i})'>${gbl.portfolio[i].name}</a></td>
                <td class="text-right">${gbl.portfolio[i].assets.length}</td>
                <td class="text-right">${0}</td>`);                               
        
        $('#all-ports-table tbody').append(tr)
    }

    


}

function showMenu(menu){
    $('#treeDiv').hide();
    $('#screenrDiv').hide();
    $('#profileDiv').hide();
    $('#all-ports-Div').hide();
    $('#show-asset-div').hide();
    $('#portfolio-assets-div').hide();
    $('#indi-ports-Div').hide();
    $('#all-leaderboard').hide()
    $('#bitcoin-div').hide()
    
    //hide sidebar(s)
    $('#indicies-side-bar').hide();
    $('#screener-side-bar').hide();

    $('#'+menu).show();
    
    if(ws){
        closeWS();
    }

}

function make_portfolio(name){
    var port_start_cash = 1000000;
    var portfolio = {name : name, id: generateGuid(), assets:[], cash: port_start_cash, createTime: Date.now()};
    gbl.portfolio.push(portfolio)
    $("#new-port-input").val('')

    $('#portfolio-dropdown').append(`<a class="dropdown-item" href="#" onclick='showPortfolioBreakdown("${name}", ${gbl.portfolio.length-1})' >`+portfolio.name+`</a>`)
    saveData();

    $('#portfolio-dropdown-profile').html(' ')
    for(i=0; i < gbl.portfolio.length; i++){
        $('#portfolio-dropdown-profile').append(`<b onclick='removePortfolio(`+i+`)'>🆇</b> <a href='#' onclick='showPortfolioBreakdown("${gbl.portfolio[i].name}", ${i})'>` +gbl.portfolio[i].name + `</a><br>`)
    }

}

function addAssetToPortfolio(asset, units, index, sym_id, price){
    var assetCost = units * price;
    var cash = gbl.portfolio[index].cash;
    if(cash >= assetCost){
        if(units > 0){
            gbl.portfolio[index].cash = cash - assetCost;
            gbl.portfolio[index].assets.push({ticker:asset, units: units, sym_id: sym_id})
            // console.log(gbl.portfolio[index])
        }
        //save data
        saveData()
    }else{
        alert(`Not Enough Cash $${parseFloat(cash).toLocaleString('en')} to 
                Purchase Asset $${parseFloat(assetCost).toLocaleString('en')}.\n
                You can only purchase ${((cash/price)-1).toLocaleString('en', {maximumFractionDigits: 0})}`);
    }

    
}



function randBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}



function initUI(){
    $('#user-id-profile').html(gbl.uuid);
    if(gbl.usertag == null){
        setUserTag('user-' + gbl.uuid.substring(0,8));
    }

    $('#user-tag-input').val(gbl.usertag)

    $('#portfolio-dropdown').html(`<div class="input-group mb-3">
                                        <input type="text" class="form-control" id='new-port-input' placeholder="New Portfolio Name"  aria-describedby="basic-addon1">
                                        <button type="button" class="btn btn-dark" onclick='make_portfolio($("#new-port-input").val())'>👍</button>
                                    </div>
                                    <div class="dropdown-divider"></div>
                                    
                                    <a class="dropdown-item" href="#" onclick="showAllPortfolios()"><strong>Show All</strong></a>`)

    for(i=0; i < gbl.portfolio.length; i++){
        //<b onclick='removePortfolio(`+i+`)'>🆇</b>
        $('#portfolio-dropdown').append(`<a class="dropdown-item" href="#" onclick='showPortfolioBreakdown("${gbl.portfolio[i].name}", ${i})'>` +gbl.portfolio[i].name+`</a>`)
    }

    //PROFILE PAGE IS UPDATED HERE HERE
    $('#portfolio-dropdown-profile').html(' ')
    for(i=0; i < gbl.portfolio.length; i++){
        $('#portfolio-dropdown-profile').append(`<b onclick='removePortfolio(`+i+`)'>🆇</b> <a href='#' onclick='showPortfolioBreakdown("${gbl.portfolio[i].name}", ${i})'>` +gbl.portfolio[i].name + `</a><br>`)
    }
    getEconomy();
    getSector();
    getIndustry();
    
}//end init ui


function closeAssetPage(){
    $('#show-asset-div').hide(); $('#screener-side-bar').show(); $('#screenrDiv').show();
    $('#add-compare-input-area-pills').html(' ');
    gbl.candleCompare = []
}



function generateGuid() {
    var result, i, j;
    result = '';
    for(j=0; j<32; j++) {
      if( j == 8 || j == 12 || j == 16 || j == 20)
        result = result + '-';
      i = Math.floor(Math.random()*16).toString(16).toUpperCase();
      result = result + i;
    }
    return result;
  }

function removePortfolio(index){
    gbl.portfolio.splice(index, 1)
    saveData();
    initUI();
}

function setUserTag(tag){
    gbl.usertag = tag;
    gbl.portfolio = [];
    gbl.uuid = generateGuid();
    saveData();
    location.reload(); //refresh the page
}


const http = require("https");
function saveData(){
    gbl.saveTime = Date.now();
    localStorage.setItem("gbl", JSON.stringify(gbl) );

    var options = {
        "method": "POST",
        "hostname": "datapi1.p.rapidapi.com",
        "port": null,
        "path": "/set/snowflake-asset-ui-demo-"+gbl.uuid,
        "headers": {
            "content-type": "application/json",
            "x-rapidapi-key": "de599e61d7msh6ca875ed8566e5dp1b9b20jsndaa94d777f24",
            "x-rapidapi-host": "datapi1.p.rapidapi.com",
            "useQueryString": true
        }
    };
    
    var req = http.request(options, function (res) {
        const chunks = [];
    
        res.on("data", function (chunk) {
            chunks.push(chunk);
        });
    
        res.on("end", function () {
            const body = Buffer.concat(chunks);
            console.log(body.toString());
        });
    });
    
    console.log( {uuid:gbl.uuid, usertag: gbl.usertag, portfolio: gbl.portfolio, saveTime: gbl.saveTime} )
    req.write(JSON.stringify({uuid:gbl.uuid, usertag: gbl.usertag, portfolio: gbl.portfolio, saveTime: gbl.saveTime}));
    req.end();

}//end save data







