using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using Yaans.Domain.Models;

namespace Yaans.Domain.ViewModels
{
    public class ProductViewModel
    {
        public int Id { get; set; }
        [MaxLength(100)]
        [Required]
        public string ProductName { get; set; }
        [Required]
        public double Price { get; set; }
        [Required]
        public double Weight { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public int CategoryId { get; set; }
    }
}
