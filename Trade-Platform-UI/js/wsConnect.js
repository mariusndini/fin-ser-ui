var isConnected = false;

setup().then(()=>{
    isConnected = true;
});

var con = {
    account: 'IPA30228',
    username: 'DOTA',
    role: 'ACCOUNTADMIN',
    password: 'Red123!!!',
    warehouse: 'DOTA',
    database: 'DOTA'
}

async function setup(){
    var wsUri = "wss://0h1n2pma8f.execute-api.us-west-2.amazonaws.com/dev";
    websocket = new WebSocket(wsUri);

    websocket.onclose = onclose;
    function onclose(){
        websocket = new WebSocket(wsUri);
        websocket.onopen = ()=>{console.warn('WS OPEN')};
        websocket.onclose = onclose;
        websocket.onmessage = onmessage;
    };
    websocket.onmessage = onmessage;

    function onmessage(m){
        if (!m.data.includes(`"message": "Internal server error"`)) {
            var data = JSON.parse(m.data).result;
            console.log(data);
            document.getElementById("events").innerHTML= ' ';
            var html = '';
            for(i=0; i < data.length;i++){
                html += `<p>${JSON.stringify(data[i].E)}</p>`
            }
            document.getElementById("events").innerHTML = html;

        }
    };
    let promise = new Promise((res, rej) => {
        websocket.onopen = function(){
            console.warn('WS OPEN');
            res()
        };
    });
    let result = await promise; 

}// END SETUP


function SQL(q, c, tags){
    console.warn('QUERY SENT: ');
    console.log(q);
    var message = {"action" : "snflk", "query" : q, con: c, report: tags}
    websocket.send(JSON.stringify(message));
}

