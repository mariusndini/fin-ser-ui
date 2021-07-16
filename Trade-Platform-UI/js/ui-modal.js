function createSellModal(asset, portIndex, assetIndex){
    var sym_id = gbl.portfolio[portIndex].assets[assetIndex].sym_id;

    $('#modal-footer-buttons').append(`<button type="button" class="btn btn-primary" id="modelSellBtn">Sell</button>`);

    var currentPrice = Number($('#div-tick-'+sym_id+' #p-current-price').html().replace(/[^0-9.-]+/g,""));
    var purchasePrice = Number($('#div-tick-'+sym_id+' #p-purchase-price').html().replace(/[^0-9.-]+/g,""));
    var units = Number($('#div-tick-'+sym_id+' #p-units').html().replace(/[^0-9.-]+/g,""));
    $('#port-units-sell-input').val(units);

    $('#sell-modal-title').html("Sell <b>" + asset + "</b> ("+units+" units)");
    setModalVals(currentPrice, purchasePrice, units)

    $('#port-units-sell-input').attr({"max" : units})
    $('#port-units-sell-input').change({p: purchasePrice, c: currentPrice}, (event)=>{
        var unitsVal = parseInt($('#port-units-sell-input').val());
        setModalVals(event.data.c, event.data.p, unitsVal)
    });

    $('#modelSellBtn').click({p: purchasePrice, c: currentPrice, sym: sym_id, portIndex:portIndex, assetIndex:assetIndex }, (event)=>{
        var unitsVal = parseInt($('#port-units-sell-input').val());
        sellAsset(currentPrice * unitsVal, unitsVal, event.data.sym, event.data.portIndex, event.data.assetIndex);
    });


}

function setModalVals(currentPrice, purchasePrice, units){
    $('#sell-modal-purchase').html(purchasePrice.toLocaleString('en'));
    $('#sell-modal-current').html(currentPrice.toLocaleString('en'));
    $('#sell-modal-units').html(units.toLocaleString('en'));
    $('#sell-modal-plus').html( (currentPrice - purchasePrice).toLocaleString('en'));
    $('#sell-modal-pnl').html( ((currentPrice - purchasePrice) * units).toLocaleString('en') );

    $('#modalSellDollarValue').html(`$${(currentPrice * units).toLocaleString('en')}` );
}

function sellAsset(value, units, sym, index, assetIndex){
    var tr = $('#div-tick-'+sym);

    gbl.portfolio[index].cash = gbl.portfolio[index].cash + value;
    gbl.portfolio[index].assets[assetIndex].units = gbl.portfolio[index].assets[assetIndex].units - units;
    if(gbl.portfolio[index].assets[assetIndex].units <= 0){
        gbl.portfolio[index].assets.splice(assetIndex, 1);
    }
    
    saveData();
    $('#sellModal').modal('toggle');
    showPortfolioBreakdown($('#portfolio-id-in-div').html() , index);
    
}

