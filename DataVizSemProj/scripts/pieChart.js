/*
# Implementation of Pie Chart
#
# Script Contains all code for Pie Chart
#
# Created 11/24/2022 by Stevan Plascencia-Gutierrez
*/
{

    /*#########
      Global 
    #########*/


    //Margins
    const margin = {
        top: 50,
        right: 100,
        bottom: 0,
        left: 100,
    };
    //Dimensions
    const width = 800 - margin.left - margin.right;
    const height = 480 - margin.top - margin.bottom;

    //Core SVG
    const svg = d3.select('#pieGraph')
        .append("svg")
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    //Donut Hole
    let inside = svg.append('circle')
        .attr('cx',width/2)
        .attr('cy',height/2)
        .attr('r', 40)
        .attr('fill','white')

    let iText = svg.append('text')
        .attr('x',width/2)
        .attr('y',height/2)
        .attr('dy', '.3em')
        .attr('fill', 'black')
        .style('text-anchor', "middle")
        .style('base-alignment', "middle")

    /*** Hover Functions ***/
    let highlight = function (e, d) {
        //Fill Inside
        inside.transition(2000)
            .attr('fill', gColor(d))
        
        //Focus Genre Arc
        d3.selectAll(".dArc").style("opacity", .10)
        d3.select("#"+d).style("opacity", 1).style("stroke", gColor(d))

        //Change Inside text
        value = Math.round(d3.select("#"+d).data()[0].value)
        iText.transition(2000).text("$"+value+" M")
        console.log(value)
    }

    let arcH = function (e, d) {
        console.log(d)
        highlight(e,d.data.Genre)
    }

    //No Highlight
    let noHighlight = function (e, d) {
        inside.transition(2000)
            .attr('fill', 'white')
        d3.selectAll('.dArc').style('opacity', 1).style("stroke", 'white')
        iText.text('')
    }

    /*#################
    Data Initialization
    #################*/
    let gData;

    //Read the data
    d3.csv("data/vgsales.csv",
        d => {
            return {
                Global_Sales: d.Global_Sales,
                Platform: d.Platform,
                Genre: d.Genre
            }
        }
    ).then(
        data => {
            //Filter Out Unwanted Data
            gData = d3.filter(data, d => top15Plat.includes(d.Platform))
            gData = d3.group(gData, d => d.Platform)
            createPie('PS2')
        }
    )

    /*###########
    Axis Creation
    ###########*/

    //Left Axis
    let leftData = genres.slice(0,genres.length/2)
    let left = d3.scaleBand()
            .range([0, height])
            .domain(leftData)
    let leftAxis = svg.append('g')
            .style('font-size', 15)
            .call(d3.axisLeft(left).tickSize(10))
    leftAxis.select('.domain').remove()
    leftAxis.selectAll('.tick > line')
        .attr('stroke-width', 10)
        .attr('stroke', d => gColor(d))
    
    //Right Axis
    let rightData = genres.slice(genres.length/2,genres.length)
    let right = d3.scaleBand()
            .range([0, height])
            .domain(rightData)
    let rightAxis = svg.append('g')
            .attr('transform','translate('+width +',0)')
            .style('font-size', 15)
            .call(d3.axisRight(right).tickSize(10))
    rightAxis.select('.domain').remove()
    rightAxis.selectAll('.tick > line')
        .attr('stroke-width', 10)
        .attr('stroke', d => gColor(d))

    //Add Hover Functionality
    svg.selectAll('.tick')
        .on('mouseover',highlight)
        .on('mouseleave', noHighlight)
    /*########################################
                Pie Creation Function
    ########################################*/
    function createPie(plat){

       /*------------- 
       Data Processing
       -------------*/
       let pData = gData.get(plat)
       
       pData = d3.group(pData, d => d.Genre)

       pData = d3.map(pData, d=> {
            return{
                Genre: d[0],
                Sales: d3.sum(d[1], d => d.Global_Sales)
            }
       })
       
       pData = d3.sort(pData, (a, b) => d3.ascending(a.Genre, b.Genre))
        
       //Pie Axis
        const pie = d3.pie()
            .value(d => d.Sales)
            .sort((a, b) => d3.ascending(a.Genre, b.Genre))
        pData = pie(pData)

       /*----------
       Pie Creation
       ----------*/

       //Create Data Map
        let chart = svg.selectAll("path")
            .data(pData)

        //Join
        let myEnter = e => {
            return e.append('path')
                .attr('class','dArc')
                .attr('id', d => d.data.Genre)
                .attr('transform', 'translate(' + (width/2) + ',' + (height/2) + ')')
                .on('mouseover', arcH)
                .on('mouseleave', noHighlight)
                .transition()
                .duration(1000)
                .attr('d', d3.arc().innerRadius(40).outerRadius(height/2))
                .attr('fill', d => gColor(d.data.Genre))
                .attr('stroke', "white")
                .style('stroke-width', "1px")
                .style('opacity', 1)
        }
        //Update
        let myUpdate = u => {
            return u.attr('id', d => d.data.Genre)
                .transition()
                .duration(1000)
                .attr('d', d3.arc().innerRadius(40).outerRadius(height/2))
                .attr('fill', d => gColor(d.data.Genre))
        }
        //Exit
        let myExit = e => {
            return e.transition()
            .duration(1000)
            .attr('d', d3.arc().innerRadius(0).outerRadius(0))
            .remove();
        }

        //Create Pie Chart
        chart.join(
            myEnter,
            myUpdate,
            myExit
        )


    }

    /*---- End Of Pie Creation ----*/

}