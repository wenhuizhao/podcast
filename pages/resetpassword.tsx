import ResetPasswordRequest from "@/components/ResetPasswordRequest"

export default function ResetPassword() {

    return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <header className="bg-white shadow-md">
        <nav className="container mx-auto p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-700">
            Audio to Video Converter
          </h1>
          <ul className="flex space-x-8">
            <li>
              <a href="#" className="text-blue-600 hover:text-blue-800">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-600 hover:text-blue-800">
                Gallery
              </a>
            </li>
            {/* <li>
              <a href="#" className="text-blue-600 hover:text-blue-800" onClick={handleShowLogin}>
                Login
              </a>
            </li> */}
          </ul>
        </nav>
      </header>
      <main className="flex flex-grow flex-col container mx-auto p-2 flex flex-col items-center">
        <h2 className="text-2xl font-semibold text-center text-blue-700 mb-6">
          Reset password
        </h2>
        <ResetPasswordRequest />
    </main>
    </div>
    )
}
