let data = localStorage.getItem('DynamicPortfolioCurrentUser')
let currentUser = ''
if (data) {
    currentUser = JSON.parse(data)?.email || '';
}
console.log(currentUser);

let skillsArray =  JSON.parse(localStorage.getItem('DynamicPortfolio'))?.skills || [];
console.log(skillsArray);




function navigateTo(pageId) {
    console.log("navigat fun");
    
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');

        setTimeout(() => { page.classList.add('hidden'); }, 300);
    });


    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active-nav');
    });

    setTimeout(() => {
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.remove('hidden');

            void targetPage.offsetWidth;
            targetPage.classList.add('active');
        }

        const activeLink = document.querySelector(`[onclick="navigateTo('${pageId}')"]`);
        if (activeLink) activeLink.classList.add('active-nav');


        if (pageId === 'portfolio-view') {
            loadPortfolioDataView();
        }
        if (pageId === 'admin-panel') {
            renderEditPage();
        }
    }, 300);
}



const passInput = document.getElementById('passwordInput');
const strengthBar = document.getElementById('strength-bar');
const strengthText = document.getElementById('strength-text');

passInput.addEventListener('input', (e) => {
    const val = e.target.value;
    let score = 0;

    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;


    const width = (score / 4) * 100;
    strengthBar.style.width = `${width}%`;

    if (score < 2) {
        strengthBar.style.backgroundColor = "#e94560";
        strengthText.innerText = "Weak";
    } else if (score < 4) {
        strengthBar.style.backgroundColor = "#f39c12";
        strengthText.innerText = "Medium";
    } else {
        strengthBar.style.backgroundColor = "#2ecc71";
        strengthText.innerText = "Strong!";
    }
});

function logout(){
      console.log("Logout fun");
    localStorage.setItem('DynamicPortfolioCurrentUser', '');
    location.reload()
}

document.getElementById('logForm').addEventListener('submit', (e) => {4
      console.log("Login button clicked fun");
    e.preventDefault();
  
    const email = document.getElementById('log-email').value;
    const passVal = document.getElementById('password').value;

    if (!email || !passVal) {
        alert("All Fields are required");
        return;
    }
    const user = findUser(email)
    console.log(user);

    if (!user || user == undefined) {
        alert("User Not Exist")
        return
    }
    console.log(user.password);
    
    if (user.password != passVal) {
        alert("User Credientials Not match")
        return
        
    }

    localStorage.setItem('DynamicPortfolioCurrentUser', JSON.stringify({ email}));
    localStorage.setItem('DynamicPortfolio', JSON.stringify([{ name, email, password: passVal }]));
    
    currentUser = email;
    alert(`Login Successful for ${currentUser}! Now let's build your portfolio.`);
    
    document.getElementById('admin-link').classList.remove('hidden');
    document.getElementById('port-link').classList.remove('hidden');

    navigateTo('admin-panel');
    renderEditPage()
});

document.getElementById('regForm').addEventListener('submit', (e) => {
    console.log("Registration button clicked fun");
    e.preventDefault();
    const name = document.getElementById('fullNameInput').value;
    const email = document.getElementById('email').value;
    const passVal = document.getElementById('passwordInput').value;
    
    if (strengthText.innerText !== "Strong!") {
        alert("Please enter a strong password based on the criteria.");
        return;
    }
    
    if (!name || !email || !passVal) {
        alert("All Fields are required");
        return;
    }
    const user = findUser(email)
    
    if (user) {
        alert("User Alredy Exist")
        return
    }
    
    
    localStorage.setItem('DynamicPortfolioCurrentUser', JSON.stringify({ email}));
    localStorage.setItem('DynamicPortfolio', JSON.stringify([{ name, email, password: passVal }]));

    currentUser = email;
    alert(`Registration Successful for ${currentUser}! Now let's build your portfolio.`);

    
    document.getElementById('admin-link').classList.remove('hidden');
    document.getElementById('port-link').classList.remove('hidden');


    navigateTo('admin-panel');
    renderEditPage()
});


