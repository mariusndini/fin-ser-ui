function getSupplierData(){
  var SQL = ` WITH 
              --Ticker Region
              ticker
              AS (SELECT DISTINCT 
                        tr.ticker_region, 
                        cov.proper_name, 
                        ent.factset_entity_id
                  FROM   factset_test.sym_v1.sym_ticker_region tr --Historical table for the US and Australian stocks is available as an add-on package
                  JOIN factset_test.sym_v1.sym_coverage cov
                    ON tr.fsym_id = cov.fsym_id
                  --Security to Entity Linkage is provided at the security-level
                  JOIN factset_test.ent_v1.ent_scr_sec_entity_hist AS ent
                    ON ent.fsym_id = cov.fsym_security_id
                      AND ent.start_date <= current_date()
                      AND (ent.end_date > current_date()
                            OR ent.end_date IS NULL)
                  WHERE  tr.ticker_region IN('SNOW-US'))
              
              --Supply Chain
              SELECT DISTINCT 
                    sc.supplier_factset_entity_id, 
                    se.entity_proper_name AS "SupplierName", 
                    se.ISO_COUNTRY,
                    se.ENTITY_TYPE,
                    sc.customer_factset_entity_id,
                    mid.ticker_region  AS TICKER,
                    ce.entity_proper_name AS "Customer Name", 
                    sc.revenue_pct, 
                    sc.start_date,
                    sc.end_date,
                    sk.source_entity_keyword, 
                    sk.target_entity_keyword, 
                    sk.relationship_keyword1, 
                    sk.relationship_keyword2, 
                    sk.relationship_keyword3, 
                    sk.relationship_keyword4, 
                    sk.relationship_keyword5, 
                    sk.relationship_keyword6, 
                    sk.relationship_keyword7, 
                    sk.relationship_keyword8, 
                    sk.relationship_keyword9, 
                    sk.relationship_keyword10
              
              FROM   factset_test.ent_v1.ent_scr_supply_chain sc
              JOIN factset_test.ent_v1.ent_scr_relationships_keyword sk
                ON sk.id = sc.id
              JOIN sym_v1.sym_entity se
                ON sc.supplier_factset_entity_id = se.factset_entity_id
              JOIN factset_test.sym_v1.sym_entity ce
                ON sc.customer_factset_entity_id = ce.factset_entity_id
              JOIN ticker mid
                ON mid.factset_entity_id = sc.customer_factset_entity_id -- Change this to supplier_factset_entity_id to retrieve the list of customers for the target company
              WHERE  sc.start_date <= current_date()
                    AND (sc.end_date > current_date()
                          OR sc.end_date IS NULL)
                    AND sk.start_date <= current_date()
                    AND (sk.end_date > current_date()
                          OR sk.end_date IS NULL)
              ORDER BY sc.customer_factset_entity_id, 
                      sc.revenue_pct DESC;`;



  runSQL(gbl.indconn, SQL).then((res)=>{
    
  })

}


function makeTidyData(res){


}

function tidychart(){
    var data = {"name":"flare",
              "children":[
                {
                    "name":"analytics",
                    "children":[
                      {
                          "name":"cluster",
                          "children":[
                            {
                                "name":"AgglomerativeCluster",
                                "value":3938
                            },
                            {
                                "name":"AgglomerativeCluster",
                                "value":3938
                            },
                            {
                                "name":"AgglomerativeCluster2",
                                "value":3938
                            }
                          ]
                      }
                    ]
                }
              ]
          };

    var width = 500;
    var height = 550;
    
    tree = data => {
        const root = d3.hierarchy(data);
        root.dx = 10;
        root.dy = width / (root.height + 1);
        return d3.tree().nodeSize([root.dx, root.dy])(root);
      }


    const root = tree(data);
  
    let x0 = Infinity;
    let x1 = -x0;
    root.each(d => {
      if (d.x > x1) x1 = d.x;
      if (d.x < x0) x0 = d.x;
    });
  
    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, x1 - x0 + root.dx * 1]);

    const g = svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("transform", `translate(${root.dy / 4},${root.dx - x0})`);
      
    const link = g.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.0)
    .selectAll("path")
      .data(root.links())
      .join("path")
        .attr("d", d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x));
    
    const node = g.append("g")
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 1)
      .selectAll("g")
      .data(root.descendants())
      .join("g")
        .attr("transform", d => `translate(${d.y},${d.x})`);
  
    node.append("circle")
        .attr("fill", d => d.children ? "#555" : "#fff")
        .attr("r", 2.5);
  
    node.append("text")
        .attr("dy", "0.21em")
        .attr("x", d => d.children ? -6 : 6)
        .attr("text-anchor", d => d.children ? "end" : "start")
        .text(d => d.data.name)
        .attr("fill", "white");
    
    $('#supplier-tree').append(svg.node())
    //return svg.node();


}


