using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Yaans.Domain.Models
{
    public class Category : BaseEntity
    {
        public int Id { get; set; }
        [MaxLength(100)]
        [Required]
        public string CategoryName { get; set; }
        public List<Product> Products { get; set; }
    }
}
