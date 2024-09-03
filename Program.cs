using Microsoft.EntityFrameworkCore;
using Sportdag_Terschuur.Classes;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();
builder.Services.AddSession();
builder.Services.AddSignalR();
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

builder.Services.AddDbContext<SportdagDB>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"), new MySqlServerVersion(new Version(8, 1, 2))));
builder.Services.AddScoped<TeamMemberService>();
builder.Services.AddScoped<TrainerService>();
builder.Services.AddScoped<TeamService>();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();
app.UseSession();

app.MapRazorPages();

app.MapHub<ActivityHub>("/ActivityHub");
app.MapHub<TeamHub>("/TeamHub");
app.MapHub<TrainerHub>("/TrainerHub");
app.MapHub<RoundHub>("/RoundHub");
app.MapHub<MemberHub>("/MemberHub");

app.Run();
