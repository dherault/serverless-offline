# layers-provided

Covers a custom runtime shipped in a lambda layer, run in a docker container:

- the content of the layer has to be available under `/opt`
- the `bootstrap` of the layer is the entry point of the runtime, the lambda
  base images run `/var/runtime/bootstrap`

The layer is configured through `localLayers`, so the test exercises a custom
runtime without AWS credentials or a pre-populated internal cache. The service
is started without the environment of the test process, with the AWS SDK
pointed at credential files which do not exist, so a credential of the machine
or of the CI cannot make the test pass. The local directory's `bootstrap` is
intentionally not executable; `serverless-offline` restores that permission
while preparing the layer.
