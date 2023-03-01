import { Switch, Route } from "react-router-dom";
import Login from "../components/Views/Login";
import Register from "../components/Views/Register";
import Users from "../components/Views/Users";
import PrivateRoutes from "./PrivateRoutes";
import Role from "../components/Views/Role";
import RoleGroup from "../components/Views/RoleGroup";
import Project from "../components/Views/Project/Project";
import AddNewPatient from "../components/Views/Project/AddNewPatient";
import EditPatient from "../components/Views/Project/EditPatient";
import Home from "../components/Views/Home";

const AppRoutes = (props) => {

    return (
        <>
            <Switch>
                <PrivateRoutes path="/project" component={Project} />
                <PrivateRoutes path="/addnewpatient" component={AddNewPatient} />
                <PrivateRoutes path="/editpatient" component={EditPatient} />
                <PrivateRoutes path="/users" component={Users} />
                <PrivateRoutes path="/roles" component={Role} />
                <PrivateRoutes path="/rolebygroup" component={RoleGroup} />
                <PrivateRoutes path="/home" component={Home} />

                {/* <Route exact path="/">
                    <Home />
                </Route> */}
                <Route path="/login">
                    <Login />
                </Route>
                <Route path="/register">
                    <Register />
                </Route>
                <Route path="*">
                    404 not found
                </Route>
            </Switch>
        </>
    )
}
export default AppRoutes;