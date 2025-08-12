package com.cutiepets.controllers;

import com.cutiepets.services.UserService;
import com.cutiepets.userdtos.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody UserRegisterDTO dto) {
        UserDTO registered = userService.registerUser(dto);
        return ResponseEntity.ok(registered);
    }
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody UserLoginDTO dto) {
        LoginResponseDTO loggedIn = userService.login(dto);
        return ResponseEntity.ok(loggedIn);
    }

    
    @GetMapping("/profile")
    public ResponseEntity<UserDTO> getProfile(@RequestParam String email) {
        return ResponseEntity.ok(userService.getUserProfile(email));
    }

    @PostMapping("/{id}/upload-profile")
    public ResponseEntity<String> uploadProfileImage(@PathVariable Integer id,
                                                     @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(userService.uploadProfileImage(id, file));
    }

    @PutMapping("/{id}/address")
    public ResponseEntity<UserDTO> updateAddress(@PathVariable Integer id,
                                                 @RequestBody AddressDTO addressDTO) {
        return ResponseEntity.ok(userService.updateUserAddress(id, addressDTO));
    }

}
