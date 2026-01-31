const sessionIdToUserMap = new Map();

function setUser(id,user){
    sessionIdToUserMap.set(id,user);
}

function getUesr(id){
    return sessionIdToUserMap.get(id);
}

module.exports = {
    setUser, 
    getUesr,
};