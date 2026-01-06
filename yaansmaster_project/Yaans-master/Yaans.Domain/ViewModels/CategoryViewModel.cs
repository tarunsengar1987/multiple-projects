using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Yaans.Domain.ViewModels
{
    public class CategoryViewModel
    {
        public int Id { get; set; }
        [MaxLength(100)]
        [Required]
        public string CategoryName { get; set; }
    }
}
