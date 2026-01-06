using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VistaBasket.Auth.Entities.Entities
{
    [Table("menu")]
    public class Menu : BaseEntity
    {
        [Column("menuname"), StringLength(50)]
        public string? MenuName { get; set; }

        [Column("menudesc"), StringLength(100)]
        public string? MenuDesc { get; set; }

        [Column("menuorder")]
        public Int16 MenuOrder { get; set; }

        [Column("menuicon"), StringLength(250)]
        public string? MenuIcon { get; set; }
        [Column("routename")]
        public string? RouteName { get; set; }

    }
}
