using Microsoft.AspNetCore.Mvc.RazorPages;
using Sportdag_Terschuur.Classes;

namespace Sportdag_Terschuur.Pages.Templates.Admin
{
    public class TrainerCardTemplateModel : PageModel
    {
        public required SDUser Trainer { get; set; }

        public void OnGet()
        {
        }
    }
}
