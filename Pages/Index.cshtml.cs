using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Sportdag_Terschuur.Classes;

namespace Sportdag_Terschuur.Pages
{
    public class IndexModel(SportdagDB SportdagDB) : PageModel
    {
        public IActionResult OnGet()
        {
            if (Functions.CheckCookies(HttpContext, SportdagDB)) return RedirectToPage("Admin");
            return Page();
        }

        public IActionResult OnPost()
        {
            SDUser? user = SportdagDB.CheckUser(Login.UserName, Login.Password);

            if (!ModelState.IsValid || user == null)
            {
                return Page();
            }

            CookieOptions cookie = new()
            {
                Expires = DateTime.Now.AddYears(10)
            };
            Response.Cookies.Append("Name", user.UserName, cookie);
            Response.Cookies.Append("Password", user.UserPassword, cookie);

            HttpContext.Session.SetInt32("Role", user.Role);
            HttpContext.Session.SetInt32("IdUser", user.IdUser);

            return RedirectToPage("Admin");
        }

        [BindProperty]
        public LoginForm Login { get; set; } = new();

        public class LoginForm
        {
            public string UserName { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }
    }
}
