using Microsoft.AspNetCore.Mvc.RazorPages;
using Sportdag_Terschuur.Classes;

namespace Sportdag_Terschuur.Pages.Templates.Admin
{
    public class TeamCardTemplateModel : PageModel
    {
        public required SDTeam Team { get; set; }

        public void OnGet()
        {
        }
    }
}
