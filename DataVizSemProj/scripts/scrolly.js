
/*
# Implementation of graph-scroll.js for scrolly telling
#
# Script Contains all code for Scrollytelling 
#
# Created 11/1/2022 by Stevan Plascencia-Gutierrez
*/

d3.graphScroll()
    .sections(d3.selectAll('#sections>div'))
    .graph(d3.selectAll('.graph'))
    .container(d3.select('#container'))
    .on('active', i => console.log(i+'th section'))