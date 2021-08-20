
function showPortfolioBreakdown(port, index, isLeaderboard){
    //local port vars
    var port, assets, body, tickers, SQL;
    if(!isLeaderboard){
        port = gbl.portfolio[index];
        gbl.portUUID = port.id;
        makePortPerf(port.id); // make performance chart
        $('#portfolio-id-in-div').html('💼' +gbl.portfolio[index].name)
        assets =  port.assets;
        body = ''

        tickers = $.map(assets, function(obj){
            return obj.sym_id
        }).join("','");

        SQL = ` select symbol, time, high, mx_price, id
                from INDUSTRY_FINANCIAL_SERVICES.APP_ALPACA.INDIVIDUAL_PORTFOLIO_PERF
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

    getCountryRevenue(assets); //GET ALL REVENUE BY COUNTRY
    getCountrySuppliers(assets); //GET ALL SUPPLIERS BY COUNTRY
    getCountryRevenue(assets);
    getSegmentRevenue(assets);

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
                    <td id='p-percent'${' '}</td>
                </tr>`
    }

    body += `<tr> 
                <td class="text-left"></td><td>${' '}</td><td>${' '}</td><td>${' '}</td><td>${' '}</td><td>${' '}</td><td>${' '}</td><td></td><td></td>
            </tr>`
    //ADD CASH BALANCE TO THE BOTTOM OF THE TABLE
    body += `<tr class="text-right" id='div-tick-${' '}'> 
                <td class="text-left">Cash Balance</td>
                <td>${' '}</td>
                <td>${' '}</td>
                <td>${' '}</td>
                <td>${' '}</td>
                <td>${' '}</td>
                <td>${( port.cash || 0).toLocaleString('en',{maximumFractionDigits: 2, minimumFractionDigits: 2})}</td>
                <td></td>
                <td></td>
            </tr>`
    //ADD TOTAL VALUE OF PORTFOLIO LINE
    body += `<tr class="text-right" id='div-tick-${' '}'> 
                <td class="text-left">Portfolio Value</td>
                <td></td>
                <td>${' '}</td>
                <td>${' '}</td>
                <td>${' '}</td>
                <td id='port-total-cost'></td>
                <td id='port-total-value'>$-</td>
                <td id='port-total-pnl'>$-</td>
                <td id='port-pnl-pct'></td>
            </tr>`

    //go to snowflake and get values for the stocks
    runSQL(gbl.indconn, SQL).then((res)=>{ 
        var sumProfits = 0;
        var PnL = 0;
        var portCost = 0;
        for (i=0; i < res.length; i++){
            var units = parseInt( $(`#div-tick-${res[i].ID} #p-units`).html() );
            profits = (res[i].MX_PRICE * units) - (res[i].HIGH *  units);
            PnL += profits;
            sumProfits = sumProfits + res[i].MX_PRICE * units;
            portCost += (res[i].HIGH *  units);

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

            $(`#div-tick-${res[i].ID} #p-percent`)
                .html( parseFloat( profits / (res[i].HIGH * units) * 100 ).toLocaleString('en',{maximumFractionDigits: 2, minimumFractionDigits: 2}) )
                .attr('style', `color:${(profits>0)?"#05AC72":"#FF5639"}`);

        }// end for

        $('#port-total-cost').html(parseFloat( portCost ).toLocaleString('en',{maximumFractionDigits: 2, minimumFractionDigits: 2}));        
        $('#port-total-value').html(parseFloat( port.cash + sumProfits ).toLocaleString('en',{maximumFractionDigits: 2, minimumFractionDigits: 2}));
        $('#port-total-pnl').html(parseFloat( PnL ).toLocaleString('en', {maximumFractionDigits: 2, minimumFractionDigits: 2}));
        $('#port-pnl-pct').html(parseFloat( (PnL / portCost) * 100 ).toLocaleString('en', {maximumFractionDigits: 2, minimumFractionDigits: 2}));
        $("[id^=ticker-sell-btn]").show();
    });//end run sql


    $('#port-tbody').html( body )
    showMenu('indi-ports-Div'); // SHOW THE DIV



}//end port

