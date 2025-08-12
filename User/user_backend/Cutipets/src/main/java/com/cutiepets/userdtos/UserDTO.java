package com.cutiepets.userdtos;

import com.cutiepets.enums.UserRole;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Integer id;
    private String name;
    private String email;
    private String profileImage;
    private UserRole role;
    private String token;         
    private String street;        // For embedded address
    private String city;
}
