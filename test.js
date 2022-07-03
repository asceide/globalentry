// Needs Terminal-Notifier 2.0.0 to be installed via Brew or compiled on your own.
// npm package - node-notifier.
// You have to change the path in notificationcenter.js to the path of the brew notifier
// -> const notifier = path.join('/opt/homebrew/bin/terminal-notifier');
const NotificationCenter = require('node-notifier').NotificationCenter;


async function getCharlotte(){
    const response = await fetch('https://ttp.cbp.dhs.gov/schedulerapi/slots?orderBy=soonest&limit=10&locationId=14321&minimum=1');
    const data = await response.json();
    await sleep(5000);
    if(data){

        return data;
    }
}

async function getAustin(){
    const response = await fetch('https://ttp.cbp.dhs.gov/schedulerapi/slots?orderBy=soonest&limit=10&locationId=7820&minimum=1');
    const data = await response.json();
    if(data){
        return data;
    }

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var notifier = new NotificationCenter({
    withFallback: true,
    customPath: undefined
})

let charlotte;
let austin;
let cltTimestamp='';
let austTimestamp='';

async function charlotteF(){while(true){
    getCharlotte().then(data => {
        charlotte=data
        });

    if(charlotte){
        if(charlotte.length>0 && charlotte[0].startTimestamp!==cltTimestamp){
            notifier.notify({
                title: 'Charlotte',
                subtitle: 'There are '+charlotte.length+' slots available',
                message: 'The date is '+charlotte[0].startTimestamp+' ',
                sound: 'Glass',
                open: 'https://ttp.cbp.dhs.gov/',
                wait: 30
            },
            function(err, response, metadata){
                console.log(response,metadata);
            });
            console.log(`There is a slot available in Charlotte at ${charlotte[0].startTimestamp}`);
            cltTimestamp=charlotte[0].startTimestamp;
        }
    }

    console.log(`Waiting 15 seconds before the next request for Charlottes...`);
    await sleep(15000);
}}


async function austinF(){while(true){
    getAustin().then(data => {
        austin=data
        });

    if(austin){
        if(austin.length>0 && austin[0].startTimestamp!==austTimestamp){
            notifier.notify({
                title: 'Austin',
                subtitle: 'There are '+austin.length+' slots available',
                message: 'The date is '+austin[0].startTimestamp+' ',
                sound: 'Glass',
                open: 'https://ttp.cbp.dhs.gov/',
                wait: 30
            },
            function(err, response, metadata){
                console.log(response,metadata);
            });
            console.log(`There is a slot available in Austin at ${austin[0].startTimestamp}`);
            austTimestamp=austin[0].startTimestamp;
        }
    }

    console.log(`Waiting 15 seconds before the next request for Austin...`);
    await sleep(15000);
}}

charlotteF();
austinF();