function makeLeaderboardPort(uuid){
    gbl.portUUID = uuid;
    SQL = ` select *, RIGHT('00'||MONTH(PURCHASE_TIME),2)||'/'|| RIGHT('00'||DAY(PURCHASE_TIME),2) ||'/'|| RIGHT(YEAR(PURCHASE_TIME),2)||' '||RIGHT('00'||HOUR(PURCHASE_TIME),2)||':'|| RIGHT('00'||MINUTE(PURCHASE_TIME),2) AS T
            from INDUSTRY_FINANCIAL_SERVICES.APP_ALPACA.PORTFOLIO_PNL
            where PORTFOLIO_ID = '${uuid}' `;
    
    makePortPerf(uuid);

    showMenu('indi-ports-Div'); // SHOW THE DIV
    
    runSQL(gbl.indconn, SQL).then((res)=>{
        makeUI(res);
    })

}//end 

function makeUI(assets){
    var body;
    var sumProfits = 0; 
    var sumPnL = 0;
    var sumCost = 0;
    var tickers = []

    for(i=0; i < assets.length; i++){
        tickers.push( {ticker: (assets[i].SYMBOL).replace('-US', '')} )
        sumProfits = sumProfits + (assets[i].UNITS * assets[i].LAST_PRICE);
        sumPnL = sumPnL + (assets[i].UNITS * assets[i].LAST_PRICE) - assets[i].PURCHASE_VAL;
        sumCost += assets[i].PURCHASE_VAL;
        var c = ( ((assets[i].UNITS * assets[i].LAST_PRICE) - assets[i].PURCHASE_VAL) >0)?"#05AC72":"#FF5639";

        body += `<tr class="text-right" id='div-tick-${assets[i].PURCHASE_ID}'> 
                    <td class="text-left">${assets[i].SYMBOL}</td>
                    <td id='p-time'>${assets[i].T}</td>
                    <td style='color:${c}' id='p-purchase-price'>${(assets[i].PURCHASE_PRICE).toLocaleString('en',{maximumFractionDigits: 2, minimumFractionDigits: 2})}</td>
                    <td style='color:${c}' id='p-current-price'>${(assets[i].LAST_PRICE || 0).toLocaleString('en',{maximumFractionDigits: 2, minimumFractionDigits: 2})}</td>
                    <td id='p-units'>${(assets[i].UNITS).toLocaleString('en',{maximumFractionDigits: 0})}</td>
                    <td style='color:${c}' id='p-cost'>${(assets[i].PURCHASE_VAL).toLocaleString('en',{maximumFractionDigits: 2, minimumFractionDigits: 2})}</td>
                    <td style='color:${c}' id='p-fmv'>${((assets[i].UNITS * assets[i].LAST_PRICE)).toLocaleString('en',{maximumFractionDigits: 2, minimumFractionDigits: 2})}</td>
                    <td style='color:${c}' id='p-profit-loss'>${((assets[i].UNITS * assets[i].LAST_PRICE) - assets[i].PURCHASE_VAL).toLocaleString('en',{maximumFractionDigits: 2, minimumFractionDigits: 2})}</td>
                    <td style='color:${c}' id='p-percent'>${( (((assets[i].UNITS * assets[i].LAST_PRICE) - assets[i].PURCHASE_VAL) / assets[i].PURCHASE_VAL) * 100).toLocaleString('en',{maximumFractionDigits: 2, minimumFractionDigits: 2})}</td>
                </tr>`
    }//end for
    getCountryRevenue(tickers); 
    getCountrySuppliers(tickers);
    getCountryRevenue(tickers);
    getSegmentRevenue(tickers);

    body += `<tr> 
                <td class="text-left"></td><td>${' '}</td><td>${' '}</td><td>${' '}</td><td>${' '}</td><td>${' '}</td><td>${' '}</td><td></td><td></td>
            </tr>`
    //ADD CASH BALANCE TO THE BOTTOM OF THE TABLE
    body += `<tr class="text-right" id='div-tick-${' '}'> 
                <td class="text-left">Cash Balance</td>
                <td>${' '}</td>
                <td>${' '}</td>
                <td>${' '}</td>
                <td>${' '}</td>
                <td>${' '}</td>
                <td>${( (assets[0].CASH || 0) ).toLocaleString('en',{maximumFractionDigits: 2, minimumFractionDigits: 2})}</td>
                <td></td>
                <td></td>
            </tr>`
    //ADD TOTAL VALUE OF PORTFOLIO LINE
    body += `<tr class="text-right" id='div-tick-${' '}'> 
                <td class="text-left">Portfolio Value</td>
                <td></td>
                <td>${' '}</td>
                <td>${' '}</td>
                <td>${' '}</td>
                <td>$${(sumCost + 0).toLocaleString('en',{maximumFractionDigits: 2, minimumFractionDigits: 2})}</td>
                <td id='port-total-value'>$${(sumProfits + (assets[0].CASH || 0) ).toLocaleString('en',{maximumFractionDigits: 2, minimumFractionDigits: 2})}</td>
                <td>${( sumPnL ).toLocaleString('en',{maximumFractionDigits: 2, minimumFractionDigits: 2})}</td>
                <td>${((sumPnL / sumProfits)*100).toLocaleString('en',{maximumFractionDigits: 2, minimumFractionDigits: 2}) }</td>
            </tr>`

    $('#port-tbody').html( body )
    

}//end make res



