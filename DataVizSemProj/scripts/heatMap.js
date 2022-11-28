/*
# Implementation of Heat Map Chart
#
# Script Contains all code for Heat Map Chart
#
# Created 11/23/2022 by Stevan Plascencia-Gutierrez
*/
{
    /*#########
      Global 
    #########*/

    //Margins
    const margin = {
        top: 25,
        right: 0,
        bottom: 50,
        left: 180,
    };
    //Dimensions
    const width = 800 - margin.left - margin.right;
    const height = 480 - margin.top - margin.bottom;

    //Create core SVG
    const svg = d3.select('#heatMapGraph')
        .append("svg")
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .style('z-index','-1')
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    //Tooltip Var
    let tooltip;

    //Read the data
    d3.csv("data/vgsales.csv",
        d => {
            return {
                Global_Sales: d.Global_Sales,
                Platform: d.Platform,
                Publisher: d.Publisher
            }
        }
    ).then(
        data => {

            /*#############
            Data Processing
            #############*/
            data = d3.filter(data, d=> top15Plat.includes(d.Platform) && top15Pub.includes(d.Publisher))
            //Aggregate Data
            data = d3.flatGroup(data, d => d.Platform, d => d.Publisher);
            //Get Sums
            data = d3.map(data, d =>{
                return {
                    Platform: d[0],
                    Publisher: d[1],
                    Value: d3.sum(d[2], d => d.Global_Sales)
                }
            } )
            
            //Get xGroup and yGroup
            let xGroup = top15Plat
            let yGroup = top15Pub
            
            //Color Axis
           
            /*############
            Axiis Creation
            ############*/

            //X Axis
            let x = d3.scaleBand()
                .range([0, width])
                .domain(xGroup)
                .padding(0.1)
            svg.append('g')
                .style('font-size', 15)
                .attr('transform', 'translate(0,'+height+')')
                .call(d3.axisBottom(x).tickSize(0))
                .select('.domain').remove()

            //Y Axis
            let y = d3.scaleBand()
                .range([height,0])
                .domain(yGroup)
                .padding(0.1)
            svg.append('g')
                .style('font-size', 10)
                .call(d3.axisLeft(y).tickSize(0))
                .select('.domain').remove()

            //Color Axis
            let color = d3.scaleSequential(d3.interpolatePlasma)
                .domain([0,d3.max(data, d => d.Value)])

            /*###########
            Box Creation
            ###########*/

            svg.selectAll()
                .data(data)
                .join("rect")
                .attr("x", d => x(d.Platform) )
                .attr("y", d => y(d.Publisher) )
                .attr("rx", 4)
                .attr("ry", 4)
                .attr("width", x.bandwidth() )
                .attr("height", y.bandwidth() )
                .style("fill", d =>  color(d.Value) )
                .style("stroke-width", 4)
                .style("stroke", "none")
                .style("opacity", 0.8)
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave)

            /*#####
            ToolTip
            #####*/
            // create a tooltip
            tooltip = d3.select('#heatMapGraph')
                .append('div')
                .style("opacity", 0)
                .style("background-color", "#95fcb2")
                .style("border", "solid")
                .style("border-width", "2px")
                .style("border-radius", "5px")
                .style("padding", "5px")
                .style('position','fixed')
                .style('display', 'block')
        }
    )

    /*####### Functions #######*/

    let mouseover = function(event,d) {
        tooltip
          .style("opacity", 1)
        d3.select(this)
          .style("stroke", "black")
          .style("opacity", 1)
      }
    
    let  mousemove = function(e,d) {
        tooltip
          .html( d.Publisher+" sold $" + (Math.round(d.Value))+"M <br> of games on the "+ d.Platform)
          .style("top", (e.clientY-50 ) + "px")
          .style("left",(e.clientX+10) + "px")
      }
    
    let  mouseleave = function(event,d) {
        tooltip
          .style("opacity", 0)
          .html("")
        d3.select(this)
          .style("stroke", "none")
          .style("opacity", 1)
      }

}