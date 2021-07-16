function getTreeMap(SQL){
    SQL = SQL || gbl.sql;

    runSQL(gbl.sfconn, SQL).then((res)=>{
        //console.log(res);
        var marketCapAdjust = $('#market-cap-cb').is(":checked");
        var marketOpenAdjust = $('#market-open-cb').is(":checked");

        let canvas = d3.select('#treeMap');

        let drawTreeMap = () => {
            d3.selectAll("#treeMap > g").remove()
                
            var entries = d3.nest()
                .key(function(d) { return d.EXCHANGE; })
                .key(function(d) { return d.SYMBOL; })
                .entries(res);

            let hierarchy = d3.hierarchy(entries[0], (node) =>{
                return node.values
            }).sum((node)=>{
                if(marketCapAdjust){
                    return node.VALUE
                }else if(marketOpenAdjust){
                    return Math.abs( node.PCT_CHANGE )
                }else{
                    return node.EQ
                }                
            });

            //console.log(hierarchy);

            let createTreeMap = d3.treemap()
                .size([document.getElementById('treeDiv').getBoundingClientRect().width, 
                       document.getElementById('treeDiv').getBoundingClientRect().height]);
            
            createTreeMap(hierarchy);

            let stockTiles = hierarchy.leaves();
            //console.log(stockTiles);
            
            let block = canvas.selectAll('g')
                .data(stockTiles)
                .enter()
                .append('g')
                .attr('transform', (stock)=>{
                    return 'translate('+stock['x0']+','+stock['y0']+')'
                })

            //rect w/ bg color fill
            block.append('rect')
                .attr('class','tile')
                .attr('fill',(stock)=>{
                    //console.log(stock.data.PCT_CHANGE);
                    if(stock.data.PCT_CHANGE < 0){
                        return '#FF5639' // red
                    }else{
                        return '#05AC72' // green
                    }

                })
                .style("stroke", "black")
                .attr('width', (stock)=>{
                    return stock['x1'] - stock['x0']
                })
                .attr('height', (stock)=>{
                    return stock['y1'] - stock['y0']
                })
                .on('mouseover', (stock)=>{
                    //console.log(stock);
                })
                .on('click',(stock)=>{
                    alert('clicked');
                })
                
            //SUMBOL ON THE SHEET
            var counter = 0;
            block.append('text')
                .attr('x',(stock) => { return (stock['x1'] - stock['x0']) / 2 })
                .attr('y',(stock) => { return ( (stock['y1'] - stock['y0']) / 2) - 5 })
                .attr('text-anchor', 'middle')
                .style('fill','white')
                .text((stock)=>{
                    counter = counter + 1;
                    return stock['data']['SYMBOL'];
            })

            // value under symbol
            counter = 0;
            block.append('text')
                .attr('x',(stock) => { return ( (stock['x1'] - stock['x0']) / 2)})
                .attr('y',(stock) => { return ( (stock['y1'] - stock['y0']) / 2) + 10})
                .attr('text-anchor', 'middle')
                .style('fill','white')
                .text((stock)=>{
                    if(marketCapAdjust){ // logic may not be necessary b/c market cap no longer used
                        counter = counter + 1;
                        if( counter < 100 || !marketCapAdjust){
                            if(Math.trunc(stock['data']['VALUE'] >= 1000000000)){
                                return Math.trunc(stock['data']['VALUE']/1000000000)+'B';

                            }else if(Math.trunc(stock['data']['VALUE'] <= 1000000000)){
                                return Math.trunc(stock['data']['VALUE']/1000000)+'M';
                            }
                        }
                    }else{
                        if(stock.data.PCT_CHANGE >= 0){
                            return (stock.data.PCT_CHANGE+'').substring(0, 4)+'%';
                        }else{
                            return (stock.data.PCT_CHANGE+'').substring(1, 5)+'%';
                        }

                    }

                })//end block
            
                

        }//end 

        drawTreeMap();

    })

}//end get tree map









