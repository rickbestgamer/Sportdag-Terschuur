using Microsoft.AspNetCore.Mvc.RazorPages;
using Sportdag_Terschuur.Classes;

namespace Sportdag_Terschuur.Pages.Templates.Admin
{
    public class MemberCardTemplateModel() : PageModel
    {
        public required SDTeamMember Member { get; set; }

        public void OnGet()
        {
        }
    }
}
