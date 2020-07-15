#!/bin/bash
sudo chown -R ubuntu:ubuntu /home/ubuntu/webapp_backend/*
sudo rm /opt/codedeploy-agent/deployment-root/deployment-instructions/*cleanup
sudo rm /opt/cloudwatch-config.json
sudo cp /home/ubuntu/webapp_backend/cloud_watch/cloudwatch-config.json /opt/cloudwatch-config.json
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/opt/cloudwatch-config.json -s
sudo cp /home/ubuntu/webapp_backend/webapp-backend.service /lib/systemd/system/webapp-backend.service
echo "enabling backend"
sudo systemctl enable webapp-backend.service