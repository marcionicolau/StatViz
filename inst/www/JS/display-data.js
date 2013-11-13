function displayDataForVariable(variable)
{
    var variableData = variables[variable]["dataset"];
    
    var LEFT = canvasWidth/2 - plotWidth/2;
    var RIGHT = canvasWidth/2 + plotWidth/2;
    
    var TOP = canvasHeight/2 - plotHeight/2;
    var BOTTOM = canvasHeight/2 + plotHeight/2;
    
    var canvas = d3.select("#canvas");
    
    canvas.append("p")
            .text("Unfortunately, this variable has too many levels and does not have a meaningful visualization!")
            .attr("class", "displayDataText");
    
    var table = canvas.append("table")
            .attr("border", "1")
            .attr("class", "displayDataTable")
            .attr("style", "font-size: 18px; position: relative; width: 100%; top: 150px; margin: 0 auto");
            
    table.append("tr").append("th").text(variable);      
            
    for(var i=0; i<variableData.length; i++)
    {
        if(i < displayDataLimit)
        {
            table.append("tr").append("tr").text(variableData[i]);
        }
    }
}