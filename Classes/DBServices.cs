using System.Linq.Expressions;

namespace Sportdag_Terschuur.Classes
{
    public abstract class BaseService<T>(SportdagDB DB) where T : class
    {
        public async Task<T> HandleCreate(Action<T> createAction)
        {
            T entety = Activator.CreateInstance<T>();
            createAction(entety);
            DB.Set<T>().Add(entety);
            await Save();
            return entety;
        }

        public TResult[] HandleReview<TResult>(Expression<Func<T, TResult>> projection) =>
            [.. DB.Set<T>().Select(projection)];

        public async Task<T?> HandleUpdate(int id, Action<T> updateAction)
        {
            T? entity = await DB.Set<T>().FindAsync(id);
            if (entity == null) return null;

            updateAction(entity);
            await Save();
            return entity;
        }

        public async Task<bool> HandleDelete(int id)
        {
            T? entity = await DB.Set<T>().FindAsync(id);
            if (entity == null) return false;

            DB.Set<T>().Remove(entity);
            await Save();
            return true;
        }

        public async Task<bool> HandleDelete(int id, Action<T>? deleteAction)
        {
            T? entity = await DB.Set<T>().FindAsync(id);
            if (entity == null) return false;

            deleteAction?.Invoke(entity);

            DB.Set<T>().Remove(entity);
            await Save();
            return true;
        }

        public async Task Save() =>
            await DB.SaveChangesAsync();
    }

    public class TeamService(SportdagDB DB) : BaseService<SDTeam>(DB)
    {
        public async Task<SDTeam> Create(string name) =>
            await HandleCreate(team => { team.Set(name, [], [], DB); });

        public object[] Review() =>
            HandleReview(team => new
            {
                team.ID,
                team.Name,
                SDUsers = team.SDUsers.Select(u => new { u.ID, u.Name }).ToArray(),
                SDTeamMembers = team.SDTeamMembers.Select(m => new { m.ID, m.FirstName, m.LastName }).ToArray()
            });

        public async Task<SDTeam?> Update(int teamID, string name, int[] users, int[] members) =>
            await HandleUpdate(teamID, team => team.Set(name, users, members, DB));

        public async Task<SDTeam?> AddUser(int teamID, int userID) =>
            await HandleUpdate(teamID, team => team.SetMembers(team.SDTeamMembers.Select(m => m.ID).Append(userID).ToArray(), DB));

        public async Task<SDTeam?> RemoveUser(int teamID, int userID) =>
            await HandleUpdate(teamID, team => team.SetMembers(team.SDTeamMembers.Where(m => m.ID != userID).Select(m => m.ID).ToArray(), DB));

        public async Task<SDTeam?> AddMember(int teamID, int memberID) =>
            await HandleUpdate(teamID, team => team.SetMembers(team.SDTeamMembers.Select(m => m.ID).Append(memberID).ToArray(), DB));

        public async Task<SDTeam?> RemoveMember(int teamID, int memberID) =>
            await HandleUpdate(teamID, team => team.SetMembers(team.SDTeamMembers.Where(m => m.ID != memberID).Select(m => m.ID).ToArray(), DB));

        public async Task<bool> Delete(int id) =>
            await HandleDelete(id, team =>
            {
                foreach (SDTeamMember member in team.SDTeamMembers)
                {
                    member.SDTeam = null;
                }

                foreach (SDUser member in team.SDUsers)
                {
                    member.SDTeam = null;
                }
            });
    }

    public class TrainerService(SportdagDB DB) : BaseService<SDUser>(DB)
    {
        public async Task<SDUser> Create(string name, bool role, int? teamID) =>
            await HandleCreate(async user =>
                await user.Set(name, role, teamID, DB));

        public object[] Review() =>
            HandleReview(user => new
            {
                user.ID,
                user.Name,
                user.Role,
                user.SDTeam_ID,
                SDTeam_Name = user.SDTeam != null ? user.SDTeam.Name : null
            });

        public async Task<SDUser?> Update(int userID, string name, bool role, int? teamID) =>
            await HandleUpdate(userID, async user =>
                await user.Set(name, role, teamID, DB));

        public async Task<bool> Delete(int id) =>
            await HandleDelete(id);
    }

    public class TeamMemberService(SportdagDB DB) : BaseService<SDTeamMember>(DB)
    {
        public async Task<SDTeamMember> Create(string firstName, string lastName, int? teamID) =>
            await HandleCreate(async member =>
                await member.Set(firstName, lastName, true, teamID, DB));

        public object[] Review() =>
            HandleReview(member => new
            {
                member.ID,
                member.FirstName,
                member.LastName,
                member.Present,
                member.SDTeam_ID,
                SDTeam_Name = member.SDTeam != null ? member.SDTeam.Name : null
            });

        public async Task<SDTeamMember?> Update(int memberID, int teamID, string firstName, string lastName, bool present) =>
                await HandleUpdate(memberID, async member => await member.Set(firstName, lastName, present, teamID, DB));

        public async Task<SDTeamMember?> Update(int memberID, bool present) =>
            await HandleUpdate(memberID, member => member.Set(present));

        public async Task<bool> Delete(int memberID) =>
            await HandleDelete(memberID);
    }
}
