import { useState } from "react";
import { useNavigate } from "react-router";

export default function EditMachinery() {
    const [formData, setFormData] = useState({
        lastInspectionDate: "",
    })
    const navigate = useNavigate();
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const token = localStorage.getItem("companyToken");
        fetch(`http://localhost:3000/company/`, {
            method: "PATCH",