function getSegmentRevenue(assets){
    var t = $.map(assets, function(obj){
        return obj.ticker
    }).join("','");

    SQL = ` select BUS_SEG_NAME AS SEGMENT, sum(REVENUE_PCT) OVER () ALL_PCT, DIV0(REVENUE_PCT, ALL_PCT)*100 as PCT, count(*) as CNT
            from FIN_DEMO_UI.META.BU_REV_EXPOSURE
            where REPLACE(TICKER_REGION, '-US', '') IN ('${t}')
            GROUP BY 1, REVENUE_PCT
            order by 3 DESC`;
    
    runSQL(gbl.indconn, SQL).then((res)=>{
        create_map('port-rev-map-viz', res, "MAP_ISO","PORT_REV_PCT")

        var tr = '';
            for(i=0; i < res.length; i++){
                tr += '<tr>'
                tr += ` <td>${(res[i].SEGMENT)} <b style='font-size:10px'>(${res[i].CNT})</b></td>
                        <td class='text-right'>${(res[i].PCT).toLocaleString('en',{maximumFractionDigits: 2, minimumFractionDigits: 2})}</td>`
                tr += '</tr>'
            }
            $('#bu-rev').html(tr)

    })

}//end 

function getCountryRevenue(assets){
    var t = $.map(assets, function(obj){
        return obj.ticker
    }).join("','");

    SQL = ` select ISO_COUNTRY, MAP_ISO, COUNTRY_NAME, sum(EST_PCT * REV) AS C_REV, DIV0(c_rev,sum(rev)) as PORT_REV_PCT
            from FIN_DEMO_UI.META.COUNTRY_REV_EXPOSURE REX
            join FIN_DEMO_UI.META.TICKER_LATEST_INCOME TLI on REX.FSYM_ID = TLI.FSYM_ID
            where REPLACE(REX.TICKER_REGION, '-US', '') IN ('${t}')
            group by 1,2,3
            order by C_REV DESC`;
    
    runSQL(gbl.indconn, SQL).then((res)=>{
        create_map('port-rev-map-viz', res, "MAP_ISO","PORT_REV_PCT")

        var tr = '';
            for(i=0; i < res.length; i++){
                tr += '<tr>'
                tr += `<td style="width: 1%;white-space: nowrap;"><b>(${res[i].ISO_COUNTRY})</b> ${res[i].COUNTRY_NAME}</td>
                        <td>${(res[i].PORT_REV_PCT).toLocaleString('en',{maximumFractionDigits: 2, minimumFractionDigits: 2})}</td>
                        <td>${(res[i].C_REV).toLocaleString('en',{maximumFractionDigits: 2, minimumFractionDigits: 2})}</td>`
                tr += '</tr>'
            }
            $('#port-georev-table').html(tr)

    })

}//end 


