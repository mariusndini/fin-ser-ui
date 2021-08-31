function getTopPredict(){
    var topX = parseInt($('#top-x-assets').find(":selected").text());
    var dollar = $('#init-investment').val();

    var SQL = ` select DATE_MONTH, TICKER_REGION,
                SUM((${dollar/topX}/STOCK_OPEN_PRICE)*STOCK_OPEN_PRICE) as open_amount, 
                SUM((${dollar/topX}/STOCK_OPEN_PRICE)*STOCK_NEXT_OPEN_PRICE) as CLOSE_AMOUNT,
                SUM((${dollar/topX}/STOCK_OPEN_PRICE)*FORECAST_STOCK_PRICE) as FORECAST_AMOUNT  
                from (SELECT
                    TICKER
                    ,TICKER_REGION
                    ,DATE_MONTH
                    ,STOCK_OPEN_PRICE
                    ,FORECAST_STOCK_PRICE
                    ,STOCK_NEXT_OPEN_PRICE
                    ,FORECAST_PCT_CHANGE               
                    ,row_number() OVER (partition by DATE_MONTH order by FORECAST_PCT_CHANGE desc) as month_rank
                    from "FROSTBYTE_DATAIKU"."INDUSTRY_FINANCIAL_SERVICES"."FORECAST_PCT_CHANGE_ON_ACTUAL") forecasts
                    WHERE month_rank <= ${topX} 
                    group by rollup (DATE_MONTH,TICKER_REGION
                )
                order by DATE_MONTH,TICKER_REGION;`; 
  
    $('#price-predict-main').html(' ')
  
    runSQL(gbl.indconn, SQL).then((res)=>{
      var tr = '';
      var data = {day:[], val:[], forecast:[], initial:[], acc:0, foreAcc:0, init:0};
      for(i=0; i < res.length; i++){
        var style = ''
        if(!res[i].TICKER_REGION ){
            style = 'style=background-color:#333333;font-weight:900;'
            data.acc += res[i].CLOSE_AMOUNT || 0;
            data.foreAcc += res[i].FORECAST_AMOUNT || 0;
            data.init += res[i].OPEN_AMOUNT || 0;
    
            data.day.push(res[i].DATE_MONTH);
            data.val.push(data.acc);
            data.forecast.push(data.foreAcc);
            data.initial.push(data.init);  
        }



        tr += `<tr ${style}>
              <td class="text-right">${(res[i].DATE_MONTH || '')}</td>    
              <td class="text-left">${((res[i].TICKER_REGION) || '~ Total').replace('-US', '')}</td>    
              <td class="text-right">${(res[i].OPEN_AMOUNT || 0).toLocaleString('en', {maximumFractionDigits: 2, minimumFractionDigits: 2})}</td>
              <td class="text-right">${(res[i].CLOSE_AMOUNT || 0).toLocaleString('en', {maximumFractionDigits: 2, minimumFractionDigits: 2})}</td>
              <td class="text-right">${(res[i].FORECAST_AMOUNT || 0).toLocaleString('en', {maximumFractionDigits: 2, minimumFractionDigits: 2})}</td>
            </tr>`
      }
  
      $('#price-predict-main').html(tr)  
      drawForecast('forecast-chart', data.day, data.val, data.forecast, data.initial)
  
    })
  }


  function drawForecast(div, day, pmv, forecast, init){
    var trace1 = {
          x: day,
          y: pmv,
          name:'Actual',
          mode: 'lines',
      };

      var trace2 = {
        x: day,
        y: forecast,
        name:'Forecast',
        mode: 'lines',
    };

    var trace3 = {
      x: day,
      y: init,
      name:'Investment',
      mode: 'lines',
  };
    
    var data = [trace1, trace2, trace3];
    
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