"use client";

import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050302] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF9800]/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#D32F2F]/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#F5E6D3] tracking-tighter mb-2">
                        SPEEDLIGHT <span className="text-[#FF9800]">CULTURE</span>
                    </h1>
                    <p className="text-[#BCAAA4] text-sm">Ingresa a tu garaje digital.</p>
                </div>

                <SignIn
                    routing="path"
                    path="/sign-in"
                    appearance={{
                        elements: {
                            rootBox: "w-full",
                            card: "bg-[#1A0F08] border border-[#2C1810] shadow-xl w-full",
                            headerTitle: "text-[#F5E6D3]",
                            headerSubtitle: "text-[#BCAAA4]",
                            socialButtonsBlockButton: "text-[#F5E6D3] border-[#2C1810] hover:bg-[#2C1810]",
                            socialButtonsBlockButtonText: "text-[#F5E6D3]",
                            dividerLine: "bg-[#2C1810]",
                            dividerText: "text-[#BCAAA4]",
                            formFieldLabel: "text-[#F5E6D3]",
                            formFieldInput: "bg-[#050302] border-[#2C1810] text-[#F5E6D3]",
                            footerActionText: "text-[#BCAAA4]",
                            footerActionLink: "text-[#FF9800] hover:text-[#FFEB3B]",
                            // Hide potential branding if possible via class (though usually protected)
                            logoImage: "hidden", // Hide default logo to use ours
                        },
                        variables: {
                            colorPrimary: "#FF9800",
                            colorBackground: "#1A0F08",
                            colorText: "#F5E6D3",
                            colorInputBackground: "#050302",
                            colorInputText: "#FFF8F0"
                        }
                    }}
                />
            </div>
        </div>
    );
}
