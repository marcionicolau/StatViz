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

Array.add = function(array, element)
{
    array.forEach(function(value)
    {
        if(element.indexOf(value) == -1)
        {
            array.push(element);
        }
        else
        {
            array.splice(element.indexOf(value), 1);
    });
    
    return array;
}