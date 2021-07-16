function getSupplierData(){
  $('#ticker-supplier-table').html(' ')
    var SQL = ` SELECT *
                FROM FIN_DEMO_UI.META.SUPPLIER_INFO
                WHERE TICKER IN ('${gbl.currentAssetView.SYMBOL}-US')
                ORDER BY REVENUE_PCT DESC; `;

  getGeoRev();

  runSQL(gbl.indconn, SQL).then((res)=>{
    var tr = '';
    for(i=0; i < res.length; i++){
      tr += '<tr>'
      tr += `<td style="width: 1%;white-space: nowrap;">${res[i].SUPPLIER_FACTSET_ENTITY_ID}</td>
              <td>${res[i].SUPPLIERNAME}</td>
              <td>${res[i].COUNTRY_DESC}</td>
              <td>${res[i].ENTITY_TYPE}</td>
              <td>${res[i].REVENUE_PCT}</td>
              <td style='font-size:11px;'>${res[i].TARGET_ENTITY_KEYWORD}</td>
              <td style='font-size:11px;'>${res[i].RELATIONSHIP_KEYWORD1}</td>`
      tr += '</tr>'
    }
    $('#ticker-supplier-table').html(tr)
    
  })//end run sql

}//end get supplier data


function getGeoRev(){ 
  $('#ticker-supplier-table').html(' ')
  var SQL = ` SELECT *
              FROM FIN_DEMO_UI.META.COUNTRY_REV_EXPOSURE
              WHERE ticker_region IN ('${gbl.currentAssetView.SYMBOL}-US')
              ORDER BY est_pct DESC; `;



  runSQL(gbl.indconn, SQL).then((res)=>{
    var tr = '';
    for(i=0; i < res.length; i++){
      tr += '<tr>'
      tr += ` <td style="width: 1%;white-space: nowrap;"><b>(${res[i].ISO_COUNTRY})</b> ${res[i].COUNTRY_NAME}</td>
              <td>${res[i].CERTAINTY_RANK}</td>
              <td>${res[i].CERTAINTY_CLASS}</td>
              <td>${(res[i].EST_PCT).toLocaleString('en', {maximumFractionDigits: 2, minimumFractionDigits: 2})}</td>`
      tr += '</tr>'
    }
    $('#ticker-georev-table').html(tr)
  })

}//end get geo rev