import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user from localStorage", e);
                localStorage.removeItem('user'); // 清除无效数据
            }
        }
        setLoading(false);
    }, []); // 空数组表示只在组件挂载时运行一次

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const authContextValue = {
        user,
        login,
        logout,
        loading
    };

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


