package com.mindfire.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mindfire.entity.User;

public interface LoginRepository extends JpaRepository<User, Long> {
	User findByUsername(String username);

}
