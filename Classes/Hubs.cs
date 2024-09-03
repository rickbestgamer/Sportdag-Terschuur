using Microsoft.AspNetCore.SignalR;
using Razor.Templating.Core;
using Sportdag_Terschuur.Pages.Templates.Admin;
using System.Diagnostics;

namespace Sportdag_Terschuur.Classes
{
    public enum Roles
    {
        admin,
        user,
    }

    public class SportdagHub(IHttpContextAccessor _httpContextAccessor) : Hub
    {
        public IHttpContextAccessor HTTPContext = _httpContextAccessor;
        public async Task<bool> Connect()
        {
            if (HTTPContext.HttpContext == null || HTTPContext.HttpContext.Session == null) return false;
            int? role = HTTPContext.HttpContext.Session.GetInt32("Role");
            if (role == null) return false;
            if ((int)Roles.admin == role) await Groups.AddToGroupAsync(Context.ConnectionId, Convert.ToString(Roles.admin)!);
            if ((int)Roles.user == role) await Groups.AddToGroupAsync(Context.ConnectionId, Convert.ToString(Roles.user)!);
            return true;
        }

        public bool CheckRole(Roles role)
        {
            if (HTTPContext.HttpContext == null || HTTPContext.HttpContext.Session == null) return false;

            Roles? user = (Roles?)HTTPContext.HttpContext.Session.GetInt32("Role");

            return user != null && user == role;
        }
    }


    public class ActivityHub(IHttpContextAccessor _httpContextAccessor) : SportdagHub(_httpContextAccessor)
    {

    }

    public class TeamHub(IHttpContextAccessor _httpContextAccessor, TeamService service) : SportdagHub(_httpContextAccessor)
    {
        public async Task<object> Create(string name)
        {
            if (CheckRole(Roles.admin))
            {
                SDTeam team = new();
                try
                {
                    object result = service.Create(team, name);
                    await service.Save();
                    await Clients.Group(Convert.ToString(Roles.admin)!).SendAsync("ServerAdd", RazorTemplateEngine.RenderPartialAsync("/Pages/Templates/Admin/TeamCardTemplate.cshtml", new TeamCardTemplateModel() { Team = team }));
                    return result;
                }
                catch
                {
                    return new { Status = false };
                }
            }
            return new { Status = false };
        }

        public async Task<object> Update(int teamID, string name)
        {
            if (CheckRole(Roles.admin))
            {
                await Clients.All.SendAsync("ServerUpdate", teamID, name);
                return await service.Update(teamID, name);
            }
            return new { Status = false };
        }

        public async Task<object> Delete(int id)
        {
            if (CheckRole(Roles.admin))
            {
                await Clients.All.SendAsync("ServerDelete", id);
                return await service.Delete(id);
            }
            return new { Status = false };
        }
    }

    public class TrainerHub(IHttpContextAccessor _httpContextAccessor, TrainerService service) : SportdagHub(_httpContextAccessor)
    {
        public async Task<object> Create(string name, byte role, int? teamID)
        {
            Debug.WriteLine("");
            Debug.WriteLine("create");
            Debug.WriteLine("");
            if (CheckRole(Roles.admin))
            {
                SDUser user = new();
                try
                {
                    object result = await service.Create(user, name, role, teamID);
                    await service.Save();
                    await Clients.Group(Convert.ToString(Roles.admin)!).SendAsync("ServerAdd", RazorTemplateEngine.RenderPartialAsync("/Pages/Templates/Admin/TrainerCardTemplate.cshtml", new TrainerCardTemplateModel() { Trainer = user }));
                    return result;
                }
                catch
                {
                    return new { Status = false };
                }
            }

            return new { Status = false };
        }

        public async Task<object> Update(int trainerID, string name, byte role, int? teamID)
        {
            if (CheckRole(Roles.admin))
            {
                await Clients.All.SendAsync("ServerUpdate", trainerID, name, role, teamID);
                return await service.Update(trainerID, name, role, teamID);
            }
            return new { Status = false };
        }

        public async Task<object> Delete(int id)
        {
            if (CheckRole(Roles.admin))
            {
                await Clients.All.SendAsync("ServerDelete", id);
                return await service.Delete(id);
            }
            return new { Status = false };
        }
    }

    public class RoundHub(IHttpContextAccessor _httpContextAccessor) : SportdagHub(_httpContextAccessor)
    {

    }

    public class MemberHub(IHttpContextAccessor _httpContextAccessor, TeamMemberService service) : SportdagHub(_httpContextAccessor)
    {
        public async Task<object> Create(string firstName, string lastName, int? teamID)
        {
            if (CheckRole(Roles.admin))
            {
                SDTeamMember member = new();
                object result = await service.Create(member, firstName, lastName, teamID);
                Debug.WriteLine(result);
                await service.Save();
                await Clients.Group(Convert.ToString(Roles.admin)!).SendAsync("ServerAdd", RazorTemplateEngine.RenderPartialAsync("/Pages/Templates/Admin/MemberCardTemplate.cshtml", new MemberCardTemplateModel() { Member = member }));
                //await Clients.Group(Convert.ToString(Roles.user)!).SendAsync("ServerAdd");
                return result;
            }

            return new { Status = false };
        }

        public async Task<object> Update(int memberID, bool present, string firstName, string lastName, int teamID)
        {
            int? userId = HTTPContext.HttpContext!.Session.GetInt32("IdUser");
            SDUser? user = await service.FindUser(userId);

            if (CheckRole(Roles.admin))
            {
                await Clients.All.SendAsync("ServerUpdate", memberID, present, firstName, lastName, teamID);
                return await service.Update(memberID, teamID, firstName, lastName, present);
            }
            else if (CheckRole(Roles.user) && user != null && user.SDTeam_idTeam == teamID)
            {
                await Clients.All.SendAsync("ServerUpdate", memberID, present);
                return await service.Update(memberID, present);
            }
            return new { Status = false };
        }

        public async Task<object> Delete(int memberID)
        {
            if (CheckRole(Roles.admin))
            {
                await Clients.All.SendAsync("ServerDelete", memberID);
                return await service.Delete(memberID);
            }
            return new { Status = false };
        }
    }
}
