import Header from '../companies/components/header';
import { Outlet } from 'react-router';
import { useTranslation } from "react-i18next";

export default function DashboardCompany() {
    const { t } = useTranslation("companies.dashboardCompany");
    return (
        <div >
            <Header />
            <main className='p-4'>
            <h2 className='text-2xl font-bold p-20 text-amber-800'>{t("titulo")}</h2>
            <Outlet />
            </main>
        

        </div>
    );
}
        