/*
# Implementation of Parallel Line Chart
#
# Script Contains all code for Parallel Line Chart
#
# Created 11/15/2022 by Stevan Plascencia-Gutierrez
*/
{
    /*#########
      Global 
    #########*/

    //Margins
    const margin = {
        top: 25,
        right: 300,
        bottom: 100,
        left: 75,
    };
    //Dimensions
    const width = 1000 - margin.left - margin.right;
    const height = 750 - margin.top - margin.bottom;

    //Create core SVG
    const svg = d3.select('#pLineGraph')
        .append("svg")
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')


    //Read the data
    d3.csv("data/vgsales.csv",
        d => {
            return {
                Global_Sales: d.Global_Sales,
                Genre: d.Genre,
                Publisher: d.Publisher
            }
        }
    ).then(
        data => {

            /*#############
            Data Processing
            #############*/

            //Aggregate Data
            grouped = d3.group(data, d => d.Genre, d => d.Publisher);

            //Get Keys
            let keys = Array.from(grouped.keys())
         
            //Data Manipulation -- Check getTop Desc
            flat = getTop(grouped)

            //Color Axis
            const color = d3.scaleOrdinal()
            .domain(keys)
            .range(['#67cc8e', "#6773cc", "#cc67a5", "#ccc167", "#67a5cc", "#bfcee7", "#8e67cc", '#ed8f67', '#732dd9', "#93d92d", "#fc6f7c", '#2dd9c9', "#d9732d", "#2dd973", "#4965fd"])

            /*############
            Axiis Creation
            ############*/

            //Axis Labels
            aLabels = keys.concat(['Publisher'])

            //Create Y Axiis
            const y = {}
            y['Publisher'] = d3.scalePoint()
                .domain(Array.from(d3.group(flat, d => d.Publisher).keys()))
                .range([0, height])
            keys.forEach((key, i) => {
                y[key] = d3.scaleLinear()
                    //Get Max and Min of every Genre
                    .domain([0, d3.max(d3.filter(flat, d => d.Genre == key), d => +d.Sales)])
                    .range([height, 0])
            })

            //Create X Axis
            const x = d3.scalePoint()
                .range([0, width])
                .padding(0)
                .domain(aLabels)
            

            //Draw Axiis
            svg.selectAll("myAxiis")
                .data(aLabels).enter()
                .append("g")
                .attr("id", d => d + "Axis")
                .attr('transform', d => "translate(" + x(d) + ")")
                .each(d => {
                    if(d == 'Publisher'){
                        d3.select("#" + d + 'Axis').call(d3.axisRight().scale(y[d]))
                    }else{
                        d3.select("#" + d + "Axis").call(d3.axisLeft().scale(y[d]))
                        d3.selectAll("#"+d+'Axis > g > text').style('fill', 'white')
                        d3.selectAll("#"+d+'Axis > g >  line').style('stroke', 'white')
                    }
                    d3.selectAll("#"+d+'Axis > path').style('stroke', 'white')

                })
                .append("text")
                .style("text-anchor", "middle")
                .attr("y", -9)
                .text(d => d)
                .style("fill", "white")

            //Customize Publisher Axis
            //Color Text
            svg.selectAll('#PublisherAxis > g > text')
                .attr('fill', d => color(d))
                .attr('class', d =>  "pLine " + (d+"").replace(/\.|\ /g,"_"))
                .attr('font-size',12)
                .on("mouseover", highlight)
                .on('mouseleave', noHighlight)

            //Color Tick
            svg.selectAll('#PublisherAxis > g > line')
                .attr('stroke', d => color(d))  
                .attr('stroke-width',2.5)
                .attr('class', d =>  "pLine " + (d+"").replace(/\.|\ /g,"_"))
                .on('mouseover', highlight)
                .on('mouseleave',noHighlight )  

            //Add Bottom Axis Label
            svg.append('g')
                .attr('id', 'XAxisLabel')
                .append('text')
                .text("Total Sales (Millions)")
                .style('fill','white')
                .attr('x', -height/2)
                .attr('y', -35)
                .attr('transform', 'rotate(-90)')
                .style('text-anchor', "middle")


            /*###########
            Line Creation
            ###########*/

            //Creates Path
            function path(d) {
                d = d3.group(d[1], e => e.Genre)
                return d3.line()(
                    (aLabels.map(key => {
                        if(key == 'Publisher'){
                            let pub = Array.from(d.values())[0][0].Publisher 
                            return [x(key), y[key](pub)]
                        }
                        let val = d.get(key)
                        if (val != undefined) {
                            return [x(key), y[key](val[0].Sales)]
                        } else {
                            return [x(key), y[key](0)]
                        }
                    }))
                )
            }

            //Draw Lines
            svg.selectAll("myPaths")
                .data(d3.group(flat, d => d.Publisher))
                .join("path")
                .attr("class", d => {
                    return "pLine " + (d[0]+"").replace(/\.|\ /g,"_") 
                })
                .attr("d", path)
                .style("fill", "none")
                .style("stroke", d => color(d[0]))
                .style("stroke-width", 2.5)
                .style("stroke-linecap", "round")
                .style("stroke-linejoin", "round")
                .style("opacity", 1)
                .on("mouseover", (e,d) => highlight(e,d[0]))
                .on('mouseleave', noHighlight)

        }
    )

    /*####### Functions #######*/

    //Gets top 15 performers
    let getTop = function(oldData) {

        let newData = []
        d3.map(oldData, (data) => {
            data[1].forEach(d => {
                newData.push({
                    Genre: d[0].Genre,
                    Publisher: d[0].Publisher,
                    Sales: d3.sum(d, e => e.Global_Sales)
                })
            });
        })


        newData = d3.flatGroup(newData, d => d.Publisher)
        newData = newData.sort((a, b) => d3.descending(d3.sum(a[1], e => e.Sales), d3.sum(b[1], e => e.Sales)))
        newData = d3.filter(newData, (v, i) => i < 15)

        arr = []
        newData.forEach(d => {
            arr = arr.concat(d[1])
        })

        return arr
    }


    //Highlight
    let highlight = function (e, d) {
        let pub = (d+"").replace(/\.|\ /g,"_")

        d3.selectAll('text.'+pub).attr('font-size',16)
        d3.selectAll(".pLine").style("opacity", .5).style("stroke-dasharray", "15,15")
        d3.selectAll(".pLine." + pub ).style("opacity", 1).style("stroke-width", 5).style("stroke-dasharray", "1,0")
    }

    //No Highlight
    let noHighlight = function (e, d) {
        d3.selectAll('text.pLine').attr('font-size',12)
        d3.selectAll('.pLine').style('opacity', 1).style("stroke-width", 2.5).style("stroke-dasharray", "1,0")
    }

}