function saveName() {
    const name = document.getElementById('nameInp').value;
    if (name.trim() === "") {
        alert("Please write something first.");
        return;
    }
    let user = findUser(currentUser);
    user.name = name
    console.log("pre user = ",user);

    findUserAndUpdate(user.email, user)
    alert("Name Saved Successfully!");
}
function saveAboutInfo() {
    const aboutText = document.getElementById('aboutMeInput').value;
    if (aboutText.trim() === "") {
        alert("Please write something first.");
        return;
    }

    let user = findUser(currentUser);
    user.about = aboutText
    console.log("pre user = ",user);

    findUserAndUpdate(user.email, user)
    alert("About Info Saved Successfully!");

    const btn = document.querySelector('#admin-panel .btn-secondary');
    btn.innerText = "Saved ✓";
    setTimeout(() => btn.innerText = "Save About Info", 2000);
}


window.addEventListener('DOMContentLoaded', () => {
      console.log("DOM CONTENT FUN fun");
    let user = findUser(currentUser)
    console.log("===",user);
    
    const storedName = user?.name;
    if (storedName) {
        document.getElementById('admin-link').classList.remove('hidden');
        document.getElementById('port-link').classList.remove('hidden');
        document.getElementById('reg-link').classList.add('hidden');
        document.getElementById('log-link').classList.add('hidden');
        document.getElementById('logout-link').classList.remove('hidden');

        const storedAbout = user?.about || '';
        if (storedAbout) document.getElementById('aboutMeInput').value = storedAbout;
        renderAdminSkillList();
    }
});

function addNewSkill() {
    const skillInput = document.getElementById('skillInput');
    const skillValue = skillInput.value.trim();

    if (skillValue && !skillsArray.includes(skillValue)) {
        skillsArray.push(skillValue);

        updateSkillsStorage();
        skillInput.value = '';
        renderAdminSkillList();
    } else if (skillsArray.includes(skillValue)) {
        alert("Skill already exists!");
    }
}


function deleteSkill(skillToDelete) {
    skillsArray = skillsArray.filter(skill => skill !== skillToDelete);
    updateSkillsStorage();
    renderAdminSkillList();
}


function updateSkillsStorage() {
    let user = findUser(currentUser)
    if (!user) {
        alert("User Not Found")
        return
    }
    user.skills = skillsArray
    findUserAndUpdate(user.email, user)
    
}

function renderAdminSkillList() {
    console.log();
    
    const listContainer = document.getElementById('adminSkillList');
    listContainer.innerHTML = '';

    skillsArray.forEach(skill => {

        const li = document.createElement('li');
        li.innerHTML = `
            <span>${skill}</span>
            <span class="delete-skill" onclick="deleteSkill('${skill}')"><i class="fas fa-trash"></i></span>
        `;
        listContainer.appendChild(li);
    });
}

function renderEditPage(){
    console.log("render Edit Page fun");
    const user = findUser(currentUser)
    console.log(user);
    
    document.querySelector('#admin-panel #nameInp').value = user?.name
    document.querySelector('#admin-panel #aboutMeInput').value = user?.about || ''
}

function loadPortfolioDataView() {
    console.log("load portfolio data view FUN");
    
    let user = findUser(currentUser)
    console.log(user);
    
    const storedName = user?.name;
    const storedAbout = user.about;

    const portNameH1 = document.getElementById('port-name');
    if (storedName) {
        portNameH1.innerText = storedName;
    }

    const portAboutP = document.getElementById('port-about-text');
    if (storedAbout) {
        portAboutP.innerText = storedAbout;
        portAboutP.classList.remove('placeholder-text');
    }


    const skillsContainer = document.getElementById('port-skills-container');

    if (skillsArray.length > 0) {
        skillsContainer.innerHTML = '';

        skillsArray.forEach(skill => {

            const badge = document.createElement('span');
            badge.className = 'skill-badge';
            badge.innerText = skill;

            skillsContainer.appendChild(badge);
        });
    } else {

        skillsContainer.innerHTML = '<span class="placeholder-text">No skills added yet. Go to Edit Profile.</span>';
    }
}



const findUser = (email) => {
    let users = JSON.parse(localStorage.getItem('DynamicPortfolio'));
    if (!users) {
        alert("User list empty")
        return
    }
    let user = ''
    users.filter((u) => {
        if (u.email == email) {
            user=u;
        }
    })
    if (user) {
        console.log("founded user= ", user);
        return user
    } else {
        return null
    }
}
const findUserAndUpdate = (email, userData) => {
    let users = JSON.parse(localStorage.getItem('DynamicPortfolio')) || [];

    const index = users.findIndex(u => u.email === email);

    if (index !== -1) {
        users[index] = {
            ...users[index],   // purana data
            ...userData        // naya data overwrite
        };
    }

    localStorage.setItem('DynamicPortfolio', JSON.stringify(users));
}