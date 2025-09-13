import React, {createContext, useState, useContext } from 'react';

//สร้าง Context
const AuthContext = createContext();

//ส้ราง Provider
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [password, setpassword] = useState(null);

    //ส้ราง function สำหรับ login
    const login = (email, password) => {
        setUser( email );
        setpassword( password );
        console.log("context login =>", user, password);
    };

    return (
        <AuthContext.Provider value={{ user, password, login }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
