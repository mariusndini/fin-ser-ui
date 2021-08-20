var geodata_path = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";

function create_map(container_id, data_path, prop_name, prop_value) {

  const svg = d3.select( document.getElementById(container_id) ),
    width = +svg.attr("width"),
    height = +svg.attr("height");

  // Map and projection
  const path = d3.geoPath();
  const projection = d3.geoMercator()
    .scale(70)
    .center([0,20])
    .translate([width / 2, height / 2]);

  // Data and color scale
  const data = new Map();
  const colorScale = d3.scaleThreshold()
    .domain([0.25, 0.50, 1.0, 10.0, 25.0, 50.0, 70.0, 75, 90.0, 95.0])
    .range(d3.schemeGreens[9]);

  // Load external data and boot
  Promise.all([ d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson") ])
  .then(function(geoJSON){
      for(i=0; i < data_path.length; i++){
        data.set(data_path[i][prop_name], data_path[i][prop_value])
      }

      // let mouseOver = function(d) {
      //   d3.selectAll(".Country")
      //     .transition()
      //     .duration(200)
      //     .style("opacity", .5)
      //   d3.select(this)
      //     .transition()
      //     .duration(200)
      //     .style("opacity", 1)
      //     .style("stroke", "black")
      // }

      // let mouseLeave = function(d) {
      //   d3.selectAll(".Country")
      //     .transition()
      //     .duration(200)
      //     .style("opacity", .8)
      //   d3.select(this)
      //     .transition()
      //     .duration(200)
      //     .style("stroke", "transparent")
      // }

    // Draw the map
    svg.append("g")
      .selectAll("path")
      .data(geoJSON[0].features)
      .enter()
      .append("path")
        // draw each country
        .attr("d", d3.geoPath()
          .projection(projection)
        )
        // set the color of each country
        .attr("fill", function (d) {
          d.total = data.get(d.id) || 0;
          return colorScale(d.total);
        })
        .style("stroke", "black")
        .attr("class", function(d){ return "Country" } )
        .style("opacity", 1)
        //.on("mouseover", mouseOver )
        //.on("mouseleave", mouseLeave )
    
  })

}