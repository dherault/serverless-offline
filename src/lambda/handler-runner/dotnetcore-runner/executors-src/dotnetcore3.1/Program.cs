using System;
using System.Reflection;
using System.Collections;
using System.Linq;
using Newtonsoft.Json;

namespace dotnetcore3._1
{
    class Program
    {
        static void Main(string[] args)
        {
            var asm = Assembly.LoadFile(args[1]);
            var handler = args[0];
            var handlerParts = handler.Split("::");
            var handlerType = asm.GetTypes().ToList().FirstOrDefault(x => x.Name.ToLower() == handlerParts[1].ToLower());
            var instance = asm.CreateInstance(handlerType.FullName, true);
            var methodInfo = handlerType.GetMethod(handlerParts[2]);
            var result = methodInfo.Invoke(instance, new object[] { null });
            var offlinePayloadData = new OfflinePayloadData { __offline_payload__ = result };

            Console.WriteLine(JsonConvert.SerializeObject(offlinePayloadData));
        }

        public class OfflinePayloadData
        {
            public object __offline_payload__ { get; set; }
        }
    }
}
