package cn.campsg.gm;

import java.awt.EventQueue;

import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollPane;

import java.awt.Font;
import java.awt.event.ActionListener;

import javax.swing.JTextField;
import javax.swing.RowFilter;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.TableModel;
import javax.swing.table.TableRowSorter;

import javafx.event.ActionEvent;
import javafx.scene.control.TableColumn;

import javax.swing.JComboBox;
import javax.swing.JButton;
import javax.swing.JSeparator;

import java.awt.BorderLayout;
import java.awt.Color;
import javax.swing.JTable;

public class ProductInquiryForm {

	public JFrame frame;
	private JTextField textField;
	private JTable table;

	/**
	 * Launch the application.
	 */
	public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				try {
					ProductInquiryForm window = new ProductInquiryForm();
					window.frame.setVisible(true);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		});
		//JTableTest jt = new JTableTest();
	}
	/**
	 * Create the application.
	 */
	public ProductInquiryForm() {
		initialize();
	}

	/**
	 * Initialize the contents of the frame.
	 */
	private void initialize() {
		frame = new JFrame();
		frame.setTitle("电商购物平台-商品查询页面");
		frame.setBounds(100, 100, 664, 502);
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		frame.getContentPane().setLayout(null);
		
		JLabel lblNewLabel = new JLabel("您好，");
		lblNewLabel.setFont(new Font("宋体", Font.PLAIN, 15));
		lblNewLabel.setBounds(10, 10, 73, 27);
		frame.getContentPane().add(lblNewLabel);
		
		JLabel lblNewLabel_1 = new JLabel("来自于：");
		lblNewLabel_1.setFont(new Font("宋体", Font.PLAIN, 15));
		lblNewLabel_1.setBounds(499, 7, 73, 33);
		frame.getContentPane().add(lblNewLabel_1);
		
		JLabel lblNewLabel_2 = new JLabel("书籍名：");
		lblNewLabel_2.setFont(new Font("宋体", Font.PLAIN, 15));
		lblNewLabel_2.setBounds(10, 80, 116, 46);
		frame.getContentPane().add(lblNewLabel_2);
		
		textField = new JTextField();
		textField.setBounds(93, 90, 177, 27);
		frame.getContentPane().add(textField);
		textField.setColumns(10);
		
		JLabel lblNewLabel_3 = new JLabel("分类：");
		lblNewLabel_3.setFont(new Font("宋体", Font.PLAIN, 15));
		lblNewLabel_3.setBounds(292, 80, 80, 46);
		frame.getContentPane().add(lblNewLabel_3);
		
		JComboBox comboBox = new JComboBox();
		comboBox.addItem("-请选择-");
		comboBox.addItem("工具类>软件编程");
		comboBox.addItem("小说类>历史");
		comboBox.setBounds(345, 92, 162, 23);
		frame.getContentPane().add(comboBox);
			
		JSeparator separator = new JSeparator();
		separator.setBounds(20, 47, 606, 2);
		frame.getContentPane().add(separator);
		
		JLabel lblNewLabel_4 = new JLabel("购物车商品数：");
		lblNewLabel_4.setFont(new Font("宋体", Font.PLAIN, 15));
		lblNewLabel_4.setBounds(10, 419, 152, 36);
		frame.getContentPane().add(lblNewLabel_4);
		
		JLabel lblNewLabel_5 = new JLabel("查看详情");
		lblNewLabel_5.setFont(new Font("宋体", Font.PLAIN, 15));
		lblNewLabel_5.setBounds(182, 425, 80, 25);
		frame.getContentPane().add(lblNewLabel_5);
		
		JButton btnNewButton_1 = new JButton("购买");
		btnNewButton_1.setFont(new Font("宋体", Font.PLAIN, 15));
		btnNewButton_1.setBounds(529, 426, 97, 23);
		frame.getContentPane().add(btnNewButton_1);
		
		JLabel lblNewLabel_6 = new JLabel("newlabel");
		lblNewLabel_6.setFont(new Font("宋体", Font.PLAIN, 15));
		lblNewLabel_6.setBounds(65, 10, 97, 21);
		frame.getContentPane().add(lblNewLabel_6);
		
		JLabel lblNewLabel_7 = new JLabel("New label");
		lblNewLabel_7.setBounds(568, 16, 58, 15);
		frame.getContentPane().add(lblNewLabel_7);
		
		JLabel lblNewLabel_8 = new JLabel("New label");
		lblNewLabel_8.setBounds(114, 430, 58, 15);
		frame.getContentPane().add(lblNewLabel_8);
		
		String[][] userData = {{"b01", "Java核心技术","霍斯特曼","50","工具类>软件编程"},
								{"b02","名著-三国演义","罗贯中","40","小说类>历史"},
								{"b03","名著-水浒传","施耐庵","30","小说类>历史"},
								{"b04","名著-红楼梦","曹雪芹","20","小说类>历史"}};
		String[] tableHead = {"书籍编号","书籍名称","书籍作者","库存","书籍分类"};
		
		table = new JTable(userData, tableHead);
		JScrollPane jsp = new JScrollPane(table);
		jsp.setBounds(20, 136, 606, 273);
		frame.getContentPane().add(jsp);

		JButton btnNewButton = new JButton("查询");
		btnNewButton.addActionListener(new ActionListener() {
			public void actionPerformed(java.awt.event.ActionEvent e) {
				String[][] userData1 = new String[4][];
				String[] userData_1 = new String[5];
				int n = 0;
				for(int i = 0; i < userData.length; i++) {
					if(textField.getText().toString().equals(userData[i][1])) {
						for(int j = 0; j< 5;j++) {
							userData_1[j] = userData[i][j];
						}
						n = n + 1;
					}
				}
				System.out.println(userData_1[1]);
				
				System.out.println("跳出if");
				
				table = new JTable(userData1, tableHead);
				JScrollPane jsp = new JScrollPane(table);
				jsp.setBounds(20, 136, 606, 273);
				frame.getContentPane().add(jsp);
			}
//			String[][] userData1 = {
//					{"b02","名著-三国演义","罗贯中","40","小说类>历史"},
//					{"b03","名著-水浒传","施耐庵","30","小说类>历史"},
//					{"b04","名著-红楼梦","曹雪芹","20","小说类>历史"}};
//			String[] tableHead = {"书籍编号","书籍名称","书籍作者","库存","书籍分类"};
//			table  = new JTable(userData1, tableHead);
//			JScrollPane jsp = new JScrollPane(table);
//			jsp.setBounds(20, 136, 606, 273);
//			frame.getContentPane().add(jsp);
//				
		});
		
		btnNewButton.setFont(new Font("宋体", Font.PLAIN, 15));
		btnNewButton.setBounds(529, 92, 97, 23);
		frame.getContentPane().add(btnNewButton);
		
	}


	
}
