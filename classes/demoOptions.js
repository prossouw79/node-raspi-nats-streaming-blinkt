
const minuteInMillis = 1 * 1000 * 60;
const hourInMillis = 60 * minuteInMillis;

function setSubscriptionOptions(index, opts) {
    console.log('Setting subscriptions options ' + index)

    switch (index) {
        case 1: {
            console.log("\nSubscriber Options 1: Default")
            console.log(" - No retransmission on client start: At-most-once")

            break;
        }

        case 2: {
            console.log("\nSubscriber Options 2: Deliver all")
            console.log(" - Client gets all available messages on restart: At-least-once")

            opts.setDeliverAllAvailable();

            break;
        }
        case 3: {
            console.log("\nSubscriber Options 3: Deliver latest")
            console.log(" - Client gets the latest available message on restart.")

            opts.setStartWithLastReceived();

            break;
        }

        case 4: {
            console.log("\nSubscriber Options 4: Deliver from index")
            console.log(" - Client gets all messages beyond an specified index.")

            opts.setStartAtSequence(30);

            break;
        }

        case 5: {
            console.log("\nSubscriber Options 5: Deliver from time delta")
            console.log(" - Client gets all messages beyond an specified index.")

            opts.setStartAtTimeDelta(1 * minuteInMillis)

            break;
        }

        default:
            break;
    }
}

module.exports = {
    setSubscriptionOptions: setSubscriptionOptions
}