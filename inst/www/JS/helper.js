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
        array.push(element);
    }
    else
    {     
        array.splice(array.indexOf(element), 1);
    }

    return array;
}

function findTicks(number)
{
    var factor = 0;
    if(isPrime(number))
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