loadFile <- function(filePath, head = T)
{
    list(data = read.table(filePath, head = head));
}