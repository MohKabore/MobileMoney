using System;
using System.Globalization;
using System.Linq;
using AutoMapper;
using MobileMoney.API.Data;
using MobileMoney.API.Dtos;
using MobileMoney.API.Models;

namespace MobileMoney.API.Helpers {
    public class AutoMapperProfiles : Profile {
        private readonly DataContext _context;

        public AutoMapperProfiles (DataContext context) {
            _context = context;
        }
        public AutoMapperProfiles () {
            CreateMap<User, UserForListDto> ()
                .ForMember (dest => dest.Age, opt => {
                    opt.MapFrom (d => d.DateOfBirth.CalculateAge ());
                });  
            CreateMap<Role, RoleListDto> ();     
        }
    }
}