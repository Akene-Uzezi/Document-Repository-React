const Login = () => {
  return (
    <div className="bg-slate-50 flex items-center justify-center min-h-screen">
      <div className="bg-white p-10 border border-slate-200 rounded-xl shadow-sm w-full max-w-md">
        <header className="mb-10">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Account Login
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Enter your credentials to access your dashboard.
          </p>
        </header>

        <form action="#" method="POST" className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="block w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none text-slate-900 placeholder-slate-400"
              placeholder="name@company.com"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                Password
              </label>
              <a
                href="#"
                className="text-xs font-bold text-blue-700 hover:underline"
              >
                Forgot?
              </a>
            </div>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="block w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none text-slate-900 placeholder-slate-400"
              placeholder="••••••••"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-slate-900 text-white font-bold rounded-md hover:bg-black active:bg-slate-800"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
