/*
# Global Use Variables, and Functions
#
# Mainly Arrays of Keys used,
# Adds Event Listeners to needed Inputs
#
# Created 11/17/2022 by Stevan Plascencia-Gutierrez
*/

//Top 15 Publishers by total sales
const top15Pub = ['Nintendo', 'Electronic Arts', 'Activision', 'Sony Computer Entertainment', 'Ubisoft', 'Take-Two Interactive', 'THQ', 'Konami Digital Entertainment', 'Sega', 'Namco Bandai Games', 'Microsoft Game Studios', 'Capcom', 'Atari', 'Warner Bros. Interactive Entertainment', 'Square Enix']

//Top 15 Genres by total Sales
const top15Plat = ['PS2', 'X360', 'PS3', 'Wii', 'DS', 'PS', 'GBA', 'PSP', 'PS4', 'PC', 'XB', 'GB', 'NES', '3DS', 'N64'];

//Genres
const genres = ['Action', 'Adventure', 'Fighting', 'Misc', 'Platform', 'Puzzle', 'Racing', 'Role-Playing', 'Shooter', 'Simulation', 'Sports', 'Strategy']

//Color Scale for Genres
const gColor = d3.scaleOrdinal()
.domain(genres)
.range(['#67cc8e', "#6773cc", "#cc67a5", "#ccc167", "#67a5cc", "#bfcee7", "#8e67cc", '#ed8f67', '#c564e3', "#93d92d", "#fc6f7c", '#2dd9c9', "#d9732d", "#2dd973", "#4965fd"])


/*##############
BAR CHART SELECT
##############*/
top15Pub.forEach(d =>{
    d3.select('#barSelect')
    .append('option')
    .style('text-align', 'center')
    .attr('value', d+'')
    .html(d+'')
})
d3.select('#barSelect')
    .on('change', e => {
        createBar(e.srcElement.value); 
        d3.select('#barTitle').html(e.srcElement.value + "'s Top 10");
    })


/*##############
PIE CHART SELECT
##############*/

//Selection Input
top15Plat.forEach(d =>{
    d3.select('#pieSelect')
    .append('option')
    .style('text-align', 'center')
    .attr('value', d+'')
    .html(d+'')
})
d3.select('#pieSelect')
    .on('change', e => createPie(e.srcElement.value) )

/*##############
DECADE SELECT
##############*/
var decade = 2000
{
let dSelect = d3.select('#decade')
let dInc = ()=>{
    decade = decade + 10;
    decade = decade > 2010? 2010 :decade;
    dSelect.select('#decadeValue').html(decade)
    createMyChart(decade)
}
let dDec = ()=>{
    decade = decade - 10;
    decade = decade < 1980? 1980 : decade;
    dSelect.select('#decadeValue').html(decade)
    createMyChart(decade)
}

dSelect.append('button')
    .html('&#8249;')
    .on('click', dDec)

dSelect.append('span')
    .attr('id', 'decadeValue')
    .html(decade)

dSelect.append('button')
    .html('&#8250;')
    .on('click', dInc)
}
