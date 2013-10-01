    getLinearModelCoefficients <- function(dataset = "",columnNameX = "", columnNameY = "", method = "") 
    {
        if(dataset == "")
        {   
            dataset = "beaver1";
            columnNameX = "time";
            columnNameY = "temp";
        }
        else if(columnNameX == "" || columnNameY == "")
        {
            # Load the first column name by default
            columnNameX = names(eval(parse(text = dataset)))[1]; 
            columnNameY = names(eval(parse(text = dataset)))[2]; 
        }
        
        distributionX = eval(parse(text = paste(dataset,"$",columnNameX)));
        distributionY = eval(parse(text = paste(dataset,"$",columnNameY)));
        
        model = lm(distributionX ~ distributionY);
        
        list(xIntercept = model$coefficients[[1]], yIntercept = model$coefficients[[2]]);
    }
