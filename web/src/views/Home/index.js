import React, { useState, useEffect } from "react";
import Header from "../Components/Header.js";
import PopOver from "../Components/PopOver";
import Avatar from "../Components/Avatar";
import Tooltip from "../Components/Tooltip";
import api from "../../services/api";
import Utils from "../../services/utils";
import tenantHelper from "../../helpers/tenantHelper.js";

export default function Home(props) {
    const [tenantDefault, setTenantDefault] = useState('');
    const [load, setLoad] = useState(false)
    const [tenants, setTenants] = useState([])
    const [tenant, setTenant] = useState(props.match.params.tenant);
    const [userInfo, setUserInfo] = useState({})
    const [modelUser, setModelUser] = useState([]);
    const [users, setUsers] = useState([])
    const handleClick = async (item) => {
        const setvalue = item
        console.log(item)
        localStorage.setItem("selected", JSON.stringify(setvalue))
        setTenantDefault(setvalue.nickname)
        window.location.href= `/${setvalue._id}`
        setTimeout(()=>{
            
            Userslist()
        }, 1000)
    }
    
    const populateTenant = async () => {
        var newArr = []
        newArr = await tenantHelper.list()
        
        setTenants(newArr.data)
        var getTenant = JSON.parse( localStorage.getItem('selected'))
        if(getTenant == null || typeof getTenant.nickname == "undefined" ){
            setTenantDefault(newArr.data[0].nickname)
            localStorage.setItem('selected',JSON.stringify(newArr.data[0]))
        }else{
            setTenantDefault(getTenant.nickname)
        }
    }
    const Userslist = async () => {
        // debugger
        if(tenant){
            const usersBaseActual = (await api.get(`users/${tenant}`)).data
            console.log(usersBaseActual);
            setModelUser(usersBaseActual);
            setUsers(usersBaseActual);
            GetUserInfos();
        }
    }
    const getTeam = () => {
        return users.filter(user => user.email !== userInfo.email);
    }
    const GetUserInfos = async () => {
        const useri = JSON.parse(localStorage.getItem("userInfo"))
        setUserInfo(useri);
        const myteam = document.getElementById("myTeam");
        if (useri.type !== 1) {
            myteam.style.display = "none";
        }
    }
    useEffect(() => {
        populateTenant()
        Userslist()
        
    }, [load])
    return (
        <>
            <main>
                <Header tenants={tenants} handleClick={e => handleClick(e)} currentTenant={tenantDefault}></Header>
                <div className="content">
                <div id="myTeam" className="container md pt-0">
                        <div className="title">Equipe &nbsp;<span className="badge badge-gray3 ghost">{getTeam().length}</span></div>
                        <div className="avatar-wrapper">
                            {getTeam().map((item, index) => {
                                return <span key={index} onClick={e => console.log(item)}>
                                    <PopOver trigger={<Avatar initials={Utils.getAcronym(item.name)} size="" pending={item.invited?true:false} user={item.type} email={item.email}></Avatar>}>
                                        <Avatar initials={Utils.getAcronym(item.name)} size="lg" user={item.type} pending={item.invited?true:false} user={item.type} email={item.email}></Avatar>
                                        <h6 className="popover-title">{item.name}</h6>
                                        <small>{item.email}</small>
                                    </PopOver>
                                </span>
                            })}
                            {userInfo.type === 1 && 
                                <Tooltip y="top" trigger={
                                    <button className="btn icon btn-gray2 rounded hover-primary" onClick={e => console.log(null)}>
                                        <i className="feather icon-plus font-size-18"></i>
                                    </button>
                                }>
                                    <span>Convidar novo membro</span>
                                </Tooltip>
                            }
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}