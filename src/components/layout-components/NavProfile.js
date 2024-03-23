import React from "react";
import { Menu, Dropdown, Avatar } from "antd";
import { connect } from 'react-redux'
import { 
  EditOutlined, 
  SettingOutlined, 
  CustomerServiceOutlined, 
  QuestionCircleOutlined, 
  LogoutOutlined 
} from '@ant-design/icons';
import { signOut } from 'redux/actions/Auth';
import { useHistory } from "react-router-dom";


export const NavProfile = ({signOut,userData}) => {
  let history = useHistory();
  const editProfile = (e) => {
    e.preventDefault();
    history.push(`/app/apps/profile`)
  }
  const changePassword = (e) => {
    e.preventDefault();
    history.push(`/app/apps/profile/change-password`)
  }
  const faq = (e) => {
    e.preventDefault();
    history.push(`/app/apps/faq`)
  }
  const helpCenter = (e) => {
    e.preventDefault();
    history.push(`/app/apps/faq`)
  }
  const menuItem = [
    {
      title: "Edit Profile",
      icon: EditOutlined ,
      path: (event) => {editProfile(event)}
    },
    {
      title: "Account Setting",
      icon: SettingOutlined,
      path: (event) => {changePassword(event)}
    },
    {
      title: "Faq",
      icon: QuestionCircleOutlined,
      path: (event) => {faq(event)}
    },
    {
      title: "Help Center",
      icon: CustomerServiceOutlined,
      path: (event) => {helpCenter(event)}
    }
  ]

  const profileMenu = (
    <div className="nav-profile nav-dropdown">
      <div className="nav-profile-header">
        <div className="d-flex">
          <Avatar size={45} src={userData.photoURL} />
          <div className="pl-3">
            <h4 className="mb-0">{userData.displayName}</h4>
            <span className="text-muted">{userData.role}</span>
          </div>
        </div>
      </div>
      <div className="nav-profile-body">
        <Menu>
          <Menu.Item key={menuItem.legth + 1} onClick={e => signOut()}>
            <span>
              <LogoutOutlined className="mr-3"/>
              <span className="font-weight-normal">Sign Out</span>
            </span>
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );
  return (
    <Dropdown placement="bottomRight" overlay={profileMenu} trigger={["click"]}>
      <Menu className="d-flex align-item-center" mode="horizontal">
        <Menu.Item>
          <Avatar src={userData.photoURL} />
        </Menu.Item>
      </Menu>
    </Dropdown>
  );
}

export default connect(null, {signOut})(NavProfile)
