import React, { useEffect } from 'react';
import { connect } from "react-redux";
import { Button, Form, Input, Alert } from "antd";
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

import { 
	signIn, 
	showLoading, 
	showAuthMessage, 
	hideAuthMessage, 
	showSuccessMessage, 
	hideSuccessMessage 
} from 'redux/actions/Auth';
import { useHistory } from "react-router-dom";
import { motion } from "framer-motion"

export const LoginForm = props => {
	let history = useHistory();
	const onForgetPasswordClick = () => {
		history.push(`/auth/forgot-password`)
	}
	const { 
		showForgetPassword, 
		hideAuthMessage,
		hideSuccessMessage,
		showLoading,
		extra, 
		signIn, 
		token, 
		loading,
		redirect,
		showMessage,
		showSuccess,
		message,
		allowRedirect
	} = props

	const initialCredential = {
		email: '',
		password: ''
	}

	const onLogin = values => {
		showLoading()
		signIn(values);
	};

	useEffect(() => {
		if (token !== null && allowRedirect) {
			history.push(redirect)
		}
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

	return (
		<>
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
			<Form 
				layout="vertical" 
				name="login-form" 
				initialValues={initialCredential}
				onFinish={onLogin}
			>
				<Form.Item 
					name="email" 
					label="Email" 
					rules={[
						{ 
							required: true,
							message: 'Please input your email',
						},
						{ 
							type: 'email',
							message: 'Please enter a validate email!'
						}
					]}>
					<Input prefix={<MailOutlined className="text-primary" />}/>
				</Form.Item>
				<Form.Item 
					name="password" 
					label={
						<div className={`${showForgetPassword? 'd-flex justify-content-end w-100 align-items-center' : ''}`}>
							<span>Password</span>
							{
								showForgetPassword && 
								<span 
									onClick={onForgetPasswordClick} 
									className="cursor-pointer font-size-sm font-weight-normal text-muted ml-1"
								>
									Forget Password?
								</span>
							} 
						</div>
					} 
					rules={[
						{ 
							required: true,
							message: 'Please input your password',
						}
					]}
				>
					<Input.Password prefix={<LockOutlined className="text-primary" />}/>
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit" block loading={loading}>
						Sign In
					</Button>
				</Form.Item>
				{ extra }
			</Form>
		</>
	)
}

LoginForm.propTypes = {
	otherSignIn: PropTypes.bool,
	showForgetPassword: PropTypes.bool,
	extra: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.element
	]),
};

LoginForm.defaultProps = {
	otherSignIn: false,
	showForgetPassword: true
};

const mapStateToProps = ({auth}) => {
	const {loading, message, showMessage, showSuccess, token, redirect} = auth;
  return {loading, message, showMessage, showSuccess, token, redirect}
}

const mapDispatchToProps = {
	signIn,
	showAuthMessage,
	showLoading,
	hideAuthMessage, 
	showSuccessMessage, 
	hideSuccessMessage 
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)
