package com.cutiepets.userdtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRegisterDTO {
    private String name;
    private String email;
    private String password;
}
