import React from 'react'
import LoginForm from '../../components/LoginForm'
import { Card, Row, Col } from "antd";
import { useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";

const backgroundStyle = {
	backgroundImage: 'url(/img/others/img-17.jpg)',
	backgroundRepeat: 'no-repeat',
	backgroundSize: 'cover'
}

const LoginOne = props => {
	let history = useHistory();	 
	const Register = () => {
		history.push(`/auth/register`)
	}
	const theme = useSelector(state => state.theme.currentTheme)
	return (
		<div className="h-100" style={backgroundStyle}>
			<div className="container d-flex flex-column justify-content-center h-100">
				<Row justify="center">
					<Col xs={20} sm={20} md={18} lg={12}>
						<Card>
							<div className="my-4">
								<div className="text-center">
									<img className="img-fluid" src={`/img/${theme === 'light' ? 'logo.png': 'logo-white.png'}`} alt="" />
								</div>
								<Row justify="center">
									<Col xs={24} sm={24} md={20} lg={20}>
										<LoginForm {...props} />
									</Col>
									<p>Don't have an account yet? <a href="/#" onClick={(e) => {e.preventDefault(); Register()}}>Sign Up</a></p>
								</Row>
							</div>
						</Card>
					</Col>
				</Row>
			</div>
		</div>
	)
}

export default LoginOne
