# layers-provided

Covers a custom runtime shipped in a lambda layer, run in a docker container:

- the content of the layer has to be available under `/opt`
- the `bootstrap` of the layer is the entry point of the runtime, the lambda
  base images run `/var/runtime/bootstrap`

Downloading a layer needs AWS credentials, which the test suite does not have,
so the layer of this service is committed pre-extracted in
`.serverless-offline/layers/<sha256 of the layer arns>`, next to the
`.completed` file marking the extraction as finished. `serverless-offline`
finds it there and skips the download.
