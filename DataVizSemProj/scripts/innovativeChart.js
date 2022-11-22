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
    const svg = d3.select('#sec6Graph')
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
        
            /*##########
            Create Axiis
            ##########*/

            /*#########
            Create Bars
            #########*/

            /*#######
            Legend
            #######*/

    })
}