#!/bin/bash
echo DEPLOMENT ACTIONS:
cat deploy.bash
echo
echo
read -p "READ AND PRESS ANY KEY TO APPROVE, OR PRESS CTRL+C TO CANCEL!"

if [ ! -d "app/bower_components" ]; then
	mkdir app/bower_components
fi

rsync -r bower_components/ app/bower_components/

sass app/styles/main.scss app/styles/main.css

firebase deploy