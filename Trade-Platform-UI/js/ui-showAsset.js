function showAsset(t, index){
  var asset = gbl.screener_result[index]
  gbl.currentAssetView = asset;
  
  //UPDATE THESE CHARTS
  getCandleStickData( [asset.SYMBOL] );
  getAsssetSparkPerfSpark(asset.SYMBOL);
  getSupplierData();

  $('#asset-ticker').html('🎫'+t + ' - '+ asset.FSYM_ID + ' - $' + parseFloat(asset.HIGH).toLocaleString('en') );
  $('#show-asset-name').html(asset.NAME)

  $('#asset-table-exchange').html(asset.EXCHANGE);
  $('#asset-table-industry').html(asset.INDUSTRY);
  $('#asset-table-sector').html(asset.SECTOR);

  $('#asset-table-mktcap').html(parseFloat(asset.MKTCAP).toLocaleString('en'));
  $('#asset-table-open').html(parseFloat(asset.OFFICIALOPEN).toLocaleString('en'));
  $('#asset-table-range').html(asset.RANGE);
  $('#asset-table-volume').html(parseFloat(asset.ACCUMULATEDVOLUME).toLocaleString('en'));

  var p ='';
  for(k=0; k < gbl.portfolio.length; k++){
      p +=`<div class="input-group mb-1">
              <span style='padding-left:10px; width:60%' >
              <strong onclick='showPortfolioBreakdown("${gbl.portfolio[k].name}", ${k})'> <a href='#'>`+gbl.portfolio[k].name+`</a> </strong>
              <br>
              <span style='font-size:12px;font-weight:bolder'>$${(gbl.portfolio[k].cash).toLocaleString('en', {maximumFractionDigits: 0})}</span>
              <span style='font-size:12px;font-weight:bold' id='asset-add-purchase-price-screenr-0-${k}'></span>
          </span>

          <input type="number" style='50px' class="form-control" onchange="portPurchaseInfo('asset-buy-input-screenr-','asset-add-purchase-price-screenr-',0,${k}, ${asset.HIGH}, ${gbl.portfolio[k].cash})" id='asset-buy-input-screenr-0-`+k+`' placeholder="Units" min="1"  aria-describedby="basic-addon1">
          <button type="button" class="btn btn-dark" onclick='addAssetToPortfolio("${asset.SYMBOL}",$("#asset-buy-input-screenr-0-`+k+`").val(), ${k}, "${asset.SYM_ID}", ${asset.HIGH})'>👍</button>

      </div>`;
  }
  //HERE IN CASE NEEDED LATER <strong style='padding-left:10px; width:60%' onclick='showPortfolioBreakdown("${gbl.portfolio[k].name}", ${k})'><a href='#'>`+gbl.portfolio[k].name+`</a></strong>

  $('#asset-add-dropdown').html(p);
  
  showMenu('show-asset-div'); //FINALLY SHOW RENDERED SCREEN

}