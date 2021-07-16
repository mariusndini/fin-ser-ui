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

function S_P_500(){
    showMenu('treeDiv');
    $('#indicies-side-bar').show();
    
    gbl.sql = `
            select DISTINCT SYMBOL AS SYMBOL, 'EXCHANGE' as EXCHANGE, 100 as EQ, PCT_CHANGE as PCT_CHANGE
            from STOCKS.ALPACA.PCT_CHANGE_SINCE_OPEN
            where SYMBOL in ('MMM','ABT','ABBV','ABMD','ACN','ATVI','ADBE','AMD','AAP','AES','AFL','A','APD','AKAM','ALK','ALB','ARE','ALXN','ALGN','ALLE','LNT','ALL','GOOGL','GOOG','MO','AMZN','AMCR','AEE','AAL','AEP','AXP','AIG','AMT','AWK','AMP','ABC','AME','AMGN','APH','ADI','ANSS','ANTM','AON','AOS','APA','AAPL','AMAT','APTV','ADM','ANET','AJG','AIZ','T','ATO','ADSK','ADP','AZO','AVB','AVY','BKR','BLL','BAC','BK','BAX','BDX','BRK.B','BBY','BIO','BIIB','BLK','BA','BKNG','BWA','BXP','BSX','BMY','AVGO','BR','BF.B','CHRW','COG','CDNS','CPB','COF','CAH','KMX','CCL','CARR','CTLT','CAT','CBOE','CBRE','CDW','CE','CNC','CNP','CERN','CF','SCHW','CHTR','CVX','CMG','CB','CHD','CI','CINF','CTAS','CSCO','C','CFG','CTXS','CLX','CME','CMS','KO','CTSH','CL','CMCSA','CMA','CAG','CXO','COP','ED','STZ','COO','CPRT','GLW','CTVA','COST','CCI','CSX','CMI','CVS','DHI','DHR','DRI','DVA','DE','DAL','XRAY','DVN','DXCM','FANG','DLR','DFS','DISCA','DISCK','DISH','DG','DLTR','D','DPZ','DOV','DOW','DTE','DUK','DRE','DD','DXC','EMN','ETN','EBAY','ECL','EIX','EW','EA','EMR','ETR','EOG','EFX','EQIX','EQR','ESS','EL','ETSY','EVRG','ES','RE','EXC','EXPE','EXPD','EXR','XOM','FFIV','FB','FAST','FRT','FDX','FIS','FITB','FE','FRC','FISV','FLT','FLIR','FLS','FMC','F','FTNT','FTV','FBHS','FOXA','FOX','BEN','FCX','GPS','GRMN','IT','GD','GE','GIS','GM','GPC','GILD','GL','GPN','GS','GWW','HAL','HBI','HIG','HAS','HCA','PEAK','HSIC','HSY','HES','HPE','HLT','HFC','HOLX','HD','HON','HRL','HST','HWM','HPQ','HUM','HBAN','HII','IEX','IDXX','INFO','ITW','ILMN','INCY','IR','INTC','ICE','IBM','IP','IPG','IFF','INTU','ISRG','IVZ','IPGP','IQV','IRM','JKHY','J','JBHT','SJM','JNJ','JCI','JPM','JNPR','KSU','K','KEY','KEYS','KMB','KIM','KMI','KLAC','KHC','KR','LB','LHX','LH','LRCX','LW','LVS','LEG','LDOS','LEN','LLY','LNC','LIN','LYV','LKQ','LMT','L','LOW','LUMN','LYB','MTB','MRO','MPC','MKTX','MAR','MMC','MLM','MAS','MA','MKC','MXIM','MCD','MCK','MDT','MRK','MET','MTD','MGM','MCHP','MU','MSFT','MAA','MHK','TAP','MDLZ','MNST','MCO','MS','MOS','MSI','MSCI','NDAQ','NOV','NTAP','NFLX','NWL','NEM','NWSA','NWS','NEE','NLSN','NKE','NI','NSC','NTRS','NOC','NLOK','NCLH','NRG','NUE','NVDA','NVR','ORLY','OXY','ODFL','OMC','OKE','ORCL','OTIS','PCAR','PKG','PH','PAYX','PAYC','PYPL','PNR','PBCT','PEP','PKI','PRGO','PFE','PM','PSX','PNW','PXD','PNC','POOL','PPG','PPL','PFG','PG','PGR','PLD','PRU','PEG','PSA','PHM','PVH','QRVO','PWR','QCOM','DGX','RL','RJF','RTX','O','REG','REGN','RF','RSG','RMD','RHI','ROK','ROL','ROP','ROST','RCL','SPGI','CRM','SBAC','SLB','STX','SEE','SRE','NOW','SHW','SPG','SWKS','SLG','SNA','SO','LUV','SWK','SBUX','STT','STE','SYK','SIVB','SYF','SNPS','SYY','TMUS','TROW','TTWO','TPR','TGT','TEL','FTI','TDY','TFX','TER','TSLA','TXN','TXT','TMO','TIF','TJX','TSCO','TT','TDG','TRV','TFC','TWTR','TYL','TSN','UDR','ULTA','USB','UAA','UA','UNP','UAL','UNH','UPS','URI','UHS','UNM','VLO','VAR','VTR','VRSN','VRSK','VZ','VRTX','VFC','VIAC','VTRS','V','VNT','VNO','VMC','WRB','WAB','WMT','WBA','DIS','WM','WAT','WEC','WFC','WELL','WST','WDC','WU','WRK','WY','WHR','WMB','WLTW','WYNN','XEL','XRX','XLNX','XYL','YUM','ZBRA','ZBH','ZION','ZTS')
            order by PCT_CHANGE DESC
            --order by SYMBOL ASC `;

    getTreeMap(gbl.sql);
}

