import AuthForm from './auth-form'

export default function LoginPage() {
    return (
        <div className="min-h-screen grid place-items-center bg-black relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f0f] to-[#050505]"></div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px]"></div>

            <div className="relative z-10 w-full flex justify-center px-4">
                <AuthForm />
            </div>
        </div>
    )
}
