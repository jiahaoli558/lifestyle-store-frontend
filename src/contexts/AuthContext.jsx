import React, { createContext, useState, useEffect, useContext } from 'react';

// 创建认证上下文
export const AuthContext = createContext(null);

// 认证提供者组件
export const AuthProvider = ({ children }) => {
    // user 状态将存储当前登录的用户信息，如果未登录则为 null
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // 用于指示认证状态是否已加载

    useEffect(() => {
        // 组件加载时，尝试从 localStorage 获取用户信息
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
    }, []);

    // 登录函数：设置用户状态并保存到 localStorage
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    // 退出登录函数：清除用户状态并从 localStorage 移除
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    // 提供给子组件的值
    const authContextValue = {
        user,
        login,
        logout,
        loading // 暴露加载状态，以便在认证信息加载完成前可以显示加载动画
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {/* 如果还在加载认证状态，可以显示一个加载指示器 */}
            {loading ? <div>加载认证信息...</div> : children}
        </AuthContext.Provider>
    );
};

// 自定义 Hook，方便在组件中使用认证上下文
export const useAuth = () => {
    return useContext(AuthContext);
};
