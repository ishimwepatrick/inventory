import React, { useEffect } from 'react'
import { connect } from "react-redux";
import { Card, Row, Col, Form, Input, Button, Alert } from "antd";
import { MailOutlined } from '@ant-design/icons';
import { useHistory } from "react-router-dom";
import { useSelector } from 'react-redux';

import { 
	resetPassword, 
	showLoading, 
	showAuthMessage, 
	hideAuthMessage, 
	showSuccessMessage, 
	hideSuccessMessage 
} from 'redux/actions/Auth';
import { motion } from "framer-motion"

const backgroundStyle = {
	backgroundImage: 'url(/img/others/img-17.jpg)',
	backgroundRepeat: 'no-repeat',
	backgroundSize: 'cover'
}

const ForgotPassword = (props) => {
	const [form] = Form.useForm();
	const { 
		hideAuthMessage,
		hideSuccessMessage,
		showLoading,
		resetPassword, 
		loading,
		showMessage,
		showSuccess,
		message,
	} = props
	let history = useHistory();
	const Login = () => {
		history.push(`/auth/login`)
	}
	const onSend = values => {
		showLoading()
		resetPassword(values);
  };
  useEffect(() => {
	if(showMessage) {
		setTimeout(() => {
			hideAuthMessage();
		}, 3000);
	}
	if(showSuccess) {
		setTimeout(() => {
			hideSuccessMessage();
		}, 4000);
	}
});
	const theme = useSelector(state => state.theme.currentTheme)
	return (
		<div className="h-100" style={backgroundStyle}>
			<motion.div 
				initial={{ opacity: 0, marginBottom: 0 }} 
				animate={{ 
					opacity: showMessage ? 1 : 0,
					marginBottom: showMessage ? 20 : 0 
				}}> 
				<Alert type="error" showIcon message={message}></Alert>
			</motion.div>
			<motion.div 
				initial={{ opacity: 0, marginBottom: 0 }} 
				animate={{ 
					opacity: showSuccess ? 1 : 0,
					marginBottom: showSuccess ? 20 : 0 
				}}> 
				<Alert type="success" showIcon message={message}></Alert>
			</motion.div>
			<div className="container d-flex flex-column justify-content-center">
				<Row justify="center">
					<Col xs={20} sm={18} md={16} lg={10}>
						<Card>
							<div className="my-2">
								<div className="text-center">
									<img className="img-fluid" src={`/img/${theme === 'light' ? 'logo.png': 'logo-white.png'}`} alt="" />
									<h3 className="mt-3 font-weight-bold">Forgot Password?</h3>
									<p className="mb-4">Enter your Email to reset password</p>
								</div>
								<Row justify="center">
									<Col xs={24} sm={24} md={20} lg={20}>
										<Form form={form} layout="vertical" name="forget-password" onFinish={onSend}>
											<Form.Item 
												name="email" 
												rules={
													[
														{ 
															required: true,
															message: 'Please input your email address'
														},
														{ 
															type: 'email',
															message: 'Please enter a validate email!'
														}
													]
												}>
												<Input placeholder="Email Address" prefix={<MailOutlined className="text-primary" />}/>
											</Form.Item>
											<Form.Item>
												<Button loading={loading} type="primary" htmlType="submit" block>{loading? 'Sending' : 'Send'}</Button>
											</Form.Item>
										</Form>
									</Col>
									<Col xs={20} sm={20} md={20} lg={20}  className="text-center">
										<p>Back to <a href="/#" onClick={(e) => {e.preventDefault(); Login()}}>Login</a></p>
									</Col>
								</Row>
							</div>
						</Card>
					</Col>
				</Row>
			</div>
		</div>
	)
}

const mapStateToProps = ({auth}) => {
	const {loading, message, showMessage, showSuccess} = auth;
  return {loading, message, showMessage, showSuccess}
}

const mapDispatchToProps = {
	resetPassword,
	showAuthMessage,
	showLoading,
	hideAuthMessage, 
	showSuccessMessage, 
	hideSuccessMessage 
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword)

