var arguments = process.argv.slice(2);
var fs = require('fs');

function convertFiletoArray(arguments){

    let temp =[];

    let inputArray =[];
    try {  
        var data = fs.readFileSync(arguments[0], 'utf8');
        data = data.toString()+'\n';
        let ini = 0;
        for(let x=0;x<data.length;x++){
            if(data[x]==' '){
                temp.push(data.substring(ini,x))
                ini=x+1
            }else if(data[x]=='\n'){
                temp.push(data.substring(ini,x))
                ini=x+1
                inputArray.push(temp);
                temp=[];
            }
        }
    } catch(e) {
        console.log('error>>>', e);
    }
    return inputArray;
}

let array = convertFiletoArray(arguments)

let mapBalance = {};


function loanFunction(arr){

    let principle = parseFloat(arr[3])
    let time = parseFloat(arr[4])
    let rate = parseFloat(arr[5])

    let emiCount = Math.ceil(time*12);
    let totalAmount = principle + principle*time*rate/100;
    let amtPerEmiv = Math.ceil(totalAmount/emiCount);

    mapBalance[arr[1]+"_"+arr[2]]={
        'amount'   :    totalAmount ,
        'emiCount' :    emiCount    ,
        'emiAmount':    amtPerEmiv  ,
        'paidAmount':   0           ,
        'currentEmi':   amtPerEmiv
    }
}

function paymentFunction(arr){

    let lump = arr.length == 5 ? parseFloat(arr[3]):0;
    let emiAfter = parseFloat(arr[arr.length-1]);

    if(mapBalance[arr[1]+"_"+arr[2]]["emiAfter"]){
        mapBalance[arr[1]+"_"+arr[2]]["lump"].push(lump) ;
        mapBalance[arr[1]+"_"+arr[2]]["emiAfter"].push(emiAfter) ;
    }else{
        mapBalance[arr[1]+"_"+arr[2]]["lump"] = [lump] ;
        mapBalance[arr[1]+"_"+arr[2]]["emiAfter"] = [emiAfter] ;
    }

}

function balanceFunction(arr){

    let accObj = mapBalance[arr[1]+"_"+arr[2]];
    let amount = accObj["amount"];
    let lump  = accObj["lump"];
    let emiAfter = accObj["emiAfter"];
    let actualEmi = accObj["emiAmount"];
    let emiCount = accObj["emiCount"];
    let currEmi = parseFloat(arr[3]);

    if(!emiAfter){
        console.log(arr[1]," ",arr[2]," ",actualEmi*currEmi," ",emiCount-currEmi)
        return;
    }
    
    let totalPaid  = 0;
    let gretestEmi = 0;

    for(let x=0;x<emiAfter.length;x++){
        if(currEmi >= emiAfter[x])
        {
            totalPaid += lump[x];
            if(emiAfter[x]>gretestEmi)
            {
                gretestEmi = emiAfter[x];
            }
        }
    }
    if(gretestEmi == 0 && emiAfter.length>0)
        gretestEmi = currEmi;

     totalPaid += (actualEmi*gretestEmi);


    if(amount-totalPaid<actualEmi)
        totalPaid = amount;
    
    if(gretestEmi < currEmi)
        totalPaid += actualEmi;
    
    let totalAmount = accObj["amount"];
    let emiAmount = accObj["emiAmount"];
    totalAmount -= totalPaid;

    let emiLeft = Math.ceil(totalAmount / emiAmount);
    if(totalAmount < emiAmount && totalAmount>0)
    {
        emiLeft = 1;
    }
    console.log(arr[1]," ",arr[2]," ",totalPaid," ",emiLeft)

}

for(let x=0;x<array.length;x++){

        if(array[x][0]=='LOAN'){
            loanFunction(array[x]);
        }else if(array[x][0]=='PAYMENT'){
            paymentFunction(array[x])
        }else if(array[x][0]=='BALANCE'){
            balanceFunction(array[x])
        }
}

// IDIDI Dale 1326 9
// IDIDI Dale 3652 4
// UON Shelly 15856 3
// MBI Harry 9044 10