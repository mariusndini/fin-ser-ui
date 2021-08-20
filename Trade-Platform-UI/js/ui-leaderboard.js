function showLeaderboard(){
  showMenu('all-leaderboard');
  getAssetsPerport();
  getFundPerfChart();
  //getIndPortPerfChart();

  var SQL = ` select NAME, USERTAG, ASSET_COUNT, VAL, TPMV, PROFITLOSS, PERFORMANCE_PCT, PORTFOLIO_ID
              from INDUSTRY_FINANCIAL_SERVICES.APP_ALPACA.PORTFOLIO_PERF
              order by performance_pct desc; `;

  runSQL(gbl.indconn, SQL).then((res)=>{
      gbl.leaderboard = res;

      $('#all-leaderboard #leaderboard-table').html(' ')
      for( i=0; i <res.length; i++ ){
          var tr = $(`<tr>`).append(`<td> <a href='#' onclick='showPortfolioBreakdown("${res[i].NAME}", ${i}, true)'>${res[i].NAME}</a>
                                     </td>

                  <td style='font-size:12px;' class="text-right">${res[i].USERTAG}</td>
                  <td class="text-right" style='color:${(res[i].PERFORMANCE_PCT>0)?"#05AC72":"#FF5639"}'>${parseFloat(res[i].VAL).toLocaleString('en',{maximumFractionDigits: 0})}</td>
                  <td class="text-right" style='color:${(res[i].PERFORMANCE_PCT>0)?"#05AC72":"#FF5639"}'>${parseFloat(res[i].TPMV).toLocaleString('en',{maximumFractionDigits: 0})}</td>

                  <td class="text-right" style='color:${(res[i].PERFORMANCE_PCT>0)?"#05AC72":"#FF5639"}'>${parseFloat(res[i].PROFITLOSS).toLocaleString('en',{maximumFractionDigits: 0})}</td>
                  <td class="text-right" style='color:${(res[i].PERFORMANCE_PCT>0)?"#05AC72":"#FF5639"}'>${parseFloat(res[i].PERFORMANCE_PCT).toLocaleString('en', {maximumFractionDigits: 2, minimumFractionDigits: 2})}%</td>
              `)

          $('#all-leaderboard #leaderboard-table').append(tr)
      }

  })

}



function getAssetsPerport(){

  var SQL = ` select SYMBOL, sum(UNITS) AS UNITS, count(distinct name) AS PORTS, SUM(PMV)+SUM(CASH) AS PMV
              from INDUSTRY_FINANCIAL_SERVICES.APP_ALPACA.PORTFOLIO_PNL
              group by 1
              order by 4 desc; `;

  runSQL(gbl.indconn, SQL).then((res)=>{
      $('#all-leaderboard #lb-asset-table').html(' ')
      for( i=0; i <res.length; i++ ){
          var tr = $(`<tr>`).append(`<td> <a href='#' onclick='showAsset("${res[i].SYMBOL}")'>${res[i].SYMBOL}</a></td>

                        <td style='font-size:12px;' class="text-right">${(res[i].UNITS).toLocaleString('en', {maximumFractionDigits: 0})}</td>
                        <td style='font-size:12px;' class="text-right">${(res[i].PORTS).toLocaleString('en', {maximumFractionDigits: 0})}</td>
                        <td style='font-size:12px;' class="text-right">${(res[i].PMV).toLocaleString('en', {maximumFractionDigits: 0})}</td>
            `);

          $('#all-leaderboard #lb-asset-table').append(tr)
      }

  })

}



function getFundPerfChart(){
  var SQL = ` select PRICE_DATE::date + 1 as DAY, SUM(PRICE * UNITS) AS PMV
              from FIN_DEMO_UI.META.ALL_PRICE_DATE APD
              INNER JOIN 
              (   select DISTINCT convert_timezone('America/New_York',date_trunc('DAY', LAST_TIME)) AS UDATE, units, symbol
                  FROM INDUSTRY_FINANCIAL_SERVICES.APP_ALPACA.PORTFOLIO_PNL
                  // inner join (  select  max(convert_timezone('America/New_York',date_trunc('DAY', LAST_TIME))) AS UD
                  //               FROM INDUSTRY_FINANCIAL_SERVICES.APP_ALPACA.PORTFOLIO_PNL
                  //           ) DH ON UD=convert_timezone('America/New_York',date_trunc('DAY', LAST_TIME))
                  order by udate desc
              )T ON T.SYMBOL = TICKER 
              where day BETWEEN (current_date - 305)::DATE AND (current_date::DATE + 1)
              group by 1
              order by day asc /* getFundPerfChart */ ;`;


  runSQL(gbl.indconn, SQL).then((res)=>{
      var day=[], pmv=[];

      for( i=0; i <res.length; i++ ){
        day.push(res[i].DAY);
        pmv.push(res[i].PMV);
      }
      drawPortPerf('fund-perf-chart', 'Fund', day, pmv)
      addTraceToFundCompare(res[0].PMV);
  })

}


function addTraceToFundCompare(offset){

var SQL = ` SELECT (D)::DATE +1 as PRICE_DATE, PRICE
      FROM FIN_DEMO_UI.UI.CANDLESTICK_AGG
      WHERE TICKER IN ('SPY-US') and 
                    D BETWEEN (current_date - 305)::DATE AND (current_date::DATE + 1)
              order by 1 asc`;

  
runSQL(gbl.indconn, SQL).then((res)=>{
  var x = []
  var y = []
  var ry = []

  for(i=0; i<res.length;i++){
    x.push( res[i].PRICE_DATE )
    y.push( ((1-(res[0].PRICE - res[i].PRICE)/res[i].PRICE)) * offset )
    ry.push(res[i].PRICE);
  }

  Plotly.addTraces('fund-perf-chart', [{
    x: x,
    y: y,
    name: 'SPY',
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










//not sure if the below is used anywhere 
function getIndPortPerfChart(){
  var SQL = ` select PRICE_DATE::date + 1 as DAY, SUM(PRICE * UNITS) AS PMV
              from FIN_DEMO_UI.META.ALL_PRICE_DATE APD
              INNER JOIN 
              (   select DISTINCT convert_timezone('America/New_York',date_trunc('DAY', LAST_TIME)) AS UDATE, units, symbol
                  FROM INDUSTRY_FINANCIAL_SERVICES.APP_ALPACA.PORTFOLIO_PNL
                  WHERE UDATE::date = ( select  max(convert_timezone('America/New_York',date_trunc('DAY', LAST_TIME)))
                                        FROM INDUSTRY_FINANCIAL_SERVICES.APP_ALPACA.PORTFOLIO_PNL )
                  order by udate desc
              )T ON T.SYMBOL = TICKER
              where day BETWEEN (current_date - 305)::DATE AND (current_date::DATE + 1)
              group by 1
              order by day asc; `;

  runSQL(gbl.indconn, SQL).then((res)=>{
      var day=[], pmv=[];

      for( i=0; i <res.length; i++ ){
        day.push(res[i].DAY);
        pmv.push(res[i].PMV);
      }
      drawPortPerf('port-perf-chart', 'Fund', day, pmv); // port-perf-chart may be wrong here

  })

}

