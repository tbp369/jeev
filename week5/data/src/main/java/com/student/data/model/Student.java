package com.student.data.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name must not be empty")
    @Column(nullable = false)
    private String name;

    @Positive(message = "Age must be a positive number")
    @Column(nullable = false)
    private int age;

    @Pattern(regexp = "^(A\\+|A|B\\+|B|C\\+|C|D|F|-)?$", 
             message = "Grade must be in the format A+, B, C-, etc.")
    @Column(nullable = false)
    private String grade;

    private String address;
}
