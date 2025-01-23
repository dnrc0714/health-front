import React from "react"

export default function Footer() {

    return (
        <footer className="bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-500 text-white p-4 w-full fixed bottom-0 left-0 z-50 shadow-md">
            <div className="text-center">
                © {new Date().getFullYear()} CB HEALTH COMMUNITY. All rights reserved.
            </div>
        </footer>
    );
}