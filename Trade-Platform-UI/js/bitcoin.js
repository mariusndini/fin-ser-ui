//Get streaming data - real time trades from platform
var ws;
function openSocket(){
    ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');
    ws.onopen = ()=>{
        $('#dataasof').html(new Date().toLocaleTimeString());
    }

    ws.onmessage = (t)=>{
        var data  = JSON.parse(t.data);
        $('#btc-trade').html(`<td>${data.s}</td> <td>${new Date(data.T).toLocaleTimeString()}</td> <td >${(parseFloat(data.p)).toFixed(2)}</td> <td>${(parseFloat(data.q)).toFixed(8)}</td> <td>$${(data.q * data.p).toFixed(2)}</td>`);
    }//end on message

    var SQL = ` select distinct date_trunc("minutes", trade_time)::TIMESTAMP as TIME
                    , last_value(price) over (partition by TIME order by trade_time, trade_id DESC) as OPEN
                    , max(price) over (partition by TIME order by TIME DESC) as HIGH
                    , min(price) over (partition by TIME order by TIME DESC) as LOW
                    , first_value(price) over (partition by TIME order by trade_time, trade_id DESC) as CLOSE    
                from fin_demo_ui.pipe.BTC_TRADES
                order by 1 desc
                limit 60;`;
    runSQL(gbl.indconn, SQL).then((res)=>{ 
        console.log(res);
        var x=[], close=[], high=[], low=[], open=[];

        for(i=0; i < res.length; i++){
            x.push(res[i].TIME);
            close.push(res[i].CLOSE);
            high.push(res[i].HIGH);
            low.push(res[i].LOW);
            open.push(res[i].OPEN);
        }
        drawCandleStick('btc-candle-container', x, close, high, low, open, 'btc')
        
    })

    


}

//at some point close WS
function closeWS(){
    ws.close();
}
