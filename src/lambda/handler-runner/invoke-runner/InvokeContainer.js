import AwsInvokeLocal from 'serverless/lib/plugins/aws/invokeLocal'
import execa from 'execa'
import pRetry from 'p-retry'
import { getPortPromise } from 'portfinder'
import DockerContainer from '../docker-runner/DockerContainer.js'
import { DEFAULT_DOCKER_CONTAINER_PORT } from '../../../config/index.js'

export default class InvokeContainer extends DockerContainer {
  #serverless = null
  #invoker = null

  constructor(
    env,
    functionKey,
    handler,
    runtime,
    layers,
    provider,
    servicePath,
    dockerOptions,
    serverless,
  ) {
    super(
      env,
      functionKey,
      handler,
      runtime,
      layers,
      provider,
      servicePath,
      dockerOptions,
    )
    console.log(dockerOptions)
    this.#serverless = serverless
  }

  async start() {
    const func = this.functionKey
    this.port = await getPortPromise({ port: DEFAULT_DOCKER_CONTAINER_PORT })
    this.containerId = `${this.port}-${func}`
    this.functionKey = this.handler

    this.#invoker = new AwsInvokeLocal(this.#serverless, {
      function: func,
      data: {},
    })

    await this.#invoker.extendedValidate()

    this.#invoker.options.env = [
      ...(this.#invoker.options.env || []),
      'DOCKER_LAMBDA_STAY_OPEN=1',
    ]
    this.#invoker.options['docker-arg'] = [
      ...(this.#invoker.options['docker-arg'] || []),
      `-p ${this.port}:9001`,
      `--name ${this.containerId}`,
    ]

    this.#invoker.invokeLocal()

    // Await until container is fully started up
    for (let i = 0; i < 200; i += 1) {
      /* eslint-disable no-await-in-loop */
      const { stdout } = await execa('docker', [
        'ps',
        '--filter',
        `name=${this.containerId}`,
        '--filter',
        'status=running',
        '-q',
      ])
      /* eslint-disable no-await-in-loop */
      await new Promise((r) => setTimeout(r, 2000))
      if (stdout) {
        break
      }
    }

    await pRetry(() => this._ping(), {
      // default,
      factor: 2,
      // milliseconds
      minTimeout: 10,
      // default
      retries: 10,
    })
  }
}
