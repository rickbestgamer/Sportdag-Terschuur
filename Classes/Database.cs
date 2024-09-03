using Microsoft.EntityFrameworkCore;
using Razor.Templating.Core;
using Sportdag_Terschuur.Pages.Templates.Admin;

namespace Sportdag_Terschuur.Classes
{
    public class SportdagDB(DbContextOptions<SportdagDB> options) : DbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SDActivity>().HasKey(a => a.IdActivity);
            modelBuilder.Entity<SDTeam>().HasKey(t => t.IdTeam);
            modelBuilder.Entity<SDUser>().HasKey(u => u.IdUser);
            modelBuilder.Entity<SDUser>().HasOne(u => u.SDTeam).WithMany(t => t.SDUsers).HasForeignKey(u => u.SDTeam_idTeam);
            modelBuilder.Entity<SDTeamMember>().HasKey(tm => tm.IdTeamMember);
            modelBuilder.Entity<SDTeamMember>().HasOne(tm => tm.SDTeam).WithMany(t => t.SDTeamMembers).HasForeignKey(tm => tm.Team_IdTeam);
            modelBuilder.Entity<SDRound>().HasKey(r => r.IdRound);
            modelBuilder.Entity<SDRound>().HasOne(r => r.SDActivity).WithMany().HasForeignKey(r => r.SDActivity_IdActivity);
            modelBuilder.Entity<SDRound>().HasOne(r => r.SDTeamMember).WithMany().HasForeignKey(r => r.SDTeamMember_IdTeamMember);
        }

        public DbSet<SDTeam> SDTeam { get; set; }
        public DbSet<SDUser> SDUser { get; set; }
        public DbSet<SDTeamMember> SDTeamMember { get; set; }
        public DbSet<SDActivity> SDActivity { get; set; }
        public DbSet<SDRound> SDRound { get; set; }

        public SDUser? CheckUser(string userName, string password)
        {
            return SDUser.First(user => user.UserName == userName && user.UserPassword == Functions.HashPassword(password));
        }

        public async Task<SDTeam?> FindTeam(int? id)
        {
            return await SDTeam.Include(t => t.SDUsers).Include(t => t.SDTeamMembers).FirstOrDefaultAsync(t => t.IdTeam == id);
        }

        public async Task<SDUser?> FindUser(int? id)
        {
            return await SDUser.Include(u => u.SDTeam).FirstOrDefaultAsync(u => u.IdUser == id);
        }

        public async Task<SDTeamMember?> FindMember(int? ID)
        {
            return await SDTeamMember.Include(tm => tm.SDTeam).FirstOrDefaultAsync(tm => tm.IdTeamMember == ID);
        }

        public async Task<object> CreateActivity(double X, double Y, string Label, byte Type)
        {
            SDActivity activity = new();
            SDActivity.Add(activity);
            await SetActivity(activity, X, Y, Label, Type);
            ActivityTemplateModel template = new() { Activity = activity };
            return new { status = true, id = activity.IdActivity, element = RazorTemplateEngine.RenderPartialAsync("~/Templates/ActivityTemplate.cshtml", template) };
        }

        public async Task<object> UpdateActivity(double X, double Y, string Label, byte Type, int ID)
        {
            SDActivity? activity = await SDActivity.FindAsync(ID);

            if (activity == null) return new { Status = true };

            await SetActivity(activity, X, Y, Label, Type);
            return new { Status = false };
        }

        public async Task<object> DeleteActivity(int ID)
        {
            SDActivity? activity = await SDActivity.FindAsync(ID);

            if (activity == null) return new { Status = false };

            SDActivity.Remove(activity);
            await SaveChangesAsync();
            return new { Status = true };

        }

        private async Task SetActivity(SDActivity activity, double X, double Y, string Label, byte Type)
        {
            activity.PointX = X;
            activity.PointY = Y;
            activity.ActivityName = Label;
            activity.Type = Type;
            await SaveChangesAsync();
        }
    }

    public class SDTeam
    {
        public int IdTeam { get; set; }
        public string TeamName { get; set; } = string.Empty;

        public ICollection<SDUser> SDUsers { get; set; } = [];
        public ICollection<SDTeamMember> SDTeamMembers { get; set; } = [];

        public void Set(string name)
        {
            TeamName = name;
        }
    }

    public class TeamService(SportdagDB DB)
    {
        public object Create(SDTeam team, string name)
        {
            DB.SDTeam.Add(team);
            team.Set(name);
            return new { Status = true };
        }

        public async Task<object> Update(int teamID, string name)
        {
            SDTeam? team = await DB.FindTeam(teamID);

            if (team == null) return new { Status = false };

            team.Set(name);

            await DB.SaveChangesAsync();

            return new { Status = true };
        }

        public async Task<object> Delete(int id)
        {
            SDTeam? team = await DB.FindTeam(id);

            if (team == null) return new { Status = false };

            foreach (SDTeamMember member in team.SDTeamMembers)
            {
                member.SDTeam = null;
            }

            foreach (SDUser member in team.SDUsers)
            {
                member.SDTeam = null;
            }

            DB.SDTeam.Remove(team);

            await DB.SaveChangesAsync();

            return new { Status = true };
        }

        public async Task Save()
        {
            await DB.SaveChangesAsync();
        }
    }

    public class SDUser
    {
        public int IdUser { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string UserPassword { get; set; } = string.Empty;
        public byte Role { get; set; }

        public int? SDTeam_idTeam { get; set; }
        public SDTeam? SDTeam { get; set; }

        public void Set(string userName, byte role, SDTeam? team)
        {
            UserName = userName;
            UserPassword = Functions.HashPassword(userName);
            Role = role;
            SDTeam = team;
        }
    }

    public class TrainerService(SportdagDB DB)
    {
        public async Task<object> Create(SDUser user, string name, byte role, int? teamID)
        {
            SDTeam? team = await DB.FindTeam(teamID);

            DB.SDUser.Add(user);
            user.Set(name, role, team);
            return new { Status = true };
        }

        public async Task<object> Update(int userID, string name, byte role, int? teamID)
        {
            SDUser? user = await DB.SDUser.Include(u => u.SDTeam).FirstOrDefaultAsync(u => u.IdUser == userID);

            if (user == null) return new { Status = false };

            SDTeam? team = await DB.FindTeam(teamID);

            user.Set(name, role, team);

            await DB.SaveChangesAsync();

            return new { Status = true };
        }

        public async Task<object> Delete(int id)
        {
            SDUser? user = await DB.FindUser(id);

            if (user == null) return new { Status = false };

            DB.SDUser.Remove(user);

            await DB.SaveChangesAsync();

            return new { Status = true };
        }

        public async Task Save()
        {
            await DB.SaveChangesAsync();
        }
    }

    public class SDTeamMember
    {
        public int IdTeamMember { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public bool Present { get; set; }

        public int? Team_IdTeam { get; set; }
        public SDTeam? SDTeam { get; set; }

        public void Set(string firstName, string lastName, bool present, SDTeam? team)
        {
            FirstName = firstName;
            LastName = lastName;
            Present = present;
            SDTeam = team;
        }

        public void Set(bool present)
        {
            Present = present;
        }
    }

    public class TeamMemberService(SportdagDB DB)
    {
        public async Task<object> Create(SDTeamMember member, string firstName, string lastName, int? teamID)
        {
            SDTeam? team = await DB.FindTeam(teamID);

            DB.SDTeamMember.Add(member);
            member.Set(firstName, lastName, true, team);

            return new { Status = true };
        }

        public async Task<object> Update(int memberID, int teamID, string firstName, string lastName, bool present)
        {
            SDTeamMember? member = await DB.SDTeamMember.Include(m => m.SDTeam).FirstOrDefaultAsync(m => m.IdTeamMember == memberID);

            if (member == null) return new { Status = false };

            SDTeam? team = await DB.FindTeam(teamID);

            member.Set(firstName, lastName, present, team);

            await DB.SaveChangesAsync();

            return new { Status = true };
        }

        public async Task<object> Update(int memberID, bool present)
        {
            SDTeamMember? member = await DB.FindMember(memberID);

            if (member == null) return new { Status = false };

            member.Set(present);
            await DB.SaveChangesAsync();
            return new { Status = true };
        }

        public async Task<object> Delete(int memberID)
        {
            SDTeamMember? member = await DB.FindMember(memberID);

            if (member == null) return new { Status = false };

            DB.SDTeamMember.Remove(member);

            await DB.SaveChangesAsync();
            return new { Status = true };
        }

        public async Task Save()
        {
            await DB.SaveChangesAsync();
        }

        public async Task<SDUser?> FindUser(int? id)
        {
            return await DB.FindUser(id);
        }
    }

    public class SDActivity
    {
        public int IdActivity { get; set; }
        public string ActivityName { get; set; } = string.Empty;
        public byte Type { get; set; }
        public double? PointX { get; set; }
        public double? PointY { get; set; }
    }

    public class SDRound
    {
        public int IdRound { get; set; }
        public byte RoundNumber { get; set; }
        public int? Point { get; set; }
        public TimeSpan? Time { get; set; }

        public int SDActivity_IdActivity { get; set; }
        public int SDTeamMember_IdTeamMember { get; set; }
        public required SDActivity SDActivity { get; set; }
        public required SDTeamMember SDTeamMember { get; set; }
    }
}
