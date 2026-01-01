let currentUser  = {
    name:"",
    email:"",
    password: "",
    about:"",
    skills:[],
}


const setUser = ()=>{
    localStorage.setItem('demoUsers', JSON.stringify([{name: "karan"}]))
}
const getUser = ()=>{
    let data = JSON.parse(localStorage.getItem('demoUsers'))
    console.log('====================================');
    console.log(data);
    console.log('====================================');
}
const updateUser = ()=>{
    let data = JSON.parse(localStorage.getItem('demoUsers'))
    data.push({name: "rajesh"})
    data[0].email = "email"
    
    localStorage.setItem('demoUsers', JSON.stringify(data))
    getUser()
}