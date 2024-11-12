using Microsoft.EntityFrameworkCore;
using Razor.Templating.Core;
using Sportdag_Terschuur.Pages.Templates.Admin;
using System.Net;

namespace Sportdag_Terschuur.Classes
{
    public class SportdagDB(DbContextOptions<SportdagDB> options) : DbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SDActivity>().HasKey(a => a.ID);
            modelBuilder.Entity<SDTeam>().HasKey(t => t.ID);
            modelBuilder.Entity<SDUser>().HasKey(u => u.ID);
            modelBuilder.Entity<SDUser>().HasOne(u => u.SDTeam).WithMany(t => t.SDUsers).HasForeignKey(u => u.SDTeam_ID);
            modelBuilder.Entity<SDTeamMember>().HasKey(tm => tm.ID);
            modelBuilder.Entity<SDTeamMember>().HasOne(tm => tm.SDTeam).WithMany(t => t.SDTeamMembers).HasForeignKey(tm => tm.SDTeam_ID);
            modelBuilder.Entity<SDRound>().HasKey(r => r.ID);
            modelBuilder.Entity<SDRound>().HasOne(r => r.SDActivity).WithMany().HasForeignKey(r => r.SDActivity_ID);
            modelBuilder.Entity<SDRound>().HasOne(r => r.SDTeamMember).WithMany().HasForeignKey(r => r.SDTeamMember_ID);
        }

        public DbSet<SDTeam> SDTeam { get; set; }
        public DbSet<SDUser> SDUser { get; set; }
        public DbSet<SDTeamMember> SDTeamMember { get; set; }
        public DbSet<SDActivity> SDActivity { get; set; }
        public DbSet<SDRound> SDRound { get; set; }

        public SDUser? CheckUser(string userName, string password)
        {
            return SDUser.First(user => user.Name == userName && user.Password == Functions.HashPassword(password));
        }

        public async Task<SDTeam?> FindTeam(int? id)
        {
            return await SDTeam.Include(t => t.SDUsers).Include(t => t.SDTeamMembers).FirstOrDefaultAsync(t => t.ID == id);
        }

        public async Task<SDUser?> FindUser(int? id)
        {
            return await SDUser.Include(u => u.SDTeam).FirstOrDefaultAsync(u => u.ID == id);
        }

        public async Task<SDTeamMember?> FindMember(int? ID)
        {
            return await SDTeamMember.Include(tm => tm.SDTeam).FirstOrDefaultAsync(tm => tm.ID == ID);
        }

        public async Task<object> CreateActivity(double X, double Y, string Label, byte Type)
        {
            SDActivity activity = new();
            SDActivity.Add(activity);
            await SetActivity(activity, X, Y, Label, Type);
            ActivityTemplateModel template = new() { Activity = activity };
            return new { status = true, id = activity.ID, element = RazorTemplateEngine.RenderPartialAsync("~/Templates/ActivityTemplate.cshtml", template) };
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
            activity.Name = Label;
            activity.Type = Type;
            await SaveChangesAsync();
        }
    }

    public class SDTeam
    {
        public int ID { get; set; }
        public string Name { get; set; } = string.Empty;

        public ICollection<SDUser> SDUsers { get; set; } = [];
        public ICollection<SDTeamMember> SDTeamMembers { get; set; } = [];

        public void Set(string name, int[] users, int[] members, SportdagDB db)
        {
            Name = WebUtility.HtmlEncode(name);

            SetUsers(users, db);
            SetMembers(members, db);
        }

        public void SetUsers(int[] userIDs, SportdagDB db)
        {
            HashSet<int> users = new(userIDs);
            var Targets = db.SDUser.Where(u => users.Contains(u.ID)).ToList();
            var Remove = SDUsers.Where(u => !users.Contains(u.ID)).ToList();
            foreach (var user in Remove)
            {
                SDUsers.Remove(user);
            }
            HashSet<int> existingMembers = SDUsers.Select(m => m.ID).ToHashSet();
            foreach (var user in Targets)
            {
                if (!existingMembers.Contains(user.ID))
                {
                    SDUsers.Add(user);
                }
            }
        }

        public void SetMembers(int[] memberIDs, SportdagDB db)
        {
            HashSet<int> members = new(memberIDs);
            var Targets = db.SDTeamMember.Where(m => members.Contains(m.ID)).ToList();
            var Remove = SDTeamMembers.Where(m => !members.Contains(m.ID)).ToList();
            foreach (var member in Remove)
            {
                SDTeamMembers.Remove(member);
            }
            HashSet<int> existingMembers = SDTeamMembers.Select(m => m.ID).ToHashSet();
            foreach (var member in Targets)
            {
                if (!existingMembers.Contains(member.ID))
                {
                    SDTeamMembers.Add(member);
                }
            }
        }

    }

    public class SDUser
    {
        public int ID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public bool Role { get; set; }

        public int? SDTeam_ID { get; set; }
        public SDTeam? SDTeam { get; set; }

        public async Task Set(string userName, bool role, int? team, SportdagDB db)
        {
            Name = WebUtility.HtmlEncode(userName);
            Password = Functions.HashPassword(userName);
            Role = role;
            SDTeam = await db.FindTeam(team);
        }
    }

    public class SDTeamMember
    {
        public int ID { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public bool Present { get; set; }

        public int? SDTeam_ID { get; set; }
        public SDTeam? SDTeam { get; set; }

        public async Task Set(string firstName, string lastName, bool present, int? team, SportdagDB db)
        {
            FirstName = WebUtility.HtmlEncode(firstName);
            LastName = WebUtility.HtmlEncode(lastName);
            Present = present;
            SDTeam = await db.FindTeam(team);
        }

        public void Set(bool present)
        {
            Present = present;
        }
    }

    public class SDActivity
    {
        public int ID { get; set; }
        public string Name { get; set; } = string.Empty;
        public byte Type { get; set; }
        public double? PointX { get; set; }
        public double? PointY { get; set; }
    }

    public class SDRound
    {
        public int ID { get; set; }
        public byte Number { get; set; }
        public int? Point { get; set; }
        public TimeSpan? Time { get; set; }

        public int SDActivity_ID { get; set; }
        public int SDTeamMember_ID { get; set; }
        public required SDActivity SDActivity { get; set; }
        public required SDTeamMember SDTeamMember { get; set; }
    }
}
