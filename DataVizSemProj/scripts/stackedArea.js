
/*
# Implementation of Stacked Area Chart
#
# Script Contains all code for Stacked Area Chart
#
# Created 11/1/2022 by Stevan Plascencia-Gutierrez
*/
{

//Margins
const margin = {
    top: 25,
    right: 200,
    bottom: 50,
    left: 75
};
//Dimensions
const width = 800 - margin.left - margin.right;
const height = 480 - margin.top - margin.bottom;

//Create core SVG
const svg = d3.select('#sec1Graph')
    .append("svg")
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')


//Read the data
d3.csv("data/saleTrends.csv",
    d => {
        return {
            EU_Sales: d.EU_Sales,
            Global_Sales: d.Global_Sales,
            JP_Sales: d.JP_Sales,
            NA_Sales: d.NA_Sales,
            Other_Sales: d.Other_Sales,
            Year: d3.timeParse('%Y')(d.Year)
        }
    }
).then(
    data => {

        /*#############
        Data Processing
        #############*/
        var mygroups = ['Other_Sales', 'NA_Sales', 'EU_Sales', 'JP_Sales']
        var stackedData = d3.stack()
            .keys(mygroups)
            (data)

        /*##########
        Create Axiis
        ##########*/

        //X Axis
        const x = d3.scaleTime()
            .domain(d3.extent(data, d => d.Year))
            .range([0, width]);
        svg.append('g')
            .attr('transform', 'translate(0,+' + height + ')')
            .call(d3.axisBottom(x));
        svg.append('text')
            .text('Year')
            .style('text-anchor', 'middle')
            .attr('x', width/2)
            .attr('y', height+30)

        //Y Axis
        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => +d.Global_Sales)])
            .range([height, 0])
        svg.append('g')
            .call(d3.axisLeft(y));
        svg.append('text')
            .text('Dollars (Millions)')
            .style('text-anchor', 'middle')
            .style('transform', "rotate(-90deg)")
            .attr('x', -height/2)
            .attr('y', -40)

        //Color palette
        const primary = d3.scaleOrdinal(d3.schemeSet1).domain(mygroups)
        const secondary = d3.scaleOrdinal(d3.schemePastel1).domain(mygroups)

        /*#########
        Draw Stacks
        #########*/

        //Add Area
        svg.selectAll("myLayers")
            .data(stackedData)
            .join('path')
            .attr('class', d => 'myArea '+d.key)
            .style('fill', d => secondary(mygroups[d.index]))
            .style('stroke', d => primary(mygroups[d.index]))
            .attr('d', d3.area()
                .x(d => x(d.data.Year))
                .y0(d => {
                    return y(+d[0])
                })
                .y1(d => y(+d[1]))
            )
            .on("mouseover", (e,d) => highlight(e,d.key))
            .on('mouseleave', noHighlight)


        /*#########
        Draw Legend
        #########*/

        var size = 20
        svg.selectAll('saRects')
            .data(mygroups.reverse())
            .join('rect')
                .attr('x', width)
                .attr('y', (d, i) => 10 + i * (size + 5))
                .attr('width', size)
                .attr('height', size)
                .style('fill', d => secondary(d))
                .text(d => d)
                .attr('text-anchor', 'left')
                .style('alignment-baseline', 'middle')
                .on("mouseover", highlight)
                .on('mouseleave', noHighlight)
        
        svg.selectAll("saLabels")
            .data(mygroups)
            .join('text')
                .attr('x', width+ size*1.2)
                .attr('y', (d ,i) => 10 + i*(size + 5) + ( size/2 ))
                .style('fill', d => secondary(d))
                .text(d => d.replace("_"," "))
                .attr("text-anchor", 'left')
                .style('alignment-baseline', 'middle')
                .on('mouseover', highlight)
                .on('mouseleave', noHighlight)
        })

/*#######
Functions
#######*/

//Add Highlight
let highlight = function (e, d) {
    d3.selectAll(".myArea").style("opacity", .1)
    d3.select("." + d).style("opacity", 1)
}

//Remove Highlight
let noHighlight = function (e, d) {
    d3.selectAll('.myArea').style('opacity', 1)
}


}