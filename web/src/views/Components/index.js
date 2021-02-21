import React, { useState, useEffect } from "react";
import ResearchCard from '../Components/ResearchCard.js';
import PopOver from "../Components/PopOver.js";
import Avatar from "../Components/Avatar.js";
import Tooltip from "../Components/Tooltip.js";
import Header from "../Components/Header.js";
import Dialog from "../Components/Dialog.js";
import Dropdown from "../Components/Dropdown";
import LoadingCategoriesPanel from '../Components/Shimmer/LoadingCategoriesPanel.js';
import api from "../../services/api";
import Utils from "../../services/utils";
import moment from 'moment'
import researchHelper from "../../helpers/researchHelper.js";
import EmptyState from "../Components/EmptyState.js";
import Checkbox from "../Components/Checkbox.js";
import Switch from "../Components/Switch.js";

export default function Home() {

    const [Dialog_NewMember, setDialog_NewMember] = useState(false);
    const [Dialog_Chart, setDialog_Chart] = useState(false);
    const [Dialog_NewResearch, setDialog_NewResearch] = useState(false);
    const [Dialog_ChangeCategoryResearch, setDialog_ChangeCategoryResearch] = useState(false);
    const [Dialog_RenameResearch, setDialog_RenameResearch] = useState(false);
    const [Dialog_DeleteResearch, setDialog_DeleteResearch] = useState(false);
    const [Dialog_CloseResearch, setDialog_CloseResearch] = useState(false);
    const [Dialog_LogResearch, setDialog_LogResearch] = useState(false);
    const [Dialog_RenameCategory, setDialog_RenameCategory] = useState(false);
    const [Dialog_DeleteCategory, setDialog_DeleteCategory] = useState(false);
    const [Dialog_DeleteCategoryStep2, setDialog_DeleteCategoryStep2] = useState(false);
    const [Dialog_RemoveMember, setDialog_RemoveMember] = useState(false);
    const [Dialog_BlockMember, setDialog_BlockMember] = useState(false);
    const [deleteCategoryTitle, setDeleteCategoryTitle] = useState('Excluir Categoria');
    const [ShowCategoryList, setShowCategoryList] = useState(false);

    const [check_Encerrada, setcheckEncerrada] = useState(null);

    const [load, setLoad] = useState(false)
    const [loading, setLoading] = useState(true)
    const [researchs, setResearchs] = useState([])
    const [tenants, setTenants] = useState([])
    const [categories, setCategories] = useState([])
    const [filtroStatus, setFiltroStatus] = useState("Publicada")
    // const [lastList, setLastList] = useState("minhas")
    const [filterCategory, setFilterCategory] = useState([])
    const [users, setUsers] = useState([])
    const [userInfo, setUserInfo] = useState({})
    const [addCategory, setAddCategory] = useState(false)
    const [newCategory, setNewCategory] = useState("")
    const [modelResearch, setModelResearch] = useState({ title: "", date: "", status: "Publicada", category: "", owner: "", users: "" })
    const [modelUser, setModelUser] = useState([]);
    const [modelCategory, setModelCategory] = useState({ title: "", description: "" });
    const [logs, setLogs] = useState([]);
    const [newMember, setNewMember] = useState(false);
    const [myListTotal, setMyListTotal] = useState(0);
    const [otherListTotal, setOtherlistTotal] = useState(0);

    // const [myListResearchs, setMyListResearchs] = useState([]);
    // const [otherListResearchs, setOtherListResearchs] = useState([]);
    const [allCategoriesByResearchs, setAllCategoriesByResearchs] = useState([]);

    const [filtredCategories, setFiltredCategories] = useState([])
    const [errors, setErrors] = useState([]);
    const [empty, setEmpty] = useState(false);
    const [activeTab, setActiveTab] = useState('my');
    const [emailError, setEmailError] = useState('');
    const [nameError, setNameError] = useState('');
    const [tenantDefault, setTenantDefault] = useState('');
    const [statusResearchProps, setStatusResearchProps] = useState([]);

    useEffect(() => {
        if (!localStorage.getItem("token") || !localStorage.getItem("userInfo")) {
            window.location.href = "/Login"
        }
        if (localStorage.getItem('check_Encerrada') && localStorage.getItem('check_Encerrada') === 'true') {
            setcheckEncerrada(true);
        } else {
            setcheckEncerrada(false);
        }
        totalResearchs();
        Mylist(filtroStatus);
        GetUserInfos();
        listLogs();
        getTenants();
        setDefaultTenants();
    }, [load])
    const Userslist = async () => {
        const getTenant = JSON.parse( localStorage.getItem("selected"))
        //get actual tenant _id
        const id = getTenant._id
        //get users from datbase actual
        const usersBaseActual = (await api.get('users/')).data
        //get users from users database from aggregate by the operator
        const usersList = (await api.get(`operators/getByUser?_id=${id}`)).data
        var newArr = []
        // fill newArr with operators by email
        for(let i =0; i< usersBaseActual.length; i++){
            var value = usersBaseActual[i].email;
           
            newArr.push(usersList.filter(e=>e.email == value).map((res, index)=>{
                return res.operators
            }))
        }
        //get operators of the array newArr and populate from the index 
        usersBaseActual.forEach((element, index )=> {
            !newArr[index][0] || !newArr[index][0].invited  ? element.invited = false : element.invited = true
        });
        //set modelUser with users of the database actual with operators of the user's database order by email and operator id
        setModelUser(usersBaseActual)
        setUsers(usersBaseActual);
    }
    const getTenants = async () =>{
        // //clear
        // setModelUser([])
        // setUsers([])
        const info = JSON.parse(localStorage.getItem("userInfo"))//{email:"espinharagsilva@outlook.com"}//
        const allTenants = (await api.get("operators/")).data
        const getTenantsByUser = (await api.get(`users/getByEmailDBOperator?email=${info.email}`)).data
        var newArr = []
        for (let index = 0; index < getTenantsByUser.model.length; index++) {
            var value = getTenantsByUser.model[index]._id
            newArr.push( allTenants.filter(e => e._id == value).map(res =>{
                return {_id:res._id, nickname: res.nickname, collection: res.collection}
            }))
        }
        setTenants(newArr);
        const defaultTenant = JSON.parse(localStorage.getItem("selected"))    
        if( defaultTenant== "undefined" || defaultTenant== null  || defaultTenant.nickname == ""|| defaultTenant.nickname == null){
            localStorage.setItem("selected", JSON.stringify(newArr[0][0]))
            window.location.href = "/start"
        }
    }
    const setDefaultTenants = async ()=>{
        setModelUser([])
        setUsers([])
        const defaultTenant = JSON.parse(localStorage.getItem("selected"))    
        if( defaultTenant== "undefined" || defaultTenant== null  || defaultTenant.nickname == ""|| defaultTenant.nickname == null){
            await getTenants()
            setTenantDefault(tenants[0])
            setTimeout(()=>{
                Userslist()
    
            }, 300)
            
        }else{
            setTenantDefault(defaultTenant.nickname)
            //await api.get(`system/changeTenant?_id=${defaultTenant._id}`)
            setTimeout(()=>{
                Userslist()
    
            }, 300)
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

    const handleClick = async (item) =>{
        const setvalue = item
        localStorage.setItem("selected",JSON.stringify(setvalue))
        api.get(`system/changeTenant?_id=${setvalue._id}`).then(()=>{
            setTimeout(()=>{
                
                window.location.href = "/start"
                
            }, 300)
            
        })
    }

    const listCategories = async (list) => {
        //setLoading(true);
        // setCategories((await api.get("categories/")).data);

        const categories = (await api.get("categories/")).data;
        const cat = [];
        const filterCategoria = [];
        categories.map((item, index) => {
            let c = 0;
            list.map((i, index2) => {
                if (item._id == i.category)
                    c++;
            });

            if (c > 0) {
                let iC = "";
                filterCategory.map((cat, index3) => {
                    if (item._id == cat.category)
                        iC = cat.filter;
                });
                /*if (iC == "") {
                    cat.push({ category: item, filter: "Publicada" });
                    filterCategoria.push({ category: item._id, filter: "Publicada" });
                } else {
                    cat.push({ category: item, filter: iC });
                    filterCategoria.push({ category: item._id, filter: iC });
                }*/
                cat.push({ category: item, filter: iC });
                filterCategoria.push({ category: item._id, filter: iC });

            }
        });
        // alert(JSON.stringify(filterCategoria));
        setFilterCategory(filterCategoria);
        setCategories(cat);

        setLoading(false);
    }

    const listLogs = async () => {
        setLogs((await api.get("logs/")).data);
    }

    const filterResearchs = (category, array) => {
        let result = array.filter((item) => {
            return item.category == category && !item.deleted
        });
        return result;
    }

    const editMember = (item) => {
        if(userInfo.type === 0) return false;
        if (!item) {
            setModelUser({ name: "", email: "", type: "", status: true, pending: true });
            setNewMember(true);
        } else {
            item.name = item.fullName ? item.fullName : item.name;
            setModelUser(item);
            setNewMember(false);
        }
        setDialog_NewMember(true)
    }



    const Mylist = async (status, toggleBtn) => {

        try {
            //setLoading(true);
            if (toggleBtn) {
                setActiveTab('my');
            }
            api.get("researches/myresearchs")
                .then(async res => {
                    setLoading(false);
                    if (res.data.length == 0) {
                        Otherlist();
                        return false;
                    }
                    setResearchs(res.data);
                    listCategories(res.data);
                    // setMyListTotal(res.data.length);
                    // var mybutton = document.getElementById("myButton");
                    // mybutton.classList.remove("off");
                    // var otherbutton = document.getElementById("otherButton");
                    // otherbutton.classList.add("off");
                })
                .catch(err => {
                    setLoading(false);
                    addSnackbar('error', err.message, 'icon-alert-octagon')
                })
        } catch (err) {
            setLoading(false);
            // chamar snackbar com a mensagem:
            // Houve um problema ao pesquisar suas pesquisas, tente novamente em instantes.
        }
    }

    const Otherlist = async (status, toggleBtn) => {
        try {
            //setLoading(true);
            if (toggleBtn || myListTotal === 0) {
                setActiveTab('other');
            }
            await api.get("researches/otherresearchs")
                .then(async res => {
                    setResearchs(res.data);
                    listCategories(res.data);
                    // setOtherlistTotal(res.data.length);
                    // var mybutton = document.getElementById("myButton");
                    // mybutton.classList.add("off");
                    // var otherbutton = document.getElementById("otherButton");
                    // otherbutton.classList.remove("off");
                    //var newResearch_btn = document.getElementById("newResearch_button");
                    //newResearch_btn.style.display = "none";

                    setLoading(false);
                })
                .catch(err => {
                    addSnackbar('error', 'Outras pesquisas: ' + err.message, 'icon-alert-octagon')
                })
        } catch (err) {
            // chamar snackbar com a mensagem:
            // Houve um problema ao pesquisar as pesquisas, tente novamente em instantes.
        }
    }

    // const getOtherListTotal = async () => {
    //     const list = ((await api.get("researches/otherresearchs")).data)
    //     setOtherlistTotal(list.length);

    // }

    const totalResearchs = async () => {
        const my = ((await api.get("researches/myresearchs")).data);
        const other = ((await api.get("researches/otherresearchs")).data);
        const categories = (await api.get("categories/")).data;
        let myTotal = [];
        let otherTotal = [];

        if(localStorage.getItem('check_Encerrada') && localStorage.getItem('check_Encerrada') === 'true') {
            myTotal = my.filter(e => e.category && !e.deleted);
            otherTotal = other.filter(e => e.category && !e.deleted);
        } else {
            myTotal = my.filter(e => e.category && !e.deleted && e.status !== 'Encerrada');
            otherTotal = other.filter(e => e.category && !e.deleted && e.status !== 'Encerrada');
        }

        const allResearchs = my.concat(other);
        const cat = [...new Set(allResearchs.filter(e => e.category).map(item => item.category))];
        const list = [];

        categories.map(e => {
            if(cat.indexOf(e._id) !== -1) {
                list.push({ category: e });
            }
        });

        setAllCategoriesByResearchs(list);

        setMyListTotal(myTotal.length);
        setOtherlistTotal(otherTotal.length);
        if (myTotal.length === 0 && otherTotal.length === 0) {
            setEmpty(true);
        }
        if (myTotal.length == 0) {
            Otherlist('', true);
        } else if(otherListTotal.length === 0) {
            Mylist('', true);
        }
    }
    const changeValue = (field, value) => {
        let tempModel = JSON.parse(JSON.stringify(modelUser))
        tempModel[field] = value;
        setModelUser(tempModel);
    }

    const changeValueResearch = (field, value) => {
        let tempModel = JSON.parse(JSON.stringify(modelResearch))
        tempModel[field] = value;
        setModelResearch(tempModel);
    }

    const changeValueCategory = (field, value) => {
        let tempModel = JSON.parse(JSON.stringify(modelCategory))
        tempModel[field] = value;
        setModelCategory(tempModel);
    }


    const editResearch = (item) => {
        if (!item) {
            var data = new Date();
            setModelResearch({ title: "", date: data, status: "Publicada", category: "", owner: userInfo.id });
        } else {
            setModelResearch(item)
        }
        setAddCategory(false);
        setDialog_NewResearch(true);
        //setEditing(true);
    }

    const emailValidate = () => {
        const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const result = regex.test(String(modelUser.email).toLowerCase());
        if (!result) {
            setEmailError('has-error');
        } else {
            setEmailError('');
        }
    }

    const nameValidate = () => {
        if (modelUser.name.length < 2 || modelUser.name.length > 50) {
            setNameError('has-error');
        } else {
            setNameError('');
        }
    }

    const validMember = () => {
        if (!newMember) return true;
        const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const result = regex.test(String(modelUser.email).toLowerCase());
        return modelUser.type && (modelUser.name.length > 2 && modelUser.name.length < 50) && result;
    }
    // useEffect(() => {
    //     Userslist()
    // })
    //convite
    const saveUser = async (e) => {
        const defaultTenant = JSON.parse(localStorage.getItem("selected")) 
        const model = {...modelUser, operators:{...defaultTenant}}
        if(e.toString() == 'Salvar'){
            api.put("users/update", model).then(res=>{
                if(res.data.status == "ok"){
                    addSnackbar('success', 'Dados alterados com sucesso.', 'icon-check'); 
                }else{
                    addSnackbar('error', res.data.status, 'icon-alert-octagon')
                }
                setDialog_NewMember(false);
                Userslist();
            })
        }else if(e.toString() == "Convidar"){
            api.post("users/", model).then(res =>{
                if(res.data.status == "ok"){
                    if (!modelUser._id) {
                        api.post("users/wellcome", { email: modelUser.email, tenant:defaultTenant.nickname })
                        addSnackbar('success', 'Convite enviado com sucesso.', 'icon-check');
                    } else {
                        addSnackbar('error', res.data.status, 'icon-alert-octagon')
                    }
                    setDialog_NewMember(false);
                }
                Userslist();
            })
        }else if(e.toString() ==  "Reenviar Convite"){
            try{
                await api.post("users/wellcome", { email: modelUser.email, tenant:{nickname: defaultTenant.nickname, _id: defaultTenant._id} })
                addSnackbar('success', 'Convite reenviado com sucesso.', 'icon-check');
                setDialog_NewMember(false);    
            }catch(err){
                addSnackbar('error', 'Ocorreu um erro ao tentar reenviar o convite.', 'icon-alert-octagon');
            }
        }
    }

    const removeMember = async () => {

        try {
            modelUser.deleted = true;
            await api.post("users/", modelUser).then(res => {
                Userslist();
                setDialog_NewMember(false);
                setDialog_RemoveMember(false);
            })
            addSnackbar('success', 'Membro removido com sucesso.', 'icon-check')
        } catch (err) {
            addSnackbar('error', 'Houve um problema ao remover este membro', 'icon-alert-octagon')
        }


    }

    const blockMember = (status) => {
        changeValue('status', status);
        let msg = `Membro ${status ? 'Desbloqueado' : 'Bloqueado'} com sucesso.`;
        addSnackbar('success', msg, 'icon-check');
        setDialog_BlockMember(false);
    }

    const isEditing = () => {
        return modelUser._id && modelUser.name && 'disabled'
    }

    const validResearch = () => {
        return (modelResearch.category || newCategory) && modelResearch.title
    }
    const saveResearch = async () => {
        let tempModel = JSON.parse(JSON.stringify(modelResearch))
        if (addCategory) {
            const postData = { title: newCategory, description: newCategory };
            const res_category = (await api.post("categories/", postData)).data.model;
            tempModel.category = res_category._id
        }


        if (tempModel.category && tempModel.title) {
            api.post("researches/", tempModel).then(res => {
                Mylist(filtroStatus);
                Otherlist(filtroStatus);
                setDialog_NewResearch(false);
                window.location.href = "/research/" + res.data.model._id;
            });
        }
    }

    const openChart = () => {
        setDialog_Chart(true);
    }

    const remove = async (id) => {
        (await api.delete("researches/" + id));
        Mylist(filtroStatus);
    }

    /************************
     * Atualizar Research
     * 
     * vincular usuário
     */

    const saveUserResearch = async (idResearch, iduser) => {
        try {
            //setLoading(true);
            await api.post("researches/saveUsers", { idResearch: idResearch, idUser: iduser })
                .then(async res => {
                    if (res.data.status === "ok") {
                        updateResearchs(res.data.model);
                        // Mylist(filtroStatus);
                        addSnackbar('success', 'Membro inserido com sucesso.', 'icon-check')
                    } else {
                        //alert(res.data.status);
                        addSnackbar('error', res.data.status, 'icon-alert-octagon')
                    }
                    //setLoading(false);
                })
                .catch(err => {
                    addSnackbar('error', err.message, 'icon-alert-octagon')
                    // alert("nao conseguiu");
                })
        } catch (err) {
            addSnackbar('error', err.message, 'icon-alert-octagon')
            // alert("erro no try");
        }
    }

    const deleteUserResearch = async (idResearch, iduser) => {
        try {
            //setLoading(true);
            await api.post("researches/deleteUsers", { idResearch: idResearch, idUser: iduser })
                .then(async res => {
                    if (res.data.status === "ok") {
                        // Mylist(filtroStatus);
                        updateResearchs(res.data.model);
                        addSnackbar('success', 'Membro removido com sucesso.', 'icon-check')
                    } else {
                        //alert(res.data.status);
                        addSnackbar('error', res.data.status, 'icon-alert-octagon')
                    }
                    //setLoading(false);
                })
                .catch(err => {
                    addSnackbar('error', err.message, 'icon-alert-octagon')
                    // alert("nao conseguiu");
                })
        } catch (err) {
            addSnackbar('error', err.message, 'icon-alert-octagon')
            // alert("erro no try");
        }
    }

    const copyResearch = async (id) => {
        let list = [...researchs];
        await researchHelper.copy(id).then(e => {
            // Mylist(filtroStatus);
            list.push(e.data.model);
            addSnackbar('success', 'Pesquisa duplicada com sucesso.', 'icon-check');
            Open_RenameResearch(e.data.model);
        });
        setResearchs(list);
        totalResearchs();
    }

    const Open_ChangeCategoryResearch = (research) => {
        setModelResearch(research);
        setDialog_ChangeCategoryResearch(true);
    }

    const Open_RenameResearch = (research) => {
        setModelResearch(research);
        setDialog_RenameResearch(true);
    }

    const Open_DeleteResearch = (research) => {
        setModelResearch(research);
        setDialog_DeleteResearch(true);
    }

    const Open_CloseResearch = (research) => {
        setModelResearch(research);
        setDialog_CloseResearch(true);
    }

    const Open_LogResearch = (research) => {
        setModelResearch(research);
        setDialog_LogResearch(true);
    }

    const Open_RenameCategory = (categoryFilter) => {
        setModelCategory(categoryFilter.category);
        setDialog_RenameCategory(true);
    }

    const Open_DeleteCategory = (category) => {
        setModelCategory(category);
        setDialog_DeleteCategory(true);
    }
    const Open_Dialog_DeleteCategoryStep2 = () => {
        setDeleteCategoryTitle('Excluir categoria');
        setDialog_DeleteCategoryStep2(true);
        setDialog_DeleteCategory(false);
    }
    const resetCategoryDialog = () => {
        setDeleteCategoryTitle('Excluir categoria');
        setDialog_DeleteCategoryStep2(false);
        setDialog_DeleteCategory(false);
        setShowCategoryList(false);
    }
    const updateResearchs = (model) => {
        let list = [];
        for (const research of researchs) {
            let item = JSON.parse(JSON.stringify(research))
            if (item._id == model._id) {
                list.push(model);
            } else {
                list.push(item);
            }
        }
        setResearchs(list);
        totalResearchs();
    }

    const pushNewCategories = (model) => {
        let list = [...categories];
        list.push({ category: model });
        setCategories(list);
    }

    const updateCategories = (model) => {
        let list = [];
        for (const category of categories) {
            let item = JSON.parse(JSON.stringify(category))
            if (item.category._id == model._id) {
                list.push({category: model});
            } else {
                list.push({ category: item });
            }
        }
        
        setCategories(list);
    }

    const changeCategoryResearch = async () => {
        let tempModel = JSON.parse(JSON.stringify(modelResearch))
        if (addCategory) {
            const postData = { title: newCategory, description: newCategory };
            const res_category = (await api.post("categories/", postData)).data.model;
            tempModel.category = res_category._id
            pushNewCategories(res_category);
        }
        if (tempModel.category && tempModel.title) {
            researchHelper.save(tempModel).then(e => {
                updateResearchs(e.data.model);
                setDialog_ChangeCategoryResearch(false);
            });
        }
    }

    const moveResearchs = () => {
        setDeleteCategoryTitle('Mover Pesquisas');
        filterCategories();
        setShowCategoryList(true);
    }
    const renameResearch = () => {
        researchHelper.save(modelResearch).then(e => {
            updateResearchs(e.data.model);
            setDialog_RenameResearch(false);
            addSnackbar('success', 'Pesquisa renomeada com sucesso.', 'icon-check');
        });
    }

    const deleteResearch = () => {
        modelResearch.deleted = true;
        researchHelper.save(modelResearch).then(e => {
            updateResearchs(e.data.model);
            // Mylist(filtroStatus);
            setDialog_DeleteResearch(false);
            addSnackbar('success', 'Pesquisa excluida com sucesso.', 'icon-check');
        });
    }

    // const closeResearch = (research) => {
    //     research.status = "Encerrada";
    //     researchHelper.save(research).then(e => {
    //         updateResearchs(e.data.model);
    //         closeEndModal();
    //         addSnackbar('success', 'Pesquisa encerrada com sucesso.', 'icon-check');
    //     });
    // }

    const renameCategory = async () => {
        if (modelCategory.title) {
            await api.post("categories/", modelCategory).then(res => {
                setDialog_RenameCategory(false);
                updateCategories(modelCategory);
                updateResearchs(res.data.model);
                //listCategories(res.data.model);
                // Mylist(filtroStatus);
            });
            addSnackbar('success', 'Categoria renomeada com sucesso.', 'icon-check');
        }
    }

    const filterCategories = () => {

        const filterCategory = categories.filter(e => {
            return e._id != modelCategory._id
        });

        setFiltredCategories(filterCategory);
    }

    const deleteCategory = async (action) => {

        let tempModel = JSON.parse(JSON.stringify(modelResearch));
        const res = filterResearchs(modelCategory.category._id, researchs);
        var categoria = '';

        if (addCategory) {
            const postData = { title: newCategory, description: newCategory };
            const res_category = (await api.post("categories/", postData)).data.model;
            tempModel.category = res_category._id;
            categoria = res_category.title;
        } else {
            categoria = modelCategory.category.title;
        }

        res.map(e => {
            if (action == 'delete') e.deleted = true;
            if (action == 'move') e.category = tempModel.category;

            researchHelper.save(e).then(e => {
                updateResearchs(e.data.model);
                // Mylist(filtroStatus);
                // Otherlist(filtroStatus);
                setDialog_DeleteCategoryStep2(false);
            });
        })

        api.delete(`categories/${modelCategory.category._id}`).then(res => {
            //listCategories();
            // Mylist(filtroStatus);
            if (action == 'delete') {
                addSnackbar('success', 'Categoria excluida com sucesso.', 'icon-check');
            }
            if (action == 'move') {
                addSnackbar('success', `A pesquisa foi movida para ${categoria}`, 'icon-check');
            }
        });

    }

    const saveResearchStatus = async (research, status) => {
        research.status = status;
        await api.post("researches/", research).then(res => {
            updateResearchs(res.data.model);
            closeStatusModal();
            // Mylist(filtroStatus);
        });
        if (status === 'Interrompida') {
            addSnackbar('warning', 'A pesquisa foi interrompida.', 'icon-alert-octagon')
        }
        if (status === 'Encerrada') {
            addSnackbar('success', 'A pesquisa foi encerrada.', 'icon-check');
        }
    }

    const changeFiltro = (value, id) => {
        //Atualizar variavel filtro
        const listCatFilter = filterCategory;
        listCatFilter.map((item, index) => {
            if (item.category == id) {
                item.filter = value;
            }
        });
        setFilterCategory(listCatFilter);
        // setFilterCategory(listCatFilter);
        //Chamar MyList e OtherList para atualizar a lista e exibir filtrado
        if (activeTab == "my")
            Mylist(value);
        else if (activeTab == "other")
            Otherlist(value);
    }

    const addSnackbar = (type = 'warning', message = 'teste', icon) => {
        let errs = [...errors];
        errs.push({ type, message, icon })
        setErrors(errs);
        controlSnackbars();
    }

    const controlSnackbars = () => {
        let snackbars = document.querySelectorAll('.snackbar');
        for (let i = 0; i < snackbars.length; i++) {
            snackbars[i].addEventListener('animationend', (e) => {
                e.target.remove();
            });
        }
    }

    const closeSnackbar = (e) => {
        e.target.parentElement.remove();
    }

    const openStatusModal = (research, status) => {
        setStatusResearchProps({
            status,
            title: research.title,
            open: true,
            onClose: () => closeStatusModal(),
            onChange: () => saveResearchStatus(research, status)
        })
    }

    const closeStatusModal = () => {
        setStatusResearchProps({
            status: '',
            title: '',
            open: false,
            onClose: null,
            onChange: null
        })
    }

    const visualizarEncerradas = () => {
        localStorage.setItem('check_Encerrada', !check_Encerrada);
        setcheckEncerrada(!check_Encerrada);
    }

    return (
        <>

            <div className="snackbar-wrapper">
                {errors.map((e, i) =>
                    <div className={`snackbar ${e.type}`} key={i}>
                        <div className="snackbar-content">
                            <i className={`feather ${e.icon} mr-1`}></i>
                            {e.message}
                        </div>
                        <button className="btn xs icon" onClick={e => closeSnackbar(e)}><i className="feather icon-x"></i></button>
                    </div>
                )}
            </div>
            <main>
                {/* Header */}
                <Header tenants={tenants} handleClick={e=> handleClick(e)} currentTenant={tenantDefault} userType={userInfo.type} userStatus={userInfo.status} name={userInfo.fullName} userId={userInfo.id} email={userInfo.email} statusResearchProps={statusResearchProps}>
                </Header>

                {/* Content */}
                <div className="content">
                    <div id="myTeam" className="container md pt-0">
                        <div className="title">Equipe &nbsp;<span className="badge badge-gray3 ghost">{getTeam().length}</span></div>
                        <div className="avatar-wrapper">
                            {getTeam().map((item, index) => {
                                return <span key={index} onClick={e => editMember(item)}>
                                    <PopOver trigger={<Avatar initials={Utils.getAcronym(item.name)} size="" pending={item.invited?true:false} user={item.type} email={item.email}></Avatar>}>
                                        <Avatar initials={Utils.getAcronym(item.name)} size="lg" user={item.type} pending={item.invited?true:false} user={item.type} email={item.email}></Avatar>
                                        <h6 className="popover-title">{item.name}</h6>
                                        <small>{item.email}</small>
                                    </PopOver>
                                </span>
                            })}
                            {userInfo.type === 1 && 
                                <Tooltip y="top" trigger={
                                    <button className="btn icon btn-gray2 rounded hover-primary" onClick={e => editMember(null)}>
                                        <i className="feather icon-plus font-size-18"></i>
                                    </button>
                                }>
                                    <span>Convidar novo membro</span>
                                </Tooltip>
                            }
                        </div>
                    </div>
                    <div className="container md pb-3">
                        {(empty && !loading) && <EmptyState />}
                        <div id="newResearch_button" className={`container mt-5 mb-2 px-0`}>
                            <button className={`btn btn-green ${empty ? 'mx-auto' : 'xl'}`} data-icon="&#xe9b1;" onClick={e => editResearch(null)}>
                                Nova Pesquisa
                                {empty && <i className="feather icon-plus-circle ml-1"></i>}
                            </button>
                        </div>
                    </div>

                    <div className="container md mt-5">
                        {(!empty) &&
                            <div className="title-group">
                                {myListTotal > 0 &&
                                    <a id="myButton" onClick={e => Mylist(filtroStatus, true)} className={`title mr-10 ${activeTab === 'other' ? 'off' : ''}`}>Minhas Pesquisas &nbsp;<span className="badge badge-gray3 ghost">{myListTotal}</span></a>
                                }
                                {otherListTotal > 0 &&
                                    <a id="otherButton" onClick={e => Otherlist(filtroStatus, true)} className={`title ${activeTab === 'my' ? 'off' : ''}`}>Outras Pesquisas &nbsp;<span className="badge badge-gray3 ghost">{otherListTotal}</span></a>
                                }
                                <div className="ml-auto">
                                    <Tooltip y="top" trigger={
                                        <Switch switchId="checkEncerrada" label="Encerradas" checked={check_Encerrada} onChange={e => {visualizarEncerradas(); totalResearchs()}}></Switch>
                                    }>
                                        Visualizar Encerradas
                                    </Tooltip>
                                </div>
                            </div>
                        }

                        <div className="card-container">
                            {(loading) && <LoadingCategoriesPanel />}
                            {(!loading && !empty) && categories.map((item, index) => {
                                {
                                    var researchsByCategory = filterResearchs(item.category._id, researchs);

                                    let cstatus = [];
                                    //cstatus = [...new Set(researchsByCategory.filter(e => e.status != 'Encerrada').map(item => item.status))];

                                    if (check_Encerrada == false) {
                                        cstatus = [...new Set(researchsByCategory.filter(e => e.status != 'Encerrada').map(item => item.status))]
                                    } else {
                                        cstatus = [...new Set(researchsByCategory.map(item => item.status))]
                                    }


                                    if (cstatus.length > 0) {
                                        return <React.Fragment key={index}>
                                            <div className="card-container-title" >
                                                <div className="d-flex align-items-center"><i className="feather icon-folder mr-1"></i>{item.category ? item.category.title : ""}</div>
                                                <div className="d-flex">

                                                    {cstatus.length > 1 &&
                                                        <div className="form-group">
                                                            <select name="" className="form-control form-control-ghost" id="" value={item.filter} onChange={e => changeFiltro(e.target.value, item.category._id)}>
                                                                <option value="" disabled>Filtrar por status</option>
                                                                {cstatus && cstatus.map(e => (e) && <option value={e} key={e}>{e}</option>)}
                                                                <option value="">Todas</option>
                                                            </select>
                                                        </div>
                                                    }
                                                    <Dropdown y="bottom" x="right" title="" icon="" trigger={
                                                        <button className="btn btn-bg icon sm ml-1 active-gray"><i className="feather icon-more-vertical font-size-20"></i></button>
                                                    }>
                                                        <div onClick={() => { Open_RenameCategory(item) }} className="dropdown-content-item font-weight-400 text-none">
                                                            <span className="dropdown-item-icon">
                                                                <i className="feather icon-tag"></i>
                                                            </span>
                                                            Renomear
                                                        </div>
                                                        <div onClick={() => { Open_DeleteCategory(item) }} className="dropdown-content-item text-color-danger font-weight-400 text-none">
                                                            <span className="dropdown-item-icon">
                                                                <i className="feather icon-trash-2"></i>
                                                            </span>
                                                            Excluir Categoria
                                                        </div>
                                                    </Dropdown>
                                                </div>
                                            </div>

                                            <div className="card-container-wrapper">
                                                {/*alterar if  */}
                                                {researchsByCategory.filter(e => !check_Encerrada ? e.status != 'Encerrada' : e.status).map((itemR, indexR) => {
                                                    {

                                                        if (!check_Encerrada && item.filter == 'Encerrada') {
                                                            return item.filter = ''
                                                        }
                                                        // if ( ( itemR.status == 'Publicada' && item.filter != 'Interrompida') 
                                                        // || ( itemR.status == 'Encerrada' && check_Encerrada) 
                                                        // || ( itemR.status ==  'Interrompida' && item.filter != 'Publicada') )
                                                        //  {
                                                        if (!item.filter || (item.filter == itemR.status)) {
                                                            return <React.Fragment key={indexR}>
                                                                <ResearchCard
                                                                    id={itemR._id}
                                                                    name={itemR.title}
                                                                    date={moment(itemR.date).format('DD/MM/YYYY')}
                                                                    status={itemR.status}
                                                                    usersAttach={itemR.users}
                                                                    users={users}
                                                                    owner={itemR.owner}
                                                                    onChange={(e) => {
                                                                        saveUserResearch(e.researchId, e.userId);
                                                                    }}
                                                                    onChangeDeleteUser={(e) => {
                                                                        deleteUserResearch(e.researchId, e.userId);
                                                                    }}

                                                                    onChangeStatus={(e) => {
                                                                        //    setDialog_CloseResearch(true)
                                                                        openStatusModal(itemR, e.status)
                                                                    }}
                                                                    // onChangeStatus={(e) => {
                                                                    //     saveResearchStatus(indexR, e.status);
                                                                    // }}
                                                                    onCopy={e => { copyResearch(e.researchId) }}
                                                                    onCategory={e => { Open_ChangeCategoryResearch(itemR) }}
                                                                    onRename={e => { Open_RenameResearch(itemR) }}
                                                                    onDelete={e => { Open_DeleteResearch(itemR) }}
                                                                    onClose={e => { Open_CloseResearch(itemR) }}
                                                                    onLog={e => { Open_LogResearch(itemR) }}
                                                                    onClick={openChart}
                                                                ></ResearchCard>
                                                            </React.Fragment>
                                                        }
                                                    }

                                                })}
                                            </div>
                                        </React.Fragment>
                                    }
                                }
                            })}
                        </div>

                    </div>

                    <Dialog title="Começe aqui sua nova pesquisa" size="md" show={Dialog_NewResearch} onHide={e => setDialog_NewResearch(false)} body={
                        <>
                            <div className="form-group">
                                <label htmlFor="researchName">Qual o nome da sua pesquisa?</label>
                                <div className="input-group">
                                    <div className="input-field"><input id="researchName" value={modelResearch.title} onChange={e => changeValueResearch("title", e.target.value)} className="form-control" type="text" /></div>
                                </div>
                                <div className="hint">Informe o nome da pesquisa</div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="name">Categoria</label>
                                <div className="input-group">
                                    <div className="input-field">
                                        {!addCategory && <select id="name" className="form-control" value={modelResearch.category} onChange={e => changeValueResearch("category", e.target.value)} required>
                                            <option value="">Selecione...</option>
                                            {allCategoriesByResearchs.map((item, index) => {
                                                if (item.category) {
                                                    return <option value={item.category._id} key={index}>{item.category.title}</option>
                                                }
                                            })}
                                        </select>}
                                        {addCategory && <input type="text" placeholder="Nova Categoria" maxLength="50" className="form-control" v-value={newCategory} onChange={e => setNewCategory(e.target.value)} ></input>}
                                    </div>
                                    {addCategory && <Tooltip y="top" trigger={
                                        <button className="btn btn-gray2" onClick={e => { setAddCategory(false) }}>
                                            <i className="feather icon-x"></i>
                                        </button>
                                    }>
                                        <span>Voltar</span>
                                    </Tooltip>}

                                    {!addCategory && <Tooltip y="top" trigger={
                                        <button className="btn btn-gray2" onClick={e => { setAddCategory(true) }}>
                                            <i className="feather icon-plus"></i>
                                        </button>
                                    }>
                                        <span>Nova Categoria</span>
                                    </Tooltip>}


                                </div>
                                <div className="hint">Informe o nome da pesquisa</div>
                            </div>
                        </>
                    }
                        footer={
                            <>
                                <button disabled={!validResearch()} className="btn btn-green ml-auto" onClick={e => saveResearch()}>
                                    Continuar
                                <i className="feather icon-chevron-right ml-1"></i>
                                </button>
                            </>
                        }>
                    </Dialog>

                    <Dialog title="" size="xs" show={Dialog_NewMember} onHide={e => setDialog_NewMember(false)} body={
                        <>
                            <div className="d-flex align-items-end justify-between">
                                <Avatar initials={Utils.getAcronym(modelUser.name)} size="lg" email={modelUser.email}></Avatar>
                                <Tooltip y="top" trigger={
                                    <>

                                        {modelUser.status && !newMember && !modelUser.invited && <button className="btn icon btn-bg active-red" onClick={e => setDialog_BlockMember(true)}>
                                            <i className="feather icon-unlock"></i>
                                        </button>}
                                        {!modelUser.status && !newMember && modelUser.invited && <button className="btn icon btn-red active-red" onClick={e => setDialog_BlockMember(true)}>
                                            <i className="feather icon-lock"></i>
                                        </button>}
                                    </>
                                }>
                                    {modelUser.status ? 'Bloquear' : 'Desbloquear'}
                                </Tooltip>
                                {
                                    //verify if a user is invited
                                (!newMember && modelUser.invited) &&
                                
                                    <span className="text-uppercase">Convite Pendente</span>
                                }
                            </div>
                            <div className="form-group mt-1">
                                <label htmlFor="profile">Tipo de Perfil</label>
                                <div className="input-group">
                                    <div className="input-field">
                                        <select id="name" className="form-control" value={modelUser.type?modelUser.type.toString():"2"} onChange={e => changeValue("type", e.target.value)} required>
                                            <option value="" disabled>Selecione...</option>
                                            <option value="1">Admin</option>
                                            <option value="2">Padrão</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className={`form-group ${nameError}`}>
                                <label htmlFor="name">Nome</label>
                                <div className="input-group">
                                    <div className="input-field">
                                        <input id="profile" value={modelUser.name} disabled={isEditing()}
                                            onChange={e => changeValue("name", e.target.value)}
                                            onBlur={e => { nameValidate(); }}
                                            onKeyDown={e => { nameValidate(); }}
                                            className="form-control" type="text" />
                                    </div>
                                </div>
                                <div className="hint">Informe o nome</div>
                            </div>
                            <div className={`form-group ${emailError}`}>
                                <label htmlFor="email">E-mail</label>
                                <div className="input-group">
                                    <div className="input-field">
                                        <input id="email" value={modelUser.email} disabled={isEditing()}
                                            onChange={e => changeValue("email", e.target.value)}
                                            onBlur={e => { emailValidate(); }}
                                            onKeyDown={e => { emailValidate(); }}
                                            className="form-control" type="text" />
                                    </div>
                                </div>
                                <div className="hint">Informe o e-mail</div>
                            </div>
                        </>
                    }
                    
                        footer={
                            <>
                                {//verify if a user is invited
                                (!newMember) && <>
                                    
                                    <button onClick={() => setDialog_RemoveMember(true)} className="btn btn-danger-ghost">
                                        {modelUser.invited  ? 'Cancelar Convite' : 'Remover membro'}
                                    </button>
                                    
                                </>}


                                <button disabled={!validMember()} className="btn btn-green ml-auto" onClick={e => saveUser(e.target.innerHTML)}>
                                    {newMember ? 'Convidar' : modelUser.invited ? 'Reenviar Convite' : 'Salvar'}
                                </button>
                            </>
                        }>
                    </Dialog>

                    <Dialog title="Pesquisa 1" size="md no-footer" show={Dialog_Chart} onHide={e => setDialog_Chart(false)} body={
                        <iframe src="chart.html" width="100%" height="320px" frameBorder="0"></iframe>
                    }>
                    </Dialog>

                    <Dialog title='Alterar Categoria' size="md" show={Dialog_ChangeCategoryResearch} onHide={e => setDialog_ChangeCategoryResearch(false)}
                        body={
                            <>
                                <div className="form-group">
                                    <label htmlFor="name">Categoria</label>
                                    <div className="input-group">
                                        <div className="input-field">
                                            {!addCategory && <select id="name" className="form-control" value={modelResearch.category} onChange={e => changeValueResearch("category", e.target.value)} required>
                                                <option value="">Selecione...</option>
                                                {allCategoriesByResearchs.map((item, index) => {
                                                    return <option value={item.category._id} key={index}>{item.category.title}</option>
                                                })}
                                            </select>}
                                            {addCategory && <input type="text" placeholder="Nova Categoria" maxLength="50" className="form-control" v-value={newCategory} onChange={e => setNewCategory(e.target.value)} ></input>}
                                        </div>
                                        {addCategory && <Tooltip y="top" trigger={
                                            <button className="btn btn-gray2" onClick={e => { setAddCategory(false) }}>
                                                <i className="feather icon-x"></i>
                                            </button>
                                        }>
                                            <span>Voltar</span>
                                        </Tooltip>}

                                        {!addCategory && <Tooltip y="top" trigger={
                                            <button className="btn btn-gray2" onClick={e => { setAddCategory(true) }}>
                                                <i className="feather icon-plus"></i>
                                            </button>
                                        }>
                                            <span>Nova Categoria</span>
                                        </Tooltip>}
                                    </div>
                                </div>
                            </>
                        }
                        footer={
                            <>
                                <button disabled={!validResearch()} className="btn btn-gray1" onClick={e => setDialog_ChangeCategoryResearch(false)}>
                                    Cancelar
                                </button>
                                <button disabled={!validResearch()} className="btn btn-green" onClick={e => changeCategoryResearch()}>
                                    <i className="feather icon-tag mr-1"></i>
                                    Alterar
                                </button>
                            </>
                        }>
                    </Dialog>

                    <Dialog title='Renomear Pesquisa' size="md" show={Dialog_RenameResearch} onHide={e => setDialog_RenameResearch(false)}
                        body={
                            <>
                                <div className="form-group">
                                    <label htmlFor="researchName">Nome da Pesquisa:</label>
                                    <div className="input-group">
                                        <div className="input-field"><input id="researchName" value={modelResearch.title} onChange={e => changeValueResearch("title", e.target.value)} className="form-control" type="text" /></div>
                                    </div>
                                    <div className="hint">Informe o nome da pesquisa</div>
                                </div>
                            </>
                        }
                        footer={
                            <>
                                <button disabled={!validResearch()} className="btn btn-gray1" onClick={e => setDialog_RenameResearch(false)}>
                                    Cancelar
                                </button>
                                <button disabled={!validResearch()} className="btn btn-green" onClick={e => renameResearch()}>
                                    <i className="feather icon-tag mr-1"></i>
                                    Renomear
                                </button>
                            </>
                        }>
                    </Dialog>

                    <Dialog title='Deseja excluir esta pesquisa?' size="sm" show={Dialog_DeleteResearch} onHide={e => setDialog_DeleteResearch(false)}
                        body={
                            <>
                                <div className="pb-3">
                                    <h5 className="text-color-primary">{modelResearch.title}</h5>
                                    <div className="divider hr"></div>
                                    <small><b className="text-color-danger">Lembre-se:</b> Ao excluir uma pesquisa, esta não poderá ser recuperada. Além disso, você também excluirá os relatórios e as respostas dos participantes.</small>
                                </div>
                            </>
                        }
                        footer={
                            <>
                                <button disabled={!validResearch()} className="btn btn-gray1" onClick={e => setDialog_DeleteResearch(false)}>
                                    Cancelar
                                </button>
                                <button className="btn btn-red ml-auto" onClick={e => deleteResearch()}>
                                    <i className="feather icon-trash-2 mr-1"></i>
                                    Excluir
                                </button>
                            </>
                        }>
                    </Dialog>

                    {/* <Dialog title='Deseja encerrar a pesquisa?' size="sm" show={Dialog_CloseResearch} onHide={e => setDialog_CloseResearch(false)}
                        body={
                            <>
                                <div className="pb-3">
                                    <h5 className="text-color-primary">{modelResearch.title}</h5>
                                </div>
                            </>
                        }
                        footer={
                            <>
                                <button disabled={!validResearch()} className="btn btn-gray1" onClick={e => setDialog_CloseResearch(false)}>
                                    Cancelar
                                </button>
                                <button className="btn btn-primary ml-auto" onClick={e => closeResearch()}>
                                    <i className="feather icon-check-square mr-1"></i>
                                    Encerrar Pesquisa
                                </button>
                            </>
                        }>
                    </Dialog> */}

                    <Dialog title='Log de alterações' size="md" dismissible={true} show={Dialog_LogResearch} onHide={e => setDialog_LogResearch(false)}
                        body={
                            <>
                                <div className="pb-3">
                                    <h5 className="text-color-primary">{modelResearch.title}</h5>
                                    <ul className="list-group px-0">
                                        {logs.map((log, index) => (
                                            <li className="list-item" key={index}>
                                                <div>{log.name}</div>
                                                <div>20/03/2020</div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        }
                        footer={
                            <>
                                <button className="btn btn-gray1 ml-auto" onClick={e => setDialog_LogResearch(false)}>
                                    Voltar
                                </button>
                            </>
                        }>
                    </Dialog>

                    {/* Modals Renomear e deletar categorias  */}
                    <Dialog title='Renomear Categoria' size="md" show={Dialog_RenameCategory} onHide={e => setDialog_RenameCategory(false)}
                        body={
                            <>
                                <div className="form-group">
                                    <label htmlFor="name">Categoria</label>
                                    <div className="input-group">
                                        <div className="input-field">
                                            <input type="text" placeholder="Nova Categoria" maxLength="50" className="form-control" value={modelCategory.title} onChange={e => changeValueCategory("title", e.target.value)}></input>
                                        </div>
                                    </div>
                                </div>
                            </>
                        }
                        footer={
                            <>
                                <button className="btn btn-gray1" onClick={e => setDialog_RenameCategory(false)}>
                                    Cancelar
                                </button>
                                <button disabled={!modelCategory.title} className="btn btn-green" onClick={() => renameCategory()}>
                                    <i className="feather icon-tag mr-1"></i>
                                    Renomear
                                </button>
                            </>
                        }>
                    </Dialog>

                    <Dialog title='Deseja excluir esta categoria?' size="sm" show={Dialog_DeleteCategory} onHide={e => { setDialog_DeleteCategory(false); resetCategoryDialog() }}
                        body={
                            <>
                                <div className="pb-3">
                                    <h5 className="text-color-primary">{modelCategory.title}</h5>
                                </div>
                            </>
                        }
                        footer={
                            <>
                                <button className="btn btn-gray1">
                                    Cancelar
                                </button>
                                <button className="btn btn-red ml-auto" onClick={() => Open_Dialog_DeleteCategoryStep2()}>
                                    <i className="feather icon-trash-2 mr-1"></i>
                                    Excluir
                                </button>
                            </>
                        }>
                    </Dialog>

                    <Dialog title={deleteCategoryTitle} size="md" show={Dialog_DeleteCategoryStep2} onHide={e => { setDialog_DeleteCategoryStep2(false); resetCategoryDialog() }}
                        body={
                            <>
                                {!ShowCategoryList && (
                                    <div className="pb-3">
                                        <div className="text-color-warning font-weight-600 d-flex align-items-center mt-2"><i className="feather icon-alert-triangle mr-1"></i>Existe uma ou mais pesquisas dentro desta categoria, o que deseja fazer?</div>
                                        <div className="divider hr"></div>
                                        <small><b className="text-color-danger">Lembre-se:</b> Ao excluir uma pesquisa, esta não poderá ser recuperada. Além disso, você também excluirá os relatórios e as respostas dos participantes.</small>
                                    </div>
                                )}
                                {ShowCategoryList && (
                                    <div className="form-group">
                                        <label htmlFor="name">Categoria</label>
                                        <div className="input-group">
                                            <div className="input-field">
                                                {!addCategory && <select id="name" className="form-control" value={modelResearch.category} onChange={e => changeValueResearch("category", e.target.value)} required>
                                                    <option value="">Selecione...</option>
                                                    {allCategoriesByResearchs.map((item, index) => {
                                                        if (item.category) {
                                                            return <option value={item.category._id} key={index}>{item.category.title}</option>
                                                        }
                                                    })}
                                                </select>}
                                                {addCategory && <input type="text" placeholder="Nova Categoria" maxLength="50" className="form-control" v-value={newCategory} onChange={e => setNewCategory(e.target.value)} ></input>}
                                            </div>
                                            {addCategory && <Tooltip y="top" trigger={
                                                <button className="btn btn-gray2" onClick={e => { setAddCategory(false) }}>
                                                    <i className="feather icon-x"></i>
                                                </button>
                                            }>
                                                <span>Voltar</span>
                                            </Tooltip>}

                                            {!addCategory && <Tooltip y="top" trigger={
                                                <button className="btn btn-gray2" onClick={e => { setAddCategory(true) }}>
                                                    <i className="feather icon-plus"></i>
                                                </button>
                                            }>
                                                <span>Nova Categoria</span>
                                            </Tooltip>}
                                        </div>
                                    </div>
                                )}
                            </>
                        }
                        footer={
                            <>
                                {(!ShowCategoryList) && <>
                                    <button className="btn btn-red" onClick={() => deleteCategory('delete')}>
                                        <i className="feather icon-trash-2 mr-1"></i>
                                    Excluir Pesquisas
                                </button>
                                    <button className="btn btn-green ml-auto" onClick={() => moveResearchs()}>
                                        <i className="feather icon-shuffle mr-1"></i>
                                    Mover Pesquisas
                                </button>
                                </>}
                                {(ShowCategoryList) && <>
                                    <button disabled={!modelResearch.category} className="btn btn-green ml-auto" onClick={() => { deleteCategory('move'); }}>
                                        <i className="feather icon-shuffle mr-1"></i>
                                    Mover
                                </button>
                                </>}
                            </>
                        }>
                    </Dialog>

                    <Dialog title='Deseja remover este usuário?' size="sm" show={Dialog_RemoveMember} onHide={e => { setDialog_RemoveMember(false) }}
                        body={
                            <>
                                <div className="pb-3">
                                    <h5 className="text-color-primary">{modelUser.name}</h5>
                                </div>
                            </>
                        }
                        footer={
                            <>
                                <button onClick={() => setDialog_RemoveMember(false)} className="btn btn-gray1">
                                    Cancelar
                                </button>
                                <button className="btn btn-red ml-auto" onClick={() => removeMember()}>
                                    <i className="feather icon-trash-2 mr-1"></i>
                                    Excluir
                                </button>
                            </>
                        }>
                    </Dialog>

                    <Dialog title='Deseja bloquear este usuário?' size="sm" show={Dialog_BlockMember} onHide={e => { setDialog_BlockMember(false) }}
                        body={
                            <>
                                <div className="pb-3">
                                    <h5 className="text-color-primary">{modelUser.name}</h5>
                                </div>
                            </>
                        }
                        footer={
                            <>
                                <button onClick={() => setDialog_BlockMember(false)} className="btn btn-gray1">
                                    Cancelar
                                </button>
                                <button className="btn btn-red ml-auto" onClick={() => blockMember(!modelUser.status)}>
                                    <i className="feather icon-trash-2 mr-1"></i>
                                    {modelUser.status ? 'Bloquear' : 'Desbloquear'}
                                </button>
                            </>
                        }>
                    </Dialog>



                </div>
            </main>

        </>
    );
}
