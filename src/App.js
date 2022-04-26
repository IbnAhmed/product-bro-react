import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";
import ProductDetail from "./pages/product-detail/product-detail";
import Home from "./pages/home/home";
import MenuBar from "./common/menubar/menubar";
import NotFound from "./pages/not-found/not-found";
import SignIn from './pages/sign-in/sign-in';
import EditProduct from './pages/edit-product/edit-product';
import CreateProduct from './pages/create-product/create-product';

function App() {

  // const token = localStorage.getItem('token');
  // const auth_user = JSON.parse(localStorage.getItem('auth_user'));
  
  return (
    <Router>
      <div className="max-w-7xl mx-auto px-4 sm:px-6  border border-gray-200 m-6">
        <ToastContainer />
        <MenuBar></MenuBar>
        <Switch>
          <Route path="/not-found">
            <NotFound />
          </Route>
          <Route path="/products/create" exact>
            <CreateProduct />
          </Route>
          <Route path="/products/:id/edit" exact>
            <EditProduct />
          </Route>
          <Route path="/products/:id" exact>
            <ProductDetail />
          </Route>
          <Route path="/sign-in">
            <SignIn />
          </Route>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route>
            <Redirect to="/not-found" />
            {/* <NotFound /> */}
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