function getCountrySuppliers(assets){
    var t = $.map(assets, function(obj){
        return obj.ticker
    }).join("','");

    SQL = ` SELECT COUNTRY_DESC, MAP_ISO, COUNT(*) country_supp, sum(count(*)) OVER () all_supp, DIV0(country_supp, all_supp)*100 as PCT
            FROM FIN_DEMO_UI.META.SUPPLIER_INFO
            WHERE REPLACE(TICKER, '-US', '') IN ('${t}')
            GROUP BY 1,2
            order by 3 desc `;

    runSQL(gbl.indconn, SQL).then((res)=>{
        create_map('port-supp-map-viz', res, "MAP_ISO","PCT")

        var tr = '';
            for(i=0; i < res.length; i++){
                tr += '<tr>'
                tr += `<td style="width: 1%;white-space: nowrap;"><b>(${res[i].MAP_ISO})</b> ${res[i].COUNTRY_DESC}</td>
                        <td>${(res[i].COUNTRY_SUPP).toLocaleString('en',{maximumFractionDigits: 0})}</td>
                        <td>${(res[i].PCT).toLocaleString('en',{maximumFractionDigits: 2, minimumFractionDigits: 2})}</td>`
                tr += '</tr>'
            }
            $('#port-geosupp-table').html(tr)

    })

}//end 


var portPerfVars = {};
function makePortPerf(uuid){
    gbl.portCompare = [];
    $('#port-compare-input-area-pills').html(' ');
    portPerfVars.date = '305';
    portPerfVars.dateEnd = '08/06/2021'; // might need to be deleted later
    
    var SQL = ` select PRICE_DATE::date + 1 as DAY, SUM(PRICE * UNITS) AS PMV
                from FIN_DEMO_UI.META.ALL_PRICE_DATE APD
                INNER JOIN 
                (   select DISTINCT convert_timezone('America/New_York',date_trunc('DAY', LAST_TIME)) AS UDATE, units, symbol
                    FROM INDUSTRY_FINANCIAL_SERVICES.APP_ALPACA.PORTFOLIO_PNL
                    WHERE PORTFOLIO_ID = '${uuid}'
                    // and UDATE::date = ( select max(convert_timezone('America/New_York',date_trunc('DAY', LAST_TIME)))
                    //                     FROM INDUSTRY_FINANCIAL_SERVICES.APP_ALPACA.PORTFOLIO_PNL
                    //                     WHERE PORTFOLIO_ID = '${uuid}' )
                    order by udate desc
                )T ON T.SYMBOL = TICKER
                where day BETWEEN (current_date - ${portPerfVars.date})::DATE AND (CURRENT_DATE::DATE + 1)
                group by 1
                order by day asc;`


    runSQL(gbl.indconn, SQL).then((res)=>{
        var day = [];
        var pmv = [];
        portPerfVars.offest = res[0].PMV;
        for(i=0; i < res.length; i++){
            day.push(res[i].DAY)
            pmv.push(res[i].PMV)
        }

        drawPortPerf('port-perf-chart', 'my port', day, pmv)
    })

}


