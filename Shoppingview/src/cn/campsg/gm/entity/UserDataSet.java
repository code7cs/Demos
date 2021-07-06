package cn.campsg.gm.entity;

import java.util.ArrayList;
import java.util.List;

public class UserDataSet {
	
	/* 用户测试数据集 */
	public static List<User> users = null;
	
	/* 静态块会在静态函数前初始化集合 */
	static {
		users = new ArrayList<User>();
		users.add(new User("u01","张一","123",(byte)0,"上海"));
		users.add(new User("u02","李卫","123",(byte)0,"北京"));
		users.add(new User("u03","陈蕊","123",(byte)1,"广州"));
		users.add(new User("u04","孙静","123",(byte)1,null));
	}
	
}
