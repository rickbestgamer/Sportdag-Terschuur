using Microsoft.AspNetCore.SignalR;
using System.Data;

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
            Dictionary<Roles, string> roles = new()
            {
                { Roles.admin, nameof(Roles.admin)},
                { Roles.user, nameof(Roles.user)},
            };

            foreach (var role in roles)
            {
                if (CheckRole(role.Key)) { await Groups.AddToGroupAsync(Context.ConnectionId, nameof(Roles.admin)!); return true; };
            }
            return false;
        }

        public bool CheckRole(Roles role) =>
             (Roles?)HTTPContext.HttpContext?.Session.GetInt32("Role") == role;

        protected bool IsAdmin() => CheckRole(Roles.admin);
        protected bool IsUser() => CheckRole(Roles.user);

        protected async Task<object> HandleCreate<T>(Func<T> createFunc, Func<T, object> clientMessage)
        {
            if (!IsAdmin()) return new { Status = false };

            T item = createFunc();
            await Clients.All.SendAsync("Create", clientMessage(item));
            return new { Status = true };
        }

        protected async Task<object> HandleCreate<T>(Func<Task<T>> createFunc, Func<T, object> clientMessage)
        {
            if (!IsAdmin()) return new { Status = false };

            T item = await createFunc();
            await Clients.All.SendAsync("Create", clientMessage(item));
            return new { Status = true };
        }

        protected async Task<object> HandleReview(Func<object> reviewFunc)
        {
            if (!IsAdmin() && !IsUser()) return new { Status = false };

            await Clients.Caller.SendAsync("Review", reviewFunc());
            return new { Status = true };
        }

        protected async Task<object> HandleUpdate<T>(Func<Task<T?>> updateFunc, Func<T, object> clientMessage)
        {
            if (IsAdmin()) return new { Status = false };

            T? item = await updateFunc();
            if (item == null) return new { Status = false };

            await Clients.All.SendAsync("Update", clientMessage(item));
            return new { Status = true };
        }

        protected async Task<object> HandleDelete(Func<int, Task<bool>> deleteFunc, int id)
        {
            bool result = await deleteFunc(id);
            if (!result) return new { Status = false };

            await Clients.All.SendAsync("Delete", new { ID = id });
            return new { Status = false };
        }

        public record DeleteResult(bool Result);
    }


    public class ActivityHub(IHttpContextAccessor _httpContextAccessor) : SportdagHub(_httpContextAccessor)
    {

    }

    public class TeamHub(IHttpContextAccessor _httpContextAccessor, TeamService service) : SportdagHub(_httpContextAccessor)
    {
        private static object CreateTeam(SDTeam team) => new
        {
            team.ID,
            team.Name,
            SDUsers = team.SDUsers.Select(u => new
            {
                u.ID,
                u.Name
            }).ToArray(),
            SDTeamMembers = team.SDTeamMembers.Select(m => new
            {
                m.ID,
                m.FirstName,
                m.LastName
            }).ToArray()
        };

        public async Task<object> Create(string name) =>
            await HandleCreate(() => service.Create(name), CreateTeam);

        public async Task<object> Review() =>
            await HandleReview(service.Review);

        public async Task<object> Update(int id, string name, int[] members, int[] users) =>
            await HandleUpdate(() => service.Update(id, name, members, users), CreateTeam);

        public async Task<object> AddMember(int teamID, int memberID) =>
            await HandleUpdate(() => service.AddMember(teamID, memberID), CreateTeam);

        public async Task<object> RemoveMember(int teamID, int memberID) =>
            await HandleUpdate(() => service.RemoveMember(teamID, memberID), CreateTeam);

        public async Task<object> AddUser(int teamID, int userID) =>
            await HandleUpdate(() => service.AddUser(teamID, userID), CreateTeam);

        public async Task<object> RemoveUser(int teamID, int userID) =>
            await HandleUpdate(() => service.RemoveUser(teamID, userID), CreateTeam);

        public async Task<object> Delete(int id) =>
            await HandleDelete(service.Delete, id);
    }

    public class TrainerHub(IHttpContextAccessor _httpContextAccessor, TrainerService service) : SportdagHub(_httpContextAccessor)
    {
        private static object CreateTrainer(SDUser user) => new
        {
            user.ID,
            user.Name,
            user.Role,
            user.SDTeam_ID,
            SDTeam_Name = user.SDTeam?.Name
        };

        public async Task<object> Create(string name, bool role, int? teamID) =>
            await HandleCreate(async () => await service.Create(name, role, teamID), CreateTrainer);

        public async Task<object> Review() =>
            await HandleReview(service.Review);

        public async Task<object> Update(int id, string name, bool role, int? teamID) =>
            await HandleUpdate(() => service.Update(id, name, role, teamID), CreateTrainer);

        public async Task<object> Delete(int id) =>
            await HandleDelete(service.Delete, id);
    }

    public class RoundHub(IHttpContextAccessor _httpContextAccessor) : SportdagHub(_httpContextAccessor)
    {

    }

    public class MemberHub(IHttpContextAccessor _httpContextAccessor, TeamMemberService service) : SportdagHub(_httpContextAccessor)
    {
        private static object CreateMember(SDTeamMember member) => new
        {
            member.ID,
            member.FirstName,
            member.LastName,
            member.Present,
            member.SDTeam_ID,
            SDTeam_Name = member.SDTeam?.Name
        };

        public async Task<object> Create(string firstName, string lastName, int? teamID) =>
            await HandleCreate(() => service.Create(firstName, lastName, teamID), CreateMember);

        public async Task<object> Review() =>
            await HandleReview(service.Review);

        public async Task<object> Update(int id, bool present, string firstName, string lastName, int teamID) =>
            await HandleUpdate(() => service.Update(id, teamID, firstName, lastName, present), CreateMember);

        public async Task<object> Delete(int id) =>
            await HandleDelete(service.Delete, id);
    }
}
