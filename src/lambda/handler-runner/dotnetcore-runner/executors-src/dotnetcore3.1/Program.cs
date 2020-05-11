using System;
using System.Reflection;
using System.Collections;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace dotnetcore3._1
{
    class Program
    {
        static void Main(string[] args)
        {
            // foreach(DictionaryEntry env in Environment.GetEnvironmentVariables())
            // {
            //     Console.WriteLine($"{env.Key}:{env.Value}");
            // }

            // foreach (var arg in args)
            // {
            //     Console.WriteLine($"ARG: {arg}");
            // }
            Console.WriteLine("starting");
            var asm = Assembly.LoadFile(args[1]);
            Console.WriteLine("asm loaded");
            var handler = args[0];
            Console.WriteLine($"Handler: {handler}");
            var handlerParts = handler.Split("::");
            Console.WriteLine($"Parts: {handlerParts.Length}");
            var handlerType = asm.GetTypes().ToList().FirstOrDefault(x => x.Name.ToLower() == handlerParts[1].ToLower());
            Console.WriteLine($"Type: {handlerType}");
            var instance = asm.CreateInstance(handlerType.FullName, true);
            Console.WriteLine($"instance is valid? {instance != null}");
            var methodInfo = handlerType.GetMethod(handlerParts[2]);
            Console.WriteLine($"method is valid? {methodInfo != null}");
            Console.WriteLine($"method name: {methodInfo.Name}");
            var result = methodInfo.Invoke(instance, new object[] { null });
            Console.WriteLine($"result is valid? {result != null}");
            var json = JsonSerializer.Serialize(result);

            Console.WriteLine(json);
        }
    }
}
