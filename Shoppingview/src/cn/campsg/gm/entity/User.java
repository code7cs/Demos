package cn.campsg.gm.entity;

	public class User {

		private String id = null; // 用户登录账号
		private String name = null; // 用户名真实姓名
		private String password = null; // 用户登录密码
		private Byte sex = null; // 用户性别
		private String city = null; // 用户所在地

		public User() {
		}

		public User(String id, String name, String password, Byte sex,
				String city) {
			this.id = id;
			this.name = name;
			this.password = password;
			this.sex = sex;
			this.city = city;
		}

		public String getId() {
			return id;
		}

		public void setId(String id) {
			this.id = id;
		}

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}

		public String getPassword() {
			return password;
		}

		public void setPassword(String password) {
			this.password = password;
		}

		public Byte getSex() {
			return sex;
		}

		public void setSex(Byte sex) {
			this.sex = sex;
		}

		public String getCity() {
			return city;
		}

		public void setCity(String city) {
			this.city = city;
		}

		@Override
		public String toString() {
			return "用户编号：" + this.getId() + " | 用户姓名：" + this.getName()
					+ " | 用户性别：" + this.getSex() + " | 所在城市：" + this.getCity();
		}

	}

