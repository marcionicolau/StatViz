function remove(id)
{
    var element = document.getElementById(id);
    element.parentNode.removeChild(element);
}

function getNumber(value)
{
    var n = parseInt(value);

    return n == null || isNaN(n) ? 0 : n;
}

function addToArray(array, element)
{   
    var variable = d3.select("#" + element + ".variableNameHolder");
    if(array.indexOf(element) == -1)
    {
        array.push(element);
        variable.attr("fill", panel.active);
    }
    else
    {     
        array.splice(array.indexOf(element), 1);
        variable.attr("fill", panel.normal);    
    }

    return array;
}

function findTicks(number)
{
    var factor = 0;
    if((isPrime(number)) && (number > 10))
    {
        number = number + 1;      
    }
    
    //we now have a non-prime number
    for(var i=1; i<=number/2; i++)
    {
        if((number%i == 0) && (number/i <= 10))
        {
            factor = i;
            break;
        }
    }
    
    return (number/factor)+1;
};

function toggleFillColors()
{
    var visualizations = d3.selectAll(".visualizationHolder");
    
    for(var i=0; i<visualizations.length; i++)
    {
        console.log(visualizations.length);
        if(visualizations[i].attr("id") == currentVisualizationSelection)
        {
            visualizations[i].attr("fill", panelColors.active);
        }
        else
        {
            visualizations[i].attr("fill", panelColors.normal);
        }
    }
}
        
        