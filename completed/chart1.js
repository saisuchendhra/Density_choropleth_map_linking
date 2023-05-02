
var mapData = []
var data = []
var total = []
      // Load the population data and world map data
      document.addEventListener('DOMContentLoaded', function () {
      Promise.all([
        d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson'),
        d3.csv('data2.csv'),
      ]).then(([map_Data, p_data]) => {
        console.log(p_data)
        console.log(map_Data.features)
        k=0;
        for(let j=0;j<p_data.length;j++){
            if(p_data[j]['Country']=='World'){
                total[k] = p_data[j];
                total[k]['date'] = p_data[j].Year;
                k++
            }
          for(let i=0;i<map_Data.features.length;i++){
            if(p_data[j]['Country']==map_Data.features[i].properties.name){
              p_data[j]['id'] = map_Data.features[i].id
            }
          }
        }
        mapData = map_Data;
        data = p_data;
        console.log('total',total)
    
        var element = document.getElementById('character-name')
            element.innerHTML = 2000

       funct1('2000')
       appendData(2020);
  });
});


const margin = { top: 40, right: 80, bottom: 60, left: 120 },
    width = 600 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

const parseDate = d3.timeParse("%Y"),
    formatDate = d3.timeFormat("%b %d"),
    formatMonth = d3.timeFormat("%Y");

const x = d3.scaleTime().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);



const valueline = d3
    .line()
    .x((d) => { return x(d.date); })
    .y((d) => { return y(d.Population); })
    .curve(d3.curveCardinal);

const svg = d3
    .select("#root")
    .append("svg")
    .attr(
    "viewBox",
    `0 0 ${width + margin.left + margin.right} ${
    height + margin.top + margin.bottom}`)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickFormat(formatMonth)); 
	
svg.append("g").attr("class", "y axis").call(d3.axisLeft(y));

svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size", "22px")
    .text("Population");


