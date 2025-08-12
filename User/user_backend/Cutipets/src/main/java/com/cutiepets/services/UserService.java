package com.cutiepets.services;

import com.cutiepets.userdtos.*;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {
    UserDTO registerUser(UserRegisterDTO dto);
    LoginResponseDTO login(UserLoginDTO dto);
    UserDTO getUserProfile(String email);
    String uploadProfileImage(Integer userId, MultipartFile file);
    UserDTO updateUserAddress(Integer id, AddressDTO addressDTO);
}