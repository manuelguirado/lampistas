import type { UserType } from "../types/userType";
export function getAccessTokenKey(userType: UserType): string | null {
    const tokenMap : Record<UserType, string> = {
        admin: 'adminToken',
        company: 'companyToken',
        user: 'userToken',
        worker: 'workerToken'
    };
    return tokenMap[userType] || null;
}
export function getRefreshTokenKey(userType: UserType): string | null {
    const refreshTokenMap : Record<UserType, string> = {
        admin: 'adminRefreshToken',
        company: 'companyRefreshToken',
        user: 'userRefreshToken',
        worker: 'workerRefreshToken'
    };
    return refreshTokenMap[userType] || null;
}
export function getIdKey(userType: UserType): string | null {
    const idMap : Record<UserType, string> = {
        admin: 'adminID',
        company: 'companyID',
        user: 'userID',
        worker: 'workerID'
    };
    return idMap[userType] || null;
}
export function setTokens(userType: UserType, accessToken: string, refreshToken: string, userID: number): void {
   
    
    const tokenMap: Record<UserType, { access: string; refresh: string }> = {
    company: { access: 'companyToken', refresh: 'companyRefreshToken' },
    user: { access: 'userToken', refresh: 'userRefreshToken' },
    worker: { access: 'workerToken', refresh: 'workerRefreshToken' },
    admin: { access: 'adminToken', refresh: 'adminRefreshToken' }
  };
   localStorage.setItem(tokenMap[userType].access, accessToken);
  localStorage.setItem(tokenMap[userType].refresh, refreshToken);
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
