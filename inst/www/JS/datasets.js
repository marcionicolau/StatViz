//dataset information

//Preprocessing
var datasetInformation = new Object();
    datasetInformation["impact"] = "Dataset comparing the verbal, spatial, and other such abilities of athletes in two groups - control and concussed";
    datasetInformation["cars"] = "Dataset with details about different cars";
    datasetInformation["weightLoss"] = "Dataset comparing the weight lost by participants in 3 groups: those who skipped breakfast, those who skipped lunch, and those who skipped dinner";
    datasetInformation["store"] = "TBD";

var variablesInDataset = new Object();
    variablesInDataset["impact"] = ["subject","condition","verbalMemoryPre","visualMemoryPre","visualMotorSpeedPre","reactionTimePre","impulseControlPre","totalSymptomPre","verbalMemoryPost","visualMemoryPost","visualMotorSpeedPost","reactionTimePost","impulseConstrolPost","totalSymptomPost"]
    variablesInDataset["cars"] = ["Car","MPG","Cylinders","Displacement","Horsepower","Weight","Acceleration","Model","Origin"];
    variablesInDataset["weightLoss"] = ["Participant", "Condition", "WeightLost"];
    variablesInDataset["store"] = ["ID", "price", "store", "subject"];
 
var types = ["participant", "dependent", "independent"];
var variablesInDatasetType = new Object();
    variablesInDatasetType["impact"] = [types[0], types[2], types[1], types[1], types[1], types[1], types[1], types[1], types[1], types[1], types[1], types[1], types[1], types[1]];
    variablesInDatasetType["cars"] = [types[0], types[1], types[2], types[1], types[1], types[1], types[1], types[1], types[2]];
    variablesInDatasetType["weightLoss"] = [types[0], types[2], types[1]];
    variablesInDatasetType["store"] = [types[1], types[1], types[2], types[0]];
    
var dataTypes = ["nominal", "ordinal", "interval", "ratio"];
var variablesInDatasetDataType = new Object();
    
function initVariablesInDatasetDataTypes()
{    
    console.log("hola");
    variablesInDatasetDataType["impact"] = [dataTypes[0], dataTypes[0], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3]];
    variablesInDatasetDataType["cars"] = [dataTypes[0], dataTypes[3], dataTypes[1], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[0], dataTypes[0]];
    variablesInDatasetDataType["weightLoss"] = [dataTypes[0], dataTypes[0], dataTypes[3]];
    variablesInDatasetDataType["store"] = [dataTypes[0], dataTypes[3], dataTypes[0], dataTypes[0]];
}