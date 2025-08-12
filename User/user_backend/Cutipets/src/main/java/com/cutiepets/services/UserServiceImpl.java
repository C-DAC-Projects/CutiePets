package com.cutiepets.services;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cutiepets.enums.UserRole;
import com.cutiepets.pojos.Address;
import com.cutiepets.pojos.User;
import com.cutiepets.repositories.UserRepository;
import com.cutiepets.security.JwtUtils;
import com.cutiepets.userdtos.AddressDTO;
import com.cutiepets.userdtos.LoginResponseDTO;
import com.cutiepets.userdtos.UserDTO;
import com.cutiepets.userdtos.UserLoginDTO;
import com.cutiepets.userdtos.UserRegisterDTO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils; 

    private static final String IMAGE_UPLOAD_DIR = "D:/FINAL PROJECT/Resources/ProfileImages/";

    @Override
    public UserDTO registerUser(UserRegisterDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = modelMapper.map(dto, User.class);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(UserRole.ROLE_USER); // default role
        user = userRepository.save(user);

        return modelMapper.map(user, UserDTO.class);
    }

    @Override
    public LoginResponseDTO login(UserLoginDTO dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid credentials");
        }

        String token = jwtUtils.generateToken(user.getEmail());
        UserDTO userDTO = modelMapper.map(user, UserDTO.class);

        return new LoginResponseDTO(token, userDTO);
    }

    @Override
    public UserDTO getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return modelMapper.map(user, UserDTO.class);
    }

    @Override
    public String uploadProfileImage(Integer userId, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        File dest = new File(IMAGE_UPLOAD_DIR + filename);

        try {
            file.transferTo(dest);
            user.setProfileImage("/profile-images/" + filename);
            userRepository.save(user);
            return "Image uploaded successfully.";
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image", e);
        }
    }

    @Override
    public UserDTO updateUserAddress(Integer userId, AddressDTO addressDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Address address = modelMapper.map(addressDTO, Address.class);
        user.setAddress(address);
        user = userRepository.save(user);

        return modelMapper.map(user, UserDTO.class);
    }
}
