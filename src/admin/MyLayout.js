import { Layout } from 'react-admin';
import React from 'react';
import MyAppBar from './MyAppBar.js';
import MySidebar from './MySidebar.js';


const MyLayout = (props) => (
  <Layout {...props} appBar={MyAppBar} sidebar={MySidebar} />
);

export default MyLayout;
