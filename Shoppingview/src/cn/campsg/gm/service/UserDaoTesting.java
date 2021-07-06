package cn.campsg.gm.service;


import java.util.ArrayList;
import java.util.List;

import cn.campsg.gm.entity.User;
import cn.campsg.gm.entity.UserDataSet;

public class UserDaoTesting implements UserDao{

	@Override
	public User login(String uid, String pwd) {
		
		List<User> list = new ArrayList<User>();
		list = UserDataSet.users;
		for(int i = 0; i < list.size(); i++) {
			if(list.get(i).getId().equals(uid) && list.get(i).getPassword().equals(pwd)) { 
				return list.get(i);
			}
		}
		return null;
	}
}