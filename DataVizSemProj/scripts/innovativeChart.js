/*
# Implementation of Innovative Chart
#
# Script Contains all code for the Innovative Chart
#
# Created 11/19/2022 by Stevan Plascencia-Gutierrez
*/
{
    /*#########
      Global 
    #########*/

    //Margins
    const margin = {
        top: 125,
        right: 100,
        bottom: 100,
        left: 50,
    };
    //Dimensions
    const width = 1400 - margin.left - margin.right;
    const height = 700 - margin.top - margin.bottom;

    //Create core SVG
    const svg = d3.select('#innovativeGraph')
        .append("svg")
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    /*#################
    Data Initialization
    #################*/
    let gData;
    //Read in Data
    d3.csv("data/vgsales.csv",
        d => {
            return {
                Rank: d.Rank,
                Name: d.Name,
                Genre: d.Genre,
                Publisher: d.Publisher,
                Platform: d.Platform,
                Year: +d.Year,
                NA_Sales: d.NA_Sales,
                JP_Sales: d.JP_Sales,
                EU_Sales: d.EU_Sales,
                Other_Sales: d.Other_Sales,
                Global_Sales: d.Global_Sales
            }
        }
    ).then(
        data => {
            gData = d3.filter(data, d => d.Year < 2017)
    
            createMyChart(2000)
        })

    /*#################
    Axiis Intialization
    #################*/

    //Color Axis
    color = d3.scaleOrdinal()
        .domain(['NA_Sales', 'JP_Sales', 'EU_Sales', 'Other_Sales'])
        .range(['#67cc8e', "#6773cc", "#cc67a5", "#ccc167"])

    //X Axis G
    let xAxis = svg.append('g')
    .attr('transform', 'translate(0,' + height + ')')

    //X Axis Label
    svg.append('text')
        .text('Year')
        .attr('font-size', 'xx-large')
        .style('text-anchor', 'middle')
        .attr('x', width / 2)
        .attr('y', height + 50)
    
    //Y Axis G
    let yAxis = svg.append('g')
    
    //Y Axis Label
    svg.append('text')
        .text("Sales (Millions)")
        .attr('font-size', 'x-large')
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -30)

    /*##############
     Misc. Functions
    ##############*/

    //Converts Data to Pie Arcs
    let pieData = (data) => {
        let newD = {}
        newD['NA_Sales'] = data.NA_Sales
        newD['JP_Sales'] = data.JP_Sales
        newD['EU_Sales'] = data.EU_Sales
        newD['Other_Sales'] = data.Other_Sales

        const pie = d3.pie()
            .value(d => d[1])
            .sort((a, b) => d3.descending(a[0], b[0]))


        return pie(Object.entries(newD))
    }

    //Adds Donut Title
    let addTitle = (s,d)=>{

        /***** Donut Title *****/
        let title = '#' + d.Rank + ' ' + d.Name
        let subT = '' + d.Publisher
        let rWidth = ((title.length >= subT.length) ? title.length : subT.length) * 6.5;

        svg.select('#title'+d.Year)
            .transition().duration(1000)
            .attr('x',-rWidth/2)
            .attr('width', rWidth)

        //Title Text
        s.select('#titleText'+d.Year)
            .transition().duration(1000)
            .text(title)

        //Subtitle Text
        s.select('#subTText'+d.Year)
            .transition().duration(1000)
            .text(subT)
    }

    //Add Donut Info
    let addInfo = (s,d) =>{
        console.log(s)
        let innerText = {}
        innerText['Platform'] = d.Platform;
        innerText['Genre'] = d.Genre;
        innerText['Global_Sales'] = d.Global_Sales;
        innerText['NA_Sales'] = d.NA_Sales;
        innerText['EU_Sales'] = d.EU_Sales;
        innerText['JP_Sales'] = d.JP_Sales;
        innerText['Other_Sales'] = d.Other_Sales;
        
        Object.entries(innerText).forEach(e =>{
            s.select('#'+e[0]+'info'+d.Year)
                //.attr('fill', color(e[0]))
                .transition().duration(1000)
                .text((e[0].includes('Sales')? e[0].replace('_Sales', '') + ' ' + e[1]: e[1]))
        })
            
    }
    
    //Focus Pie Chart -> Donut Chart
    let focus = function (d, e, f) {
        //Grow Donut Ring
        d3.selectAll('.arc'+d.Year).transition().duration(1000)
            .attr('d', d3.arc().innerRadius(0).outerRadius(80))
        
        //Grow Donut Hole
        d3.select('#hole'+d.Year)
            .transition().duration(1000)
            .attr('r',60)

        //Add Info To Donut Hole
        d3.select('#holeG'+d.Year).call(addInfo,d)

        //Add Title
        d3.select('#titleG'+d.Year).call(addTitle,d);
    }

    //Remove Highlight
    let noFocus = function (d) {
        //Shrink Donut Ring
        d3.selectAll('.arc'+d.Year).transition().duration(1000)
            .attr('d', d3.arc().innerRadius(0).outerRadius(40))
        
        //Shrink Donut Hole
        d3.select('#hole'+d.Year)
            .transition().duration(1000)
            .attr('r',0)

        //Fade Out Info Text
        d3.selectAll('#holeG'+d.Year+' > text')
            .transition().delay(100).text('')

        //Shrink Title Rect
        d3.select('#title'+d.Year)
            .transition().duration(1000)
            .attr('x', 0)
            .attr('width', 0)

        //Fade Out Title Text
        d3.selectAll('#titleG'+d.Year+' > text')
            .transition().duration(1000).text('')

        
    }

    /*###########################
            MAIN FUNCTIONS
    ###########################*/

    /*###########
    Pie Creation
    ###########*/
    function createMyChart(decade) {

        /*#############
        Data Processing
        #############*/
        data = d3.filter(gData, d => {
            return (d.Year % decade < 10)
        })
        data = d3.group(data, d => d.Year)
        data = d3.map(data, d => d[1][0])


        /*############
        Axiis Creation
        ############*/

        //X Axis
        x = d3.scaleTime()
            .domain([d3.timeParse('%Y')(decade - 1), d3.timeParse('%Y')(decade + 9)])
            .range([0, width])

        //Append X Axis
        xAxis.transition().duration(1000).call(d3.axisBottom(x))

         //Y Axis
         y = d3.scaleLinear()
            .domain([0, d3.max(data, d => +d.Global_Sales)])
            .range([height, 0])

        //Append Y Axis
        yAxis.transition().duration(1000).call(d3.axisLeft(y))

      
        /*##########
        Pie Creation
        ##########*/
        
        let appendPies = (d,i,s)=>{

            //Create Pie/Donut Ring
            d3.select(s[i])
                .selectAll('.arcs')
                .data(pieData(d))
                .join('path')
                .attr('class','Pie'+d.Year+' arc' + d.Year)
                .attr('d', d3.arc().innerRadius(0).outerRadius(40))
                .attr('fill', d => color(d.data[0]))
                .attr('stroke', 'black')


            //Create Donut Hole
            d3.select(s[i])
                .append('circle')
                .attr('id', 'hole' + d.Year)
                .attr('class', 'Pie'+d.Year)
                .attr('stroke', 'black')
                .attr('fill','#bae5ff')
                .attr('r',0)

            //Create Donut Title Rectangle
            d3.select(s[i])
            .append('rect')
            .attr('id', 'title'+d.Year)
            .attr('class', 'Pie'+d.Year)
            .attr('y', -120)
            .attr('width', 0)
            .attr('height', 35)
            .attr('rx', 10)
            .attr('ry', 10)
            .attr('fill', '#bae5ff')
            .attr('stroke', 'black')

            //Create Title G
            let titleG = d3.select(s[i]).append('g')
                .attr('id','titleG'+d.Year)
                .attr('transform','translate(0, -120)')

            //Create Title Text
            titleG.append('text')
                .attr('id','titleText'+d.Year)
                .attr('class', 'Pie'+d.Year)
                .attr('y', 10)
                .text('')
                .attr('fill', 'black')
                .attr('font-size', 'small')
                .attr("text-anchor", 'middle')
                .style('alignment-baseline', 'middle')
                .attr('stroke', 'black') 

            //Create Subtitle Text
            titleG.append('text')
            .attr('id','subTText'+d.Year)
            .attr('class', 'Pie'+d.Year)
            .attr('y', 25)
            .text('')
            .attr('fill', 'black')
            .attr('font-size', 'small')
            .attr("text-anchor", 'middle')
            .style('alignment-baseline', 'middle')

            //Create Donut Hole G for Text
            let infoG = d3.select(s[i])
            .append('g')
                .attr('class', 'Pie'+d.Year)
                .attr('id','holeG'+d.Year)

            //Create Donut Info Texts
            let iText = ['Platform', 'Genre', 'Global_Sales', 'NA_Sales', 'EU_Sales', 'JP_Sales', 'Other_Sales']
            infoG.selectAll('.info')
            .data(iText)
            .join('text')
            .attr('id', e => e+'info'+d.Year)
            .attr('class', 'info Pie'+d.Year)
            .text('')
            .attr('y', (e, i) => -50 + i * 15)
            .attr('fill', (e, i) => i > 2 ? color(e)  : 'white')
            .attr('font-size', 'small')
            .attr("text-anchor", 'middle')
            .style('alignment-baseline', 'middle')
            .style('opacity', 1)

            svg.selectAll('.Pie'+d.Year)
                .on('mouseover', (e) => focus(d,e))
                .on('mouseleave', (e) => noFocus(d))    
        }

        //Pie G

        d3.selectAll('.myPiesGs').remove()
        let pieG = svg.selectAll('.pieGs')
            .data(data)
            .join('g')
            .attr('id', d => 'pie' + d.Year)
            .attr('class', 'myPiesGs')
            .attr('transform', d => 'translate(' + x(d3.timeParse('%Y')(d.Year)) + ',' + y(d.Global_Sales) + ')')
            .each(appendPies)
    }
}