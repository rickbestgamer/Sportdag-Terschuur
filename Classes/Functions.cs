using System.Security.Cryptography;
using System.Text;

namespace Sportdag_Terschuur.Classes
{
    public static class Functions
    {
        public static string HashPassword(string password)
        {
            var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(password.ToLower()));
            return BitConverter.ToString(bytes).Replace("-", "").ToLower();
        }

        public static bool CheckCookies(HttpContext context, SportdagDB db)
        {
            context.Request.Cookies.TryGetValue("Name", out var name);
            context.Request.Cookies.TryGetValue("Password", out var password);

            if (name == null || password == null) return false;

            SDUser? user = db.SDUser.First(user => user.Name == name && user.Password == password);

            if (user == null) return false;

            CookieOptions cookie = new()
            {
                Expires = DateTime.Now.AddYears(10)
            };
            context.Response.Cookies.Append("Name", user.Name, cookie);
            context.Response.Cookies.Append("Password", user.Password, cookie);
            context.Session.SetInt32("Role", user.Role ? 1 : 0);
            context.Session.SetInt32("IdUser", user.ID);
            return true;
        }
    }
}
