function remove(id)
{
    return (elem=document.getElementById(id)).parentNode.removeChild(elem);
}

 function getNumber(value)
 {
         var n = parseInt(value);

         return n == null || isNaN(n) ? 0 : n;
 }