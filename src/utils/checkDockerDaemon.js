import DockerClient from 'dockerode'

export default async function checkDockerDaemon() {
  const dockerClient = new DockerClient()

  let dockerServerOS
  try {
    const { Os } = await dockerClient.version()
    dockerServerOS = Os
  } catch (err) {
    throw new Error('The docker daemon is not running.')
  }

  if (dockerServerOS !== 'linux') {
    throw new Error('Please switch docker daemon to linux mode.')
  }
}
