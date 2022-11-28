/*
# Implementation of Bar Chart
#
# Script Contains all code for Bar Chart
#
# Created 11/17/2022 by Stevan Plascencia-Gutierrez
*/
{
    /*#########
      Global 
    #########*/

    //Margins
    const margin = {
        top: 25,
        right: 110,
        bottom: 150,
        left: 150,
    };

    //Dimensions
    const width = 800 - margin.left - margin.right;
    const height = 480 - margin.top - margin.bottom;

    //Core SVG
    const svg = d3.select('#barGraph')
        .append("svg")
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    /*** Hover Functions ***/
    let highlight = function (e, d) {
        d3.selectAll(".myBars").style("opacity", .10)
        d3.selectAll(".myBars." + (d+"")).style("opacity", 1).style("stroke-width", 2)
    }

    //No Highlight
    let noHighlight = function (e, d) {
        d3.selectAll('.myBars').style('opacity', 1).style("stroke-width", 1)
    }


    /*#################
    Data Initialization
    #################*/
    let gData;
    d3.csv("data/vgsales.csv",
        d => {
            return {
                Name: d.Name,
                Genre: d.Genre,
                Platform: d.Platform,
                Publisher: d.Publisher,
                Sales: d.Global_Sales
            }
        }
    ).then(
        data => {
            gData = data
            createBar('Nintendo')
    })
    
    /*########
    Axis Initialization
    ########*/
    let xAxis = svg.append('g')
            .attr('transform', 'translate(0,' + height + ')')

    let yAxis = svg.append('g')

    /*####
    Legend
    ####*/
    svg.selectAll('bplRects')
        .data(genres)
        .join('rect')
        .attr('x', width + 10)
        .attr('y', (d, i) => i * 30)
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', d => gColor(d))
        .attr('stroke', 'black')
        .on('mouseover', highlight)
        .on('mouseleave', noHighlight)

    svg.selectAll('bplLabels')
        .data(genres)
        .join('text')
        .text(d => d)
        .attr('x', width + 25)
        .attr('y', (d, i) => i * 30 + 5)
        .attr('fill', d => gColor(d))
        .attr("text-anchor", 'left')
        .style('alignment-baseline', 'middle')
        .attr('stroke', 'black')
        .attr('stroke-width', 0.5)
        .on('mouseover', highlight)
        .on('mouseleave', noHighlight)


    /*#################
        MAIN FUNCTION
    #################*/


    /******* Create Bar Graph  *******/
    function createBar(pub) {

        /*#############
        Data Processing
        #############*/

        let data = d3.filter(gData, d => d.Publisher == pub)
        data = d3.filter(data, (d, i) => i < 10)
        
        count = d3.group(data, d => d.Name)
        
        data = d3.map(data, d =>{
            
            if(count.get(d.Name).length == 1){
                return d
            }else{
                d['Name'] = d.Name + ' ('+d.Platform+')'
                return d
            }
        })

        /*##########
        Create Axiis
        ##########*/
        names = d3.map(data, d => d.Name)
       
        //X Axis
        const x = d3.scaleBand()
            .range([0, width])
            .domain(names)
            // .padding(.5)

        //Append X Axis
        xAxis.transition(1000)
            .call(d3.axisBottom(x))
            .selectAll('text')
            .attr('transform', 'translate(-10,0)rotate(-30)')
            .style("text-anchor", 'end')

        //Y Axis
        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.Sales)])
            .range([height, 0])

        //Append Y Axis
        yAxis.transition(2000)
            .call(d3.axisLeft(y))

        //Y axis Label
        svg.append('text')
            .text("Sales (Millions)")
            .attr('text-anchor', 'middle')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', -30)


        /*#########
        Create Bars
        #########*/
        //Data Enters
        let enterBar = e =>{
            return e.append('rect')
            .attr('class', d => 'myBars '+d.Genre)
            .attr('x', d => x(d.Name) )
            .attr('y', y(0))
            .attr('width', x.bandwidth())
            .attr('fill', d => gColor(d.Genre))
            .attr('stroke', 'black')
            .transition() 
            .duration(1000)
            .attr('y', d => y(d.Sales))
            .attr('height', d => height - y(d.Sales))
        }

        //Data Updates
        let updateBar = u =>{
            return u
            .attr('class', d => 'myBars '+d.Genre)
            .transition() 
            .duration(1000)
            .attr('y', y(0))
            .attr('height', 0)
            .transition()
            // .delay(1000)
            .duration(1000)
            .attr('y', d => y(d.Sales))
            .attr('height', d => height - y(d.Sales))
            .attr('fill', d => gColor(d.Genre))
        }

        //Data Leaves
        let exitBar = e =>{
            return e
                .transition() 
                .duration(1000)
                .attr('y', y(0))
                .attr('height', 0)
                .remove()
        }

        //Join Data
        svg.selectAll('.myBars')
            .data(data)
            .join(
                enterBar,
                updateBar,
                exitBar
            )
    }
    /******* End of Create Bar Graph  *******/
}