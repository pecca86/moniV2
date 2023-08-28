package com.pekka.moni.customer;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public record Customer(
        Long id,
        @JsonProperty("first_name") String firstName,
        @JsonProperty("last_name") String lastName,
        @JsonProperty(access = JsonProperty.Access.WRITE_ONLY) String password
) {
}
//
//public class Customer {
//    private Long id;
////    @JsonProperty("first_name")
//
//    private String firstName;
////    @JsonProperty("last_name")
//
//    private String lastName;
//    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
//    private String password;
//
//    public Customer() {
//    }
//
//    public Customer(Long id, String firstName, String lastName, String password) {
//        this.id = id;
//        this.firstName = firstName;
//        this.lastName = lastName;
//        this.password = password;
//    }
//
//    public String getFirstName() {
//        return firstName;
//    }
//
//    public String getLastName() {
//        return lastName;
//    }
//
//    public Long getId() {
//        return id;
//    }
//
//    @JsonIgnore
//    public String getPassword() {
//        return password;
//    }
//
//    @Override
//    public String toString() {
//        return "Customer{" +
//                "id=" + id +
//                ", firstName='" + firstName + '\'' +
//                ", lastName='" + lastName + '\'' +
//                ", password='" + password + '\'' +
//                '}';
//    }
//}