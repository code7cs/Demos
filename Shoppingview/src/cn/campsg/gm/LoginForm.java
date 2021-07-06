package cn.campsg.gm;

import java.awt.EventQueue;

import java.io.FileWriter;


import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JTextField;

import cn.campsg.gm.entity.User;
import cn.campsg.gm.service.UserDao;
import cn.campsg.gm.service.UserDaoTesting;

import javax.swing.JPasswordField;
import javax.swing.JButton;
import java.awt.event.ActionListener;
import java.awt.event.ActionEvent;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;

public class LoginForm {

	private JFrame frame;
	private JTextField txtUserID;
	private JPasswordField txtPassword;
	public String s = "safdf";
	/**
	 * Launch the application.
	 */
	public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				try {
					LoginForm window = new LoginForm();
					window.frame.setVisible(true);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		});
	}

	/**
	 * Create the application.
	 */
	public LoginForm() {
		initialize();
	}

	/**
	 * Initialize the contents of the frame.
	 */
	private void initialize() {
		
		frame = new JFrame();
		frame.setTitle("电商购物平台-登录");
		frame.setBounds(100, 100, 450, 300);
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		frame.getContentPane().setLayout(null);
		
		JLabel lblUserID = new JLabel("\u767B\u5F55\u8D26\u53F7\uFF1A");
		lblUserID.setBounds(46, 79, 85, 30);
		frame.getContentPane().add(lblUserID);
		
		JLabel lblPassword = new JLabel("\u767B\u5F55\u5BC6\u7801\uFF1A");
		lblPassword.setBounds(46, 140, 85, 15);
		frame.getContentPane().add(lblPassword);
		
		txtUserID = new JTextField();
		txtUserID.setBounds(163, 91, 148, 21);
		frame.getContentPane().add(txtUserID);
		txtUserID.setColumns(10);
		
		txtPassword = new JPasswordField();
		txtPassword.setBounds(163, 137, 148, 21);
		frame.getContentPane().add(txtPassword);
		
		JButton btnLogin = new JButton("\u767B\u5F55");
		btnLogin.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				String uid = txtUserID.getText().toString();
				String pwd = new String(txtPassword.getPassword());

				UserDao userDao;
				UserDaoTesting userDaotesting = new UserDaoTesting();
				userDao = userDaotesting;
				if(userDao.login(uid, pwd) == null) {
					JOptionPane.showMessageDialog(frame, "登录账号或密码不正确", "警告信息",JOptionPane.WARNING_MESSAGE );
					txtUserID.requestFocus();
					txtUserID.selectAll();
				}else{
					Object[] button = {"确定"};
					int op = JOptionPane.showOptionDialog(null, "登录成功", "信息", JOptionPane.INFORMATION_MESSAGE, 1, null, button, button[0]);
					if(op == JOptionPane.YES_OPTION) {
						frame.hide();
						UserinfoForm userinfo = new UserinfoForm();
						userinfo.frame.show();
					}
				}
				System.out.println(uid);
				
			}
				
		});
		
		txtPassword.addKeyListener(new KeyAdapter() {
			@Override
			public void keyPressed(KeyEvent e) {
				if(e.getKeyCode() == KeyEvent.VK_ENTER) {
					btnLogin.doClick();
				}
				
			}
		});
		
		btnLogin.setBounds(81, 190, 97, 23);
		frame.getContentPane().add(btnLogin);
		
		JButton btnReset = new JButton("\u91CD\u7F6E");
		btnReset.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				txtUserID.setText(null);
				txtPassword.setText(null);
				txtUserID.requestFocus();
			}
		});
		btnReset.setBounds(214, 190, 97, 23);
		frame.getContentPane().add(btnReset);
	}
	
}
