#!/bin/bash
if pids=$(sudo lsof -i:3000 -t); then
    sudo kill -9 $pids;
fi
sudo rm -rf /home/ubuntu/webapp_backend