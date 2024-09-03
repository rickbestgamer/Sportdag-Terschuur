using Microsoft.AspNetCore.Mvc.RazorPages;
using Sportdag_Terschuur.Classes;

namespace Sportdag_Terschuur.Pages.Templates.Admin
{
    public class ActivityTemplateModel : PageModel
    {
        public required SDActivity Activity { get; set; }

        public void OnGet()
        {
        }
    }
}
