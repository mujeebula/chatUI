package com.mindfire.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mindfire.entity.UserCredential;

public interface UserCredentialRepository extends JpaRepository<UserCredential, Long> {

	UserCredential findByUsernameAndPassword(String username, String password);

}
