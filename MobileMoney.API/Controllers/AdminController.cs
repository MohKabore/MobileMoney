using System.Threading.Tasks;
using MobileMoney.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using MobileMoney.API.Dtos;
using Microsoft.AspNetCore.Identity;
using MobileMoney.API.Models;
using Microsoft.Extensions.Options;
using MobileMoney.API.Helpers;
using AutoMapper;
using System.Collections.Generic;
// using CloudinaryDotNet;
// using CloudinaryDotNet.Actions;

namespace MobileMoney.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly UserManager<User> _userManager;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        private readonly IMapper _mapper;

        // private Cloudinary _cloudinary;

        public AdminController(
            DataContext context,
            UserManager<User> userManager,
            IOptions<CloudinarySettings> cloudinaryConfig,
            IMapper mapper)
        {
            _userManager = userManager;
            _cloudinaryConfig = cloudinaryConfig;
            _mapper = mapper;
            _context = context;

            // Account acc = new Account(
            //     _cloudinaryConfig.Value.CloudName,
            //     _cloudinaryConfig.Value.ApiKey,
            //     _cloudinaryConfig.Value.ApiSecret
            // );

            // _cloudinary = new Cloudinary(acc);
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("GetRoles")]
        public async Task<IActionResult> GetRoles()
        {
            var rolesFromDb = await _context.Roles.Where(r => r.Name != "Admin").OrderBy(r => r.Name).ToListAsync();
            var rolesToReturn = _mapper.Map<IEnumerable<RoleListDto>>(rolesFromDb);
            return Ok(rolesToReturn);
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("usersWithRoles")]
        public async Task<IActionResult> GetUsersWithRoles()
        {
            var userList = await (from user in _context.Users
                                  orderby user.UserName
                                  select new
                                  {
                                      Id = user.Id,
                                      UserName = user.UserName,
                                      Roles = (from userRole in user.UserRoles
                                               join role in _context.Roles
                                               on userRole.RoleId
                                               equals role.Id
                                               select role.Name).ToList()
                                  }).ToListAsync();
            return Ok(userList);
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("editRoles/{userName}")]
        public async Task<IActionResult> EditRoles(string userName, RoleEditDto roleEditDto)
        {
            var user = await _userManager.FindByNameAsync(userName);

            var userRoles = await _userManager.GetRolesAsync(user);

            var selectedRoles = roleEditDto.RoleNames;

            selectedRoles = selectedRoles ?? new string[] { };
            var result = await _userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));

            if (!result.Succeeded)
                return BadRequest("Failed to add to roles");

            result = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));

            if (!result.Succeeded)
                return BadRequest("Failed to remove the roles");

            return Ok(await _userManager.GetRolesAsync(user));
        }


        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("CreateUserWithRoles")]
        public async Task<IActionResult> CreateUserWithRoles(UserToCreateDto userToCreate)
        {
            var userToSave = new User
            {
                UserName = userToCreate.UserName,
                FirstName = userToCreate.Password,
                EmailConfirmed = true,
                ValidatedCode = true
            };

            IdentityResult result = _userManager.CreateAsync(userToSave, userToCreate.Password).Result;

            if (result.Succeeded)
            {
                var userCreated = _userManager.FindByNameAsync(userToCreate.UserName).Result;
                var res = _userManager.AddToRolesAsync(userCreated, userToCreate.Roles).Result;
                if (res.Succeeded)
                {
                    var userToReturn = await (from user in _context.Users
                                              where user.Id == userCreated.Id

                                              select new
                                              {
                                                  Id = user.Id,
                                                  UserName = user.UserName,
                                                  Roles = (from userRole in user.UserRoles
                                                           join role in _context.Roles
                                                           on userRole.RoleId
                                                           equals role.Id
                                                           select role.Name).ToList()
                                              }).FirstOrDefaultAsync();
                    return Ok(userToReturn);
                }
                return BadRequest("Impossible d'ajouter l'utilisateur");
            }
            return BadRequest();
        }


        // [Authorize(Policy = "ModeratePhotoRole")]
        // [HttpGet("photosForModeration")]
        // public async Task<IActionResult> GetPhotosForModeration()
        // {
        //     var photos = await _context.Photos
        //         .Include(u => u.User)
        //         .IgnoreQueryFilters()
        //         .Where(p => p.IsApproved == false)
        //         .Select(u => new
        //         {
        //             Id = u.Id,
        //             UserName = u.User.UserName,
        //             Url = u.Url,
        //             IsApproved = u.IsApproved
        //         }).ToListAsync();

        //     return Ok(photos);
        // }

        //     [Authorize(Policy = "ModeratePhotoRole")]
        //     [HttpPost("approvePhoto/{photoId}")]
        //     public async Task<IActionResult> ApprovePhoto(int photoId)
        //     {
        //         var photo = await _context.Photos
        //             .IgnoreQueryFilters()
        //             .FirstOrDefaultAsync(p => p.Id == photoId);

        //         photo.IsApproved = true;

        //         await _context.SaveChangesAsync();

        //         return Ok();
        //     }

        //     [Authorize(Policy = "ModeratePhotoRole")]
        //     [HttpPost("rejectPhoto/{photoId}")]
        //     public async Task<IActionResult> RejectPhoto(int photoId)
        //     {
        //         var photo = await _context.Photos
        //             .IgnoreQueryFilters()
        //             .FirstOrDefaultAsync(p => p.Id == photoId);

        //         if (photo.IsMain)
        //             return BadRequest("You cannot reject the main photo");

        //         if (photo.PublicId != null)
        //         {
        //             var deleteParams = new DeletionParams(photo.PublicId);

        //             var result = _cloudinary.Destroy(deleteParams);

        //             if (result.Result == "ok")
        //             {
        //                 _context.Photos.Remove(photo);
        //             }
        //         }

        //         if (photo.PublicId == null)
        //         {
        //             _context.Photos.Remove(photo);
        //         }

        //         await _context.SaveChangesAsync();

        //         return Ok();
        //     }
    }
}