using System.IO;

namespace Example
{
    public class LambdaRequest
    {
        public string body { get; set; }
    }

    public class LambdaResponse
    {
        public int statusCode { get; set; }
        public string body { get; set; }
    }

    public class Hello
    {
        public LambdaResponse MyHandler(LambdaRequest request)
        {
            return new LambdaResponse
            {
                statusCode = 200,
                body = "{\"message\": \"Hello from .NET Core 3.1!\"}"
            };
        }
    }
}