function drawPortPerf(div, port, day , pmv){
	var trace1 = {
        x: day,
        y: pmv,
        name:'Curr - Port',
        mode: 'lines+markers',
        marker: {
          color: '#05AC72',
          size: 1
        },
        line: {
          color: '#05AC72',
          width: 4
        }
      };
	
	var data = [trace1];
	
	var layout = {
      plot_bgcolor: "rgba(0,0,0,0)",
      paper_bgcolor: "rgba(0,0,0,0)",
	  dragmode: 'zoom', 
	  margin: {
	    r: 0, 
	    t: 0, 
	    b: 50, 
	    l: 60
	  }, 
	  showlegend: false, 
	  xaxis: {
        tickcolor: '#fff',
        gridcolor: '#000',
        color: "#fff",
        type: 'date'
	  },
	  yaxis: {
        tickcolor: '#fff',
        gridcolor: 'ffffFF44',
		rangemode: "normal",
        color: "#fff"
	  }
	};
	
	Plotly.newPlot(div, data, layout).then((p)=>{ 
        p.on('plotly_click', function(data){
            console.log(data)
            //Plotly.deleteTraces(self);
        })


    });
	
}



function addTraceToPort(asset){
    gbl.portCompare.push(asset);

	var SQL = ` SELECT (D)::DATE +1 as PRICE_DATE, PRICE
				FROM FIN_DEMO_UI.UI.CANDLESTICK_AGG
				WHERE TICKER IN ('`+asset+`-US') and 
                      D BETWEEN (current_date - ${portPerfVars.date})::DATE AND (CURRENT_DATE::DATE + 1)
                order by 1 asc`;

    
	runSQL(gbl.indconn, SQL).then((res)=>{
		var x = []
		var y = []
		var ry = []
		if(res.length>0){
			gbl.candleCompare.push(asset);
			$('#port-compare-input-area-pills').append(`<span class="translate-middle badge rounded-pill bg-danger" onclick="deleteTrace('port-perf-chart', `+(gbl.portCompare.length)+`);this.remove()">`+asset+`</span>`);
		}

		for(i=0; i<res.length;i++){
			x.push( res[i].PRICE_DATE )
			y.push( ((1-(res[0].PRICE - res[i].PRICE)/res[i].PRICE)) * portPerfVars.offest )
			ry.push(res[i].PRICE);
		}

		Plotly.addTraces('port-perf-chart', [{
			x: x,
			y: y,
			name: asset,
			text: ry,
			width: 1,
			mode: 'lines',
			yaxis2: {
				tickcolor: '#fff',
				gridcolor: 'ffffFF44',
				color: "#fff"
			}
		}])

	});//end run SQL

}

function port_date_change(){
    var t = $('#port-datetime-input').val();
	var SQL = ` select PRICE_DATE::date +1 as PRICE_DATE, SUM(PRICE * UNITS) AS PRICE
                from FIN_DEMO_UI.META.ALL_PRICE_DATE APD
                INNER JOIN 
                (   select DISTINCT convert_timezone('America/New_York',date_trunc('DAY', UPDATE_TIME)) AS UDATE, units, symbol
                    FROM INDUSTRY_FINANCIAL_SERVICES.APP_ALPACA.PORTFOLIO_PNL_HIST
                    WHERE PORTFOLIO_ID ='${gbl.portUUID}'
                    and UDATE::date = '${t}'
                    order by udate desc
                )T ON T.SYMBOL = TICKER
                where PRICE_DATE BETWEEN (current_date - ${portPerfVars.date})::DATE AND (CURRENT_DATE::DATE + 1)
                group by 1
                order by PRICE_DATE asc;`;

   
	runSQL(gbl.indconn, SQL).then((res)=>{
        var x = []
		var y = []
		var ry = []
        for(i=0; i <res.length; i++){
            x.push( res[i].PRICE_DATE )
            //y.push( res[i].PRICE )
			y.push( ((1-(res[0].PRICE - res[i].PRICE)/res[i].PRICE)) * portPerfVars.offest )
			ry.push(res[i].PRICE);
        }
        Plotly.addTraces('port-perf-chart', [{
			x: x,
			y: y,
			name: t,
			text: ry,
			width: 1,
			mode: 'lines',
			yaxis2: {
				tickcolor: '#fff',
				gridcolor: 'ffffFF44',
				color: "#fff"
			}
		}])

    })




}

