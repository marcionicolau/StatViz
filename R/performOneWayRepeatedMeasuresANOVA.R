performOneWayRepeatedMeasuresANOVA <- function(dependentVariable, independentVariable, participantID)
{
    dependentVariable <- c(dependentVariable);
    independentVariable <- c(independentVariable);
    participantID <- c(participantID);
    
    result <- eval(parse(text = paste("summary(aov(dependentVariable ~ independentVariable + Error(participantID/independentVariable)))")));
    
}