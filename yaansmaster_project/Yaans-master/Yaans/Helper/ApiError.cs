using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace Yaans.Helper
{
    public class ApiError
    {
        public ApiError(int httpErrorCode, Exception ex)
        {
            ErrorCode = httpErrorCode;
            ErrorMessage = ex.Message;
            ErrorDetails = ex.StackTrace;
            Source = ex.Source;
            InnerException = ex.InnerException?.Message;
        }

        public int ErrorCode { get; set; }
        public string ErrorMessage { get; set; }
        public string InnerException { get; set; }
        public string Source { get; set; }
        public string ErrorDetails { get; set; }
        public override string ToString()
        {
            var options = new JsonSerializerOptions()
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };
            return JsonSerializer.Serialize(this,options);
        }
    }
}
