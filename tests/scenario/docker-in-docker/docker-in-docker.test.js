import { platform } from 'node:os'
// import { env } from 'node:process'
import execa from 'execa'
import fetch from 'node-fetch'
import {
  compressArtifact,
  joinUrl,
} from '../../integration/_testHelpers/index.js'

// TODO FIXME docker tests currently failing while using node: protocol
const _describe = describe.skip
// const _describe = env.DOCKER_COMPOSE_DETECTED ? describe : describe.skip

_describe('docker in docker', () => {
  jest.setTimeout(180000)

  // init
  beforeAll(async () => {
    await compressArtifact(__dirname, './artifacts/hello.zip', ['./handler.js'])
    await compressArtifact(__dirname, './artifacts/layer.zip', ['./handler.sh'])

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

  // cleanup
  afterAll(async () => {
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
    test(description, async () => {
      const url = joinUrl(TEST_BASE_URL, path)
      const response = await fetch(url)
      const json = await response.json()

      expect(json.message).toEqual(expected.message)
    })
  })
})
