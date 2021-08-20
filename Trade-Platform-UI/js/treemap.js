function getTreeMap(SQL){
    SQL = SQL || gbl.sql;

    runSQL(gbl.indconn, SQL).then((res)=>{
        //console.log(res);
        var marketCapAdjust = $('#market-cap-cb').is(":checked");
        var marketOpenAdjust = $('#market-open-cb').is(":checked");

        let canvas = d3.select('#treeMap');

        let drawTreeMap = () => {
            d3.selectAll("#treeMap > g").remove()
                
            var entries = d3.nest()
                .key(function(d) { return d.EXCHANGE; })
                .key(function(d) { return d.SYMBOL; })
                .entries(res);

            let hierarchy = d3.hierarchy(entries[0], (node) =>{
                return node.values
            }).sum((node)=>{
                if(marketCapAdjust){
                    return node.VALUE
                }else if(marketOpenAdjust){
                    return Math.abs( node.PCT_CHANGE )
                }else{
                    return node.EQ
                }                
            });

            //console.log(hierarchy);

            let createTreeMap = d3.treemap()
                .size([document.getElementById('treeDiv').getBoundingClientRect().width, 
                       document.getElementById('treeDiv').getBoundingClientRect().height]);
            
            createTreeMap(hierarchy);

            let stockTiles = hierarchy.leaves();
            //console.log(stockTiles);
            
            let block = canvas.selectAll('g')
                .data(stockTiles)
                .enter()
                .append('g')
                .attr('transform', (stock)=>{
                    return 'translate('+stock['x0']+','+stock['y0']+')'
                })

            //rect w/ bg color fill
            block.append('rect')
                .attr('class','tile')
                .attr('fill',(stock)=>{
                    //console.log(stock.data.PCT_CHANGE);
                    if(stock.data.PCT_CHANGE < 0){
                        return '#FF5639' // red
                    }else{
                        return '#05AC72' // green
                    }

                })
                .style("stroke", "black")
                .attr('width', (stock)=>{
                    return stock['x1'] - stock['x0']
                })
                .attr('height', (stock)=>{
                    return stock['y1'] - stock['y0']
                })
                .on('mouseover', (stock)=>{
                    //console.log(stock);
                });
                
            //SYMBOL ON THE SHEET
            var counter = 0;
            block.append('text')
                .attr('x',(stock) => { return (stock['x1'] - stock['x0']) / 2 })
                .attr('y',(stock) => { return ( (stock['y1'] - stock['y0']) / 2) - 5 })
                .attr('text-anchor', 'middle')
                .style('fill','white')
                .text((stock)=>{
                    counter = counter + 1;
                    return stock['data']['SYMBOL'];
            }).on('click',(stock)=>{
                showAsset(stock.toElement.textContent);
            })

            // value under symbol
            counter = 0;
            block.append('text')
                .attr('x',(stock) => { return ( (stock['x1'] - stock['x0']) / 2)})
                .attr('y',(stock) => { return ( (stock['y1'] - stock['y0']) / 2) + 10})
                .attr('text-anchor', 'middle')
                .style('fill','white')
                .text((stock)=>{
                    if(marketCapAdjust){ // logic may not be necessary b/c market cap no longer used
                        counter = counter + 1;
                        if( counter < 100 || !marketCapAdjust){
                            if(Math.trunc(stock['data']['VALUE'] >= 1000000000)){
                                return Math.trunc(stock['data']['VALUE']/1000000000)+'B';

                            }else if(Math.trunc(stock['data']['VALUE'] <= 1000000000)){
                                return Math.trunc(stock['data']['VALUE']/1000000)+'M';
                            }
                        }
                    }else{
                        if(stock.data.PCT_CHANGE >= 0){
                            return (stock.data.PCT_CHANGE+'').substring(0, 4)+'%';
                        }else{
                            return (stock.data.PCT_CHANGE+'').substring(1, 5)+'%';
                        }

                    }

                })//end block
            
                

        }//end 

        drawTreeMap();

    })

}//end get tree map




function S_P_500(){
    showMenu('treeDiv');
    $('#indicies-side-bar').show();
    
    gbl.sql = `
            select DISTINCT SYMBOL AS SYMBOL, 'EXCHANGE' as EXCHANGE, 100 as EQ, PCT_CHANGE as PCT_CHANGE
            from FIN_DEMO_UI.PIPE.PCT_CHANGE_SINCE_OPEN
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
            from FIN_DEMO_UI.PIPE.PCT_CHANGE_SINCE_OPEN
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
            from FIN_DEMO_UI.PIPE.PCT_CHANGE_SINCE_OPEN
            where SYMBOL in ('UNH','HD','CRM','AMGN','MSFT','V','MCD','GS','BA','HON','MMM','JNJ','CAT','WMT','PG','DIS','AAPL','IBM','TRV','NKE','JPM','AXP','CVX','MRK','VZ','INTC','KO','DOW','CSCO','WBA')
            order by PCT_CHANGE DESC
            --order by SYMBOL ASC `;

    getTreeMap(gbl.sql);
}




