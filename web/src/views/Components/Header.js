import React, { useState } from 'react';

import api from "../../services/api";
// import researchHelper from "../../helpers/researchHelper";
import Utils from "../../services/utils";
import userHelper from '../../helpers/userHelper.js';
import Dialog from "../Components/Dialog.js";
import Dropdown from "../Components/Dropdown";

class Header extends React.Component {
    constructor(props) {
        super();
        //this.load(props.researchId);

    }
    render() {
        return (
            <>
                {/* <div className="snackbar-wrapper">
                    {this.state.errors.map((e, i) =>
                        <div className={`snackbar ${e.type}`} key={i}>
                            <div className="snackbar-content">
                                <i className={`feather ${e.icon} mr-1`}></i>
                                {e.message}
                            </div>
                            <button className="btn xs icon" onClick={e => this.closeSnackbar(e)}><i className="feather icon-x"></i></button>
                        </div>
                    )}
                </div> */}

                <div className="header">
                    <a href="/" className="logo sm"></a>
                    
                    <div className="d-flex">
                        {/* {this.props.menu && <>
                            {this.props.menu}
                            <div className="divider-v" data-size="20px"></div>
                        </>*/}
                        
                            {console.log(this.props.tenants)}
                        {
                        this.props.tenants &&
                        
                            <>
                                <Dropdown items='' y="bottom" x="right" title="" icon="" trigger={
                                    <>
                                    {console.log('tenant', this.props.currentTenant)}
                                        {this.props.currentTenant &&
                                            <button className="btn btn-gray1-ghost">
                                                {this.props.currentTenant}
                                                <i className="feather icon-users font-size-20 ml-1"></i>
                                            </button>
                                        }
                                    </>
                                }>
                                    {this.props.tenants.map((item, index) => {
                                        console.log(item.nickname)
                                        const value =  item
                                        
                                        // const setValue ={ _id:item._id, nickname:item.nickname}
                                        //console.log(value)
                                        return <div key={index} value={item.nickname} onClick={e=>this.props.handleClick(value)} className="dropdown-content-item">
                                            <span className="dropdown-item-icon">
                                                <i className="feather icon-users"></i>
                                            </span>
                                            {item.nickname}
                                        </div>
                                    })}
                                </Dropdown>
                                <div className="divider-v" data-size="20px"></div>
                            </>

                        }



                        {/* <Dropdown y="bottom" x="right" title="" icon="" trigger={
                            <button className="btn icon rounded border-0">
                                <Avatar initials={Utils.getAcronym(this.props.name)} email={this.props.email} size=""></Avatar>
                            </button>

                        }>
                            <div className="dropdown-content-item">
                                <span className="dropdown-item-icon">
                                    <i className="feather icon-user"></i>
                                </span>
                                <div className="line-height-110" onClick={e => this.setState({ profileModal: true })}>
                                    <div>{this.props.name}</div>
                                    <div className="text-color-gray4 f-size-11">{this.props.email}</div>
                                </div>
                                <div className="divider hr"></div>

                            </div>
                            <div className="divider sm hr"></div>
                            <div onClick={() => { this.handleLogout() }} className="dropdown-content-item">
                                <span className="dropdown-item-icon">
                                    <i className="feather icon-log-out"></i>
                                </span>
                                Sair
                            </div>
                        </Dropdown> */}

                    </div>
                </div>



                {/* <Dialog title="" size="xs" show={this.state.profileModal} onHide={e => this.setState({ profileModal: false })} body={
                    <>
                        <div className="d-flex align-items-end justify-between">
                            <Avatar initials={Utils.getAcronym(this.props.name)} size="lg" email={this.props.email}></Avatar>
                        </div>
                        <div className="form-group mt-1">
                            <label htmlFor="profile">Tipo de Perfil</label>
                            <div className="input-group">
                                <div className="input-field">
                                    <select id="name" className="form-control" value="1" disabled>
                                        <option value="">Selecione...</option>
                                        <option value="1">Admin</option>
                                        <option value="2">Padrão</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className={`form-group ${this.state.nameError}`}>
                            <label htmlFor="name">Nome</label>
                            <div className="input-group">
                                <div className="input-field">
                                    <input id="profile" className="form-control" type="text"
                                        value={this.state.name}
                                        onChange={e => this.setState({ name: e.target.value })}
                                        onBlur={e => { this.nameValidate(); this.profileValidate(); }}
                                        onKeyDown={e => { this.nameValidate(); this.profileValidate(); }}
                                    />
                                </div>
                            </div>
                            <div className="hint">{this.state.nameGetError != '' ? this.state.nameGetError : 'Informe o nome'}</div>
                        </div>
                        <div className={`form-group ${this.state.emailError}`}>
                            <label htmlFor="email">E-mail</label>
                            <div className="input-group">
                                <div className="input-field">
                                    <input id="email" className="form-control" type="text"
                                        value={this.state.email}
                                        onChange={e => this.setState({ email: e.target.value })}
                                        onBlur={e => { this.emailValidate(); this.profileValidate(); }}
                                        onKeyDown={e => { this.emailValidate(); this.profileValidate(); }}
                                    />
                                </div>
                            </div>
                            <div className="hint">{this.state.emailGetError != '' ? this.state.emailGetError : 'Informe o e-mail'}</div>
                        </div>
                    </>
                }
                    footer={
                        <>
                            <button className="btn btn-bg-blue" onClick={() => { this.setState({ passwordModal: true, profileModal: false }) }}>
                                <i className="feather icon-unlock mr-1"></i>
                        Alterar senha
                    </button>
                            <button disabled={this.state.profileDisabled} onClick={() => { this.saveUser() }} className="btn btn-green ml-auto">Salvar</button>
                        </>
                    }>
                </Dialog> */}
                {/* <Dialog title="Alterar Senha" size="sm" show={this.state.passwordModal} onHide={e => this.setState({ passwordModal: false })}
                    body={
                        <>
                            <div className="my-2">
                                <h6>Olá {this.props.name}.</h6>
                                    Crie sua nova senha abaixo:</div>
                            <div className={`form-group ${this.state.oldPassword}`}>
                                <label htmlFor="password">Senha Antiga</label>
                                <div className="input-group">
                                    <div className="input-field">
                                        <input id="password" className="form-control" type={`${this.state.showOldPassword ? 'text' : 'password'}`} value={this.state.password} onChange={e => this.setState({ password: e.target.value })} />
                                    </div>
                                    <button type="button" className="btn icon btn-gray1" onClick={_ => this.setState({ showOldPassword: !this.state.showOldPassword })}><i className={`feather ${this.state.showOldPassword ? 'icon-eye-off' : 'icon-eye'}`}></i></button>
                                </div>
                                <div className="hint">
                                    Senha incorreta.
                                    </div>
                            </div>
                            <div className={`form-group ${this.state.passwordError}`}>
                                <label htmlFor="new-password">Nova Senha</label>
                                <div className="input-group">
                                    <div className="input-field">
                                        <input id="new-password" className="form-control"
                                            type={`${this.state.showPassword ? 'text' : 'password'}`}
                                            value={this.state.newPassword}
                                            onChange={e => this.setState({ newPassword: e.target.value })}
                                            onBlur={e => { this.passwordValidate(); this.validPassword(); }}
                                            onKeyDown={e => { this.passwordValidate(); this.validPassword(); }}
                                        />
                                    </div>
                                    <button type="button" className="btn icon btn-gray1"
                                        onClick={_ => this.setState({ showPassword: !this.state.showPassword })}>
                                        <i className={`feather ${this.state.showPassword ? 'icon-eye-off' : 'icon-eye'}`}></i>
                                    </button>
                                </div>
                                <div className="hint persistent">
                                    Mínimo 6 dígitos, letras e números e ao menos uma maiúscula.
                                    </div>
                            </div>
                            <div className={`form-group ${this.state.passwordConfirmError}`}>
                                <label htmlFor="passwordConfirm">Confirme a senha:</label>
                                <div className="input-group">
                                    <div className="input-field">
                                        <input id="passwordConfirm" className="form-control"
                                            type={`${this.state.showConfirmPassword ? 'text' : 'password'}`}
                                            value={this.state.confirmPassword}
                                            onChange={e => this.setState({ confirmPassword: e.target.value })}
                                            onBlur={e => { this.passwordConfirmValidate(); this.validPassword(); }}
                                            onKeyDown={e => { this.passwordConfirmValidate(); this.validPassword(); }}
                                        />
                                    </div>
                                    <button type="button" className="btn icon btn-gray1" onClick={_ => this.setState({ showConfirmPassword: !this.state.showConfirmPassword })}><i className={`feather ${this.state.showConfirmPassword ? 'icon-eye-off' : 'icon-eye'}`}></i></button>
                                </div>
                                <div className="hint">As senhas não correspondem.</div>
                            </div>
                        </>
                    }
                    footer={
                        <>
                            <button className="btn btn-gray1"
                                onClick={() => { this.setState({ passwordModal: false, profileModal: true, disabled: true }); this.setState({ oldPassword: '', confirmNewPassword: '', confirmPassword: '', password: '', newPassword: '' }) }}>
                                Cancelar
                            </button>
                            <button disabled={this.state.disabled} onClick={e => (this.recoverPassword())} className="btn btn-green">
                                Alterar
                            </button>
                        </>
                    }>
                </Dialog> */}
                {/* <Dialog title={getInfoStatus(status).title} size="sm" show={open ? open : false} onHide={e => onClose()}
                    body={
                        <>
                            <div className="pb-3">
                                <h5 className="text-color-primary">{title}</h5>
                                <div className="divider hr"></div>
                                {getInfoStatus(status).info && <small><b className="text-color-danger">Lembre-se: </b>{getInfoStatus(status).info}</small>}
                            </div>
                        </>
                    }
                    footer={
                        <>
                            <button className="btn btn-gray1" onClick={e => onClose()}>
                                Cancelar
                            </button>
                            <button className={`btn ${getInfoStatus(status).btnClass} ml-auto`} onClick={e => onChange()}>
                                {getInfoStatus(status).btnLabel}
                            </button>
                        </>
                    }>
                </Dialog> */}
            </>
        );
    }
}

export default Header;