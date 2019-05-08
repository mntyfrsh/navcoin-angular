#!/bin/bash

VERSION="1.0.0"

if [ ! -d "`pwd`/node_modules" ]; then
	echo 
	echo "Modules must be compiled using install_node_modules.sh before running this script"
	echo
	exit 1
fi

# create temp directory
mkdir -p /tmp/na-build/debian/DEBIAN
mkdir -p /tmp/na-build/debian/DEBIAN/opt/navcoin-angular
mkdir -p /tmp/na-build/debian/DEBIAN/etc/systemd/system

# copy files
cp -p debian_files/DEBIAN/* /tmp/na-build/debian/DEBIAN/
cp -p debian_files/DEBIAN/etc/systemd/system/* /tmp/na-build/debian/DEBIAN/etc/systemd/system/
cp -pr `pwd`/. /tmp/na-build/debian/DEBIAN/opt/navcoin-angular/

# build package
cd /tmp/na-build/
dpkg --build debian
mv debian.deb /tmp/navcoin-angular_$VERSION.deb

echo
echo "Package is ready at /tmp/navcoin-angular_$VERSION.deb"
echo
echo
