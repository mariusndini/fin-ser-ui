const Alpaca = require('@alpacahq/alpaca-trade-api')
const THIS_ID = 'PK1KU7V0UW8X89C9242M';
const SECRET = 'A7u7X5LOv31CGkzwhWPHSchDzjVZS0DujpRDODUy';

/*
const alpaca = new Alpaca({
    keyId: THIS_ID,
    secretKey: SECRET,
    paper: true,
    usePolygon: false,
    feed: "sip"
})

alpaca.getAccount().then((account) => {
    console.log('Current Account:', account);

    const socket = alpaca.data_stream_v2;

    socket.onConnect(function () {
        console.log("Connected");
        socket.subscribeForTrades(["AAPL"]);
      });

  
      socket.connect();

      socket.onStateChange((state) => {
        console.log(state);
      });

      socket.onStockQuote((quote) => {
        console.log(quote);
      });

      socket.onStockTrade((trade) => {
        console.log(trade);
      });

})






*/