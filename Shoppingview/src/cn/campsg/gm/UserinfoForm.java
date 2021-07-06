package cn.campsg.gm;

import java.awt.EventQueue;

import javax.swing.JFrame;
import javax.swing.JLabel;
import java.awt.BorderLayout;
import java.awt.Component;
import java.awt.Font;
import java.awt.Window;

import javax.swing.JTextField;

import cn.campsg.gm.entity.User;
import cn.campsg.gm.service.UserDao;
import cn.campsg.gm.service.UserDaoTesting;
import javafx.scene.control.ComboBox;

import javax.swing.JRadioButton;
import javax.swing.JTextArea;
import javax.swing.JList;
import javax.swing.JScrollBar;
import javax.swing.JComboBox;
import javax.swing.ButtonGroup;
import javax.swing.JButton;
import java.awt.event.ActionListener;
import java.awt.event.ActionEvent;

public class UserinfoForm {

	public JFrame frame;
	private JTextField textField;

	/**
	 * Launch the application.
	 */
	public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				try {
					UserinfoForm window = new UserinfoForm();
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
	public UserinfoForm() {
		initialize();
	}

	/**
	 * Initialize the contents of the frame.
	 */
	private void initialize() {
		frame = new JFrame();
		frame.setTitle("电商购物平台-用户信息");
		frame.setBounds(100, 100, 401, 504);
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		frame.getContentPane().setLayout(null);
		
		JLabel lblNewLabel = new JLabel("登录账号：");
		lblNewLabel.setFont(new Font("宋体", Font.PLAIN, 15));
		lblNewLabel.setBounds(45, 80, 90, 48);
		frame.getContentPane().add(lblNewLabel);
		
		JLabel lblNewLabel_1 = new JLabel("真实姓名：");
		lblNewLabel_1.setFont(new Font("宋体", Font.PLAIN, 15));
		lblNewLabel_1.setBounds(45, 158, 79, 34);
		frame.getContentPane().add(lblNewLabel_1);
		
		JLabel lblNewLabel_2 = new JLabel("用户性别：");
		lblNewLabel_2.setFont(new Font("宋体", Font.PLAIN, 15));
		lblNewLabel_2.setBounds(45, 222, 79, 41);
		frame.getContentPane().add(lblNewLabel_2);
		
		JLabel lblNewLabel_3 = new JLabel("所在地：");
		lblNewLabel_3.setFont(new Font("宋体", Font.PLAIN, 15));
		lblNewLabel_3.setBounds(45, 288, 90, 41);
		frame.getContentPane().add(lblNewLabel_3);
		
		
		LoginForm lo = new LoginForm();
		
		JLabel lblNewLabel_4 = new JLabel("");
		lblNewLabel_4.setBounds(145, 91, 128, 21);
		frame.getContentPane().add(lblNewLabel_4);
		
		textField = new JTextField();
		textField.setBounds(148, 165, 146, 21);
		frame.getContentPane().add(textField);
		textField.setColumns(10);
		
		ButtonGroup group = new ButtonGroup();
		JRadioButton rdbtnNewRadioButton = new JRadioButton("男");
		rdbtnNewRadioButton.setBounds(148, 231, 73, 23);
		frame.getContentPane().add(rdbtnNewRadioButton);
		
		JRadioButton rdbtnNewRadioButton_1 = new JRadioButton("女");
		rdbtnNewRadioButton_1.setBounds(223, 231, 113, 23);
		frame.getContentPane().add(rdbtnNewRadioButton_1);
		
		group.add(rdbtnNewRadioButton);
		group.add(rdbtnNewRadioButton_1);
		
		
		
//		String[]listData = new String[] {"","河北","山西","辽宁","吉林","黑龙江","江苏","浙江","安徽","福建","江西","山东","河南","湖北","湖南","广东","海南","四川","贵州","云南","陕西","甘肃","青海",
//				"内蒙古","广西","西藏","宁夏","新疆","天津","上海","重庆","香港","澳门","台湾"};
//		
//		final JComboBox<String> comboBox = new JComboBox<String>(listData);
		JComboBox comboBox = new JComboBox();
//		ComboBox<String> comboBox = new ComboBox<>();
//		comboBox.getItems().addAll("item1");
		comboBox.addItem("北京");comboBox.addItem("河北");
		comboBox.addItem("山西");comboBox.addItem("辽宁");
		comboBox.addItem("吉林");comboBox.addItem("黑龙江");
		comboBox.addItem("江苏");comboBox.addItem("浙江");
		comboBox.addItem("安徽");comboBox.addItem("福建");
		comboBox.addItem("江西");comboBox.addItem("山东");
		comboBox.addItem("河南");comboBox.addItem("湖北");
		comboBox.addItem("湖南");comboBox.addItem("广东");
		comboBox.addItem("海南");comboBox.addItem("四川");
		comboBox.addItem("贵州");comboBox.addItem("云南");
		comboBox.addItem("陕西");comboBox.addItem("甘肃");
		comboBox.addItem("青海");comboBox.addItem("内蒙古");
		comboBox.addItem("广西");comboBox.addItem("西藏");
		comboBox.addItem("宁夏");comboBox.addItem("新疆");
		comboBox.addItem("天津");comboBox.addItem("上海");
		comboBox.addItem("重庆");comboBox.addItem("香港");
		comboBox.addItem("澳门");comboBox.addItem("台湾");
		
		comboBox.setBounds(151, 297, 143, 23);
		
		frame.getContentPane().add(comboBox);
		
		JButton btnNewButton = new JButton("确定");
		btnNewButton.addActionListener(new ActionListener() {
			
			 public void actionPerformed(ActionEvent e) {
				
				ProductInquiryForm pro = new ProductInquiryForm();
				frame.hide();
				pro.frame.show();
				
			}
		});
		btnNewButton.setBounds(68, 373, 107, 48);
		frame.getContentPane().add(btnNewButton);
		
		JButton btnNewButton_1 = new JButton("返回");
		btnNewButton_1.setBounds(210, 373, 107, 48);
		frame.getContentPane().add(btnNewButton_1);
	}
}
