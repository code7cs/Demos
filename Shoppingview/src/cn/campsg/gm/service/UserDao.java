package cn.campsg.gm.service;

import cn.campsg.gm.entity.User;

public interface UserDao {
	public User login(String uid, String pwd);
}
