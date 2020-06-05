#!/bin/bash

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"

echo "building dotnetcore 3.1 binaries"
dotnet build dotnetcore3.1/dotnetcore3.1.csproj --verbosity normal
echo "publishing dotnetcore 3.1 binaries"
dotnet publish dotnetcore3.1/dotnetcore3.1.csproj -c Release -o ../executors-binaries/dotnetcore3.1 --verbosity normal
echo "publish of dotnetcore 3.1 executor-binaries completed!"
