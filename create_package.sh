#!/bin/bash

VERSION="1.0.0"

if [ ! -d "`pwd`/node_modules" ]; then
	echo 
	echo "Modules must be compiled using install_node_modules.sh before running this script"
	echo
	exit 1
fi

# create temp directory
mkdir -p ../na-build/debian/DEBIAN
mkdir -p ../na-build/debian/DEBIAN/opt/navcoin-angular
mkdir -p ../na-build/debian/DEBIAN/etc/systemd/system

# copy files
cp -p debian_files/DEBIAN/* ../na-build/debian/DEBIAN/
cp -p debian_files/DEBIAN/etc/systemd/system/* ../na-build/debian/DEBIAN/etc/systemd/system/
cp -pr `pwd`/. ../na-build/debian/DEBIAN/opt/navcoin-angular/

# build package
cd ../na-build/
dpkg --build debian
mv debian.deb navcoin-angular_$VERSION.deb

echo
echo "Package is ready at `pwd`/navcoin-angular_$VERSION.deb"
echo
echo
