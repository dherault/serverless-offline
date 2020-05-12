using System;
using Newtonsoft.Json;
using McMaster.NETCore.Plugins;
using Amazon.Lambda.Core;
using System.Collections.Generic;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace dotnetcore3._1
{
    class Program
    {
        static void Main(string[] args)
        {
            var input = Console.ReadLine();
            var jsonObj = JObject.Parse(input);

            var handler = args[0];
            var handlerParts = handler.Split("::");
            var handlerAsmPath = $"{args[1]}/{handlerParts[0]}.dll";
            var loader = PluginLoader.CreateFromAssemblyFile(handlerAsmPath);

            using (loader.EnterContextualReflection())
            {
                var handlerAsm = loader.LoadDefaultAssembly();
                var handlerType = handlerAsm.GetType(handlerParts[1], true, true);
                var instance = Activator.CreateInstance(handlerType);
                var methodInfo = handlerType.GetMethod(handlerParts[2]);
                var parameters = methodInfo.GetParameters();
                var parameterValues = new object[parameters.Length];

                // input type
                if (parameters.Length > 0)
                {
                    if (jsonObj != null && jsonObj.ContainsKey("event"))
                    {
                        parameterValues[0] = JsonConvert.DeserializeObject(jsonObj["event"].ToString(), parameters[0].ParameterType);
                    }
                }

                // lambda context if specified
                if (parameters.Length > 1 && parameters[1].ParameterType == typeof(ILambdaContext))
                    parameterValues[1] = new FakeLambdaContext();

                var result = methodInfo.Invoke(instance, parameterValues);
                var resultType = result.GetType();

                if(resultType.IsGenericType && resultType.GetGenericTypeDefinition() == typeof(Task<>))
                {
                    // this is a task, so lets get the result from it so we can serialize the offlin payload
                    result = resultType.GetProperty("Result").GetValue(result);
                }

                var offlinePayloadData = new OfflinePayloadData { __offline_payload__ = result };

                Console.WriteLine(JsonConvert.SerializeObject(offlinePayloadData));
            }
        }

        public class OfflinePayloadData
        {
            public object __offline_payload__ { get; set; }
        }

        public class FakeLambdaContext : ILambdaContext
        {
            private readonly string _name;
            private readonly string _version;
            private readonly DateTime _created;
            private readonly int _timeout;

            public FakeLambdaContext(string name = "Fake", string version = "LATEST", int timeout = 6)
            {
                this._name = name;
                this._version = version;
                this._timeout = timeout;
                this._created = DateTime.UtcNow;
            }

            public string AwsRequestId => "1234567890";

            public IClientContext ClientContext => new FakeClientContext();

            public string FunctionName => this._name;

            public string FunctionVersion => this._version;

            public ICognitoIdentity Identity => new FakeCognitoIdentity();

            public string InvokedFunctionArn => $"arn:aws:lambda:serverless:{this._name}";

            public ILambdaLogger Logger => new FakeLambdaLogger();

            public string LogGroupName => $"/aws/lambda/{this._name}";

            public string LogStreamName => $"{DateTime.Now.ToString("yyyy/MM/dd")}/[${this._version}]58419525dade4d17a495dceeeed44708";

            public int MemoryLimitInMB => 1024;

            public TimeSpan RemainingTime => throw new NotImplementedException();
        }

        public class FakeLambdaLogger : ILambdaLogger
        {
            public void Log(string message)
            {
                Console.WriteLine(message);
            }

            public void LogLine(string message)
            {
                Console.WriteLine(message);
            }
        }

        public class FakeClientContext : IClientContext
        {
            public IDictionary<string, string> Environment => throw new NotImplementedException();

            public IClientApplication Client => throw new NotImplementedException();

            public IDictionary<string, string> Custom => throw new NotImplementedException();
        }

        public class FakeCognitoIdentity : ICognitoIdentity
        {
            public string IdentityId => Guid.Empty.ToString();

            public string IdentityPoolId => Guid.Empty.ToString();
        }
    }
}
