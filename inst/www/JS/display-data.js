function displayDataForVariable(variable)
{
    var variableData = variables[variable]["dataset"];
    
    var LEFT = canvasWidth/2 - plotWidth/2;
    var RIGHT = canvasWidth/2 + plotWidth/2;
    
    var TOP = canvasHeight/2 - plotHeight/2;
    var BOTTOM = canvasHeight/2 + plotHeight/2;
    
    var canvas = d3.select("#svgCanvas");
    
    var table = canvas.append("table")
            .attr("border", "1")
            .attr("class", "displayDataTable");
            
    table.append("tr").append("th").text(variable);      
            
    for(var i=0; i<variableData.length; i++)
    {
        if(i < displayDataLimit)
        {
            table.append("tr").append("tr").text(variableData[i]);
        }
    }
}