using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Sportdag_Terschuur.Classes;
using System.Globalization;

namespace Sportdag_Terschuur.Pages
{
    public class AdminModel(SportdagDB SportdagDB) : PageModel
    {
        public IList<SDActivity> Activities = [];
        public IList<SDRound> Rounds = [];
        public IList<SDUser> Users = [];
        public IList<SDTeam> Teams = [];
        public IList<SDTeamMember> Members = [];

        public void OnGet()
        {
            Functions.CheckCookies(HttpContext, SportdagDB);
            Activities = [.. SportdagDB.SDActivity];
            Rounds = [.. SportdagDB.SDRound];
            Users = [.. SportdagDB.SDUser];
            Teams = [.. SportdagDB.SDTeam];
            Members = [.. SportdagDB.SDTeamMember];
        }

        public async Task<IActionResult> OnGetUpdateActivity(string Statement, string X, string Y, string Label, byte Type, int ID)
        {
            double x = double.Parse(X, CultureInfo.InvariantCulture);
            double y = double.Parse(Y, CultureInfo.InvariantCulture);
            object result = new { status = false };
            if (Statement == "create")
            {
                result = await SportdagDB.CreateActivity(x, y, Label, Type);
            }
            if (Statement == "update")
            {
                result = await SportdagDB.UpdateActivity(x, y, Label, Type, ID);
            }
            if (Statement == "delete")
            {
                result = await SportdagDB.DeleteActivity(ID);
            }
            return new JsonResult(result);
        }
    }
}
