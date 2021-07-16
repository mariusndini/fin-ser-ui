function getCandleStickData(asset){
	var SQL = ` SELECT PRICE_DATE, PRICE_OPEN, PRICE_HIGH, PRICE_LOW, PRICE
				FROM FIN_DEMO_UI.UI.CANDLESTICK_AGG
				WHERE TICKER IN ('`+asset+`-US') and 
					D BETWEEN CURRENT_DATE() - (100) AND CURRENT_DATE()+1`;


    runSQL(gbl.indconn, SQL).then((res)=>{
		var x = []
		var close = []
		var high = []
		var low = []
		var open = []

		for(i=0; i<res.length;i++){
			x.push(res[i].PRICE_DATE)
			close.push(res[i].PRICE)
			high.push(res[i].PRICE_HIGH)
			low.push(res[i].PRICE_LOW)
			open.push(res[i].PRICE_OPEN)

		}
		drawCandleStick ('asset-candle-container', x, close, high, low, open, asset)

    })

}



function drawCandleStick(div, x, close, high, low, open, asset){
	gbl.candleHigh = high;

	var trace1 = {
	  x: x,
	  name: asset,
	  close: close,
	  high: high,
	  low: low,
	  open: open, 
	  
	  decreasing: {line: {color: '#FF5639'}}, 
	  increasing: {line: {color: '#05AC72'}}, 
	  line: {color: 'rgba(31,119,180,1)'}, 
	  width: 1,
	  type: 'candlestick', 
	  xaxis: 'x', 
	  yaxis: 'y'
	};
	
	var data = [trace1];
	
	var layout = {
      plot_bgcolor: "rgba(0,0,0,0)",
      paper_bgcolor: "rgba(0,0,0,0)",
	  dragmode: 'zoom', 
	  margin: {
	    r: 0, 
	    t: 0, 
	    b: 0, 
	    l: 50
	  }, 
	  showlegend: false, 
	  xaxis: {
        tickcolor: '#fff',
        gridcolor: '#000',
        color: "#fff"
	  },
	  yaxis: {
        tickcolor: '#fff',
        gridcolor: 'ffffFF44',
		rangemode: "normal",
        color: "#fff"
	  }
	};
	
	Plotly.newPlot(div, data, layout).then((p)=>{
		p.on('plotly_hover', function(data){
			//$('#hov-date').html(data.points[0].x);
			//getDayInfoSparks(asset, data.points[0].x + '/2021')

		})//end hover
		
	});
	
}


function addTraceToCandle(asset){
	var SQL = ` SELECT PRICE_DATE, PRICE
				FROM FIN_DEMO_UI.UI.CANDLESTICK_AGG
				WHERE TICKER IN ('`+asset+`-US') and 
					D BETWEEN CURRENT_DATE() - 100 AND CURRENT_DATE()+1`;
	
	runSQL(gbl.indconn, SQL).then((res)=>{
		var x = []
		var y = []
		var ry = []
		if(res.length>0){
			gbl.candleCompare.push(asset);
			$('#add-compare-input-area-pills').append(`<span class="translate-middle badge rounded-pill bg-danger" onclick="deleteTrace('asset-candle-container', `+gbl.candleCompare.length+`);this.remove()">`+asset+`</span>`);
		}

		for(i=0; i<res.length;i++){
			var offset = gbl.candleHigh[0];
			x.push( res[i].PRICE_DATE )
			y.push( ((1-(res[0].PRICE - res[i].PRICE)/res[i].PRICE)) * offset )
			ry.push(res[i].PRICE);
		}

		Plotly.addTraces('asset-candle-container', [{
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

function deleteTrace(div, index){
	Plotly.deleteTraces(div, index);
	gbl.candleCompare.splice(index, 1);
};