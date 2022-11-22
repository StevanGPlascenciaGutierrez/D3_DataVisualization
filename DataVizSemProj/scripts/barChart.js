/*
# Implementation of Bar Chart
#
# Script Contains all code for Bar Chart
#
# Created 11/17/2022 by Stevan Plascencia-Gutierrez
*/
{

    //Margins
    const margin = {
        top: 25,
        right: 100,
        bottom: 100,
        left: 50,
    };
    //Dimensions
    const width = 800 - margin.left - margin.right;
    const height = 480 - margin.top - margin.bottom;

    //Create core SVG
    const svg = d3.select('#sec2Graph')
        .append("svg")
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')


    //Read the data
    d3.csv("data/vgsales.csv",
        d => {
            return {
                Rank: d.Rank,
                Name: d.Name,
                Genre: d.Genre,
                Publisher: d.Publisher,
                Year: d.Year,
                Sales: d.Global_Sales
            }
        }
    ).then(
        data => {

            /*#############
            Data Processing
            #############*/
            curPub = 'Nintendo';

            data = d3.filter(data, d => d.Publisher == curPub)
            data = d3.filter(data, (d,i) => i < 10)
            genres = Array.from(d3.group(data, d => d.Genre).keys())
            /*##########
            Create Axiis
            ##########*/
            
            //X Axis
            const x = d3.scaleBand()
                .range([0,width])
                .domain(d3.map(data, d => d.Name))
                .padding(1)

            //Append X Axis
            svg.append('g')
                .attr('transform', 'translate(0,'+height+')')
                .call(d3.axisBottom(x))
                .selectAll('text')
                    .attr('transform', 'translate(-10,0)rotate(-30)')
                    .style("text-anchor", 'end')

            //Y Axis
            const y = d3.scaleLinear()
                .domain([0,d3.max(data, d => d.Sales)])
                .range([height,0])

            //Append Y Axis
            svg.append('g')
                .call(d3.axisLeft(y))

            //Y axis Label
            svg.append('text')
                .text("Sales (Millions)")
                .attr('text-anchor', 'middle')
                .attr('transform', 'rotate(-90)')
                .attr('x', -height/2)
                .attr('y', -30)
            
            //Color Axis
            const color = d3.scaleOrdinal(d3.schemeAccent)
                .domain(genres)

            /*#########
            Create Bars
            #########*/
            svg.selectAll('myBar')
                .data(data)
                .join('rect')
                    .attr('x', d => x(d.Name) - width/22)
                    .attr('y', d => y(d.Sales))
                    .attr('width', width/11)
                    .attr('height', d => height - y(d.Sales))
                    .attr('fill', d => color(d.Genre) )
                    .attr('stroke', 'black')

            /*#######
            Legend
            #######*/
            svg.selectAll('bplRects')
                .data(genres)
                .join('rect')
                .attr('x', width - 10)
                .attr('y', (d,i) => i*30)
                .attr('width', 10)
                .attr('height', 10)
                .attr('fill', d => color(d))
                .attr('stroke', 'black')
            
            svg.selectAll('bplLabels')
                .data(genres)
                .join('text')
                .text(d => d)
                .attr('x', width + 10)
                .attr('y', (d,i) => i*30 + 5)
                .attr('fill', d =>color(d))
                .attr("text-anchor", 'left')
                .style('alignment-baseline', 'middle')
                .attr('stroke', 'black')

    })
}