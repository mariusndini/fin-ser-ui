function makeUUID(){
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://datapi1.p.rapidapi.com/uuid",
        "method": "POST",
        "headers": {
            "x-rapidapi-key": "de599e61d7msh6ca875ed8566e5dp1b9b20jsndaa94d777f24",
            "x-rapidapi-host": "datapi1.p.rapidapi.com"
        }
    };
    
    $.ajax(settings).done(function (response) {
        gbl.uuid = response.uuid;
        alert();
        //$('#user-id-profile').html(gbl.uuid);
        //localStorage.setItem("gbl", JSON.stringify(gbl) );
        //saveData();
    });

}



