import { useRef, useState } from "react";
import type Quill from "quill";
import Header from "./components/header";

import Editor from "./components/Editor";
import api from "../../api/intercepttors";
import { useTranslation } from "react-i18next";
export default function CreateNewsLetter() {
    const { t } = useTranslation("admin.createNewsLetterPage");
    const quillRef = useRef<Quill | null>(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const editorText = quillRef.current?.getText().trim() ?? "";
        if (!title.trim() || !editorText) {
            alert(t("validation"));
            return;
        }

        api
            .post("/mailing/sendNewsletter", { title, content })
            .then(() => {
                alert(t("success"));
                setTitle("");
                setContent("");
                quillRef.current?.setText("");
            })
            .catch(error => {
                alert(
                    t("error", { message: (error.response?.data?.message || error.message) }),
                );
            });
    }
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="container mx-auto px-4 py-8 flex-1">
                <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            {t("labelTitle")}
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="mt-1 block w-full rounded-md border  border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">{t("labelContent")}</label>
                        <Editor
                            ref={quillRef}
                            onTextChange={() => {
                                const html = quillRef.current?.root.innerHTML ?? "";
                                setContent(html);
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {t("submit")}
                    </button>
                </form>
            </main>
            
        </div>
    );
}