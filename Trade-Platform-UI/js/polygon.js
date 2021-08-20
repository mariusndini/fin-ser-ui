var https = require('follow-redirects').https;

function getNews(ticker){
    $('#news-modal-body').html(' ');

    var options = {
        'method': 'GET',
        'hostname': 'api.polygon.io',
        'path': `/v2/reference/news?limit=30&order=descending&sort=published_utc&ticker=${ticker}&published_utc.gte=2021-04-26&apiKey=YK5TGjeoQT5rCtfuJd5XTPI6XYV3ZqrP`,
        'headers': {
    },
        'maxRedirects': 20
    };

    var req = https.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function (chunk) {
            var body = JSON.parse(Buffer.concat(chunks).toString()).results;
            for(i=0; i <body.length; i++){
                if(body[i].tickers.length < 5){
                    var html = `<div class="card text-white bg-dark mb-3" style="width: 100%;">
                                <div class="card-body">
                                    <h5 class="card-title">${body[i].title}  <span class="blockquote-footer" style='color:white'>${body[i].publisher.name}</span> </h5>
                                    <p class="card-text">
                                        <table><tr>
                                            <!--<td> <img class="card-img-top" style='width:150px' src="${body[i].image_url}" alt="Card image cap"></td>-->
                                            <td> ${body[i].description}</td>
                                            </tr></table>
                                        </p>
                                    <footer class="blockquote-footer" style='color:white'>${body[i].tickers}</footer>
                                </div>
                            </div>`;
                    $('#news-modal-body').append(html)
                }

            }
        });

        res.on("error", function (error) {
            console.error(error);
        });
    });

    req.end();
}//end get News