function appendData(year) {
    d3.selectAll("path.area").remove();
    d3.selectAll("path.line").remove();
    d3.selectAll(".title").remove();
    
    filename = "total_population.csv";
    d3.csv(filename).then((data) =>
     {
        //data = data.reverse(); 
        data = total
        data.forEach((d) => {
            d.date = parseDate(d.date);
            d.Population = Number(d.Population);
        });

        x.domain(
            d3.extent(data, (d) => { return d.date; })
        )
        y.domain([
            5800000000 ,
            d3.max(data, (d) => { return d.Population; }),
        ]);

        svg
            .select(".x.axis") 
            .transition()
            .duration(750)
            .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y")));
        svg
            .select(".y.axis") 
            .transition()
            .duration(750)
            .call(d3.axisLeft(y));

        const linePath = svg
            .append("path")
            .data([data])
            .attr("class", "line")
            .attr("d", valueline)
        const pathLength = linePath.node().getTotalLength();
        linePath
            .attr("stroke-dasharray", pathLength)
            .attr("stroke-dashoffset", pathLength)
            .attr("stroke-width", 3)
            .transition()
            .duration(1000)
            .attr("stroke-width", 0)
            .attr("stroke-dashoffset", 0);

        
        const focus = svg
            .append("g")
            .attr("class", "focus")
            .style("display", "none");

        focus
            .append("line")
            .attr("class", "x")
            .style("stroke-dasharray", "3,3")
            .style("opacity", 1)
            .attr("y1", 0)
            .attr("y2", height);

        focus
            .append("line")
            .attr("class", "y")
            .style("stroke-dasharray", "3,3")
            .style("opacity", 0.5)
            .attr("x1", width)
            .attr("x2", width);

        focus
            .append("circle")
            .attr("class", "y")
            .style("fill", "none")
            .attr("r", 4);

        focus.append("text").attr("class", "y1").attr("dx", 8).attr("dy", "-.3em");
        focus.append("text").attr("class", "y2").attr("dx", 8).attr("dy", "-.3em");

        focus.append("text").attr("class", "y3").attr("dx", 8).attr("dy", "1em");
        focus.append("text").attr("class", "y4").attr("dx", 8).attr("dy", "1em");


        d3.select(".y.axis")
            .selectAll("text")
            .style("font-size", "12px");

        function mouseMove(event) {
            const bisect = d3.bisector((d) => d.date).left,
            x0 = x.invert(d3.pointer(event, this)[0]),
            i = bisect(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;

            focus
                .select("circle.y")
                .attr("transform", "translate(" + x(d.date) + "," + y(d.Population) + ")");

            focus
                .select("text.y1")
                .attr("transform", "translate(" + x(d.date) + "," + y(d.Population) + ")")
                .text(d.Population);

            focus
                .select("text.y2")
                .attr("transform", "translate(" + x(d.date) + "," + y(d.Population) + ")")
                .text(d.Population);

            focus
                .select(".x")
                .attr("transform", "translate(" + x(d.date) + "," + y(d.Population) + ")")
                .attr("y2", height - y(d.Population));

            focus
                .select(".y")
                .attr("transform", "translate(" + width * -1 + "," + y(d.Population) + ")")
                .attr("x2", width + width);


            var element = document.getElementById('character-name')
            element.innerHTML = d.date.getFullYear()
            funct1(d.date.getFullYear())
        }

        svg
            .append("rect")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mouseover", () => {
                focus.style("display", null);
            })
            .on("mouseout", () => {
                focus.style("display", "none");
            })
            .on("touchmove mousemove", mouseMove);
    });
}


  function funct1(year){
    const svg = d3.select('#choro_svg').attr("viewBox", "450 10 480 480");

    // svg.attr('width', 800).attr('height', 300)

    const svg_div = document.getElementById('choro_svg');
    svg_div.replaceChildren();
    
    const projection = d3.geoNaturalEarth1();
    const path = d3.geoPath().projection(projection);

    // const colorScale = d3.scaleSequential(d3.interpolateYlOrRd);

    const colorScale = d3.scaleSequential(d3.interpolateYlOrRd).domain([1e6, 1.4e8]);

    const legendWidth = 300;
    const legendHeight = 20;
    const legendMargin = 420;
    const legendMargin1 = 42;
    const legend = svg.append('g')
      .attr('transform', `translate(${svg.attr('width') - legendWidth-110 - legendMargin},${svg.attr('height') - legendHeight -200- legendMargin1}) rotate(90)`);

    const legendScale = d3.scaleLinear()
      .range([0, legendWidth])
      .clamp(true);

    const legendAxis = d3.axisBottom(legendScale)
      .tickFormat(d => d3.format('.2s')(d))
      .tickSize(legendHeight);

      console.log('data', data)
      const lookup = d3.rollup(data, v => d3.sum(v, d => d.Population), d => d.id, d => d.Year);
      console.log('lookup',lookup)
      // Set the initial year for the map

      const maxPopulation = d3.max(data, d => d3.max(Object.values(d)));
      

      const valuesArray = Array.from(data.values());
      const filteredArray = valuesArray.filter(obj => obj.id !== undefined);
      const maxPopulation2 = filteredArray.reduce((max, obj) => {
        const population = parseFloat(obj.Population); // convert population to a number
        return (population > max) ? population : max;
      }, 0);

    

      colorScale.domain([0, maxPopulation2/3]);


      const tooltip2 = d3.select("body")
                      .append("div")
                      .style("position", "absolute")
                      .style("z-index", "10")
                      .style("visibility", "hidden")
                      .style("background-color", "#fff")
                      .style("padding", "10px")
                      .style("border", "solid")
                      .style("border-width", "1px")
                      .style("border-radius", "5px");

      
        // Create the map
        svg.append('g')
          .selectAll('path')
          .data(mapData.features)
          .join('path')
            .attr('d', path)
            .style('fill', d => {
              const code = d.id  ;
              
            if(code=='IND'||code=='CHN'){
                if (lookup.has(code)) {
                    return colorScale(lookup.get(code).get(year+'')/3);
                  } else {
                    return '#eee';
                  }
            }
            else{
                if(code=='DOM')console.log(lookup.get(code).get(year+''))
                if (lookup.has(code)) {
                    return colorScale(lookup.get(code).get(year+''));
                  } else {
                    return '#eee';
                  }
            }

              
            })
            .on("mouseover", function(event) {
                
                  const curData = d3.select(this).data();
                  console.log(curData)
                  var total = lookup.get(curData[0].id).get(year+'')||0;
                  
                  
                  d3.select(this).attr('stroke-width', 3);
                  
                  tooltip2.html(`<strong>${curData[0].properties.name}</strong><br>
                                Population: ${total}<br>
                              `)
                  .style("visibility", "visible")
                  .style("left", (event.pageX + 10) + "px") 
                  .style("top", (event.pageY - 28) + "px"); 
              })
              .on("mousemove", function(event, d) {
                tooltip2.style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
              })
              .on("mouseout", function(d,i) {
                  d3.select(this).attr('stroke-width', 1);
                  tooltip2.style("visibility", "hidden");
              })

        // Create the legend gradient
        const gradient = legend.append('linearGradient')
          .attr('id', 'gradient')
          .attr('gradientUnits', 'userSpaceOnUse')
          .attr('x1', 0)
          .attr('y1', 0)
          .attr('x2', legendWidth)
          .attr('y2', 0);

        gradient.append('stop')
          .attr('offset', '0%')
          .attr('stop-color', colorScale(0));

        gradient.append('stop')
          .attr('offset', '100%')
          .attr('stop-color', colorScale(maxPopulation2));
          legend.append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#gradient)');

    legend.append('g')
      .attr('transform', `translate(0,${legendHeight})`)
      .call(legendAxis);


  }