    getMean <- function(dataset,columnName) 
    {
        if(dataset == "")
        {   
            dataset = beaver1;
            columnName = "time";
        }
        else if(columnName == "")
        {
            dataset = eval(parse(text = dataset));
            
            # Load the first column name by default
            columnName = names(dataset)[1]; 
        }
        
        distribution = dataset$eval(parse(columnName));
        
        list(value = mean(distribution));
    }
