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
    if(array.indexOf(element) == -1)
    {
        console.log(array + "\n adding");
        array.push(element);
    }
    else
    {
        console.log(array + "\n removing");
        array.splice(element.indexOf(value), 1);
    }

    return array;
}