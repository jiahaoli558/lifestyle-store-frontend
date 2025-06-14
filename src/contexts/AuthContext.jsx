import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('AuthContext useEffect: Initializing user from localStorage...'); // 新增
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                console.log('AuthContext useEffect: User loaded from localStorage:', parsedUser); // 新增
            } catch (e) {
                console.error("AuthContext useEffect: Failed to parse user from localStorage", e); // 新增
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
        console.log('AuthContext useEffect: Loading finished.'); // 新增
    }, []);

    const login = (userData) => {
        console.log('AuthContext login function: Called with userData:', userData); // 新增
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('AuthContext login function: User state set to:', userData); // 新增
        console.log('AuthContext login function: localStorage "user" set to:', localStorage.getItem('user')); // 新增
    };

    const logout = () => {
        console.log('AuthContext logout function: Called.'); // 新增
        setUser(null);
        localStorage.removeItem('user');
        console.log('AuthContext logout function: User state cleared.'); // 新增
    };

    const authContextValue = {
        user,
        login,
        logout,
        loading
    };

    console.log('AuthContext Provider: Rendering with current user:', user); // 新增

    return (
        <AuthContext.Provider value={authContextValue}>
            {/* 如果还在加载认证状态，可以显示一个加载指示器 */}
            {loading ? <div>加载认证信息...</div> : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

