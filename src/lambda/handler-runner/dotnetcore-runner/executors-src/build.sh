#!/bin/bash

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"

dotnet publish dotnetcore3.1/dotnetcore3.1.csproj -c Release -o ../executors-binaries/dotnetcore3.1
#dotnet publish dotnetcore2.1/dotnetcore2.1.csproj -c Release -o ../executors-binaries/dotnetcore2.1