function Nasdaq_QQQ(){
    showMenu('treeDiv');
    $('#indicies-side-bar').show();
    
    gbl.sql = `
            select SYMBOL AS SYMBOL, 'EXCHANGE' as EXCHANGE, 100 as EQ, PCT_CHANGE as PCT_CHANGE
            from STOCKS.ALPACA.PCT_CHANGE_SINCE_OPEN
            where SYMBOL in ('AAPL','ADBE','ADI','ADP','ADSK','AEP','ALGN','ALXN','AMAT','AMD','AMGN','AMZN','ANSS','ASML','ATVI','AVGO','BIDU','BIIB','BKNG','CDNS','CDW','CERN','CHKP','CHTR','CMCSA','COST','CPRT','CSCO','CSX','CTAS','CTSH','DLTR','DOCU','DXCM','EA','EBAY','EXC','FAST','FB','FISV','FOX','FOXA','GILD','GOOG','GOOGL','IDXX','ILMN','INCY','INTC','INTU','ISRG','JD','KDP','KHC','KLAC','LRCX','LULU','MAR','MCHP','MDLZ','MELI','MNST','MRNA','MRVL','MSFT','MTCH','MU','MXIM','NFLX','NTES','NVDA','NXPI','OKTA','ORLY','PAYX','PCAR','PDD','PEP','PTON','PYPL','QCOM','REGN','ROST','SBUX','SGEN','SIRI','SNPS','SPLK','SWKS','TCOM','TEAM','TMUS','TSLA','TXN','VRSK','VRSN','VRTX','WBA','WDAY','XEL','XLNX','ZM')
            order by PCT_CHANGE DESC
            --order by SYMBOL ASC `;

    getTreeMap(gbl.sql);
}

function DJI(){
    showMenu('treeDiv');
    $('#indicies-side-bar').show();
    
    gbl.sql = `
            select SYMBOL AS SYMBOL, 'EXCHANGE' as EXCHANGE, 100 as EQ, PCT_CHANGE as PCT_CHANGE
            from STOCKS.ALPACA.PCT_CHANGE_SINCE_OPEN
            where SYMBOL in ('UNH','HD','CRM','AMGN','MSFT','V','MCD','GS','BA','HON','MMM','JNJ','CAT','WMT','PG','DIS','AAPL','IBM','TRV','NKE','JPM','AXP','CVX','MRK','VZ','INTC','KO','DOW','CSCO','WBA')
            order by PCT_CHANGE DESC
            --order by SYMBOL ASC `;

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

function showLeaderboard(){
    showMenu('all-leaderboard');

    var SQL = ` select NAME, USERTAG, ASSET_COUNT, VAL, TPMV, PROFITLOSS, PERFORMANCE_PCT, PORTFOLIO_ID
                from FINSERV_ASSET_SHARE.UI.PORTFOLIO_PERF
                order by performance_pct desc; `;

    runSQL(gbl.indconn, SQL).then((res)=>{
        gbl.leaderboard = res;

        $('#all-leaderboard tbody').html(' ')
        for( i=0; i <res.length; i++ ){
            var tr = $(`<tr>`).append(`<td> <a href='#' onclick='showPortfolioBreakdown("${res[i].NAME}", ${i}, true)'>${res[i].NAME}</a>
                                       </td>

                    <td style='font-size:12px;' class="text-right">${res[i].USERTAG}</td>
                    <td class="text-right">${res[i].ASSET_COUNT}</td>
                    <td class="text-right" style='color:${(res[i].PERFORMANCE_PCT>0)?"#05AC72":"#FF5639"}'>${parseFloat(res[i].VAL).toLocaleString('en')}</td>
                    <td class="text-right" style='color:${(res[i].PERFORMANCE_PCT>0)?"#05AC72":"#FF5639"}'>${parseFloat(res[i].TPMV).toLocaleString('en')}</td>

                    <td class="text-right" style='color:${(res[i].PERFORMANCE_PCT>0)?"#05AC72":"#FF5639"}'>${parseFloat(res[i].PROFITLOSS).toLocaleString('en')}</td>
                    <td class="text-right" style='color:${(res[i].PERFORMANCE_PCT>0)?"#05AC72":"#FF5639"}'>${parseFloat(res[i].PERFORMANCE_PCT).toLocaleString('en')}%</td>
                `)

            $('#all-leaderboard tbody').append(tr)
        }

    })

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
        var tr = $(`<tr>`).append(`<td class="text-right">${i}</td>
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
    
    //hide sidebar(s)
    $('#indicies-side-bar').hide();
    $('#screener-side-bar').hide();
    
    $('#'+menu).show();
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
    
    req.write(JSON.stringify({uuid:gbl.uuid, usertag: gbl.usertag, portfolio: gbl.portfolio, saveTime: gbl.saveTime}));
    req.end();

}//end save data







