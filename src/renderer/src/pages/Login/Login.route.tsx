import { ActionFunction, LoaderFunction } from "react-router-dom";
<<<<<<< HEAD:src/renderer/src/pages/Login/Login.route.tsx
import LoginPage from "./Login.component";
=======
// import { withDynamicPages } from "../../hocs/withDynamicImport";
import Login from "./Login";
>>>>>>> 4a512eb (refactor(store): ♻️ restructure the Redux store for project management):src/renderer/src/pages/LoginPage/Login.route.tsx

export const loader: LoaderFunction | undefined =
    async () => null;

export const action: ActionFunction | undefined =
    undefined;

<<<<<<< HEAD:src/renderer/src/pages/Login/Login.route.tsx
export const element: React.ReactElement = <LoginPage />
=======
export const element: React.ReactElement = <Login />
// withDynamicPages({ pageName: 'LoginPage', loader: <></> })
>>>>>>> 4a512eb (refactor(store): ♻️ restructure the Redux store for project management):src/renderer/src/pages/LoginPage/Login.route.tsx
