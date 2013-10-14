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