function showAsset(t, index){
  var asset = t//gbl.screener_result[index]
  gbl.currentAssetView = asset;


  //UPDATE THESE CHARTS
  getCandleStickData( [t] );
  getAsssetSparkPerfSpark(t);
  getSupplierData(t);
  getExistingPortfolios(t);
  getNews(t);
  getCPI();
  getSegPct(t);


  $('#add-compare-input-area-pills').html(' ');

  var SQL = ` select * FROM FIN_DEMO_UI.UI.SCREENER where symbol = '${t}'`;

  runSQL(gbl.indconn, SQL).then((res)=>{
    var p ='';
    var info = res[0]
    $('#asset-ticker').html('🎫'+t+ ' <b style="color: #95abac">$' + parseFloat( (info.HIGH||'') ).toLocaleString('en', {maximumFractionDigits: 2, minimumFractionDigits: 2}) +'</b>' );
    $('#show-asset-name').html(info.ENTITY_PROPER_NAME + '(<span style="color: white; font-size:15px"><b>FSYM</b>:'+ info.ENTITY_ID + ' | <b>FIGI</b>:'+info.FIGI+'</span>)')
    
    $('#show-asset-desc').html(info.ENTITY_PROFILE);
    $('#asset-table-exchange').html(info.EXCHANGE);
    $('#asset-table-industry').html(info.INDUSTRY);
    $('#asset-table-sector').html(info.SECTOR);

    $('#asset-table-mktcap').html(parseFloat(info.MKTCAP).toLocaleString('en') + ' M');
    $('#asset-table-open').html(parseFloat(info.PCT_CHANGE).toLocaleString('en', {maximumFractionDigits: 2, minimumFractionDigits: 2}));
    $('#asset-table-range').html(parseFloat(info.VWAP).toLocaleString('en', {maximumFractionDigits: 2, minimumFractionDigits: 2}));
    $('#asset-table-volume').html(parseFloat(info.ACCUMULATEDVOLUME).toLocaleString('en'));
  
    /**
     * Add asset to port below.
     */
    for(k=0; k < gbl.portfolio.length; k++){
      p +=`<div class="input-group mb-1">
              <span style='padding-left:10px; width:60%' >
              <strong onclick='showPortfolioBreakdown("${gbl.portfolio[k].name}", ${k})'> <a href='#'>`+gbl.portfolio[k].name+`</a> </strong>
              <br>
              <span style='font-size:12px;font-weight:bolder'>$${(gbl.portfolio[k].cash).toLocaleString('en', {maximumFractionDigits: 0})}</span>
              <span style='font-size:12px;font-weight:bold' id='asset-add-purchase-price-screenr-0-${k}'></span>
          </span>

          <input type="number" style='50px' class="form-control" onchange="portPurchaseInfo('asset-buy-input-screenr-','asset-add-purchase-price-screenr-',0,${k}, ${info.HIGH}, ${gbl.portfolio[k].cash})" onkeyup="portPurchaseInfo('asset-buy-input-screenr-','asset-add-purchase-price-screenr-',0,${k}, ${info.HIGH}, ${gbl.portfolio[k].cash})" id='asset-buy-input-screenr-0-`+k+`' placeholder="Units" min="1"  aria-describedby="basic-addon1">
          <button type="button" class="btn btn-dark" onclick='addAssetToPortfolio("${t}",$("#asset-buy-input-screenr-0-`+k+`").val(), ${k}, "${info.SYM_ID}", ${info.HIGH})'>👍</button>

      </div>`;
    }
    //HERE IN CASE NEEDED LATER <strong style='padding-left:10px; width:60%' onclick='showPortfolioBreakdown("${gbl.portfolio[k].name}", ${k})'><a href='#'>`+gbl.portfolio[k].name+`</a></strong>

    $('#asset-add-dropdown').html(p);

  })

  showMenu('show-asset-div'); //FINALLY SHOW RENDERED SCREEN

}//end



function getExistingPortfolios(ticker){
  var SQL = ` select name, units, purchase_val, last_price * units as pmv
              from INDUSTRY_FINANCIAL_SERVICES.APP_ALPACA.PORTFOLIO_PNL
              where SYMBOL = '${ticker}'`; 

    $('#asset-existing-port').html(' ')

    runSQL(gbl.indconn, SQL).then((res)=>{
      $('#exist-port-btn').html('💼 Portfolios ('+res.length+')');
      var tr = '';
      for(i=0; i < res.length; i++){
        tr += `<tr>
              <td>${(res[i].NAME).toLocaleString('en', {maximumFractionDigits: 0})}</td>   
              <td>${(res[i].UNITS).toLocaleString('en', {maximumFractionDigits: 0})}</td>   
              <td>${(res[i].PMV).toLocaleString('en', {maximumFractionDigits: 0})}</td>
            </tr>`
      }
      $('#asset-existing-port').html(tr)  
    })//end get data

}



function getSegPct(asset){
  var SQL = ` select BUS_SEG_NAME AS SEGMENT, REVENUE_PCT
              from FIN_DEMO_UI.META.BU_REV_EXPOSURE
              where ticker_region = '${asset}-US'
              order by 2 desc;`; 

  $('#bu-rev').html(' ')

  runSQL(gbl.indconn, SQL).then((res)=>{
    var tr = '';
    var data = {day:[], cpi:[]}
    for(i=0; i < res.length; i++){
      data.day.push(res[i].D);
      data.cpi.push(res[i].VALUE);

      tr += `<tr>
            <td class="text-right">${(res[i].SEGMENT)}</td>    
            <td class="text-left">${(res[i].REVENUE_PCT).toLocaleString('en', {maximumFractionDigits: 0})}</td>
          </tr>`
    }
    $('#bu-rev').html(tr)  

  })

}



function getCPI(){
  var isoCountry = $('#cpi-country').find(":selected").text();

  var SQL = ` select MONTH(SERIES_DATE)||'/'||DAY(SERIES_DATE)||'/'||YEAR(SERIES_DATE) as SERIES_DATE, SERIES_DATE as D, VALUE
              from INDUSTRY_FINANCIAL_SERVICES.ANALYTICS.CONSUMER_PRICE_INDEX_COUNTRY_MONTHLY_V
              where COUNTRY_NAME = '${isoCountry}'
              order by date_key desc;`; 

  $('#asset-existing-port').html(' ')

  runSQL(gbl.indconn, SQL).then((res)=>{
    var tr = '';
    var data = {day:[], cpi:[]}
    for(i=0; i < res.length; i++){
      data.day.push(res[i].D);
      data.cpi.push(res[i].VALUE);

      tr += `<tr>
            <td class="text-right">${(res[i].SERIES_DATE)}</td>    
            <td class="text-left">${(res[i].VALUE).toLocaleString('en', {maximumFractionDigits: 0})}</td>
          </tr>`
    }
    $('#cpi-port').html(tr)  
    drawCPI('cpi-chart', data.day, data.cpi)

  })

}


function drawCPI(div, day, pmv){
	var trace1 = {
        x: day,
        y: pmv,
        name:'CPI',
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
        })
    });
	
}