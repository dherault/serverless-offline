# Persistent Ruby invoke script for serverless-offline.
# Mirrors the Python runner pattern: spawn once, loop forever via stdin/stdout.
#
# Original one-shot version was based on:
# https://github.com/serverless/serverless/blob/v1.50.0/lib/plugins/aws/invokeLocal/invoke.rb

require 'json'

# https://docs.aws.amazon.com/lambda/latest/dg/ruby-context.html
class FakeLambdaContext
  attr_reader :aws_request_id, :client_context, :function_name,
              :function_version, :identity, :invoked_function_arn, :log_group_name,
              :log_stream_name, :memory_limit_in_mb

  def initialize(context:)
    @aws_request_id = context['awsRequestId']
    @client_context = context['clientContext']
    # @deadline_ms = TODO missing
    @function_name = context['functionName']
    @function_version = context['functionVersion']
    @identity = context['identity']
    @invoked_function_arn = context['invokedFunctionArn']
    @log_group_name = context['logGroupName']
    @log_stream_name = context['logStreamName']
    @memory_limit_in_mb = context['memoryLimitInMB']
    @timeout = context['timeout']

    @created_time = Time.now()
  end

  def get_remaining_time_in_millis
    [@timeout*1000 - ((Time.now() - @created_time)*1000).round, 0].max
  end
end


def attach_tty
  unless Gem.win_platform? || $stdin.tty? || !File.exist?("/dev/tty")
    $stdin.reopen "/dev/tty", "a+"
  end
rescue
  $stderr.puts "tty unavailable"
end

if __FILE__ == $0
  unless ARGV[0] && ARGV[1]
    puts "Usage: invoke.rb <handler_path> <handler_name>"
    exit 1
  end

  handler_path = ARGV[0]
  handler_name = ARGV[1]

  # Load the handler module ONCE at startup
  require("./#{handler_path}")

  # handler name is either a global method or a static method in a class
  # my_method or MyModule::MyClass.my_method
  handler_method, handler_class = handler_name.split(".").reverse
  handler_class ||= "Kernel"

  # Keep a reference to the original stdin for reading from the parent process
  original_stdin = $stdin.dup

  attach_tty

  # Persistent loop: read JSON from stdin, invoke handler, write result to stdout
  while (line = original_stdin.gets)
    line = line.strip
    next if line.empty?

    begin
      input = JSON.parse(line)

      context = FakeLambdaContext.new(context: input['context'] || {})
      result = Object.const_get(handler_class).send(handler_method, event: input['event'], context: context)

      data = {
        # just an identifier to distinguish between
        # interesting data (result) and stdout/print
        '__offline_payload__': result
      }

      $stdout.write(data.to_json)
      $stdout.write("\n")
      $stdout.flush
    rescue => e
      $stderr.write("#{e.class}: #{e.message}\n")
      $stderr.write(e.backtrace.join("\n") + "\n")
      $stderr.flush

      error_data = {
        '__offline_payload__': {
          'statusCode' => 500,
          'body' => JSON.generate({ error: e.message })
        }
      }
      $stdout.write(error_data.to_json)
      $stdout.write("\n")
      $stdout.flush
    end
  end
end
