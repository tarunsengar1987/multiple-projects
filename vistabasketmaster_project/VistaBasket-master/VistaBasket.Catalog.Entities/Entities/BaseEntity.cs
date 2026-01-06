using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VistaBasket.Catalog.Entities.Entities
{
    public class BaseEntity
    {
        [Key]
        [Column("id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [DefaultValue("00000000-0000-0000-0000-000000000000")]
        public Guid Id { get; set; }

        [Column("createdon"), DataType(DataType.Date), Required]
        public DateTime CreatedOn { get; set; }

        [Column("updatedby"), StringLength(100)]
        public string? UpdatedBy { get; set; }

        [Column("createdby"), Required, StringLength(100)]
        public string? CreatedBy { get; set; }

        [Column("updatedon"), DataType(DataType.Date)]
        public DateTime? UpdatedOn { get; set; }

        [Column("isactive")]
        public bool IsActive { get; set; }
    }
}
