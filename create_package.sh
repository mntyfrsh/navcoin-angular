#!/bin/bash

#
# Build navcoin-angular package
#
# Do not run this script from /tmp unless you are root because
# the package is written to a directory directly above the 
# current directory
#

VERSION="1.0.0"
ARCH=`uname -a | awk '{ print $13}'`

# compile node modules
npm i

# create temp directory
mkdir -p ../na-build/debian/DEBIAN
mkdir -p ../na-build/debian/opt/navcoin-angular
mkdir -p ../na-build/debian/etc/systemd/system

# copy files
cp -p debian_files/DEBIAN/* ../na-build/debian/DEBIAN/
cp -p debian_files/etc/systemd/system/* ../na-build/debian/etc/systemd/system/
cp -pr `pwd`/. ../na-build/debian/opt/navcoin-angular/
rm -rf `pwd`/. ../na-build/debian/opt/navcoin-angular/.git*

# build package
cd ../na-build/
dpkg --build debian
mv debian.deb ../navcoin-angular_${VERSION}_$ARCH.deb
cd ..
rm -rf na-build

echo
echo "Package is ready at `pwd`/navcoin-angular_${VERSION}_$ARCH.deb"
echo
echo "Install using: dpkg -i navcoin-angular_${VERSIO}_$ARCH.deb"
echo
