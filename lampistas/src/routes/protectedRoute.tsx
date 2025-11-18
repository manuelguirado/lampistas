import {Navigate} from 'react-router-dom';
import type { UserType } from '../types/userType';
import type  { ReactNode } from 'react';

const  ProtectedRoute =  ({userType, children }: { userType: UserType; children: ReactNode }) => {
    const tokenKey = userType === 'admin' ? 'adminToken' :
                     userType === 'company' ? 'companyToken' :
                     userType === 'user' ? 'userToken' :
                     userType === 'worker' ? 'workerToken' : null;

    const token = tokenKey ? localStorage.getItem(tokenKey) : null;

    if (!token) {
        return <Navigate to={`/${userType}/${userType}Login`} replace />;
    }

    return <>{children}</>;
};
export default ProtectedRoute;