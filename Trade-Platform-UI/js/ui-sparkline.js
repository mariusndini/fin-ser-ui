function getSandPSparkline(){ //for scrolling marque
    var SP500 = ['MMM','ABT','ABBV','ABMD','ACN','ATVI','ADBE','AMD','AAP','AES','AFL','A','APD','AKAM','ALK','ALB','ARE','ALXN','ALGN','ALLE','LNT','ALL','GOOGL','GOOG','MO','AMZN','AMCR','AEE','AAL','AEP','AXP','AIG','AMT','AWK','AMP','ABC','AME','AMGN','APH','ADI','ANSS','ANTM','AON','AOS','APA','AAPL','AMAT','APTV','ADM','ANET','AJG','AIZ','T','ATO','ADSK','ADP','AZO','AVB','AVY','BKR','BLL','BAC','BK','BAX','BDX','BRK.B','BBY','BIO','BIIB','BLK','BA','BKNG','BWA','BXP','BSX','BMY','AVGO','BR','BFB','CHRW','COG','CDNS','CPB','COF','CAH','KMX','CCL','CARR','CTLT','CAT','CBOE','CBRE','CDW','CE','CNC','CNP','CERN','CF','SCHW','CHTR','CVX','CMG','CB','CHD','CI','CINF','CTAS','CSCO','C','CFG','CTXS','CLX','CME','CMS','KO','CTSH','CL','CMCSA','CMA','CAG','CXO','COP','ED','STZ','COO','CPRT','GLW','CTVA','COST','CCI','CSX','CMI','CVS','DHI','DHR','DRI','DVA','DE','DAL','XRAY','DVN','DXCM','FANG','DLR','DFS','DISCA','DISCK','DISH','DG','DLTR','D','DPZ','DOV','DOW','DTE','DUK','DRE','DD','DXC','EMN','ETN','EBAY','ECL','EIX','EW','EA','EMR','ETR','EOG','EFX','EQIX','EQR','ESS','EL','ETSY','EVRG','ES','RE','EXC','EXPE','EXPD','EXR','XOM','FFIV','FB','FAST','FRT','FDX','FIS','FITB','FE','FRC','FISV','FLT','FLIR','FLS','FMC','F','FTNT','FTV','FBHS','FOXA','FOX','BEN','FCX','GPS','GRMN','IT','GD','GE','GIS','GM','GPC','GILD','GL','GPN','GS','GWW','HAL','HBI','HIG','HAS','HCA','PEAK','HSIC','HSY','HES','HPE','HLT','HFC','HOLX','HD','HON','HRL','HST','HWM','HPQ','HUM','HBAN','HII','IEX','IDXX','INFO','ITW','ILMN','INCY','IR','INTC','ICE','IBM','IP','IPG','IFF','INTU','ISRG','IVZ','IPGP','IQV','IRM','JKHY','J','JBHT','SJM','JNJ','JCI','JPM','JNPR','KSU','K','KEY','KEYS','KMB','KIM','KMI','KLAC','KHC','KR','LB','LHX','LH','LRCX','LW','LVS','LEG','LDOS','LEN','LLY','LNC','LIN','LYV','LKQ','LMT','L','LOW','LUMN','LYB','MTB','MRO','MPC','MKTX','MAR','MMC','MLM','MAS','MA','MKC','MXIM','MCD','MCK','MDT','MRK','MET','MTD','MGM','MCHP','MU','MSFT','MAA','MHK','TAP','MDLZ','MNST','MCO','MS','MOS','MSI','MSCI','NDAQ','NOV','NTAP','NFLX','NWL','NEM','NWSA','NWS','NEE','NLSN','NKE','NI','NSC','NTRS','NOC','NLOK','NCLH','NRG','NUE','NVDA','NVR','ORLY','OXY','ODFL','OMC','OKE','ORCL','OTIS','PCAR','PKG','PH','PAYX','PAYC','PYPL','PNR','PBCT','PEP','PKI','PRGO','PFE','PM','PSX','PNW','PXD','PNC','POOL','PPG','PPL','PFG','PG','PGR','PLD','PRU','PEG','PSA','PHM','PVH','QRVO','PWR','QCOM','DGX','RL','RJF','RTX','O','REG','REGN','RF','RSG','RMD','RHI','ROK','ROL','ROP','ROST','RCL','SPGI','CRM','SBAC','SLB','STX','SEE','SRE','NOW','SHW','SPG','SWKS','SLG','SNA','SO','LUV','SWK','SBUX','STT','STE','SYK','SIVB','SYF','SNPS','SYY','TMUS','TROW','TTWO','TPR','TGT','TEL','FTI','TDY','TFX','TER','TSLA','TXN','TXT','TMO','TIF','TJX','TSCO','TT','TDG','TRV','TFC','TWTR','TYL','TSN','UDR','ULTA','USB','UAA','UA','UNP','UAL','UNH','UPS','URI','UHS','UNM','VLO','VAR','VTR','VRSN','VRSK','VZ','VRTX','VFC','VIAC','VTRS','V','VNT','VNO','VMC','WRB','WAB','WMT','WBA','DIS','WM','WAT','WEC','WFC','WELL','WST','WDC','WU','WRK','WY','WHR','WMB','WLTW','WYNN','XEL','XRX','XLNX','XYL','YUM','ZBRA','ZBH','ZION','ZTS','SNOW']
    var SPSTR = SP500.map(function(val){
        return "'" + val + "-US'";
    }).join(",");

    var SQL = ` SELECT *
                FROM FIN_DEMO_UI.UI.SP_500_THIRTY_PRICE `;

    runSQL(gbl.indconn, SQL).then((res)=>{
        var ticks = JSON.stringify(res).replaceAll(`'`,``).replaceAll('-US','');
        ticks = JSON.parse(ticks);
        
        for(k=0; k < SP500.length; k++){
            var t = [];
            var start = 0;
            var end = 0;
            for(i=0; i<ticks.length; i++){
                t.push(ticks[i][SP500[k]])
                if (i==0){
                    start = ticks[i][SP500[k]];
                }else if(i == ticks.length -1){
                    end = ticks[i][SP500[k]];
                }
            }
            $('#trends-marquee').append(`<div onmouseover='showMarqueePopup(this);' style="display: inline-block;"><b>`+SP500[k]+`</b> `+end+`<span id='sparkline-`+SP500[k]+`' style='height: 100%;width: 50px;'></span></div>`);
            $("#sparkline-"+SP500[k]).sparkline(t, {
                type: 'line',
                width: '50px',
                height: '100%',
                lineColor: (start-end<0)?"#05AC72":"#FF5639",
                fillColor: null,
                lineWidth: 2,
                spotColor: null,
                minSpotColor: null,
                maxSpotColor: null,
                highlightSpotColor: null,
                highlightLineColor: null,
                drawNormalOnTop: false,
                disableTooltips: true});

            }//end big for loop
            
        });//end get data    
}// end get trend

