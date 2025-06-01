// Lightstreamer connection and subscription
const adapterSet = 'ISSLIVE';
const item = 'NODE3000005';

const tankPercentageElem = document.getElementById('tankPercentage');
const tankFluid = document.querySelector('#tank-fluid');

// Connect to Lightstreamer (address only, no protocol)
const lsClient = new LightstreamerClient("https://push.lightstreamer.com", adapterSet);
lsClient.connectionDetails.setAdapterSet(adapterSet);

lsClient.connect();

// Subscribe to urine tank fill level
const subscription = new Subscription("MERGE", item, ["Value"], true);
let received = false;
subscription.addListener({
    onItemUpdate: function (update) {
        if (received) return;
        received = true;
        const value = update.getValue("Value");
        if (value !== null) {
            updateTank(value);
        }
        // Unsubscribe and disconnect after first value
        lsClient.unsubscribe(subscription);
        lsClient.disconnect();
    }
});

lsClient.subscribe(subscription);


function updateTank(value) {
    let percent = parseFloat(value);
    if (isNaN(percent)) percent = 0;
    tankPercentageElem.textContent = `${percent}%`;
    tankFluid.style.height = percent + '%';
}
