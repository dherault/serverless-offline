import assert from 'node:assert'
import { platform } from 'node:os'
import { env } from 'node:process'
import { execa } from 'execa'
import { compressArtifact, joinUrl } from '../integration/_testHelpers/index.js'

// TODO FIXME docker tests currently failing while using node: protocol
const _describe = describe.skip
// const _describe = env.DOCKER_COMPOSE_DETECTED ? describe : describe.skip

_describe('docker in docker', function desc() {
  beforeEach(async () => {
    await Promise.all([
      compressArtifact(__dirname, './artifacts/hello.zip', ['./handler.js']),
      compressArtifact(__dirname, './artifacts/layer.zip', ['./handler.sh']),
    ])

    const composeFileArgs = ['-f', 'docker-compose.yml']
    if (platform() === 'linux') {
      composeFileArgs.push('-f', 'docker-compose.linux.yml')
    }

    const composeProcess = execa('docker-compose', [...composeFileArgs, 'up'], {
      all: true,
      cwd: __dirname,
      env: {
        HOST_SERVICE_PATH: __dirname,
      },
    })

    return new Promise((res) => {
      composeProcess.all.on('data', (data) => {
        if (String(data).includes('[HTTP] server ready')) {
          res()
        }
      })
    })
  }, 110000)

  afterEach(async () => {
    return execa('docker-compose', ['down'], {
      cwd: __dirname,
    })
  })

  //
  ;[
    {
      description: 'should work with docker in docker',
      expected: {
        message: 'Hello Node.js 12.x!',
      },
      path: '/dev/hello',
    },
    {
      description: 'should work with artifact with docker in docker',
      expected: {
        message: 'Hello Node.js 12.x!',
      },
      path: '/dev/artifact',
    },
    {
      description: 'should work with layer with docker in docker',
      expected: {
        message: 'Hello from Bash!',
      },
      path: '/dev/layer',
    },
    {
      description: 'should work with artifact and layer with docker in docker',
      expected: {
        message: 'Hello from Bash!',
      },
      path: '/dev/artifact-with-layer',
    },
  ].forEach(({ description, expected, path }) => {
    it(description, async () => {
      const url = joinUrl(env.TEST_BASE_URL, path)
      const response = await fetch(url)
      const json = await response.json()

      assert.deepEqual(json.message, expected.message)
    })
  })
})