function candleStickArrayJoin(arr){
    var SPSTR = arr.map(function(val){
        return "'" + val + "-US'";
    }).join(",");
    
    return SPSTR;
}

function showMarqueePopup(t){
    //console.log(t)
}

function getAsssetSparkPerfSpark(asset){
    var SQL = ` SELECT *
                FROM FIN_DEMO_UI.META.INCOME_STMT
                WHERE TICKER_REGION ='`+asset+`-US';`
    
    runSQL(gbl.indconn, SQL).then((res)=>{
        var rev = []
        var debt = []
        var income = []
        var opex = []
        var eps = []
        var div = []
        var cogs = []

        for(i=0; i < res.length; i++){
            rev.push(res[i].REV)
            debt.push(res[i].DEBT)
            income.push(res[i].INCOME)
            opex.push(res[i].OPEX)
            eps.push(res[i].EPS)
            div.push(res[i].DIV_PAY)
            cogs.push(res[i].COGS)
           
        }//end big for loop
        makeAllAssetSparks(rev, income, eps, debt, opex, div, cogs);
    })//end run sql

}


function getDayInfoSparks(asset, day){
    var SQL = ` select VOL, CLOSE
                from "STOCKS"."ALPACA"."MINUTE_TICKS"
                where symbol = '`+asset+`'
                and DATE_TRUNC('DAY', STARTTIME) = '`+day+`'
                order by STARTTIME asc; `;


    runSQL(gbl.sparkConn, SQL).then((res)=>{
        var price = []
        var vol = []

        for(i=0; i<res.length; i++){
            price.push( res[i].CLOSE )
            vol.push( res[i].VOL )
        }

        makeSparks('spark-asset-history','bar',vol, false)
        makeSparks('spark-asset-history','line',price, true)
        // makeSparks('spark-asset-vol','bar',vol, true)
        
        function makeSparks (id, type, data, comp){
            $("#"+ id).sparkline(data, {
                type: type,
                width: '500px',
                height: '100px',
                lineColor: "#FFF",
                fillColor: null,
                spotRadius:4,
                lineWidth: 3,
                spotColor: null,
                minSpotColor: "#FF5639",
                maxSpotColor: "#05AC72",
                highlightSpotColor: '#F7DBD7',
                highlightLineColor: '#EEEEEE',
                composite: comp,
                drawNormalOnTop: false,
                disableTooltips: false});
        }


    })//end run SQL


}

function makeAllAssetSparks(rev, income, eps, debt, opex, div, cogs){
    makeSpark('asset-table-rev-spark', 'asset-rev-spark', rev)
    makeSpark('asset-table-income-spark', 'asset-income-spark', income)
    makeSpark('asset-table-eps-spark', 'asset-eps-spark', eps)
    makeSpark('asset-table-debt-spark', 'asset-debt-spark', debt)
    makeSpark('asset-table-opex-spark', 'asset-opex-spark', opex)
    makeSpark('asset-table-div-spark', 'asset-div-spark', div)
    makeSpark('asset-table-cogs-spark', 'asset-cogs-spark', cogs)

}

function makeSpark(sparkID, addID, data, type){
    $('#' + addID).append(`<div style="display: inline-block;"><span id='`+sparkID+`' style='height: 100%;width: 50px;'></span></div>`);
    $("#"+sparkID).sparkline(data, {
        type: 'line',
        width: '150px',
        height: '50px',
        lineColor: "#FFF",
        fillColor: null,
        lineWidth: 3,
        spotColor: null,
        minSpotColor: null,
        maxSpotColor: null,
        highlightSpotColor: null,
        highlightLineColor: null,
        drawNormalOnTop: false,
        disableTooltips: false});
    
}


