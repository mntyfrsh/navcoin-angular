#!/bin/bash

VERSION="1.0.0"

# create temp directory
mkdir -p /tmp/na-build/debian/DEBIAN
mkdir -p /tmp/na-build/debian/DEBIAN/opt/navcoin-angular
mkdir -p /tmp/na-build/debian/DEBIAN/etc/systemd/system

# copy files
cp -p debian_files/DEBIAN/* /tmp/na-build/debian/DEBIAN
cp -p debian_files/DEBIAN/etc/systemd/system/* /tmp/na-build/debian/DEBIAN/etc/systemd/system
cp -pr `pwd`/. /tmp/na-build/debian/DEBIAN/opt/navcoin-angular

# build package
cd /tmp/na-build/
dpkg --build debian
mv debian.deb /tmp/navcoin-angular_$VERSION.deb

echo
echo "Package is ready at /tmp/navcoin-angular_$VERSION.deb"
echo
echo
