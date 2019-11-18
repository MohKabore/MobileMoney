using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MobileMoney.API.Data;
using MobileMoney.API.Dtos;
using MobileMoney.API.Models;

namespace MobileMoney.API.Controllers {
    [AllowAnonymous]
    [Route ("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        //  private readonly IMapper _mapper;
        public AuthController (IAuthRepository repo, IConfiguration config, UserManager<User> userManager,
            SignInManager<User> signInManager, IMapper mapper) {
            // _mapper = mapper;
            _signInManager = signInManager;
            _userManager = userManager;
            _config = config;
            _repo = repo;
        }

        [HttpPost ("register")]
        public async Task<IActionResult> Register (UserForRegisterDto userForRegisterDto) {
            userForRegisterDto.UserName = userForRegisterDto.UserName.ToLower ();

            if (await _repo.UserExists (userForRegisterDto.UserName))
                return BadRequest ("Username already exists");

            var userToCreate = new User {
                UserName = userForRegisterDto.UserName
            };

            var createdUser = await _repo.Register (userToCreate, userForRegisterDto.Password);

            return StatusCode (201);
        }

        [HttpPost ("login")]
        public async Task<IActionResult> Login (UserForLoginDto userForLoginDto) {

            // verification de l'existence du userName 
            var user = await _userManager.FindByNameAsync (userForLoginDto.Username.ToLower ());
            if (!user.ValidatedCode)
                return BadRequest ("Compte non validé pour l'instant...");

            var result = await _signInManager
                .CheckPasswordSignInAsync (user, userForLoginDto.Password, false);

            if (result.Succeeded) {
                var appUser = await _userManager.Users.FirstOrDefaultAsync (u => u.NormalizedUserName ==
                    userForLoginDto.Username.ToUpper ());

              //  var userToReturn = _mapper.Map<UserForListDto> (appUser);

                //get the current period
               // Period CurrentPeriod = await _context.Periods.Where (p => p.Active == true).FirstOrDefaultAsync ();

                return Ok (new {
                    token = await GenerateJwtToken (appUser),
                        user = appUser
                      //  currentPeriod = CurrentPeriod
                });
            }

            return BadRequest ("login ou mot de passe incorrecte...");

        }
        private async Task<string> GenerateJwtToken (User user) {
            var claims = new List<Claim> {
                new Claim (ClaimTypes.NameIdentifier, user.Id.ToString ()),
                new Claim (ClaimTypes.Name, user.UserName)
            };

            var roles = await _userManager.GetRolesAsync (user);

            foreach (var role in roles) {
                claims.Add (new Claim (ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey (Encoding.UTF8
                .GetBytes (_config.GetSection ("AppSettings:Token").Value));

            var creds = new SigningCredentials (key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor {
                Subject = new ClaimsIdentity (claims),
                Expires = DateTime.Now.AddDays (1),
                SigningCredentials = creds
            };

            var tokenhandler = new JwtSecurityTokenHandler ();

            var token = tokenhandler.CreateToken (tokenDescriptor);

            return tokenhandler.WriteToken (token);
        }
    }
}