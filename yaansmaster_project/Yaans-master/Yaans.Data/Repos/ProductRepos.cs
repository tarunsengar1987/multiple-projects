using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Yaans.Data.Context;
using Yaans.Data.Interfaces;
using Yaans.Domain.Models;

namespace Yaans.Data.Repos
{
    public class ProductRepos : GenericRepository<Product>, IProductRepos
    {
        private readonly YaansDBContext dbContext;

        public ProductRepos(YaansDBContext dbContext) : base(dbContext)
        {
            this.dbContext = dbContext;
        }

        public IEnumerable<Product> GettopProducts(int count)
        {
            var items = dbContext.Products.ToList();
            return items;
        }

        public async Task<bool> UploadImageAsync(IFormFile image)
        {
            var file = image;
            var folderName = Path.Combine("Resources", "Images");
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            if (file.Length > 0)
            {
                var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                var fullPath = Path.Combine(pathToSave, fileName);
                var dbPath = Path.Combine(folderName, fileName);
                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    file.CopyTo(stream);
                }
                return true;
            }
            return false;
        }
    }
}
