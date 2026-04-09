import { Admin, Resource, CustomRoutes } from 'react-admin';
import { Route } from 'react-router-dom';
import dataProvider from '../dataProvider.js';
import authProvider from '../admin/authProvider.js';
import { OrderList, OrderCreate, OrderEdit, OrderShow } from '../admin/orders.js';
import { UserList, UserEdit, UserCreate, UserShow } from '../admin/users.js';
import { FoodCategoryList, FoodCategoryEdit, FoodCategoryCreate } from '../admin/foodCategories.js';
import { FoodItemList, FoodItemEdit, FoodItemCreate } from '../admin/foodItems.js';
import { CartList, CartShow } from '../admin/carts.js';
import Dashboard from '../admin/Dashboard.js';
import MyLayout from '../admin/MyLayout.js';
import Analytics from '../admin/Analytics';

export default function AdminPanel() {
  return (
    <Admin basename="/admin" dataProvider={dataProvider} authProvider={authProvider} layout={MyLayout} dashboard={Dashboard}>
      <CustomRoutes>
        <Route path="/analytics" element={<Analytics />} />
      </CustomRoutes>
      <Resource name="foodItems" list={FoodItemList} edit={FoodItemEdit} create={FoodItemCreate} />
      <Resource name="foodCategories" list={FoodCategoryList} edit={FoodCategoryEdit} create={FoodCategoryCreate} />
      <Resource name="orders" list={OrderList} edit={OrderEdit} create={OrderCreate} show={OrderShow} />
      <Resource name="users" list={UserList} edit={UserEdit} create={UserCreate} show={UserShow} />
      <Resource name="carts" list={CartList} show={CartShow} />
    </Admin>
  );
}