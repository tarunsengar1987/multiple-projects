using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Yaans.Domain.Models
{
    public abstract class BaseEntity
    {
        public string CreatedBy { get; set; }

        public DateTime CreatedOn { get; set; }

        public string UpdatedBy { get; set; }

        public DateTime? UpdatedOn { get; set; }

        public bool IsActive { get; set; }

        public int? SortOrder { get; set; }
        [NotMapped]
        public string TimezoneOffset { get; set; }

    }

}
