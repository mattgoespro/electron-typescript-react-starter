import { Navigate, RouteObject, createHashRouter } from "react-router-dom";

const routes: RouteObject[] = [
  {
    path: "/",
    Component: () => (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "start",
          textAlign: "center",
          marginTop: "20%",
          width: "80%",
          height: "100%",
          fontSize: "3rem",
          fontFamily: "sans-serif"
        }}
      >
        Electron Typescript React Starter
      </div>
    ),
    children: [
      {
        index: true,
        path: "*",
        id: "App",
        element: <Navigate to="/" />
      }
    ]
  }
];

export const Router = createHashRouter(routes);
