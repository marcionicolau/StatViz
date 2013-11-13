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
            .attr("align", "center")
            .attr("font-size", "22px")
            .attr("class", "displayDataText");
    
    var table = canvas.append("table")
            .attr("border", "1")
            .attr("class", "displayDataTable")
            .attr("style", "font-size: 16px; position: relative; width: 100%; top: 100px; margin: 0 auto");
            
    table.append("tr").append("th").text(variable);      
            
    for(var i=0; i<variableData.length; i++)
    {
        if(i < displayDataLimit)
        {
            if(i > 4*displayDataLimit/5)
            {
                table.append("tr").append("tr").text(variableData[i]).attr("opacity", ((displayDataLimit - i)/(displayDataLimit/5))*1);
            }
            else
            {
                table.append("tr").append("tr").text(variableData[i]);            
            }
        }
    }
}