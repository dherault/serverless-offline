#!/bin/bash

# #install zip on debian OS, since microsoft/dotnet container doesn't have zip by default
# if [ -f /etc/debian_version ]
# then
#   apt -qq update
#   apt -qq -y install zip
# fi

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"

dotnet restore ./Example.csproj --verbosity detailed
dotnet build && dotnet lambda package --configuration Release --framework netcoreapp3.1 --output-package ./bin/Release/netcoreapp3.1/hello.zip --verbosity detailed
