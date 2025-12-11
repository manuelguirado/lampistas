import type { UserType } from "../types/userType";

export function getAccessTokenKey(userType: UserType): string | null {
    const tokenMap : Record<UserType, string> = {
        admin: 'adminToken',
        company: 'companyToken',
        user: 'userToken',
        worker: 'workerToken'
    };
    const token = localStorage.getItem(tokenMap[userType]) || null;
 
    return token; 
}

export function getRefreshTokenKey(userType: UserType): string | null {
    const refreshTokenMap : Record<UserType, string> = {
        admin: 'adminRefreshToken',
        company: 'companyRefreshToken',
        user: 'userRefreshToken',
        worker: 'workerRefreshToken'
    };
    const token = localStorage.getItem(refreshTokenMap[userType]) || null;
  
    return token;  
}

export function getIdKey(userType: UserType): string | null {
    const idMap : Record<UserType, string> = {
        admin: 'adminID',
        company: 'companyID',
        user: 'userID',
        worker: 'workerID'
    };
    const userId = localStorage.getItem(idMap[userType]) || null;
   
    return userId;  
}

export function setTokens(userType: UserType, accessToken: string, refreshToken: string, userID: number): void {
    const tokenMap: Record<UserType, { access: string; refresh: string; id: string }> = {
        company: { access: 'companyToken', refresh: 'companyRefreshToken', id: 'companyID' },
        user: { access: 'userToken', refresh: 'userRefreshToken', id: 'userID' },
        worker: { access: 'workerToken', refresh: 'workerRefreshToken', id: 'workerID' },
        admin: { access: 'adminToken', refresh: 'adminRefreshToken', id: 'adminID' }
    };
    
  
    localStorage.setItem(tokenMap[userType].access, accessToken);
    localStorage.setItem(tokenMap[userType].refresh, refreshToken);
    localStorage.setItem(tokenMap[userType].id, userID.toString());  // ✅ También guardar el ID
}

export function getLoginRoute(userType: UserType): string {
    const routeMap : Record<UserType, string> = {
        admin: '/admin/adminLogin',
        company: '/company/CompanyLogin',
        user: '/user/userLogin',
        worker: '/worker/workerLogin'
    };
    return routeMap[userType] || '/';
}
