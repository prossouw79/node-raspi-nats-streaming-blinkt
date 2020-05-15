#!/bin/bash

killall nats-streaming-server
now=$(date '+%d-%m-%Y-%H-%M-%S');
logfile=$now-nats-streaming.log
# options available here: https://docs.nats.io/nats-streaming-server/configuring/cmdline
nats-streaming-server \
    -cid test-cluster \
    --user demoUser \
    --pass techSession \
    -store file --dir nats-event-store \
    --encrypt --encryption_key "mySuperSecureKey" \
    --file_compact_enabled \
    --log "$logfile" \
    &